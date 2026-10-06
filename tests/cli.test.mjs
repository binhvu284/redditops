import test from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';
import path from 'node:path';
import {mkdirSync,mkdtempSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {ConfigError,resolveConfig,run,start} from '../app/launcher.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const version=JSON.parse((await import('node:fs')).readFileSync(path.join(root,'package.json'),'utf8')).version;
const qa=prefix=>{mkdirSync(path.join(root,'.qa'),{recursive:true});return mkdtempSync(path.join(root,'.qa',prefix));};
const capture=()=>{const out=[],err=[],codes=[];return {out,err,codes,io:{log:m=>out.push(m),error:m=>err.push(m),exit:c=>codes.push(c)}};};

test('redditops configuration: defaults, cloud environment, flags and public-exposure guard',()=>{
 const local=resolveConfig([],{});assert.equal(local.command,'start');assert.equal(local.port,4317);assert.equal(local.host,'127.0.0.1');assert.equal(local.origin,null);assert.equal(local.dataDir,path.join(root,'data'));
 assert.equal(resolveConfig([],{PORT:'8080'}).port,8080,'cloud PORT is honoured');
 assert.equal(resolveConfig([],{PORT:'8080',REDDIT_OPS_PORT:'9000'}).port,9000);
 assert.equal(resolveConfig(['--port=5000'],{REDDIT_OPS_PORT:'9000'}).port,5000,'flags override environment');
 assert.equal(resolveConfig(['start','--port','5001','--data-dir','custom'],{}).dataDir,path.resolve('custom'));
 const cloud=resolveConfig([],{PORT:'10000',REDDIT_OPS_ORIGIN:'https://ops.example.com',REDDIT_OPS_DATA_DIR:'/var/data/redditops'});
 assert.equal(cloud.host,'0.0.0.0','a public HTTPS origin listens on all interfaces');assert.equal(cloud.origin,'https://ops.example.com');assert.equal(cloud.dataDir,path.resolve('/var/data/redditops'));
 assert.equal(resolveConfig(['--host','localhost'],{}).host,'127.0.0.1');
 for(const [argv,env,pattern] of [[['--host','0.0.0.0'],{},/expose Reddit Ops/],[[],{REDDIT_OPS_HOST:'192.168.1.20'},/expose Reddit Ops/],[[],{REDDIT_OPS_ORIGIN:'http://ops.example.com'},/https/],[[],{REDDIT_OPS_ORIGIN:'not a url'},/full HTTPS address/],[['--port','70000'],{},/Port/],[['--port','abc'],{},/Port/],[['--bogus'],{},/Unknown option/],[['--port'],{},/Missing value/],[['deploy'],{},/Unknown command/]])assert.throws(()=>resolveConfig(argv,env),err=>err instanceof ConfigError&&pattern.test(err.message),JSON.stringify(argv));
 assert.equal(resolveConfig(['--help'],{}).command,'help');assert.equal(resolveConfig(['-v'],{}).command,'version');assert.equal(resolveConfig(['setup-key'],{}).command,'setup-key');
});

test('redditops start serves the app, reports first setup and setup-key; busy port gives guidance',async()=>{
 const dataDir=qa('cli-');const signals=[];const logs=[];
 const app=await start({port:0,host:'127.0.0.1',origin:null,dataDir},{log:m=>logs.push(m),onSignal:(name,fn)=>signals.push(name),exit:()=>{}});
 try{
  const url=logs[0].replace('Reddit Ops is running: ','');assert.match(url,/^http:\/\/127\.0\.0\.1:\d+$/);
  assert.equal((await fetch(url+'/')).status,200);assert.equal((await fetch(url+'/api/bootstrap')).status,200);
  assert.match(logs.join('\n'),/First setup: .*redditops setup-key/);assert.deepEqual(signals,['SIGINT','SIGTERM']);
  const key=capture();await run(['setup-key','--data-dir',dataDir],{env:{},...key.io});assert.equal(key.out.length,1);assert.match(key.out[0],/^\S{16,}$/,'prints only the key');
  const blocker=net.createServer();await new Promise(r=>blocker.listen(0,'127.0.0.1',r));const busy=blocker.address().port;
  try{const out=capture();await run(['--port',String(busy),'--data-dir',qa('cli-busy-')],{env:{},...out.io});assert.deepEqual(out.codes,[1]);assert.match(out.err.join('\n'),new RegExp(`Port ${busy} is already in use`));}
  finally{await new Promise(r=>blocker.close(r));}
 }finally{await app.close();}
 const none=capture();await run(['setup-key','--data-dir',qa('cli-empty-')],{env:{},...none.io});assert.match(none.out[0],/no setup key is pending/);
 const bad=capture();await run(['--host','0.0.0.0'],{env:{},...bad.io});assert.deepEqual(bad.codes,[2]);assert.match(bad.err[0],/REDDIT_OPS_ORIGIN/);assert.match(bad.err[0],/Usage:/);
 const help=capture();await run(['--help'],{env:{},...help.io});assert.match(help.out[0],/redditops setup-key/);
});

test('cloud mode: public HTTPS origin governs Host and Origin checks',async()=>{
 const http=await import('node:http');
 // Loopback keeps the test free of firewall prompts; cloud hosts use 0.0.0.0 with the same origin rules.
 const app=await start({port:0,host:'127.0.0.1',origin:'https://ops.example.test',dataDir:qa('cli-cloud-')},{log:()=>{},onSignal:()=>{},exit:()=>{}});
 const port=app.server.address().port;
 const get=(host,p='/api/bootstrap')=>new Promise((resolve,reject)=>{const req=http.request({host:'127.0.0.1',port,path:p,headers:{Host:host}},res=>{res.resume();res.on('end',()=>resolve(res));});req.on('error',reject);req.end();});
 try{
  assert.equal((await get('ops.example.test')).statusCode,200,'public host accepted');
  assert.equal((await get(`127.0.0.1:${port}`)).statusCode,403,'direct address rejected when a public origin is set');
  const login=await new Promise((resolve,reject)=>{const req=http.request({host:'127.0.0.1',port,path:'/api/login',method:'POST',headers:{Host:'ops.example.test',Origin:'https://ops.example.test','Content-Type':'application/json'}},res=>{res.resume();res.on('end',()=>resolve(res));});req.on('error',reject);req.end('{"email":"nobody@example.invalid","password":"wrong-password-123"}');});
  assert.notEqual(login.statusCode,403,'browser origin matching the public origin passes the Origin check');
 }finally{await app.close();}
});

test('redditops entry points: any folder, inside the checkout, npm start path and node app/server.mjs',()=>{
 const outside=qa('cli-cwd-');
 for(const [cwd,args] of [[outside,['bin/redditops.mjs','--version']],[path.join(root,'docs'),['bin/redditops.mjs','--version']],[root,['app/server.mjs','--version']]]){
  const result=spawnSync(process.execPath,[path.join(root,args[0]),...args.slice(1)],{cwd,encoding:'utf8',timeout:20000});
  assert.equal(result.status,0,result.stderr);assert.equal(result.stdout.trim(),version);
 }
 const refused=spawnSync(process.execPath,[path.join(root,'bin/redditops.mjs'),'--host','0.0.0.0'],{cwd:outside,encoding:'utf8',timeout:20000});
 assert.equal(refused.status,2);assert.match(refused.stderr,/REDDIT_OPS_ORIGIN/);assert.equal(existsSync(path.join(outside,'data')),false,'a refused start creates no data');
});

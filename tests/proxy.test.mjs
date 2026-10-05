import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import {readFileSync,mkdirSync,mkdtempSync} from 'node:fs';
import path from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';
import {probeProxy,proxyObservation,publicAddress} from '../app/proxy.mjs';
import {createApp} from '../app/server.mjs';
import {AppError} from '../app/domain.mjs';
import {unseal} from '../app/security.mjs';
const fixtures={key:readFileSync(new URL('./fixtures/proxy-test-key.pem',import.meta.url)),cert:readFileSync(new URL('./fixtures/proxy-test-cert.pem',import.meta.url))};
const listen=async server=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));return server.address().port;};
const close=async server=>{server.closeAllConnections?.();await new Promise(r=>server.close(r));};

test('SSRF guard rejects reserved addresses and mixed DNS; all stages have a deadline',async()=>{
 for(const address of ['127.0.0.1','10.0.0.1','172.31.1.2','169.254.169.254','192.168.1.1','100.64.1.1','192.0.2.1','198.51.100.1','203.0.113.1','0.0.0.0','224.0.0.1','::1','fe80::1','fc00::1','::ffff:127.0.0.1','2001:db8::1','2001:0000::1','2001:0100::1','2002:7f00:1::1','3fff::1'])assert.equal(publicAddress(address),false,address);
 assert.equal(publicAddress('8.8.8.8'),true);assert.equal(publicAddress('2606:4700:4700::1111'),true);
 await assert.rejects(probeProxy({endpoint:'http://localhost:8080'}),{code:'PROXY_DESTINATION'});
 await assert.rejects(probeProxy({endpoint:'http://mixed.invalid:8080'},{},{resolve:async()=>[{address:'8.8.8.8',family:4},{address:'127.0.0.1',family:4}]}),{code:'PROXY_DESTINATION'});
 await assert.rejects(probeProxy({endpoint:'http://timeout.invalid:8080'},{},{timeoutMs:40,resolve:()=>new Promise(()=>{})}),{code:'PROXY_TIMEOUT'});
});

test('HTTP/HTTPS CONNECT and SOCKS5 use the proxy tunnel, verify TLS and sanitize errors',async()=>{
 let targetHits=0,mode='valid',authSeen=false;const sockets=new Set();
 const track=server=>server.on('connection',s=>{sockets.add(s);s.on('close',()=>sockets.delete(s));});
 const target=https.createServer(fixtures,(req,res)=>{targetHits++;assert.equal(req.headers['proxy-authorization'],undefined);res.writeHead(mode==='redirect'?302:200,{'Content-Type':'text/plain',Location:'http://127.0.0.1/'});res.end(mode==='invalid'?'not a trace':mode==='large'?'x'.repeat(9000):'ip=8.8.8.8\nloc=US\n');});track(target);const targetPort=await listen(target);
 const tunnel=(req,client,head)=>{authSeen=req.headers['proxy-authorization']=== 'Basic '+Buffer.from('fixture-user:fixture-password').toString('base64');if(mode==='auth'){client.end('HTTP/1.1 407 Proxy Authentication Required\r\nContent-Length: 0\r\n\r\n');return;}if(mode==='hang')return;assert.equal(req.url,'localhost:'+targetPort);const remote=net.connect(targetPort,'127.0.0.1',()=>{client.write('HTTP/1.1 200 Connection established\r\n\r\n');if(head.length)remote.write(head);client.pipe(remote).pipe(client);});sockets.add(remote);remote.on('close',()=>sockets.delete(remote));remote.on('error',()=>client.destroy());client.on('error',()=>remote.destroy());client.on('close',()=>remote.destroy());};
 const proxy=http.createServer();proxy.on('connect',tunnel);track(proxy);const port=await listen(proxy);
 const tlsProxy=https.createServer(fixtures);tlsProxy.on('connect',tunnel);track(tlsProxy);const securePort=await listen(tlsProxy);
 const socks=net.createServer(client=>{let stage=0,bytes=Buffer.alloc(0);const data=chunk=>{bytes=Buffer.concat([bytes,chunk]);while(bytes.length){if(stage===0){if(bytes.length<3)return;assert.equal(bytes[0],5);const method=bytes[2];bytes=bytes.subarray(3);client.write(Buffer.from([5,method]));stage=method===2?1:2;}else if(stage===1){if(bytes.length<2)return;const n=bytes[1];if(bytes.length<n+3)return;const k=bytes[n+2];if(bytes.length<n+3+k)return;assert.equal(bytes.subarray(2,2+n).toString(),'fixture-user');assert.equal(bytes.subarray(n+3,n+3+k).toString(),'fixture-password');bytes=bytes.subarray(n+3+k);client.write(Buffer.from([1,0]));stage=2;}else{if(bytes.length<5)return;const n=bytes[4];if(bytes.length<n+7)return;assert.equal(bytes[3],3);assert.equal(bytes.subarray(5,n+5).toString(),'localhost');assert.equal(bytes.readUInt16BE(n+5),targetPort);const head=bytes.subarray(n+7);client.off('data',data);const remote=net.connect(targetPort,'127.0.0.1',()=>{client.write(Buffer.from([5,0,0,1,127,0,0,1,0,0]));if(head.length)remote.write(head);client.pipe(remote).pipe(client);});sockets.add(remote);remote.on('close',()=>sockets.delete(remote));remote.on('error',()=>client.destroy());client.on('close',()=>remote.destroy());return;}}};client.on('data',data);client.on('error',()=>{});});track(socks);const socksPort=await listen(socks);
 const options={target:{host:'localhost',port:targetPort,path:'/cdn-cgi/trace'},ca:fixtures.cert,resolve:async()=>[{address:'127.0.0.1',family:4}],allowAddress:address=>address==='127.0.0.1',timeoutMs:1000},credentials={username:'fixture-user',password:'fixture-password'};
 try{
  for(const endpoint of [`http://localhost:${port}`,`https://localhost:${securePort}`,`socks5://localhost:${socksPort}`]){const value=await probeProxy({endpoint},credentials,options);assert.equal(value.observedIp,'8.8.8.8');assert.equal(value.observedCountry,'US');}
  assert.equal(authSeen,true);assert.equal(targetHits,3);
  const before=targetHits;mode='auth';await assert.rejects(probeProxy({endpoint:`http://localhost:${port}`},credentials,options),{code:'PROXY_AUTH'});assert.equal(targetHits,before,'authentication failure must not issue a direct fallback');
  mode='valid';await assert.rejects(probeProxy({endpoint:`http://localhost:${port}`},credentials,{...options,ca:undefined}),{code:'PROXY_TLS'});
  for(const response of ['invalid','large','redirect']){mode=response;await assert.rejects(probeProxy({endpoint:`http://localhost:${port}`},credentials,options),{code:'PROXY_RESPONSE'});}
  mode='hang';await assert.rejects(probeProxy({endpoint:`http://localhost:${port}`},credentials,{...options,timeoutMs:60}),{code:'PROXY_TIMEOUT'});
 }finally{for(const socket of sockets)socket.destroy();await Promise.all([close(socks),close(proxy),close(tlsProxy),close(target)]);}
});

test('country/IP evidence stays explicit and first observed US IP pins without silent switching',()=>{
 const fixture={observedIp:'8.8.8.8',observedCountry:'US',latencyMs:10};const first=proxyObservation(fixture,{});assert.equal(first.status,'Available');assert.equal(first.baselineIp,'8.8.8.8');
 assert.equal(proxyObservation({...fixture,observedCountry:null},{}).status,'Unknown');assert.equal(proxyObservation({...fixture,observedCountry:'DE'},{}).checkOutcome,'wrong-country');assert.equal(proxyObservation({...fixture,observedIp:'1.1.1.1'},first).checkOutcome,'ip-changed');assert.equal(proxyObservation(fixture,{expectedIp:'1.1.1.1'}).status,'Failed');
});

test('proxy credentials, permissions, recovery, latched pause, stale evidence and in-flight edits',async()=>{
 mkdirSync('.qa',{recursive:true});const dir=mkdtempSync(path.resolve('.qa/proxy-api-'));let calls=0,result={observedIp:'8.8.8.8',observedCountry:'US',latencyMs:4},waiter=null,release;
 const password='proxy-fixture-passphrase',username='SYNTHETIC_PROXY_USER',secret='SYNTHETIC_PROXY_PASSWORD';
 let app=createApp({dataDir:dir,port:0,proxyCooldownMs:0,proxyProbe:async(p,credentials)=>{calls++;assert.equal(credentials.password,secret);assert.equal(credentials.username,username);if(waiter)await waiter;if(result instanceof Error)throw result;return result;}}),url=await app.listen(),session;
 const call=async(p,b,s=session)=>{const r=await fetch(url+'/api/'+p,{method:b===undefined?'GET':'POST',headers:{Origin:url,'Content-Type':'application/json',...(s?{Cookie:s.cookie,'X-CSRF-Token':s.csrf}:{})},body:b===undefined?undefined:JSON.stringify(b)});return {status:r.status,body:await r.json(),cookie:r.headers.get('set-cookie')};};
 const ok=async(p,b,s=session,status=200)=>{const r=await call(p,b,s);assert.equal(r.status,status,`${p}: ${JSON.stringify(r.body)}`);return r.body;};const login=async email=>{const r=await call('login',{email,password},null);return {cookie:r.cookie.split(';')[0],csrf:r.body.csrf};};
 const config={name:'Fixture US route',endpoint:'http://proxy.example.invalid:8080',authMode:'password',username,password:secret};
 try{
  await ok('setup',{name:'Thomas',email:'proxy@example.invalid',password,setupToken:readFileSync(app.store.setupFile,'utf8')},null,201);session=await login('proxy@example.invalid');
  assert.equal((await call('proxies',config)).status,403);await ok('reauth',{password});const p=await ok('proxies',config,session,201);assert.equal(p.hasCredentials,true);assert.equal(p.vault,undefined);
  assert.equal((await call('proxies/'+p.id+'/check',{})).status,400);assert.equal(calls,0);
  const a=await ok('accounts',{name:'proxy_fixture_asset',ownership:true,proxyId:p.id},session,201);await ok('accounts/'+a.id+'/evidence',{checks:[true,true,true,true,true],connection:'Good'});await ok('accounts/'+a.id+'/claim',{});
  const checked=await ok('proxies/'+p.id+'/check',{consent:true});assert.equal(checked.status,'Available');assert.equal(checked.baselineIp,'8.8.8.8');assert.equal((await ok('accounts/'+a.id)).firstVerifiedAt,null);
  const member=await ok('users',{name:'Maya',email:'proxy-member@example.invalid',password},session,201),m=await login('proxy-member@example.invalid');assert.equal((await call('proxies/'+p.id+'/check',{consent:true},m)).status,404);await ok('accounts/'+a.id+'/configure',{proxyId:p.id,assignedIds:[member.id]});
  assert.equal((await call('proxies/'+p.id+'/configure',config,m)).status,403);await ok('proxies/'+p.id+'/check',{consent:true},m);
  for(const state of [await ok('state'),await ok('state',undefined,m),await ok('accounts/'+a.id)]){assert.equal(JSON.stringify(state).includes(secret),false);assert.equal(JSON.stringify(state).includes(username),false);}
  assert.equal(readFileSync(path.join(dir,'ops.sqlite')).includes(Buffer.from(secret)),false);assert.equal(readFileSync(path.join(dir,'ops.sqlite-wal')).includes(Buffer.from(secret)),false);
  result={...result,observedIp:'1.1.1.1'};assert.equal((await ok('proxies/'+p.id+'/check',{consent:true})).checkOutcome,'ip-changed');let account=await ok('accounts/'+a.id);assert.equal(account.paused,true);assert.equal(account.lease,null);assert.notEqual(account.health.score,0);assert.equal((await call('accounts/'+a.id+'/resume',{})).status,409);
  await ok('accounts/'+a.id+'/evidence',{checks:[true,true,true,true,true],connection:'Good'});assert.equal((await call('accounts/'+a.id+'/claim',{})).status,409,'manual evidence cannot override a failed probe');
  result={...result,observedIp:'8.8.8.8'};await ok('proxies/'+p.id+'/check',{consent:true});assert.equal((await ok('accounts/'+a.id)).paused,true);await ok('accounts/'+a.id+'/resume',{});await ok('accounts/'+a.id+'/claim',{});
  const old=app.store.get('proxy',p.id);old.checkedAt='2020-01-01T00:00:00Z';app.store.put('proxy',old);assert.equal((await ok('state')).proxies[0].status,'Stale');assert.equal((await call('accounts/'+a.id+'/claim',{})).status,409);
  waiter=new Promise(r=>release=r);const pending=call('proxies/'+p.id+'/check',{consent:true});await delay(30);assert.equal((await call('proxies/'+p.id+'/check',{consent:true})).status,409);await ok('proxies/'+p.id+'/configure',{...config,endpoint:'http://other.example.invalid:8080'});release();assert.equal((await pending).body.code,'PROXY_CHANGED');waiter=null;
  assert.equal((await ok('state')).proxies[0].status,'Unknown');assert.equal((await ok('state')).proxies[0].baselineIp,'8.8.8.8');
  waiter=new Promise(r=>release=r);const memberPending=call('proxies/'+p.id+'/check',{consent:true},m);await delay(30);await ok('users/'+member.id,{});release();assert.equal((await memberPending).body.code,'PROXY_ACCESS_REVOKED');waiter=null;assert.equal((await ok('state')).proxies[0].status,'Unknown');
  const backup=await ok('backup',{passphrase:password});const fresh=mkdtempSync(path.resolve('.qa/proxy-restore-')),restored=createApp({dataDir:fresh,port:0});const original=app;await app.close();app=restored;url=await app.listen();session=null;
  await ok('setup',{name:'Thomas',email:'proxy@example.invalid',password,setupToken:readFileSync(app.store.setupFile,'utf8')},null,201);session=await login('proxy@example.invalid');await ok('reauth',{password});const preview=await ok('restore/preview',{backup,passphrase:password});await ok('restore/confirm',{previewId:preview.previewId,confirm:'RESTORE'});session=await login('proxy@example.invalid');
  assert.notDeepEqual(app.store.key,original.store.key);const recovered=app.store.get('proxy',p.id);assert.equal(unseal(recovered.vault,app.store.key,p.id).password,secret);assert.equal(recovered.monitorEnabled,false);assert.equal(recovered.status,'Unknown');assert.equal((await ok('accounts/'+a.id)).paused,true);
 }finally{release?.();await app.close();}
});

test('monitoring is opt-in, emits scoped account audit, and stops on shutdown',async()=>{
 mkdirSync('.qa',{recursive:true});const dir=mkdtempSync(path.resolve('.qa/proxy-monitor-'));let calls=0;const app=createApp({dataDir:dir,port:0,monitorIntervalMs:40,proxyCooldownMs:0,proxyProbe:async()=>{calls++;throw new AppError(400,'PROXY_NETWORK','Fixture failure');}});await app.listen();
 const actor={id:'monitor-owner',name:'Owner'};app.store.db.prepare('INSERT INTO users VALUES(?,?,?,?,?,?)').run(actor.id,actor.name,'monitor@example.invalid','owner','unused',0);
 app.store.put('proxy',{id:'monitor-route',name:'Monitor fixture',endpoint:'http://fixture.invalid:80',revision:'one',monitorEnabled:false,probeEnabled:false,status:'Unknown'});
 app.store.put('account',{id:'monitor-account',name:'monitor_asset',ownership:true,proxyId:'monitor-route',mode:'Manual-only',paused:false});await delay(100);assert.equal(calls,0);
 app.store.put('proxy',{...app.store.get('proxy','monitor-route'),monitorEnabled:true});await delay(160);assert.ok(calls>=1);assert.equal(app.store.get('account','monitor-account').paused,true);const logs=app.store.db.prepare('SELECT * FROM audit WHERE account_id=?').all('monitor-account');assert.equal(logs.length,1,'repeated identical failures deduplicate account pause log');await app.close();const final=calls;await delay(80);assert.equal(calls,final);
});

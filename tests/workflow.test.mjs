import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync,mkdtempSync,readFileSync} from 'node:fs';
import path from 'node:path';
import {createApp} from '../app/server.mjs';
import {previewWorkspace,mockProxyCheck,mockConnect,mockFault,milestone,issuesFor} from '../web/operations.js';

test('Mock recovery blocks the session, retains first connection time and does not infer restrictions',()=>{
 const data=previewWorkspace({id:'fixture-owner',name:'Mock Thomas',role:'owner'}),proxy={id:'mock-route',name:'Fixture',status:'Unknown'};
 data.proxies.push(proxy);const a={id:'mock-account',name:'mock_asset',proxyId:proxy.id};data.accounts.push(a);
 assert.throws(()=>mockConnect(data,a),/pass/);
 for(const failure of ['failed','wrong-country','ip-changed']){mockProxyCheck(proxy,failure);assert.equal(proxy.status,'Failed');assert.throws(()=>mockConnect(data,a));}
 mockProxyCheck(proxy);mockConnect(data,a);const first=a.firstVerifiedAt;
 for(const failure of ['proxy-failed','ip-changed','companion-offline','authorization-expired','stale']){
   mockFault(data,a,failure);assert.equal(a.session.networkBlocked,true);assert.equal(a.paused,true);assert.equal(a.firstVerifiedAt,first);assert.notEqual(a.health.score,0);assert.ok(issuesFor(a,data,true).length);
   mockProxyCheck(proxy);assert.equal(a.session.networkBlocked,true,'recheck must not resume the session');mockConnect(data,a);assert.equal(a.session.networkBlocked,false);assert.equal(a.firstVerifiedAt,first);
 }
 assert.ok(data.activity.every(e=>e.source.startsWith('Mock')));
 const now=Date.parse('2026-10-02T12:00:00Z');
 assert.match(milestone({},false,now),/Not started/);
 assert.match(milestone({firstVerifiedAt:'2026-10-01T12:00:00Z'},true,now),/24h milestone reached/);
 assert.match(milestone({firstVerifiedAt:'2026-10-02T00:00:00Z'},true,now),/aria-valuenow="12.0"/);
 assert.match(milestone({firstVerifiedAt:'2026-10-03T12:00:00Z'},false,now),/Not started/);
});

test('local configuration persists requested location; manual reports cannot enable managed access or start 24h',async()=>{
 mkdirSync('.qa',{recursive:true});const dir=mkdtempSync(path.resolve('.qa/workflow-api-'));let app=createApp({dataDir:dir,port:0}),url=await app.listen();
 const password='workflow-fixture-passphrase';
 const call=async(p,b,s)=>{const r=await fetch(url+'/api/'+p,{method:b===undefined?'GET':'POST',headers:{...(b===undefined?{}:{Origin:url,'Content-Type':'application/json'}),...(s?{Cookie:s.cookie,'X-CSRF-Token':s.csrf}:{})},body:b===undefined?undefined:JSON.stringify(b)});return {status:r.status,body:await r.json(),cookie:r.headers.get('set-cookie')};};
 const login=async email=>{const r=await call('login',{email,password});assert.equal(r.status,200);return {cookie:r.cookie.split(';')[0],csrf:r.body.csrf};};
 try{
  await call('setup',{name:'Thomas',email:'workflow@example.invalid',password,setupToken:readFileSync(app.store.setupFile,'utf8')});let owner=await login('workflow@example.invalid');
  const config={name:'US configuration',provider:'Fixture provider',endpoint:'http://192.0.2.10:80',targetCountry:'US',targetCity:'New York',expectedIp:'203.0.113.44'};
  const p=await call('proxies',config,owner);assert.equal(p.status,201);assert.equal(p.body.status,'Unknown');assert.equal(p.body.checkedAt,null);assert.equal(p.body.observedCountry,null);
  for(const invalid of [{expectedIp:'invalid'},{targetCountry:'DE'},{endpoint:'http://user:secret@192.0.2.10:8080'},{endpoint:'http://192.0.2.10:8080/?password=secret'}])assert.equal((await call('proxies',{...config,...invalid},owner)).status,400);
  assert.equal((await call('proxies/'+p.body.id+'/check',{})).status,401);
  const record=await call('accounts',{name:'workflow_asset',ownership:true,proxyId:p.body.id,firstVerifiedAt:'2020-01-01',mode:'Approved live'},owner);assert.equal(record.status,201);const id=record.body.id;assert.equal(record.body.firstVerifiedAt,null);
  await call('accounts/'+id+'/evidence',{checks:[true,true,true,true,true],connection:'Good'},owner);
  assert.equal((await call('accounts/'+id+'/open',{},owner)).body.code,'CAPABILITY_UNAVAILABLE');
  assert.equal((await call('proxies/'+p.body.id+'/check',{},owner)).body.code,'CAPABILITY_UNAVAILABLE');
  const a=(await call('accounts/'+id,undefined,owner)).body;assert.equal(a.health.source,'Manual report');assert.equal(a.firstVerifiedAt,null);assert.equal(a.proxy.observedIp,null);assert.equal(a.proxy.status,'Unknown');assert.equal(a.lease,null);
  await call('reauth',{password},owner);const member=(await call('users',{name:'Maya',email:'workflow-member@example.invalid',password},owner)).body;const m=await login('workflow-member@example.invalid');
  assert.equal((await call('proxies/'+p.body.id+'/check',{},m)).status,404);assert.equal((await call('accounts/'+id+'/open',{},m)).status,404);
  await call('accounts/'+id+'/configure',{proxyId:p.body.id,assignedIds:[member.id]},owner);
  assert.equal((await call('proxies/'+p.body.id+'/check',{},m)).body.code,'CAPABILITY_UNAVAILABLE');assert.equal((await call('proxies',config,m)).status,403);
  assert.equal((await call('proxies/'+p.body.id+'/configure',config,m)).status,403);
  assert.equal((await call('accounts/'+id+'/claim',{},owner)).status,200);
  assert.equal((await call('proxies/'+p.body.id+'/configure',{...config,endpoint:'http://192.0.2.20:8080'},owner)).status,200);
  let edited=(await call('accounts/'+id,undefined,owner)).body;assert.equal(edited.paused,true);assert.equal(edited.lease,null);assert.equal(edited.health.score,null);
  await call('accounts/'+id+'/evidence',{checks:[true,true,true,true,true],connection:'Good',restriction:'Suspended',reference:'Synthetic notice'},owner);
  await call('proxies/'+p.body.id+'/configure',config,owner);
  edited=(await call('accounts/'+id,undefined,owner)).body;assert.equal(edited.evidence.restriction,'Suspended');assert.equal(edited.health.score,0);assert.equal(edited.firstVerifiedAt,null);
  await app.close();app=createApp({dataDir:dir,port:0});url=await app.listen();owner=await login('workflow@example.invalid');
  const state=(await call('state',undefined,owner)).body;assert.equal(state.proxies[0].provider,config.provider);assert.equal(state.proxies[0].targetCity,config.targetCity);assert.equal(state.accounts[0].firstVerifiedAt,null);assert.equal(state.capabilities.companion,'Unavailable');
 }finally{await app.close();}
});

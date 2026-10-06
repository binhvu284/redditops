import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import {readFileSync,mkdirSync,mkdtempSync} from 'node:fs';
import path from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';
import {probeProxy,probeReachability,proxyObservation} from '../app/proxy.mjs';
import {brightDataEndpoint,brightDataUsername,newBrightDataSession,parseBrightDataGeo,parseBrightDataUsername,providerCode,providerFailure,residentialTargeting} from '../app/brightdata.mjs';
import {createApp} from '../app/server.mjs';
import {AppError} from '../app/domain.mjs';
import {unseal} from '../app/security.mjs';
const fixtures={key:readFileSync(new URL('./fixtures/proxy-test-key.pem',import.meta.url)),cert:readFileSync(new URL('./fixtures/proxy-test-cert.pem',import.meta.url))};
const listen=async server=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));return server.address().port;};
const close=async server=>{server.closeAllConnections?.();await new Promise(r=>server.close(r));};

test('Bright Data username, endpoints, geo and provider errors follow the October 2026 documentation',()=>{
 assert.deepEqual(parseBrightDataUsername('brd-customer-hl_1a2b3c4d-zone-isp_us1'),{customerId:'hl_1a2b3c4d',zone:'isp_us1'});
 assert.deepEqual(parseBrightDataUsername(' brd-customer-hl_1a2b3c4d-zone-isp_us1-country-de-session-old '),{customerId:'hl_1a2b3c4d',zone:'isp_us1'},'pasted flags are replaced');
 for(const bad of ['','hl_1a2b3c4d','brd-customer-hl 1-zone-x','brd-customer-hl_1-zone-','brd-customer-hl_1-zone-a:b'])assert.throws(()=>parseBrightDataUsername(bad),{code:'VALIDATION'},bad);
 assert.equal(brightDataUsername({customerId:'hl_1',zone:'isp',ipMode:'session',session:'roabc'}),'brd-customer-hl_1-zone-isp-country-us-session-roabc');
 assert.equal(brightDataUsername({customerId:'hl_1',zone:'isp',ipMode:'ip',ip:'8.8.4.4'}),'brd-customer-hl_1-zone-isp-country-us-ip-8.8.4.4');
 assert.equal(brightDataUsername({customerId:'hl_1',zone:'res',ipMode:'session',session:'roabc',state:'NY',city:'newyork',zip:'10001',stickyPeer:true}),'brd-customer-hl_1-zone-res-country-us-state-ny-city-newyork-zip-10001-session-roabc-const');
 assert.deepEqual(residentialTargeting({state:'ny',city:' San Francisco ',zip:'94103'}),{state:'NY',city:'sanfrancisco',zip:'94103'});assert.deepEqual(residentialTargeting({}),{state:null,city:null,zip:null});
 for(const bad of [{state:'XX'},{city:'New York 2'},{city:'x'},{zip:'1234'},{zip:'12345-6789'}])assert.throws(()=>residentialTargeting(bad),{code:'VALIDATION'},JSON.stringify(bad));
 assert.equal(providerCode('x-brd-err-code: policy_20052'),'policy_20052');assert.equal(providerCode('HTTP/1.1 403 Forbidden'),null);
 assert.equal(brightDataEndpoint('http:'),'http://brd.superproxy.io:44445');assert.equal(brightDataEndpoint('socks5:'),'socks5://brd.superproxy.io:22228');
 assert.match(newBrightDataSession(),/^ro[0-9a-f]{10}$/);assert.notEqual(newBrightDataSession(),newBrightDataSession());
 for(const [status,header,code] of [[407,'','PROXY_AUTH'],[400,'x-brd-err-code: client_10060','PROXY_IP_NOT_ALLOCATED'],[401,'x-brd-error: Auth Failed (code: ip_blacklisted)','PROXY_SOURCE_BLOCKED'],[502,'Proxy-Status: brd.superproxy.io; details="client_10062: No IPs"','PROXY_NO_US_IPS'],[402,'','PROXY_KYC_REQUIRED'],[502,'x-brd-err-code: policy_20140','PROXY_KYC_REQUIRED'],[403,'x-brd-err-code: policy_20080','PROXY_NETWORK_RESTRICTED'],[403,'Proxy-Status: brd.superproxy.io; received-status=403; error="destination_ip_prohibited"; details="policy_20052: Forbidden"','PROXY_NETWORK_RESTRICTED'],[403,'x-brd-err-code: policy_20050','PROXY_NETWORK_RESTRICTED'],[403,'x-brd-err-code: policy_20000','PROXY_TARGET_BLOCKED'],[429,'','PROXY_PROVIDER_LIMIT'],[400,'x-brd-err-code: client_10100','PROXY_PROVIDER_LIMIT'],[502,'x-brd-err-code: client_10064','PROXY_NO_EXIT'],[500,'','PROXY_PROTOCOL']])assert.equal(providerFailure(status,header),code,`${status} ${header}`);
 assert.deepEqual(parseBrightDataGeo(JSON.stringify({ip:'8.8.8.8',country:'US',asn:{org_name:'Fixture ISP'},geo:{city:'Ashburn',region:'VA',region_name:'Virginia',postal_code:'20147',tz:'America/New_York'}})),{ip:'8.8.8.8',country:'US',region:'VA',regionName:'Virginia',city:'Ashburn',postalCode:'20147',timezone:'America/New_York',asnOrg:'Fixture ISP'});
 assert.equal(parseBrightDataGeo('{"ip":"not-an-ip","country":"US"}').ip,null);
 for(const bad of ['not json','{}','{"country":"usa"}','null'])assert.equal(parseBrightDataGeo(bad),null,bad);
});

test('Bright Data tunnel: provider geo, sanitized provider errors, interception and handshake-only Reddit reachability',async()=>{
 let requests=0,handshakes=0,geoMode='valid',connectMode='ok';const sockets=new Set();
 const track=server=>server.on('connection',s=>{sockets.add(s);s.on('close',()=>sockets.delete(s));});
 const target=https.createServer(fixtures,(req,res)=>{requests++;if(req.url==='/mygeo.json'){res.writeHead(200,{'Content-Type':'application/json'});res.end(geoMode==='invalid'?'not json':JSON.stringify({ip:geoMode==='bypass'?'1.1.1.1':'8.8.8.8',country:'US',asn:{asnum:1,org_name:'Fixture ISP'},geo:{city:'Ashburn',region:'VA',region_name:'Virginia',postal_code:'20147',tz:'America/New_York'}}));return;}res.writeHead(200,{'Content-Type':'text/plain'});res.end('ip=8.8.8.8\nloc=US\n');});
 target.on('connection',()=>handshakes++);track(target);const targetPort=await listen(target);
 const replies={auth:'407 Proxy Authentication Required\r\nProxy-Status: brd.superproxy.io; received-status=407; error="http_request_denied"; details="client_10000: Invalid authentication for isp_fixture"',ip:'400 Bad Request\r\nx-brd-err-code: client_10060',source:'401 Unauthorized\r\nx-brd-error: Auth Failed (code: ip_blacklisted)',kyc:'402 Residential Failed',blocked:'403 Forbidden\r\nx-brd-err-code: policy_20000',restricted:'403 Forbidden\r\nProxy-Status: brd.superproxy.io; received-status=403; error="destination_ip_prohibited"; details="policy_20052: Forbidden: Access to this site is restricted on the selected network type for isp_fixture"\r\nx-brd-err-code: policy_20052',peer:'502 Bad Gateway\r\nx-brd-err-code: client_10064'};
 const proxy=http.createServer();proxy.on('connect',(req,client,head)=>{if(replies[connectMode]){client.end('HTTP/1.1 '+replies[connectMode]+'\r\nContent-Length: 0\r\n\r\n');return;}const remote=net.connect(targetPort,'127.0.0.1',()=>{client.write('HTTP/1.1 200 Connection established\r\n\r\n');if(head.length)remote.write(head);client.pipe(remote).pipe(client);});sockets.add(remote);remote.on('close',()=>sockets.delete(remote));remote.on('error',()=>client.destroy());client.on('error',()=>remote.destroy());client.on('close',()=>remote.destroy());});track(proxy);const port=await listen(proxy);
 const route={endpoint:`http://localhost:${port}`,brightData:{zone:'isp_fixture'}},credentials={username:'brd-customer-hl_fixture-zone-isp_fixture-country-us-session-ro0000000000',password:'SYNTHETIC_ZONE_PASSWORD'};
 const options={target:{host:'localhost',port:targetPort,path:'/cdn-cgi/trace'},geoTarget:{host:'localhost',port:targetPort,path:'/mygeo.json'},ca:fixtures.cert,resolve:async()=>[{address:'127.0.0.1',family:4}],allowAddress:a=>a==='127.0.0.1',timeoutMs:1000,geoTimeoutMs:1000};
 const reddit={...options,target:{host:'localhost',port:targetPort}};
 try{
  const value=await probeProxy(route,credentials,options);assert.equal(value.observedIp,'8.8.8.8');assert.deepEqual(value.providerGeo,{ip:'8.8.8.8',country:'US',region:'VA',regionName:'Virginia',city:'Ashburn',postalCode:'20147',timezone:'America/New_York',asnOrg:'Fixture ISP'});
  const observation=proxyObservation(value,{});assert.equal(observation.status,'Available');assert.match(observation.source,/Bright Data geo/);
  assert.match(proxyObservation({...value,providerGeo:{...value.providerGeo,country:'CA'}},{}).message,/Provider-reported country is CA/);
  geoMode='bypass';const bypass=proxyObservation(await probeProxy(route,credentials,options),{});assert.equal(bypass.checkOutcome,'source-mismatch');assert.equal(bypass.status,'Unknown');assert.match(bypass.message,/super-proxy bypass/);geoMode='valid';
  const located=proxyObservation(value,{brightData:{state:'NY',city:'newyork'}});assert.equal(located.status,'Available','location notes do not decide the route');assert.match(located.message,/state VA differs from requested NY/);assert.match(located.message,/city Ashburn differs from requested newyork/);
  assert.doesNotMatch(proxyObservation(value,{brightData:{state:'VA',city:'ashburn'}}).message,/differs/);
  geoMode='invalid';assert.deepEqual((await probeProxy(route,credentials,options)).providerGeo,{error:'PROXY_RESPONSE'},'provider location is optional');geoMode='valid';
  assert.equal((await probeProxy({endpoint:route.endpoint},credentials,options)).providerGeo,undefined,'generic routes do not contact the Bright Data checker');
  for(const [mode,code] of [['auth','PROXY_AUTH'],['ip','PROXY_IP_NOT_ALLOCATED'],['source','PROXY_SOURCE_BLOCKED'],['kyc','PROXY_KYC_REQUIRED'],['blocked','PROXY_TARGET_BLOCKED'],['restricted','PROXY_NETWORK_RESTRICTED'],['peer','PROXY_NO_EXIT']]){connectMode=mode;const before=requests;const error=await probeProxy(route,credentials,options).catch(e=>e);assert.equal(error.code,code,mode);assert.doesNotMatch(error.message,/client_|policy_|isp_fixture|SYNTHETIC/);assert.equal(requests,before,'no direct fallback');}
  connectMode='ok';const intercepted=await probeProxy(route,credentials,{...options,ca:undefined}).catch(e=>e);assert.equal(intercepted.code,'PROXY_TLS');assert.match(intercepted.message,/decrypt HTTPS/);
  const beforeRequests=requests,beforeHandshakes=handshakes;const reach=await probeReachability(route,credentials,reddit);assert.equal(typeof reach.latencyMs,'number');
  await delay(50);assert.equal(handshakes,beforeHandshakes+1,'reachability opens exactly one tunnel to the target');assert.equal(requests,beforeRequests,'reachability sends no HTTP request');
  await assert.rejects(probeReachability(route,credentials,{...reddit,ca:undefined}),{code:'PROXY_TLS'});
  connectMode='blocked';await assert.rejects(probeReachability(route,credentials,reddit),{code:'PROXY_TARGET_BLOCKED',providerCode:'policy_20000'});
  connectMode='restricted';const restricted=await probeReachability(route,credentials,reddit).catch(e=>e);assert.equal(restricted.code,'PROXY_NETWORK_RESTRICTED');assert.equal(restricted.providerCode,'policy_20052');assert.match(restricted.message,/KYC/);assert.doesNotMatch(restricted.message,/isp_fixture|policy_/);
 }finally{for(const socket of sockets)socket.destroy();await Promise.all([close(proxy),close(target)]);}
});

test('Bright Data preset: encrypted composition, retention, session rotation, allocated IP pinning and stability test',async()=>{
 mkdirSync('.qa',{recursive:true});const dir=mkdtempSync(path.resolve('.qa/brightdata-api-'));let sequence=[],reach='ok';const seen=[];
 const app=createApp({dataDir:dir,port:0,proxyCooldownMs:0,stabilityAttempts:3,stabilityGapMs:0,proxyProbe:async(p,c)=>{seen.push({endpoint:p.endpoint,username:c.username,password:c.password});const next=sequence.length?sequence.shift():{observedIp:'8.8.8.8',observedCountry:'US',latencyMs:5};if(next instanceof Error)throw next;return next;},reachabilityProbe:async()=>{if(reach==='blocked'){const error=new AppError(400,'PROXY_NETWORK_RESTRICTED','Restricted on this network type.');error.providerCode='policy_20052';throw error;}return {latencyMs:7};}}),url=await app.listen();let session;
 const call=async(p,b,s=session)=>{const r=await fetch(url+'/api/'+p,{method:b===undefined?'GET':'POST',headers:{Origin:url,'Content-Type':'application/json',...(s?{Cookie:s.cookie,'X-CSRF-Token':s.csrf}:{})},body:b===undefined?undefined:JSON.stringify(b)});return {status:r.status,body:await r.json(),cookie:r.headers.get('set-cookie')};};
 const ok=async(p,b,s=session,status=200)=>{const r=await call(p,b,s);assert.equal(r.status,status,`${p}: ${JSON.stringify(r.body)}`);return r.body;};
 const password='bright-fixture-passphrase',zoneUser='brd-customer-hl_fixture01-zone-isp_fixture',zoneSecret='SYNTHETIC_ZONE_PASSWORD';
 const vault=id=>unseal(app.store.get('proxy',id).vault,app.store.key,id);
 const config={name:'Bright Data US test',preset:'brightdata',brightData:{username:zoneUser,network:'isp',protocol:'http:',ipMode:'session'},password:zoneSecret};
 try{
  await ok('setup',{name:'Thomas',email:'bright@example.invalid',password,setupToken:readFileSync(app.store.setupFile,'utf8')},null,201);
  const login=await call('login',{email:'bright@example.invalid',password},null);session={cookie:login.cookie.split(';')[0],csrf:login.body.csrf};
  assert.equal((await call('proxies',config)).status,403,'zone credentials require password confirmation');await ok('reauth',{password});
  for(const brightData of [{...config.brightData,username:'hl_fixture01'},{...config.brightData,network:'unknown'},{...config.brightData,network:'residential',ipMode:'ip',ip:'8.8.4.4'},{...config.brightData,ipMode:'ip',ip:'10.0.0.5'},{...config.brightData,ipMode:'ip',ip:'not-an-ip'}])assert.equal((await call('proxies',{...config,brightData})).status,400,JSON.stringify(brightData));
  assert.equal((await call('proxies',{...config,password:''})).status,400);
  const p=await ok('proxies',config,session,201);
  assert.equal(p.endpoint,'http://brd.superproxy.io:44445');assert.equal(p.provider,'Bright Data');assert.equal(p.authMode,'password');assert.equal(p.brightData.zone,'isp_fixture');assert.equal(p.brightData.customerHint,'hl_…e01');assert.match(p.brightData.session,/^ro[0-9a-f]{10}$/);assert.equal(p.vault,undefined);
  assert.doesNotMatch(JSON.stringify(await ok('state')),/hl_fixture01|SYNTHETIC_ZONE_PASSWORD/,'customer ID and zone password stay encrypted');
  assert.deepEqual(vault(p.id),{username:`${zoneUser}-country-us-session-${p.brightData.session}`,password:zoneSecret,customerId:'hl_fixture01'});
  assert.equal((await call('proxies/'+p.id+'/stability',{})).status,400);assert.equal(seen.length,0,'no request without consent');
  const a=await ok('accounts',{name:'bright_fixture_asset',ownership:true,proxyId:p.id},session,201);
  let r=await ok('proxies/'+p.id+'/stability',{consent:true,reddit:true});
  assert.equal(r.stability.verdict,'Stable');assert.equal(r.stability.passed,3);assert.deepEqual(r.stability.ips,['8.8.8.8']);assert.deepEqual(r.stability.latency,{min:5,avg:5,max:5});assert.equal(r.stability.reddit.status,'Reachable');assert.equal(r.status,'Available');assert.equal(r.baselineIp,'8.8.8.8');
  assert.equal(seen.length,3);assert.ok(seen.every(x=>x.endpoint==='http://brd.superproxy.io:44445'&&x.username===vault(p.id).username&&x.password===zoneSecret));
  const audit=JSON.stringify(await ok('state'));assert.match(audit,/Proxy stability test · Bright Data US test/);assert.doesNotMatch(audit,/SYNTHETIC_ZONE_PASSWORD|hl_fixture01/);
  sequence=[{observedIp:'8.8.8.8',observedCountry:'US',latencyMs:5},{observedIp:'1.1.1.1',observedCountry:'US',latencyMs:9},new AppError(400,'PROXY_NO_EXIT','No exit IP.')];reach='blocked';
  r=await ok('proxies/'+p.id+'/stability',{consent:true,reddit:true});
  assert.equal(r.stability.verdict,'Unstable');assert.equal(r.stability.passed,1);assert.deepEqual(r.stability.ips,['8.8.8.8','1.1.1.1']);assert.equal(r.stability.failures['ip-changed'],1);assert.equal(r.stability.failures.PROXY_NO_EXIT,1);assert.equal(r.stability.reddit.status,'Blocked');assert.equal(r.stability.reddit.errorCode,'PROXY_NETWORK_RESTRICTED');assert.equal(r.stability.reddit.providerCode,'policy_20052');
  assert.equal(r.status,'Failed');assert.equal(r.checkOutcome,'ip-changed');assert.equal(r.baselineIp,'8.8.8.8','a changed IP never replaces the pinned IP');
  assert.equal((await ok('state')).accounts.find(x=>x.id===a.id).paused,true,'unstable route pauses assigned accounts');
  sequence=[new AppError(400,'PROXY_AUTH','Auth.'),new AppError(400,'PROXY_AUTH','Auth.'),new AppError(400,'PROXY_AUTH','Auth.')];r=await ok('proxies/'+p.id+'/stability',{consent:true});assert.equal(r.stability.verdict,'Failed');assert.equal(r.stability.latency,null);assert.equal(r.stability.reddit,null);assert.equal(r.baselineIp,'8.8.8.8');
  await ok('reauth',{password});
  let edited=await ok('proxies/'+p.id+'/configure',{name:'Bright Data US test',preset:'brightdata',brightData:{network:'isp',protocol:'http:',ipMode:'session'}});
  assert.equal(edited.brightData.session,p.brightData.session,'blank credentials keep the session');assert.equal(edited.baselineIp,'8.8.8.8');assert.equal(edited.stability,undefined);assert.equal(edited.status,'Unknown');assert.deepEqual(vault(p.id),{username:`${zoneUser}-country-us-session-${p.brightData.session}`,password:zoneSecret,customerId:'hl_fixture01'});
  edited=await ok('proxies/'+p.id+'/configure',{name:'Bright Data US test',preset:'brightdata',brightData:{network:'isp',protocol:'http:',ipMode:'session',newSession:true}});
  assert.notEqual(edited.brightData.session,p.brightData.session);assert.equal(edited.baselineIp,null,'a new test IP clears the pinned IP');
  edited=await ok('proxies/'+p.id+'/configure',{name:'Bright Data US office IP',preset:'brightdata',brightData:{network:'isp',protocol:'socks5:',ipMode:'ip',ip:'8.8.4.4'}});
  assert.equal(edited.endpoint,'socks5://brd.superproxy.io:22228');assert.equal(edited.expectedIp,'8.8.4.4');assert.equal(edited.brightData.session,null);assert.equal(vault(p.id).username,'brd-customer-hl_fixture01-zone-isp_fixture-country-us-ip-8.8.4.4');
  sequence=[{observedIp:'8.8.8.8',observedCountry:'US',latencyMs:5}];r=await ok('proxies/'+p.id+'/check',{consent:true});assert.equal(r.checkOutcome,'ip-changed','observed IP must match the allocated IP');
  sequence=[{observedIp:'8.8.4.4',observedCountry:'US',latencyMs:5}];r=await ok('proxies/'+p.id+'/check',{consent:true});assert.equal(r.status,'Available');
  await ok('reauth',{password});
  for(const brightData of [{network:'residential',protocol:'http:',ipMode:'ip',ip:'8.8.4.4'},{network:'residential',protocol:'http:',zip:'123'},{network:'residential',protocol:'http:',state:'ZZ'}])assert.equal((await call('proxies/'+p.id+'/configure',{name:'Residential',preset:'brightdata',brightData})).status,400,JSON.stringify(brightData));
  edited=await ok('proxies/'+p.id+'/configure',{name:'Bright Data Residential NY',preset:'brightdata',brightData:{username:'brd-customer-hl_fixture01-zone-residential_fixture',network:'residential',protocol:'http:',state:'NY',city:'New York',zip:'10001',stickyPeer:true}});
  assert.equal(edited.brightData.network,'residential');assert.equal(edited.brightData.ipMode,'session');assert.equal(edited.brightData.stickyPeer,true);assert.equal(edited.brightData.zone,'residential_fixture');assert.equal(edited.targetCity,'newyork · NY · 10001');assert.equal(edited.expectedIp,null);assert.equal(edited.baselineIp,null);
  assert.equal(vault(p.id).username,`brd-customer-hl_fixture01-zone-residential_fixture-country-us-state-ny-city-newyork-zip-10001-session-${edited.brightData.session}-const`);
  edited=await ok('proxies/'+p.id+'/configure',{name:'Bright Data ISP',preset:'brightdata',brightData:{network:'isp',protocol:'http:',state:'NY',city:'New York',zip:'10001',stickyPeer:true}});
  assert.equal(edited.brightData.state,null,'ISP zones ignore residential targeting');assert.equal(edited.brightData.stickyPeer,false);assert.doesNotMatch(vault(p.id).username,/state|city|zip|const/);
  edited=await ok('proxies/'+p.id+'/configure',{name:'Generic route',endpoint:'http://proxy.example.invalid:8080',authMode:'none'});assert.equal(edited.brightData,null);assert.equal(edited.hasCredentials,false);
 }finally{await app.close();}
});

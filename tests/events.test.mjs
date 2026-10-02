import test from 'node:test';import assert from 'node:assert/strict';import {mkdirSync,mkdtempSync,readFileSync} from 'node:fs';import path from 'node:path';import {createApp} from '../app/server.mjs';
mkdirSync('.qa',{recursive:true});
test('15-account registry, durable event audit and real internal update stream',async()=>{
 const app=createApp({dataDir:mkdtempSync(path.resolve('.qa/events-')),port:0}),url=await app.listen();let cookie,csrf;const password='event-fixture-passphrase';
 const call=async(p,b)=>{const r=await fetch(url+'/api/'+p,{method:b===undefined?'GET':'POST',headers:{Origin:url,'Content-Type':'application/json',...(cookie?{Cookie:cookie,'X-CSRF-Token':csrf}:{})},body:b===undefined?undefined:JSON.stringify(b)});const v=await r.json();assert.ok(r.ok,JSON.stringify(v));return {v,c:r.headers.get('set-cookie')};};
 let reader,controller;
 try{await call('setup',{name:'Thomas',email:'events@example.invalid',password,setupToken:readFileSync(app.store.setupFile,'utf8')});const login=await call('login',{email:'events@example.invalid',password});cookie=login.c.split(';')[0];csrf=login.v.csrf;
 controller=new AbortController();const response=await fetch(url+'/api/events',{headers:{Cookie:cookie},signal:controller.signal});reader=response.body.getReader();const first=await reader.read();assert.match(new TextDecoder().decode(first.value),/event: connected/);
 for(let i=0;i<15;i++)await call('accounts',{name:'fixture_asset_'+String(i).padStart(2,'0'),ownership:true});const update=await reader.read();assert.match(new TextDecoder().decode(update.value),/event: changed/);const state=(await call('state')).v;assert.equal(state.accounts.length,15);assert.equal(state.accounts.every(a=>a.connection==='Not connected'&&a.health.score===null),true);assert.equal(state.notifications.length,15);assert.equal(state.activity.filter(e=>e.action==='Account added').length,15);assert.equal(new Set(state.accounts.map(a=>a.id)).size,15);assert.equal(state.accounts.every(a=>!('vault'in a)),true);
 }finally{controller?.abort();await reader?.cancel().catch(()=>{});await app.close();}
});

import test from 'node:test';import assert from 'node:assert/strict';import http from 'node:http';import {mkdirSync,mkdtempSync,readFileSync} from 'node:fs';import path from 'node:path';import {createApp} from '../app/server.mjs';
mkdirSync('.qa',{recursive:true});
test('optional HTTPS canonical origin rejects other hosts and sets Secure session cookies',async()=>{
 const dir=mkdtempSync(path.resolve('.qa/deployment-'));assert.throws(()=>createApp({dataDir:dir,publicOrigin:'http://ops.example.invalid'}),/HTTPS/);
 const app=createApp({dataDir:dir,port:0,publicOrigin:'https://ops.example.invalid'}),url=await app.listen();
 const call=(p,b,extra={})=>new Promise((resolve,reject)=>{const serialized=JSON.stringify(b);const req=http.request(url+'/api/'+p,{method:b===undefined?'GET':'POST',headers:{Host:'ops.example.invalid',Origin:'https://ops.example.invalid','Content-Type':'application/json',...extra}},res=>{let data='';res.on('data',c=>data+=c);res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,value:JSON.parse(data)}));});req.on('error',reject);req.end(serialized);});
 try{assert.equal((await call('bootstrap',undefined,{Host:'evil.invalid'})).status,403);assert.equal((await call('setup',{}, {Origin:'https://evil.invalid'})).status,403);const password='https-fixture-passphrase';assert.equal((await call('setup',{name:'Thomas',email:'https@example.invalid',password,setupToken:readFileSync(app.store.setupFile,'utf8')})).status,201);const login=await call('login',{email:'https@example.invalid',password});assert.equal(login.status,200);assert.match(login.headers['set-cookie'][0],/; Secure/);assert.match(login.headers['set-cookie'][0],/HttpOnly/);assert.match(login.headers['set-cookie'][0],/SameSite=Strict/);
 }finally{await app.close();}
});

import net from 'node:net';
import tls from 'node:tls';
import https from 'node:https';
import {lookup} from 'node:dns/promises';
import {AppError,requireValue} from './domain.mjs';

export const PROBE_SOURCE='Live proxy probe · Cloudflare trace';
const destination={host:'www.cloudflare.com',port:443,path:'/cdn-cgi/trace'};
const errors={
  PROXY_AUTH:'Proxy rejected authentication. Check credentials or provider IP allowlist.',
  PROXY_TIMEOUT:'Proxy check timed out. Check the endpoint and provider availability, then retry.',
  PROXY_NETWORK:'Could not reach the proxy. Check the server address, port and provider.',
  PROXY_TLS:'TLS verification failed. Check the provider certificate; verification cannot be bypassed.',
  PROXY_PROTOCOL:'Proxy returned an unsupported response. Check the selected protocol.',
  PROXY_RESPONSE:'The diagnostic service returned an invalid response. Retry; account status is unchanged.',
  PROXY_DESTINATION:'Proxy address is not a public internet destination. Use your provider’s public endpoint.',
  PROXY_DNS:'Could not resolve a public proxy address. Check the provider hostname.',
};
const fail=code=>new AppError(400,code,errors[code]);

// Reject private, loopback, link-local, multicast, documentation and transition addresses.
// Pin the checked DNS result when opening the socket; never re-resolve during connect.
export function publicAddress(address){
  if(net.isIP(address)===4){
    const [a,b,c]=address.split('.').map(Number);
    return !(a===0||a===10||a===127||a>=224||a===169&&b===254||a===172&&b>=16&&b<=31||a===192&&b===168||a===100&&b>=64&&b<=127||a===198&&(b===18||b===19)||a===192&&b===0||a===192&&b===88&&c===99||a===198&&b===51&&c===100||a===203&&b===0&&c===113);
  }
  if(net.isIP(address)!==6)return false;
  const first=parseInt(address.split(':')[0],16);
  const second=parseInt(address.split(':')[1]||'0',16);
  return first>=0x2000&&first<0x3fff&&first!==0x2002&&!(first===0x2001&&(second<0x200||second===0xdb8));
}

class Reader {
  constructor(socket,signal){
    this.socket=socket;this.buffer=Buffer.alloc(0);this.pending=null;
    this.data=chunk=>{this.buffer=Buffer.concat([this.buffer,chunk]);if(this.buffer.length>16384)this.error(fail('PROXY_PROTOCOL'));else this.flush();};
    this.error=err=>{this.failed=err;this.pending?.reject(err);this.pending=null;};
    this.end=()=>this.error(fail('PROXY_PROTOCOL'));
    this.abort=()=>this.error(signal.reason);
    this.signal=signal;socket.on('data',this.data);socket.on('error',this.error);socket.on('end',this.end);signal.addEventListener('abort',this.abort,{once:true});
  }
  flush(){if(!this.pending)return;const {length,marker,resolve}=this.pending;const size=marker?this.buffer.indexOf(marker)+marker.length:length;if((marker&&size<marker.length)||this.buffer.length<size)return;const bytes=this.buffer.subarray(0,size);this.buffer=this.buffer.subarray(size);this.pending=null;resolve(bytes);}
  read(length,marker){if(this.failed)return Promise.reject(this.failed);return new Promise((resolve,reject)=>{this.pending={length,marker,resolve,reject};this.flush();});}
  detach(){this.socket.pause();this.socket.off('data',this.data);this.socket.off('error',this.error);this.socket.off('end',this.end);this.signal.removeEventListener('abort',this.abort);if(this.buffer.length)this.socket.unshift(this.buffer);}
}

function connected(socket,event,signal){return new Promise((resolve,reject)=>{
  const cleanup=()=>{socket.off(event,done);socket.off('error',error);signal.removeEventListener('abort',abort);};
  const done=()=>{cleanup();resolve(socket);},error=e=>{cleanup();reject(e);},abort=()=>error(signal.reason);
  socket.once(event,done);socket.once('error',error);signal.addEventListener('abort',abort,{once:true});if(signal.aborted)abort();
});}

// Test-only dependencies are supplied directly by local fixtures, never HTTP input or environment.
export async function probeProxy(proxy,credentials={},options={}){
  const controller=new AbortController(),signal=controller.signal;
  const timer=setTimeout(()=>controller.abort(fail('PROXY_TIMEOUT')),options.timeoutMs||12000);
  const sockets=new Set();signal.addEventListener('abort',()=>{for(const s of sockets)s.destroy();},{once:true});
  const start=Date.now();
  try{
    const url=new URL(proxy.endpoint),host=url.hostname.replace(/^\[|\]$/g,''),port=Number(url.port||(url.protocol==='https:'?443:80));
    requireValue(['http:','https:','socks5:'].includes(url.protocol)&&Number.isInteger(port)&&port>0&&port<=65535&&!url.username&&!url.password&&!url.search&&!url.hash&&['','/'].includes(url.pathname),'VALIDATION','Invalid proxy endpoint.');
    const resolved=net.isIP(host)?[{address:host,family:net.isIP(host)}]:await Promise.race([(options.resolve||lookup)(host,{all:true,verbatim:true}),new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(signal.reason),{once:true}))]);
    if(!resolved.length||resolved.some(r=>!(options.allowAddress||publicAddress)(r.address)))throw fail('PROXY_DESTINATION');
    if(signal.aborted)throw signal.reason;
    const selected=resolved[0];let socket;
    const connection={host:selected.address,port,family:selected.family};
    if(url.protocol==='https:')socket=tls.connect({...connection,servername:net.isIP(host)?undefined:host,checkServerIdentity:(_,cert)=>tls.checkServerIdentity(host,cert),ca:options.ca,rejectUnauthorized:true});
    else socket=net.connect(connection);
    sockets.add(socket);socket.on('error',()=>{});
    await connected(socket,url.protocol==='https:'?'secureConnect':'connect',signal);
    const target=options.target||destination,reader=new Reader(socket,signal);
    try{
      if(url.protocol==='socks5:'){
        const authenticated=!!credentials.username;
        socket.write(Buffer.from(authenticated?[5,1,2]:[5,1,0]));
        const greeting=await reader.read(2);if(greeting[0]!==5||greeting[1]!== (authenticated?2:0))throw fail(authenticated?'PROXY_AUTH':'PROXY_PROTOCOL');
        if(authenticated){const user=Buffer.from(credentials.username),pass=Buffer.from(credentials.password||'');if(!user.length||user.length>255||!pass.length||pass.length>255)throw fail('PROXY_AUTH');socket.write(Buffer.concat([Buffer.from([1,user.length]),user,Buffer.from([pass.length]),pass]));const auth=await reader.read(2);if(auth[0]!==1||auth[1]!==0)throw fail('PROXY_AUTH');}
        const hostBytes=Buffer.from(target.host),portBytes=Buffer.alloc(2);portBytes.writeUInt16BE(target.port);socket.write(Buffer.concat([Buffer.from([5,1,0,3,hostBytes.length]),hostBytes,portBytes]));
        const response=await reader.read(4);if(response[0]!==5||response[1]!==0||response[2]!==0)throw fail('PROXY_PROTOCOL');
        if(response[3]===1)await reader.read(6);else if(response[3]===4)await reader.read(18);else if(response[3]===3){const size=await reader.read(1);await reader.read(size[0]+2);}else throw fail('PROXY_PROTOCOL');
      }else{
        const authorization=credentials.username?'Proxy-Authorization: Basic '+Buffer.from(credentials.username+':'+credentials.password).toString('base64')+'\r\n':'';
        socket.write(`CONNECT ${target.host}:${target.port} HTTP/1.1\r\nHost: ${target.host}:${target.port}\r\n${authorization}Connection: keep-alive\r\n\r\n`);
        const header=(await reader.read(0,Buffer.from('\r\n\r\n'))).toString('latin1');const status=header.match(/^HTTP\/1\.[01] (\d{3})\b/);
        if(status?.[1]==='407')throw fail('PROXY_AUTH');if(status?.[1]!=='200')throw fail('PROXY_PROTOCOL');
      }
    }finally{reader.detach();}
    // TLS is established inside the proxy tunnel. No direct request/fallback exists.
    const secure=tls.connect({socket,servername:net.isIP(target.host)?undefined:target.host,checkServerIdentity:(_,cert)=>tls.checkServerIdentity(target.host,cert),ca:options.ca,rejectUnauthorized:true,ALPNProtocols:['http/1.1']});
    sockets.add(secure);secure.on('error',()=>{});await connected(secure,'secureConnect',signal);
    const agent=new https.Agent({keepAlive:false});agent.createConnection=()=>secure;
    const trace=await new Promise((resolve,reject)=>{
      const request=https.request({hostname:target.host,port:target.port,path:target.path,method:'GET',agent,signal,headers:{Accept:'text/plain','User-Agent':'RedditOps-ProxyCheck/0.1',Connection:'close'}},response=>{
        if(response.statusCode!==200){response.destroy();reject(fail('PROXY_RESPONSE'));return;}
        let bytes=0,body='';response.on('data',chunk=>{bytes+=chunk.length;if(bytes>8192){response.destroy();reject(fail('PROXY_RESPONSE'));return;}body+=chunk.toString('utf8');});response.on('end',()=>resolve(body));response.on('error',reject);
      });request.on('error',reject);request.end();
    });
    const fields=Object.fromEntries(trace.trim().split(/\r?\n/).map(line=>{const i=line.indexOf('=');return [line.slice(0,i),line.slice(i+1)];}));
    if(!net.isIP(fields.ip)||!publicAddress(fields.ip))throw fail('PROXY_RESPONSE');
    return {observedIp:fields.ip,observedCountry:/^[A-Z]{2}$/.test(fields.loc||'')?fields.loc:null,latencyMs:Date.now()-start};
  }catch(error){
    if(signal.aborted)throw signal.reason;
    if(error instanceof AppError)throw error;
    if(error.code?.includes('CERT')||error.code?.includes('TLS')||error.code==='UNABLE_TO_VERIFY_LEAF_SIGNATURE'||error.code==='DEPTH_ZERO_SELF_SIGNED_CERT')throw fail('PROXY_TLS');
    if(['ENOTFOUND','EAI_AGAIN'].includes(error.code))throw fail('PROXY_DNS');
    throw fail('PROXY_NETWORK');
  }finally{clearTimeout(timer);for(const socket of sockets)socket.destroy();}
}

export function proxyObservation(result,proxy,now=new Date().toISOString()){
  const baseline=proxy.expectedIp||proxy.baselineIp;
  const checkOutcome=!result.observedCountry?'country-unknown':result.observedCountry!=='US'?'wrong-country':baseline&&baseline!==result.observedIp?'ip-changed':'success';
  return {...result,checkedAt:now,source:PROBE_SOURCE,checkOutcome,status:checkOutcome==='success'?'Available':checkOutcome==='country-unknown'?'Unknown':'Failed',baselineIp:proxy.baselineIp||(checkOutcome==='success'?result.observedIp:null),errorCode:null,message:{success:'US route check passed. Browser routing remains unavailable.','country-unknown':'Exit IP observed, but country is unknown. Retry before use.','wrong-country':'Observed country is not US. Check your provider route.','ip-changed':'Exit IP differs from the pinned IP. Assigned accounts remain paused; review your provider before changing the route.'}[checkOutcome]};
}
export function publicProxy(proxy,now=Date.now()){
  const {vault,...safe}=proxy;return {...safe,authMode:proxy.authMode||'none',hasCredentials:!!vault,status:proxy.checkedAt&&now-Date.parse(proxy.checkedAt)>300000?'Stale':proxy.status};
}

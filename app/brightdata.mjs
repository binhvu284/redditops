import {randomBytes} from 'node:crypto';
import {isIP} from 'node:net';
import {requireValue} from './domain.mjs';

// Verified October 6, 2026 at docs.brightdata.com: native port 44445 replaced 22225/33335 on September 25, 2026;
// SOCKS5 uses 22228. Username flags: -country-us, -state/-city/-zip (Residential only), -session-<id>, -const, -ip-<IP>.
export const BRIGHT_DATA={host:'brd.superproxy.io',ports:{'http:':44445,'socks5:':22228},check:{host:'brdtest.com',port:443,path:'/myip.json'}};
export const BRIGHT_DATA_NETWORKS={isp:'ISP',datacenter:'Datacenter',residential:'Residential'};
export const US_STATES=['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

export const brightDataEndpoint=protocol=>`${protocol}//${BRIGHT_DATA.host}:${BRIGHT_DATA.ports[protocol]}`;
export const newBrightDataSession=()=>'ro'+randomBytes(5).toString('hex');
export const customerHint=id=>id.length>6?id.slice(0,3)+'…'+id.slice(-3):'…';
export const cityFlag=value=>String(value||'').toLowerCase().replace(/[\s.'-]/g,'');

// Accept the zone username exactly as copied from the Bright Data Overview tab; any flags already present are replaced.
export function parseBrightDataUsername(value){
  const match=String(value||'').trim().match(/^brd-customer-([A-Za-z0-9_]{2,64})-zone-([A-Za-z0-9_]{1,64})(?:-.*)?$/);
  requireValue(match,'VALIDATION','Paste the zone username from Bright Data Overview, for example brd-customer-hl_xxxx-zone-residential_proxy1.');
  return {customerId:match[1],zone:match[2]};
}

// Office-area targeting exists only on Residential zones; Datacenter/ISP support country targeting only.
export function residentialTargeting({state,city,zip}={}){
  const target={state:state?String(state).toUpperCase():null,city:city?cityFlag(city):null,zip:zip?String(zip).trim():null};
  requireValue(!target.state||US_STATES.includes(target.state),'VALIDATION','Choose a US state from the list.');
  requireValue(!target.city||/^[a-z]{2,40}$/.test(target.city),'VALIDATION','Enter a US city name using letters only, for example New York.');
  requireValue(!target.zip||/^\d{5}$/.test(target.zip),'VALIDATION','Enter a 5-digit US ZIP code.');
  return target;
}

export function brightDataUsername({customerId,zone,ipMode,ip,session,state,city,zip,stickyPeer}){
  return `brd-customer-${customerId}-zone-${zone}-country-us`+(state?`-state-${state.toLowerCase()}`:'')+(city?`-city-${city}`:'')+(zip?`-zip-${zip}`:'')+(ipMode==='ip'?`-ip-${ip}`:`-session-${session}`+(stickyPeer?'-const':''));
}

// Bright Data's own checker reports location and, through the proxy, the exit IP. Values are provider-reported.
export function parseBrightDataGeo(body){
  let value;try{value=JSON.parse(body);}catch{return null;}
  const str=v=>typeof v==='string'&&v.length<=80?v:null;
  if(!value||typeof value!=='object'||!/^[A-Z]{2}$/.test(value.country||''))return null;
  return {ip:typeof value.ip==='string'&&isIP(value.ip)?value.ip:null,country:value.country,region:str(value.geo?.region),regionName:str(value.geo?.region_name),city:str(value.geo?.city),postalCode:str(value.geo?.postal_code),timezone:str(value.geo?.tz),asnOrg:str(value.asn?.org_name)};
}

// Provider error codes such as policy_20052 are non-secret identifiers kept for troubleshooting.
export const providerCode=(header='')=>(header.match(/\b(?:client|policy)_\d{5}\b/)||[null])[0];

// Map provider status/header codes to fixed messages; provider text is never echoed to the browser.
export function providerFailure(status,header=''){
  const code=providerCode(header)||'';
  if(status===407||code==='client_10000'||code==='client_10001')return 'PROXY_AUTH';
  if(status===401||code==='client_10050'||/\bip_(?:forbidden|blacklisted)\b/.test(header))return 'PROXY_SOURCE_BLOCKED';
  if(code==='client_10060')return 'PROXY_IP_NOT_ALLOCATED';
  if(code==='client_10062')return 'PROXY_NO_US_IPS';
  if(status===402||/^policy_201[34]\d$/.test(code)||/\bkyc_required\b/i.test(header))return 'PROXY_KYC_REQUIRED';
  // policy_20050/20052/20080: the site is restricted on this network type until KYC (Bright Data, October 2026).
  if(['policy_20050','policy_20052','policy_20080'].includes(code))return 'PROXY_NETWORK_RESTRICTED';
  if(status===403||code.startsWith('policy_'))return 'PROXY_TARGET_BLOCKED';
  if(status===429||code==='client_10100')return 'PROXY_PROVIDER_LIMIT';
  if(status===502||status===503||code==='client_10064')return 'PROXY_NO_EXIT';
  return 'PROXY_PROTOCOL';
}

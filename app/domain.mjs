export const checkNames=['Management permission','Authorization','Required proxy','Correct account session','Current account evidence'];
export class AppError extends Error {constructor(status,code,message){super(message);this.status=status;this.code=code;}}
export function requireValue(condition,code,message,status=400){if(!condition)throw new AppError(status,code,message);}
export function text(value,label,max=200){requireValue(typeof value==='string'&&value.trim().length>0&&value.length<=max,'VALIDATION',`${label} is required (maximum ${max} characters).`);return value.trim();}
export function password(value){requireValue(typeof value==='string'&&value.length>=12&&value.length<=128,'VALIDATION','Use a password or recovery passphrase with 12–128 characters.');return value;}
export function health(account,proxy,now=Date.now()) {
  const e=account.evidence;
  const checks=e?.checks||[account.ownership===true?true:null,null,null,null,null];
  const stale=!!e&&now-Date.parse(e.checkedAt)>300000;
  const missing=checks.some(v=>v===null);
  const blocked=checks.slice(0,4).some(v=>v===false)||!proxy||account.paused||!!e?.restriction;
  let score=e?.restriction?0:stale||missing||!e?null:Math.max(1,checks.filter(Boolean).length*20);
  if(blocked&&score!==null&&score!==0)score=Math.min(50,score);
  return {score,stale,blocked,checks,label:score===null?'Unknown':score===0?e.restriction:score===100?'Healthy':score<=50?'Danger · Need Fix':'Need Optimize',tone:score===null?'unknown':score===0?'restricted':score===100?'healthy':score<=50?'danger':'optimize',source:e?.source||'Unverified',checkedAt:e?.checkedAt||null};
}
export function redactAccount(a,proxy,lease,days){const {vault,...record}=a;return {...record,firstVerifiedAt:null,hasProtectedDetails:!!vault,health:health(a,proxy),connection:!a.evidence?'Not connected':Date.now()-Date.parse(a.evidence.checkedAt)>300000?'Stale':a.evidence.connection||'Unknown',proxy:proxy?{id:proxy.id,name:proxy.name,endpoint:proxy.endpoint,status:proxy.status,source:proxy.source,checkedAt:proxy.checkedAt,provider:proxy.provider||null,targetCountry:proxy.targetCountry||null,targetCity:proxy.targetCity||null,expectedIp:proxy.expectedIp||null,observedIp:null,observedCountry:null}:null,lease,activeDays:days};}

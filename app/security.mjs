import { randomBytes, scrypt, timingSafeEqual, createHash, createCipheriv, createDecipheriv } from 'node:crypto';
import { promisify } from 'node:util';
const derive = promisify(scrypt);
export const token = () => randomBytes(32).toString('base64url');
export const digest = value => createHash('sha256').update(value).digest('hex');
export async function passwordHash(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await derive(password, salt, 32, { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 });
  return `scrypt$${salt}$${hash.toString('hex')}`;
}
export async function passwordMatches(password, stored) {
  const [,salt,expected] = stored.split('$');
  const actual = await derive(password, salt, 32, { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 });
  return expected?.length === 64 && timingSafeEqual(actual, Buffer.from(expected,'hex'));
}
export function seal(value, key, context = 'reddit-ops-v1') {
  const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from(context));
  const data = Buffer.concat([cipher.update(JSON.stringify(value)), cipher.final()]);
  return { iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), data: data.toString('base64') };
}
export function unseal(envelope,key,context = 'reddit-ops-v1') {
  const decipher = createDecipheriv('aes-256-gcm',key,Buffer.from(envelope.iv,'base64'));
  decipher.setAAD(Buffer.from(context));decipher.setAuthTag(Buffer.from(envelope.tag,'base64'));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(envelope.data,'base64')),decipher.final()]).toString());
}
export async function backupSeal(value,passphrase) {
  const salt=randomBytes(16),key=await derive(passphrase,salt,32,{N:131072,r:8,p:1,maxmem:256*1024*1024});
  return {format:'reddit-ops-backup',version:1,kdf:'scrypt-131072-8-1',salt:salt.toString('base64'),...seal(value,key,'reddit-ops-backup-v1')};
}
export async function backupOpen(envelope,passphrase) {
  if(envelope?.format!=='reddit-ops-backup'||envelope.version!==1||envelope.kdf!=='scrypt-131072-8-1'||!['salt','iv','tag','data'].every(k=>typeof envelope[k]==='string'))throw Error('Invalid backup');
  if(Buffer.from(envelope.salt,'base64').length!==16||Buffer.from(envelope.iv,'base64').length!==12||Buffer.from(envelope.tag,'base64').length!==16)throw Error('Invalid backup');
  const key=await derive(passphrase,Buffer.from(envelope.salt,'base64'),32,{N:131072,r:8,p:1,maxmem:256*1024*1024});
  return unseal(envelope,key,'reddit-ops-backup-v1');
}

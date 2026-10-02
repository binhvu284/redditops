import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { randomBytes,randomUUID } from 'node:crypto';
import { token } from './security.mjs';
export function openStore(dir) {
  mkdirSync(dir,{recursive:true,mode:0o700});
  const keyFile=join(dir,'vault.key'),dbFile=join(dir,'ops.sqlite');
  if(existsSync(dbFile)&&!existsSync(keyFile))throw Error('Vault key missing. Restore from encrypted backup before starting.');
  if(!existsSync(keyFile))writeFileSync(keyFile,randomBytes(32),{mode:0o600,flag:'wx'});
  const key=readFileSync(keyFile);if(key.length!==32)throw Error('Vault key invalid.');
  const db=new DatabaseSync(dbFile);db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
  CREATE TABLE IF NOT EXISTS migrations(version INTEGER PRIMARY KEY);
  CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL UNIQUE,role TEXT NOT NULL CHECK(role IN ('owner','member')),password TEXT NOT NULL,disabled INTEGER NOT NULL DEFAULT 0);
  CREATE TABLE IF NOT EXISTS sessions(hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),csrf TEXT NOT NULL,expires INTEGER NOT NULL,reauth_until INTEGER NOT NULL DEFAULT 0);
  CREATE TABLE IF NOT EXISTS records(kind TEXT NOT NULL,id TEXT NOT NULL,data TEXT NOT NULL,PRIMARY KEY(kind,id));
  CREATE TABLE IF NOT EXISTS assignments(account_id TEXT NOT NULL,user_id TEXT NOT NULL REFERENCES users(id),PRIMARY KEY(account_id,user_id));
  CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY AUTOINCREMENT,account_id TEXT,actor_id TEXT NOT NULL,actor_name TEXT NOT NULL,action TEXT NOT NULL,result TEXT NOT NULL,source TEXT NOT NULL,time TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS leases(account_id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id),started TEXT NOT NULL,expires INTEGER NOT NULL);
  CREATE TABLE IF NOT EXISTS active_days(account_id TEXT NOT NULL,day TEXT NOT NULL,PRIMARY KEY(account_id,day));
  INSERT OR IGNORE INTO migrations VALUES(1);`);
  const version=db.prepare('SELECT MAX(version) AS version FROM migrations').get().version;if(version!==1){db.close();throw Error('Unsupported database schema');}
  const setupFile=join(dir,'setup-token.txt');
  if(!db.prepare('SELECT COUNT(*) n FROM users').get().n&&!existsSync(setupFile))writeFileSync(setupFile,token(),{mode:0o600,flag:'wx'});
  const all=kind=>db.prepare('SELECT data FROM records WHERE kind=?').all(kind).map(r=>JSON.parse(r.data));
  const get=(kind,id)=>{const r=db.prepare('SELECT data FROM records WHERE kind=? AND id=?').get(kind,id);return r?JSON.parse(r.data):null;};
  const put=(kind,record)=>db.prepare('INSERT INTO records VALUES(?,?,?) ON CONFLICT(kind,id) DO UPDATE SET data=excluded.data').run(kind,record.id,JSON.stringify(record));
  const transaction=fn=>{db.exec('BEGIN IMMEDIATE');try{const result=fn();db.exec('COMMIT');return result;}catch(e){db.exec('ROLLBACK');throw e;}};
  const audit=(user,account,action,result='success',source='Local')=>db.prepare('INSERT INTO audit(account_id,actor_id,actor_name,action,result,source,time) VALUES(?,?,?,?,?,?,?)').run(account||null,user.id,user.name,action,result,source,new Date().toISOString());
  return {db,key,dir,setupFile,all,get,put,transaction,audit,id:randomUUID,close:()=>db.close()};
}

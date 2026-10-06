import path from 'node:path';
import {existsSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createApp} from './server.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const LOOPBACK=new Set(['127.0.0.1','::1','localhost']);
export const USAGE=`Usage:
  redditops [start] [--port <n>] [--host <address>] [--data-dir <path>] [--origin <https-url>]
  redditops setup-key     Print the one-time first-setup key while setup is pending
  redditops --version | --help

Environment (used by cloud hosts):
  REDDIT_OPS_PORT or PORT  Port to listen on (default 4317)
  REDDIT_OPS_HOST          Interface (default 127.0.0.1; 0.0.0.0 when REDDIT_OPS_ORIGIN is set)
  REDDIT_OPS_DATA_DIR      Database and vault key folder (default <checkout>/data); keep it on persistent storage
  REDDIT_OPS_ORIGIN        Public HTTPS address, required before listening beyond this computer`;

export class ConfigError extends Error {}

// Flags override environment variables. A public interface without a public HTTPS origin is refused:
// the Host/Origin checks and Secure session cookies depend on that origin.
export function resolveConfig(argv=[],env={}){
  const args=[...argv];let command='start';
  if(args[0]&&!args[0].startsWith('-'))command=args.shift();
  const flags={};
  while(args.length){
    const flag=args.shift();
    if(flag==='--help'||flag==='-h'){command='help';continue;}
    if(flag==='--version'||flag==='-v'){command='version';continue;}
    const match=flag.match(/^--(port|host|data-dir|origin)(?:=(.*))?$/);
    if(!match)throw new ConfigError(`Unknown option ${flag}.`);
    const value=match[2]??args.shift();
    if(value===undefined||value==='')throw new ConfigError(`Missing value for --${match[1]}.`);
    flags[match[1]]=value;
  }
  if(!['start','setup-key','help','version'].includes(command))throw new ConfigError(`Unknown command ${command}.`);
  const port=Number(flags.port??env.REDDIT_OPS_PORT??env.PORT??4317);
  if(!Number.isInteger(port)||port<0||port>65535)throw new ConfigError('Port must be a whole number between 0 and 65535.');
  const origin=flags.origin??env.REDDIT_OPS_ORIGIN??null;
  if(origin){let url;try{url=new URL(origin);}catch{throw new ConfigError('REDDIT_OPS_ORIGIN must be a full HTTPS address, for example https://ops.example.com.');}if(url.protocol!=='https:')throw new ConfigError('REDDIT_OPS_ORIGIN must use https://.');}
  const host=flags.host??env.REDDIT_OPS_HOST??(origin?'0.0.0.0':'127.0.0.1');
  if(!LOOPBACK.has(host)&&!origin)throw new ConfigError(`Listening on ${host} would expose Reddit Ops beyond this computer. Serve it behind HTTPS and set REDDIT_OPS_ORIGIN=https://your-domain first.`);
  const dataDir=path.resolve(flags['data-dir']??env.REDDIT_OPS_DATA_DIR??path.join(root,'data'));
  return {command,port,host:host==='localhost'?'127.0.0.1':host,origin,dataDir};
}

export async function start(config,{log=console.log,onSignal=process.on.bind(process),exit=process.exit}={}){
  const app=createApp({dataDir:config.dataDir,port:config.port,host:config.host,publicOrigin:config.origin});
  let local;try{local=await app.listen();}catch(err){await app.close().catch(()=>{});throw err;}
  log(`Reddit Ops is running: ${config.origin||local}`);
  if(config.origin)log(`Listening on ${config.host}:${new URL(local).port} behind ${config.origin}.`);
  log(existsSync(app.store.setupFile)?'First setup: open the address above and enter the one-time key (run "redditops setup-key" to show it).':'Sign in with your workspace email and password.');
  log(`Data: ${config.dataDir}. Press Ctrl+C to stop.`);
  let stopping=false;
  for(const signal of ['SIGINT','SIGTERM'])onSignal(signal,async()=>{if(stopping)return;stopping=true;log('Stopping Reddit Ops…');await app.close();exit(0);});
  return app;
}

export function setupKey(config){
  const file=path.join(config.dataDir,'setup-token.txt');
  return existsSync(file)?readFileSync(file,'utf8').trim():null;
}

export async function run(argv,{env=process.env,log=console.log,error=console.error,exit=process.exit}={}){
  let config;
  try{config=resolveConfig(argv,env);}catch(err){if(err instanceof ConfigError){error(`${err.message}\n\n${USAGE}`);exit(2);return;}throw err;}
  if(config.command==='help'){log(USAGE);return;}
  if(config.command==='version'){log(JSON.parse(readFileSync(path.join(root,'package.json'),'utf8')).version);return;}
  if(config.command==='setup-key'){const key=setupKey(config);if(key)log(key);else log('Setup is complete or has not started yet; no setup key is pending.');return;}
  try{return await start(config,{log,exit});}
  catch(err){
    if(err?.code==='EADDRINUSE'){error(`Port ${config.port} is already in use. Reddit Ops may already be running at http://127.0.0.1:${config.port} — open it, stop the other process, or use --port <n>.`);exit(1);return;}
    if(err?.code==='EACCES'){error(`Permission denied for ${config.host}:${config.port}. Choose a port above 1024.`);exit(1);return;}
    error(err?.message||String(err));exit(1);
  }
}

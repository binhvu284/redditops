#!/usr/bin/env node
// `redditops` command: identical on Windows, macOS, Linux and cloud hosts (via `npm link`, `npm start`
// or `node bin/redditops.mjs`). The version check runs before any module that needs node:sqlite loads.
import {existsSync,readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const [major,minor]=process.versions.node.split('.').map(Number);
if(major!==22||minor<14){
  console.error(`Reddit Ops needs Node.js 22 (22.14 or newer, below 23); found ${process.versions.node}. Install Node.js 22 LTS from https://nodejs.org/ and run "redditops" again.`);
  process.exit(1);
}

// node:sqlite is experimental in the verified Node 22 runtime (documented in the runbook). Hide only that
// known notice so it is not mistaken for an error; every other warning is still printed.
const printWarning=process.listeners('warning')[0];
process.removeAllListeners('warning');
process.on('warning',warning=>{if(warning.name==='ExperimentalWarning'&&/SQLite/i.test(warning.message))return;if(printWarning)printWarning(warning);else console.error(warning);});

// Prefer the Reddit Ops checkout that contains the current folder, so `redditops` runs the folder you opened.
function checkoutFrom(start){
  for(let dir=path.resolve(start);;dir=path.dirname(dir)){
    const manifest=path.join(dir,'package.json');
    if(existsSync(manifest)&&existsSync(path.join(dir,'app','launcher.mjs'))){
      try{if(JSON.parse(readFileSync(manifest,'utf8')).name==='reddit-ops')return dir;}catch{}
    }
    if(path.dirname(dir)===dir)return null;
  }
}
const root=checkoutFrom(process.cwd())||path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const {run}=await import(pathToFileURL(path.join(root,'app','launcher.mjs')).href);
await run(process.argv.slice(2));

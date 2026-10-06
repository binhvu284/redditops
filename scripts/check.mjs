import {readdirSync} from 'node:fs';import {spawnSync} from 'node:child_process';
for(const dir of ['app','bin','web','scripts','tests'])for(const file of readdirSync(dir)){if(/\.(mjs|js)$/.test(file)){const result=spawnSync(process.execPath,['--check',dir+'/'+file],{stdio:'inherit'});if(result.status)process.exit(result.status);}}
console.log('PASS: JavaScript module syntax.');

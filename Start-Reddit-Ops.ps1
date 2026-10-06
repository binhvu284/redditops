$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Install the supported Node 22 runtime before starting Reddit Ops.' }
# Same entry point as the `redditops` command and `npm start`.
node bin/redditops.mjs @args

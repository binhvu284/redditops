$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Install the supported Node 22 runtime before starting Reddit Ops.' }
Write-Host 'Reddit Ops: http://127.0.0.1:4317'
Write-Host 'First setup key: data/setup-token.txt. Keep this file private.'
node app/server.mjs

# RO-DEMO-001 — standalone interactive UI prototype

Date: October 1, 2026. Class: frontend demo. State: requested prototype completed locally and browser-verified; owner design acceptance not recorded.

## Scope and authority

Thomas explicitly requested a UI demo file after the planning task. Deliver one offline HTML prototype, not the production application. Root AGENTS, README, current checkpoint and USER_FLOWS reread. No engineering skills activated; communication uses the previously requested ADHD style. No dependency install, framework scaffold, server, infrastructure, real Reddit accounts, secrets, platform calls, commit or push. No parallel agents or private-memory edits.

## Checkout

The supplied workspace still has no .git. `git rev-parse --show-toplevel` and `git remote -v` again reported not a Git repository. Actual remote source/branch/SHA/dirty state remain unavailable. This user-authorized local prototype is saved beside the planning artifacts; it does not claim implementation in a verified repository.

## Files and decisions

- `demo/reddit-ops-demo.html`: self-contained HTML/CSS/JavaScript, five navigation screens, synthetic accounts/clients, in-memory state and no external assets. System UI typography avoids font installation/network access; neutral application mark replaces the uncleared Reddit logo.
- `demo/preview-desktop.png`, `demo/preview-mobile.png`: actual browser screenshots, visually inspected.
- `demo/.qa/verify.cjs`: local verification harness using the existing bundled Playwright package and installed Edge; not an application dependency or a portable package setup.
- README/current-work/lessons updated for the demo state; previous scope/architecture/backlog remain proposals.

Interactions: add existing demo record with permission attestation and duplicate validation; add client; account/client search and filters; account detail; pause/review/recheck/explicit resume; sourced activity; notification issues; backup/restore flow preview; simulated failed refresh with loaded content retained/retry; empty state; fixture reset. Every account is synthetic and platform state remains unknown. Changes are intentionally memory-only and reset on reload. Reset also clears newly added clients and restores activity fixtures. Backup/restore never export, encrypt or read a file.

## Verification

Existing runtime discovered through `load_workspace_dependencies`; Node and bundled Playwright used without installing anything. Existing Edge launched headless with TEMP/TMP redirected to this workspace's `demo/.qa` on D. Browser automation opens the real HTML `file:` URL; no service started.

Exact local command from workspace root:

```powershell
$env:TEMP = Join-Path (Get-Location).Path 'demo/.qa'
$env:TMP = $env:TEMP
node demo/.qa/verify.cjs
```

PASS: desktop/mobile navigation, status filtering, search empty result, duplicate username feedback retaining input, safe escaped HTML-like input, account add, pause, required review checkbox, asynchronous local recheck, explicit resume, client add/filter, activity, both preview dialogs and Escape, failed refresh preserving rows/retry, empty state, fixture reset including clients and reload reset. No JavaScript page errors and no HTTP(S) requests. No page overflow at 390/768/1440px; wide account table has its own deliberate scroll area. Desktop/mobile screenshots inspected. Native dialog provides focus trapping and keyboard close; this is not a full accessibility audit.

No application build/lint command exists: standalone HTML was tested by executing its actual browser interactions. This is demo behavior evidence, not durable persistence, secure operator login, encrypted backup, live integration or product acceptance evidence.

## Retrospective and next action

Worked: one HTML file makes the planning flow reviewable without new dependencies. Initial mobile screenshot captured transient keyboard focus/toast state; reloading before final viewport capture produces a cleaner review artifact. Improvement: preserve clean initial screenshots separately from interaction assertions.

Next: Thomas opens the HTML and tries Add account or Resolve, then selects UI changes. Actual application work still requires checkout reconciliation and separate authorization.

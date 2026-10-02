# RO-PROXY-UX-001 — proxy-first account operations UX

## Authorization and scope

October 2, 2026. Thomas approved rebuilding the local MVP around the audited Proxy → Accounts → Safeguard flow. Implement guided UI, persistent local configuration, truthful capability responses and an isolated Mock walkthrough. No real proxy probes, Reddit login, deployment, purchases, dependency/skill installation, parallel agents, commit or push. Preserve operator data and the standalone prototype.

Checkout verified: unborn `main`, origin `https://github.com/binhvu284/redditops.git`. No base commit exists; pre-existing files are untracked, so there is no HEAD-based task diff.

## Accepted decisions

- Pilot one personal Thomas account; provider-owned fixed US IP is acceptable, not necessarily exact office IP.
- First 24 hours means elapsed time from first verified managed connection, not continuous uptime or account safety.
- Sign in directly in a separate Reddit browser, without a Reddit password form in Ops.
- Future network enforcement must block on proxy failure without direct fallback, retain the window where possible and require successful recheck plus deliberate Continue. Current enforcement is simulated only.
- Safeguard prioritizes each account, followed by issues, evidence and recovery. Initial history covers internal events and manual reports, not automatic capture of every Reddit action. Employees and AI diagnosis follow later.

## Implemented scope and contracts

`web/operations.js`, `web/app.js`, `web/app.css`: route cards, three-step wizards, workflow progress, account milestones, per-account Safeguard filters/issues and an in-memory Mock workspace. Existing login, permissions, assignment, archive/history, manual reports, protected fields and backups remain available. Reuse existing Manrope/indigo/mint/coral styling; no new framework or dependencies.

`POST /api/proxies` adds provider, requested US city/country and optional expected IP to local configuration. Reject credentials/query strings in endpoints and invalid IPs. `POST /api/proxies/:id/configure` is owner-only; editing pauses linked local accounts, invalidates connection observations, releases manual reservations and retains restriction notices. Existing records need no database migration. Proxy authentication credentials await an adapter; the wizard does not collect them. Existing protected account fields are retained.

Permission-scoped `POST /api/proxies/:id/check` and `POST /api/accounts/:id/open` return `409 CAPABILITY_UNAVAILABLE`, without network probes or Reddit browser launch. `firstVerifiedAt` is projected as null until an approved integration exists; manual reports/reservations cannot start it. Health can represent labelled manual readiness while managed access remains unavailable.

Try workflow creates separate synthetic data. All preview mutations bypass the API; unsupported operations are guarded. Exit/reload discards preview records. Synthetic check/sign-in, five faults, blocked session state, deliberate recovery and 24h advancement carry Mock labels. Local SSE is labelled local updates, separate from route health.

## Verification

Existing Node 22.14.0 and Playwright/Edge; profiles, fixtures and screenshots under ignored `.qa/` on D.

```powershell
& 'D:\NodeJS\node.exe' scripts/check.mjs
& 'D:\NodeJS\node.exe' --test --test-concurrency=1 tests/*.test.mjs
& 'D:\NodeJS\node.exe' scripts/build.mjs
& 'D:\NodeJS\node.exe' scripts/browser-check.mjs
& 'D:\NodeJS\node.exe' scripts/workflow-browser-check.mjs
```

Final verification: all eight API/domain/security/events/recovery tests passed together; the two focused workflow tests passed again after Mock alert refinements. Both existing and new Edge browser gates passed. Coverage includes pending local setup, manual coordination, protected fields/remask, member permissions, full Mock sign-in, five latched failures with deliberate recovery, IP/country gates, route editing without duplicate records, preserved operator search, Mock alerts, keyboard and 375/768/1440px in both themes. The mobile setup dialog is asserted within the actual viewport. Zero external requests and zero Mock API writes. Syntax/build passed; packaged application separately served HTML, both browser modules, CSS and font from an isolated data directory.

Screenshots `.qa/workflow-{proxy,accounts,safeguard,detail,mobile-wizard}.png`; desktop and mobile versions visually inspected. Fixture evidence is not evidence of real proxy or Reddit operation.

Local runtime: started the existing application/data directory at `http://127.0.0.1:4317` (PID 24144 at verification); HTML and operations module returned HTTP 200. The old runtime was not responding; no existing process was killed and no operator records were reset. Start-Process interpreted the bracketed working directory as a wildcard; retried with a literal .NET ProcessStartInfo and hidden window. Opening the review URL through Codex returned queued, not confirmation of a visible tab. No deployment, commit or push.

## Remaining boundaries and continuation

Live checks, provider credential adapter, browser launch/profile management and real network blocking remain Unavailable. No automatic Reddit activity capture, AI diagnosis or control of browsers outside Ops. Owner acceptance and employee remote access remain open.

Next: Thomas reviews Proxy → Try workflow, then approves the provider/companion integration scope as a separate task. Local UI implementation is complete; owner acceptance and real connection activation are distinct pending states.

## Retrospective

Worked: reused audited source and current application without replacing it with a mock product. Wasted effort: the old browser selector assumed a bare proxy label. Improvement: test zero Mock writes, latched recovery and preservation of restriction notices through proxy edits.

## Browser annotation follow-up — breadcrumb progress

October 2, 2026: replaced the four detached workflow cards with a single breadcrumb progress strip in `web/operations.js` and `web/app.css`. Chevron separators connect the steps; the current step has an indigo pill and `aria-current="step"`; completed steps use green. Narrow screens scroll the strip internally without expanding the document. This remains a progress indicator and adds no navigation or connection behavior.

Verification: `scripts/build.mjs` passed syntax/build; `scripts/workflow-browser-check.mjs` passed the existing interaction and responsive checks in both themes. Visually inspected the refreshed `.qa/workflow-proxy.png`. No operator data changes, dependency installation, deployment, commit or push.
# RO-PROXY-001 — Local proxy connectivity

## Outcome and authority

October 2, 2026: Thomas deferred cloud hosting and requested proxy connectivity first. Full-stack local implementation, retaining the existing Node/SQLite application. Base: `main` at `7567b335f5c828eaceb6c05bea83542126890f55`, verified origin `https://github.com/binhvu284/redditops.git`. Prior cloud research documents remain unrelated local edits and are preserved.

No provider purchase, credentials in chat, real Reddit operations, browser automation against Reddit, cloud services, deployment, dependencies/skills, parallel agents, commit or push. No operator database reset or restore. The communication skill `i-have-adhd` follows the owner's default; technical work uses ordinary project rules.

## Implementation

- `app/proxy.mjs`: HTTP/HTTPS CONNECT and SOCKS5, optional authentication, fixed HTTPS diagnostic destination, verified TLS, public-only/pinned DNS, 12-second operation deadline, bounded responses and no direct fallback. Provider failure messages are sanitized. Country/IP readiness and baseline pinning are separate from account authorization.
- `app/server.mjs`: encrypted per-proxy vault, owner configuration/reauthentication, permission-scoped checks with explicit consent, concurrency/cooldown, opt-in 60-second monitoring while running, persisted source/time/outcomes, safe result invalidation after edits/revocation and latched account pause. Portable restore rekeys proxy credentials and disables monitoring/invalidates observations. No schema migration required.
- `app/domain.mjs`: live route failure/unknown/stale gates local readiness/resume/reservation once a route has been probed or monitoring enabled. Legacy unprobed manual readiness remains explicitly manual and never grants browser access. Restriction evidence is retained; proxy errors never create Banned/Suspended evidence.
- `web/proxy-ui.js`, `web/operations.js`, `web/app.js`, `web/app.css`: existing wizard design reused, authentication input/retention and workspace confirmation, explicit network consent, optional monitoring, country/IP/source/time results and actionable failures. Mock stays isolated and performs no API mutations.
- `tests/proxy.test.mjs`, synthetic localhost TLS fixtures and `scripts/proxy-browser-check.mjs`: actual transport tests against local tunnel fixtures, API/security/recovery tests and an isolated browser walkthrough. Existing workflow expectations now reflect available backend diagnostics.

## Acceptance and evidence

Implementation scope: owner can save encrypted provider configuration, explicitly probe a public endpoint, see trustworthy point-in-time diagnostic observations, monitor on opt-in, associate accounts and block local coordination on required route failures. No real provider has been supplied/verified yet. Browser routing/Reddit authentication and the account 24-hour connection milestone remain unavailable.

Commands use existing Node 22.14.0 on D; fixtures, browser profiles and screenshots use ignored `.qa/`. Full suite passed 13/13. Focused proxy suite passed 5/5 after public-address and in-flight permission refinements; the final monitor sweep refinement was also checked with that focused suite. Native HTTP/HTTPS/SOCKS5 transports, certificate rejection, auth failures, oversized/invalid/redirect responses, deadlines, mixed DNS, secret redaction/encryption, portable key recovery, stale/fail gates, pinned-IP latching, edited-result invalidation and member revocation during a check passed.

All three Edge gates passed: the new proxy wizard, the existing owner/member/recovery gate, and the isolated Mock workflow. Sizes 375/768/1440 and both themes passed, with zero external browser requests/JS errors and zero Mock writes. The old browser gate assumed manual evidence could override a failed proxy; updated its synthetic fixture to assert 50%-capped failure, successful recheck, latched pause, deliberate Resume and then a reservation. Desktop/mobile diagnostic screenshots in `.qa/proxy-live-fixture-{desktop,mobile}.png` were visually inspected; they use synthetic results, not a real provider.

```powershell
& 'D:\NodeJS\node.exe' --test --test-concurrency=1 tests/*.test.mjs
& 'D:\NodeJS\node.exe' --test --test-concurrency=1 tests/proxy.test.mjs
& 'D:\NodeJS\node.exe' scripts/proxy-browser-check.mjs
& 'D:\NodeJS\node.exe' scripts/browser-check.mjs
& 'D:\NodeJS\node.exe' scripts/workflow-browser-check.mjs
& 'D:\NodeJS\node.exe' scripts/build.mjs
git diff --check
```

Syntax/build and diff whitespace checks passed. No existing local listener was found on port 4317, so started this checkout's server in a hidden process (PID 10256 at verification), preserving the existing `data/ops.sqlite`/key. Bootstrap and `/proxy-ui.js` both returned HTTP 200. This verifies local serving, not authenticated real-provider connectivity. No actual provider requests were sent by the implementation verification; only local fixtures were used. No commit/push or cloud deployment.

## Remaining work and next action

Thomas enters an owned provider's connection details in Proxy → Add proxy and performs an explicitly consented diagnostic. Exact provider compatibility, real egress/geolocation, quotas and operating availability remain unverified. No claim of permanent US office identity or protection against bans. Then separately implement a reviewed managed-browser adapter; do not treat server diagnostics as evidence that an ordinary browser tab is routed.

Cloud selection/research remains saved in [RO-CLOUD-001](RO-CLOUD-001.md); hosting stays deferred. See [runbook](../../MVP_RUNBOOK.md) for the current proxy contract and failure/recovery flow.

## Retrospective

Worked: native local proxy/TLS fixtures prove the traffic actually traverses each adapter, with no package installation. Wasted effort: the installed OpenSSL is older and does not support `-addext`; used a fixture config instead. Improvement: keep synthetic localhost fixture trust separate from production TLS and test no direct fallback, permission changes and portable credential recovery explicitly.

# RO-MVP-001 — self-hosted MVP implementation

## Authorization and checkpoint

October 1, 2026. Thomas requested building the MVP and explicitly selected a self-hosted web application with login/team authorization, tested locally without deployment. This supersedes the earlier planning/demo-only implementation boundary. No live Reddit accounts, cloud services, deployment, skill installation, parallel agents, commit or push.

## Repository evidence

GitHub repository metadata is accessible through the GitHub connector. `git ls-remote https://github.com/binhvu284/redditops.git` completed with no refs; the GitHub branches API returned an empty array. The remote is verified empty at this checkpoint, unlike earlier inaccessible-repository evidence. Initialized the existing workspace as an unborn main checkout, preserving documentation/demo, and attached origin to the verified URL. A Windows ownership mismatch requires per-command `git -c safe.directory=...`; no global trust exception was added. No revision exists yet.

## Decisions

- Current source had no application manifests or tests; only the standalone HTML prototype. New app source: `app/`, `web/`, `tests/`, `scripts/`, root `package.json`.
- Use existing Node 22.14.0 and built-in SQLite for the bounded local-tested MVP; no dependencies installed. This is a deliberate departure from the unimplemented Next/Nest/PostgreSQL planning baseline. SQLite API is experimental in this Node version. Large-scale deployment is not accepted by these checks.
- Same-origin application bound to `127.0.0.1`; password login, per-account owner/member permissions and transactions are enforced by the backend. Up to five active members. Remote TLS/reverse-proxy operation remains unconfigured and must be reviewed before deployment.
- Reuse the approved Manrope/colorful CRM appearance without treating demo role switching, synthetic records or secret masking as real functionality. New workspaces contain no seeded accounts.
- Local registry and activity updates are real. Account observations are Manual reports; external connection/proxy/identity checks and companion launch remain Unavailable. No network calls to Reddit or proxy endpoints.

## Implemented scope

Database schema/version marker, password hashing, revocable sessions, CSRF/Origin/Host checks, first-run setup token, account/client/proxy records, assignments, archive/history, encrypted protected fields and password reauthentication; readiness projection, manual evidence, pause/resume, one-account manual reservations, activity-day counting, redacted audit, in-app attention records and same-origin event stream; encrypted backup and validated/transactional restore.

Frontend has guided setup/login, all seven routes, detail tabs, quick filters, owner forms, manual checklist, member restrictions, password confirmation and field remask. Changes remain local and uncommitted.

## Verification and final state

`node scripts/check.mjs` passes syntax checks. `node --test --test-concurrency=1 tests/mvp.test.mjs` passes two tests containing Health and complete API security/persistence/recovery scenarios. Initial Host assertion used fetch, which ignored the custom Host header; corrected the test to use raw HTTP and verified actual server rejection.

`node scripts/browser-check.mjs` passed against the application, using existing Playwright/Edge, fixture data and temporary files on D. Covers setup/login, client/proxy/account forms and reload persistence, current manual checklist, manual handoff, encrypted field storage and 20-second remask, team assignment/member UI scope, seven routes/four detail tabs at 375/768/1440 in both themes. No JavaScript errors or external requests. Screenshots `.qa/mvp-{overview,accounts,detail,mobile}.png` inspected; account-client wrapping was corrected from that evidence. Setup timing and select accessible-name failures in the browser gate were diagnosed and fixed rather than weakening the gate.

Final API suite: six tests/scenarios in `tests/{mvp,recovery,events,deployment}.test.mjs`. Core five passed together; the final optional HTTPS configuration test passed after that isolated change. Coverage includes 15-record registry, real internal SSE event, permissions/CSRF/Origin/Host, redaction, restart persistence, single-account claim race, inactive/expired reservation handling, restriction clearing authority, wrong/corrupt backup, portable recovery between independent directories/keys and transactional restore rollback. Canonical-origin configuration rejects non-HTTPS/mismatched Host/Origin and sets Secure cookies; no actual TLS proxy was deployed.

`node scripts/check.mjs` and `node scripts/build.mjs` pass. Build copies only app/UI/font/license/runtime manifest to ignored `dist/`; no keys, data or demo accounts. Local server started at http://127.0.0.1:4317 with an unclaimed new workspace and no seeded accounts. Setup token is kept locally and was not read into chat. Current source remains uncommitted on unborn main; no remote changes/deployment.

Final menu pass preserves the accepted trailing three-dot menu (Detail/Activities/Delete), keyboard Escape/arrows and member-disabled Delete, verified in the latest browser run. The packaged application was separately started from `dist/app/server.mjs` with an isolated fixture directory: HTML, script, CSS, font, license and first-run API all served successfully without installed dependencies.

The [runbook](../../MVP_RUNBOOK.md) records actual commands, security/key recovery, capabilities and deployment limits. Updated README/current work/canonical scope/architecture/flows/backlog. Original AGENTS.md and supplied brief remain unchanged. First owner acceptance still pending.

## Remaining capability boundaries

Node SQLite is experimental in the tested Node 22.14 runtime. The original Next/Nest/PostgreSQL proposal and broad production gates are not claimed complete. Live Reddit checks, approved OAuth, real proxy probes and supported browser companion remain Unavailable; the implemented lock is a manual coordination reservation, not an enforced browser session. No external account operations. Password change/invitation delivery and large-history recovery are open. OS key ACL and real TLS/proxy supervision need review before online deployment.

## Retrospective

Worked: reused accepted UI styling while rebuilding authorization/persistence as server-owned behavior, with fixtures proving failures rather than relying on demo screenshots. Wasted effort: browser tests initially advanced before async setup completed and relied on ambiguous select labels. Improvement: explicit form progress/accessibility labels and separate portable-directory/rollback tests; no change to project policy or skill routing.

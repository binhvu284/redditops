# Reddit Ops MVP — run and recover locally

## Current release

Version 0.1.0, October 1, 2026. Functional self-hosted application tested on local loopback with one owner, up to five active members and a fifteen-account fixture. Uses Node 22.14.0 and built-in SQLite, with no npm dependencies. The SQLite API is experimental in this runtime. This is a local-tested MVP, not an accepted internet production deployment.

Daily screens retain the approved CRM visual direction. `demo/reddit-ops-demo.html` remains a separate synthetic prototype; it is not the application and does not save real records.

## Start and first setup

From the repository root, run `npm start` (or `node app/server.mjs`), then open **http://127.0.0.1:4317**. Use the exact 127.0.0.1 URL; other Host values are rejected. Windows users can also use `Start-Reddit-Ops.ps1`, which prints the URL and keeps the server in that terminal until Ctrl+C.

First launch creates `data/ops.sqlite`, `data/vault.key` and `data/setup-token.txt`. Read the setup key locally and paste it into the first-run form; choose your own email/password. The key is single-use and removed after setup. No default password or pre-created owner exists. Do not share the key or paste it into chat.

Do not move, remove or edit `data/vault.key`; protected fields rely on it. Keep the data directory private to the OS user. Unix file modes are requested, but Windows access control follows the host directory ACL; this implementation does not configure Windows credential protection. The key is excluded from Git, ordinary API responses, logs and release builds. Disk/OS compromise is outside this application's vault boundary.

Use `REDDIT_OPS_DATA_DIR` for a different local data directory and `REDDIT_OPS_PORT` for a different loopback port. Keep both on D on this machine. Initial setup and daily use require no database or infrastructure commands.

## Daily operation

1. Add clients and proxy routes from their screens. The Proxy wizard supports HTTP/HTTPS CONNECT and SOCKS5 backend diagnostics; see the local proxy workflow below. Saving alone leaves the route Unknown.
2. Add existing accounts and attest management authorization. New accounts start Not connected/Unknown. Assign client, required proxy and members from account Summary → Edit assignment / route.
3. Use Safeguard → Record manual checklist. Unknown is a valid outcome. A restriction needs a notice reference; an unstated cause remains Unknown. Rechecks cannot silently clear a restriction. Only the owner may record a correction with a superseding reference.
4. Resolve essential blockers, then Resume deliberately. Reserve a manual handoff to coordinate human use; requests for the same account remain exclusive. The reservation is not a browser session and does not authenticate or enforce a proxy. Browser companion launch remains Unavailable.
5. Review scoped activity and in-app attention items. Archive from the account menu by typing the name; it stops registry work/reservations and retains audit history, without deleting the Reddit account.

Health measures five equal operational checklist groups. Missing or stale evidence withholds a percentage; essential failures cap known scores at 50. Zero is reserved for restriction evidence. Manual reports, including 100%, do not establish live platform facts or ban immunity. Evidence becomes stale after five minutes. Active days count distinct system-recorded manual handoff dates in Asia/Ho_Chi_Minh, not Reddit account age.

Members sign in with their own workspace credentials and only access assigned active accounts, related client/proxy data, alerts and activity. Owner-only actions are enforced server-side, including assignment, archive, team management, secrets and recovery. Member revocation invalidates sessions and reservations. Password changes/invitation delivery are not yet implemented; the owner creates initial member credentials privately.

Protected details support login email, optional OAuth token and proxy password; do not collect Reddit passwords. The owner confirms their workspace password before storage/reveal. General APIs omit protected field values; single-field reveal re-hides after 20 seconds or blur/navigation. This does not grant approved OAuth capability.

## Backup and restore

Workspace → Recovery & system → Export backup → confirm owner password → choose and repeat a separate recovery passphrase (12–128 characters). The downloaded JSON is an AES-256-GCM encrypted envelope with scrypt key derivation. It includes registry, team password hashes, assignments, days, audit, encrypted secrets and a recovery key inside the encrypted payload; sessions and active reservations are excluded. Keep the passphrase separately. Do not upload backups to third-party services through this MVP.

Workspace → Recovery & system → Restore backup → confirm owner password → select the file/passphrase → validate preview → type RESTORE. Restoration replaces local records atomically, revokes sessions, clears reservations, invalidates observations and pauses accounts. Proxy credentials are rekeyed too; proxy monitoring is turned off and prior diagnostic observations are invalidated. Sign in again; record fresh checks and Resume deliberately. Wrong passphrase/corruption/invalid references fail without replacing data. A failed transactional write rolls back to the prior database.

Portable recovery: start a fresh data directory, complete first setup with the **same owner email**, then import the encrypted backup. Current owner credentials are retained; team credentials come from the backup. Protected records are decrypted with the enclosed recovery key and re-encrypted with the new machine's key. Tested using independent directories/keys, not a second physical machine. If the original key is missing, startup fails safely; recover into a fresh directory rather than replacing the key in place.

Preview is session-bound and expires after five minutes; password confirmation lasts one minute. If it expires, re-confirm the password and validate again. Backups currently use a 4 MB browser upload / 5 MB request limit; large-history retention and streamed recovery need a later item. Restore retains historical event IDs/actor references and does not present historical actors as active sessions.

## Verification and release artifact

```powershell
npm run check
npm test
npm run build
node scripts/browser-check.mjs
```

Browser verification uses the existing local Edge/Playwright installation; this developer tool is not a runtime dependency and its paths are machine-specific. Tests use disposable directories in `.qa`, synthetic credentials and documentation-reserved endpoints. They do not operate on user data or Reddit.

Build produces `dist/` with app/UI/font/license files and its own start manifest; no keys, data, tests or demo fixtures. Start with `node dist/app/server.mjs` (a distinct first-run data directory). No Git commit/push or deployment performed by this task.

## Deployment boundary and sources

Server intentionally binds only loopback with strict Host/Origin checks; cookies are HttpOnly/SameSite Strict, without Secure on local HTTP. For a future TLS-terminating same-host reverse proxy, `REDDIT_OPS_ORIGIN=https://your-reviewed-host` configures the canonical Host/Origin checks and Secure cookies; the proxy must preserve Host and the browser's Origin. Non-HTTPS public origins are rejected. No forwarded header is blindly trusted. This configuration contract is tested with synthetic HTTP headers; a real proxy/TLS deployment is not tested or activated. Before online team deployment, configure TLS/proxy, deployment-managed vault key/OS permissions, operational backups, supervision and an independent security review. No Supabase/Vercel interaction or public hosting is configured.

Chosen security primitives use the existing [Node crypto APIs](https://nodejs.org/docs/latest-v22.x/api/crypto.html); password hashing follows the scrypt alternative in [OWASP password storage guidance](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html). Session design was checked against [OWASP session management guidance](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html). These sources informed implementation; they do not certify this product.

Cloud hosting is deferred by Thomas. Next integration: verify an operator-provided proxy through the UI, then design the separate managed browser/profile connection. Live Reddit/platform approval and browser enforcement remain unavailable.

## Local proxy workflow — RO-PROXY-001

1. Proxy → Add proxy: enter provider, route name, public hostname/IP, port and protocol. Select No credentials / provider IP allowlist, or Username & password. Enter credentials in the app, never chat. Owner workspace-password confirmation is required for storing/changing credentials or editing a credential-bearing route. They are encrypted using the existing vault; the API never returns username, password or the encrypted envelope.
2. Optional monitoring: enable the 60-second checkbox and its diagnostic-consent checkbox. It operates only while the local backend runs. Otherwise checks are manual; saving a route does not send traffic. The diagnostic uses a fixed HTTPS destination, `www.cloudflare.com/cdn-cgi/trace`, through the selected proxy; no Reddit requests are made.
3. On Check route, confirm the one-request consent and press Check connection. The full DNS/tunnel/TLS/response operation has a 12-second deadline, a bounded response size and no direct fallback. The public proxy destination is validated and its DNS result pinned; private/reserved destinations and mixed public/private DNS answers are blocked. TLS certificates are verified. Redirects are rejected, not followed.
4. Read the exit IP, country, last-check time, source and recovery message. Available requires a reported US country and the expected/pinned IP. Without an expected IP, the first successful US probe pins a baseline; it is retained through edits and failures. Unknown country, changed IP, wrong country, authentication/network/TLS failures remain explicit. Exact city/office identity and long-term IP stability are not verified. HTTP/SOCKS5 username/password travel unencrypted to the proxy; prefer HTTPS transport when the provider supports it.
5. Assign the route to an account record using the existing account setup. A failed or older-than-five-minute probe blocks local resume/reservation and pauses linked accounts; manual reports cannot override failed route evidence. A successful recheck does not automatically resume an account. Keep the remaining checklist current and deliberately Resume. This controls local registry reservations, not external browsers: managed Reddit sign-in and browser kill-switch enforcement still require a companion integration. Account connection/24-hour milestone are not started by a proxy probe.

Only the owner edits connection details; assigned members may trigger diagnostics for their assigned routes. Checks are capped at three concurrent routes, one check per route, with a ten-second per-route cooldown. Configuration/permissions are revalidated when a result completes. Internal SSE refreshes observations; repeated account-pause events are deduplicated. Stopping the app stops monitoring; downtime has no observations and becomes Stale on the next use.

Sources: [Node 22 HTTP CONNECT](https://nodejs.org/download/release/v22.14.0/docs/api/http.html), [Node TLS](https://nodejs.org/docs/latest-v22.x/api/tls.html), [SOCKS5 RFC 1928](https://www.rfc-editor.org/rfc/rfc1928), [username/password RFC 1929](https://www.rfc-editor.org/rfc/rfc1929), and [Cloudflare diagnostic endpoint](https://developers.cloudflare.com/fundamentals/reference/cdn-cgi-endpoint/). The trace response is best-effort diagnostic data, not a contracted geolocation API or an availability guarantee; missing/malformed fields do not pass the readiness gate. Local fixtures test transports and failure handling; a real operator-provider connection is not yet verified.

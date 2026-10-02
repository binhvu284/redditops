# Account operations module revision

Owner request: RO-DEMO-004, October 1, 2026. This specification updates the requested UI organization. The HTML is a synthetic local prototype; backend delivery and approved live integration remain unimplemented.

## Navigation and current prototype

Four primary modules: Overview, Accounts, Proxy, Safeguard. Clients, workspace Activity and Settings remain secondary utilities to preserve organization and backup/recovery previews.

| Module | Requested responsibility | Present prototype behavior |
| --- | --- | --- |
| Overview | Current account situation | Local readiness charts plus distinct connection, proxy-failure and mock-ban summaries; links to review modules |
| Accounts | Current records, add account, connection, proxy and details | Illustrated mock/system avatars; connection evidence; enabled/off proxy configuration and endpoint; masked synthetic login/token/proxy fields with Show/Hide; account Activities |
| Proxy | Routes, assigned accounts and operational status | Three synthetic endpoints, Available/Failed/Not checked fixtures, assignments, source/time and bounded mock recheck |
| Safeguard | Qualification review, risk, restriction causes and logs | Permission/auth/route/restriction/freshness checklist; Unknown/Needs review/Banned groups; synthetic notice SG-M005 with a stated synthetic cause; account-scoped review logs |

Avatar requirements for production: use the account avatar only through a permitted, verified integration, with source/update timestamp; fall back to a local system silhouette when absent or failed. Do not fetch arbitrary URLs blindly. The prototype embeds original synthetic illustrations and a system silhouette without external requests. No real Reddit avatar is fetched.

Enabled proxy configuration, route availability, browser routing, connection validity, local pause and restriction evidence remain separate. Proxy availability cannot establish which account/browser is active. The proxy display uses reserved documentation addresses and no network traffic.

## Account details and sensitive information

The demo's email, password, token and proxy secrets are readonly synthetic examples, masked initially and when reopening. Closing remasks fields. Values exist in the static HTML/browser; this is not a secure vault. No real credentials should be entered. A details dialog keeps account/client identity visible and links to account-only activities.

Production design: prefer approved OAuth over collecting Reddit passwords. Display login identifier, authorized account/scopes, expiry and protected secret references. Password vault functionality is optional and requires a justified supported workflow and a security review before implementation. Encrypt secrets at rest with external key protection; authenticate the operator and reauthenticate before permitted reveal. Return a single authorized field only on explicit reveal; remask on timeout, blur/lock and navigation. Disable caching, exclude secrets from client storage, URLs, logs, screenshots and exports. Audit the reveal decision/actor/field identifier without its value. UI masking alone does not secure anything.

## Continuous activity requirement

The production requirement is continuous ingestion of supported, approved observations while the local service is running. It does not imply access to every activity performed elsewhere on Reddit, nor guaranteed monitoring while the computer/service is off. Capability and event coverage must be established in RO-L01 before live work.

Proposed flow: approved adapter or explicitly labeled manual observation → validated/redacted account-scoped event → durable local audit/event store → local authenticated SSE/WebSocket stream → Activities and relevant status projections. Events carry ID, cursor, actor, account/workspace/client, observed/emitted time, source, result and reason. Bound retries and retention; coordinate per account; honor pause and revoked permission. Mark gaps, stale/disconnected state and unavailable coverage explicitly. Reconnect by cursor, deduplicate, replay safely and never silently manufacture missing events. Validate live event availability/rate limits before selecting polling or subscription; no unauthorized scraping or stealth browser automation.

Current demo: opt-in timer emits one synthetic event every three seconds, rotates across accounts, and displays only the selected account's history. Disconnect stops emission; reconnect restarts simulation without claiming historical recovery. The timer skips emission while the document is hidden; reset/empty/page exit stops it. Events are memory-only and capped. Actual durable replay and backend tracking remain proposed.

## Safeguard evidence and recovery

Qualification is a checklist result with evidence source/time, not a universal safety score. Missing platform evidence remains Unknown. Generic login/proxy errors do not imply a ban. A restriction record contains scope, supplied notice/reference, stated reason or explicitly unknown reason, timestamp, source and review status. SG-M005 is a fabricated demo notice stating repeated rule violations; it is not a real restriction finding. Actual reasons must be taken from permitted primary evidence and never inferred from generic failures.

Safeguard cannot guarantee no ban. It supports early review, pause of affected system-controlled work, visible next steps, relevant rechecks and deliberate resume. A local checklist review cannot clear a platform restriction; the prototype retains the mock ban after review. Production remediation uses an authorized official process/manual handoff and avoids route changes to evade enforcement.

## Verification boundary

Browser tests establish mock avatars, show/hide/remask, scoped logs, timer receive/disconnect/reconnect/stop, preserved proxy failure, checklist/restriction retention, add connection/proxy configuration and responsive modules. They establish no encryption, real OAuth, actual proxy routing, durable audit, real-time Reddit access or ban prevention.

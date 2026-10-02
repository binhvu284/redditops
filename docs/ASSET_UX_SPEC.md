# Business asset UX — accepted owner decisions

RO-UX-005, October 1, 2026. Thomas explicitly requested implementation of the agreed plan **in the Mock demo**, not backend or live service delivery.

Later implementation authorization: RO-MVP-001 builds a separate self-hosted application with real local persistence/login/server permissions. It reuses these table/detail/Health decisions while keeping manual coordination distinct from an enforced browser companion. [Current runbook](MVP_RUNBOOK.md) is authoritative for implemented capabilities; the prototype-specific details below remain historical Mock evidence. Online deployment, live checks and companion launch are not delivered by local verification.

## Product and access

Target: Thomas plus up to five marketing members and approximately 10–15 existing authorized accounts. Production direction is an online shared dashboard with a local companion on each member's machine for isolated browser profiles. Provider, hosting, platform permission and companion implementation remain unverified/proposed; Reddit Ops must remain independent of TOBI. The current artifact is a single offline HTML with ten synthetic account assets and no real browser launch/network traffic.

Primary modules: Overview, Accounts, Proxy, Safeguard. Clients, workspace Activity and Settings are owner utilities. Members see assigned active accounts, related routes, notifications and activities. Thomas adds/manages/archives assets and controls protected fields. A role picker simulates Thomas/Maya/Leo; it is not authentication or a server-enforced security boundary.

## Accounts and detail

Table: Account (avatar/name), Connection, Proxy, Health, trailing three-dot menu. Row click/Enter opens an account detail page. Menu actions: Detail, Activities, Delete. Delete is owner-only archive confirmation showing account/client identity and explaining that Reddit itself is unchanged. Archive excludes the record from active lists/tracking, ends its mock session and retains its audit history for owner workspace Activity. Reload/reset discards the demo session, including archives.

Detail page: breadcrumb `Accounts > account`, Back restores search/filter/scroll; hash navigation identifies the account. Tabs: Summary, Connection & Proxy, Activities, Safeguard. Summary shows assignment, joined date and distinct active calendar days in Asia/Ho_Chi_Minh. Repeated sessions on the same date count once. Actual Reddit account age is not substituted for active days.

Thomas can edit simulated Maya/Leo assignments from Summary and required proxy configuration from Connection & Proxy. A route edit ends the mock session and invalidates route/identity evidence; it cannot preserve a healthy score from the previous configuration. Full fixture reset restores baseline assets, evidence, assignments, activity-day sets and session state.

Avatar source is illustrated mock or local system default, with failed-image fallback. Real avatar retrieval needs an approved source and validated cache/retention policy. Connection is Good/Fail/Not connected with Unknown/Stale/Checking states where relevant; Good is scoped to an observation, never ban immunity. Enabled proxy configuration is distinct from availability and browser routing.

## Health contract

Five equal checks: management permission, authorization, required proxy route, correct account session and current platform evidence. Passed check earns 20; failed known check earns zero; missing data withholds the numeric total. Evidence older than five minutes yields Stale/Unknown. Restriction evidence takes priority: confirmed/synthetic-confirmed notice yields 0 and the supplied restriction type. Mock notices always remain explicitly synthetic.

| Score | Label |
| --- | --- |
| 100 | Healthy — operational checklist complete |
| 51–99 | Need Optimize |
| 1–50 | Danger — Need Fix |
| 0 | Banned/Suspended, only with corresponding evidence |
| Missing/stale | Unknown, percentage withheld |

Known essential permission/auth/required-route/identity failure blocks working sessions and caps a known score at 50. A total of zero without restriction evidence becomes 1, reserving 0 for restrictions. Missing evidence can coexist with a known blocker: display Unknown plus its actionable blocker. Five equal weights normally produce multiples of 20; arbitrary intermediate scores are not fabricated, though boundary labels are independently tested. Health is operational readiness, not probability of avoiding enforcement.

Frontend evidence contract: check outcomes, source/time/stale state, restriction reference/type/stated or unknown cause, Health breakdown/blockers. Missing route or an unchecked mandatory route cannot receive a verified passing check.

## Sessions, secrets and activity

Check & open runs a simulated preflight. Companion offline, permission/auth/route/identity failure, stale/missing evidence or restriction prevents a working session. A single mock session lock per account exposes owner/start time; the second member requests handoff. Thomas can release a hung-session lock only after explicitly confirming that the session is inactive. Actual companion/browsing stays Unavailable. Switching operator while a preflight is pending cancels its ability to grant a session under the new identity.

Protected fields are owner-only synthetic placeholders. Mock reauthentication unlocks for 20 seconds; Show/Hide controls visibility. Navigation, role change, window blur, hidden document and timeout remask/relock. Audit actor/account/field identifier and result without values. This static artifact contains synthetic values in source; no encryption, real authentication or credential storage is delivered. Production needs approved OAuth, external key protection, server authorization, single-field access, real reauthentication, revocation and restore tests before handling secrets.

Activities are account-scoped with actor, account, timestamp, source and outcome. Opt-in three-second stream remains simulated, bounded and stops/skips emission on appropriate lifecycle states. Archived accounts are excluded. Reconnect does not claim durable replay. Production continuous observation coverage, cursor/replay/dedup and account coordination remain proposed and permission-dependent.

## Loading and alerts

First load: 700ms fixture-loading skeleton, subdued shimmer and static reduced-motion variant. Refresh keeps loaded rows, disables duplicate refresh, shows inline progress and explicit failure/retry. Empty/search and unavailable/disconnected/stale states remain visible. Observation age is recalculated on render and visible Health surfaces periodically update without claiming new platform data.

Production freshness target: internal events immediately, permitted external observations ≤60 seconds when supported; stale after five minutes. In-app unresolved notifications are grouped by account, visible only to the owner/assigned member and link to Safeguard. Repeated observations do not multiply identical notification cards. No outbound messages are sent.

## Verification / limits

Browser checks cover Health formula and boundaries, missing/stale evidence, detail/Back/menu/tabs, role scoping and global search, preflight/session failure and handoff, archive/audit retention, active-day dedup, synthetic reauthentication/remask/timeout, skeleton/refresh/retry, notifications and mobile/light/dark. Original test scripts describe older six-record/modal designs and are not valid current acceptance gates. Current checks are in the RO-UX-005 checkpoint.

Production access control, hosting, durable data, real proxy routes, encryption, real avatar acquisition, platform checks, ban prevention and live browser control are not delivered or implied by prototype tests.

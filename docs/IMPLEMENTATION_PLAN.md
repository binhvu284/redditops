# Implementation backlog

## Delivered local workflow iteration — October 2, 2026

Evidence: [RO-PROXY-UX-001](agent/tasks/RO-PROXY-UX-001.md). Delivery status applies to local configuration and Mock UX, not live Reddit access.

| ID | Dependency | Acceptance | Verification | Status |
| --- | --- | --- | --- | --- |
| RO-PROXY-UX-001 | Existing RO-MVP-001 | Guided proxy details/check/finish, requested US location, owner editing, truthful unavailable response and isolated Mock checks | API persistence/permission/edit tests; existing and workflow browser gates | Implemented locally |
| RO-ACCOUNT-UX-001 | RO-PROXY-UX-001 | Proxy-first onboarding, pending local record, managed-open capability boundary, separate joined/first-connection times and Mock 24h milestone | Manual reports cannot start real timer; sign-in/failure/recovery and mobile browser scenarios | Implemented locally |
| RO-SAFEGUARD-UX-001 | RO-ACCOUNT-UX-001 | Account-first readiness/source/time, filters, issues, next action and scoped checklist/history | Unknown/Stale/restriction tests; five Mock faults, alerts and deliberate recovery | Implemented locally |
| RO-CONNECT-001 | Owner UX acceptance, verified provider/adapter scope | Specify and implement supported proxy checks and browser companion with fail-closed routing; never infer browser route from server-only probe | Exact managed route/identity, network-loss/no-direct-fallback and permission tests required before activation | Not implemented; subsequent authorization/capability work |

Date: October 1, 2026. RO-MVP-001 subsequently authorizes a self-hosted web MVP with login/team permissions, local verification without deployment. Earlier task descriptions below retain their original broader acceptance criteria; do not infer all those criteria passed from MVP delivery. [Current implementation](MVP_RUNBOOK.md) and [checkpoint](agent/tasks/RO-MVP-001.md) supply completion evidence.

| Backlog group | Current state |
| --- | --- |
| RO-000 | Complete: remote confirmed empty, local checkout/remote attached; no initial commit |
| RO-001–RO-004 / RO-W10 | Functional MVP subset: SQLite/auth/registry/client/proxy configuration/team assignment/archive; deployment and remaining broader production criteria open |
| RO-005–RO-006 | Manual evidence, readiness, pause/resume, scoped activity, internal SSE and attention views implemented; external checks unavailable |
| RO-007 / RO-008 | Encrypted recovery with portable-directory/rollback tests and browser UI delivered; large-history/physical-machine/disk-full certification not claimed |
| RO-009 / RO-B10 / live lane | Owner acceptance, online deployment, browser companion and approved live integration remain open |

## Start and sequencing

First development item: **RO-002 — persistent manual account onboarding and guided local issue resolution**. Before coding it, complete RO-000 checkout reconciliation and RO-001 foundation. RO-002 is the first useful product slice; a decorative dashboard shell is not its acceptance evidence.

Local critical path: RO-000 → RO-001 → RO-002 → RO-003/RO-004 → RO-005 → RO-006; RO-007 branches from secure persistence; RO-008 integrates UI quality; RO-009 accepts the local release. The conditional live lane is independent and does not block local/manual usefulness. Dependencies describe sequencing, not authorization for parallel agents.

Planning estimates for one experienced developer: RO-000 30–60 minutes once access exists; RO-001 2–3 days; RO-002 2–3 days; complete local MVP approximately 3–5 working weeks including tests/recovery/owner review. These are estimates with unknown source reuse, not measured throughput or commitments. Re-estimate after RO-000; live approval time is excluded and unknown.

## Phase 0 — reconcile and establish a safe local foundation

### RO-000 — Recover and reconcile the actual checkout

- **Dependencies:** Thomas supplies an accessible actual checkout or separately authorizes obtaining one; plan review. This task did not clone or initialize Git.
- **Scope/files:** Actual AGENTS, README, current checkpoint, Git metadata, manifests, source, tests and CI; merge this planning bundle only after checking for existing canonical docs. Preserve unrelated edits.
- **Acceptance:** Verified root/remote match `binhvu284/redditops`; record branch/SHA/dirty state; identify existing implementation and reusable patterns; mark conflicts with this proposal; resolve stack/test commands from actual files. No assumption of an empty upstream.
- **Verification:** Read-only `git rev-parse --show-toplevel`, `git remote -v`, `git status --short`, `git branch --show-current`, `git log -1`, targeted `rg --files`, manifests and CI reads. Document unavailable commands honestly.
- **Evidence:** Revision-bound checkpoint and corrected file/test map. No code gate exists until identified.

### RO-001 — Protected local workspace, persistence and contracts

- **Dependencies:** RO-000; separate implementation/dependency/infrastructure authorization. Skills can remain inactive if unresolved; ordinary engineering remains available.
- **Scope/files (proposed):** `apps/web`, `apps/api/src/modules/access`, `packages/contracts`, `database/migrations`, local packaging documentation/Compose after approval. Reuse existing equivalents.
- **Acceptance:** Guided first-run creates one operator/workspace; authenticated local session; loopback binding; PostgreSQL migrations and durable storage; shared errors/provenance contracts; authenticated encryption/key management before any secret storage. No Reddit calls, cloud prerequisite or TOBI dependency.
- **Verification:** First-run replay denied; wrong credentials/rate limits/session revocation; unauthenticated and cross-workspace access denied; CSRF/Origin/Host checks; restart persistence; failed migration on disposable DB; secret redaction and key-missing behavior. Verify actual local cookie behavior.
- **Evidence:** Actual install/run/check commands documented from chosen manifests, passing focused/integration/build checks and local login browser interaction. Commands require authorized implementation; none run in this planning task.

## Phase 1A — first usable end-to-end account workflow

### RO-002 — Add an existing account and resolve a local issue

- **Dependencies:** RO-001.
- **Scope/files:** Account API/storage/forms/table/profile; local completeness checks; minimum issue/pause/activity path; onboarding browser tests. Proposed `modules/accounts`, `modules/operations`, web account pages.
- **Acceptance:** Save existing username with attestation, purpose/notes; Manual-only default; reopen after restart; duplicate/invalid entry handled; platform state unknown; ownership-review issue appears and has one fix; successful local review resolves issue; explicit local resume audited. No live button falsely enabled.
- **Verification:** Unit cases for validation/status derivation and duplicate normalization; API persistence/transaction failures; browser add → issue → repair → resume → reload; retry does not duplicate account; keyboard use; retained input on failure. Use synthetic identities.
- **Evidence:** End-to-end owner-visible slice, existing applicable lint/types/build/tests pass. Thomas can try it without Reddit or AI.

### RO-003 — Clients and explicit assignments

- **Dependencies:** RO-002.
- **Scope/files:** Client CRUD, brand context/communities, assignment API/UI and migrations; proposed `modules/clients`.
- **Acceptance:** Shared and dedicated account assignments supported within owning workspace; ownership remains independent; archive preserves history; no client secret/history access implied.
- **Verification:** Cross-workspace assignment denied, archived-client assignment denied, duplicate assignment handling, transaction rollback; browser create client → assign/unassign → filter account list; confirm client identity before changes.
- **Evidence:** Persisted assignments and scoped activity without credentials.

### RO-004 — Connection/authorization records and honest evidence

- **Dependencies:** RO-002 and RO-001 secure storage.
- **Scope/files:** Connection/auth records, manual observations, capability registry and isolated Mock fixtures; proposed `modules/connections`, `modules/evidence`, `modules/integrations`.
- **Acceptance:** Configured/unverified differs from passed; declared auth differs from verified OAuth; source/time/expiry visible; route changes invalidate observations; proxy data encrypted/redacted; Mock never updates real evidence; browser action labeled manual handoff. No network probe in base scope.
- **Verification:** Mode boundary tests, stale expiry/config-version invalidation, secret projections, Mock isolation, unavailable capability denial; browser forms and unknown/stale/reconnection views; test external-link validation.
- **Evidence:** Capability matrix rendered honestly; no fake connected/healthy status or route-enforcement claim.

## Phase 1B — daily use and recovery

### RO-005 — Guided issues, policy and deliberate resume

- **Dependencies:** RO-003 and RO-004.
- **Scope/files:** Status derivation, Issue/OperatorTask/PolicyDecision records, account pause/resume, notification triggers; proposed `modules/operations`.
- **Acceptance:** Overview answers which account/client needs attention and why; local/manual operations remain useful offline; relevant failure pauses affected system work; fresh checks do not auto-resume; manual evidence cannot satisfy live requirements; no health score/karma threshold/shadowban inference.
- **Verification:** Table-driven status combinations, unknown/stale and multiple failures; change config between check and resume; repeated resume and unresolved restriction denied; browser guided repair/recheck/failure; independent website action explicitly outside control.
- **Evidence:** Failure and recovery scenarios with explained decisions, not just happy-path screenshots.

### RO-006 — Activity, notifications and operator tasks

- **Dependencies:** RO-005.
- **Scope/files:** Activity filtering/pagination, in-app notifications, simple due tasks; proposed `modules/activity`, `modules/notifications`.
- **Acceptance:** Actor/workspace/client/account/time/action/result/reason/source stored atomically with changes; alerts deduplicate and link to repair; manual outcomes stay reported; loaded rows survive failed refresh; no email/external messages.
- **Verification:** Audit redaction, failed transaction no false success event, pagination/filter boundaries, repeated-failure deduplication, task persistence and workspace denial; browser mark read/open issue/refresh failure.
- **Evidence:** Inspectable activity trail across onboarding and repair without secrets or provider content bodies.

### RO-007 — Encrypted backup and recoverable restore

- **Dependencies:** RO-001, RO-003, RO-004; include later local entities when introduced.
- **Scope/files:** Backup manifest/archive/key-envelope, recovery API/UI and disposable restore tests; proposed `modules/recovery`, `tests/recovery`.
- **Acceptance:** Guided encrypted backup finalization; portable key recovery with separate passphrase; isolated restore validation/preview before replacement; rollback preservation; sessions revoked, old live evidence invalidated and accounts paused; original data intact on failure.
- **Verification:** Round trip on disposable storage, including a different machine/container recovery scenario; wrong/missing key, corruption, incompatible version, path traversal/oversized archive, disk full and interruption/rollback. Never run restore on operator data without explicit recovery authorization.
- **Evidence:** Recorded fixture counts/checksums/decryption and timed restore walkthrough. No plaintext archive or secret output.

### RO-008 — Operational UI polish, accessibility and asset review

- **Dependencies:** RO-002 through RO-007 for final integration; common visual tokens can start inside RO-002.
- **Scope/files:** Navigation/theme/components and empty/loading/error/stale states; local font license record; asset provenance only after permission verified.
- **Acceptance:** Five navigation entries; neutral premium UI; professional locally hosted font; clear identity and next action; keyboard/focus/zoom/reduced-motion support; no nonfunctional future screens. Reddit logo stays placeholder unless exact asset/use is cleared; product name reviewed before public commercial release.
- **Verification:** Build plus interaction checks at 390/768/1440px, 200% zoom, keyboard-only forms/dialogs and accessible labels/contrast; run actual existing accessibility tooling if available. Verify font license and selected SVG current brand permission, bytes/hash and provenance before inclusion.
- **Evidence:** Browser behavior and screenshots, with blocked logo review explicitly recorded; no screenshot-only claim of functional acceptance.

### RO-009 — Accept standalone local MVP

- **Dependencies:** RO-002 through RO-008; actual test commands and recovery evidence.
- **Scope/files:** Setup/recovery guide, release checklist, owner checkpoint; repair defects in the responsible modules.
- **Acceptance:** Thomas manages 15 synthetic accounts/clients without spreadsheet or terminal during daily use, resolves an issue, pauses/resumes local work, understands Manual/Mock/Unknown evidence and restores an encrypted backup without AI/TOBI/live Reddit.
- **Verification:** Run applicable suite from manifests/CI; offline end-to-end acceptance; service/database unavailable UX; fresh installation guide and restore exercise in disposable environment. Record Thomas's acceptance separately from tests.
- **Evidence:** Local release summary with implementation/check/commit/push/live/owner-acceptance states separately labeled. Commit/push need explicit delivery authorization.

## Conditional lane — live reads/checks only

| ID | Dependencies and proposed modules | Acceptance | Verification |
| --- | --- | --- | --- |
| RO-L01: validate platform capability | RO-000; Thomas's explicit live-scope authorization; approved use-case records in integrations | Current API/commercial permissions, endpoints/scopes, registration/labeling, retention and cost documented; unsupported capabilities stay unavailable | Read grants/current primary policies; permission fixture tests; never treat consent as platform grant |
| RO-L02: approved OAuth and bounded checks | RO-L01, RO-004, RO-005; integrations/connections/evidence | OAuth verified account/scopes; revocation/expiry; route no-fallback; safe allowlisted probes if expressly included; source/time | Fixture denial/state mismatch/timeout/SSRF/private address/redirect/DNS rebinding/credential redaction tests; authorized live read smoke test separately reported |
| RO-L03: durable scheduled checks | RO-L02, RO-006; jobs/migrations; Redis/BullMQ only after justified approval | Durable job/lease state, per-account coordination, bounded retries, execution-time revalidation, restore stays paused; no publishing | Crash/restart, concurrent requests, duplicate dispatch, pause/config changes during queue wait, rate-limit backoff and deletion reconciliation if content import is authorized |

Live lane delivery never expands to publishing or stealth browser automation. Mock integration tests do not prove the live endpoint works.

## Account operations revision — RO-DEMO-004

Owner-requested module/UI requirements are specified in [Account operations modules](ACCOUNT_OPERATIONS_MODULES.md). The static demo delivers only synthetic interactions. These additional production items are proposed and do not authorize backend implementation or live operation:

| Task ID | Dependencies | Acceptance criteria | Verification |
| --- | --- | --- | --- |
| RO-A10: account avatar and detail contract | RO-000, RO-002, RO-004 | Connection, local pause, proxy config and restriction evidence separate; allowed avatar provenance/fallback; account-scoped activities; no real-password collection by default | Missing/broken avatar, expired authorization, scoped reads, empty account, secret redaction and browser interactions |
| RO-A11: protected field reveal | RO-A10, RO-004; reviewed secret/key model | Operator reauthentication and authorized single-field reveal; encryption at rest; timeout/navigation/lock remask; no cache/storage/log/export secret values | Unauthorized access, expired session, cross-account access, key unavailable, reveal audit without value, remask and restore/key failure paths |
| RO-P10: proxy registry and evidence | RO-000, RO-005, RO-A10; RO-L01/L02 only for live probes | Route/account assignments and enabled config distinct from last observed operation status; source/time; unknown/failure stays visible; no silent fallback or browser-route claims | Assignment changes, missing route, timeout, credential redaction, authorized bounded destination checks and account pause invariants |
| RO-S10: safeguard review and restriction history | RO-A10, RO-P10, RO-006 | Checklist uses evidence/time; unknown qualification visible; restriction scope/notice/stated or unknown cause; local review never clears restriction; relevant successful recheck plus deliberate resume | Generic error does not become ban, stale evidence, absent cause, synthetic notice, failed review, preserved logs and restriction retention |
| RO-T10: continuous permitted observations | RO-A10, RO-006; RO-L01/L02 for live access; RO-L03 if durable scheduled work is needed | Supported event coverage explicitly recorded; durable account-scoped redacted events; authenticated local updates; cursor/replay/dedup; visible disconnected/stale/gap states; bounded retention | Service/browser restart, reconnect cursor, duplicate/out-of-order event, missing event gap, revoked consent/capability, pause/rate limits and unsupported external activity; approved live evidence reported separately |

RO-000 remains the first development item. Resolve actual manifests/source before choosing SSE/WebSocket or polling libraries. Live tracking cannot cover unsupported activity or run while local services are off. Existing RO-009 acceptance should include these modules only after their scope is approved for production.

## Later phases

### RO-UX-005 accepted UX and production follow-up

The frontend Mock implementation is complete within [Asset UX](ASSET_UX_SPEC.md) scope; backend items remain proposed. The product direction now includes up to five members, online shared access and a local browser companion. This does not authorize hosting or live operations.

| Task ID | Dependencies | Acceptance | Verification |
| --- | --- | --- | --- |
| RO-W10: shared workspace authorization | RO-000, RO-004, RO-A10; explicit backend scope | Server-enforced owner/member per-account permissions, owner-only assignment/archive/secret operations, scoped account/routes/search/notifications/audit; bootstrap data remains independent of TOBI | Cross-account/member denials, revoked assignment/session, archive/history retention, audit redaction and offline/unavailable UX |
| RO-B10: local companion session coordination | RO-W10, RO-P10, RO-A11; supported browser mechanism verified first | Isolated profiles, authenticated companion, account identity/authorization/route preflight, one durable session lease per account, holder/handoff and verified stale-lock recovery; no stealth bypass | Concurrent claims, role/config changes during preflight, disconnected companion, expired lease, failed route/identity, restore/restart and no duplicate working session |
| RO-H10: readiness projection | RO-A10, RO-P10, RO-S10, RO-T10 | Five 20-point evidence groups, critical cap/block, missing/stale Unknown, restriction-only 0, auditable source/time; no enforcement guarantee | Boundary labels, missing/expired evidence, config invalidation, no technical-error ban inference, role-scoped projections and source freshness |

Production API shapes are not implemented by this HTML. Reconcile real source and obtain a bounded backend task before selecting hosting, auth/storage or companion dependencies.

Phase 2 requires a new plan: community rules/sourced review dates, opportunities/drafts, exact-action approvals, disclosures and permitted publishing/manual handoffs. Test edit invalidation, duplicate prevention and uncertain-outcome reconciliation before publishing.

Phase 3 requires a new plan: campaigns, scoped client reporting, explicitly measured/imported/unavailable metrics, verified AI mechanisms and TOBI APIs/events. No agent gateway or future table is scaffolded in Phase 1.

## Completion evidence contract

For each authorized implementation task capture base SHA, actual paths, focused behavior/failure tests, applicable manifest/CI checks, browser evidence for UI, changed canonical docs and unresolved limits. Test commands above are descriptions of future checks, not invented executable gates. This planning task only validates document integrity; it has no application test result.

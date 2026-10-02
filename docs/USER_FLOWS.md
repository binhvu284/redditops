# Screens and user flows

## Current proxy-first operations UX — October 2, 2026

Implemented under [RO-PROXY-UX-001](agent/tasks/RO-PROXY-UX-001.md), building on the local MVP:

1. **Proxy:** enter provider/server/port and requested US location; advanced protocol/expected IP; save configuration → check capability → finish. Existing routes support owner editing; edits pause linked accounts and invalidate connection observations without clearing restriction notices. Live checks remain Unavailable.
2. **Accounts:** require a configured proxy to begin guided setup, save a pending record, view preflight blockers and future direct browser sign-in. Open account explains missing companion support; it does not open a normal browser tab as a proxy substitute. First 24-hour milestone starts only after verified managed connection, separate from joined date and active days; currently unset in real records.
3. **Safeguard:** list each account with readiness/source/time, issue count, next action and links to checklist/history. All/attention/unknown/restriction filters. Missing facts remain Unknown; manual observations do not establish policy compliance.
4. **Mock walkthrough:** separate in-memory synthetic workspace for the entire flow, location/IP failures, proxy loss, offline companion, expired authorization, stale data and deliberate recovery. Simulated checks do not automatically resume a blocked session. Exit/reload discards preview data; no preview writes to the API.

The production companion must enforce routing and fail-closed behavior before managed access is enabled. No real network blocking, Reddit action capture or AI diagnosis is claimed by this UI release.

## Earlier specification

Date: October 1, 2026. The original proposal is retained below; a separate local-tested application is now implemented under RO-MVP-001. [MVP runbook](MVP_RUNBOOK.md) describes first setup, real login/permissions, persistent operations, manual checklist and encrypted recovery. The prototype remains separate. [Product scope](PROJECT_SPEC.md) owns capability boundaries.

## Visual direction

Premium professional SaaS for daily operations: black/white/neutral gray, crisp hierarchy, restrained outlines, thin borders and consistent spacing. TOBI inspires the visual spirit only; there is no TOBI runtime, component or theme dependency.

Proposed tokens: white surface, #FAFAFA background, #171717 primary text/action, #525252 secondary text, #E5E5E5 decorative border. Meaningful control boundaries/focus need stronger contrast than decorative dividers. One readable sans family: self-hosted Inter, weights 400/500/600, with `system-ui` fallback. Body/forms 16px, table content 14px, headings 20–28px, tabular numbers and 1.4–1.5 line height. [Inter's official project](https://rsms.me/inter/) and [font license](https://github.com/rsms/inter/blob/master/LICENSE.txt) support the proposed choice; retain OFL/copyright when bundling. No remote font request needed for local use; no font downloaded now.

Desktop: 224px sidebar, compact 48px rows, 24px page padding, 8/16/24px spacing, 6–8px corners and little shadow. At narrower widths collapse navigation and show identity/status/action together; allow deliberate scrolling only inside wide data tables. Touch controls get sufficient hit areas. Status uses text plus icon, never color alone. Avoid gradients, glass, decorative charts and continuously animated indicators. Reduced motion, keyboard focus, zoom and readable contrast are acceptance requirements.

## Screen map

| Navigation | Contents | Main action |
| --- | --- | --- |
| Overview | Local readiness counts, prioritized issues, due operator tasks, recent activity | Resolve the highest-priority issue |
| Accounts | Filterable account table; add-account wizard; profile tabs: Summary, Connection & authorization, Activity | Add existing account / open guided repair |
| Clients | Lightweight client records, context, communities, explicit account assignments | Create client / assign account |
| Activity | Timeline with actor/account/client/source/time/outcome; filters | Open relevant account/issue |
| Settings | Operator access, backup/restore, local configuration; advanced connections; capability/approval evidence; isolated demo mode | Create encrypted backup |

No disabled AI/campaign screens imply delivery. Show local setup/unavailable state before login if the service cannot be reached. Notifications use an accessible in-app panel rather than another navigation section.

## Account onboarding

1. Add existing username, purpose and ownership/management attestation. Reject missing consent, invalid input and duplicate username within the workspace. Never ask for a Reddit password. Preserve draft fields when validation/network/storage fails.
2. Optionally assign a client. Show ownership independently; wrong-workspace assignments are denied. Optional fields never obstruct first useful save.
3. Select Manual-only by default. Show Mock only in an isolated demo workspace. Approved live appears unavailable with a reason until the capability grant exists. Local-only saving requires no external login.
4. Save and run only available local completeness checks. Manual observations show source/time/review date; “Checks not available” is a valid result. For separately enabled live mode use approved OAuth, minimum scopes and confirmed account identity before accepting authorization.
5. Open account profile with mode badge, evidence and next step. “Ready for local management” does not imply live connection or platform health.

Cancel/back retains safe non-secret drafts; secret inputs never persist in browser drafts. OAuth future cancellation/denial/expiry/identity mismatch shows Reconnection needed and preserves local records without authorizing a different account.

## Daily repair and deliberate resume

1. Overview presents issue reason, account/client identity, source and last checked time. Empty state gives “Add existing account”; unresolved/stale evidence remains visible.
2. Open issue → read one next action. Local incomplete ownership leads to review attestation; expired live authorization leads to approved reconnect; unknown restriction leads to manual review, never a shadowban conclusion.
3. Repair configuration or record a manual outcome. Changed connection/auth invalidates dependent observations. Duplicate submission is disabled while pending; failure retains content and offers a bounded retry.
4. Run relevant available recheck. Failure keeps the issue open and work paused; a mock/manual result cannot satisfy a live requirement. Manual completion is clearly reported, not independently verified.
5. Select Resume after valid relevant evidence and explicit identity confirmation. Success is audited; unresolved dependencies explain why resume is denied. Independently performed Reddit website actions remain outside application control.

Local issue example: missing authorization attestation → Needs attention → review permission → save source/review date → local completeness check succeeds → resolve issue → deliberate local resume. This proves a useful repair without any network access.

## Connection failure / browser handoff

Connection check failure preserves the configured route and records reason/time. Affected application-controlled work pauses; no silent direct-route fallback. Repair → recheck the actual required API route → explicit resume. If the capability is unavailable, offer Manual-only management, retain the unavailable reason and do not clear the live issue as verified.

“Open on Reddit” shows account/client identity and a validated destination. Explain “Manual handoff: verify signed-in account and browser connection yourself.” The application does not claim to select a browser profile or proxy. Record operator-reported completion only after operator input.

## Client and activity flow

Create client context → select existing account → confirm assignment purpose → save. Shared agency account history remains operator-only; assignment is not credential sharing. Archive client closes current assignments with history preserved. Activity distinguishes operator report, local system result, mock fixture and approved integration result. Refresh keeps loaded rows visible with a timestamp; in-app alerts deduplicate repeated failures and link to one repair.

## Backup and recovery flow

Settings → Create backup → explain included data and excluded provider caches → choose local file and recovery passphrase → show progress/disable duplicate action → success only after finalized archive verification. Write/encryption/disk failures show actionable errors and do not mark a partial archive successful.

Restore → authenticate → choose archive/passphrase → validate and stage → preview counts/version/key recovery → explicitly confirm replacement of named workspace → preserve rollback and enter maintenance → restore → verify → reopen with live evidence invalidated and accounts paused. Wrong key, unsupported version or validation failure preserves original data. Interrupted restore starts in a recoverable maintenance state, not a partially operational dashboard.

## Cross-screen state contract

| State | Visible behavior and recovery |
| --- | --- |
| Initial loading / background refresh | Skeleton only before first load; retain loaded content during refresh; announce progress |
| Empty / search has no match | Relevant add action or clear filters; do not fabricate demo rows |
| Failed save/check / disconnected local service | Inline reason, fields retained, retry only if safe; show unavailable capability distinctly |
| Manual-only / Mock / unverified / stale | Persistent text badge; observation source/time; stale marker; relevant review/recheck |
| Paused / successful repair / denied resume | Reason and affected work visible; check success separate from explicit resume |

Dialog focus is trapped/restored, Escape/cancel works where safe, labels/errors are associated with inputs, async feedback uses an accessible status region and important text remains readable at 200% zoom. Check keyboard-only operation and widths 390/768/1440px during implementation.

## Reddit logo research and decision

**Current local implementation — RO-UI-008, October 1, 2026:** setup/login and sidebar identify the managed platform with the unchanged theSVG Default SVG, below the separate application identity. Exact upstream bytes and rendered data URI were verified; light/dark checks at 375/768/1440px and the build pass. See [asset provenance](../web/assets/reddit/PROVENANCE.md) and [verification](agent/tasks/RO-UI-008.md). Current official Lingo guidance remains unreadable; full current brand permission and public app-name branding remain unverified. Platform identification does not establish endorsement or permission for app branding.

The following paragraphs record the **earlier planning research**, when no asset had yet been downloaded. Their placeholder decision is superseded by the local identification placement above; the public-release brand review remains open.

Actual catalog page located: [theSVG Reddit](https://thesvg.org/icon/reddit). Search-indexed page identifies Default and Mono variants, #FF4500, icon license CC0-1.0 and the source path `public/icons/reddit/default.svg`. The [source file page](https://github.com/glincker/thesvg/blob/main/public/icons/reddit/default.svg) exists. The [theSVG repository license](https://github.com/glincker/thesvg/blob/main/LICENSE) is MIT for its software; this is distinct from the catalog's icon license label and Reddit's trademark rights. Exact variant bytes/hash and current permitted treatment were not verified; no SVG was downloaded or added.

The official [Trademark Use Policy](https://redditinc.com/policies/trademark-use-policy) requires permitted use under brand guidance or written permission and prohibits implying affiliation. The current [official policy index](https://redditinc.com/policies) routes to Lingo brand guidelines, which were not accessible in this session. An older 2022 PDF is not sufficient to approve today's variant. Browser inspection also failed to initialize, so visual asset comparison remains open.

Decision: a neutral application icon/placeholder for initial implementation; no invented Reddit asset URL and no automatic monochrome recoloring. RO-008 must verify the exact selected theSVG asset against current brand permission/placement guidance, retain a local SVG and provenance/hash/license record only if permitted. Logo use and the working product name “Reddit Ops” need brand review before public commercial release. This does not block local registry development. A Mono variant in a third-party catalog is not proof that Reddit authorizes it.

## Current prototype visual direction — October 1, 2026

Latest refinement, RO-UI-007: Overview includes a role-scoped readiness distribution and a three-item priority review queue. A segment opens filtered Accounts; a queue item opens that account's Safeguard tab. Quick filters share the dropdown state, including Need Optimize; Back preserves the filter. Counts describe the visible portfolio, not search-result totals or ban probability. The current identity/actions use indigo, readiness mint, optimization amber, issues coral and unknown neutral, in paired light/dark themes. This supersedes the earlier cobalt/coral identity and status/client chart description below. See [refinement verification](agent/tasks/RO-UI-007.md); this version awaits owner review.

RO-UX-005 now uses a separate account detail page with breadcrumb/Back and Summary, Connection & Proxy, Activities, Safeguard tabs. The table is Account/Connection/Proxy/Health/three-dot menu; owner Delete archives with confirmation. Role, session and protected-field flows are specified in [Asset UX](ASSET_UX_SPEC.md), superseding the earlier modal-detail description.

Thomas explicitly requested a colorful professional CRM SaaS direction in RO-DEMO-003, superseding the earlier monochrome prototype preference for this design iteration. The standalone demo now uses cobalt primary actions/navigation, coral prototype identity, neutral blue-gray surfaces, green local Ready, amber Needs attention and purple Paused. Labels/icons remain present in both light and navy dark themes. Client identity accents organize records without suggesting permissions or official affiliation.

Overview visualizations summarize current synthetic local record status and client assignment counts. They update after session changes, show an honest empty state and expose textual counts/legends. They do not represent Reddit health, live checks or historical growth. See [RO-DEMO-003](agent/tasks/RO-DEMO-003.md) for scope and checks. Production implementation remains proposed.

## Future exact-action approval (outside MVP)

Current RO-DEMO-004 prototype flow: Overview → Accounts → Details (avatar, identity, connection and proxy configuration, synthetic masked fields with Show/Hide) → account Activities (scoped mock history and opt-in simulated stream). Proxy → assigned account or inspection → mock recheck with preserved failure. Safeguard → review group → checklist/evidence/logs → local recheck without clearing restriction. Clients, Activity and Settings remain secondary. Details, negative evidence and backend boundaries are recorded in [Account operations modules](ACCOUNT_OPERATIONS_MODULES.md).

Draft → select account/client/community/disclosure → review exact content/destination/media/schedule → approve immutable revision → revalidate authorization/policy at execution → approved publishing adapter or manual handoff → confirmed/reported/uncertain result. Material edits invalidate approval. Uncertain publication goes to reconciliation. These screens and publishing tables are not part of the initial backlog implementation.

## Current Workspace and shared Safeguard UI — RO-UX-006

October 2, 2026: navigation is Overview, Accounts, Proxy, Safeguard, Clients and Workspace. Standalone Activity is hidden; per-account Activities remain available, and permission-scoped workspace audit is inside Workspace. Historical Settings/Activity bookmarks resolve to Workspace.

Workspace → Add member → owner password confirmation → create local login → Manage access on the intended account → select members / verify existing route and client → save. Account access remains enforced server-side. Revoke access requires owner password confirmation, disables the member and revokes sessions. Members see their own membership and assigned accounts only; secrets, team management and recovery remain owner-only. Account route edits keep existing evidence invalidation behavior. Remote Reddit browser access is labelled Unavailable rather than implied by assignment.

Workspace recovery/system and audit are expandable disclosures. Safeguard starts with a shared five-rule operational baseline, visible-account pass/fix/unknown counts and latest observation time. Stale checks count as unknown. Reddit/community policy review is a separate manual, research-in-progress section with official sources; it does not add points to Health or automatically certify compliance. Per-account issues, restriction evidence and logs remain below the shared checklist.
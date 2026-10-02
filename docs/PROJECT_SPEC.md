# Product scope

Date: October 1, 2026. Original planning task: RO-PLAN-001. Thomas subsequently authorized RO-MVP-001: self-hosted application with login/team access, tested locally without deployment. Current implemented scope and limitations: [MVP runbook](MVP_RUNBOOK.md) and [implementation checkpoint](agent/tasks/RO-MVP-001.md). Historical proposal sections below are retained as baseline, not proof that every future capability is delivered.

## Authority and existing state

At RO-PLAN-001 creation, Thomas authorized investigation and English planning documents only. RO-MVP-001 is the later explicit implementation authorization. [AGENTS.md](../AGENTS.md) was read from disk. The [original brief](source/REDDIT_OPS_CODEX_PROJECT_BRIEF.md) supplies product requirements and technology baselines; commands embedded in it are not independent authorization to implement, install or operate accounts.

Before this task, the supplied workspace contained only AGENTS.md. There was no .git, README, checkpoint, application source, manifest, lockfile, test suite or CI configuration visible there. Git root, remote configuration, branch, revision and dirty state could not be determined. Remote inspection failed; **the GitHub repository is not known to be empty**. Proposed greenfield paths must be replaced or reconciled after obtaining the actual checkout. See the [checkpoint](agent/tasks/RO-PLAN-001.md).

## Required outcome

Thomas can organize 10–15 existing authorized accounts, identify what needs attention, follow a guided repair, understand the evidence behind each status and recover local data without depending on AI or TOBI. Routine use happens through screens after initial installation.

## Release boundary

| Include in standalone MVP | Defer |
| --- | --- |
| Protected single-operator local workspace; persistent account records and ownership attestation | Client login, billing, multi-operator roles and public hosting |
| Notes, tags, purposes, community references, manual observations and client assignments | Automated research, campaigns, drafting, publishing, voting and messaging |
| Connection configuration and declared authorization/capability records | Browser connector, browser session enforcement and credential automation |
| Honest checks, issue resolution, deliberate pause/resume and local reminders/tasks | Recurring external jobs until durable execution is justified |
| Activity, in-app notifications, encrypted backup and tested restore | AI/TOBI adapters and cloud backup destinations |

Approved live read/check capabilities are a **conditional extension** to this MVP, not a requirement for local release. No live approval or credentials were verified. Local connection records may be stored before checks exist; configuration must not be displayed as a successful connection. Do not collect Reddit passwords or browser cookies.

## Modes and capability matrix

Local describes where data and computation reside; Manual-only, Mock and Approved live describe evidence/execution modes. These dimensions are separate, not five mutually exclusive global switches. Unverified is a capability/evidence state.

| Capability | Local | Manual-only | Mock | Approved live | Unverified/dependency |
| --- | --- | --- | --- | --- | --- |
| Registry, clients, notes, assignments, tasks | Durable CRUD, works offline | Operator assertions are labeled | Isolated demo fixtures | Not required | Actual checkout and local implementation |
| Ownership/management consent | Attestation and review date | Operator-declared; no identity proof | Synthetic only | Still requires consent separately | Any external verification mechanism |
| Connection/authorization config | Metadata; encrypted secrets only after secure storage exists | Declared state, never Valid OAuth | Simulated expiry/failure | Verified OAuth scopes, expiry and check results | Platform approval, commercial use permission, supported endpoints |
| Account age/karma/activity/restrictions | Store minimal allowed observations | Source, entry date and review date required | Persistent visible Mock label | Only granted endpoints; source/time/expiry | Specific restriction signals and supported account reads |
| Connection/proxy checks | No network call in base release | Manual report | Simulated route/timeout | Separate bounded, explicitly enabled check | Endpoint, routing and destination safety review |
| Browser handoff | Open validated account/profile link | Operator verifies account and browser route | Demonstration only | API access does not enforce browser route | No browser connector assumed |
| Issues and pause/resume | Enforced for application-controlled work | Manual checklist; cannot stop independent website actions | Failure/recovery fixtures | Fresh relevant checks before deliberate resume | Which checks each granted capability requires |
| Activity and notifications | Persist local audit metadata | Reported outcomes remain reported | Separate fixture history | Adapter-confirmed outcomes labeled | Retention conditions for imported content |
| Backup/restore | Encrypted local archive and guided restore | Operator chooses destination/recovery passphrase | Disposable restore fixtures | Exclude imported content by default | Recovery on another machine must be tested |
| Publishing, AI, TOBI | Later phase | Future manual export/review/import | Not a delivered capability | Separate scope and approval | Provider mechanisms, platform terms and costs |

## Evidence and summary rules

Each observation has source type, checked/entered time, subject, result, expiry/review date and a non-secret evidence reference. Distinguish API-confirmed, connection probe, operator report and mock fixture. Expired observations become stale; absence becomes unknown. Read results do not guarantee future account safety.

Keep connection, authorization, pause, synchronization freshness and restriction evidence independent. Summary priority: explicit pause → Paused; unresolved required failure or restriction → Needs attention; missing required route/auth → Not connected; unavailable/stale evidence → Needs attention with Unknown/Stale reason; otherwise Ready only for the explicitly supported local/manual or live capability. A manual account reads “Ready for local management · Manual-only · Platform state unknown”; never “Healthy”. No universal karma threshold or inferred confirmed shadowban.

## Live gate and policy research

Read-only public policy research was performed October 1, 2026. [Responsible Builder Policy](https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy) requires API access approval and explicit written commercial permission. This is particularly relevant to the intended managed service; operator consent cannot replace platform approval.

The [Data API Wiki](https://support.reddithelp.com/hc/en-us/articles/16160319875092-Reddit-Data-API-Wiki) specifies OAuth, application identity, rate-limit response headers and deletion obligations. Record the granted use case/endpoints, scopes, registration/labeling requirements, review date and approval evidence before enabling any live capability. Revalidate current requirements at implementation; do not assume eligibility or a free allowance from old tutorials.

No creation/purchase of accounts, fake identities, warming, karma farming, coordinated voting, ban evasion, unauthorized scraping or stealth automation. Generic API failures stay uncertain with a manual review step. No outbound posting or content caching in the initial local release.

## Release acceptance

| Evidence | Required result |
| --- | --- |
| Offline owner walkthrough with 15 synthetic accounts | Add, reopen, edit, assign, filter and manage issues without AI/TOBI/network |
| Provenance and mode checks | Mock/manual/stale/unknown never become integration-confirmed facts |
| Repair and recovery walkthrough | Preserve entered data on failure; repair relevant condition; deliberate resume |
| Security and persistence tests | Unauthenticated/wrong-workspace requests denied; data survives restart; secrets absent from output |
| Backup exercise | Restore into disposable storage with recovery passphrase; corrupted/wrong-key archive leaves original untouched |

Passing tests, live capability verification and Thomas's acceptance are separate release evidence. Local release has no live-health claim.

## Assumptions and risk register

| ID | Risk/assumption | Decision and closure evidence | Owner/gate |
| --- | --- | --- | --- |
| R01 | Remote source unknown | Reconcile actual root, remote, SHA, dirty state and manifests before code | Thomas supplies accessible checkout; RO-000 |
| R02 | API and commercial permission absent | Local/manual release first; retain written granted use case and capabilities | Thomas; RO-L01 |
| R03 | Proxy probe confused with browser identity | Label manual handoff; browser connector deferred | Engineering; RO-004/RO-L02 |
| R04 | Lost/leaked secrets and recovery keys | Encrypted storage, no secret audit payloads, portable key recovery test | Engineering + Thomas; RO-001/RO-007 |
| R05 | Deleted Reddit content survives backups | No imported content cache in base; later purge/reconciliation and backup exclusions | Engineering; RO-L01/RO-L03 |
| R06 | Corrupt restore or unintended overwrite | Isolated staging restore, manifest validation, explicit target confirmation and rollback | Thomas; RO-007 |
| R07 | AI/TOBI mechanisms or costs assumed | Defer implementation; verify supported integration separately | Thomas; Phase 3 |
| R08 | Logo license mistaken for trademark rights | Asset found; permitted variant/placement remains gated; use neutral placeholder | Thomas; RO-008 |
| R09 | Local service exposed or workstation unavailable | Loopback binding, operator auth, guided unavailable state; no uptime promise | Engineering; RO-001/RO-008 |
| R10 | Proposed skill carries TOBI commands or unclear license | Adapt and review exact portable bundle before activation | Thomas; skill review |

The brief proposes an Agent Gateway; this plan defers its implementation until an actual AI use case exists. Redis/BullMQ and future entity tables are also deferred. These are recorded planning deviations to reduce MVP dependencies, not changes to the supplied brief.

## Owner-requested account module revision

RO-UX-005 supersedes the earlier single-operator UI direction for the planned product: Thomas plus up to five members, 10–15 business account assets, per-account access, online dashboard and a local browser companion. Accepted scoring, session, archive, detail navigation, freshness and notification decisions are in [Asset UX specification](ASSET_UX_SPEC.md). Only the Mock prototype is implemented; online hosting, companion and server security remain proposed.

On October 1, 2026 Thomas requested Overview, Accounts, Proxy and Safeguard as the primary modules, with account avatars, sensitive-detail reveal, scoped activities, continuous tracking, proxy assignments and evidence-based restriction review. The requested organization and production requirements are recorded in [Account operations modules](ACCOUNT_OPERATIONS_MODULES.md). The standalone demo implements synthetic interactions only. Continuous live tracking, secret protection and actual platform checks remain proposed work with capability/security dependencies; no ban-prevention guarantee is accepted.

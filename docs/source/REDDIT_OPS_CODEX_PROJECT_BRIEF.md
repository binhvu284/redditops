# Reddit Ops — Project Brief for Codex

Date: October 1, 2026  
Purpose: Understand the project and plan the build. Do not begin implementation yet.

## 1. Your task

Act as a senior full-stack architect and product engineer. Read this brief, inspect the current repository, and produce a practical implementation plan.

Read the applicable repository instructions, README, existing specifications, package manifests, source structure, and tests. Separate what already exists from what is proposed. If the repository is empty, report that and plan a greenfield build. Do not assume the TOBI repository is the Reddit Ops repository.

Treat the product constraints below as requirements. Treat the technology choices and entity names as planning baselines to validate against the repository. Document conflicts rather than silently changing scope.

## 2. What we are building

Reddit Ops is a local-first operations dashboard for managing existing, user-owned Reddit accounts from one simple interface.

The initial user is a solo operator managing approximately 10–15 accounts. The long-term business direction is a managed service for multiple clients, including US-market brands. The operator needs to organize accounts, understand connection and authorization problems, review account activity, manage tasks, and eventually coordinate approved community participation and campaigns.

The first release is an account-operations foundation, not an autonomous marketing bot. Its core value is making account management understandable, traceable, and less error-prone for a nontechnical user.

The system should answer: Which accounts need attention? What happened? What action is currently permitted? What should I do next?

Account creation, account purchasing, fake personal identities, karma farming, coordinated voting, and ban evasion are outside scope. “Account health” means observable operational conditions, not a guarantee against bans or knowledge of Reddit’s private trust signals.

## 3. Fixed product constraints

**Existing accounts only.** Onboard accounts the operator already owns or is authorized to manage. Do not build registration, phone-number rental, or account-warming workflows.

**Local-first and low-cost.** Run the application and primary database locally. Plan encrypted backups and a later optional cloud backup destination; verify current free-tier suitability before selecting a provider. Do not make paid cloud hosting a prerequisite for local account management.

**Nontechnical daily operation.** After initial setup, routine work must happen through guided screens, not terminal commands, database tools, or infrastructure settings.

**Human-controlled actions.** AI may research, summarize, and propose content. Publishing must require explicit approval and a permitted integration path. Approval does not override platform or community restrictions.

**Standalone first, TOBI later.** TOBI’s intelligence and agent infrastructure are not a dependency for the initial release. Reddit Ops owns its operational data, permissions, execution rules, and audit history.

**Multi-client-ready, not enterprise-heavy.** Begin with one operator workspace and lightweight client records. Support shared agency accounts and client-dedicated accounts through explicit assignments, without mixing client data or presenting coordinated accounts as independent endorsements. Full client portals and billing can wait.

## 4. Core modules

### Overview / Today

Provide a daily dashboard showing account summaries, unresolved issues, pending operator tasks, and recent activity. Prioritize actionable information over decorative charts. Each issue should explain what happened, which account is affected, and the next step.

Use plain-language status labels such as Ready, Needs attention, Paused, and Not connected. Show Manual-only or Live integration badges where appropriate. Unknown or stale information must never appear as verified healthy data.

### Account Manager and Account Profile

Add existing accounts; record ownership or authorization, username, purpose, tags, client assignments, relevant communities, and operator notes. Show account age, karma, and recent activity only when available through an approved source or explicitly entered by the operator.

Keep the source and last-checked time for observations. Provide an account detail page with operational status, connection settings, authorization state, restrictions, and activity history.

Do not use an invented universal karma threshold as a “safe to operate” rule. Record community-specific requirements only when known, with their source and review date.

### Connection and Authorization Manager

Manage configured connections, including proxies when explicitly selected, as first-class records. Store credentials securely and expose simple results such as Connected, Check failed, or Reconnection needed.

Record assignments and connection changes. A required connection failure must pause affected system-controlled jobs rather than silently switch routes. Proxy support is connection administration, not a mechanism for bypassing restrictions or pretending to be a different person.

Prefer approved OAuth authorization rather than collecting Reddit passwords. Track granted capabilities, expiry or revocation, and reconnection needs. Keep Reddit tokens separate from the operator’s login session for Reddit Ops.

Distinguish API connections from human browser sessions. A server-side proxy check does not establish that an ordinary browser tab uses that proxy or the intended Reddit account. Validate whether a local browser connector is necessary; otherwise clearly label browser actions as manual handoffs and do not claim routing or session enforcement.

### Health Checks and Safety Guard

Evaluate observable conditions: authorization validity, connection availability, stale synchronization, supported platform restriction signals, operator-recorded restrictions, and unresolved failures.

Keep connection status, authorization status, operational pause state, and restriction evidence separate. Derive the dashboard summary from these facts, with an explanation.

Before any system-controlled external action, check permission, integration capability, account state, applicable restrictions, and required approval. Pause affected work on a relevant failure; require a successful recheck and deliberate operator action before resuming it.

Do not classify an isolated missing post or generic API error as a confirmed shadowban. Record uncertainty and offer a manual review step.

### Activity Log and Notifications

Record significant changes and attempts with timestamp, actor, workspace/client context, account, action, outcome, and failure reason. Distinguish manual completion reports from results confirmed by an integration.

Provide in-app alerts and guided resolution. Never log credentials, access tokens, or browser cookies. Separate operational audit metadata from cached Reddit content so retention and deletion requirements can be enforced.

### Client Organization

Create lightweight client records with brand context, objectives, approved communities, account assignments, and notes. Keep account ownership separate from campaign assignment.

A shared agency account can serve explicitly assigned clients within its owning workspace. Do not share account credentials or unrestricted account history across unrelated customer workspaces. Leave client-facing access and reporting permissions for a later phase.

## 5. Main user workflows

**Onboarding:** Add an existing account → confirm ownership/authorization → choose a supported connection mode → authorize or mark manual-only → run available checks → show a clear result and next step.

**Daily operation:** Open Today → review issues → open the affected account → follow a guided fix → recheck → deliberately resume permitted work.

**Connection failure:** Detect failure → stop affected queued actions → explain the issue → operator repairs the configuration → verify the relevant checks → resume. Explain that external actions performed independently in Reddit’s website are outside this application’s control.

**Future content workflow:** Select client and community → review the opportunity and community rules → prepare a draft → select account and required disclosure → approve the exact content and destination → execute through an approved integration or use a manual handoff → record the outcome. Material edits must invalidate prior approval.

## 6. UI/UX direction

Use a clean desktop-first dashboard with readable typography, consistent components, clear status text, and responsive layouts. Keep initial navigation small: Overview, Accounts, Clients, Activity, and Settings. Put connection and authorization controls inside the account setup flow, with an advanced management view for the operator.

Prefer guided setup and one clear next action per issue. Hide infrastructure jargon by default. Design loading, empty, failed, disconnected, stale-data, and success states—not only the happy path. Make account and client identity visible before consequential actions.

The initial release should not display nonfunctional campaign or AI screens as completed features. Future modules can remain absent until implemented.

## 7. Architecture and integration requirements

### Technology baseline

| Area | Planning baseline |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Node.js / NestJS, structured as a modular monolith |
| Database | Local PostgreSQL with migrations |
| Background work | Redis / BullMQ when durable checks or jobs are introduced |
| Local deployment | Docker Compose and documented configuration |
| External interfaces | Typed API contracts and structured domain events |

Reuse suitable existing repository infrastructure. Explain proposed deviations and avoid unnecessary microservices, Kubernetes, or distributed-agent infrastructure.

Keep integration adapters separate from account, client, approval, and policy logic. Distinguish Manual, Mock, and Approved live modes. Mock results are for development and tests, never evidence that a real account is connected.

### Reddit integration gate

Reddit requires explicit approval for API access and explicit written approval for commercial data use. Validate the intended managed-service use case before enabling live integrations. [R1][R2]

Approved Data API clients must use OAuth. Plan documented authentication, minimum necessary access, descriptive application identity, and response-header-driven rate-limit handling. Do not treat an old API tutorial as proof that access is available. [R3]

Reddit’s spam rules apply to both manual and automated actions. Multiple accounts must not vote on the same items, and other accounts must not be used to evade bans. Exclude those workflows rather than attempting to make them harder to detect. Apply relevant app registration and labeling requirements to automated integrations. [R1][R4][R5][R6]

Cached Reddit content needs a deletion/retention mechanism that respects content removed from Reddit; account for caches, exports, and backups in the design. [R3]

Produce a capability matrix that separates locally implementable features, approved API features, manual-only workflows, and unresolved capabilities. Lack of API approval must not prevent building the local account registry, notes, tasks, client organization, and configuration management. Never substitute unauthorized scraping or stealth browser automation for unavailable API access.

### Reliability, security, and data

Plan encrypted secrets, protected operator login, workspace-scoped access, migrations, encrypted backups, and a tested restore procedure including recovery of required encryption keys.

Use durable job state and appropriate per-account coordination. Revalidate permissions and pauses at execution time. Retries must not create duplicate external actions. An uncertain publishing outcome must enter reconciliation/manual review rather than automatic blind reposting.

Candidate core entities: Workspace, User, Client, RedditAccount, AccountAssignment, Connection, Authorization, HealthCheck, PolicyDecision, Job, ActivityEvent, and Notification. Later entities may include Community, RuleSnapshot, Campaign, Opportunity, Draft, Approval, Publication, and MetricSnapshot. Finalize the schema during planning rather than building every future table immediately.

## 8. AI and future TOBI integration

Introduce an Agent Gateway: a small adapter boundary for sending permitted context to an AI provider and receiving structured suggestions.

Initially evaluate documented Codex or Claude Code plugin/CLI integration paths. Do not assume an integration exists or that a subscription automatically grants backend API access. Document the supported mechanism; a manual export/review/import workflow is acceptable until a verified adapter exists.

AI-assisted onboarding, community research, drafting, and summaries are later capabilities. They must not be required for core operations. Keep secrets out of model context, treat imported community content as untrusted input, and validate AI output.

AI proposes; Reddit Ops enforces permissions, approvals, and execution rules. TOBI can later become another authorized adapter through APIs and events, without directly controlling the database or bypassing the Safety Guard.

## 9. Delivery phases and success criteria

**Phase 1 — Account operations:** Local setup, operator access, account registry, connection/authorization records, available checks, guided issue resolution, lightweight clients, activity log, notifications, and backup/restore. Validate live integration dependencies independently; provide honest manual-only states where needed.

**Phase 2 — Content operations:** Community rules, opportunities, drafts, approvals, tasks/scheduling, and permitted publishing or manual handoff. Include disclosure controls and clear ownership of every action.

**Phase 3 — Managed-service expansion:** Campaigns, fuller client reporting, AI adapters, and measurement from published activity to website visits, leads, and conversions where data is actually available. Separate measured, imported, and unavailable metrics. Add TOBI integration after the standalone system is stable.

The first release is successful when the operator can manage the initial account set without a spreadsheet, understand and resolve operational issues without developer assistance, pause system-controlled work reliably, and recover local data from backup. It must remain useful without AI and must never present unverified platform state or mock integration results as facts.

## 10. Required planning output

First provide a brief understanding of the product, findings from repository inspection, and an explicit MVP boundary.

Then produce:

1. An architecture proposal, module boundaries, initial data model, and capability/dependency matrix.
2. A screen map and user flows, including failure, manual-only, reconnection, approval, and recovery states.
3. A phased implementation backlog with task IDs, dependencies, likely files/modules, acceptance criteria, and tests.
4. An assumptions/risk register covering API access, commercial approval, connection/session feasibility, secrets, data retention, backup, and future AI integration.

Use existing documentation conventions. If none exist, propose `docs/PROJECT_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/USER_FLOWS.md`, and `docs/IMPLEMENTATION_PLAN.md`.

Prioritize an end-to-end account onboarding and issue-resolution workflow over a broad but nonfunctional dashboard. Do not install dependencies, scaffold application code, modify production configuration, or act on real Reddit accounts during this planning stage.

Stop after presenting the plan. Implementation requires separate approval.

## Source references

External platform requirements checked October 1, 2026. Revalidate them at implementation time. The product requirements and technology baseline above are project planning instructions, not claims that these capabilities already exist.

[R1] Reddit Help — Responsible Builder Policy, updated June 5, 2026.
https://support.reddithelp.com/hc/en-us/articles/42728983564564-Responsible-Builder-Policy

[R2] Reddit Help — Developer Platform & Accessing Reddit Data, updated May 28, 2026.
https://support.reddithelp.com/hc/en-us/articles/14945211791892-Developer-Platform-Accessing-Reddit-Data

[R3] Reddit Help — Reddit Data API Wiki, updated May 11, 2026.
https://support.reddithelp.com/hc/en-us/articles/16160319875092-Reddit-Data-API-Wiki

[R4] Reddit Help — Spam, updated May 19, 2026.
https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam

[R5] Reddit Help — Is it ok to create multiple accounts?, updated March 29, 2026.
https://support.reddithelp.com/hc/en-us/articles/204535759-Is-it-ok-to-create-multiple-accounts

[R6] Reddit Help — Disrupting Communities.
https://support.reddithelp.com/hc/en-us/articles/360043066412-Disrupting-Communities

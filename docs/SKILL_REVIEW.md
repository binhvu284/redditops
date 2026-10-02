# Skill candidate assessment — no activation

Date: October 1, 2026. Review task: RO-PLAN-001. [AGENTS.md](../AGENTS.md) remains the sole approval register and is unchanged. **Active automatic-routing project skills: 0.** The user-selected `i-have-adhd` communication style is used for this conversation; it is not activation of a Reddit Ops engineering skill.

Candidate documents were inspected as source material only. No candidate workflow/helper/search script was executed, installed, copied into the project or activated. TOBI approval is provenance, not Reddit Ops approval. The following is a suitability assessment; complete bundle/license review and exact adapted sources are required before activation approval is concrete.

## Groups for Thomas's review

| Group | Candidates | Recommendation and scope | Activation readiness |
| --- | --- | --- | --- |
| A: core workflow | redditops-dev-loop, redditops-doc-maintenance | Adapt concise delivery/checkpoint and truthful canonical-doc routing | Good fit; adapted files not yet created/reviewed; clarify license/provenance |
| B: operational product support | ui-ux-pro-max, security | Targeted forms/navigation/accessibility and auth/secrets/proxy/recovery review | Good fit after bounded adaptation and relevant resource review |
| C: diagnostic support | systematic-debugging only | Reproduce/investigate before repair; delivery workflow owns completion | MIT and pinned source available; replace TOBI references; helpers reference-only |
| D: deferred support | scalability, cost-reducer | Measured performance/durable jobs; explicit cost objective only | Not needed by default for 10–15 accounts; license/provenance unresolved |
| E: skip for MVP dashboard | design-taste-frontend / Taste | Optional later marketing art direction | Source explicitly excludes dashboards/tables/multi-step product UI; license unresolved |

Recommend reviewing A + B first, with C available only when debugging is needed. D waits for demonstrated need; E does not become the dashboard design workflow. None grants service access, installs, branches, delivery, parallel agents or deployment.

## Exact inspected source candidates

Paths below are relative to the separate TOBI checkout and serve only as source evidence. Future approved copies must be repository-relative within Reddit Ops; this proposal must not depend on Thomas's private cache or substitute a same-name global skill. SHA-256 values are calculated from UTF-8 SKILL.md with CRLF/CR normalized to LF. These identify inspected source, **not approved adapted content**.

| Candidate | Source relative to TOBI checkout | Normalized source SHA-256 |
| --- | --- | --- |
| dev-loop source | `.agents/skills/tobi-dev-loop/SKILL.md` | `330eb7a914be81cda51fdd4ec9c583cbd923f61b72db2438449dbfa7ffccdb5e` |
| doc-maintenance source | `.agents/skills/tobi-doc-maintenance/SKILL.md` | `c79a06a1d83862cc59b223b32b73770bcbd349a3513b55104fd0d0d326e8420c` |
| security | `.agents/skills/security/SKILL.md` | `6ff1d5ad18fbb33bb9d28471767efeb7a0ab51d961ce0817c0e250941ff014fb` |
| scalability | `.agents/skills/scalability/SKILL.md` | `48ac9a7e688e55552b43ae59a1c691557dfcfcb93c0510ac99ca7680d1621f60` |
| cost-reducer | `.agents/skills/cost-reducer/SKILL.md` | `0f0ff7a99ff01b6c18d8598b00560182c0d70d87dd066cc779858856176189f8` |
| systematic-debugging | `.agents/skills/systematic-debugging/SKILL.md` | `6c46aed98ae8312e59991a87909b989e197b3070778487cf924834b30e6a0056` |
| ui-ux-pro-max | `.claude/skills/ui-ux-pro-max/SKILL.md` | `ea087c341bfb5b23195c7302027268ede86da802554c18a5c4896a6017b439f9` |
| Taste | `.claude/skills/taste-skill/SKILL.md` | `aa194351b246b8b4799099d4ed7b033d29eab6e6e3d58d8d2172978be7b3ec89` |

## Source findings, dependencies and required adaptation

**Workflow pair:** Both SKILL.md files are concise and refer to TOBI's `scripts/agent_context.py`, `.claude/CURRENT_WORK.md`, `docs/README.md`, package gates and automatic context commit. Those helpers/routes do not exist here. Replace with Reddit Ops's root README, `docs/CURRENT_WORK.md`, task checkpoints and verified manifest commands; remove unconditional commit and mandatory Graphify/helper dependencies. No adjacent license file was found for these two local source folders. Resolve ownership/permission before portable copying or author a new locally owned workflow instead of assuming upstream rights.

**Pro Max:** Source entrypoint and targeted accessibility/pro-rules sections were inspected, not the entire data/script bundle. Adjacent LICENSE is MIT, copyright Next Level Builder. TOBI register pins upstream `nextlevelbuilder/ui-ux-pro-max-skill` at `09170eec67eefd46a7ae85de61b40c194020f997`; this source claim was read locally, not independently fetched. Tooling requires Python 3 and local scripts/data/references; the entrypoint says no external Python dependencies, which still needs verification before execution. Replace `${CLAUDE_PLUGIN_ROOT}` assumptions with the registered directory; use targeted UX guidance, never automatic palette replacement or package installation. User's neutral palette/font direction wins over generated suggestions. Retain MIT notice; review/hash only the resources actually being registered.

**Security:** SKILL.md and initial relevant sections of `auth-and-secrets.md`/`web-security.md` were inspected. Resource names also include `desktop-security.md` and `database-and-deps.md`. Resolve `${CLAUDE_SKILL_DIR}` to a portable source directory; remove unneeded Electron/Tauri scope; verify example libraries and local cookie/TLS behavior against the actual stack. Broad snippets are guidance, not verified implementations. No adjacent license was located in the inspected source folder; upstream provenance/license must be established before copying the bundle. It must not silently authorize credential changes or service access.

**Systematic debugging:** Entry source and PROVENANCE were inspected. Adjacent MIT LICENSE names Jesse Vincent. PROVENANCE pins `obra/superpowers` at `8ca22dba9a94f28898bbce59f2537ff4d87c747d` and records a TOBI adaptation; upstream pin is local provenance, not freshly fetched proof. Bundle names include root-cause tracing, defense-in-depth, condition-based waiting and Bash/TypeScript examples. Replace TOBI gate/source references; do not activate other Superpowers skills. PROVENANCE says Bash masks exit codes and the TypeScript example depends on absent Lace imports; keep both reference-only. Supporting-resource contents are not fully reviewed for Reddit Ops yet.

**Scalability/cost:** Entry sources and resource inventories were inspected, not the full supporting bundles. They contain generic quantitative thresholds/prices/savings and Redis/cloud/microservice examples. Do not treat those numbers as Reddit Ops evidence or infrastructure requirements. Scope to a measured query/job/resource problem; no cloud command execution. No adjacent license found in these inspected folders; attribution/permission review remains open.

**Taste:** Scope/frontmatter and targeted installation/font/design sections were inspected. It explicitly excludes dashboards/data tables/multi-step UI. Defaults favor marketing motion/variance and introduce installation suggestions unsuitable here. No adjacent license found. Defer; no need to review or register the entire large source for the MVP.

## Concrete approval process for a later task

Prepare proposed portable sources under a review-only location after Thomas authorizes adaptation; review all selected resources, license/provenance and dependencies; show exact normalized hashes and bundle manifest. Thomas then approves identifiers, triggers and scope. Only after that record the approved adapted sources and bundle in AGENTS, using `.agents/skills/<identifier>/` or a verified supported path. Group selection alone is intent to review, not blanket activation of missing or modified sources. This task stops with the assessment and makes no policy/register change.

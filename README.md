# Reddit Ops — self-hosted MVP

Local-first account operations for Thomas, initially one operator and approximately 10–15 existing, owned or authorized Reddit accounts. Standalone operation precedes any TOBI integration.

**Status, October 2, 2026:** functional local-tested application, version 0.1.0, including the proxy-first workflow update. The source, prototype, tests and project documents are now committed and pushed to GitHub `main`. Initial source delivery: `d0f39334b4e069f1f2f7a4d871088de683355de7`. No deployment; owner acceptance pending. See [Git delivery checkpoint](docs/agent/tasks/RO-GIT-001.md).

**Workspace UI follow-up:** team membership and account access now live in Workspace; Activity is hidden from navigation, with audit retained. Safeguard begins with a shared operational checklist and a policy review marked research ongoing. See [UI checkpoint](docs/agent/tasks/RO-UX-006.md).

## Run the application

**October 2 proxy update:** guided Proxy → Accounts → Safeguard flows now include HTTP/HTTPS/SOCKS5 backend diagnostics, encrypted proxy authentication and opt-in monitoring. Actual provider verification is pending; browser launch/enforced routing remain Unavailable. Choose **Try workflow** for isolated Mock sign-in/faults/24-hour previews. See [proxy connectivity](docs/agent/tasks/RO-PROXY-001.md) and [earlier workflow implementation](docs/agent/tasks/RO-PROXY-UX-001.md).

**October 6 provider update:** Proxy → Add proxy → **Bright Data** offers Residential/Datacenter/ISP cards and composes the US route (`brd.superproxy.io:44445`, Residential state/city/ZIP with a one-device session, or ISP test session/allocated IP). It shows the provider-reported location and runs a consented 5-check stability test with optional handshake-only Reddit reachability. **Proxy-Seller** has a guided preset. Official provider marks have [provenance](web/assets/providers/PROVENANCE.md). See [Proxy providers](docs/PROXY_PROVIDERS.md) and [RO-PROXY-BD-001](docs/agent/tasks/RO-PROXY-BD-001.md).

Requires verified Node 22.14.0 (Node 22, below 23); no npm packages to install.

```powershell
npm start
```

Open **http://127.0.0.1:4317**. First setup uses the single-use key in `data/setup-token.txt`; choose your own email/password. Keep the key private and do not paste it into chat. Windows launcher: `Start-Reddit-Ops.ps1`. See [MVP runbook](docs/MVP_RUNBOOK.md) and [MVP verification](docs/agent/tasks/RO-MVP-001.md).

Implemented: real login and server-side account permissions; persistent account/client/proxy configuration and assignments; archive/audit retention; manual evidence/Health/Unknown/Stale and pause/resume; exclusive manual reservations; internal realtime events/alerts; owner reauthentication, encrypted protected fields, encrypted backup and validated transactional restore with portable key recovery. New workspaces have no seeded accounts.

Reddit live integration, real avatars and browser companion remain **Unavailable**. Proxy diagnostics are available after explicit consent; they do not route an ordinary Reddit browser or start an account connection/24-hour timer. Manual reports and reservations do not establish platform facts or enforced browser routing. Node SQLite is experimental in the verified runtime. Default loopback operation is tested; public TLS/proxy deployment and OS key protection remain unverified. Optional HTTPS canonical-origin/Secure-cookie configuration is header-tested. Password change/invitation delivery and large-history recovery remain later work.

Verification: `npm run check`, `npm test`, `npm run build`. Build creates ignored `dist/` without keys/data/tests. Browser developer gates: `node scripts/browser-check.mjs` (also `proxy-`, `workflow-` and `brightdata-browser-check.mjs`) using existing local Edge/Playwright; it is not a runtime dependency. Runtime source: `app/` and `web/`.

## Separate prototype

Open [the UI demo](demo/reddit-ops-demo.html) directly in a browser. It needs no install or server, makes no external requests, uses synthetic records and resets on reload. The latest version uses a colorful CRM palette, local status donut and client portfolio bars. Try Ctrl+K, sidebar collapse and the light/dark toggle. Backup/restore are flow previews only. See [CRM UI verification](docs/agent/tasks/RO-DEMO-003.md) and [earlier ChatGPT UX research](docs/CHATGPT_UX_REFERENCE.md).

Typography uses an embedded, OFL-licensed Manrope variable font with system fallbacks, readable labels and wrapping tabs. See [typography and task-only skill review](docs/agent/tasks/RO-UI-006.md).

Latest refinement adds an actionable readiness distribution, scoped priority review queue, quick account filters and a consistent indigo/mint/coral CRM visual system. See [refinement and verification](docs/agent/tasks/RO-UI-007.md).

## Document map

Latest prototype: ten business account assets, primary Overview/Accounts/Proxy/Safeguard, five-column table and separate detail page. Switch Mock role between Thomas/Maya/Leo to try assignments, session conflicts and owner-only archive/protected fields. See [accepted asset UX](docs/ASSET_UX_SPEC.md) and [current verification](docs/agent/tasks/RO-UX-005.md). All role/security/session behavior is a frontend simulation, not a production security boundary. The activity stream is opt-in and synthetic.

| Read | Purpose |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Sole project policy and pending skill register |
| [Current work](docs/CURRENT_WORK.md) | Current state and one next action |
| [Proxy providers](docs/PROXY_PROVIDERS.md) | Bright Data preset and Proxy-Seller connection guide, limits and sources |
| [Cloud deployment options](docs/CLOUD_DEPLOYMENT_OPTIONS.md) | Researched free/low-cost hosting choices; no deployment activated |
| [Product specification](docs/PROJECT_SPEC.md) | Required scope, proposed MVP and capability matrix |
| [Architecture](docs/ARCHITECTURE.md) | Proposed modules, data model, contracts and recovery |
| [User flows](docs/USER_FLOWS.md) | Screen map, visual direction and failure states |
| [Implementation plan](docs/IMPLEMENTATION_PLAN.md) | Task IDs, dependencies, acceptance and verification |
| [Skill review](docs/SKILL_REVIEW.md) | Candidate assessment; no activation approval |
| [Planning checkpoint](docs/agent/tasks/RO-PLAN-001.md) | Inspection evidence, limitations and handoff |
| [Original brief](docs/source/REDDIT_OPS_CODEX_PROJECT_BRIEF.md) | Unmodified supplied requirements; not implementation evidence |

The original planning proposals and prototype checkpoints are historical evidence. Current application architecture, commands, recovery and remaining boundaries are documented in the MVP runbook/checkpoint above; broader production gates are not automatically complete.

# RO-UX-006 — Workspace access and shared Safeguard checklist

## Outcome and authorization

October 2, 2026: implement Thomas's four browser annotations: hide standalone Activity navigation, rename Settings to Workspace, redesign Workspace around future team account use, and replace the Safeguard introductory heading with a shared account checklist. Frontend task; reuse existing local member, assignment, recovery and audit handlers. No new skills, dependencies, live proxy/Reddit operations, deployment or Git delivery.

Checkout: verified `origin` is `https://github.com/binhvu284/redditops.git`, unborn `main`; source and docs are untracked from earlier local work. There is no base revision. Previous work/operator data must be preserved.

## Decisions and relevant files

- `web/app.js`: six navigation destinations ending in Workspace. Historical `#settings` and `#activity` links resolve to Workspace. Per-account Activities remain available; workspace audit moves inside a disclosure.
- `web/operations.js`: Workspace renders owner/member scoped team records, account assignments, reservations, guided access explanation and recovery/audit disclosures. Manage access reuses the existing account configuration form and endpoint; changing route retains its existing invalidation behavior.
- `web/app.css`: use current Manrope, indigo and paired theme tokens; responsive team table, account access rows and shared rule list.
- Safeguard begins with the common five operational rules and permission-scoped report counts. Stale checks count as unknown. The policy review is explicitly manual, research ongoing and outside the Health calculation. No checklist completion is invented.

The initial policy review links to official [Reddit Rules](https://redditinc.com/policies/reddit-rules), [Spam](https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam) and [Ban evasion](https://support.reddithelp.com/hc/en-us/articles/360043504811-What-is-ban-evasion), read October 2, 2026. This is a baseline rather than an exhaustive compliance assessment; rules and automated evidence sources still need further research.

## Initial checkpoint (superseded by final evidence)

Implemented page markup, navigation and styles. Syntax/build passed initially. Open: browser verification, owner/member permission presentation, historical route compatibility, responsive screenshots and final inspection. Backend capabilities remain unchanged: local access works; live Reddit use and network enforcement remain Unavailable.

Next action: verify Workspace assignment and member views in isolated fixtures, then review fresh screenshots.

## Final verification and delivery

Completed all four annotations. No backend schema or API changes. Navigating from the sidebar now resets the page scroll and focuses the main content. The existing local service returned HTTP 200 for updated browser assets; no service restart or operator-data mutation was required.

Commands:

```powershell
& 'D:\NodeJS\node.exe' scripts/build.mjs
& 'D:\NodeJS\node.exe' scripts/browser-check.mjs
& 'D:\NodeJS\node.exe' scripts/workflow-browser-check.mjs
```

Syntax/build passed. The existing browser gate, extended for this task, passed assignment through Workspace, revoke/password confirmation, member isolation with a second owner-only account, hidden navigation, historical Settings/Activity routes, scoped audit, shared policy checklist, all six destinations and four detail tabs at 375/768/1440px in both themes. No JavaScript errors or external requests. The final Mock workflow gate also passed, including read-only Workspace controls, synthetic reservation identity, five failure/recovery cases, keyboard behavior and zero Mock API writes or external requests.

Fresh isolated viewport screenshots `.qa/{workspace,safeguard}-{desktop,mobile}-review.png` visually inspected at 1142x884 and 375x884; owner/member full-page captures are separate fixtures. Initial browser runs exposed two test assumptions: a detail selector matched two accounts, and an owner email substring also matched a member email. Scoped both assertions correctly without changing product permissions. Shell interpolation also rejected literal JavaScript replacements; moved them into ignored file-based scripts. No operator credentials or data were used.

Remaining: owner visual acceptance; future remote Reddit access and enforced proxy routing; further policy checklist research and automatic evidence adapters. No deployment, commit, push or skill activation.

Next action: Thomas reviews Workspace and expands the policy review in Safeguard.

## Retrospective

Worked: reused existing authorization/assignment/recovery contracts with isolated browser evidence. Wasted effort: broad account selectors and substring email assertions in an expanded fixture. Improvement: identify the exact account and email in permission checks; put code containing literal dollar expressions in files rather than shell arguments.
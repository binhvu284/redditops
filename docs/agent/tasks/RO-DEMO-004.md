# RO-DEMO-004 — Account, Proxy and Safeguard UI

## Outcome / authorization

Thomas requested account avatars and revised Overview/Accounts/Proxy/Safeguard modules, account details with sensitive-field reveal, account activity history, continuous tracking, proxy assignments and safeguard checklist/restriction logs. This continuation implements those as a standalone Mock UI and records the backend requirements; it does not authorize live account operations or infrastructure. No dependencies, services, credential collection, commit/push or new skills.

Base: workspace still fails `git rev-parse --show-toplevel`; revision/remote/source parity remain unknown. Modified `demo/reddit-ops-demo.html` and related English specifications/checkpoint. AGENTS.md remains unchanged.

## Completed

Four primary modules plus retained workspace utilities. Synthetic illustrations/system avatar fallback, connection and proxy columns, add-account mock configuration, account/client identity, masked readonly synthetic secrets with Show/Hide/remask, scoped activities and opt-in three-second event simulation. Proxy fixture checks preserve failure and send no network traffic. Safeguard checklist, filters, synthetic ban notice/cause, evidence source/time and local review logs retain restriction evidence after a recheck.

Canonical explanation: [Account operations modules](../../ACCOUNT_OPERATIONS_MODULES.md). Backend/security/live tracking requirements and implementation backlog are proposals, not delivered capabilities.

## Verification

Existing runtime: Node, bundled Playwright, installed Edge. Set `TEMP` and `TMP` to `demo/.qa` on D, then:

```powershell
node demo/.qa/verify.cjs
node demo/.qa/verify-redesign.cjs
node demo/.qa/verify-color.cjs
node demo/.qa/verify-operations.cjs
```

Original flow regression checks pass. New tests cover six avatars, masked/show/hide/reopen, scoped history isolation, stream receive/disconnect/reconnect/stop, failed proxy recheck, restriction checklist/recheck retention, add connection/proxy and all four modules in both themes at 390/768/1440px. No HTTP requests or JavaScript errors in new flow checks. Screenshots inspected: `preview-accounts.png`, `preview-account-detail.png`, `preview-proxy.png`, `preview-safeguard.png`; mobile capture also retained. Captures are synthetic and masked.

A function-wrapper hoisting issue was identified before the first browser check and fixed by explicitly naming the prior add form implementation. A shell-quoting attempt to polish modal close behavior failed without modifying the file; a saved Node helper applied the correction. Visual review prompted a clearer system silhouette and a stated synthetic cause for the restriction fixture. Tests were rerun on final source.

## Remaining / next action

Owner acceptance pending. Reload demo, open Accounts → Details → Activities, inspect Proxy and Safeguard. No live tracking or real health/ban checks delivered. Production first item remains RO-000 checkout reconciliation, followed by scoped backend items recorded in the plan. Real backend monitoring cannot be enabled before permission/capability verification.

## Retrospective

Worked: reused recovery flows and semantic colors while distinguishing connection/proxy/local/restriction states. Wasted effort: inline shell quoting for a JavaScript mutation; saved helper was safer. Improvement: verify account-scoped history and preserved negative evidence, not only attractive module screenshots.

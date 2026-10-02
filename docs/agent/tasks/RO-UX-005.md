# RO-UX-005 — Business asset UX prototype implementation

## Authorization and baseline

Thomas explicitly requested implementation of the picker-approved UX plan in the Mock demo. Scope: ten synthetic account assets, role/session/Health/recovery simulations and English canonical documentation. No dependencies, application scaffold, hosting/infrastructure, real credentials/accounts, live tracking, skill installation, commit or push.

Git root inspection still fails in this workspace. Base SHA/remote source parity are unavailable; this does not establish an empty upstream repo. AGENTS.md is preserved. Artifact: `demo/reddit-ops-demo.html`. Accepted UX: [Asset UX specification](../../ASSET_UX_SPEC.md).

## Completed

- Five-column asset table, avatar fallback, scored/Unknown/stale Health, source timestamps, metric filters and three-dot menu.
- Detail page with breadcrumb/hash, Back preserving list state, four tabs, joined date, distinct active days and account-scoped logs.
- Owner/member role simulation, scoped accounts/routes/search/alerts, archive retaining audit and stopping account simulation, owner-only protected fields.
- Mock reauthentication, Show/Hide, twenty-second timeout and lifecycle remask; field-identifier audit excludes values.
- Single-account session lock, holder/handoff, confirmed inactive-lock recovery, companion offline, preflight failure, unavailable live launch.
- Loading skeleton, reduced motion, refresh preservation/failure/retry, grouped in-app alerts and retained recovery previews.

## Checks and evidence

Existing Node, bundled Playwright and installed Edge; TEMP/TMP directed to `demo/.qa` on D:

```powershell
node demo/.qa/verify-asset-ux.cjs
node demo/.qa/verify-asset-recovery.cjs
node demo/.qa/verify-asset-management.cjs
node demo/.qa/capture-asset-ux.cjs
```

The first suite checks skeleton, ten fixtures, formula/boundaries 0/1/50/51/99/100/Unknown, source stale state, filter-preserving Back, menu/tabs, scoped history, reveal gating/remask, role scoping, session conflict/handoff/recovery/offline/preflight, active-day dedup, refresh and archive retention, global-search isolation and four modules/detail tabs in both themes at 390/768/1440px. It records no JavaScript errors or HTTP requests.

The recovery suite covers duplicate validation, escaped input, new account Not connected/Unknown, failed-refresh preservation/retry, twenty-second timeout/value-free audit, backup/restore previews, ten-fixture reset, notification grouping/member isolation. Screenshot capture uses fresh fixtures: `preview-desktop.png`, `preview-accounts.png`, `preview-account-detail.png`, `preview-mobile.png`, `preview-dark.png`. Screenshots were inspected, including the separate detail page and mobile layout.

The management suite passed owner assignment/member visibility, route-edit invalidation of identity/route evidence and mock session, archived audit visibility in owner Activity, reset of assignments/checks/archives, keyboard row/tab navigation and failed-avatar fallback. No production server security is inferred from these checks.

An initial responsive check found Summary overflow at 768px; wrapping the account heading and bounding detail children fixed it. Focused review found unscoped legacy global search, inconsistent proxy fixtures and archive history visibility; these were corrected rather than treating attractive screenshots as sufficient proof. Older test suites target superseded columns/modal/counts; the current suites replace their applicable coverage, not a claim that old gates pass unchanged.

## Limits and next action

Small owner-requested follow-up: removed the duplicate Proxy content title/subtitle selected in browser comment 1. The top navigation label and assigned-route registry remain. Verified the exact source replacement; no behavioral change or broad test rerun required.

Implementation is frontend Mock only. Static role switching, reauthentication, session locks and masked fields are not production security. Data/archives reset on reload, stream is synthetic, and live browser launch remains Unavailable. Owner acceptance pending. Thomas reloads the demo, selects Maya/Leo, tries the shared first account and inspects Health, details and archive confirmation. First production item remains RO-000: reconcile actual checkout/source before backend work.

## Retrospective

Worked: explicit picker decisions made score/role/session expectations testable. Wasted effort: legacy test assumptions no longer matched the accepted table/detail contract. Improvement: use current behavior tests for role/search isolation, responsive detail pages and archive audit visibility; do not infer them from prior modal tests.

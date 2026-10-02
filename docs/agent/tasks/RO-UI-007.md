# RO-UI-007 — professional operational CRM refinement

## Outcome and authorization

Thomas accepted the preceding typography improvement as satisfactory and requested a much stronger quality uplift. The requested “150%” is a qualitative ambition, not measured quality telemetry. This task refines the existing frontend Mock demo and its interactions; production capabilities are unchanged.

No dependencies, skill installation, services, real account operations, parallel agents, commit or push. Local `git rev-parse --show-toplevel` still fails; upstream source and application build commands remain unverified. Preserve the account contract in [ASSET_UX_SPEC](../../ASSET_UX_SPEC.md) and the behavior documented in [RO-UX-005](RO-UX-005.md).

## Design decisions and implemented scope

Continued the previously explicitly requested UI UX Pro Max guidance from the fixed, reviewed source documented in [RO-UI-006](RO-UI-006.md). This is refinement of the existing operational dashboard, using Manrope and its offline license bundle; no new framework or marketing page.

1. Refined the visual system: indigo identity/actions, mint readiness, amber optimization, coral issues and neutral unknown evidence. Updated paired light/dark tokens, sidebar, controls, cards, table spacing and focus/hover feedback.
2. Overview now includes a readiness distribution with labeled counts and operable filters. Each asset belongs to exactly one bucket; missing or stale evidence remains Unknown. The chart describes operational readiness, not ban probability.
3. Added a focused review queue: confirmed Mock restriction evidence first, then essential blockers, then other incomplete assets. Shows at most three items and opens the selected account's Safeguard tab. Every item and count uses the role-scoped portfolio.
4. Added quick readiness filters to the existing five-column account table, including Need Optimize. Dropdown and quick filters share the existing filter state; Back preserves it. No account columns or consequential actions removed.
5. Refined account detail identity, summary tiles, segmented tabs, session banner, checklist and readiness sidebar. Mobile status labels wrap as whole labels rather than splitting words. The previously removed duplicate Proxy content heading remains absent.

Status meaning uses both text and color. No decorative random trend data, performance percentages or live claims added. Synthetic observations remain labeled Mock.

## Verification

Existing Node, Playwright and Edge; browser TEMP/TMP directed to `demo/.qa` on D. No server or package installation required.

```powershell
node demo/.qa/verify-asset-ux.cjs
node demo/.qa/verify-asset-recovery.cjs
node demo/.qa/verify-asset-management.cjs
node demo/.qa/verify-typography.cjs
node demo/.qa/verify-premium-ui.cjs
node demo/.qa/capture-asset-ux.cjs
```

Main UX, recovery, management, typography and new premium interaction checks passed. The premium check verifies the ten-asset readiness partition (1 Healthy, 1 Optimize, 5 Fix/restricted, 3 Unknown), restriction queue link/account identity, Optimize filtering and Back, Maya's four-asset scope, and intact mobile checklist labels. It runs offline and records no JavaScript errors.

Measured nine text-token/surface pairs in each theme. Light ratios range 4.81–14.94; dark ratios range 6.46–14.09. This verifies those selected palette pairs meet 4.5:1, not complete WCAG certification. Existing typography checks cover all primary modules/detail tabs at 375/390/768/962/1024/1440px in both themes plus focused 200% CSS zoom checks. Reduced motion remains supported.

Regenerated and inspected Overview, Accounts, desktop detail, mobile detail and dark theme previews. Visual inspection caught a split mobile Pass label; giving the state label its own grid position corrected it. New test code initially had a syntax error and short-hex parsing issue; corrected the test without changing or weakening the contrast threshold.

## Status and next action

Local prototype refinement complete; owner review of this new version pending. Previous typography refinement accepted by Thomas in this request. Mock role/secret/session checks remain frontend simulations; no backend or live tracking is inferred. Next action: reload the demo, open Overview, select a readiness segment and review the first Focus next item.

## Retrospective

Worked: actionable visuals derived from existing scoped data improved usefulness without inventing metrics. Wasted effort: a generic visual-hierarchy search returned hover guidance; used the reviewed hierarchy/reference rules rather than claiming a relevant match. Improvement: pair screenshot review with contrast and account-scoping interaction checks.

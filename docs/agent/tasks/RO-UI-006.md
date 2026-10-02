# RO-UI-006 — readable offline typography

## Outcome and authorization

Thomas requested clearer, professional typography and identified UI UX Pro Max as the intended frontend design skill. This change is limited to the existing standalone Mock demo. No dependencies, services, real accounts, skill installation, permanent automatic routing, Git commit or push.

The workspace still has no Git checkout (`git rev-parse --show-toplevel` fails). Remote revision, source and application manifests remain unverified; this is not evidence that the remote repository is empty.

## Reviewed guidance

Task-only review of [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill), upstream revision `09170eec67eefd46a7ae85de61b40c194020f997`, MIT license. Reviewed source is retained under `demo/.qa/research/ui-ux-pro-max/`, with normalized SHA-256 resource inventory in `manifest.json`. Reviewed SKILL.md SHA-256: `ea087c341bfb5b23195c7302027268ede86da802554c18a5c4896a6017b439f9`.

Applied web guidance: readable type scale, weight hierarchy, font-display swap, numerical alignment, natural wrapping, existing keyboard focus and reduced motion. The actual stack is standalone HTML/CSS/JavaScript, without Tailwind or React; no framework recommendation was treated as an existing dependency.

The upstream search entrypoint imports an additional reasoning module absent from the deliberately limited review bundle. Used its unmodified `core.search` engine directly for explicit typography and UX queries instead of installing a bundle. `dashboard readable professional` returned Dashboard Data and Corporate Trust; `font loading` returned Font Loading with swap/optional advice. Manrope is an editorial choice for this CRM, not a claim that the dashboard query specifically recommended it. The typography dataset also identifies Manrope as a readable body family. Native mobile recommendations were not treated as desktop web requirements.

## Implementation

- Embedded the unmodified Manrope variable TTF directly into the HTML; no CDN or network font dependency. Kept system fallback fonts and `font-display: swap`; CSP allows only data font resources and continues to prohibit connections.
- Base body text 16px, labels 13px, metadata minimum 12px, larger headings with consistent weights and line height. Numeric Health and metrics use tabular figures.
- Detail tabs and top bar wrap; long values remain readable. The duplicate Proxy page heading remains removed.
- Original font and license files are in `demo/assets/fonts/manrope/`; the complete OFL notice is also embedded in the HTML for standalone redistribution.

Font source: [Google Fonts Manrope directory](https://github.com/google/fonts/tree/main/ofl/manrope). TTF SHA-256: `3ae11c49db0455a3cc33e37d380f20fdb8c7f8b41dc07625c177e3d87a9d6ae6`. Licensed under SIL Open Font License 1.1; bundled embedding permitted with the notice retained. Metadata declares Vietnamese support. No modified font or font installed in the operating system.

## Verification

Existing Node, Edge and bundled Playwright only; browser temporary files use `demo/.qa` on D. Current behavior suites and the additional typography check:

```powershell
node demo/.qa/verify-asset-ux.cjs
node demo/.qa/verify-asset-recovery.cjs
node demo/.qa/verify-asset-management.cjs
node demo/.qa/verify-typography.cjs
node demo/.qa/capture-asset-ux.cjs
```

Typography check loads the embedded font offline, checks all four modules and detail tabs at 375/390/768/962/1024/1440px in both themes, and checks account table/detail reflow with CSS zoom at 200%. CSS zoom is a focused text/layout stress check, not full assistive-technology certification. A first zoom run exposed top-bar overflow; wrapping the top bar/actions corrected it. Vietnamese visual sample: `demo/.qa/font-vietnamese.png`.

Final results: all four suites passed. Font loaded while the browser context was offline; no JavaScript errors or HTTP requests in the typography or main UX suite. Regenerated previews and visually inspected the Accounts table, dark theme, mobile detail and Vietnamese sample. The original root AGENTS.md remained unchanged. No production build command exists in this supplied standalone workspace.

This change improves font availability and readability. It does not establish that every possible application crash is fixed. Mock role/security/live limitations remain in [RO-UX-005](RO-UX-005.md).

## Next action and retrospective

Thomas reloads the existing demo browser tab and reviews Accounts in both themes. Owner acceptance remains pending. Worked: offline font loading and explicit zoom checks caught a real layout problem. Wasted effort: the optional fontTools package was unavailable; no dependency was installed. Improvement: verify loaded fonts and visual language samples with the existing browser instead.

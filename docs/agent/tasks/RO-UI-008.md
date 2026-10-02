# RO-UI-008 — exact theSVG Reddit platform identifier

## Outcome and authorization

Thomas requested the correct Reddit logo from thesvg.org in the running MVP. Frontend asset task only: local SVG and UI placement, existing service preserved. No operator data access, dependencies, new skills, real Reddit actions, deployment, commit or push.

Checkout verified: `binhvu284/redditops`, origin HTTPS, local unborn main. Current application behavior is documented in [RO-MVP-001](RO-MVP-001.md).

## Implementation

Retrieved the catalog's Default SVG from pinned upstream revision `8419bbf3093842996019ccac83c3314dc62dd954`. Retained the original bytes, software license and [asset provenance](../../../web/assets/reddit/PROVENANCE.md). Placed a platform identifier on setup/login and sidebar, beneath the separate `ro.` product identity. Original color, gradients and aspect ratio are preserved in light/dark themes. The image is embedded locally as a byte-identical data URI, compatible with the existing CSP and already running server.

Current official Lingo guidelines were not readable. Catalog CC0 labeling does not supply trademark permission; full current brand permission and public app-name branding remain unverified. This change uses identification placement and does not claim affiliation or approval.

## Verification

- `D:\NodeJS\node.exe .qa/verify-logo-bytes.mjs`: PASS; exact 5,209 bytes reproduce upstream Git blob `488596ce1952020323b08ce6230becde4ebd58c8`. Local SVG SHA-256 `7703616008edfdb085a01da78e0ad96cbafedd3d2f1a2907394b74ca00d82b14`.
- `D:\NodeJS\node.exe .qa/check-reddit-logo.mjs`: PASS in Edge/Playwright with a separate temporary SQLite fixture. Setup/login/sidebar × light/dark × 375/768/1440px: loaded image, rendered byte equality, square ratio, contain sizing, no filter, no horizontal document overflow, no JavaScript errors or external requests. Existing operator data was never read or modified.
- `D:\NodeJS\node.exe scripts/build.mjs`: PASS, including module syntax checks; packaged SVG has the same SHA-256. Reviewed `.qa/reddit-logo-sidebar-light.png` and `.qa/reddit-logo-sidebar-dark.png` visually: original orange graphic and distinct platform/product labels.
- Git root/remote verified, no commit/push. Existing files remain untracked in the unborn checkout; `git diff --check` has no tracked changes to check. Root AGENTS.md SHA-256 remains `0BD0C5B59495C40F00A30360EBC16F6D1F5F7EECDBE530C6A2998A1406F241BF`.

Implementation and focused checks complete. Owner visual acceptance and public trademark clearance are separate and pending. No application server restart was needed.

## Retrospective

What worked: pinned source and upstream Git blob verification distinguish a real catalog asset from a guessed icon URL. Extra work: current brand guidelines were not readable; an old PDF cannot close that gap. Improvement: keep platform attribution separate from product identity and retain exact bytes with provenance.

## Next action

Refresh the running Accounts page and review the platform identifier. Owner visual acceptance remains pending.

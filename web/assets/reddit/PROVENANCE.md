# Reddit platform identifier

Reviewed on October 1, 2026 for RO-UI-008. This is a platform identifier in the local application, separate from the `ro.` application identity. It is not an endorsement, integration approval, account avatar or application favicon.

- Catalog: https://thesvg.org/icon/reddit — Default/color variant, catalog license label CC0-1.0.
- Upstream: https://github.com/glincker/thesvg/blob/8419bbf3093842996019ccac83c3314dc62dd954/public/icons/reddit/default.svg
- Revision: `8419bbf3093842996019ccac83c3314dc62dd954`.
- Git blob: `488596ce1952020323b08ce6230becde4ebd58c8`; verified against the downloaded bytes.
- File: `default.svg`, 5,209 UTF-8 bytes, LF line endings. SHA-256: `7703616008edfdb085a01da78e0ad96cbafedd3d2f1a2907394b74ca00d82b14`.

The SVG is unchanged: 216 × 216 viewBox, original orange and gradient colors, original paths and internal gradient references. No scripts, foreign objects, event handlers or external asset references were found. The image is rendered at 28 × 28 CSS pixels with contain sizing, no filter, cropping or background. `web/app.js` embeds a byte-identical data URI so the existing running server needs no new static route or restart. Update the local SVG and embedded bytes together after a future reviewed change; do not track mutable remote assets at runtime.

## License and trademark distinction

[theSVG legal notice](https://thesvg.org/legal) provides brand icons for identification/development and says users must comply with the brand owner's guidance; it does not grant trademark rights. Its pinned legal source is https://github.com/glincker/thesvg/blob/8419bbf3093842996019ccac83c3314dc62dd954/src/app/legal/page.tsx. The repository software license is MIT and retained in `UPSTREAM-LICENSE.txt`; that is separate from the catalog's per-icon CC0-1.0 label and Reddit's trademark rights.

[Reddit's Trademark Use Policy](https://redditinc.com/policies/trademark-use-policy) requires use under brand guidelines or written permission and prohibits implying affiliation. [Data API Terms section 4.1](https://redditinc.com/policies/data-api-terms) prohibits using its trademarks in an app's name/logo without express authorization; this MVP does not use the Data API, and this remains a future integration/release consideration. No permission was requested or claimed. The current Lingo brand-guideline URL returned no readable guideline content during this review, so full current brand conformance and permission for public commercial branding remain unverified. The old 2022 PDF is not substituted for current guidance.

Placement decision: identify the managed platform beside the visible text “Reddit accounts” and “Independent workspace”, beneath the independent product identity. Keep the original graphic and do not use it as the product's own mark or favicon. Public release still needs the existing product-name/brand review; this local asset change does not clear that gate or claim an official-current asset certification.

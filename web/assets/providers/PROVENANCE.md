# Proxy provider identifiers

Reviewed on October 6, 2026 for RO-PROXY-BD-001 at Thomas's request to show the exact Bright Data and Proxy-Seller marks. They identify which provider a route is configured for. They are not endorsements, partnership claims, account avatars or the application's own identity. Reddit Ops is not affiliated with or approved by either company.

Neither mark exists in theSVG (`glincker/thesvg` main `dc0b52eab4b8d3cf54d4b92fa1c13f28f406c8b0`, 7,429 icons) or Simple Icons (`develop`, 3,465 icons). Both were therefore taken from each company's own public website and compared with the reference images Thomas supplied in chat.

## Bright Data — `brightdata-icon.png`

- Source: https://brightdata.com/wp-content/themes/brightdata/assets/images/favicon.png (declared as the site's `icon` and `apple-touch-icon` on https://brightdata.com/).
- File: 81 × 81 PNG, 604 bytes, copied byte-for-byte. SHA-256 `c9b3cb09c1cf5f0715fee4cbdfff0316f9cbce636832b3f01fe190ffb2019544`.
- Content: white "i" with flame on the Bright Data blue square, the same composition as Thomas's reference. The flame-"i" vector is the `logo_letter` symbol in the official sprite https://brightdata.com/wp-content/themes/brightdata/assets/images/symbols_brd.svg (fetched sprite SHA-256 `96313e5c9620f11da7d6dfe9ce2f393d0a1e5ad332fdc156eab562795c579620`). The official raster icon is used rather than a re-composed vector so colors and proportions are not altered.

## Proxy-Seller — `proxy-seller-icon.svg`

- Source: the header logo SVG on https://proxy-seller.com/ (`data-testid="app-layout_header_logo_icon"`, `viewBox="0 0 48 44"`, three paths). Fetched page SHA-256 `017e502ffc2901313eb7f02139308bb121058df07ccf5de9dba43a0e4a18e6a4`.
- Color: the paths use `fill: currentColor`; the logo container sets `color: #35BE70` (`.mui-style-1cdaf5x`). The file sets `fill="#35BE70"` on the root, which reproduces the site's rendering. Path data is unchanged. This matches the official `/favicons/apple-touch-icon.png` (180 × 180) and Thomas's reference.
- File: 1,076 UTF-8 bytes, LF line endings. SHA-256 `8cab1877ea7cb8cd02b0141561c11d64d0fb3c836672d57f713acdd2ed1b0623`. No scripts, external references, foreign objects or event handlers.

## Use and limits

`web/proxy-ui.js` embeds byte-identical data URIs (the CSP allows `img-src data:`), so no new static route is needed. Update the local file and embedded bytes together after a future reviewed change; do not hot-link the providers' servers at runtime.

Display at 18–24 CSS pixels with `object-fit: contain`. No recolor, filter, crop, rotation or added effects. Always show beside the provider's name in text, and never as the Reddit Ops logo or favicon.

Neither company publishes brand guidelines or a press kit that could be located on October 6, 2026. Bright Data's legal page (https://brightdata.com/legal-governance) lists no logo-usage rules. Use is limited to nominative identification of the provider an operator configures. Trademark rights remain with the owners. As with the Reddit identifier, any public or commercial release needs a brand and permission review; this local asset does not clear that gate.

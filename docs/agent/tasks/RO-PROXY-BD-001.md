# RO-PROXY-BD-001 — Bright Data proxy integration

## Outcome and authority

October 6, 2026: Thomas uses Bright Data and asked for research, an implementation that lets his accounts use a United States route, and connection instructions. For the first phase, one test IP is enough to confirm connection stability; exact office-matching IP selection comes later. Integration class: full-stack. Base: `main` at `f924001e44415aec6987fcbb21a4913d5c094983`, verified origin `https://github.com/binhvu284/redditops.git`.

Authorized: research, local implementation, tests and English documentation. Not authorized in this task: entering or requesting Bright Data credentials in chat, live provider requests from the agent, purchases, browser automation against Reddit, Reddit account operations, deployment, new dependencies or skills, commit or push.

## Research findings (docs.brightdata.com, read October 6, 2026)

- Native proxy endpoint `brd.superproxy.io:44445`; SOCKS5 port 22228. Ports 22225 and 33335 stopped working when their certificates expired on September 25, 2026 at 00:00 UTC.
- Username `brd-customer-<customer_id>-zone-<zone_name>` plus flags: `-country-us`, `-session-<id>` (same exit IP while used; released after 7 idle minutes), `-ip-<x.x.x.x>` (allocated Datacenter/ISP IP). Password is the zone password.
- Residential/Mobile without KYC requires trusting Bright Data's root CA because Bright Data decrypts HTTPS, and blocks POST/PUT/DELETE in Immediate access. Residential zones created after July 7, 2026 require KYC and an approved use case. ISP and Datacenter zones do not require KYC or the certificate.
- Official IP checker `geo.brdtest.com/mygeo.json` reports country/region/city/ASN but not the IP. Bright Data warns that third-party IP checkers may see a super-proxy bypass.
- Errors arrive in `x-brd-err-code`, `x-brd-error` and RFC 9209 `Proxy-Status` headers, for example `client_10000` (authentication), `client_10050` (source IP denylisted), `client_10060` (IP not allocated to the zone), `client_10062` (no IPs in country), `client_10100` (usage limit), `policy_*` (target blocked) and 402 (Residential KYC).
- Zone Security settings support a source-IP allowlist and recommend it.

Decision: recommend an ISP zone (static, not decrypted, no KYC). Start with a sticky session test IP; later move to a specific allocated IP chosen for the office location. Reddit Ops never disables TLS verification or trusts a provider decryption CA.

## Implementation plan

1. `app/brightdata.mjs`: username parsing/composition, endpoints, geo parsing and provider error mapping.
2. `app/proxy.mjs`: tunnel/request refactor, provider-reported location (non-fatal), Reddit reachability through TLS handshake only, Bright Data error and TLS interception messages.
3. `app/server.mjs`: Bright Data preset configuration with encrypted zone credentials, session rotation, allocated IP pinning and a consented 5-check stability test with optional Reddit reachability.
4. `web/proxy-ui.js`, `web/app.js`, `web/app.css`: preset switch, Bright Data form, stability test and route-card results.
5. Tests: fixtures for error headers, geo and reachability; API tests for configuration, retention, rotation and stability.
6. Docs: `docs/BRIGHTDATA_PROXY.md`, runbook/README/current work.

Follow-up the same day: Thomas also asked for research on Proxy-Seller. Research only; findings and connection steps are in [Proxy providers](../../PROXY_PROVIDERS.md). Static Proxy-Seller ISP/IPv4 proxies already work through the generic **Other provider** form; a dedicated preset is a small optional follow-up.

## Delivered (local, uncommitted)

- `app/brightdata.mjs` (new): documented endpoint/ports, username parsing/composition, session IDs, masked customer hint, geo parsing and provider status/header → fixed error codes.
- `app/proxy.mjs`: `openTunnel`/`fetchText`/`withDeadline` refactor; Bright Data routes add a non-fatal provider-reported location from `geo.brdtest.com/mygeo.json`; `probeReachability` verifies Reddit's certificate through the tunnel with no HTTP request; provider errors and inside-tunnel TLS failures have fixed actionable messages; SOCKS5 reply codes mapped.
- `app/server.mjs`: `preset: 'brightdata'` configuration (password confirmation required; customer ID and zone password encrypted; blank fields retain them; new session clears the pinned IP; allocated IP sets the expected IP; Residential cannot use `-ip-`). Shared `proxyJob` runner for single checks and `POST /api/proxies/:id/stability` (explicit consent, 5 checks 2 s apart by default, one local baseline, optional Reddit reachability). Any failed or IP-changed run stores a Failed observation and pauses assigned accounts. Restore clears provider location and stability results.
- `web/proxy-ui.js`, `web/app.js`, `web/app.css`: provider preset switch, Bright Data form, route summary, provider location, stability section/result and route-card facts.
- Root-cause fix found during testing: destroying the raw socket before its live TLS wrapper crashed Node 22.14 on Windows (exit `0xC0000005`). Sockets are now destroyed outermost-first, on both completion and timeout.

## Verification

Commands (Node 22.14.0 on D; fixtures and screenshots in ignored `.qa/`):

```powershell
& 'D:\NodeJS\node.exe' scripts/check.mjs
& 'D:\NodeJS\node.exe' --test --test-concurrency=1 tests/*.test.mjs
& 'D:\NodeJS\node.exe' scripts/build.mjs
& 'D:\NodeJS\node.exe' scripts/proxy-browser-check.mjs
& 'D:\NodeJS\node.exe' scripts/browser-check.mjs
& 'D:\NodeJS\node.exe' scripts/workflow-browser-check.mjs
& 'D:\NodeJS\node.exe' scripts/brightdata-browser-check.mjs
git diff --check
```

Results: syntax, build and whitespace passed; full suite 16/16 (3 new in `tests/brightdata.test.mjs`); all four Edge gates passed, including the new Bright Data gate at 375/768/1440 px in both themes with zero JS errors and zero external browser requests. Screenshots `.qa/brightdata-{wizard-desktop,route-desktop,wizard-mobile}.png` were inspected. All provider results are synthetic fixtures. **No real Bright Data or Proxy-Seller connection was made by the agent**, and the stability/reachability behaviour against a real zone is unverified until Thomas runs it.

## Follow-up: Residential redesign and provider marks (same day)

Thomas showed Bright Data's **Create proxy** page with Residential selected and asked to redesign the setup for his Residential zone, then to use the exact Bright Data and Proxy-Seller logos.

Research (docs.brightdata.com, October 6, 2026): new Residential zones (after July 7, 2026) require human-reviewed KYC for registered companies with a company email domain and a funded account. Access is limited to the approved use case. Residential supports `-state`, `-city`, `-zip` and `-const`; Datacenter/ISP support country only. `brdtest.com/myip.json` is the recommended checker. `-route_err-block` is documented with two spellings and is not used until verified with a real zone.

Delivered:

- Bright Data step 1 now mirrors Bright Data's proxy types as radio cards (Residential, Datacenter, ISP), with a KYC notice for Residential and type-specific sections shown by CSS `:has()`. Residential has optional State/City/ZIP and **Bind the test session to one device** (`-const`, default on); ISP/Datacenter keep session or allocated IP.
- Server validates targeting (`residentialTargeting`), forces session mode for Residential, ignores targeting for ISP/Datacenter and composes `…-country-us-state-ny-city-newyork-zip-10001-session-<id>-const`.
- The provider checker moved to `brdtest.com/myip.json`. If Bright Data's reported IP differs from Cloudflare's, the outcome is `source-mismatch` (Unknown, accounts paused). Requested state/city differences are reported as notes.
- Provider marks: the official Bright Data favicon (byte-identical PNG) and Proxy-Seller header mark (unchanged paths, `#35BE70` as rendered) in `web/assets/providers/` with [provenance](../../../web/assets/providers/PROVENANCE.md). They are shown on preset buttons, route cards and the wizard summary, with a no-affiliation note. Neither mark exists in theSVG or Simple Icons.
- A **Proxy-Seller** preset reuses the generic form with provider, authentication and expected-IP guidance.
- Two shell-heredoc patches lost backslashes in regex literals; this was detected by syntax checks and repaired with `String.raw` scripts written through the editor.

Evidence: full suite 16/16; syntax, build (includes the provider assets) and whitespace passed; all four Edge gates passed. The Bright Data gate now covers the type cards, Residential targeting/`-const`, the Proxy-Seller preset and byte-identical rendered marks at 375/768/1440 px in both themes. Screenshots `.qa/brightdata-{residential-form,residential-dark,route-desktop,wizard-mobile}.png` were inspected. The local server was restarted on port 4317 with the new code.

## Live result with Thomas's Bright Data ISP zone (October 6, 2026)

Thomas created ISP zone `bd_isp_proxy1` (pay as you go) and connected it twice, creating two routes for the same zone; one has 60-second monitoring. Read-only database inspection: both are Available. The exit IP (kept only in the local database, not in this public repository) is US according to Cloudflare and Bright Data (ASN "Interworks Networking Services", timezone America/Chicago; no city reported). The stability test was Stable 5/5 with one IP, latency 1.1–2.1 s. Server logs show no errors.

Reddit reachability was **Blocked** on both routes. The agent sent one CONNECT-only diagnostic (no HTTP request) to `www.reddit.com:443` and `reddit.com:443` through the stored route; credentials and identifiers were not printed. Both returned `403 Forbidden`, `x-brd-err-code: policy_20052`: the site is restricted on the selected network type for compliance, and access requires KYC. Because Residential also needs company-email KYC and Web Unlocker excludes Reddit account management, Bright Data cannot currently serve Reddit for this account.

Fix: `policy_20050`/`20052`/`20080` now map to `PROXY_NETWORK_RESTRICTED` with KYC/other-provider guidance. The provider's non-secret code is stored as `providerCode` and shown on the route card (`Blocked · policy_20052`) and in the stability result. Tests cover the live header shape. Full suite 16/16, build, whitespace and all four Edge gates passed. The server was restarted; it had been stopped by the app during a usage pause, so monitoring had no observations for that interval.

There is no route delete or archive feature, so the duplicate route cannot be removed in the UI.

## Limitations and next action

- Server diagnostics do not route a Reddit browser; browser enforcement remains Unavailable.
- Session IPs can change when Bright Data releases them (7 idle minutes); monitoring keeps them active, and an allocated IP is the durable choice.
- The UI text states 5 checks (production default); tests run 3.
- Residential depends on Thomas's Bright Data KYC status; without approval the check is expected to fail with a KYC/Access denied/TLS message. Whether Cloudflare's diagnostic endpoint is inside an approved Residential use case is unverified.
- Next action: Thomas confirms whether his Residential zone predates July 7, 2026 or has approved KYC, then follows [Proxy providers](../../PROXY_PROVIDERS.md) to connect it (or an ISP zone) and run the stability test, and reports the result (no credentials in chat).

## Retrospective

Worked: reading the provider's current documentation found the September 25, 2026 port retirement that older examples miss. Wasted effort: a shell one-liner with backticks mangled two docs and had to be reverted; use the Edit tool for prose. Improvement: when isolating a native crash, run each step as a separate process. That pinpointed the TLS teardown order in one pass.

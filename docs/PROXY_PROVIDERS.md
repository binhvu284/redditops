# Proxy providers — Bright Data and Proxy-Seller

Research date: October 6, 2026 ([RO-PROXY-BD-001](agent/tasks/RO-PROXY-BD-001.md)). Provider documentation changes; recheck the linked sources before buying or relying on a detail.

## What a proxy does and does not prove here

Reddit Ops checks a route from its own backend: tunnel, verified TLS, observed exit IP/country, provider-reported location and repeated stability. This is connection administration. It does **not** make an ordinary browser tab use that route, prove an office identity, or protect an account from restrictions. A provider IP in the United States is the provider's IP, not your office network. Matching the office exactly needs a proxy or VPN endpoint hosted on the office network. A managed browser that enforces the route is a separate, later integration (RO-B10/RO-CONNECT-001).

## Recommendation

| Option | Fit for one stable US IP per account | Notes |
| --- | --- | --- |
| Bright Data **ISP** zone, test session → allocated IP | Good | Static ISP IPs, no KYC, HTTPS not decrypted. Start with a sticky test session, then pin one allocated IP. Country targeting only. |
| Bright Data **Residential** zone with approved KYC | Possible, less stable | Real-device IPs with state/city/ZIP targeting near the office. Needs approved KYC for new zones. A device can go offline, so the bound session fails and needs a deliberate new test IP. |
| Proxy-Seller **ISP** (or private IPv4) | Good | One dedicated static IP per purchased proxy, HTTP and SOCKS5 ports, login/password or IP allowlist. Use the **Proxy-Seller** preset. |
| Residential without KYC / rotating pools | Not usable for accounts | Bright Data decrypts HTTPS and blocks POST without KYC, and rotating pools change IP. |

The preset buttons show each provider's unchanged official mark. Sources, hashes and limits are in [the provider identifier provenance](../web/assets/providers/PROVENANCE.md); the marks identify the configured service and imply no affiliation.

> **Live result, October 6, 2026.** Thomas's Bright Data ISP zone passed Check connection and a 5/5 Stable test (one US exit IP, about 1.3–1.6 s average latency). Reddit reachability was **Blocked**: a CONNECT to `www.reddit.com` and `reddit.com` returned `403 policy_20052` ("Access to this site is restricted on the selected network type … you may need to undergo a KYC process"). Without approved company KYC, a Bright Data ISP zone cannot be used for Reddit.

## Bright Data (implemented preset)

Facts verified in Bright Data documentation:

- Endpoint `brd.superproxy.io`, HTTP port **44445**, SOCKS5 port **22228**. Ports 22225 and 33335 stopped working when their certificates expired on September 25, 2026 at 00:00 UTC.
- Username `brd-customer-<customer_id>-zone-<zone>` with flags `-country-us`, `-session-<id>` and `-ip-<allocated IP>`. Password is the zone password.
- A session keeps the same exit IP while used and is released after 7 idle minutes. `-ip-` targets one IP allocated to a Datacenter/ISP zone and fails with `client_10060` when the IP is not allocated.
- Residential/Mobile without KYC requires trusting Bright Data's CA because Bright Data decrypts HTTPS. Reddit Ops never trusts a provider decryption CA, so such a route fails the TLS check by design.
- **Residential KYC:** Residential zones created after July 7, 2026 require human-reviewed KYC. Only registered companies with a company email domain qualify (personal email accounts are not eligible), the account must be funded (not Playground/Limited Trial), and the approved use case limits which domains and methods work; others return "Access denied". Zones created on or before July 7, 2026 keep working.
- **Residential targeting:** `-state-<xx>` (US, requires country), `-city-<name>` (no spaces), `-zip-<5 digits>`; Datacenter/ISP support country targeting only. `-const` with a session binds one peer and returns 502 instead of switching when the device is unavailable.
- `brdtest.com/myip.json` is Bright Data's recommended checker; through the proxy it reports the exit IP, country, region, city and ASN. Third-party IP checkers may see a super-proxy bypass, so Reddit Ops compares Bright Data's IP with an independent Cloudflare result; disagreement keeps the route Unknown and accounts paused.
- Zone **Security settings → IP allowlist** restricts which machines may use the zone. Add the public IP of the computer running Reddit Ops.

How to connect:

1. In Bright Data, create or open the zone (ISP recommended; Residential only with approved KYC) with US coverage. Optional: allowlist this computer's public IP.
2. Open the zone **Overview** and copy the username (`brd-customer-…-zone-…`) and password.
3. In Reddit Ops: Proxy → Add proxy → **Bright Data**. Choose the same proxy type card as the zone (Residential, Datacenter or ISP), paste the username and password, keep **HTTP · 44445**. For ISP/Datacenter keep **One test IP — sticky session**. For Residential, optionally choose the office state, city and ZIP and keep **Bind the test session to one device**. Optionally enable 60-second monitoring with its consent box, which also keeps the test session alive. Save and confirm your workspace password.
4. Check route: tick the consent box and press **Check connection**. Expect Proxy tunnel, US exit country and Pinned exit IP to pass, plus a provider-reported location.
5. Stability test: tick the consent box (optionally Reddit reachability) and press **Run stability test**. **Stable · 5/5 · same IP** means the route is usable for the next step. Unstable or Failed pauses assigned accounts until a clean recheck and a deliberate Resume.
6. Later, for a fixed office-like identity: Edit details → **Specific allocated IP**, then paste one IP from the zone's allocated IP list. Reddit Ops then requires that exact exit IP.

Reddit Ops builds `brd-customer-<id>-zone-<zone>-country-us-session-<id>`, `…-country-us-ip-<IP>` or, for Residential, `…-country-us-state-ny-city-newyork-zip-10001-session-<id>-const` itself. Any flags pasted in the username are replaced. The customer ID and password are stored encrypted; the interface shows only the zone and a masked customer hint.

| Message code | Usual cause | Fix |
| --- | --- | --- |
| `PROXY_AUTH` | Wrong username/password, or account/billing problem | Copy credentials again from Overview |
| `PROXY_SOURCE_BLOCKED` | This computer's IP is denylisted or not allowlisted | Add the current public IP to the zone allowlist |
| `PROXY_IP_NOT_ALLOCATED` | The specific IP is not in this zone | Copy an IP from the allocated list or use a test session |
| `PROXY_NO_US_IPS` | The zone has no US IPs | Configure the zone with US IPs |
| `PROXY_KYC_REQUIRED` | Residential request needs KYC | Use an ISP zone or complete KYC |
| `source-mismatch` (Unknown) | Bright Data's checker and Cloudflare saw different IPs (possible super-proxy bypass) | Retry; if it repeats, use an ISP zone or contact Bright Data |
| `PROXY_TLS` (inside tunnel) | Provider decrypts HTTPS (Residential/Mobile without KYC) | Use an ISP zone or complete KYC |
| `PROXY_NETWORK_RESTRICTED` (e.g. `policy_20052`) | The site is restricted on this network type for compliance | Complete Bright Data KYC (company email) or use another provider |
| `PROXY_TARGET_BLOCKED` | Provider policy or zone target allow/deny list | Review zone target lists or provider policy |
| `PROXY_NO_EXIT` / `PROXY_PROVIDER_LIMIT` | No exit IP available, session IP gone, rate or usage limit | Retry later; review zone status and limits |

## Proxy-Seller (guided preset)

Facts from Proxy-Seller documentation and product pages:

- ISP proxies are dedicated, static, ISP-registered IPs, available in the USA. Choose the country at checkout; city/region by request to support. Protocols HTTP/HTTPS/SOCKS5; authentication by login/password or an IP allowlist per order.
- Each static proxy (IPv4, ISP, mobile) is listed with `ip`, `port_http`, `port_socks`, `login`, `password` (API `GET /personal/api/v1/{key}/proxy/list/{type}`; export format `login:password@ip:port`).
- Residential lists use `us.res.proxy-seller.com:10000` (ports 10000–10999 give separate IPs) with login suffixes `_c_US`, `_city_New-York`, `_s_<session>` and `_ttl_<time>`. Sessions expire after 60 minutes of inactivity. Rotation can be sticky, per request or 1–3600 seconds.
- The account API key is part of the URL path. Reddit Ops does not need or store it; never paste it into chat or logs.

How to connect a Proxy-Seller ISP proxy now:

1. In Proxy-Seller, open your US ISP order and copy one line: IP, HTTP port, login and password. If you use the IP allowlist instead, add this computer's public IP to the order.
2. In Reddit Ops: Proxy → Add proxy → **Proxy-Seller**. The provider name, Username & password authentication and guidance are prefilled. Server address = the IP; Port = the HTTP port; Protocol **HTTP** (or SOCKS5 with the SOCKS port).
3. Paste the login and password. Put the same proxy IP into **Expected fixed IP**, because Proxy-Seller states that the target sees the purchased address. Save and confirm your workspace password.
4. Run **Check connection** and then **Run stability test** as above.

Pasting a whole Proxy-Seller line and composing residential `_c_US_s_…_ttl_…` logins are not implemented (RO-PROXY-PS-001).

## Account constraints and provider APIs (researched October 6, 2026)

**Bright Data account state.** New accounts start in Playground mode (7 days). In Playground, proxy networks (Residential, Mobile, ISP, Datacenter) and the Web Unlocker API are unavailable to personal-email accounts without a payment method. Adding a payment method starts the Limited Trial (30 days, $5 proxy credit, not charged); otherwise add funds (from $10, pay as you go). The recurring 5,000 monthly free credits cover Web Unlocker, SERP, Web Scraper and Browser API, not proxies. Residential additionally needs company-email KYC; Thomas's dashboard confirms this ("Residential proxies require verification").

**Bright Data ISP vs Web Unlocker API.** ISP is a proxy network: Reddit Ops or a browser sends its own traffic through a static IP. Web Unlocker is a request API: send a URL, Bright Data fetches the page with its own rotation, fingerprints and CAPTCHA solving, and returns the HTML/JSON, billed per successful request. Bright Data states that social network account management, explicitly including Reddit, is not a supported Web Unlocker use case, and that it is not for browser automation. It is out of scope for Reddit Ops.

**Bright Data Account Management API.** `Authorization: Bearer <API key>` to `https://api.brightdata.com`. Read endpoints relevant to Reddit Ops: `GET /zone/get_active_zones`, `GET /zone?zone=`, `GET /zone/passwords?zone=`, `GET /zone/ips?zone=` (static ISP/DC IPs), `GET /zone/ips/unavailable` (IPs with connectivity problems), `GET /zone/bw`, `GET /zone/whitelist`, `GET /customer/balance`. Write endpoints exist for allowlists, passwords, zones and IP refresh. API keys are created by an admin in Account settings with one of five permissions (Admin, Finance, Ops, Limit, User) and an expiry date. Which permission each read endpoint needs is not documented per endpoint and must be verified with the real key. Proxy traffic itself still uses `brd.superproxy.io` with zone credentials.

**Proxy-Seller products.** Resident: rotating real-home IPs, pay per GB, country/region/city/ISP targeting, sticky lists (`rotation -1`) or `_s_` sessions, no KYC mentioned. IPv4: private static datacenter IP, per IP, country only. IPv4 Mix: packages of 50+ private datacenter IPs spread over many countries/subnets; location cannot be chosen per IP. ISP: dedicated static ISP-registered IP (USA available), per IP. ISP Mix: 50+ static ISP IPs mixed across regions. Mobile: 4G/5G carrier IPs, shared or dedicated, IP changes by link or every 5/30 minutes, from about $10 per IP per week. IPv6: very cheap dedicated IPv6; only reaches sites that support IPv6.

**Proxy-Seller API.** One account API key generated in the dashboard (Developer API). The official Node SDK uses `https://proxy-seller.com/personal/api/v2/` with the key in the URL path (never log URLs), a request queue and 429 retry. The docs describe v1 endpoints: `GET /resident/package` (traffic limit/used/left, expiry, rotation), `GET /resident/lists` (list login/password, whitelist, geo, rotation), `POST /resident/list/rotation`, `POST /resident/list/add`, `GET /resident/geo`, `GET /proxy/list/{type}` (static proxies with ip, ports, login, password, dates) and balance. The same key can place orders when funds exist. API access can be restricted to specific IPs through support. Proxy traffic still uses the proxy host, port and list credentials.

## Sources

- Bright Data: [Residential network access and KYC](https://docs.brightdata.com/products/residential/network-access), [Residential introduction](https://docs.brightdata.com/products/residential/introduction), [proxy configuration flags](https://docs.brightdata.com/proxy-networks/config-options), [proxy FAQ](https://docs.brightdata.com/proxy-networks/faqs), [SSL certificate](https://docs.brightdata.com/general/account/ssl-certificate), [certificate migration to 44445](https://docs.brightdata.com/general/account/ssl-certificate-migration), [Residential network access](https://docs.brightdata.com/proxy-networks/residential/network-access), [ISP first request](https://docs.brightdata.com/products/isp/send-your-first-request), [error catalog](https://docs.brightdata.com/proxy-networks/errorCatalog).
- Bright Data account and APIs: [Web Unlocker API](https://docs.brightdata.com/products/web-unlocker/introduction), [authentication and API keys](https://docs.brightdata.com/api-reference/authentication), [general FAQ: Playground and Limited Trial](https://docs.brightdata.com/general/faqs), [active zones](https://docs.brightdata.com/api-reference/account-management-api/Get_active_Zones), [zone passwords](https://docs.brightdata.com/api-reference/account-management-api/Get_Zone_passwords), [static zone IPs](https://docs.brightdata.com/api-reference/account-management-api/Get_Zone_Static_Datacenter_ISP_IPs), [live static zone status](https://docs.brightdata.com/api-reference/account-management-api/Get_live_status_of_Static_Datacenter_ISP_Zone_and_IPs_with_connectivity_problem).
- Proxy-Seller API and products: [API key](https://docs.proxy-seller.com/api-v1/get-authorization-key), [package information](https://docs.proxy-seller.com/api-v1/residential-proxy/get-package-information), [residential lists](https://docs.proxy-seller.com/api-v1/residential-proxy/get-existing-ip-list), [rotation](https://docs.proxy-seller.com/api-v1/residential-proxy/change-rotation-settings), [Node SDK](https://github.com/proxy-seller/user-api-nodejs), [IPv4](https://proxy-seller.com/ipv4/), [IPv4 Mix](https://proxy-seller.com/mix/), [ISP Mix](https://proxy-seller.com/isp-mix/), [Mobile](https://proxy-seller.com/mobile-proxies/), [IPv6](https://proxy-seller.com/ipv6/), [Residential](https://proxy-seller.com/residential-proxies/).
- Proxy-Seller: [active proxy list](https://docs.proxy-seller.com/proxy-seller/actions-with-proxies/retrieve-active-proxy), [authorizations](https://docs.proxy-seller.com/proxy-seller/actions-with-proxies/authorizations), [export format](https://docs.proxy-seller.com/proxy-seller/actions-with-proxies/export-ips-in-txt-csv-custom), [residential proxy](https://docs.proxy-seller.com/proxy-seller/residential-proxy), [session and targeting suffixes](https://docs.proxy-seller.com/proxy-seller/residential-proxy/api-tool), [ISP proxies](https://proxy-seller.com/isp/).

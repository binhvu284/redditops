# Current work

- **Active task:** [RO-PROXY-BD-001 — Bright Data integration](agent/tasks/RO-PROXY-BD-001.md), October 6, 2026, plus Proxy-Seller research. Guide: [Proxy providers](PROXY_PROVIDERS.md).
- **Current state:** Bright Data preset with proxy type cards (Residential with KYC notice, state/city/ZIP targeting and one-device `-const` session; ISP/Datacenter with session or allocated IP), HTTP 44445 or SOCKS5 22228, provider checker cross-check, consented 5-check stability test and handshake-only Reddit reachability are implemented locally and uncommitted. Proxy-Seller has a guided preset. Exact provider marks are shown with [provenance](../web/assets/providers/PROVENANCE.md). Earlier [RO-PROXY-001](agent/tasks/RO-PROXY-001.md) diagnostics remain. Managed Reddit browser routing and sign-in remain Unavailable.
- **Verification:** Full suite 16/16, syntax/build/whitespace and four Edge browser gates passed on fixtures. No real Bright Data or Proxy-Seller connection has been verified.
- **Live finding:** Thomas's Bright Data ISP zone is Stable 5/5 but Bright Data blocks Reddit on it (`403 policy_20052`, KYC required; company email only). Bright Data is not usable for Reddit on this account.
- **Next action:** Thomas tests the Proxy-Seller route (Resident sticky now, or a US ISP proxy) with the Reddit reachability check, and decides whether to pursue Bright Data company KYC. Duplicate Bright Data routes cannot be deleted yet; a route delete/archive feature and RO-PROXY-API-001 await approval. Cloud [research](CLOUD_DEPLOYMENT_OPTIONS.md) remains available for a later authorized deployment.
- **Git delivery:** October 6, 2026: proxy implementation `bb79d501448bacc27b05cc233e0382ba685783ae` and cloud research `9dc70b8` pushed to GitHub main after check, build, 13/13 tests and three Edge browser gates passed; [RO-GIT-001](agent/tasks/RO-GIT-001.md).
- **Latest UI:** [RO-UX-006](agent/tasks/RO-UX-006.md) delivered Workspace team/account access and the shared Safeguard checklist; owner acceptance pending. [RO-PROXY-UX-001](agent/tasks/RO-PROXY-UX-001.md) guided setup/Mock workflow is preserved.
- **Uncommitted:** RO-PROXY-BD-001 source, tests, browser gate and documents are local only until Thomas authorizes delivery.
- **Boundary:** No cloud hosting, payment, real Reddit operations or operator-data replacement. Live diagnostic requests occur only after route-specific consent/monitoring opt-in. Native transports are tested with isolated local fixtures; real provider and browser enforcement are separate verification/integration steps.

## Previous application checkpoint

- **Task:** [RO-MVP-001 — self-hosted application](agent/tasks/RO-MVP-001.md); previous [CRM prototype](agent/tasks/RO-UI-007.md) and [asset UX](ASSET_UX_SPEC.md).
- **State:** Functional local application implemented; syntax/build, six API/domain/security/recovery scenarios and browser checks pass. Application runs at http://127.0.0.1:4317 for first setup. Online deployment and owner acceptance remain pending.
- **Checkout:** Initial empty repository and inaccessible-source limits are historical. GitHub delivery is now verified in RO-GIT-001; source is committed/pushed on main.
- **UI follow-up:** [RO-UI-008 — theSVG Reddit identifier](agent/tasks/RO-UI-008.md): original local SVG on setup/login and sidebar, with separate application identity. Owner visual review pending.
- **Next action:** Refresh http://127.0.0.1:4317/#accounts to review the Reddit platform identifier. See [runbook](MVP_RUNBOOK.md) if first setup is still needed.
- **Authorization:** Self-hosted web MVP with login/team authorization, local verification only. No deployment, cloud services, real Reddit operations, new skills or Git delivery.

# RO-CLOUD-001 — Cloud deployment research

## Outcome

October 2, 2026: Thomas requested research and recommendations for browser-accessible cloud deployment, including free options. Research complete; provider choice/deployment remain open. See [Cloud options](../../CLOUD_DEPLOYMENT_OPTIONS.md).

## Evidence and authority

Read current manifest, store/server source, deployment-header tests and runbook at clean `main`, revision `7567b335f5c828eaceb6c05bea83542126890f55`. Read current official Railway, Oracle, Render, Koyeb and Cloudflare pricing/storage documentation. Local SQLite/key persistence and loopback binding are verified source facts; public operation, eligibility and resource costs are not verified live.

Follow-up: Thomas explicitly requested Vercel, Netlify and Hostinger comparison and required CLI setup/operations. Read their public official CLI, runtime, storage and pricing documentation, plus Railway CLI documentation. Public Vercel documentation research is authorized by that request; no Vercel service/account operations or Supabase interaction occurred.

No services or accounts created, no paid resources, no app edits, no dependencies/skills, no provider CLI installation/login, no operator-data transfer, no commit/push and no deployment. Only English research documents and the current-work checkpoint changed. Existing build/tests were not rerun for documentation-only research. Checkout/root and origin were reverified; dirty paths remain the research documents and README map only.

## Decision and next action

Recommend Railway Trial/Free for disposable online validation, then a bounded paid plan for regular small-team use. Oracle Always Free is the strict-zero-cost alternative with greater operational work and availability constraints. Do not deploy the current SQLite/key directory to Render/Koyeb Free ephemeral storage. Cloudflare Workers/D1 requires a separate migration.

The CLI requirement is met by Railway, Vercel, Netlify and Hostinger. Among the newly requested three, Hostinger VPS plus API CLI/SSH best retains this architecture. Its paid/prepaid hosting and maintenance differ from managed Business/Cloud Node hosting. Vercel Hobby's non-commercial restriction and SQLite incompatibility prevent the proposed free unchanged business deployment. Netlify Free supports a quota-limited deployment, but a full MVP requires backend/storage migration or a separate backend. Managed Hostinger Node durable writable storage remains unverified.

Next: Thomas chooses strict $0 versus a small recurring budget; then prepare the provider-specific, reviewable deployment changes before requesting final service/deployment approval.

## Retrospective

Worked: inspect persistence before comparing advertised free compute. Wasted effort: provider pages included large navigation output; use focused sections for pricing limits. Improvement: distinguish free credit, permanent free quotas and durable storage; Oracle's current 2-OCPU/12-GB allowance differs from older tutorials.

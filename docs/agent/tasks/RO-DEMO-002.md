# RO-DEMO-002 — ChatGPT-inspired local demo redesign

## Outcome and authorization

Thomas requested a more polished version of the existing UI demo, explicitly invoking Taste and Product Design research for ChatGPT layout inspiration. He approved public Edge/Playwright screenshots and local browser checks without login after the Codex browser failed. This task authorizes the standalone prototype and related English research/checkpoint documents only.

No dependencies installed, application scaffold, infrastructure, real accounts, deployment, skill installation, AGENTS registry changes, commit or push. The workspace still has no `.git`; branch, base revision, remote application source and production checks remain unknown.

## Completed

- Refined `demo/reddit-ops-demo.html` in place: neutral sidebar, grouped client shortcuts, reduced visual framing, professional system type, rounded controls, session light/dark themes and collapsible navigation.
- Added local workspace search with Ctrl+K, account/client results and empty state.
- Preserved synthetic data labeling, source/freshness labels, guided issue review, explicit resume, error/retry and preview-only backup/restore.
- Embedded actual MIT Tabler icons; no runtime network dependencies.
- Saved research with evidence/inference distinctions in `docs/CHATGPT_UX_REFERENCE.md`.

## Evidence

From workspace root, using existing Node, bundled Playwright and installed Edge:

```powershell
$env:TEMP=Join-Path (Get-Location).Path 'demo/.qa'
$env:TMP=$env:TEMP
node demo/.qa/verify.cjs
node demo/.qa/verify-redesign.cjs
```

Both passed. Tests cover original guided flows and new search/theme/sidebar interactions. Five pages were checked at 390/768/1440px. Screenshots: `demo/preview-desktop.png`, `preview-mobile.png`, `preview-dark.png`, `preview-search.png`. Screenshot capture blurs controls and returns to the top for stable full-page visual review; keyboard focus is checked separately before capture.

A styling edit temporarily left the original script without the new search handlers; the repeated search check timed out. A focused source check identified the missing handlers, the redesign was reapplied, and the final file passed both suites again. This intermediate failure is not counted as passing evidence. The reviewed Taste source SHA-256 is `AA194351B246B8B4799099D4ED7B033D29EAB6E6E3D58D8D2172978BE7B3EC89` (raw downloaded bytes; not an approved portable skill hash).

The public ChatGPT page did not expose a usable authenticated layout. An official Projects documentation image was captured and inspected instead. It is a reference illustration, not proof of current signed-in fidelity. Taste was read from upstream as a task-specific source, with its dashboard scope exception disclosed; no portable/global skill approval is inferred.

## Remaining and next action

The prototype is complete within scope and remains in-memory Mock/Manual-only UI. Owner acceptance is pending. Thomas can open the HTML, try Ctrl+K, switch theme and resolve an issue. The first production development item remains RO-000: reconcile the real Git checkout and verified existing source before implementation.

## Retrospective

What worked: existing browser checks preserved the recovery flows while design changed. What wasted effort: the unavailable Codex browser and public ChatGPT access surface could not supply signed-in screenshots. Improvement: distinguish documentation illustration, live capture and adaptation before claiming design fidelity; inspect new interactive surfaces as well as the overview screenshot.

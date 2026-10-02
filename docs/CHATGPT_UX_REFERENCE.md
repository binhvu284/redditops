# ChatGPT UX reference and prototype redesign

Task: RO-DEMO-002. Reviewed October 1, 2026. This is a local prototype design decision, not production delivery or owner acceptance.

## Evidence and limits

The requested Product Design research skill and Taste source were read explicitly for this task. The existing HTML and desktop screenshot were the redesign target. Public Edge/Playwright capture was explicitly approved after the Codex browser could not initialize. No authenticated ChatGPT session was accessed.

Direct public ChatGPT capture returned an access/loading surface. Consequently this research does not establish the current signed-in ChatGPT layout. The captured [official Projects reference](https://help.openai.com/en/articles/10169521-projects-in-chatgpt), stored at `../demo/.qa/chatgpt-official-project-reference.png`, is a documentation illustration: a prominent project heading, rounded composer, generous spacing, and compact conversation rows. Its colored project background is not carried into Reddit Ops.

The [official search guidance](https://help.openai.com/en/articles/10056348-finding-your-chats-projects-and-files-in-chatgpt) describes sidebar search and Ctrl+K on Windows. That supports a discoverable search entry and keyboard shortcut; searching local account/client records is our adaptation. [OpenAI UI guidance](https://developers.openai.com/plugins/concepts/ui-guidelines) is a secondary reference for restrained UI. No OpenAI SDK or design system was installed.

Two [sidebar feedback](https://community.openai.com/t/chatgpt-web-ui-projects-sidebar-ux-regression/1400030) and [navigation feedback](https://community.openai.com/t/the-new-chatgpt-web-ui-feels-significantly-less-intuitive-and-removes-useful-workflows/1401235) discussions provide qualitative anecdotes about discoverability and density. They are neither representative user research nor verified defect reports. The design inference is to keep navigation names and client groups visible by default, while making collapse optional.

## Findings and decisions

| Finding | Evidence / severity | Applied response |
| --- | --- | --- |
| Excess repeated panel borders compete with actionable issues | Existing prototype screenshot; medium visual hierarchy issue, designer assessment | Plain metrics, one quiet attention surface, borderless activity list |
| Account-only filtering leaves client lookup scattered | Existing prototype controls; medium navigation issue | Workspace search across accounts and clients, Ctrl+K, visible client shortcuts |
| Small labels and dense surfaces weaken scanning | Existing prototype screenshot; medium readability issue | Professional system typography, clearer heading scale, increased row spacing, restrained neutral contrast |

This pass implements those responses, session-only light/dark theme, and optional sidebar collapse. Later: validate with Thomas using actual 10–15-account workflows and inspect contrast/accessibility with production components. A conversational composer, marketing hero, decorative charts and full ChatGPT clone are unnecessary for account operations.

## Taste application and assets

[Taste upstream](https://github.com/leonxlnx/taste-skill) is MIT licensed. The reviewed exact `skills/taste-skill/SKILL.md` and license are in `demo/.qa/taste-source.md` and `taste-license.txt`. Taste explicitly excludes operational dashboards from its default scope. Thomas's explicit task invocation permits selective use here: typography, spacing, hierarchy, restrained surfaces, theme consistency and reduced motion. Marketing defaults and framework installation were not adopted. Practical direction: moderate design variation, low motion, medium-high information density. This approval applies only to this task; AGENTS.md and automatic routing remain unchanged.

Icons are actual embedded [Tabler Icons](https://github.com/tabler/tabler-icons) outline SVG assets, MIT licensed, with the license preserved inside the HTML. Runtime requests are unnecessary. Typography uses Segoe UI Variable / Segoe UI / system sans-serif, without font installation or remote loading. Control pills, 16px panels, 10–12px fields and 20px dialogs form a limited radius vocabulary. The `ro.` wordmark identifies this prototype; no Reddit logo or official affiliation is claimed.

## Verification

Existing interaction checks passed: add/duplicate validation, escaped input, filter/search, guided pause/recheck/explicit resume, client creation, activity, failure/retry, empty/reset, reload and backup/restore previews. New checks passed: Ctrl+K focus, account result navigation, empty global search, sidebar collapse/navigation/expand, theme toggle, and all five pages without document overflow at 390/768/1440px. Runtime errors and external HTTP requests were absent in the existing flow suite. Light desktop, dark desktop, mobile and search screenshots were inspected; search results were refined after visual review.

These checks establish synthetic local prototype behavior. They do not establish live Reddit health, durable storage, encryption, actual restore, production accessibility certification, remote source parity or owner acceptance.

# Signapse Landing

## Context and authority

Read this file, [README.md](README.md), and the [documentation index](docs/README.md) before work. This Astro repository implements assigned landing tasks and owns source, runtime copy/assets/demos, tests, runbooks and execution evidence. Requirement, design/prototype, copy contract, research and ADR ownership belongs to [signapse-planing](../signapse-planing/ui-design/references/landing/README.md) from 2026-10-06. Follow the assigned issue/current user request and its approved [landing contract](../signapse-planing/ui-design/references/landing/LANDING.md); update source and affected implementation documentation/tests together.

The product application owns dashboard, authentication and Articles. Integrate through configured URLs; do not require its checkout, session providers or runtime to develop, build or test the landing. Changes and cleanup stay in this repository unless the user explicitly authorizes another scope.

## Task and design handoff

Implement the assigned scope against requirement/AC and approved design references/revision from planning. Jira project `SIGN` is the shared tracker; execution follows the [planning workflow](../signapse-planing/workflow/project-execution-workflow.md) and this repository's verification/delivery policy. Missing or conflicting requirements/design go back to the coordinator; do not redefine the contract from current code or publish new issues without authorization.

Design, Pen prototypes and design-system changes are maintained in planning under [UI design instructions](../signapse-planing/ui-design/AGENTS.override.md), using its shared skills. Read the assigned design through its task references; a planning checkout is not a build/test dependency. Runtime dictionary values and CSS tokens here implement that contract.

## Assigned execution

For assigned Jira/Symphony work or an explicitly activated local-contract workflow, read [WORKFLOW.md](WORKFLOW.md) and the repository-owned [agent execution policy](.agents/skills/agent-execution-policy/SKILL.md). The worker receives only native Subtasks with `route-landing`, hands off at `In Review`, and leaves `Done`, merge and deployment to their authorized owners. Ordinary requests and configuration/skill maintenance do not activate tracker lifecycle actions.

Use local `implement`, `code-review`, `tdd`, `diagnosing-bugs`, `accessibility` and `resolving-merge-conflicts` for their matching scope; invoke `setup-workflow` explicitly for consumer configuration. API work follows the conditional [API consumer policy](.agents/skills/agent-execution-policy/references/api-handoff.md). [Consumer runbook](docs/symphony.md) covers offline validation and operator handoff; server provisioning/activation remain separate.

## Architecture

- For visual, layout, interaction or copy work, read [design implementation rules](docs/design.md) alongside the assigned planning contract/design revision. This local summary does not own or replace the planning contract.
- Astro renders static pages and HTML content; React islands own interactions. See [architecture](docs/architecture.md) for component ownership and lifecycle.
- Routes live in src/pages/, HTML shells in src/layouts/, locales/copy in src/i18n/, shared styling/fonts in src/styles/, landing composition in src/components/landing/, and UI primitives in src/components/ui/.
- Use SUPPORTED_LOCALES and locale helpers. Both Vietnamese and English copy must have the same typed shape. TypeScript is strict and uses the @/ alias.
- Header/capability hydrate with client:load; context, Audience and the shared showcase hydrate with client:idle and use internal viewport gates. Keep useful SSR/no-JavaScript/reduced-motion/WebGL fallbacks.
- The four showcase demos stay in one island. Preserve their fixture/model renderers, natural mobile flow, adaptive sticky desktop stage and playback-driven progress. Dispose observers, listeners, timers, frames and GPU resources.
- App CTA uses {PUBLIC_APP_ORIGIN}/{locale}/dashboard without reading a login session; Articles uses the same configured origin. Contact anchors and mailto remain available.
- Preview defaults to noindex. Canonical/indexability require explicit env; root remains a Vietnamese noindex entry. Request-language negotiation and domain redirects are hosting responsibilities.
- public/ contains runtime brand/provider/font/social assets only. Keep screenshots and verification evidence under docs/verification/, outside runtime assets.

## Dev handoff boundary

For direct work, complete the requested output with applicable verification; tracker/review/PR/CI workflow steps activate only when assigned. For an activated workflow, apply the repository's [local handoff and live acceptance policy](.agents/skills/agent-execution-policy/references/execution-policy.md#local-handoff-and-live-acceptance). Pending QA, merge/deploy of this contribution or owner acceptance does not itself stop dev work. Missing behavior, required checks or necessary producer/input access remains a contribution gap; keep doing meaningful independent work.

## Implementation and verification

- Keep edits within the request and preserve unrelated changes. Use UTF-8 and LF for source/config/docs; preserve image/font bytes and license notices.
- Use Node from .node-version and pnpm from packageManager. Update pnpm-lock.yaml with dependency changes.
- Run pnpm check, pnpm lint, pnpm format:check and pnpm build for source/config changes. For navigation, layout or demo changes run the affected browser coverage; run pnpm test:models for model changes. Repeat checks only when new changes or unresolved concerns require them.
- Browser tests run against built Astro output without a backend, login or application checkout. See [verification](docs/verification/README.md). Install Chromium once with pnpm exec playwright install chromium when needed.
- Formatter excludes docs/ and public/. Format edited documentation deliberately; do not alter media bytes for formatting.
- Keep real env values in ignored env files; document configuration in .env.example. Do not add credentials to code, docs or artifacts.
- Report local test evidence accurately. CI configuration is not evidence of a hosted run. Publication, merge and deployment require their own authorized scope.

Use Vietnamese for collaboration and handoff. Keep code identifiers and the existing language of documents.

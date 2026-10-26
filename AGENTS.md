# Signapse Landing

## Context and authority

Read this file, [README.md](README.md), and the [documentation index](docs/README.md) before work. This Astro repository implements assigned landing tasks and owns source, runtime copy/assets/demos, tests, runbooks and execution evidence. Requirement, design/prototype, copy contract, research and ADR ownership belongs to [signapse-planing](https://github.com/signapse-group/signapse-planing/blob/main/ui-design/references/landing/README.md) from 2026-10-06. Follow the assigned issue/current user request and its approved [landing contract](https://github.com/signapse-group/signapse-planing/blob/main/ui-design/references/landing/LANDING.md); update source and affected implementation documentation/tests together.

The product application owns dashboard, authentication and Articles. Integrate through configured URLs; do not require its checkout, session providers or runtime to develop, build or test the landing. Changes and cleanup stay in this repository unless the user explicitly authorizes another scope.

## Task and design handoff

Implement the assigned scope against requirement/AC and approved design references/revision from planning. Jira project `SIGN` is the shared tracker; execution follows the [planning workflow](https://github.com/signapse-group/signapse-planing/blob/main/workflow/project-execution-workflow.md) and this repository's verification/delivery policy. Missing or conflicting requirements/design go back to the coordinator; do not redefine the contract from current code or publish new issues without authorization.

Design, Pen prototypes and design-system changes are maintained in planning under [UI design instructions](https://github.com/signapse-group/signapse-planing/blob/main/ui-design/AGENTS.override.md), using its shared skills. For assigned Jira UI work, read and apply the [UI design gate](https://github.com/signapse-group/signapse-planing/blob/main/workflow/project-execution-workflow.md#ui-design-gate): resolve and open the approved design from the native parent in every Survey/Implement/Review session; child attachments are not required. Direct work keeps its accepted design references and boundary. A planning checkout is not a build/test dependency. Runtime dictionary values and CSS tokens here implement that contract.

## Assigned execution

For assigned Symphony work, follow the phase selected by [WORKFLOW.md](WORKFLOW.md). Ordinary requests, configuration/skill maintenance and direct local contracts do not activate tracker lifecycle actions; complete their requested output and delivery boundary.

Choose local technical skills when useful; they do not own Symphony lifecycle or grant actions. Keep the explicit invocation policy for `implement`. API work applies [API consumer standards](docs/api-consumer.md). [Consumer guide](docs/symphony.md) covers offline validation and operator handoff; server provisioning/activation remain separate.

## Architecture

- For visual, layout, interaction or copy work, read [design implementation rules](docs/design.md) alongside the assigned planning contract/design revision. This local summary does not own or replace the planning contract.
- Astro renders static pages and HTML content; React islands own interactions. See [architecture](docs/architecture.md) for component ownership and lifecycle.
- Every public page, including Blog list/detail/error states, inherits the landing foundation tokens from BaseLayout. Keep `.landingRoot` in `src/components/landing/landing-page.module.css` as the single source of `--landing-*` tokens; do not copy or redeclare those tokens in page CSS. Reuse the shared Header/Footer and their token-based geometry across routes.
- Routes live in src/pages/, HTML shells in src/layouts/, locales/copy in src/i18n/, shared styling/fonts in src/styles/, landing composition in src/components/landing/, and UI primitives in src/components/ui/.
- Use SUPPORTED_LOCALES and locale helpers. Both Vietnamese and English copy must have the same typed shape. TypeScript is strict and uses the @/ alias.
- Header/capability hydrate with client:load; context, Audience and the shared showcase hydrate with client:idle and use internal viewport gates. Keep useful SSR/no-JavaScript/reduced-motion/WebGL fallbacks.
- The four showcase demos stay in one island. Preserve their fixture/model renderers, natural mobile flow, adaptive sticky desktop stage and playback-driven progress. Dispose observers, listeners, timers, frames and GPU resources.
- Dashboard access is not open to users. Do not render dashboard-entry buttons or links on any public page; restore them only after explicit user authorization. Contact anchors, the contact form and mailto remain available. The product application continues to own dashboard, authentication and Articles.
- Preview defaults to noindex. Canonical/indexability require explicit env; root remains a Vietnamese noindex entry. Request-language negotiation and domain redirects are hosting responsibilities.
- public/ contains runtime brand/provider/font/social assets only. Keep screenshots and verification evidence under docs/verification/, outside runtime assets.

## Dev handoff boundary

For direct work, complete the requested output with applicable [standards and verification](CONTRIBUTING.md). Assigned workflow handoff and completion follow [WORKFLOW.md](WORKFLOW.md); local checks do not prove hosted delivery or worker activation.

## Implementation and verification

Read and apply [CONTRIBUTING.md](CONTRIBUTING.md) for shared conventions, verification selection, decisions and evidence. [Verification](docs/verification/README.md) owns coverage and recorded results.

Use Vietnamese for collaboration and handoff. Keep code identifiers and the existing language of documents.

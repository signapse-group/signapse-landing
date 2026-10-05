# Signapse Landing

## Context and authority

Read this file, [README.md](README.md), and the [documentation index](docs/README.md) before work. This Astro repository is the source of truth for the public landing's implementation, design contract, copy, assets, demos and tests. Follow the current user request and the [landing contract](docs/design/LANDING.md); update code and affected documentation together.

The product application owns dashboard, authentication and Articles. Integrate through configured URLs; do not require its checkout, session providers or runtime to develop, build or test the landing. Changes and cleanup stay in this repository unless the user explicitly authorizes another scope.

## Design skills

Use the repository-local [frontend-design](.agents/skills/frontend-design/SKILL.md), [design-system-patterns](.agents/skills/design-system-patterns/SKILL.md), and [prototype](.agents/skills/prototype/SKILL.md) for their respective design tasks. Read the [design skill guidance](.agents/skills/README.md) for the landing baseline, artifact locations, Pen requirements, and save verification. Prefer these local adaptations over same-named global skills. Design requests alone do not authorize application implementation or issue publication.

## Architecture

- Astro renders static pages and HTML content; React islands own interactions. See [architecture](docs/architecture.md) for component ownership and lifecycle.
- Routes live in src/pages/, HTML shells in src/layouts/, locales/copy in src/i18n/, shared styling/fonts in src/styles/, landing composition in src/components/landing/, and UI primitives in src/components/ui/.
- Use SUPPORTED_LOCALES and locale helpers. Both Vietnamese and English copy must have the same typed shape. TypeScript is strict and uses the @/ alias.
- Header/capability hydrate with client:load; context, Audience and the shared showcase hydrate with client:idle and use internal viewport gates. Keep useful SSR/no-JavaScript/reduced-motion/WebGL fallbacks.
- The four showcase demos stay in one island. Preserve their fixture/model renderers, natural mobile flow, adaptive sticky desktop stage and playback-driven progress. Dispose observers, listeners, timers, frames and GPU resources.
- App CTA uses {PUBLIC_APP_ORIGIN}/{locale}/dashboard without reading a login session; Articles uses the same configured origin. Contact anchors and mailto remain available.
- Preview defaults to noindex. Canonical/indexability require explicit env; root remains a Vietnamese noindex entry. Request-language negotiation and domain redirects are hosting responsibilities.
- public/ contains runtime brand/provider/font/social assets only. Keep screenshots and verification evidence under docs/verification/, outside runtime assets.

## Implementation and verification

- Keep edits within the request and preserve unrelated changes. Use UTF-8 and LF for source/config/docs; preserve image/font bytes and license notices.
- Use Node from .node-version and pnpm from packageManager. Update pnpm-lock.yaml with dependency changes.
- Run pnpm check, pnpm lint, pnpm format:check and pnpm build for source/config changes. For navigation, layout or demo changes run the affected browser coverage; run pnpm test:models for model changes. Repeat checks only when new changes or unresolved concerns require them.
- Browser tests run against built Astro output without a backend, login or application checkout. See [verification](docs/verification/README.md). Install Chromium once with pnpm exec playwright install chromium when needed.
- Formatter excludes docs/ and public/. Format edited documentation deliberately; do not alter media bytes for formatting.
- Keep real env values in ignored env files; document configuration in .env.example. Do not add credentials to code, docs or artifacts.
- Report local test evidence accurately. CI configuration is not evidence of a hosted run. Publication, merge and deployment require their own authorized scope.

Use Vietnamese for collaboration and handoff. Keep code identifiers and the existing language of documents.

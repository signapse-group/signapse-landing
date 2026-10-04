# Signapse Landing

## Context and scope

Read this file, [README.md](README.md), and the [documentation index](docs/README.md) before work. Use the [approved scaffold research](docs/research/astro-scaffold-research.md) for foundation changes and the current user request to determine scope.

This repository owns the public Astro landing. Dashboard/authentication and Articles remain in `signapse-ui`; shared product/domain documents remain in `signapse-planing`. The current implementation is a scaffold with locale placeholders; migrate landing content and demos only when requested.

## Architecture

- Astro renders static pages; React islands own the interactions introduced during migration.
- `src/pages/` owns routes, `src/layouts/` owns HTML shells, `src/i18n/` owns locales and copy, and `src/styles/` owns shared CSS. Add components/assets directories when their first files are needed.
- Use `SUPPORTED_LOCALES` and Astro locale helpers; keep both Vietnamese and English messages in the same typed shape.
- Source TypeScript uses strict mode and the `@/` alias. Keep route-specific behavior close to its route and add shared helpers only for established reuse.
- Placeholder pages always emit `noindex`. Root request-language negotiation and production canonical/indexability belong to the later migration/hosting work.
- CTA into the product will link directly to the configured frontend dashboard without reading a login session.
- Keep imported documents and capture archives outside `public/`; they are reference material rather than runtime assets.

## Implementation and verification

- Keep changes within the requested scope and preserve existing documents/assets. Use UTF-8 and LF for source/config files; preserve imported document content and image bytes.
- Use the Node version in `.node-version` and the pnpm version in `packageManager`. Keep `pnpm-lock.yaml` with dependency changes.
- Run `pnpm check`, `pnpm lint`, `pnpm format:check`, and `pnpm build` for source/config changes. Once checks pass, repeat only when a new change or unresolved concern requires it.
- Smoke affected routes on the production preview when changing routing, layouts, or build behavior. Add behavioral tests when migrating real interactions; scaffold work does not require a speculative test suite.
- `pnpm format` excludes imported `docs/`; do not reformat the archive as part of application changes.
- Keep env values in ignored env files; `.env.example` documents configuration. Do not introduce credentials into source or docs.
- Report verification results accurately. CI configuration alone does not prove a hosted CI run passed, and local scaffolding does not authorize publication or deployment.

Use Vietnamese for collaboration and handoff. Keep code identifiers and the existing language of imported documents.

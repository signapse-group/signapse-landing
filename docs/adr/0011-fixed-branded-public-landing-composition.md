---
status: accepted
---

# Use a fixed branded composition for the public landing

The landing owns a fixed navy/mint/white composition through src/components/landing/landing-page.module.css. Dark surfaces belong to header, Hero, Audience, final CTA and footer; showcase and provider sections use the light family. Palette, typography and assets in this Astro repository are the source of truth.

## Consequences

- Landing descendants and portalled capability popovers resolve colors from their local palette owner. OS or document dark mode does not change the composition; stored theme preference is not read or modified.
- Logo variants and Three.js colors follow the section surface, not a dashboard provider.
- Font configuration is self-hosted in src/styles/fonts.css. Tokens and UI primitive chrome are maintained locally with the approved layout and responsive behavior.
- Product proofs use DOM/SVG code and localized fixtures. Runtime media contains brand/provider/icon/font/social assets only.
- Verification covers palette isolation, responsive layout, keyboard/touch controls, code fallbacks and the [progressive WebGL contract](0010-use-progressive-webgl-for-landing-context-figure.md).

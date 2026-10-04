---
status: accepted
---

# Use progressive WebGL for the landing context figure

The Hero Context Figure in src/components/landing/landing-context-figure.tsx presents Market Knowledge Graph and price action as complementary conceptual views. It renders an SVG preview and localized summary in Astro's initial HTML, then optionally loads Three.js for pointer/keyboard interaction.

## Consequences

- React hydration keeps server output and initial client content deterministic. WebGL enhancement is dynamic and does not remove the useful fallback until ready; unavailable/lost GPU context preserves SVG/content.
- The stage is a labelled group with Enter/Space mode switching, arrow rotation and pointer controls; decorative canvas/geometry are hidden from assistive technology. No role=application.
- Pixel ratio is capped; frames stop while offscreen/hidden and remain idle in reduced motion. Cleanup disposes observers, listeners, frames, geometries, materials, textures and renderer.
- Palette is read from the local landing surface and [ADR-0011](0011-fixed-branded-public-landing-composition.md), independent of application theme state.
- Browser tests protect behavior/fallback/lifecycle. GPU-specific pixel output and physical background-tab throttling need accurate environment-specific reporting; successful simulated visibility tests are not proof of every device.

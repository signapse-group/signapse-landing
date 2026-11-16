# SIGN-602 — UG07 source and verification

## Candidate

UG07 VI/EN is imported from Planning revision [`e734b0cdd39d1551724636487ab68eca7690da57`](https://github.com/signapse-group/signapse-planing/tree/e734b0cdd39d1551724636487ab68eca7690da57). The exact content revision is commit `0e8d163` on `codex/sign-602-ug07`, rebased onto `dev` `7b32cc7daec4db2afa97294b071537fef8436921`.

| File | SHA-256 |
| --- | --- |
| `src/content/user-guides/ug07.vi.md` | `2104fa12bfa81b9900aafa6da7db6965e8dc3c5eb4986b72f292c06d13b6e972` |
| `src/content/user-guides/ug07.en.md` | `34cb5ce6000a8705176a458d19f809d2340a5720adb06ac56bf2d6d33532ba67` |

Both files use `articleId: ug07`, their matching locale, localized title, the Planning source revision, `approvalStatus: draft` and an empty `approvalReference`. Links point to UG02, UG03, UG05 and UG08 at locale-specific reader URLs. The VI/EN headings and links are checked by `pnpm test:models`.

The content covers permission and AI-turn limits; the current workspace watchlist for new and follow-up questions; recognizing absent or removed assets; checking provided sources and distinguishing source statements from interpretation; asking about missing sources or scope; and recovering from permission, quota, send and history errors. The sample BTC question is explicitly illustrative and contains no AI response transcript or personal test data.

At the start of the history instructions, both locales now state the AC4 prerequisite: the app version must support history and the current workspace must contain a saved conversation. They then explain reopening saved content, how it differs from AI memory and that reading it does not use an AI turn.

## Local verification

For page rendering only, a temporary complete 20-entry approval fixture was used in the assigned checkout. The wrapper restored the source Markdown after the run; all 20 tracked files remain `draft` with empty approval references. This fixture does not assert coordinator approval or publishable content.

The shared-host wrapper run `SIGN-602.20261116T035006Z.L0RXaC` passed **2/2 Chromium cases**, VI and EN. Each article rendered at 1440, 768 and 375 px; all six links were keyboard reachable and opened the matching locale routes; axe reported zero violations and no viewport overflow. There were no page errors, console errors or failed responses. Results: [Playwright report](article-render-browser-results.json), [VI runtime evidence](article-render-vi-evidence.json), [EN runtime evidence](article-render-en-evidence.json), [VI desktop capture](ug07-vi-1440-approved-fixture.png) and [EN mobile capture](ug07-en-375-approved-fixture.png).

The initial temporary harness had link-count expectations inconsistent with the source: six links total (UG02 twice, UG03 twice, UG05 and UG08). The harness was corrected without changing the guide, and the final run passed. The source was restored to draft after each fixture run.

On the draft-only candidate, `pnpm check` passed for 82 files with 0 diagnostics; `pnpm lint`, `pnpm format:check` and `pnpm test:models` passed (22/22). The wrapper run `SIGN-602.20261116T035421Z.BWHnub` built the normal draft collection and passed **10/10 Chromium cases** for VI/EN index gating, keyboard/touch navigation, axe/reflow and direct URLs. The build generated only `/vi/docs` and `/en/docs`; both UG07 direct URLs returned 404 without draft body text. Results: [browser-results.json](browser-results.json). The existing Vite warning for chunks over 500 kB remains. Earlier pre-sync report `SIGN-602.20261115T160759Z.0fZTRm` remains at [browser-before-base-sync.json](browser-before-base-sync.json).

## Ownership and release

Coordinator comment 11410 resumes LANDING from `Progress`, replaces the app-access blocker in comment 11399, asks that the AC4 condition precede the history steps and directs the app comparison to QA SIGN-604. LANDING has not verified dashboard labels or behavior; QA owns that comparison and its environment/revision evidence.

UG07 remains draft. No coordinator content approval, V1 public release, hosted landing deployment or application QA is claimed by this local evidence. Keep the shared reader gate in force until the coordinator approves the complete 20-locale V1 batch.

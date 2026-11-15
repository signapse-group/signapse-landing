# SIGN-602 — UG07 source migration and local verification

Checked on 2026-11-15 from branch `codex/sign-602-ug07`, based on `ab2178e3252ff6d37cf3e2acbe81f06773e55cae`.

## Candidate

The VI/EN drafts at planning revision `e734b0cdd39d1551724636487ab68eca7690da57` were moved to `src/content/user-guides/ug07.vi.md` and `ug07.en.md`. The Markdown body is preserved apart from removing the planning-only H1/draft banner and converting links to locale routes: UG02, UG03, UG05 and UG08.

Both entries use `articleId: ug07`, their matching locale, localized titles, the planning source revision, `approvalStatus: draft` and an empty `approvalReference`. The shared reader and publication gate are unchanged.

The source copy covers the SIGN-173 AC2–AC5 topics: account permission and AI-turn limits; the active workspace watchlist for new and follow-up questions; identifying absent or removed assets; checking supplied sources and distinguishing source statements from interpretation; asking about missing sources or scope; reopening saved history, its distinction from AI memory, and no new AI turn for reading; and recovery guidance for permission, quota, send and history errors with a UG08 link. The VI/EN heading structures and localized link targets are checked by `pnpm test:models`. The sample BTC question is explicitly illustrative; no AI response transcript or personal test data is included.

## Verification

- `pnpm check` — pass, 82 files; 0 errors, warnings or hints.
- `pnpm lint` — pass.
- `pnpm format:check` — pass after formatting the two imported Markdown files. The first run identified only those files.
- `pnpm test:models` — final run pass, 21/21. The first run exposed an outdated fixture variable after the metadata test was extended; that fixture was corrected before the passing run.
- `"$SYMPHONY_LANDING_BROWSER_WRAPPER" "$PWD" --grep 'documentation|unapproved direct guide URLs|Docs disclosure'` — pass, 9/9 Chromium tests, no retries. Coverage includes VI/EN catalog gating, 1440/768/375 px layout and axe, keyboard/touch Docs navigation, and direct VI/EN UG07 URLs returning 404 without draft body text.
- The wrapper build passed. It generated `/vi/docs` and `/en/docs` indexes, with no UG07 route because the complete set of 20 approved locale entries is not present. The existing Vite warning for chunks over 500 kB remains.

The shared-host evidence ID is `SIGN-602.20261115T160759Z.0fZTRm`. The [browser results](browser-results.json) are retained here; the wrapper's build and browser logs remain in the shared-host evidence archive. The built candidate was based on the revision above with the listed files uncommitted; it was a local check, not a deployment.

The article itself is intentionally not rendered through a direct public route while it remains draft. Therefore keyboard/reflow/axe checks cover the shared catalog and navigation, not the unpublished UG07 article page.

## Required before content approval

SIGN-173 and SIGN-170 require operation labels and steps to be checked against the exact app revision provided to users, with the environment/revision recorded. Neither the live SIGN-602 record nor its prior handoff comment identifies that app revision, environment or access. UI strings in the imported draft have not been verified against a deployed application. Coordinator action is required to identify the target revision and environment and provide access or assign an operator. After that input, compare the labels and steps, record any copy changes and the final content revision, then request coordinator approval for that exact revision. Keep UG07 draft and do not expose it until the V1 approval gate is satisfied for all 20 locale entries.

The local build and fixtures do not establish app feature availability, QA completion, deployed landing behavior or public release.

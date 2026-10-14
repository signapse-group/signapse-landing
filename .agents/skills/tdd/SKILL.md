---
name: tdd
description: Verify changed behavior with regression and acceptance tests at stable public seams.
---

# Behavior-Focused Testing

Use repository instructions, [verification standards](../../../CONTRIBUTING.md#verification-selection) and the accepted contract when testing. This skill owns testing technique and adds no tracker lifecycle or handoff gates. Read contract references or architecture decisions only when they affect behavior under test.

## Select the Seam

Choose the highest stable public boundary that exercises the behavior, using the issue's Verification Requirements and existing code. State the seam in the implementation plan and continue without a confirmation round. Ask only when verification requirements must change or a material unresolved trade-off requires human judgment.

Keep participating landing models/renderers/components real. Mock/fake true external boundaries and nondeterministic infrastructure only. Existing model checks use `node:test`; browser checks use Playwright on built Astro output with external app/API fixtures. Do not add backend/login/database checkouts or another test framework to run landing checks. Consult [mocking.md](mocking.md) only for boundary-design questions and [tests.md](tests.md) for examples when test design is unclear.

## Match Verification to Risk

- Bugs and non-trivial runtime changes require regression evidence at the appropriate public seam. For a reproducible bug, run a failing regression before the fix and confirm it fails for the reported behavior.
- New features/behavior need evidence for important acceptance criteria.
- Documentation-only, formatting and demonstrably behavior-neutral internal changes do not require new tests merely for coverage. Run checks required by repository instructions for the changed file types.
- If a bug cannot be reproduced or no suitable seam exists, report attempts and the exact evidence gap. Do not write a tautological test, mark mandatory evidence satisfied, or waive a required regression merely by listing it as a PR risk. Resolve the gap or obtain an explicit decision under the workflow.

## Work in Vertical Slices

Choose a small red-green-refactor loop appropriate to the behavior. Related scenarios may be established together when that clarifies one behavior; a reproducible bug still needs observed failing regression evidence before the fix. Refactor within scope when it improves the implementation without changing the contract, keeping tests green. Do not defer all refactoring to review or invent abstractions for hypothetical cases.

Tests assert observable outcomes against independent expected values. Avoid private-method tests, mocks of internal collaborators and assertions that merely repeat the implementation. Do not write a whole speculative test suite before implementing the first slice.

Run focused tests while iterating and repository-required checks before handoff. Repeat or broaden checks only after changes, failures or unresolved concerns. Pass the actual commands/results and any limitations to the implementer for independent review.

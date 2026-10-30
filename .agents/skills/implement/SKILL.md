---
name: implement
description: Implement accepted landing changes and verify affected behavior using repository patterns and standards.
---

# Implement

Apply the accepted request/contract, `AGENTS.md`, scoped instructions and [CONTRIBUTING.md](../../../CONTRIBUTING.md). This skill supports implementation technique; assignment owns actions and completion. Direct work does not activate tracker, PR or delivery lifecycle.

## Ground the change

Inspect affected code/callers/types/tests/fixtures/config, current branch/base/output and dirty-file ownership. Reuse contribution output on resume and preserve unrelated work. Identify the smallest complete change and verification seam; do not require a plan file, snapshot or report. Existing code describes current behavior, not the required outcome.

For UI, apply local [Design Handoff](../../../docs/design.md#design-handoff): representative direction/patterns suffice, routine detail is delegated, and affected rendered behavior/quality and fixed constraints still need verification. Preserve Astro static content, island/fallback boundaries, typed VI/EN and disposal requirements from repository architecture. For API integration apply [API consumer standards](../../../docs/api-consumer.md); trace actual HTTP callers and types, with fixtures at external boundaries.

## Implement and verify

Use existing components/helpers/patterns, keep changes small and complete affected callers/tests/fixtures. Choose testing or diagnosis skills when they help the task; use stable public seams and fix failures caused by the change. Apply [verification selection](../../../CONTRIBUTING.md#verification-selection), including operator browser isolation on shared hosts.

Investigate discoverable facts before raising a material decision under [decision standards](../../../CONTRIBUTING.md#decisions-and-evidence). Continue useful independent work while its dependent work waits. Reconcile accepted changes and invalidate affected evidence without discarding earlier output/history.

## Output

Report the final behavior, actual checks/results and relevant limits in the requested output location. For an assigned PR, describe the concrete problem, final change and evidence; preserve candidate history. Do not turn missing mandatory behavior/checks into a Pass. Follow the assignment's handoff instead of adding reviewer, publication or lifecycle gates through this skill.

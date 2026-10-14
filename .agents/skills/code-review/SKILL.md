---
name: code-review
description: Assess requirement adherence and technical correctness across committed and relevant uncommitted landing changes.
---

# Code Review

Read repository instructions and [CONTRIBUTING.md](../../../CONTRIBUTING.md), reusing sources already in context. Read linked standards only for the reviewed scope. Return two separate axes in one review: **Requirement adherence** and **Correctness & Standards**. This skill supplies review technique; assignment owns role, actions and completion. A standalone review does not activate tracker lifecycle or authorize edits/publication.

## Establish Sources and Scope

Accept the issue/contract and resolved base from the caller. For a PR, resolve its actual base branch; honor an explicit user-specified base. Ask only if the intended base or source cannot be discovered unambiguously. Resolve refs to commit SHAs before reviewing.

Read the accepted requirement sources and relevant decisions/references directly. When an issue is the source, assess the contribution against its parent AC or Bug expected behavior and contribution scope/Verification. An accepted local request/contract is also valid. In ad hoc review without a requirement source, disclose that adherence cannot be assessed; do not turn missing input into a full Pass.

For API work, read the [API consumer standards](../../../docs/api-consumer.md)
and current producer contract for the relevant environment. Requirement adherence
uses accepted requirements; Correctness & Standards checks consumer schema, auth,
status/error/media/protocol and business semantics against that contract. Verify
applicable producer publication/revision and landing live evidence. Fixture/browser
success does not prove full integration. Raise discrepancies to the owner instead
of changing expected behavior or inferring filter scope from generic runtime fields.

Inspect the contribution's committed diff from the resolved base/merge-base to HEAD, staged and unstaged diffs, and relevant untracked output. An empty committed diff is not an empty review if uncommitted work exists. Inspect relevant final code beyond changed lines to understand behavior and callers; for read-only deliverables, inspect the report and source evidence. Record base, HEAD and which working changes/output were inspected.

Exclude unrelated changes only with clear ownership evidence. Report ambiguous scope and whether it prevents a reliable conclusion. Do not silently ignore ambiguous files or assign all worktree changes to this Task.

## Review role

Assess raw contract/code/evidence without a predetermined verdict. When assigned as the reviewer, perform that assessment directly. Independence must come from the assigned role/session; do not call self-check independent or add a replacement reviewer as a skill-imposed gate. If explicitly required independence is unavailable, report the unmet requirement.

## Review Both Axes

**Requirement adherence:** map Acceptance Criteria or Expected Behavior to the actual final behavior and suitable evidence. Check omissions, scope creep, accepted contract changes, and related regression risks. Existing implementation can satisfy a criterion without appearing in the diff. Tests passing alone do not establish full coverage.

Assess mandatory evidence from the assignment and [verification standards](../../../CONTRIBUTING.md#verification-selection). Pending QA/owner acceptance and coordinator-owned metadata do not excuse missing required behavior, local verification or assigned checks.

**Correctness & Standards:** inspect defects in logic, authorization/security, persistence, concurrency, error handling and applicable repository standards. For affected landing scope, inspect SSR/hydration boundaries, VI/EN shape, native keyboard/focus, reduced-motion/noJS/WebGL fallback, observers/timers/GPU disposal, origin/metadata behavior and fixture isolation. Planning references own visual/copy requirements; compare affected rendered UI instead of proposing a new design. Consider maintainability where it has a concrete impact; naming preferences and speculative abstractions are not automatic blockers. Standards take precedence over generic heuristics.

Use existing check evidence when it applies to the reviewed state. Request or run missing safe checks appropriate to the work; do not broaden testing solely to repeat a green result. Documentation-only work does not require code or build checks unless repository policy says otherwise. Report missing significant required evidence explicitly.

## Findings and Completion

Make each finding actionable and traceable to its axis, location and evidence. Scale explanation to impact; a concise sentence may suffice for a simple nonblocking finding, without a fixed multi-field template. Distinguish:

- **Blocking:** missing/wrong required behavior, correctness/security defects affecting safe delivery, missing mandatory evidence or failing required checks.
- **Nonblocking:** optional naming, refactoring or optimization that does not affect requirements or safety.

Report a separate result for each axis and one handoff conclusion. A nonblocking suggestion does not keep the contribution in execution. The implementer may challenge findings with evidence; reassess them rather than requiring unnecessary changes. Escalate unresolved material contract/risk disagreements to the human.

After fixes, review changed parts and affected surrounding behavior; broaden only if warranted. Code/contract changes or specific base impacts invalidate affected evidence; main advancing alone does not require re-review of unchanged head. Return findings/verdicts in the assigned PR/artifact/session with actual evidence and limits. No mandatory repository report, snapshot or fingerprint is needed; this skill adds no merge/delivery/transition procedure.

# Survey — Ready

This runbook owns the Survey phase procedure and is loaded only when `WORKFLOW.md` dispatches this phase. A direct request to survey or review does not activate Symphony lifecycle actions.

## Profile and authority

Survey applies to native dev Subtasks in Jira project `SIGN`, with parent Story/Task/Bug, exactly one recognized routing label `route-landing`, output owned by `signapse-group/signapse-landing`, and a PR into `dev`. The profile delivers to dev `https://dev.signapse.cloud` after later review; public release is a separate coordinator-approved PR from `dev` into `main`. Direct/no-PR operations retain their separately assigned boundary. Stop and report an out-of-profile assignment.

At `Ready`, survey may read the contract/code/references, run targeted existing checks on isolated local data, clarify already accepted wording/references in the assigned Subtask body and write an owned conditional handoff. It may transition the assigned Subtask to `Progress` or `Blocked` only under the gates below. It must not edit versioned source/tests/config, commit/push/create a PR, merge/deploy or affect shared environments.

Coordinator retains priority/scope, ticket publication, initial Open → Ready dispatch, Blocked resume, Bug/QA/parent lifecycle and acceptance. Planning owns requirements/design; producers own API contracts. Infra/secrets/DNS/indexing/analytics, dashboard access and rollback remain outside the grant.

Public promotion `dev` → `main` requires a separately approved coordinator release.

## Receive and reconcile

1. Read `AGENTS.md`, scoped instructions, [standards](../../CONTRIBUTING.md), README and docs index. Reconcile the existing workspace/output without resetting or discarding it.
2. Through `jira_rest`, read live Subtask/parent, relevant accepted comments, approved references and native dependencies at start/resume and before mutations/handoff; paginate relevant comments. Verify project/type/parent, route against the recognized set in WORKFLOW and output ownership. Snapshot, assignee and parent readiness do not replace admission.
3. Confirm native `is blocked by` dependencies are complete: category `done` satisfies admission, `Resolved` in an active category does not. Unreadable/ambiguous dependencies remain unsatisfied. For UI scope, read and apply the [UI design gate](https://github.com/signapse-group/signapse-planing/blob/main/workflow/project-execution-workflow.md#ui-design-gate): follow the native parent's Design references and open the actual approved images/frames, checking version, scope and shared rules. Attachment metadata alone is insufficient. For actual API integration read [API consumer standards](../api-consumer.md). Dependency completion does not prove producer contract publication.
4. For a Bug fix, read the accepted expected/basis and latest relevant QA report/evidence; identify case/version, actual, tested build/environment and assigned impacted regression. A FAIL summary can include Blocked/Not Run or another deviation; do not enlarge fix scope from the summary.

On resume verify the recorded blocker resolution, remaining blocker and next action; status alone does not prove resolution. Do not self-resume Blocked or reopen Done. A live phase/route/ownership change ends this session; Open/Blocked/Done stops autonomous work, preserving workspace/output/evidence.

## Survey and verification

Trace affected code, callers and consumers; identify reusable patterns, required changes and the smallest implementation/verification approach. Existing code is current-state evidence, not the expected contract. Requirement must be settled before Ready; do not define new business/design rules or scope.

Run existing checks only to answer concrete survey questions on isolated local data under [verification selection](../../CONTRIBUTING.md#verification-selection). Use shared-host browser isolation when applicable. A grounded in-scope baseline failure can be handed to Implement; baseline need not be fully green and does not prove the future implementation meets AC.

Clarify the assigned body only from accepted requirements. Keep its format, concurrent content and source decisions; do not change meaning/scope/AC/parent or copy the parent contract. Reread immediately before mutation, reconcile concurrent edits, save and read back required additions. Use ADF for REST v3 bodies. Only edit records with clear ownership; shared account identity alone is insufficient. Read back ambiguous writes before retry.

## Handoff and Progress

Comment only if technical information must survive into Implement; preserve the survey record separately from later feedback/delivery. Separate observed facts from recommendations and identify useful file/symbol/revision. Omit inapplicable lines and avoid duplicate title/scope/AC or confirmation-only comments:

```text
Hướng làm: <reuse, nơi cần đổi và lý do — file/symbol>.
Cần kiểm chứng: <case/regression trọng tâm và seam>.
Đã kiểm tra: <kết quả hữu ích — link evidence>.
Lưu ý: <giới hạn hoặc điểm cần đối soát>.
```

Ready → Progress requires settled contract, correct profile/routing, satisfied dependencies/readiness, relevant survey and implementation/verification approach, the UI design gate when applicable, no unanswered mandatory decision and saved/read-back additions/handoff when needed. Missing or unreadable required design prevents Progress; use the blocker procedure below when independent survey is exhausted. Missing required reference/access/save/transition is still a gap. No survey comment is not itself a blocker; no manual survey approval or extra ticket is required.

Resolve the destination from live native transitions, transition and read back `Progress`, then end this session. Implement starts with a fresh phase prompt; do not continue into source edits in Ready's session.

## Failure and Blocked

Raise material requirement gaps to the coordinator; pause dependent work and continue useful independent investigation. Blocked is only for required external input/access/decision/dependency when no meaningful independent work remains. Save/read back a separate owned blocker before resolving the live transition and reading back `Blocked`:

```text
Blocked — <vướng mắc và output/AC/check bị chặn>.
Cần <owner>: <hành động hoặc quyết định cụ thể>.
Tiếp tục tại <live status trước Blocked> khi <điều kiện kiểm chứng được>.
Bằng chứng: <link liên quan — chỉ khi cần>.
```

Use the live previous status. Update the same owned blocker, preserve its history and other authors' content; if ownership/write/read-back is unavailable, report the unconfirmed action. Coordinator records resolution and resumes the actual previous phase; annotate an old record only when owned/authorized, otherwise backlink it.

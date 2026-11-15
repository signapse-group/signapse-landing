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
3. Check native readiness and actual producer output under [Jira dependency rules](../../CONTRIBUTING.md#reading-jira-dependencies). For UI scope, apply local [Design Handoff](../design.md#design-handoff): read parent direction, view a representative source/pattern, identify fixed constraints and detail Landing can complete. For actual API integration read [API consumer standards](../api-consumer.md).
4. For a Bug fix, read the accepted expected/basis and latest relevant QA report/evidence; identify case/version, actual, tested build/environment and assigned impacted regression. A FAIL summary can include Blocked/Not Run or another deviation; do not enlarge fix scope from the summary.

After coordinator resume to Ready, [reconcile the blocker and live ticket](../../CONTRIBUTING.md#assigned-blockers-and-resume) before using prior output. A live phase/route/ownership change ends this session. Open/Blocked/Done stops autonomous work, preserving workspace/output/evidence.

## Survey and verification

Trace affected code, callers and consumers; identify reusable patterns, required changes and the smallest implementation/verification approach. Existing code is current-state evidence, not the expected contract. Requirement must be settled before Ready; do not define new business/design rules or scope.

Run existing checks only to answer concrete survey questions on isolated local data under [verification selection](../../CONTRIBUTING.md#verification-selection). Use shared-host browser isolation when applicable. A grounded in-scope baseline failure can be handed to Implement; baseline need not be fully green and does not prove the future implementation meets AC.

Clarify the assigned body from accepted requirements or [reconcile process/verification wording after rollout](../../CONTRIBUTING.md#assigned-blockers-and-resume). Keep its format, scope, AC, parent, concurrent content and source decisions. Reread immediately before mutation, reconcile concurrent edits, save and read back required additions. Use ADF for REST v3 bodies. Edit records with clear ownership. Read back ambiguous writes before retry.

## Handoff and Progress

Comment only if technical information must survive into Implement; preserve the survey record separately from later feedback/delivery. Separate observed facts from recommendations and identify useful file/symbol/revision. Omit inapplicable lines and avoid duplicate title/scope/AC or confirmation-only comments:

```text
Hướng làm: <reuse, nơi cần đổi và lý do — file/symbol>.
Cần kiểm chứng: <case/regression trọng tâm và seam>.
Đã kiểm tra: <kết quả hữu ích — link evidence>.
Lưu ý: <giới hạn hoặc điểm cần đối soát>.
```

Ready → Progress requires settled contract, correct profile/routing, satisfied dependencies/readiness, relevant survey and implementation/verification approach, sufficient direction under local Design Handoff when applicable, no unanswered mandatory decision and saved/read-back additions/handoff when needed. Record inputs needed in a later phase with the action, owner and evidence to verify then. The transition is the handoff signal when no technical comment is needed. Complete Survey on the same Subtask within the assigned grant.

Resolve the destination from live native transitions, transition and read back `Progress`, then end this session. Implement starts with a fresh phase prompt; do not continue into source edits in Ready's session.

## Failure and Blocked

For a required Survey decision, input or permission, apply the [blocker gate and record](../../CONTRIBUTING.md#assigned-blockers-and-resume) before `Ready → Blocked`. Hand an understood in-scope baseline failure to Implement with the verification it needs.

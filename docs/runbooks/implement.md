# Implement — Progress

Read dependencies under the [shared contract](../../CONTRIBUTING.md#reading-jira-dependencies); retain the live tool `dependencies` envelope.

This runbook owns the Implement phase procedure and is loaded only when `WORKFLOW.md` dispatches this phase. A direct implementation request does not activate Symphony lifecycle actions.

## Profile and authority

Implement applies to native `SIGN` dev Subtasks with parent Story/Task/Bug, exactly one recognized routing label `route-landing`, output owned by `signapse-group/signapse-landing`, PR into `dev` and later delivery to dev `https://dev.signapse.cloud`. Direct/no-PR operations keep their separate assignment; stop and report out-of-profile work instead of inventing a PR/grant.

At `Progress`, scoped edits, local checks, commits/push/PR, CI follow-up and owned conditional handoff are authorized. Transition the assigned Subtask to `In Review` or `Blocked` only under the gates below. Independent review, merge/delivery and Done belong to the fresh In Review session; do not call a reviewer as an admission gate or wait for this revision's deployment.

Coordinator retains priority/scope, new tickets, initial dispatch, Blocked resume, Bug/QA/parent lifecycle and acceptance. Requirements/design/API decisions belong to their owners. No autonomous rollback, infra/secrets/DNS/indexing/analytics, dashboard access or shared live feature effects beyond assignment.

Public promotion `dev` → `main` requires a separately approved coordinator release; this phase cannot merge or dispatch it.

## Receive and resume

Read `AGENTS.md`, scoped instructions, [standards](../../CONTRIBUTING.md), README/docs index and assigned approved references. Read live Subtask/native parent/accepted comments/references/dependencies with `jira_rest` at start/resume and before mutations/handoff; paginate relevant comments. Verify profile/type/parent, recognized route against WORKFLOW, output and native dependency admission: category `done` satisfies it; unreadable/ambiguous or active-category blockers do not. Parent readiness and assignee do not replace this gate.

Reconcile survey or review feedback, workspace/branch/PR and existing output. Absence of a survey comment is not a blocker. Do not resurvey everything or reset Progress to Ready on resume. Inspect dirty-file ownership and target/base revision; preserve unrelated changes. Keep one PR for unmerged work; after merge an in-scope fix before Done uses a follow-up branch/PR from current dev with previous output/evidence retained. Stage only contribution-owned files.

For a Bug fix, read accepted expected/basis and the latest relevant QA report at start/resume/handoff. Identify case/version, actual, tested build/environment and assigned impacted regression; do not treat every FAIL/Blocked/Not Run as the same defect. Dev work does not resolve/close/reopen the Bug or overwrite QA results.

On resumed work verify any recorded blocker resolution rather than inferring it from status. Do not self-resume Blocked/reopen Done. Live phase/route/ownership changes end the session; Open/Blocked/Done stops work and preserves output.

## Implement and verify

Implement the smallest complete change against contract and survey/feedback, tracing affected callers/types/tests/fixtures/config. Apply [standards](../../CONTRIBUTING.md) and its required checks. For affected UI read approved design/revision and compare rendered output; preserve local SSR/accessibility/fallback evidence. For API work apply [API consumer standards](../api-consumer.md); native dependency completion and local fixtures do not replace required producer contract/publication evidence.

Choose technical skills when useful; no skill defines this phase's permissions or adds lifecycle/reviewer gates. Required behavior, full applicable local checks and accessible evidence must be complete. Baseline failures cannot be relabeled a scoped Pass. Missing necessary producer/reference/output/publication/save/transition access remains a gap; continue useful independent work.

Prepare PR into dev with Subtask key in its title. Its description/evidence owns the source contract, problem, final implementation, candidate and actual coverage/results/limits; refresh it to the final change. Verify Development-panel linkage before claiming it. If metadata/link verification is coordinator-owned while output is reviewable, report pending rather than claim verified; this does not waive required publication access or checks.

Require successful current-head PR CI with the identity and checks in [verification selection](../../CONTRIBUTING.md#verification-selection). CI success alone proves neither local verification nor AC coverage. Dev advancing alone does not require rebase/review/rerunning valid checks; head/contract changes or specific base impacts invalidate affected evidence.

Live feature execution is required only when assignment defines operation/scope/expected result/inputs/access. Public forms, protected pages or SSR technology alone do not add it. Pending deployment/QA/parent acceptance/private QA credentials alone do not delay an otherwise complete Implement handoff. Missing behavior or mandatory evidence still does.

## Handoff and In Review

When linkage/candidate/evidence is clear and accessible, the transition is the handoff signal; no Jira comment is required. Comment only for a review-relevant exception, uncertain linkage/candidate/access or concrete owner action. Link PR/evidence instead of copying checks/logs; omit inapplicable lines:

```text
Lưu ý: <ngoại lệ ảnh hưởng review hoặc cần owner — link chi tiết>.
PR cần review: <PR link> — <lý do cần chỉ rõ candidate/linkage>.
```

For an assigned Bug fix, preserve Bug/QA run/report linkage with corrected coverage and source revision in PR/evidence; delivery owner later supplies deployed build/environment evidence for QA. Local fixture/SSR checks do not establish hosted delivery.

Reread live input before edits/handoff; mutate only clearly owned records, preserve concurrent content and earlier candidates/evidence. Shared account identity does not prove ownership. Use ADF for REST v3 bodies, read back necessary saves and ambiguous writes before retry. No comments merely confirming push, CI green or transition.

With behavior/local checks/current-head PR CI/candidate evidence complete and necessary records saved/read back, resolve the live native destination, transition and read back `In Review`, then end Implement. The next session independently reviews; do not continue into merge/delivery/Done here.

## Decisions and Blocked

Investigate discoverable facts under [decision standards](../../CONTRIBUTING.md#decisions-and-evidence). Accepted changes within the same output invalidate affected checks; different/unaccepted scope requires the owner. Keep existing output/history and continue independent work while required input is unavailable.

Defects/check failures within scope belong in Progress. Blocked applies only to required external input/access/decision/dependency when no useful independent progress remains. Save/read back an owned separate blocker, resolve the live transition and read back `Blocked`:

```text
Blocked — <vướng mắc và output/AC/check bị chặn>.
Cần <owner>: <hành động hoặc quyết định cụ thể>.
Tiếp tục tại <live status trước Blocked> khi <điều kiện kiểm chứng được>.
Bằng chứng: <link liên quan — chỉ khi cần>.
```

Reuse the owned blocker preserving history/human content. Missing ownership/write/read-back must be reported as unconfirmed. Coordinator records resolution and resumes the actual previous phase, annotating an old record only when authorized or otherwise backlinking it. Done is terminal; later work needs a new assigned contribution.

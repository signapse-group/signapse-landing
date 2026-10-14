# Review and delivery — In Review

This runbook owns Review and delivery procedure and is loaded only when `WORKFLOW.md` dispatches this phase. A direct review request does not activate Symphony lifecycle actions.

## Profile and authority

Applies to native Jira `SIGN` dev Subtasks with parent Story/Task/Bug, exactly one recognized routing label `route-landing`, output owned by `signapse-group/signapse-landing`, PR into `main` and delivery to public `https://signapse.cloud`. There is no added staging environment. Stop/report an out-of-profile assignment; direct/no-PR operations retain their assigned output and boundary.

The fresh In Review session directly performs independent assessment, owns feedback/handoff, may merge this contribution's PR and perform bounded delivery recovery, and may transition its Subtask to `Progress`, `Blocked` or `Done` under this runbook. Do not delegate a replacement reviewer, edit implementation or resolve conflicts. Technical skills are optional aids and grant no permissions/gates.

Coordinator retains priority/scope, new tickets, initial dispatch, Blocked resume, Bug/QA/parent lifecycle and acceptance. Requirement/design/API decisions remain owner-controlled. No rollback of code/data, infra/secrets/domain/DNS/indexing/analytics changes, dashboard entry restoration or other-ticket fixes are authorized. Live feature effects need explicit assigned operation/inputs; public publishing alone does not authorize them.

## Receive and resume

Read `AGENTS.md`, scoped instructions, [standards](../../CONTRIBUTING.md), README/docs index and approved task references. Through `jira_rest`, read live Subtask/native parent/accepted comments/references/dependencies at start/resume and before mutations/handoff; paginate relevant comments. Verify project/type/parent, route against WORKFLOW's recognized set, output ownership and dependency admission. Category `done` satisfies admission; `Resolved` in an active category or unreadable/ambiguous dependencies do not. Snapshot, assignee and parent readiness do not replace these gates.

Inspect existing workspace/branch/PR, implementation, survey/feedback and evidence. Keep prior candidates, delivery runs/deadlines/retry counters and output history. Already merged means reconcile actual merge/review/checks and continue delivery, not merge again. A merged candidate without independent assessment still needs review before Done. On resume verify blocker resolution, not merely the new status. Do not self-resume Blocked or reopen Done.

For a Bug fix, reread accepted expected/basis and latest QA report/evidence; identify case/version, actual, tested build/environment and assigned impacted regression. Preserve Bug/QA run/report linkage and distinguish FAIL from Blocked/Not Run or another deviation. After delivery provide evidence connecting the fix to its build/environment for QA; never overwrite QA approval or change Bug lifecycle.

Live phase/route/ownership changes end this session; Open/Blocked/Done stops autonomous work preserving output. Shared credentials do not prove record ownership or phase authority.

## Independent review and PR gate

Directly inspect final code, affected callers/tests/config, committed and relevant uncommitted output, and evidence against the live contract. Resolve base/head revisions and assess actual candidate ownership; implementation summaries are input, never approval. Compare affected rendered UI with the approved design/revision. For actual API work apply [API consumer standards](../api-consumer.md); fixtures do not prove producer publication or full integration.

Return separate verdicts for **Requirement adherence** and **Correctness & Standards**. Map AC/expected behavior to final behavior and coverage; inspect omissions, scope creep, regression, security/correctness and applicable landing standards. Distinguish required blocking findings/check gaps from optional advice. Missing significant mandatory evidence is not Pass. Keep local design/SSR/accessibility/metadata/fixture checks applicable to the candidate. Use valid existing evidence or run missing safe checks under [verification selection](../../CONTRIBUTING.md#verification-selection), including shared-host browser isolation.

Require successful current-head PR CI under [verification standards](../../CONTRIBUTING.md#verification-selection). Main advancing alone does not force branch update, all checks rerun or new review; head/contract changes or specific base impact require reassessment. No merge lock or invariant base-SHA gate is introduced. Post-merge checked build must pass before publish even if main was temporarily red.

For blocking findings, conflicts or in-scope required check gaps, save/read back actionable PR feedback tied to assessed candidate: location/check → problem/impact → required outcome. Do not duplicate findings into Jira unless access/linkage/candidate is uncertain or an owner action needs coordination. A concise fallback when required:

```text
Cần sửa:
- <vị trí/check/evidence>: <vấn đề và ảnh hưởng> → <kết quả cần đạt>.
```

Resolve live native transition, return/read back `Progress` and end Review. Implement resumes existing output, not Ready. Optional suggestions do not block. Requirement gaps go to the owner rather than asking Implement to guess; missing required input follows the external-blocker gate.

## Merge and reconcile

Reread live Jira/PR/evidence and verify exact repo/main/contribution/reviewed head, non-draft open PR, mergeability, independent review and PR CI. Unknown mergeability remains pending: at most three reads with 5/10-second backoff, then investigate. With verified inputs:

```sh
gh pr merge "$PR" --repo signapse-group/signapse-landing --merge --match-head-commit "$HEAD_SHA"
gh pr view "$PR" --repo signapse-group/signapse-landing --json state,url,headRefOid,mergeCommit
```

Do not use `--admin`/`--auto` to bypass gates. Read back ambiguous commands before retry; only MERGED and actual merge SHA confirm success. Post-merge in-scope defects return Progress for a follow-up branch/PR from current main under the unfinished Subtask; keep prior output/evidence.

## Pipeline and release inputs

[Verify](../../.github/workflows/ci.yml) checks PRs/branches. Main push/merge or main-only manual dispatch checks/types/lint/format/build/model/browser, then publishes the same built Worker/assets. Main releases are serialized without cancelling the running release. Read actual run/steps: success with skipped deploy is not delivery.

Immediately before publish, CI reads main and skips Cloudflare deploy when the run is obsolete; unavailable/invalid main read fails the gate. Serialization plus this guard prevents obsolete queued reruns overwriting a newer release. Reconcile a checked descendant release containing the contribution; preserve phase/output without adding a rebase/review/base-SHA gate. Newer-main failures can delay delivery until the owner resolves them.

Release owner prepares existing secrets/origin variables under [hosting setup](../deployment/signapse-cloud.md#2-cấu-hình-cloudflare-credentials-và-github-variables). Worker needs GitHub PR/check/merge/Actions-retry and Jira own-body/comment/transition access. Cloudflare secrets stay in Actions, not baseline browser env. Required missing publication/access is a gap, not a waived gate.

## Wait in the same turn

Select the main `ci.yml` run containing this merge. Before watching, save run ID/build/start/deadline (30 minutes), run-attempt/retry counter in the existing durable owned record. Restart/reconnect/rerun retain the original budget. Use short initial exec yield and empty `write_stdin` every 30–60 seconds below the installed watchdog, including quiet output. Continue watching in the same turn while budget remains:

```sh
set -eu
: "${DEPLOY_RUN:?}" "${DEPLOY_WAIT_DEADLINE_EPOCH:?}"
remaining_seconds=$((DEPLOY_WAIT_DEADLINE_EPOCH - $(date +%s)))
test "$remaining_seconds" -gt 0
timeout "${remaining_seconds}s" gh run watch "$DEPLOY_RUN" --repo signapse-group/signapse-landing --interval 30 --exit-status
```

After exit/disconnect, reread:

```sh
gh run view "$DEPLOY_RUN" --repo signapse-group/signapse-landing --json headSha,event,status,conclusion,jobs,url,updatedAt
```

Require completed/success, a non-skipped successful Cloudflare deploy step and its Worker version/evidence. Tool timeout/CLI exit alone does not classify pipeline result. Pending within budget reconnects the same run, without duplicate manual dispatch. At deadline investigate/classify/recover finitely; do not end merely for scheduler continuation to reset the budget.

## Live revision and basic loading

CI embeds checked `github.sha` as `SIGNAPSE_BUILD_REVISION`; prerendered GET `https://signapse.cloud/build-revision.json` reports it without backend/auth and `_headers` applies no-store. Preview without identity returns null and is not delivery evidence. This build-bound identity is independent of runtime env overrides and must match the successfully published run SHA.

Fetch domain identity fresh; verify `gh api repos/signapse-group/signapse-landing/compare/<merge>...<build>` is identical/ahead. Retain source/merge/run/build/Worker-version/domain/fetch-time relation in evidence. In a fresh browser context check `/vi` and `/en` SSR HTML and referenced same-origin assets, JS boot and basic navigation. HTTP 200, merge, CI success or health alone do not prove served identity/basic loading or complete delivery.

Do not submit the public contact form or execute live Blog/API acceptance solely for smoke; feature checks need assigned operation, expected result, inputs/data/access and cleanup. Basic loading is not full feature/QA/parent Pass. Public forms, protected pages or SSR alone do not add live feature gates.

When successful build is not yet live, retain a propagation deadline 30 minutes after terminal run completion (`updatedAt` read back), using bounded intervals in the same turn. Restart cannot reset it. Old/missing identity, load failure or missing publish evidence prevents Done.

## Recovery and Blocked

Transient read failures retry at most three times with 5/10-second backoff. Read back remote state after ambiguous mutations before retry. Before rerun reconcile newer-main runs and served identity: Actions reruns retain SHA/ref. Reuse suitable checked/running descendants containing the contribution, never obsolete ancestors over a newer served build. Skipped obsolete publish requires descendant deployment evidence.

Transient pipeline infrastructure failure permits at most two reruns for that failure/run. Save counter/attempt/reason before `gh run rerun`, read back and retain original wait budget across restart. Do not dispatch duplicate runs. Code/build/CI defects within assigned scope return Progress with saved/read-back feedback. External input/access/decision/dependency or exhausted recovery goes Blocked only when no independent work remains; pending delivery within valid budget is not a blocker. Main/site can remain faulty while fixing/waiting; do not waive checks or claim Done.

Before Blocked save/read back a separate owned record, resolve native destination and read back status:

```text
Blocked — <vướng mắc và output/AC/check bị chặn>.
Cần <owner>: <hành động hoặc quyết định cụ thể>.
Tiếp tục tại <live status trước Blocked> khi <điều kiện kiểm chứng được>.
Bằng chứng: <link liên quan — chỉ khi cần>.
```

Reuse the owned record preserving history/human content. Missing ownership/write/read-back is reported as unconfirmed. Coordinator records resolution/evidence, remaining blockers and next action, then resumes actual previous phase; annotate an old record only when owned/authorized, otherwise backlink it. Restart resumes assessment/delivery and saved budget/output, not a second merge or new budget.

## Delivery handoff and Done

All applicable independent review/local/PR-CI/merge/post-merge-publish/live-build/basic-load gates must pass. Docs-only output uses artifact/location/version/review/checks instead of app deployment; workflow/runtime activation needs evidence only when assigned. Pending QA/parent acceptance/private QA credentials alone does not prevent contribution completion, but missing required behavior or evidence does. Metadata/link verification can remain coordinator-owned when output is reviewable; report pending rather than verified.

Keep detailed implementation/verification in PR/artifact/evidence; Jira owns coordination/actions. Before Done save/read back this short delivery handoff, omitting inapplicable lines:

```text
Đã bàn giao trên <môi trường>: <build/revision đã xác minh>.
Delivery: <link evidence nối contribution với build và các gate áp dụng>.
Lưu ý: <điểm ảnh hưởng trực tiếp integration/test — chỉ khi có>.
Cần <owner>: <hành động cụ thể — chỉ khi có>.
```

Do not duplicate title/scope/AC/check lists or comment merely for push, CI, polls or transitions. Keep source/merge/build relation, run IDs, fetch times and actual coverage in linked evidence; distinguish producer contract revision/environment from landing output for API work. Preserve prior candidates and survey/feedback records. Only edit clearly owned records, retaining concurrent content; shared account identity alone is insufficient. Use ADF for REST v3 bodies and read back ambiguous writes before retry.

Reread live contract/status/routing/dependencies before handoff, resolve native destination, transition and read back `Done`, then stop. Done confirms this contribution/delivery, not QA/product/parent acceptance. Later work requires a new assigned Subtask; do not reopen Done from a QA FAIL summary.

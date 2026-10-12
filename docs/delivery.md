# Review and delivery to signapse.cloud

The [execution policy](../.agents/skills/agent-execution-policy/references/execution-policy.md) owns authority, phases, feedback, transitions and handoff. This runbook owns technical gates for native `route-landing` dev Subtasks with a PR into `signapse-group/signapse-landing` main, delivery to the public `signapse.cloud` site. Direct/no-PR operations keep their separately assigned boundary.

## Review evidence and PR gate

Read independent [Code Review](../.agents/skills/code-review/SKILL.md#findings-and-completion) of current head/contract and required local verification/design evidence. Require successful `Verify / check` from `.github/workflows/ci.yml`, event pull_request of the exact PR/current head, plus actual GitHub-required checks. A same-named job at an old head/different event is insufficient.

Main advancing alone does not force a branch update, all checks rerun or a new review. Reassess affected evidence for head/contract changes or a specific base impact. Conflict/blocking findings/check gaps go Progress with saved feedback; optional advice does not block. Main may be temporarily red, but the checked post-merge build must pass before Cloudflare publish. No merge lock or invariant base-SHA requirement is introduced.

## Merge and reconcile

Read live Jira/PR/evidence, verify exact repo/main/contribution/reviewed head, non-draft open PR, mergeability, review and PR CI. Unknown mergeability stays pending; bounded reads at most three times with 5/10-second backoff then investigate. With verified inputs:

```sh
gh pr merge "$PR" --repo signapse-group/signapse-landing --merge --match-head-commit "$HEAD_SHA"
gh pr view "$PR" --repo signapse-group/signapse-landing --json state,url,headRefOid,mergeCommit
```

No --admin/--auto to bypass gates. An ambiguous command requires readback; only MERGED/actual merge SHA confirms it. Already merged means reconcile review/checks and continue delivery, not merge twice. Missing independent assessment of that candidate still needs review before Done. Post-merge in-scope defects use a follow-up PR from current main under the same unfinished Subtask; retain prior output/evidence.

## Pipeline and release inputs

[Verify](../.github/workflows/ci.yml) checks PRs/branches; main push/merge or main-only manual dispatch checks/types/lint/format/build/model/browser, then publishes the same built Worker/assets. Main runs remain serialized without cancelling the running release. Read the actual run/steps: successful verification with skipped deployment is not delivery.

Immediately before publishing, the pipeline reads main and skips the Cloudflare deploy step if this run is obsolete. An unavailable/invalid main read fails the gate. Serialization plus this guard prevents an old queued rerun from overwriting a newer release. Releases can coalesce: reconcile a checked descendant run containing the contribution, preserving phase/output. This adds no PR rebase/review/base-SHA gate. A newer main failure can delay delivery until its owner resolves it.

Release owner prepares existing Cloudflare secrets and origin variables under [hosting setup](deployment/signapse-cloud.md#2-cấu-hình-cloudflare-credentials-và-github-variables). Worker needs gh PR/check/merge/Actions-retry and Jira own-body/comment/transition access; Cloudflare secrets remain in Actions, not baseline browser env. Never change domain, DNS, secrets, indexing, analytics or restore dashboard entry outside assignment. The autonomous grant includes publishing the assigned contribution on the public site; there is no added staging environment.

## Wait in the same turn

Choose the main `ci.yml` run containing this merge and record run ID/build/start/deadline (30 minutes), run-attempt/retry counter in the existing durable owned record before watching. Restart/reconnect/rerun retain the original run budget. Use short initial exec yield for a terminal session, then empty `write_stdin` every 30–60 seconds below the installed watchdog, including quiet output. Keep watching in the same turn while valid budget remains.

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

Require completed/success and the non-skipped successful Cloudflare deploy step, plus its Worker version/evidence. Tool timeout or CLI exit alone does not classify pipeline result. Pending within budget reconnects the same run; no duplicate manual dispatch. At deadline investigate/classify/recover finitely; do not reset a 30-minute budget through scheduler continuation.

## Live revision and basic loading

CI embeds checked `github.sha` as `SIGNAPSE_BUILD_REVISION`; prerendered GET `https://signapse.cloud/build-revision.json` reports that build without backend/auth. Static `_headers` applies no-store. Preview without identity reports null and is not delivery evidence. The build-bound identity is independent of Worker runtime env overrides and must match the successful published run's SHA.

Read domain identity fresh, verify `gh api repos/signapse-group/signapse-landing/compare/<merge>...<build>` is identical/ahead, and retain source/merge/run/build/Worker version/domain/fetch-time relation. Check `/vi` and `/en` SSR HTML plus their referenced same-origin assets load in a fresh browser context, including JS boot/basic navigation. HTTP 200/CI success alone does not prove served identity/basic loading.

Keep approved local design/SSR/accessibility/metadata/fixture evidence. Do not submit the public contact form or run live Blog/API acceptance just for deployment smoke; those require assigned operation, inputs/data and cleanup. Basic loading is not full feature/QA/parent Pass.

If a successful build is not live yet, retain a propagation deadline 30 minutes after run completion (`updatedAt` read back after terminal completion), with bounded tool intervals in the same turn. Restart cannot reset it. Old/missing identity, load failure or missing publish evidence prevents Done.

## Recovery and Done

Transient read errors retry at most three times with 5/10-second backoff. Read remote state after ambiguous mutations before retry. Before a rerun, reconcile newer main runs and served identity: Actions reruns retain the original SHA/ref. Reuse a suitable checked/running descendant run containing the contribution; never rerun an obsolete release to republish an ancestor over a newer served build. A skipped obsolete publish needs descendant deployment evidence. Transient pipeline infrastructure failure permits at most two reruns for that failure/run; store counter/attempt/reason before `gh run rerun`, reread afterwards and preserve budget across restart. Do not dispatch duplicates.

Code/build/CI defects within assigned scope return Progress; external input/access/decision or exhausted recovery goes Blocked only when no independent work remains. No autonomous rollback of code/data, infra/secrets/domain/indexing changes or fixes to another ticket. Main/site can remain faulty while fixing or waiting for the owner; do not waive required checks or claim Done.

All applicable review/local/PR-CI/merge/post-merge-publish/live-build/basic-load gates precede [saved delivery handoff](../.agents/skills/agent-execution-policy/references/execution-policy.md#review-và-delivery-handoff) and Done/readback. Use artifact/version/review/checks instead of app deploy for docs-only output; assigned runtime activation still needs its own evidence. QA and parent acceptance remain coordinator-owned.

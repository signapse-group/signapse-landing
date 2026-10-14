# Symphony procedure organization — local verification 2026-10-14

Implemented the accepted organization rules locally in landing and related Planning references. The user accepted the phase drafts before switching the entrypoint. [WORKFLOW.md](../../WORKFLOW.md) now selects one phase procedure; [CONTRIBUTING.md](../../CONTRIBUTING.md) owns shared standards and verification selection. Technical skills no longer own Symphony lifecycle. API consumer guidance remains in [API consumer standards](../api-consumer.md).

## Checked inputs and scope

Landing baseline: `1cde8cc967cb3b829393f8b077f3d16b10f54f8d`, with the final uncommitted documentation/prompt/checker changes. Runtime used for offline checks: exported Symphony source `850924f919270293a50efbd30c8401c833005c2b`, Elixir 1.19.5 / OTP 28 in a temporary container. Dependencies were installed only in that container, then its network was disconnected for checks. The runtime source checkout was not modified; `mix run --no-start` verified no supervisor started and used fixture credentials without hooks, polling or live tracker writes.

Planning changes cover landing references in `workflow/project-execution-workflow.md`, `workflow/issue-tracker.md` and three historical update plans. Diffs were compared to copies taken immediately before landing edits, preserving concurrent FE changes. Historical references to retired landing policy/skills/delivery are pinned to baseline revision; their file targets and anchors were verified from Git. The former onboarding plan's observed implementation/check results were retained in [historical evidence](symphony-consumer-2026-10-07.md); remaining migration procedure is available in Git history.

## Results before follow-up cleanup

| Check | Result |
| --- | --- |
| Real-runtime consumer checker | Passed config/routing/native dependencies and all 108 strict Liquid fixtures for phase selection, unsupported states, optional context, descriptions and attempts. |
| Adversarial checker runs | All eight mutations rejected with assertion failures: wrong clone repo, clone subdirectory, comment-only clone, missing helper persistence, wrong phase runbook, duplicate phase runbook, mandatory skill invocation and missing runbook target. |
| Config preservation | Raw YAML frontmatter and parsed YAML matched the saved baseline exactly; model/concurrency/sandbox/hooks/routing/states unchanged. |
| Final document checks | 25 edited/new text files across both scopes checked for UTF-8/LF/trailing whitespace; 271 local links/anchors and 18 pinned landing targets verified, zero link gaps. |
| Skills | Bundled `quick_validate.py` passed implement/code-review/tdd/diagnosing-bugs/setup-workflow; five existing metadata YAML files parsed and matched baseline, including invocation policies. PyYAML was installed in temporary tooling only. |
| Formatting | `pnpm exec prettier --check AGENTS.md README.md CONTRIBUTING.md WORKFLOW.md` passed after formatting CONTRIBUTING/WORKFLOW. `mix format --check-formatted` passed for the offline checker. |
| Organization and scope | Only WORKFLOW directly links to execution runbooks. Current references to retired files were removed; remaining historical links are pinned. No application source, runtime assets, package/lock or CI workflow changes. |

Required phase permissions, session boundaries, current-head PR CI, conditional handoff, ownership/read-back, blocker/resume, Cloudflare/live-build/basic-load gates and bounded recovery were reconciled with the retired sources. Review retains 30-minute pipeline and propagation deadlines, at most two infrastructure reruns, and three transient reads with 5/10-second backoff. This inspection is not a separate independent review session.

## Follow-up review and cleanup

The user requested another review against the organization rules and removal of setup-workflow. Removed its three files (207 lines at the time of review) and the active AGENTS invocation pointer. Host inputs, browser isolation and offline validation remain in the consumer guide. The earlier skill validation above records the state before removal.

Replaced repeated architecture constraints in CONTRIBUTING with a reference to the existing AGENTS architecture section, and repeated PR CI identity in Review procedure with a reference to verification standards. Required behavior and gates remain defined at their existing sources. Kept the API consumer standards, offline checker, historical evidence and the technical testing/diagnosis references: they have current callers and distinct purposes. Shared admission/ownership/blocker instructions remain in each phase so a selected runbook is usable independently.

The review covered the uncommitted workflow, phase procedures, standards, affected skills, checker and related Planning references against landing baseline `1cde8cc967cb3b829393f8b077f3d16b10f54f8d`. The configured execution scale remains one landing agent, with shared-host browser isolation. Requirement adherence and Correctness & Standards have no remaining blocking finding in this scope. This was a follow-up inspection in the implementing session, not an independent reviewer session. WORKFLOW and checker did not change during this cleanup; their prior real-runtime evidence remains applicable.

Follow-up validation passed: Prettier on AGENTS/CONTRIBUTING/WORKFLOW/README, `git diff --check`, UTF-8/LF checks for 23 edited/new files, 265 local links/anchors, 18 pinned landing targets, unchanged raw/parsed YAML and four remaining skill metadata files. No active setup-workflow reference remains; mentions here are historical evidence. Application suites and real-runtime fixtures were not rerun for this documentation-only cleanup.

## Limits

No application check/lint/build/model/browser suites were rerun: this contribution only reorganizes Markdown/Liquid procedure and updates the offline checker, under the accepted verification-selection change. No commit/push/PR/merge, Jira writes, deployment, host activation or canary was performed. Local source/render evidence does not establish worker adoption or live delivery. Publication and refreshing existing worker workspaces/sessions remain operator work when separately assigned.

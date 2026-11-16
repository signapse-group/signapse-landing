# Contributing to Signapse Landing

This file owns shared implementation standards and verification selection for direct work and assigned contributions. Read `AGENTS.md` and applicable scoped instructions first. Assigned Symphony work follows the phase selected by `WORKFLOW.md`; standards and skills do not grant tracker writes, publication, merge or deployment.

## Contract and change scope

Implement the current request or assigned accepted contract. Planning owns landing requirements, design/prototypes, copy contracts and ADRs; this repository owns source, runtime copy/assets/demos, tests and execution evidence. Existing code describes current behavior, not expected behavior. Read assigned references/revisions and raise missing or conflicting requirements to their owner instead of redefining them.

Keep changes within the assigned repository/output and preserve unrelated work. Inspect affected callers, tests, fixtures, config and exports before editing; reuse existing components and patterns. Do not require dashboard, authentication, backend or Planning checkouts to develop, build or test landing. API integration uses [API consumer standards](docs/api-consumer.md) when the work depends on a producer contract.

Use UTF-8 and LF for source/config/docs; preserve media bytes and license notices. Use Node from `.node-version` and pnpm from `packageManager`; update `pnpm-lock.yaml` with dependency changes. Keep credentials and real env values in ignored env files; document configuration in `.env.example` or the applicable runtime example.

## Architecture and affected UI

Apply the [architecture constraints](AGENTS.md#architecture) and [component ownership](docs/architecture.md). For visual/layout/interaction/copy work, apply [Design Handoff](docs/design.md#design-handoff) and design implementation rules: representative direction/patterns are sufficient, and landing completes routine detail within scope. Assess affected rendered UI against AC, accepted direction/fixed constraints, usability, responsive, keyboard/focus, accessibility and fallback. Missing detailed mockups and unspecified pixel differences within that authority are not blocking defects; required behavior and evidence remain mandatory.

## Verification selection

Choose checks by the actual change and accepted verification requirements. Complete every applicable required check; do not convert a baseline failure into Pass. Repeat or broaden checks only for new changes, failures or unresolved concerns. [Verification](docs/verification/README.md) owns the browser/model coverage and stored evidence; report commands, results, candidate/revision and limitations accurately.

| Change                                       | Required verification                                                                                                                                                                                                                                                                                            |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Application source/config                    | `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm build`.                                                                                                                                                                                                                                                    |
| Models                                       | Applicable source checks plus `pnpm test:models`.                                                                                                                                                                                                                                                                |
| Navigation/layout/demos                      | Applicable source checks plus affected `pnpm test:browser` coverage on built output.                                                                                                                                                                                                                             |
| Documentation or procedure moved in Markdown | Preserve rules/exceptions/ownership; check changed links/anchors, formatting and UTF-8/LF. No application suite solely for this change.                                                                                                                                                                          |
| WORKFLOW prompt/Liquid organization          | Render all phases, unsupported states, missing optional context and resume/attempt using the Symphony checkout renderer through `scripts/check-symphony-workflow.exs`. Compare the effective profile YAML with the baseline if runtime configuration moves. No application build solely for prompt organization. |
| Offline workflow checker                     | Run the real-runtime checker, Elixir formatting and affected adversarial fixtures.                                                                                                                                                                                                                               |
| Skills                                       | Validate frontmatter/metadata, links and invocation policies; keep technical guidance independent of Symphony lifecycle.                                                                                                                                                                                         |
| Actual runtime/config behavior               | Focused checks at the affected seam plus applicable repository checks; document/render checks do not replace runtime evidence.                                                                                                                                                                                   |

Browser checks run on built Astro output with isolated external fixtures; no backend, login or product application is required. On shared Symphony hosts use the operator wrapper, shared lock and landing-only cache from [browser isolation](docs/symphony.md#browser-isolation-trên-shared-host), including focused and reviewer checks. Install Chromium once with `pnpm exec playwright install chromium` when needed. Do not submit live public forms for baseline checks.

Formatter excludes docs, runtime assets and local skills; format edited documentation deliberately. A configured CI pipeline does not prove a hosted run. For the assigned dev-with-PR profile, required PR CI is successful `Verify / check` from `.github/workflows/ci.yml`, event `pull_request` for the exact PR/current head, plus actual GitHub-required checks. Old-head or other-event success is insufficient. This standard defines check identity; assignment determines when the gate applies.

## Decisions and evidence

Investigate discoverable facts first. Routine implementation choices stay within accepted scope and standards. Present an unresolved acceptance-significant decision with its affected behavior, viable options, recommendation and dependent work; continue meaningful independent work. Accepted decisions persist; silence is not acceptance. Resolve human identities from explicit configuration/context instead of guessing whom to mention.

Record an accepted decision in the existing owning contract only when authorized. If a required durable update is unavailable, retain it in the session and report the unconfirmed step. Accepted changes within the same deliverable invalidate affected checks/review; a different deliverable requires an owner decision. Head/contract changes or specific base impacts need reassessment; main advancing alone does not invalidate unchanged-head evidence.

Keep detailed verification in the existing PR/artifact/session/evidence location, without mandatory reports, snapshots or fingerprints. Local fixtures prove their observed boundary, not producer publication, hosted behavior, authentication or external effects. Pending QA/owner acceptance does not waive missing behavior or required checks. Direct work stops at its requested boundary; Jira, independent review, PR, CI, merge and delivery gates apply only when assigned.

Use Vietnamese for collaboration and handoff. Keep code identifiers and the existing document language.

## Reading Jira dependencies

For Symphony assignments, keep the live `dependencies` envelope from `jira_rest GET /rest/api/3/issue/{key}` with `fields=issuelinks`, including its metadata outside `body`. Before admission, Symphony waits for prerequisites in `blocked_by` to reach category `done`. `blocks` lists downstream issues. Require `complete=true` and `ready=true` for native readiness, and reread missing or ambiguous metadata. Use the [Symphony dependency contract](https://github.com/signapse-group/signapse-symphony/blob/main/elixir/README.md#jira-dependency-contract) for link direction because Jira supplies both link type labels. After admission, check the actual output the phase needs even if the producer is Done. Record the specific missing or incorrect output, producer and source record.

## Assigned blockers and resume

Classify each point by what it needs:

| Type        | Resolution owner                                                                                                                                                                                                                                         |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Requirement | Planning reconciles missing or conflicting scope, copy, design direction, expected behavior, AC or verification ownership. The coordinator or delegate decides. Landing completes routine details under [Design Handoff](docs/design.md#design-handoff). |
| Tooling     | Landing fixes its build/test/fixture defects within the assigned scope and grant. The tool owner handles the rest.                                                                                                                                       |
| Vận hành    | An operator resolves unavailable access, credentials, runner, service, workspace, lease/recovery or required checkout instructions. The coordinator decides any expansion of the grant.                                                                  |
| Dependency  | The producer delivers the assigned API, asset, fix or other input. Landing records the exact gap under [Jira dependency rules](#reading-jira-dependencies). The coordinator reconciles links and assignment as needed.                                   |

If a required link fails, look up the referenced item by path, title or ID in the current checkout and the owner's canonical source within your read access. Compare the identity, revision and applicable content with the accepted contract or decision. Record and use an accepted equivalent when it establishes the rule. If the source is still missing or conflicts, name the output or check that depends on it. Use the assigned checkout for required worker instructions.

When you encounter a blocker, list the outputs and checks still due in this phase. Identify which depend on the missing input. Complete all meaningful independent implementation, checks, evidence, cleanup and handoff preparation within the phase and grant. For example, while dashboard access is pending, use the applicable local fixture to check article-body keyboard/reflow and open related VI/EN links when the target articles are available. Catalog coverage and the expected public draft 404 are separate evidence. Record additional blockers as they arise. If the cause is unclear, record the observed symptom, hypothesis, next check and who can run it. Use the existing admission/retry mechanism for temporary resource contention. Include cleanup or residue when an operator must recover outside the grant. Pass inputs needed later to that phase's owner in the handoff. Fix in-scope defects in Progress, or return them there with findings from Review.

Hand off known blockers together after meaningful independent work is exhausted. Transition the assigned Subtask to `Blocked` only if mandatory output/AC/check for the current phase still needs an external input, access, decision or action beyond allowed recovery. Update an owned record separate from delivery. Keep prior candidates, concurrent content and links to source evidence. Start with three lines in this order. State the blocked output and phase, the owner and action, then the observable condition for continuing. Follow with evidence, work completed and why independent work has ended. For each point identify its type, source/version, why it is needed now, and how its owner/action maps to its resume condition. Distinguish the producer from the person who must act. Ask the coordinator to assign an owner if needed. Shared account identity alone does not show ownership. Annotate an old record only when owned and authorized, otherwise link it.

Optional layout:

```text
Bị chặn — <output/AC/check cần ở phase này>.
Cần <owner> — <hành động hoặc quyết định cụ thể>.
Tiếp tục khi — <kết quả, nguồn hoặc quyền truy cập kiểm chứng được>.
Căn cứ — <Subtask, repo, live status trước Blocked, loại và nguồn/version>.
Đã làm — <kết quả, evidence và record nguồn>.
Còn lại — <phần phụ thuộc và lý do đã hết việc độc lập>.
```

Reread the live issue and assigned phase, route and ownership. Record the detecting repository and the live status immediately before the transition to `Blocked`. Save and read back the record before using the authorized native transition from the live issue. Read back `Blocked` and end the session. Report any unconfirmed write or transition as such. The coordinator records the resolution and resumes the actual previous phase. On resume the worker rechecks the live contract, dependencies, resolution, environment and remaining points before using prior output.

When continuing a non-Done ticket after rollout, reconcile old process/verification wording within the assignment and grant. Record the basis, read back any update and preserve ticket identity, history and evidence for the actual revision. The coordinator owns changes to requirement, scope, AC or environment permissions. Applying a changed technical gate to a historical candidate requires applicable rollout evidence or a coordinator decision.

# Contributing to Signapse Landing

This file owns shared implementation standards and verification selection for direct work and assigned contributions. Read `AGENTS.md` and applicable scoped instructions first. Assigned Symphony work follows the phase selected by `WORKFLOW.md`; standards and skills do not grant tracker writes, publication, merge or deployment.

## Contract and change scope

Implement the current request or assigned accepted contract. Planning owns landing requirements, design/prototypes, copy contracts and ADRs; this repository owns source, runtime copy/assets/demos, tests and execution evidence. Existing code describes current behavior, not expected behavior. Read assigned references/revisions and raise missing or conflicting requirements to their owner instead of redefining them.

Keep changes within the assigned repository/output and preserve unrelated work. Inspect affected callers, tests, fixtures, config and exports before editing; reuse existing components and patterns. Do not require dashboard, authentication, backend or Planning checkouts to develop, build or test landing. API integration uses [API consumer standards](docs/api-consumer.md) when the work depends on a producer contract.

Use UTF-8 and LF for source/config/docs; preserve media bytes and license notices. Use Node from `.node-version` and pnpm from `packageManager`; update `pnpm-lock.yaml` with dependency changes. Keep credentials and real env values in ignored env files; document configuration in `.env.example` or the applicable runtime example.

## Architecture and affected UI

Apply the [architecture constraints](AGENTS.md#architecture) and [component ownership](docs/architecture.md). For visual/layout/interaction/copy work, apply [design implementation rules](docs/design.md) alongside the approved design revision and compare affected rendered UI with its references, including keyboard/focus and accessibility checks.

## Verification selection

Choose checks by the actual change and accepted verification requirements. Complete every applicable required check; do not convert a baseline failure into Pass. Repeat or broaden checks only for new changes, failures or unresolved concerns. [Verification](docs/verification/README.md) owns the browser/model coverage and stored evidence; report commands, results, candidate/revision and limitations accurately.

| Change                                       | Required verification                                                                                                                                                                                                                                                               |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Application source/config                    | `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm build`.                                                                                                                                                                                                                       |
| Models                                       | Applicable source checks plus `pnpm test:models`.                                                                                                                                                                                                                                   |
| Navigation/layout/demos                      | Applicable source checks plus affected `pnpm test:browser` coverage on built output.                                                                                                                                                                                                |
| Documentation or procedure moved in Markdown | Preserve rules/exceptions/ownership; check changed links/anchors, formatting and UTF-8/LF. No application suite solely for this change.                                                                                                                                             |
| WORKFLOW prompt/Liquid organization          | Render all phases, unsupported states, missing optional context and resume/attempt using the real Symphony parser/config/PromptBuilder through `scripts/check-symphony-workflow.exs`; compare YAML with the accepted baseline. No application build solely for prompt organization. |
| Offline workflow checker                     | Run the real-runtime checker, Elixir formatting and affected adversarial fixtures.                                                                                                                                                                                                  |
| Skills                                       | Validate frontmatter/metadata, links and invocation policies; keep technical guidance independent of Symphony lifecycle.                                                                                                                                                            |
| Actual runtime/config behavior               | Focused checks at the affected seam plus applicable repository checks; document/render checks do not replace runtime evidence.                                                                                                                                                      |

Browser checks run on built Astro output with isolated external fixtures; no backend, login or product application is required. On shared Symphony hosts use the operator wrapper, shared lock and landing-only cache from [browser isolation](docs/symphony.md#browser-isolation-trên-shared-host), including focused and reviewer checks. Install Chromium once with `pnpm exec playwright install chromium` when needed. Do not submit live public forms for baseline checks.

Formatter excludes docs, runtime assets and local skills; format edited documentation deliberately. A configured CI pipeline does not prove a hosted run. For the assigned dev-with-PR profile, required PR CI is successful `Verify / check` from `.github/workflows/ci.yml`, event `pull_request` for the exact PR/current head, plus actual GitHub-required checks. Old-head or other-event success is insufficient. This standard defines check identity; assignment determines when the gate applies.

## Decisions and evidence

Investigate discoverable facts first. Routine implementation choices stay within accepted scope and standards. Present an unresolved acceptance-significant decision with its affected behavior, viable options, recommendation and dependent work; continue meaningful independent work. Accepted decisions persist; silence is not acceptance. Resolve human identities from explicit configuration/context instead of guessing whom to mention.

Record an accepted decision in the existing owning contract only when authorized. If a required durable update is unavailable, retain it in the session and report the unconfirmed step. Accepted changes within the same deliverable invalidate affected checks/review; a different deliverable requires an owner decision. Head/contract changes or specific base impacts need reassessment; main advancing alone does not invalidate unchanged-head evidence.

Keep detailed verification in the existing PR/artifact/session/evidence location, without mandatory reports, snapshots or fingerprints. Local fixtures prove their observed boundary, not producer publication, hosted behavior, authentication or external effects. Pending QA/owner acceptance does not waive missing behavior or required checks. Direct work stops at its requested boundary; Jira, independent review, PR, CI, merge and delivery gates apply only when assigned.

Use Vietnamese for collaboration and handoff; keep code identifiers and the existing document language.
## Reading Jira dependencies

For Symphony assignments, use the `dependencies` envelope from live `jira_rest GET /rest/api/3/issue/{key}` with `fields=issuelinks`: `blocked_by` lists prerequisites and `blocks` lists downstream issues. Admission requires `complete=true` and `ready=true`; reread missing data rather than treating an empty list as clearance. Retain the envelope when parsing responses, not only `body`. Never use `type.inward || type.outward` or accept either link endpoint as a blocker: Jira supplies both labels. The shared parser and rules are owned by the [Symphony dependency contract](https://github.com/signapse-group/signapse-symphony/blob/main/elixir/README.md#jira-dependency-contract).

# API consumer policy

Apply this reference to assigned landing API integration, design, review and delivery. Plain dashboard/Articles links and fixture demos do not require API lookup or application login. It does not
activate Jira lifecycle actions for ordinary requests. Use the assigned Subtask,
native parent/dependencies or accepted local request to establish contribution scope.
The coordinator owns cross-repository decomposition and acceptance.

## Authority and lookup

[Planning's API policy](https://github.com/signapse-group/signapse-planing/blob/main/workflow/project-execution-workflow.md#contract-api-và-handoff)
owns the shared convention. Jira holds accepted requirements, scope and acceptance;
the producer's published OpenAPI holds the supported HTTP API schema and
consumer-facing business rules. BE publishes [OpenAPI dev](https://dev-api.signapse.cloud/v3/api-docs).
Other services own their contracts; non-HTTP protocols use their producer's canonical
reference. SSE events, payloads and semantics belong at the HTTP operation.

Fetch the current contract for the actual target environment before concluding API
design/integration readiness, on resume and before handoff. Record URL, environment,
fetch time and the producer revision/version evidence available. Use producer build
metadata and deployment evidence to establish revision identity; `info.version`
alone does not prove a Git revision. Unpublished API changes remain proposals.

Read the affected operations' parameters/headers, request/response schemas,
requiredness, nullability/omission, media types, success/error statuses and auth.
Read descriptions for ownership/workspace scope, conditional fields, defaults,
validation, lifecycle, side effects, quota, retry/idempotency/concurrency, empty or
partial results, streaming behavior and applicable limits. Structured rules belong
in schema/responses; descriptions explain semantics. Supported filter scope comes
from accepted requirements and the producer contract, not every entity/generic
resolver field or the UI currently exposed.

Trace impact in landing request/response types, form validation, transport,
origin configuration, UI callers and localized error handling. Consumer types and test fixtures implement or
verify that contract; they do not redefine it. Keep source references and findings
in the requested evidence, without maintaining another schema, mapping ledger or
contract snapshot.

## Dependencies and discrepancies

For new/changed API delivery, inspect the producer handoff and fetch the deployed
contract to verify its delivered revision/environment before dependent integration.
Native dependency Done is necessary for routed admission when linked, but does not
replace publication evidence. Existing APIs need sufficient contract for the affected
scope; unrelated producer documentation work does not block every landing contribution.
Fixture/browser success does not prove producer delivery or live integration.

When accepted requirements, OpenAPI and implementation conflict, record the exact
operation/rule, expected basis, observation and owner. Investigate discoverable facts,
then use the [decision gate](decision-gate.md) for unresolved material decisions.
Pause only dependent work while continuing meaningful independent work. The producer
owns its contract and updates it with implementation; landing does not rewrite producer
rules or expected results to hide a gap. Missing fields/errors/permissions/revision
evidence are unmet inputs, not permission to invent a fallback contract.

For an accepted producer change, follow the assigned dependency and rollout contract:
producer deploy/publish → producer handoff → dependent landing integration. Do not
inherit a dashboard-specific temporary outage policy. Record changed operations,
affected consumers and pending integration; publication alone does not complete
landing or parent acceptance.

## Contract lookup and feature acceptance

Reading the producer's published contract and verifying a new/changed API dependency remain requirements of consumer integration. They are distinct from executing a feature against live services. Verify the consumer implementation locally at the actual HTTP boundary in its runtime; for SSR, browser interception alone does not verify server-side fetching. Require live feature/hosted acceptance only for the operation and phase assigned under the [local handoff policy](execution-policy.md#local-handoff-and-live-acceptance). Missing in-scope producer schemas, permissions or required publication evidence is still an integration gap.

## Verification and evidence

Use existing checks appropriate to the changed behavior. Documentation/description
work does not itself require a new API test suite or QA Subtask. Runtime changes
retain repository verification safeguards; expected behavior comes from accepted
requirements. Keep consumer fixture tests at the external boundary so landing
build/browser checks remain independent of the backend. Schema/semantics, CORS,
authorization when required, and actual integration need their applicable review
and deployed evidence. Never send a live public form request just to run baseline
quality; external effects require the assigned integration scope and data/cleanup.

Use the [delivery handoff format](execution-policy.md#pr-and-delivery-handoff) for
assigned execution, or the requested PR/artifact/session for ordinary work. Identify
landing output separately from producer contract revision/environment and the local/live phase.
Keep the live fetch result/time, revision matching and detailed coverage in linked evidence;
the short handoff exposes discrepancies, missing required publication evidence and pending
integration/delivery with its owner. Preserve earlier identities/evidence in linked history;
a later contract change invalidates affected checks/review without erasing earlier evidence.

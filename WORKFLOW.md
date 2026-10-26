---
tracker:
  kind: jira
  provider:
    base_url: $JIRA_BASE_URL
    email: $JIRA_EMAIL
    api_token: $JIRA_API_TOKEN
    project_key: SIGN
    issue_types: [Subtask]
    routing_labels:
      - route-backend
      - route-frontend
      - route-quality-assurance
      - route-mdg
      - route-landing
  required_labels: [route-landing]
  dispatch_states: [Ready, Progress, In Review]
  active_states: [Ready, Progress, In Review]
  review_state: In Review
  session_boundary_states: [Ready]
  terminal_states: [Done]
runtime_control:
  enabled: true
  path: /opt/apps/symphony/runtime/state/runtime-control.sqlite3
  id: landing
  members: [be, fe, landing]
  quota_check_timeout_ms: 15000
  heartbeat_interval_ms: 1000
  heartbeat_timeout_ms: 10000
workspace:
  root: $SYMPHONY_WORKSPACE_ROOT
hooks:
  after_create: |
    set -eu
    : "${SYMPHONY_WORKSPACE_ROOT:?Set a separate landing workspace root}"
    : "${SYMPHONY_GIT_CREDENTIAL_HELPER:?Set the host Git credential helper}"
    git -c credential.helper="$SYMPHONY_GIT_CREDENTIAL_HELPER" clone --depth 1 --branch dev https://github.com/signapse-group/signapse-landing.git .
    git config --local credential.helper "$SYMPHONY_GIT_CREDENTIAL_HELPER"
    test "$(node -p 'process.versions.node')" = "$(cat .node-version)"
    test "$(pnpm --version)" = "$(node -p 'JSON.parse(require("node:fs").readFileSync("package.json", "utf8")).packageManager.split("@")[1]')"
    pnpm install --frozen-lockfile
  timeout_ms: 900000
agent:
  max_concurrent_agents: 1
  max_turns: 20
codex:
  command: codex --config shell_environment_policy.inherit=all --config 'model="gpt-6-luna"' --config model_reasoning_effort=max app-server
  approval_policy: never
  thread_sandbox: workspace-write
  turn_sandbox_policy:
    type: dangerFullAccess
---
{% assign state = issue.state | strip | downcase %}

You are executing Jira Subtask `{{ issue.identifier }}` in `signapse-group/signapse-landing`.

- Immutable ID: {{ issue.id }}
- Identifier: {{ issue.identifier }}
- Title: {{ issue.title }}
- Snapshot state: {{ issue.state }}
- URL: {{ issue.url }}
- Labels: {{ issue.labels }}
{% if issue.native_ref %}
{% if issue.native_ref.issue_type %}
- Native type: {{ issue.native_ref.issue_type.name }}
{% endif %}
{% if issue.native_ref.parent %}
- Native parent: {{ issue.native_ref.parent.key }}
{% endif %}
{% endif %}
{% if attempt %}
- Follow-up attempt #{{ attempt }}
{% endif %}

Description:
{% if issue.description and issue.description != "" %}
{{ issue.description }}
{% else %}
No description in the snapshot.
{% endif %}

Retain the live Jira `dependencies` envelope and apply the [dependency contract](https://github.com/signapse-group/signapse-symphony/blob/main/elixir/README.md#jira-dependency-contract). Use this workspace instruction/runbook sources; if a required source is missing, report deployment drift and stop the affected phase instead of searching legacy checkouts or backups for substitute policy.

{% if state == "ready" %}
## Phase: Survey

Read and execute [Survey](docs/runbooks/survey.md).
{% elsif state == "progress" %}
## Phase: Implement

Read and execute [Implement](docs/runbooks/implement.md).
{% elsif state == "in review" %}
## Phase: Review

Read and execute [Review and delivery](docs/runbooks/review-and-delivery.md).
{% else %}
## Phase: Stop

Stop autonomous work outside the assigned phases; do not change status to continue.
{% endif %}

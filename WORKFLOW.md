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

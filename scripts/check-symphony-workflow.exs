import ExUnit.Assertions

alias SymphonyElixir.{Config, PromptBuilder, Workflow}
alias SymphonyElixir.Config.Schema
alias SymphonyElixir.Jira.Client
alias SymphonyElixir.Tracker.Issue

# Run from the Symphony Elixir project with mix run --no-start and a workflow path.
assert Process.whereis(SymphonyElixir.Supervisor) == nil
[workflow_path] = System.argv()

System.put_env(%{
  "JIRA_BASE_URL" => "https://jira.invalid",
  "JIRA_EMAIL" => "fixture@example.invalid",
  "JIRA_API_TOKEN" => "offline-fixture",
  "SYMPHONY_WORKSPACE_ROOT" => Path.join(System.tmp_dir!(), "landing-workflow-offline")
})

Application.put_env(:symphony_elixir, :workflow_file_path, Path.expand(workflow_path))
{:ok, workflow} = Workflow.load(workflow_path)
{:ok, settings} = Schema.parse(workflow.config)
assert :ok == Config.validate_settings(settings)
assert settings.tracker.kind == "jira"
assert settings.tracker.provider["project_key"] == "SIGN"
assert settings.tracker.provider["issue_types"] == ["Subtask"]

assert Enum.sort(settings.tracker.provider["routing_labels"]) ==
         Enum.sort(~w(route-backend route-frontend route-quality-assurance route-mdg route-landing))

assert settings.tracker.required_labels == ["route-landing"]
assert settings.tracker.dispatch_states == ["Ready", "Progress", "In Review"]
assert settings.tracker.active_states == ["Ready", "Progress", "In Review"]
assert settings.tracker.review_state == "In Review"
assert settings.tracker.session_boundary_states == ["Ready"]
assert settings.tracker.terminal_states == ["Done"]
assert settings.hooks.timeout_ms == 900_000
assert settings.agent.max_concurrent_agents == 1
assert settings.agent.max_turns == 20

assert settings.codex.command ==
         ~s(codex --config shell_environment_policy.inherit=all --config 'model="gpt-6-luna"' --config model_reasoning_effort=max app-server)

assert settings.codex.approval_policy == "never"
assert settings.codex.thread_sandbox == "workspace-write"
assert settings.codex.turn_sandbox_policy == %{"type" => "dangerFullAccess"}

hook_lines = String.split(settings.hooks.after_create, "\n")

assert ~s(: "${SYMPHONY_GIT_CREDENTIAL_HELPER:?Set the host Git credential helper}") in hook_lines

assert ~s(git -c credential.helper="$SYMPHONY_GIT_CREDENTIAL_HELPER" clone --depth 1 https://github.com/signapse-group/signapse-landing.git .) in hook_lines

assert ~s(git config --local credential.helper "$SYMPHONY_GIT_CREDENTIAL_HELPER") in hook_lines

raw = %{
  "id" => "90001",
  "key" => "SIGN-90001",
  "fields" => %{
    "summary" => "LANDING: Offline workflow fixture",
    "project" => %{"key" => "SIGN"},
    "issuetype" => %{"id" => "10002", "name" => "Subtask", "subtask" => true},
    "parent" => %{"id" => "90000", "key" => "SIGN-90000"},
    "labels" => ["route-landing", "fixture"],
    "status" => %{"name" => "Ready", "statusCategory" => %{"key" => "new"}},
    "issuelinks" => []
  }
}

issue = Client.normalize_issue_for_test(raw, settings.tracker)
assert Issue.routable?(issue, settings.tracker.required_labels)
assert issue.admission_ready

excluded = [
  put_in(raw, ["fields", "issuetype"], %{"id" => "10003", "name" => "Task", "subtask" => false}),
  update_in(raw, ["fields"], &Map.delete(&1, "parent")),
  put_in(raw, ["fields", "labels"], []),
  put_in(raw, ["fields", "labels"], ["route-backend"]),
  put_in(raw, ["fields", "labels"], ["route-landing", "route-backend"])
]

for candidate <- excluded do
  normalized = Client.normalize_issue_for_test(candidate, settings.tracker)
  refute Issue.routable?(normalized, settings.tracker.required_labels)
end

assert Client.normalize_issue_for_test(
         put_in(raw, ["fields", "project", "key"], "OTHER"),
         settings.tracker
       ) == nil

for state <- ["Ready", "Progress", "In Review"],
    {status, category, expected} <-
      [
        {"Done", "done", true},
        {"Closed", "done", true},
        {"Resolved", "indeterminate", false},
        {"In Review", "indeterminate", false},
        {"Unknown", nil, false}
      ] do
  blocker = %{
    "id" => "90002",
    "key" => "SIGN-90002",
    "fields" => %{"status" => %{"name" => status, "statusCategory" => %{"key" => category}}}
  }

  linked =
    raw
    |> put_in(["fields", "status", "name"], state)
    |> put_in(["fields", "issuelinks"], [
      %{"type" => %{"name" => "Blocks"}, "inwardIssue" => blocker}
    ])

  assert Client.normalize_issue_for_test(linked, settings.tracker).admission_ready == expected
end

refute Client.normalize_issue_for_test(
         put_in(raw, ["fields", "issuelinks"], nil),
         settings.tracker
       ).admission_ready

fixtures =
  for state <- ["Ready", "Progress", "In Review", "Open", "Blocked", "Done"],
      attempt <- [nil, 2],
      description <- [nil, "", "Offline accepted contract"],
      native_ref <- [nil, %{issue_type: nil, parent: nil}, issue.native_ref] do
    candidate = %{issue | state: state, description: description, native_ref: native_ref}
    rendered = PromptBuilder.build_prompt(candidate, attempt: attempt)
    assert String.contains?(rendered, issue.identifier)
    assert String.contains?(rendered, issue.id)
    assert String.contains?(rendered, issue.title)
    assert String.contains?(rendered, issue.url)
    assert String.contains?(rendered, "route-landing")
    if native_ref && native_ref.parent, do: assert(String.contains?(rendered, "SIGN-90000"))
    if description && description != "", do: assert(String.contains?(rendered, description))
    if attempt, do: assert(String.contains?(rendered, "Follow-up attempt #2"))

    phase = %{"Ready" => "Survey", "Progress" => "Implement", "In Review" => "Review"}[state] || "Stop"
    assert String.contains?(rendered, "## Phase: #{phase}")

    for other <- ["Survey", "Implement", "Review", "Stop"] -- [phase] do
      refute String.contains?(rendered, "## Phase: #{other}")
    end

    runbook =
      %{
        "Ready" => "docs/runbooks/survey.md",
        "Progress" => "docs/runbooks/implement.md",
        "In Review" => "docs/runbooks/review-and-delivery.md"
      }[state]

    selected = Regex.scan(~r/\]\((docs\/runbooks\/[^)]+)\)/, rendered, capture: :all_but_first)
    assert selected == if(runbook, do: [[runbook]], else: [])

    if runbook do
      path = Path.join(Path.dirname(Path.expand(workflow_path)), runbook)
      assert File.regular?(path)
      refute String.contains?(File.read!(path), "Draft for content acceptance")
    else
      assert String.contains?(rendered, "Stop autonomous work")
    end

    for forbidden <- ["$implement", "$code-review", "$agent-execution-policy", "Grant:", "execution-policy.md", "docs/delivery.md", "gh run watch"] do
      refute String.contains?(rendered, forbidden)
    end

    phase
  end

assert length(fixtures) == 108
assert Process.whereis(SymphonyElixir.Supervisor) == nil
IO.puts("Consumer workflow: config/routing/dependency admission and 108 exclusive runbook/context fixtures passed offline.")

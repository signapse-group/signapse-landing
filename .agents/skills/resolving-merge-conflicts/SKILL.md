---
name: resolving-merge-conflicts
description: "Use when you need to resolve an in-progress git merge/rebase conflict."
---

1. **See the current state** of the merge/rebase. Check git history, and the conflicting files.

2. **Find the primary sources** for each conflict. Understand deeply why each change was made, and what the original intent was. Read the commit messages, check the PRs, check original issues/tickets.

3. **Resolve each in-scope hunk.** Preserve both intents where possible. Where incompatible, use the accepted contract and merge goal, and note the trade-off. Do **not** invent new behavior or overwrite another owner's work. If intent/ownership is materially unclear, pause that portion and report the needed decision; continue independent work. Do not abort or reset a human-owned merge/rebase without its owner's authorization.

4. Run the landing checks for the affected scope: check/lint/format/build for source/config, built-output browser coverage for navigation/layout/demos and model tests for model changes. Fix failures caused by the resolution.

5. **Finish the assigned merge/rebase.** Stage only the resolved files owned by this contribution; preserve unrelated staged/unstaged changes. Commit only within the granted delivery scope. If rebasing, continue the authorized rebase without discarding other work, then refresh affected checks/review evidence.

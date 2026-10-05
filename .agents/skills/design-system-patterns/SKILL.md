---
name: design-system-patterns
description: Build or update Pen design-system foundations and components, audit screens for token/component drift, apply system components, and standardize spacing. Use for design-system work in .pen files; load code references only for an explicit design-to-code task.
metadata:
  upstream-source: wshobson/agents
  upstream-skill-path: plugins/ui-design/skills/design-system-patterns/SKILL.md
  upstream-install-hash: b6ba14bf8809ee027a3c4c9e88bdc71626eb7f68604b65dce000519d8e4ad458
  local-adaptation: Pen workflows maintained in this project
---

# Design System Patterns

Use this skill for shared values, reusable structures, and evidence of consistent use. Use native `pen-dev` for canvas mechanics and [frontend-design](../frontend-design/SKILL.md) for visual direction. Follow repository UI routing for the working directory, artifacts, brand and baseline; keep product choices in scoped instructions.

## Select the requested workflow

| Request | Read | Result |
| --- | --- | --- |
| Build/update tokens, themes, a component or library | [Foundations and components](references/pen-foundations-components.md) | Requested shared assets, bindings and state coverage |
| Review/audit design-system integration | [Audit](references/pen-audit.md) | Findings with node/property evidence; no canvas writes |
| Fix drift, normalize imported UI, apply components | [Apply](references/pen-apply.md) | Scoped repairs preserving content and valid overrides |
| Review/fix padding, gaps or hierarchy | [Spacing](references/pen-spacing.md) | Spacing map; canvas changes only when requested |
| Compose a screen using an established system | Native pen-dev composition guide | Editable screen using existing assets; read local workflows only for actual gaps |

Choose from the requested outcome. Audit does not authorize Apply. A request to fix or standardize authorizes the relevant repairs without repeated approval of the same scope. If a phrase such as "look at the spacing" is ambiguous, inspect and report first. Do not turn one component into a full library or create unrelated states/themes.

## Pen execution contract

1. Identify the target file and affected frames from the request or current Pen state. Read applicable UI instructions. If the target is missing, continue only independent work; creating a design requires that deliverable to be in scope.
2. Load `pen-dev` through Pen `read_skill()` (MCP or `pen interactive`), then `pen-schema.md` and `execute.md`. Read `guide/components.md` for components and `guide/design-system.md` for composition. Reuse loaded guidance within the session. Resolve API uncertainty against the active host; do not substitute an old Figma helper.
3. Prefer headless `pen interactive` for file work when a visible canvas is unnecessary. Check current help for file arguments and saving. Use desktop for requested live canvas work. Report actual connection/authentication failures rather than assuming desktop is always required.
4. Inspect relevant structure, variables/components and a focused screenshot before modifying an existing design. Read raw references for binding evidence and expanded/resolved views for inherited appearance. Avoid whole-document dumps.
5. Keep changes within the selected inventory. Reuse existing objects, capture returned IDs and reread stale state. Follow native error recovery and placeholder rules. Preserve recoverable copies before overwriting or deleting design files/assets, including untracked files.
6. Validate affected structure and visuals, save through the host, and reopen through Pen to verify persistence. A screenshot/export or successful canvas mutation alone does not prove the `.pen` file was saved. Report the saved file, affected frames and unverified checks.

Read and modify `.pen` content only through supported Pen tools/CLI. Filesystem tools may manage paths, backups and file metadata, but must not parse or rewrite serialized design IDs/references. Keep current API syntax in native documentation rather than copying its manual into this skill.

## Shared decisions

- Preserve the selected source of truth and existing names. Use primitives and semantic aliases; add component tokens only for a distinct role.
- Verify aliases, types and values in every requested theme. Resolve inherited theme choices when comparing appearance.
- Use linked instances for repeated structures. Label, icon and intentional state overrides can be valid; visual similarity alone does not establish reuse.
- Prefer same-document components initially. Cross-file `.lib.pen` work requires the actual imported library and verified host support; an ordinary copy is not a cross-file link.
- Stop when the scoped deliverable passes. Incomplete evidence remains unverified.

## Code references — explicit design-to-code work only

Load only the relevant topic: [tokens](references/design-tokens.md), [application theming](references/theming-architecture.md), [code component architecture](references/component-architecture.md), or [worked code examples](references/details.md). These describe application code, not Pen canvas behavior. They do not authorize application repository edits or automatic two-way sync.

This skill is locally maintained. Metadata preserves upstream installation provenance; the former installer lock entry is removed so an upstream refresh is not treated as maintenance of this adaptation.

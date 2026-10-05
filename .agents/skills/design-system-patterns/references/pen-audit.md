# Pen design-system audit

Audit is read-only. Use native reads and screenshots; do not mutate nodes/variables, set placeholders, import libraries, generate assets or save changes as part of an audit. Preserve unrelated unsaved work in an existing session. A later fix request routes to [Apply](pen-apply.md).

## Evidence

Identify the file, frame and reviewed themes. Inspect a bounded subtree with `Get`, variables with `GetVariables()`, relevant origins and a focused `TakeScreenshot`.

Keep two views distinct:

- Raw data with variables/instances unresolved establishes `$variable` bindings, `ref` identities and explicit overrides.
- Expanded instances and resolved values establish inherited appearance in context. Use `resolveInstances` and `resolveVariables` deliberately; resolved values alone cannot distinguish a literal from a binding.

Inherited subtrees belong to component origins. Use native instance paths with origin descendant identities or an expanded read. Do not assume instances have ordinary editable children. Use visitor bounds/problems for layout evidence and screenshots for visual judgment. Structural clipping checks may miss text overflow inside a fixed text box.

## Findings

- Repeated structures are rebuilt locally despite a compatible origin in the inspected system.
- Literal values replace semantic bindings used by equivalent peers.
- An unintended visual override prevents expected shared propagation.
- Aliases are missing/cyclic, types conflict, or reviewed themes are incomplete.
- Spacing drifts from the established scale and affects grouping/consistency.
- Layout collapse, unintended clipping or insufficient contrast has measured or visual evidence.

Do not flag intentional label/icon/state overrides, fixed icon geometry, valid screen-specific composition or pure stylistic preference as system drift. A matching hex does not establish a semantic role. An ad-hoc frame is a review candidate, not automatically a defect.

## Report

Prefer concise Markdown unless another format is requested. Each actionable finding includes priority (high/medium/low), actual file and node ID/instance path, property and observed value/link, expected role/component with supporting evidence, impact, suggested repair and confidence.

Separate structural facts from visual observations. State reviewed frames/themes and missing evidence. Say "no issues found in the reviewed scope" rather than certifying uninspected content. Do not invent filesystem pseudo-paths or code-patch verdicts for canvas findings.

Confirm the audit made no mutations. Discovering a defect does not authorize repairing it.

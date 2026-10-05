---
name: prototype
description: Build a throwaway Pen prototype to explore a UI direction or conceptual state model. Use when the user wants to compare designs or reason through logic before implementation.
---

# Prototype

Read the [repository instructions](../../../AGENTS.md), [documentation index](../../../docs/README.md), and [local design skill guidance](../README.md) for scope, Pen operations, and the landing baseline. A prototype answers a question; it is not production implementation, runtime evidence, or permission to publish an issue.

Use the requested landing Pen document under `docs/design/pen/`; when a new document is requested and no filename is specified, use `docs/design/pen/landing.pen`. Inspect the actual document before choosing the target frame. Keep research questions and review notes in chat, not on the canvas.

## Pick a branch

Identify the question being answered:

- **Does this UI direction work?** → [UI.md](UI.md). Create a small set of materially different Pen frames.
- **Does this state model or business flow make sense?** → [LOGIC.md](LOGIC.md). Draw a Pen walkthrough of states, actions, transitions, and edge cases.

If the branch is unclear, use the prompt and surrounding feature to infer it, or ask when the distinction changes the output. Do not build both branches by default.

## Rules for both branches

1. Read the issue, acceptance criteria, related documents and decisions before editing. Identify the user, screen purpose, data, primary actions and scope.
2. Inspect the existing layout, variables, components and screenshot. Reuse the project baseline and keep product frames outside the requested scope unchanged.
3. If BE has implemented the related API, inspect the current OpenAPI first, then BE code and tests where needed. Resolve facts before asking the user; ask only about remaining evidence gaps or consequential conflicts.
4. Create one design frame per feature by default. Create multiple variants or state screens only when the user explicitly asks for them. Do not define feature-specific error or permission screens when those are common concerns not yet requested.
5. Keep requirement questions, open decisions and review notes in chat or requested documentation, never in the canvas. Use only product-facing helper text and warnings in the UI.
6. Use representative content and the smallest design that makes the feature clear to implement. Pen represents a proposal; it does not prove runtime behavior.
7. Inspect screenshots and structure for clipping, overflow, alignment, legibility, token and component drift. Follow the save and persistence rules in the UI design instructions; a successful MCP edit alone does not mean the file was saved.
8. After the user approves a completed design, preserve a recoverable copy before removing rejected frames. Export only the approved design needed by an FE Task.

Issue publication remains explicit and follows the owning repository's tracker workflow. This design skill set does not include ticket-publication tooling. When publication is requested and authorized, include only the approved design exports in the relevant implementation issue. Do not attach exploratory variants or publish an issue merely because a prototype exists.

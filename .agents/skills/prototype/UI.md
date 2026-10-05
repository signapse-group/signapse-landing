# UI Prototype in Pen

Use this branch when the user wants a visual prototype for a screen or UI feature. If the user explicitly asks to compare visual directions, use multiple variants; otherwise create one design. If the question concerns business logic or state transitions, use [LOGIC.md](LOGIC.md).

## Set up the design

1. Identify the feature and the existing screen or host context.
2. Confirm the requested landing Pen document under `docs/design/pen/` is active. Inspect the relevant existing screen, variables, reusable components, and screenshot. Read [LANDING.md](../../../docs/design/LANDING.md) together with the current [migration decisions](../../../docs/README.md).
3. Put one clearly named prototype frame beside the related screen in the same document. Do not create a route, URL switcher or separate application prototype.

## Create the design

- Use the screen purpose, representative content and primary actions as established by the requirement and verified contract.
- Reuse the project’s existing visual system, variables, components and layout structure.
- Make the relevant screen content visible and clear enough to implement. Preserve existing product screens.
- Do not invent interaction behavior, business rules, data contracts, feature-specific common states or extra screens.

Inspect screenshots after drafting and correct clipping, alignment, contrast, and unreadable content before asking the user to review it.

## Refine, approve, and hand off

The user reviews the single completed design. Refine it in Pen, show the result, and wait for approval.

After approval:

1. Preserve a recoverable copy of the prototype work before removing any superseded frame.
2. Keep one approved frame and name it for the actual feature or screen.
3. Save through the supported Pen host. Follow the save and persistence checks in [local design skill guidance](../README.md); do not claim persistence from an MCP canvas edit alone.
4. Export only the approved design and viewport required by implementation.

If the user requests implementation-issue publication or update, follow the owning repository's tracker workflow and include only approved PNGs, with captions identifying the screen, state, and viewport. Keep interaction and behavior requirements in the issue contract. This design skill set does not include ticket-publication tooling. A static image does not establish behavior, responsive rules, permissions, or accessibility semantics that are not visible in it.

## Anti-patterns

- Creating multiple feature designs without an explicit comparison request.
- Defining feature-specific error or permission screens before the common pattern is requested.
- Leaving superseded prototype frames among the approved product screens after cleanup.
- Attaching exploratory variants or a full-canvas export to an implementation issue.
- Treating a screenshot as a substitute for acceptance criteria or runtime verification.

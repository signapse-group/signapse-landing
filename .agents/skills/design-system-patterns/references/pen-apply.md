# Apply a Pen design system

Use for requested repairs or normalization. Start from audit findings or perform focused discovery using [Audit](pen-audit.md). Existing authorization for those repairs remains sufficient.

1. Reread affected frames and system assets; findings can be stale. Identify local changes and changes affecting shared origins/dependents.
2. Map each issue to: retain a valid link, bind a semantic variable, use a compatible component, compose from existing components, or create a necessary missing primitive. Leave uncertain mappings unresolved.
3. Preserve text, icons, intended state, layout role, slot content and valid overrides. Compare semantics rather than names/screenshots alone. Identical action and success colors need not share one semantic token.
4. Preserve recoverable design/assets before overwriting the saved file. Prefer updating existing objects. To replace a frame with a `ref`, use native replacement, preserve required properties/content, capture the new ID and verify the subtree. Ordinary `Update` cannot change type/ref.
5. Add only foundations/components needed for this repair, following [Foundations and components](pen-foundations-components.md). Surface shared changes beyond authorized scope before applying them.
6. Reread changed nodes and intended dependents. Repeat relevant audit checks, inspect the completed section, save and reopen through Pen.

For imported web designs, preserve content and layout intent while replacing proven repeated primitives. Editable import does not establish token binding or reuse. A screenshot is visual evidence, not an editable screen; do not flatten the deliverable.

## Repeatability and recovery

Discover current identities before creating. Leave nodes alone once references/bindings and content are correct. Never clear a page or regenerate a screen to fix a narrow issue. On execute failure, follow the active host's error response and retry contract rather than assuming another host's partial-execution behavior.

Finish with repaired findings, preserved exceptions, affected frames, saved file and unverified checks. Complete normalization requires coverage of the agreed inventory, not merely a successful screenshot.

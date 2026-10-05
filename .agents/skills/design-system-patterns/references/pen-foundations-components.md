# Pen foundations and components

Use for the requested token set, component family or library. Load native schema/execute guidance and, for components, its component guide. Inspect existing assets before selecting an inventory.

## Foundations

1. Read `GetVariables()` and representative nodes. Record names, types, aliases, themes and actual use. An empty local set is not evidence about an uninspected imported library.
2. Define only roles needed for the scope: e.g. surface/text/border/action colors, spacing, radii and typography. Preserve conventions. On a new system, derive consequential visual choices from the brief; do not invent a full palette during a narrow repair.
3. Map primitive -> semantic -> optional component tokens with same-type references. Pen references use `$name`; declarations use `name`. CSS `var(...)` is not a Pen binding. Figma collections, scopes and code-syntax metadata are not assumed Pen features.
4. Use the merge behavior of `SetVariables` for scoped deltas, preserving unrelated definitions. Do not replace all variables merely to add a token. Each updated definition must retain its intended existing theme entries.
5. Define values in every requested theme. Set theme choices at intended frames and inspect inheritance. Check missing alias targets, cycles, type conflicts and incomplete theme coverage before binding dependents.
6. Bind supported properties to variables. Typography uses properties from the active schema, not an invented text-style ID. Pen `lineHeight` is a ratio, not a copied pixel value.

Native documents can differ across versions. The schema may expose a type not listed in an execute guide. Verify required support on the active host; report a required unsupported feature rather than silently changing its type.

## Components

1. Match roles to existing reusable objects. Inspect the origin, descendants, slots and representative instances. Reuse or update in place when compatible.
2. Inspect known dependents before changing an origin. A screen-local request does not authorize changes to unrelated screens. Use a scoped instance override where appropriate; surface a genuinely broader shared change before applying it.
3. Build reusable nodes and insert `ref` instances using returned IDs. Names are discovery hints, not authorization to remove similarly named user objects. Disambiguate multiple matches.
4. Use content/icon overrides for intended instance differences. Use named reusable variants when structure or coherent state styling differs; build requested combinations only. Do not assume Figma ComponentSet/variant APIs exist. Drawing a hover/focus state does not establish interactive behavior.
5. Use slots for replaceable content. `Update` cannot change type/ref; follow native `Replace` for structural replacement and capture the new ID. Follow native copy rules because copied descendants receive new identities.

## Completion evidence

- Requested variables resolve to intended values/aliases in each requested theme.
- Repeated UI uses intended origins and raw variable references exist where expected.
- Representative instances inherit shared changes while preserving intentional content overrides. Use a disposable fixture for propagation experiments, not unrelated production edits.
- Requested sizes and long labels do not collapse, overlap or clip unintentionally; inspect focused screenshots.
- Repeating the operation reuses inventory instead of creating duplicates.
- Save and reopen through Pen, then reread variables and instances. Report unverified themes/states.

Create a specimen sheet when requested or necessary to make the component deliverable reviewable. Organize origins and screens according to native Pen guidance and existing file conventions.

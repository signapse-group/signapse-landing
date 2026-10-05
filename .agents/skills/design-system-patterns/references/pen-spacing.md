# Pen spacing and hierarchy

Use for spacing review or requested adjustment. Review follows [Audit](pen-audit.md); adjustment follows [Apply](pen-apply.md).

Map the actual hierarchy: screen -> section -> container -> row -> label/icon. Identify meaningful groups rather than counting arbitrary wrapper depth.

Read existing numeric variables and representative gaps/padding. Reuse the established scale. If none exists and creation is in scope, propose a small 4/8px-based scale appropriate to the density, such as 4, 8, 12, 16, 24, 32, 48. These are starting values, not a mandatory new set of tokens.

Use closer spacing within groups and larger spacing between them. For example, 8 within controls, 12 between fields, 24 between sections and 32 at the screen edge can express hierarchy. Choose existing tokens and inspect the composition; do not multiply a fixed ratio through every nested frame.

Apply padding and sibling gap on Pen frames with `$variable` references. Check layout and sizing first. A `fit_content` parent with only `fill_container` children on the same axis can create a sizing cycle. Pen does not implement CSS margin, percentage sizing or wrapping grids; consult the active schema.

Respect control geometry and component internals. Changing a screen's section gap does not imply changing every button's padding. Change shared origin spacing only when dependent scope is authorized.

Validate requested sizes and a long content sample. Check bounds, alignment, wrapping and grouping; inspect text visually too. Do not assume automatic ellipsis. When the active schema lacks truncation control, preserve full source copy in an appropriate reference and use explicitly shortened display copy only when the task permits it. Do not silently rewrite substantive user content.

Report spacing roles/tokens and deliberate exceptions. For writes, save and reopen through Pen before reporting persistence.

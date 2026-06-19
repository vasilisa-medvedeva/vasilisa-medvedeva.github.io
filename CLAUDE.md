# Plannix

## Color Tokens

All colors are defined as CSS custom properties in `styles/color-tokens.css`.

**When creating new components, you must only reference these tokens — never define new color values.** No hardcoded hex, rgb, hsl, or named colors should appear in component styles.

## Text Tokens

All typography styles are defined as CSS custom properties in `styles/text-tokens.css`.

**When creating new components, you must only reference these tokens — never define new font sizes, weights, line heights, or letter spacings.** No hardcoded typography values should appear in component styles.

**Text tokens must exactly match the Figma design.** Before implementing any text style, verify the token name against the Figma inspection panel (e.g. "Label/Medium · 12/14" maps to `--text-label-medium-*`). Do not guess or approximate — wrong tokens must be corrected before the component is documented.

## Component Authoring Workflow

When the user adds any atom, molecule, or component to the library, follow this process — do not skip steps:

1. **Create the component file** (`atoms/`, `molecules/`, or `components/` directory as appropriate).
2. **Generate a documentation draft** and show it to the user before saving. Use the template below exactly.
3. **Wait for the user to review and edit** the draft. Do not save the documentation file until they approve it.
4. **Save the approved documentation** as a `.md` file alongside the component (e.g. `atoms/button.md`).
5. **Register the component** in the viewer index (`home.html` nav) if not already listed.

## Documentation template

Every component doc must follow this structure in this order:

```markdown
# ComponentName

> One sentence: what it is and why it exists.

## When to use / when not to use
- ✅ Use when ...
- ❌ Don't use when ...

## Anatomy
Label each named part of the component (e.g. container, label, icon, indicator).
Include a plain-text diagram or description of which parts make up the component.

## Variants
| Variant | Description |
|---|---|

## States
| State | Description |
|---|---|

## Tokens
| Token | Role in this component |
|---|---|

## Do / Don't
✅ **Do** — ...
❌ **Don't** — ...

## Accessibility
- Minimum touch target: 44×44pt
- ARIA role and attributes
- Contrast requirements

## Status
`draft` or `stable` or `deprecated` — proposed by Claude, confirmed by the user.
Version X.X | Owner: @...
```

## State and status rules

- **Missing states**: if a component logically needs a state (e.g. loading, error, empty) but the design doesn't define it yet, flag it explicitly: "⚠️ State missing: [name]. Suggested alternative: [description]. Confirm or describe what you want."
- **Status**: always propose a status (`draft` by default for new components). The user confirms or changes it.
- Never mark a component `stable` without explicit user confirmation.

The user will indicate when all components have been added and it is time to move to the next roadmap phase. Do not advance phases autonomously.

## Design QA Checklist

**Before marking any component or task as done, run through the Design QA Checklist in `README.md`.** Verify:

1. All text styles use existing tokens (match the Figma inspection panel exactly)
2. All colors are taken from Design System tokens — no hardcoded values
3. All padding, margin, and gap values match Figma
4. No local styles or arbitrary values introduced without justification
5. Visual implementation matches the Figma design

Do not consider a task complete until every item passes.

# MenuCompactItem

> A single 44px-tall tappable item for a compact menu bar — either a text label or a single icon.

## When to use / when not to use
- ✅ Use as one entry in a horizontal compact menu / action bar
- ✅ Use the icon type for a trailing affordance (e.g. "more", navigate)
- ❌ Don't use for full-width list rows — use a Cell molecule instead
- ❌ Don't mix label + icon in one item; this atom is one or the other

## Anatomy
- **container** — flex, centered, 44px tall (meets touch target)
- **label** (text type) — "Title" in Label/Large; padding 13px top/bottom · 8px left/right
- **icon** (icon type) — 16px glyph (`icons/small/arrow-right.svg`); padding 14px top/bottom · 0 sides

## Composition (Reuse → Compose → Create)
- **Icon** — reused `icons/small/arrow-right.svg` (the Figma `ic16_arrow.right`)
- **Label/Large** — reused `--text-label-large-*` text token
- **Only new** — the item container + padding

## Variants
| Variant | Description |
|---|---|
| text | Text label, horizontal padding 8px |
| icon | Single 16px icon, no horizontal padding |

## States
| State | Description |
|---|---|
| default | Static as shown |
| ⚠️ pressed/hover | Not defined in Figma. Suggested: `--color-primary-transparent-08` background tint. Confirm or describe. |
| ⚠️ disabled | Not defined in Figma. Suggested: label/icon dimmed, no pointer. Confirm or describe. |

## Tokens
| Token | Role in this component |
|---|---|
| `--text-label-large-*` | Label typography (14/18 · 0.1) |
| `--color-primary-transparent-87` | Label text · icon fill |

## Do / Don't
✅ **Do** — keep height at 44px so the touch target is preserved
✅ **Do** — reuse library icons for the icon type, never inline a new glyph
❌ **Don't** — hardcode `#212121`; use `--color-primary-transparent-87`
❌ **Don't** — add horizontal padding to the icon type (it is icon-only by design)

## Accessibility
- Minimum touch target: 44×44pt — height ✓; ensure icon type has ≥44px tappable width in context
- If interactive, wrap in a `<button>`; give the icon item an `aria-label` describing the action
- The icon `<img>` is decorative here (`aria-hidden`); the action label belongs on the control
- Contrast: `--color-primary-transparent-87` on surface — verify 4.5:1

## Status
`draft`
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

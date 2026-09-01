# ButtonDoodle — Restart

> A hand-drawn "Restart" button in the doodle style, matching the messenger's sketched-icon aesthetic; used to replay a flow.

## When to use / when not to use
- ✅ Use when a control needs the playful hand-drawn look (flow replay, illustrative surfaces).
- ✅ Use for the "Restart / play again" action on flow spec pages.
- ❌ Don't use in dense system UI — reach for the standard Button atom there.
- ❌ Don't use for primary conversion actions (checkout, submit).

## Anatomy
- **container** — `<button>`, touch target ≥ 44px, padding, rounded hover surface.
- **art** — inline SVG line-art (hand-drawn "Restart" label + sketched border), `stroke: currentColor`.

There is no separate text label — the wording is baked into the SVG artwork, so the accessible name comes from `aria-label`.

## Variants
| Variant | Description |
|---|---|
| Restart | The only shipped label; the art spells "Restart". Other labels require their own hand-drawn SVG. |

## States
| State | Description |
|---|---|
| Default | Stroke `--color-primary`, transparent background |
| Hover | Stroke `--color-brand-red-primary`, background tint `--color-brand-red-transparent-8` |
| Pressed | `opacity: .6` + `scale(.96)` (stays on the hover colour) |
| Focus (keyboard) | 2px outline `--color-primary-transparent-87`, offset |
| Disabled | Stroke `--color-primary-transparent-48`, no background, no interaction |
| Released | Brief wobble micro-animation on click |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-primary` | Default stroke (via `currentColor`) |
| `--color-brand-red-primary` | Hover stroke |
| `--color-brand-red-transparent-8` | Hover background tint |
| `--color-primary-transparent-87` | Focus outline |
| `--color-primary-transparent-48` | Disabled stroke |

## Do / Don't
✅ **Do** — keep `stroke: currentColor` and theme via the button's `color`.
❌ **Don't** — hardcode the stroke to black or introduce a new hex value.

## Accessibility
- Minimum touch target: 44×44pt ✓ (`min-height: 44px`)
- Native `<button>` with `aria-label="Restart"` (the label is artwork, not selectable text).
- Contrast: default stroke and hover red both meet WCAG AA on white.

## Status
`draft`  
Version 0.1 | Owner: @vasilisa

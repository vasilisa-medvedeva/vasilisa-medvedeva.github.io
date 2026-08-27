# SegmentedControl

> Boxed switch of two or three equal segments for flipping one view between modes.

## When to use / when not to use
- ✅ Switching one content area between 2–3 mutually exclusive views (e.g. filters, modes)
- ❌ Don't use for top-level navigation — that's Tabs
- ❌ Don't exceed three segments; labels stop fitting on mobile

## Anatomy
- **box** — border 1.5px, radius 6, pad 3px
- **switch** — flex 1, pad 6×10, radius 4 — one per option
- **label** — title-small

## Variants
| Variant | Description |
|---|---|
| tabs | 2 or 3 equal switches |
| active | left / middle / right — single selection |

## States
| State | Description |
|---|---|
| active | bg brand-yellow-primary · border 1.5px · text primary-87 |
| inactive | transparent · text primary-60 |
| ⚠️ State missing: pressed | Not defined in Figma. Suggested: inactive segment dims to primary-transparent-04 while held. Confirm or describe. |
| ⚠️ State missing: disabled | Not defined in Figma. Suggested: whole control at 38% opacity, no interaction. Confirm or describe. |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-brand-yellow-primary` | Active segment bg |
| `--color-primary-transparent-87` | Active text · borders |
| `--color-primary-transparent-60` | Inactive text |
| `--text-title-small-*` | Segment label |

## Do / Don't
✅ **Do** — keep segment labels one word; equal widths depend on it
❌ **Don't** — use it when the selection triggers navigation or a destructive change; switching must feel free

## Accessibility
- Minimum touch target: 44×44pt per segment
- `role="radiogroup"`; each segment `role="radio"` + `aria-checked`
- Arrow keys move the selection between segments

## Status
`draft`
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

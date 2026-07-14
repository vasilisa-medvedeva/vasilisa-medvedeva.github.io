# Chip

> Removable tag for labelling or filtering — a short text label with a cancel button.

## When to use / when not to use
- ✅ Use when the user can remove the tag (e.g. active filters, selected tags)
- ❌ Don't use when the tag is read-only — use a plain label instead

## Anatomy
Container (border, rounded pill) wraps two children:
- **label** — short text string
- **cancel** — icon button (16×16) that removes the chip

## Variants
| Variant | Description |
|---|---|
| default | `small` size — padding 10/8/10/12, radius 20px |
| `--xs` | `xSmall` size — padding 4/4/4/8, radius 12px |

## States
| State | Description |
|---|---|
| default | Border + text at 87% opacity |
| ⚠️ State missing: hover | Not defined in Figma. Suggested: lighten border/bg on pointer-over. Confirm or describe. |
| ⚠️ State missing: disabled | Not defined in Figma. Suggested: reduce opacity to 38%. Confirm or describe. |

## Tokens
| Token | Role in this component |
|---|---|
| `--text-label-medium-font-family` | Label font |
| `--text-label-medium-font-weight` | Label weight |
| `--text-label-medium-font-size` | Label size (12px) |
| `--text-label-medium-line-height` | Label line-height (14px) |
| `--text-label-medium-letter-spacing` | Label tracking (0.5) |
| `--color-primary-transparent-87` | Border color · label text color |

## Motion (chips in a set)
Opt-in by wrapping chips in `.tag-chip-group` (M3 emphasized easing):
- **Enter** — fade + scale `0.85→1` + slight slide-in; `0.3s` emphasized-decelerate `cubic-bezier(0.05, 0.7, 0.1, 1)`.
- **Leave** — add `.is-leaving`: the chip collapses its whole footprint (`max-width` + `margin` + `padding` + `border` → 0) while fading, so the following chips **slide over to fill the gap** (M3 chip-removal reflow); `~0.28s` emphasized-accelerate `cubic-bezier(0.3, 0, 0.8, 0.15)`.
- **JS** — before adding `.is-leaving`, pin the chip's current width (`el.style.maxWidth = el.offsetWidth + 'px'`, force reflow) so the collapse animates from its real size; remove from the DOM after ~300ms.
- Spacing uses `margin-right` (not `gap`) inside the group so the footprint can animate to 0. Respects `prefers-reduced-motion`.

## Do / Don't
✅ **Do** — keep label text short (1–2 words)  
❌ **Don't** — use for permanent, non-removable labels

## Accessibility
- Minimum touch target: 44×44pt (cancel button should expand tap area if needed)
- Cancel button: `aria-label="Remove [label text]"`
- ARIA role: `button` on cancel
- Contrast: label text vs background must meet 4.5:1

## Status
`draft`  
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

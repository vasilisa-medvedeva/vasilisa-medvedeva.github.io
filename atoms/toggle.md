# Toggle

> Selection atom with three variants — Switch, Checkbox, Radio. Controls a boolean or single-choice value.

## When to use / when not to use
- ✅ Switch — for on/off settings that apply immediately without a submit action
- ✅ Checkbox — for multi-select lists (photos, media, settings)
- ✅ Radio — for selecting one option from a mutually exclusive group
- ❌ Don't use Checkbox instead of Radio when choices are mutually exclusive

## Anatomy
- **Switch**: `switch__track` (40×24px pill) + `switch__thumb` (sliding circle)
- **Checkbox / Radio**: `<button>` 28×28px with an SVG inside; layers: `t-ring` (outline), `t-fill` (yellow background), `t-border` (outer border), `t-mark` (checkmark or dot)

## Variants
| Variant | Description |
|---|---|
| Switch | 40×24px pill — toggles on/off |
| Checkbox | 28×28px circle — multi-select |
| Radio | 28×28px circle — single select |

## States
| State | Description |
|---|---|
| off / unchecked | `t-ring` visible; all other layers hidden |
| on / checked | `t-fill` + `t-border` + `t-mark` visible; `t-ring` hidden |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-primary-transparent-32` | Ring stroke (unchecked) |
| `--color-brand-yellow-secondary` | Fill background (checked) |
| `--color-primary-transparent-87` | Border and mark/thumb color |
| `--color-constant-primary` | Thumb color in Switch |

## Do / Don't
✅ **Do** — manage state via `aria-checked` and JavaScript; not through CSS classes alone  
❌ **Don't** — use Switch inside forms with a Submit button; it applies changes immediately

## Accessibility
- Minimum touch target: 44×44pt
- Switch: `role="switch"`, `aria-checked="true|false"`
- Checkbox: `role="checkbox"`, `aria-checked="true|false"`
- Radio: `role="radio"`, `aria-checked="true|false"`, grouped inside `role="radiogroup"`

## Status
`draft`  
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

# TabProfile

> Compact pill button with an icon and label for quick contextual actions on the profile screen.

## When to use / when not to use
- ✅ Use when offering a single specific action with an icon (Invite, Share, Mute)
- ✅ Use when several such actions are placed in a row (quick-action group)
- ❌ Don't use when there is no icon — use Button instead
- ❌ Don't use when the action is destructive — use Accent Button instead

## Anatomy
Container (pill) → [Icon 24×24] + [Label]

- **Container** — pill, border-radius 16px, border 0.5px, padding 6px / 12px
- **Icon** — 24×24px, from icons/ library
- **Label** — Body/Medium · 14/18 · letter-spacing 0.25px

## Variants
| Variant | Description |
|---|---|
| default | Yellow-4 bg · border primary-24 |

## States
| State | Description |
|---|---|
| Regular | bg `--color-brand-yellow-4` |
| Pressed | bg `--color-brand-yellow-16` |

## Tokens
| Token | Role |
|---|---|
| `--color-brand-yellow-4` | Container bg (regular) |
| `--color-brand-yellow-16` | Container bg (pressed) |
| `--color-primary-transparent-24` | Border |
| `--color-primary-transparent-87` | Text color |
| `--text-body-medium-*` | Label |

## Do / Don't
✅ **Do** — use icons from the icons/ library with `viewBox="0 0 24 24"`  
❌ **Don't** — set icon color directly in CSS; icons already contain the correct fill

## Accessibility
- Minimum touch target: 44×44pt
- Use `<button type="button">`
- `aria-label` describing the action is required

## Status
`draft` — Version 1.0 | Owner: @vasilisamedvedeva

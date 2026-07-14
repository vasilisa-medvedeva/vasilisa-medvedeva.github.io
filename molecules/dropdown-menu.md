# DropdownMenu

> Floating context menu — a rounded surface stacking `CellMenu` rows, used for message and item actions.

## When to use / when not to use
- ✅ Use for contextual actions on a message, chat, or list item (long-press / right-click menu)
- ✅ Use when actions vary by role (sender vs recipient) or available space
- ❌ Don't use for primary navigation — use Tabs / TabBar
- ❌ Don't use for a single action — use a Button

## Anatomy
- **container** — white surface, radius 16, `elevation-4` shadow, vertical stack
- **row** — `CellMenu` atom (icon 24px + title, 48px tall); optional read-by avatar pips on the right ("2 Read")
- **divider** — 1px line separating action groups (e.g. before destructive actions)
- **destructive row** — title and icon in warning color (Delete)

## Variants
| Axis | Value | Description |
|---|---|---|
| type | Sender | Actions on your own message (adds Edit, Delete) |
| type | Recipient | Actions on someone else's message (adds Report) |
| screen | big | Full action list |
| screen | small1 | Condensed list, collapses extras into "More" |
| screen | small2 | Minimal list, led by a "Back" row |

## States
| State | Description |
|---|---|
| default | Transparent row background |
| hover | `--color-brand-yellow-4` |
| pressed | `--color-brand-yellow-8` |
| ⚠️ disabled | Not defined in Figma. Suggested: title/icon at 38% opacity, no hover. Confirm or describe. |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-constant-primary` | Container surface |
| `--elevation-4` | Container shadow (matches Figma "elevation 4") |
| `--color-primary-transparent-08` | Divider |
| `--color-warning-primary` | Destructive title + icon (Delete) |
| `--color-primary-transparent-87` | Row title + icons |
| `--text-body-large-*` | Row title typography |
| `--color-brand-yellow-4 / -8` | Hover / pressed row background |

## Do / Don't
✅ **Do** — group destructive actions below a divider
✅ **Do** — keep one action per row, single line
❌ **Don't** — mix unrelated actions without a divider
❌ **Don't** — recolor rows except the destructive title + icon

## Accessibility
- Minimum touch target: each row is 48px tall (≥44pt) ✓
- Container role: `menu`; each row role: `menuitem`
- Decorative icons: `aria-hidden="true"`
- Destructive action: convey meaning beyond color (label "Delete")
- Contrast: title vs surface meets 4.5:1

## Status
`draft`
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

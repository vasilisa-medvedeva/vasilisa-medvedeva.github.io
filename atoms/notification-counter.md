# Notification Counter

> Компактный жёлтый бейдж с числом — показывает количество непрочитанных сообщений или событий.

## When to use / when not to use
- ✅ Use when a count of unread items must be visible at a glance (tabs, list items)
- ✅ Use inside Swipe Tab Item to indicate new messages in a channel
- ❌ Don't use for decorative purposes or non-numeric content
- ❌ Don't use when the count is 0 — hide the counter entirely

## Anatomy
Container (pill) → Number label

- **Container** — `border-radius: 12px`, `padding: 4px 6px`; border 1.5px
- **Number** — the count as a plain integer string; truncate at 99+ if needed

## Variants
| Variant | Description |
|---|---|
| Default | Yellow pill — счётчик непрочитанных в верхних свайп-табах (SwipeTabItem) |
| Cell (`--cell`) | Red pill, white text, `px: 7px` — счётчик непрочитанных в строке списка чатов |

## States
| State | Description |
|---|---|
| Default | Visible when count > 0 |
| Hidden | `display: none` when count = 0 |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-brand-yellow-secondary` | Container background (Default) |
| `--color-brand-red-secondary` | Container background (Cell) |
| `--color-primary-transparent-87` | Border + number text color (Default) |
| `--color-constant-primary` | Number text color (Cell) |
| `--text-label-medium-bold-*` | Number typography (12px / 700 / 14px / 0.5px) |

## Do / Don't
✅ **Do** — hide the counter when count reaches 0  
❌ **Don't** — show values above 99 as-is; cap at "99+"

## Accessibility
- Minimum touch target: N/A — counter is non-interactive
- Use `role="status"` on the container
- `aria-label="N new messages"` — screen readers skip the visual number

## Status
`draft`
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

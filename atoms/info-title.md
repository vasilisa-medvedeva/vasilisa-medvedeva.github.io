# InfoTitle

> Строка контекста над телом сообщения — показывает тип источника (пересылка, закреп, редактирование, ответ) с иконкой и подписью.

## When to use / when not to use
- ✅ Use inside a chat message bubble to show forward/reply/pin/edit context
- ✅ Use as the top row of a message card, above the message body
- ❌ Don't use as a standalone label outside of a message context
- ❌ Don't add more than one InfoTitle per message

## Anatomy
Container → [Icon] [Label?] [Name] [Verb?]

- **Container** — `div.info-title`, flex row, `gap: 4px`, `align-items: center`, `width: 318px`
- **Icon** — `img.info-title__icon`, 16×16, from `icons/small/` — variant-specific
- **Label** — `span.info-title__label`, Body/Small, `info-secondary` color — "Forwarded from" (forward only)
- **Name** — `span.info-title__name`, Label/Medium, dark or blue depending on variant
- **Verb** — `span.info-title__verb`, Body/Small, `ls: -0.08px` — "pinned" (pinned variant only)

## Variants
| Variant | Icon | Content |
|---|---|---|
| Forward | `forward.svg` | "Forwarded from" (label) + sender name — both blue; icon tinted with `--secondary` filter |
| Pinned | `pin.svg` | Sender name (bold dark) + "pinned" (regular) |
| Editing | `edit.svg` | "Edit Message" (bold dark) |
| Reply | `reply.svg` | Sender name (bold dark) |

## States
| State | Description |
|---|---|
| Default | Static — no interaction on the InfoTitle itself |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-info-secondary` | Forward icon filter target + label + name color |
| `--color-primary-transparent-87` | Name and verb color (pinned, editing, reply) |
| `--text-body-small-*` | "Forwarded from" label and "pinned" verb |
| `--text-label-medium-*` | Name text (all variants) |

## Do / Don't
✅ **Do** — use `icons/small/` (16×16) for all variants — don't use `icons/general/` (24×24)  
✅ **Do** — add `info-title__icon--secondary` class to the forward icon to tint it blue  
❌ **Don't** — use `info-title__label` for the name in the forward variant — label is "Forwarded from" only  
❌ **Don't** — mix icon sizes across variants

## Accessibility
- Minimum touch target: not interactive — no touch target required
- The icon is decorative (`aria-hidden="true"`) — the text conveys the full meaning
- Consider `aria-label` on the container if used in isolation: `aria-label="Forwarded from Abram"`

## Notes
⚠️ The "pinned" verb uses `letter-spacing: -0.08px` from Figma's `Regular/XXS` (SF Pro Text) — approximated with Roboto Body/Small since SF Pro Text is not in the design system.

## Status
`draft`
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

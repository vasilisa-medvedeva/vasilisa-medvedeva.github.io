# TextReply

> A preview of the quoted message in the chat — shows the author's name and truncated text with a vertical bar on the left.

## When to use / when not to use
- ✅ Use inside a message bubble to show the message being replied to
- ✅ Use in the composer area to display the active reply context
- ❌ Don't use for forward previews — use a separate ForwardPreview variant
- ❌ Don't show more than one TextReply per message

## Anatomy
Container → Inner → [InfoTitle] + [Text] + [Line]

- **Container** — `div.text-reply`, `334×66px`, `border-radius: 16px 16px 0 0`, `border-bottom: 0.5px solid yellow`, `padding: 4px 12px`
- **Inner** — `div.text-reply__inner`, `padding-left: 10px`, `position: relative` — anchor for the bar
- **InfoTitle** — the `div.info-title` atom (reply variant): reply icon + sender name
- **Text** — `p.text-reply__text`, Body/Medium, `transparent-60`, single line with ellipsis
- **Line** — `div.text-reply__line`, absolute, `left:0 top:3px bottom:4px width:2px`, `transparent-87`

## Variants
| Variant | Description |
|---|---|
| Default | InfoTitle (reply) + text + bar |

⚠️ Variant missing: **Forward**. The Figma file may include a forward-icon variant. Clarify if needed.

## States
| State | Description |
|---|---|
| Default | Static preview, no interactivity |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-brand-yellow-secondary` | Container bottom border |
| `--color-primary-transparent-87` | Left bar |
| `--color-primary-transparent-60` | Quote text |
| `--text-body-medium-*` | Quote text (14px / 400 / lh 18px) |

## Do / Don't
✅ **Do** — use the `info-title` atom for the name row — don't duplicate its styles  
❌ **Don't** — don't change `height: 66px` — the component relies on a fixed height  
✅ **Do** — truncate the text with `text-overflow: ellipsis` — the full text lives in the message itself  

## Accessibility
- The container is not interactive — no touch target required
- Add `aria-label="Reply to Abram"` on the parent element for context

## Status
`draft`
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

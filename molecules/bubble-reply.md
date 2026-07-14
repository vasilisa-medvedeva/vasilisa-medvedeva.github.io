# BubbleReply

> A chat bubble with an embedded reply quote — shown when the user replies to a specific message.

## When to use / when not to use
- ✅ Use when a message is a reply to a previous message — to show the quoted context
- ❌ Don't use for regular messages without a quote; use a plain text bubble instead

## Anatomy
```
┌─────────────────────────────────────────┐
│ ← Sender name                           │  ← quote section (InfoTitle + quoted text + line)
│   Quoted message preview...             │
├─────────────────────────────────────────┤
│ Message text                            │  ← body section
│                          Read  8:30 pm  │
└──────────────────────────────────────◣  │  ← tail (SVG asset)
```
- **box** — rounded bubble container (yellow for sender, white for recipient)
- **quote** — top section: InfoTitle atom + quoted text + 2px left accent line
- **body** — bottom section: optional sender name (channel), message text, send time
- **tail** — SVG asset (`assets/tail-sender.svg` / `assets/tail-recipient.svg`) positioned at bottom corner; recipient tail is horizontally mirrored via `transform: scaleX(-1)`

## Variants
| Variant | Description |
|---|---|
| sender | Yellow bubble, tail right, "Read · time" |
| recipient | White bubble, tail left, time only |
| recipient · channel | White + Avatar (sm) + sender name in body |

## States
| State | Description |
|---|---|
| default | Static display |

⚠️ State missing: unread/delivered. Figma defines `status: delivered` (no "Read" prefix). Currently only `read` implemented. Confirm or describe.

## Tokens
| Token | Role in this component |
|---|---|
| `--color-brand-yellow-16` | Sender bubble background + tail fill |
| `--color-brand-yellow-60` | Sender bubble border + tail stroke |
| `--color-constant-primary` | Recipient bubble background + tail fill |
| `--color-brand-yellow-48` | Recipient bubble border + tail stroke |
| `--color-brand-yellow-secondary` | Quote section bottom divider |
| `--color-primary-transparent-87` | Quote left accent line; message text |
| `--color-primary-transparent-60` | Quoted text; send time |
| `--text-body-large-*` | Message text (16px/20px) |
| `--text-body-small-*` | Send time (12px/12px) |
| `--text-label-medium-*` | Sender name (channel variant) |

## Do / Don't
✅ **Do** — always include both quote and body sections  
❌ **Don't** — nest a BubbleReply inside another BubbleReply

## Accessibility
- Minimum touch target: 44×44pt (full bubble is tappable)
- Quote section should be marked with `aria-label="Reply to: [sender]: [quoted text]"` in production
- Decorative icons and tail SVG: `aria-hidden="true"`

## Status
`draft`  
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

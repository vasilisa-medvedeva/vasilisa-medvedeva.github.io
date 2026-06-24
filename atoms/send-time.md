# SendTime

> A compact timestamp with optional delivery/edit status label, shown at the bottom of a chat message bubble.

## When to use / when not to use
- ✅ Use inside a chat bubble to display message time and delivery status.
- ❌ Don't use standalone outside a message context — no visual container of its own.

## Anatomy
```
.send-time
├── .send-time__label  ← optional · status text
└── .send-time__time   ← always present · timestamp
```
- **label** — one of: Edited · Sending · Sent · Read · N Read. Omit for recipient default.
- **time** — always the last element; formatted timestamp ("8:30 pm").

## Variants
| Variant | Label | Notes |
|---|---|---|
| Recipient · default | — | Time only |
| Recipient · edited | Edited | |
| Sender · sending | Sending | Message in transit |
| Sender · sent | Sent | Delivered to server |
| Sender · read | Read | Read by recipient |
| Sender · read · channel | N Read | N = reader count |
| Sender · edited | Edited | |

## States
| State | Description |
|---|---|
| Default | Static presentational element — no interactive states |

## Tokens
| Token | Role |
|---|---|
| `--color-primary-transparent-48` | Text colour for both label and time |
| `--text-body-small-*` | Typography: Roboto Regular 12/12, 0.4px spacing |

## Do / Don't
✅ **Do** — place label before the time; keep both in the same `.send-time` container.
✅ **Do** — omit `.send-time__label` entirely for recipient-default (time only).
❌ **Don't** — add more than one label element per SendTime.
❌ **Don't** — hardcode font size or color values.

## Accessibility
- Text is plain visible content — no ARIA needed.
- Minimum contrast: `rgba(0,0,0,0.48)` on white/yellow bubble backgrounds meets WCAG AA for non-UI text at 12px.

## Status
`draft` — proposed by Claude, confirm to change.
Version 0.1 | Owner: @medvedeva_vas

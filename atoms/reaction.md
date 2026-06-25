# Reaction

> An emoji-and-count pill shown under a chat message, indicating who reacted and how many.

## When to use / when not to use
- ✅ Use under a message bubble to show a reaction (emoji) and its count.
- ❌ Don't use as a button to *add* a reaction — that's the emoji picker.

## Anatomy
```
.reaction
├── .reaction__emoji  ← reaction glyph (16px)
└── .reaction__count  ← number of reactions (bold 12px)
```

## Variants
| Variant | Background | Count colour |
|---|---|---|
| Recipient (default) | `--color-brand-yellow-16` | dark (primary/87) |
| Sender (`--sender`) | `--color-brand-yellow-32` | dark (primary/87) |
| Me (`--me`) | `--color-info-secondary` | white |

## States
| State | Description |
|---|---|
| Default | Static presentational element — no interactive states |

## Tokens
| Token | Role |
|---|---|
| `--color-brand-yellow-16` | Background (recipient) |
| `--color-brand-yellow-32` | Background (sender) |
| `--color-info-secondary` | Background (me) |
| `--color-primary-transparent-87` | Count colour (recipient/sender) |
| `--color-constant-primary` | Count colour (me) |
| `--text-label-medium-bold-*` | Count typography (Roboto 700 · 12/12) |

## Do / Don't
✅ **Do** — keep emoji before count, both inside one `.reaction`.
❌ **Don't** — hardcode background or text colours.

## Accessibility
- Minimum touch target: 44×44pt — pad the surrounding tap area; the pill itself is 22px tall.
- Count text contrast meets WCAG AA on all three backgrounds.

## Status
`draft` — proposed by Claude, confirm to change.
Version 0.1 | Owner: @medvedeva_vas

# Message

> A full chat message bubble: the Bubble2.0 shape filled with an optional sender name, an optional "forwarded from" header, the message text, and the BubbleBottom 2.0 strip — plus an avatar for channel messages.

## When to use / when not to use
- ✅ Use to render a single chat message in a conversation thread.
- ❌ Don't use for the reply-quote bubble or the bottom strip alone — those are their own components.

## Anatomy
```
.message  (lane, 414px)
├── .message__avatar        AvatarPlaceholder S — channel, last in group
└── .bubble2 (+--white --left, +--top/--mid/--last)   Bubble2.0 shape
    └── .bubble2__content
        ├── .message__name        sender name (title-small) — channel, first in group
        ├── .info-title (forward)  "Forwarded from" — link
        ├── <p> text               Body/Large
        └── .bubble-bottom-2       time / reactions strip
```

## Variants (Figma 36-cell matrix)
| Axis | Values |
|---|---|
| type | sender (yellow, right tail) · recipient (white, left tail) |
| channel | on → avatar + sender name (recipient only) · off |
| position | top · middle · bottom · alone → Bubble2.0 grouping (tail on bottom/alone) |
| reactions | on (reaction pills) · off (time only) |
| link | yes ("Forwarded from") · no |

Grouping: the sender **name** shows on the first bubble (top/alone); the **avatar** shows on the last (bottom/alone).

## States
| State | Description |
|---|---|
| Default | Static; the 36-variant preview block is collapsible |

## Tokens
| Token | Role |
|---|---|
| `--color-brand-yellow-16` / `-32` | Sender bubble fill / stroke (via Bubble2.0) |
| `--color-constant-primary` / `--color-brand-yellow-24` | Recipient fill / stroke (via Bubble2.0) |
| `--text-title-small-*` | Sender name |
| `--text-body-large-*` | Message text |
| (atoms) | Reactions, time, forward header, avatar |

## Uses atoms / molecules
| Component | Role |
|---|---|
| Bubble2.0 | bubble shape, grouping positions, white/left |
| BubbleBottom 2.0 | time / reactions strip |
| InfoTitle (forward) | "Forwarded from" header |
| AvatarPlaceholder (S) | channel avatar |

## Do / Don't
✅ **Do** — let Bubble2.0 draw the shape from content; just fill `.bubble2__content`.
✅ **Do** — show the name only on the first grouped bubble, the avatar only on the last.
❌ **Don't** — give the bubble a CSS background/border — Bubble2.0's SVG path is the skin.
❌ **Don't** — hardcode colours or text styles; everything comes from the reused atoms.

## Accessibility
- Avatar carries an `aria-label` (sender name); decorative SVGs are `aria-hidden`.
- Forward/reaction/time controls follow their atoms' accessibility rules.

## Status
`draft`  
Version 0.1 | Owner: @medvedeva_vas

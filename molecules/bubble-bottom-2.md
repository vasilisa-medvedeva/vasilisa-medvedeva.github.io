# BubbleBottom 2.0

> The transparent bottom strip of a chat bubble: reaction pills, delivery time, and (for recipients) a comments link — composed entirely from existing atoms.

## When to use / when not to use
- ✅ Use directly below the message text inside a Bubble2.0 to show reactions, status, and comments.
- ❌ Don't use standalone — it has no surface of its own; the parent bubble provides background and shape.
- ❌ Don't add bubble background, padding, or border here — those belong to the bubble wrapper.

## Anatomy
```
.bubble-bottom-2                      root · 360px · transparent column
├── .bubble-bottom-2__reactions       reactions area (emoji=on)
│     1-row / collapsed:  pills + [.reaction-arrow] + .bubble-bottom-2__time
│     expanded (--stacked):
│        .bubble-bottom-2__row        row 1 — overflow pills
│        .bubble-bottom-2__row        row 2 — pills + .reaction-arrow + .bubble-bottom-2__time
├── .bubble-bottom-2__time            (emoji=off) SendTime only, right-aligned
└── .bubble-comments                  recipient only — own top hairline + padding
```
- **__time** — wraps the SendTime atom and pushes it to the right edge (`margin-left:auto`).
- **__reactions--stacked** — switches to a column so pills wrap onto two rows.

## Variants
The molecule mirrors the Figma component's 4 props — `type` · `emoji` · `row` · `open`.

| type · emoji · row · open | Composition |
|---|---|
| sender · on · 1 · yes | pills + time |
| sender · off · 1 · yes | time only |
| sender · on · 2 · no | pills + ReactionArrow ⌄ + time |
| sender · on · 2 · yes | 2 rows of pills + ReactionArrow ⌃ + time |
| recipient · on · 1 · yes | pills (incl. "me") + time + BubbleComments |
| recipient · off · 1 · yes | time + BubbleComments |
| recipient · on · 2 · yes | 2 rows + ReactionArrow ⌃ + time + BubbleComments |
| recipient · on · 2 · no | pills + ReactionArrow ⌄ + time + BubbleComments |

## States
| State | Description |
|---|---|
| Collapsed (`open=no`) | Overflowed reactions hidden; ReactionArrow points down |
| Expanded (`open=yes`) | All reactions shown across 2 rows; ReactionArrow points up |

## Tokens
| Token | Role in this molecule |
|---|---|
| — (transparent) | The molecule has no fill of its own |
| (atoms) | All colour & typography delegated to Reaction / SendTime / BubbleComments |

## Uses atoms
| Atom | Notes |
|---|---|
| Reaction | `--sender` (sender), default + one `--me` (recipient) |
| ReactionArrow | collapse/expand toggle; `--sender` in sender context |
| SendTime | sender → "Read · time"; recipient row-1 → time only; recipient row-2 → "Read · time" |
| BubbleComments | recipient variants only |

## Do / Don't
✅ **Do** — use `__reactions--stacked` + two `__row` children when reactions wrap to a second row.
✅ **Do** — keep the SendTime inside `__time` so it stays pinned to the right edge.
❌ **Don't** — render BubbleComments for the sender type.
❌ **Don't** — give the molecule a background, border, or padding — it is transparent by design.

## Accessibility
- ReactionArrow must carry `aria-expanded` and a descriptive `aria-label` ("Show all reactions" / "Collapse reactions").
- Reaction pills, SendTime, and BubbleComments follow the accessibility rules of their own atoms.

## Status
`draft`  
Version 0.1 | Owner: @medvedeva_vas

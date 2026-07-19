# Bubble2.0

> A chat message bubble drawn as one continuous outline so the body and tail never seam; its width and height follow the content while the tail keeps a fixed shape.

## When to use / when not to use
- ✅ Use when rendering a chat/message bubble whose size must adapt to text length.
- ✅ Use when you need a sender (right) and recipient (left) direction with an undistorted tail.
- ❌ Don't use for non-message containers (cards, banners) — use a card/surface instead.
- ❌ Don't use when the tail must point up/down — this atom only supports a bottom corner tail.

## Anatomy
```
.bubble2  ─ positioning wrapper (inline-flex)
├── .bubble2__shape   ← <svg><path/></svg>, the single outline (body + tail)
└── .bubble2__content ← text layer, padding 10×16, drives width & height
```
- **shape** — one `<path>`: rounded body (radius 16) + fixed tail sub-path from Union.svg, sharing one 1.5px stroke.
- **tail** — fixed bottom-corner sub-path; mirrored for the left variant, never scaled.
- **content** — the only thing that changes size; the path is regenerated to wrap it.
- **corners** — non-tail side always 16px; tail side tightens to 4px where bubbles in a group join.

## Variants
| Variant | Description |
|---|---|
| Yellow (default) | Fill `--color-brand-yellow-16`, stroke `--color-brand-yellow-32` |
| White (`--white`) | Fill `--color-constant-primary`, stroke `--color-brand-yellow-24` |
| Right (default) | Tail in the bottom-right corner (sender) |
| Left (`--left`) | Tail mirrored to the bottom-left corner (recipient) |
| Single (default) | Standalone message — tail + all 16px corners |
| Group top (`--top`) | First of a run — tail-side bottom corner 4px, no tail |
| Group middle (`--mid`) | Both tail-side corners 4px, no tail |
| Group last (`--last`) | Last of a run — tail-side top corner 4px + tail |

## Grouping
Consecutive messages from one user form a stack. The non-tail side keeps full
16px corners; on the tail side the corners that touch a neighbour tighten to 4px:

- `--top` → bottom corner (tail side) = 4px
- `--mid` → both corners (tail side) = 4px
- `--last` → top corner (tail side) = 4px, plus the tail
- single (no modifier) → tail + all 16px

Stack the bubbles in a flex column with a 2px gap, aligned to the tail side
(right for sender, left for recipient).

## States
| State | Description |
|---|---|
| Default | The only state — a static presentational container, no interactive states |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-brand-yellow-16` | Body fill (yellow) |
| `--color-brand-yellow-32` | Body stroke (sender / yellow) |
| `--color-brand-yellow-24` | Body stroke (recipient / white) |
| `--color-constant-primary` | Body fill (white variant) |
| `--color-primary-transparent-87` | Message text colour |
| `--text-body-large-*` | Message typography |

## Do / Don't
✅ **Do** — let the content size the bubble; the outline regenerates to fit.
✅ **Do** — keep the 1.5px stroke and 16px radius from Union.svg.
✅ **Do** — give only the last bubble in a run the tail; tighten joined corners to 4px.
❌ **Don't** — set a fixed height that clips text, or scale the whole bubble (the tail would distort).
❌ **Don't** — hardcode colours; always reference tokens.
❌ **Don't** — put a tail on every bubble in a group.

## Accessibility
- Minimum touch target: 44×44pt (enforce on the tappable message row, not the bubble).
- ARIA: the SVG is `aria-hidden="true"`; the text in `.bubble2__content` is the accessible content.
- Contrast: body text uses `--color-primary-transparent-87` on yellow/white fills — meets WCAG AA for body text.

## Status
`draft`  
Version 0.1 | Owner: @medvedeva_vas

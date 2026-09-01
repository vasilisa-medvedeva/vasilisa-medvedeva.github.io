# ReactionArrow

> A 32×32 round button with a chevron that expands or collapses a message's reactions.

## When to use / when not to use
- ✅ Use next to a reaction cluster to toggle showing all reactions.
- ❌ Don't use for navigation or unrelated expand/collapse — use the standard chevron.

## Anatomy
```
.reaction-arrow (button 32×32)
└── .reaction-arrow__icon  ← 16px chevron · 1.5px stroke
```

## Variants
| Variant | Background |
|---|---|
| Recipient (default) | `--color-brand-yellow-16` |
| Sender (`--sender`) | `--color-brand-yellow-32` |

## States
| State | Description |
|---|---|
| Closed (default) | Chevron points down |
| Open (`--open`) | Chevron flips 180° (points up) |

## Tokens
| Token | Role |
|---|---|
| `--color-brand-yellow-16` | Background (recipient) |
| `--color-brand-yellow-32` | Background (sender) |
| `--color-primary-transparent-87` | Chevron stroke |

## Do / Don't
✅ **Do** — render as a `<button>` with `aria-expanded` reflecting open/closed.
❌ **Don't** — animate the whole button; only the chevron rotates.

## Accessibility
- Minimum touch target: the button is exactly 32×32 — provide ≥44×44pt of tappable area around it.
- ARIA: `aria-expanded` true/false; `aria-label` describing the action; icon is `aria-hidden`.

## Status
`draft`  
Version 0.1 | Owner: @medvedeva_vas

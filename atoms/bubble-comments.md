# BubbleComments

> A comments link shown under a post: chats icon, the comment count, and a right chevron, separated from the content above by a hairline.

## When to use / when not to use
- ✅ Use under a post/message to open its comments thread.
- ❌ Don't use as a generic list row — it's specific to the "N Comments" affordance.

## Anatomy
```
.bubble-comments  (top hairline divider)
├── .bubble-comments__icon   ← library icon · tabbar/chats-default · 20px
├── .bubble-comments__label  ← "N Comments" · body-large · fills width
└── .bubble-comments__arrow  ← library icon · small/arrow-right · 16px
```
- **divider** — 1px hairline on top (`--color-brand-yellow-32`); full-bleed in context.
- **icon / arrow** — referenced from the icon library via `<img src>`, not redrawn.

## Variants
| Variant | Description |
|---|---|
| Default | Icon + "N Comments" + chevron |

## States
| State | Description |
|---|---|
| Default | Static presentational row — no interactive states defined |

## Tokens
| Token | Role |
|---|---|
| `--color-brand-yellow-32` | Top hairline divider |
| `--color-primary-transparent-87` | Label colour |
| `--text-body-large-*` | Label typography (Roboto 400 · 16/20 · 0.5px) |

## Icons (from library)
| Icon | Path |
|---|---|
| chats | `icons/tabbar/chats-default.svg` |
| arrow | `icons/small/arrow-right.svg` |

## Do / Don't
✅ **Do** — reference both icons from the library; don't inline or recolor copies.
✅ **Do** — let the label grow so the chevron stays pinned to the right.
❌ **Don't** — hardcode the divider or text colour.

## Accessibility
- In use, wrap as a `<button>`/`<a>` with an accessible name ("2 Comments"); icons stay decorative (`alt=""`).
- Minimum touch target: 44×44pt — the row's 8px vertical padding plus context should reach it.

## Status
`draft` — proposed by Claude, confirm to change.
Version 0.1 | Owner: @medvedeva_vas

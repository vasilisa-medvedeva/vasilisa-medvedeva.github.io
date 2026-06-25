# CellSeparator

> Section header row for lists — a labelled divider with optional arrow and top/bottom hairlines.

## When to use / when not to use
- ✅ Use to label a group of list items (contacts, settings, chats).
- ✅ Use with an arrow when tapping the header opens a related screen.
- ❌ Don't use as a chat date separator — that's SeparatorMessage.
- ❌ Don't use as a standalone decorative divider without a title.

## Anatomy
```
.cell-separator [--s] [--m]          flex row · px 16px · gap 4px · position relative
├── ::before                          0.5px top hairline (--color-primary-transparent-16)
├── .cell-separator__title            Title/Small · flex:1
├── .cell-separator__arrow (opt.)     icons/small/arrow-right.svg · 16×16
└── ::after                           0.5px bottom hairline
```

## Variants
| Variant | Description |
|---|---|
| xS (default) | pt 10 / pb 8 · total height 36px |
| `--s` | pt 18 / pb 12 · total height 48px |
| `--m` | pt 26 / pb 12 · total height 56px |

## States
| State | Description |
|---|---|
| Default | Static presentational element — no interactive states |

## Tokens
| Token | Role in this component |
|---|---|
| `--text-title-small-*` | Title typography (Roboto Medium 14/18 · 0.1px) |
| `--color-primary-transparent-87` | Title colour |
| `--color-primary-transparent-16` | Hairline divider colour (#EBEBEB) |
| `--color-constant-primary` | Row background |

## Do / Don't
✅ **Do** — keep dividers as 0.5px hairlines (per Figma `inset -0.25px`), not a full 1px line.
✅ **Do** — use `--no-divider-top` / `--no-divider-bottom` when adjacent items already provide a boundary.
✅ **Do** — omit the arrow span entirely when the header is not interactive.
❌ **Don't** — add a subtitle or secondary text; this component is title-only by design.
❌ **Don't** — hardcode padding or colours outside the defined size modifiers.

## Accessibility
- Render as `<div role="rowheader">` or an appropriate heading depending on the surrounding list semantics.
- If the arrow makes the row tappable, wrap in `<button>` and add `aria-label`.
- The arrow icon is `aria-hidden="true"` — meaning is carried by the title text.

## Uses atoms / molecules
| Component | Role |
|---|---|
| icons/small/arrow-right.svg | 16px chevron (optional) |

## Status
`draft` — proposed by Claude, confirm to change.
Version 0.1 | Owner: @medvedeva_vas

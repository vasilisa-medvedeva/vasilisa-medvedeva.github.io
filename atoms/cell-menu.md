# CellMenu

> Ячейка контекстного меню — иконка слева, текст по центру, опциональный кластер аватаров справа. Строительный блок для dropdown-меню.

## When to use / when not to use
- ✅ Use inside a dropdown or context menu list.
- ✅ Use when an action needs an icon label and optional participant preview (avatars).
- ❌ Don't use as a standalone button — use Button atom.
- ❌ Don't use for navigation links — use sidebar nav or tab items.

## Anatomy
```
.cell-menu [--hover] [--pressed]
└── .cell-menu__base     flex row · px 16px · h 48px · gap 8px
    ├── .cell-menu__icon     24×24 icon slot (any small SVG)
    ├── .cell-menu__text     flex:1
    │   └── .cell-menu__title   Body/Large · truncates on overflow
    └── .cell-menu__avatars  optional · 36×20px overlapping pip cluster
        ├── .cell-menu__avatar-pip   20px circle · primary/08
        └── .cell-menu__avatar-pip   20px circle · offset 16px
```

## Variants
| Variant | Description |
|---|---|
| default | No avatars on right |
| `avatars` | Two overlapping pip circles (36×20px) |

## States
| State | Background token |
|---|---|
| enabled | transparent |
| hover (`--hover`) | `--color-brand-yellow-4` |
| pressed (`--pressed`) | `--color-brand-yellow-8` |

## Tokens
| Token | Role |
|---|---|
| `--color-brand-yellow-4` | Hover background |
| `--color-brand-yellow-8` | Pressed background |
| `--color-primary-transparent-87` | Title text |
| `--color-primary-transparent-08` | Avatar pip fill |
| `--color-constant-primary` | Avatar pip border (white separator) |
| `--text-body-large-*` | Title typography |

## Do / Don't
✅ **Do** — pass any 24px icon into `.cell-menu__icon`; the slot is icon-agnostic.
✅ **Do** — apply `--hover` / `--pressed` via JS on pointer events in the parent menu.
❌ **Don't** — hardcode background colours; always use the modifier classes.
❌ **Don't** — show more than two avatar pips — the slot is fixed at 36×20px.

## Accessibility
- Render the cell as `<button role="menuitem">` or `<a role="menuitem">` inside a `role="menu"` container.
- Icon is decorative — `aria-hidden="true"`.
- Title is the accessible label; add `aria-label` on the button if the icon alone conveys the action.

## Status
`draft` — proposed by Claude, confirm to change.
Version 0.1 | Owner: @medvedeva_vas

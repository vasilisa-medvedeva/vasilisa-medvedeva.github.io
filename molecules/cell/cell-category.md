# CellCategory

> A collapsible category header row in the chat list: name with a chevron and an optional lock on the left, menu button and drag handle on the right.

## When to use / when not to use
- ✅ Use as a collapsible section header in a categorized chat/contact list.
- ✅ Use when a category can be private (lock) or reorderable by its owner (drag handle).
- ❌ Don't use as a plain list row — use CellBase or CellSeparator instead.
- ❌ Don't use as a navigation header — use TopBar.

## Anatomy
```
.cell-category                      flex · gap 10px · pt 26px / pb 12px / pl 16px / pr 12px
├── .cell-category__main            flex:1 · gap 4px · align center
│   ├── .cell-category__title-wrap  position:relative · flex · gap 10px
│   │   ├── .cell-category__title   Title/Small · Roboto Medium 14/18
│   │   └── .cell-category__lock-badge  (lock only) absolute 16×16 pill · bg constant-primary
│   │       └── .cell-category__lock-icon  icons/small/lock.svg · 16px
│   └── .cell-category__arrow       16×16 · arrow-right (closed) / arrow-down (open)
└── .cell-category__right           flex · gap 16px · align center
    ├── .cell-category__menu        icons/small/menu.svg · 16px  (always)
    └── .cell-category__move        icons/small/moving.svg · 16px  (owner only)
```

## Variants
| Variant | Description |
|---|---|
| default | `owner=true · open=false · lock=false` |
| open | Chevron points down; category is expanded |
| not-owner | Drag handle hidden; user can't reorder |
| lock | Lock badge superscript on title; category is private |
| add | Action row for adding an item: title (e.g. "Add") + `add.svg` in the arrow slot, no lock, no right block (`__menu`/`__move`). Used as the "Add ＋" entry above a categorized list (Figma node 2511:73296). |

## States
| State | Description | Token |
|---|---|---|
| default | Static row | `--color-constant-primary` |
| hover (`--hover`) | Pointer hover | `--color-brand-yellow-4` |
| pressed (`--pressed`) | Active/tap | `--color-brand-yellow-8` |

⚠️ Hover/pressed states are not defined in the Figma design. Yellow ramp from CellBase/CellMenu is proposed — confirm or remove.

## Tokens
| Token | Role in this component |
|---|---|
| `--text-title-small-*` | Title — Roboto Medium 14/18 · 0.1 |
| `--color-primary-transparent-87` | Title text colour |
| `--color-constant-primary` | Row background · lock pill background |
| `--color-brand-yellow-4` | Hover background |
| `--color-brand-yellow-8` | Pressed background |

## Do / Don't
✅ **Do** — swap `arrow-right` ↔ `arrow-down` via JS on toggle; the component only owns the static layout.
✅ **Do** — omit `.cell-category__move` entirely when the user is not the owner.
❌ **Don't** — hardcode background colors; use modifier classes `--hover` / `--pressed`.
❌ **Don't** — put the lock badge outside `.cell-category__title-wrap`; it must be a sibling of `.cell-category__title` for correct absolute positioning.

## Accessibility
- Minimum touch target: 44×44pt — the row is at least 44px tall (26+12 padding + 18px title line), satisfying this.
- Render the row as `<button>` if it controls expand/collapse; expose `aria-expanded` on it.
- Icons are decorative — `aria-hidden="true"` on all `<img>`.
- If the category is locked, add a visually-hidden `<span>` "(private)" for screen readers.

## Uses atoms / molecules
| Component | Role |
|---|---|
| icons/small/arrow-right.svg | Closed chevron · 16px |
| icons/small/arrow-down.svg | Open chevron · 16px |
| icons/small/add.svg | Plus glyph in the arrow slot (`add` variant) · 16px |
| icons/small/lock.svg | Lock badge icon · 16px |
| icons/small/menu.svg | Context menu trigger (…) · 16px |
| icons/small/moving.svg | Drag handle (owner only) · 16px |

## Status
`stable` — confirmed by the user.
Version 1.0 | Owner: @medvedeva_vas

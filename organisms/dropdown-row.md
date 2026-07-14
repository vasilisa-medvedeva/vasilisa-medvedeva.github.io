# DropdownRow

> Floating menu that appears on compose — a rounded white card stacking CellBase items to pick what to create (Channel / Chat).

## When to use / when not to use
- ✅ Use as the compose/create menu anchored to a trigger (e.g. the Chats "new" button)
- ✅ Use for a short list of text-only create options
- ❌ Don't use for message/item context actions with icons → use DropdownMenu (CellMenu rows)
- ❌ Don't use for a horizontal toolbar → use MenuCompact

## Anatomy
- **container** — white card, radius 16, `--elevation-4` (M3 dropdown-menu overlay), vertical padding 8
- **item** — `CellBase` (title-only), 16px h-padding, 14px v-padding, `role="menuitem"`

## Variants
| Variant | Description |
|---|---|
| Default | Channel + Chat items |

## States
| State | Description |
|---|---|
| default | Transparent item background |
| hover | `--color-brand-yellow-4` |
| pressed | `--color-brand-yellow-8` |

## Tokens
| Token | Role |
|---|---|
| `--color-constant-primary` | Card surface |
| `--elevation-4` | Card shadow (M3 dropdown-menu overlay) |
| `--text-title-medium-*` · `--color-primary-transparent-87` | Item title |
| `--color-brand-yellow-4` / `-8` | Hover / pressed |

## Composition (Reuse → Compose → Create)
- **CellBase** — molecule, reused as each menu item (title-only)
- **Only new** — the floating card container (surface · radius · shadow · padding)

## Accessibility
- `role="menu"` on container, `role="menuitem"` on items; label the menu ("Create")
- Min touch target 44pt (item ≈ 48px tall)

## Status
`draft` — proposed by Claude, confirmed by the user.
Version 0.1 | Owner: @medvedeva

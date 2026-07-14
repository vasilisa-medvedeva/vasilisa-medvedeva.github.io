# CellBase

> Foundational list-cell layout primitive: optional left slot, a text column (Title + up to two Subtitles), an optional right slot, and a bottom hairline divider. The skeleton other Cell molecules are built on.

## When to use / when not to use
- ✅ Use as the base row for any list (settings, contacts, menus) when no specialized Cell fits.
- ✅ Use the size scale to set row height and the slots to drop in an avatar, icon, checkbox, chevron, etc.
- ❌ Don't use directly when a specialized cell already exists (CellContact, CellActivity, CellToggle, CellSeparator) — prefer those.
- ❌ Don't put unrelated content in the slots; they're for a single leading/trailing element.

## Anatomy
```
.cell-base [--size] [--row-3] [--state]   flex row · gap 8px · px 16px · align center
├── .cell-base__left   (optional)         leading slot 24px · flex-shrink:0
├── .cell-base__text    flex:1
│   ├── .cell-base__title       Title/Medium
│   ├── .cell-base__subtitle    Body/Medium   (row 2)
│   └── .cell-base__subtitle    Body/Medium   (row 3)
├── .cell-base__right  (optional)         trailing slot 24px · justify-end
└── .cell-base__divider (optional)        0.5px hairline · inset left 48px
```
The divider starts at 48px (16 px + 24 slot + 8 gap) so it aligns under the text column.

## Variants
| Size | Height | Rows supported |
|---|---|---|
| `--xsmall` | 36px | 1 |
| `--small` | 48px | 1 |
| `--medium` | 56px | 1–2 |
| `--large` | 64px | 1–2 |
| `--xlarge` | 72px | 1–3 |

Rows are content-driven (add `.cell-base__subtitle` lines). `--row-3` top-aligns the slots and text for the 3-line case. Slots and the divider are independently optional.

## States
| State | Description | Token |
|---|---|---|
| default | static row | `--color-constant-primary` |
| `--hover` | pointer hover | `--color-brand-yellow-4` |
| `--pressed` | active/tap | `--color-brand-yellow-8` |
| `--selected` | selected row | `--color-brand-yellow-16` |
| `--destructive` | destructive action row — red title for irreversible actions (Delete / Remove / Leave) | `--color-brand-red-secondary` (title) |

⚠️ The Figma node defines only the resting layout (`open=no`); hover/pressed/selected follow CellMenu's yellow ramp.

## Tokens
| Token | Role in this component |
|---|---|
| `--text-title-medium-*` | Title (Roboto Medium 16/20 · 0.15) |
| `--text-body-medium-*` | Subtitle (Roboto Regular 14/18 · 0.25) |
| `--color-primary-transparent-87` | Title colour |
| `--color-primary-transparent-60` | Subtitle colour |
| `--color-primary-transparent-16` | Divider hairline (#EBEBEB) |
| `--color-constant-primary` | Row background |
| `--color-brand-yellow-4 / -8 / -16` | hover / pressed / selected |
| `--color-brand-red-secondary` | Destructive title colour (`--destructive`) |

## Do / Don't
✅ **Do** — pick the size by required row height; keep the text column for Title/Subtitle only.
✅ **Do** — keep the divider as a 0.5px hairline inset to 48px so it lines up across the list.
✅ **Do** — drop a library atom (Avatar, icon, checkbox) into a slot; CellBase only owns the layout.
❌ **Don't** — hardcode state backgrounds; use the yellow tokens.
❌ **Don't** — add a third text line without `--xlarge --row-3` (other sizes don't define 3 rows).
❌ **Don't** — use `--destructive` for routine actions; reserve the red title for irreversible ones (delete, remove, leave).

## Accessibility
- Minimum touch target: 44×44pt — `--small` and up satisfy this; avoid `--xsmall` for tappable rows.
- Render an interactive row as `<button>` / `<a>`; expose `aria-selected` for the selected state.
- Slot content carries its own semantics/labels; decorative placeholders are `aria-hidden`.
- Title/Subtitle contrast meets WCAG AA on the constant background.

## Uses atoms / molecules
| Component | Role |
|---|---|
| AvatarPlaceholder | neutral 24px slot filler in the demo |
| (any atom) | real leading/trailing slot content (Avatar, icon, checkbox, chevron) |

## Status
`stable` — confirmed by the user.
Version 1.0 | Owner: @medvedeva_vas

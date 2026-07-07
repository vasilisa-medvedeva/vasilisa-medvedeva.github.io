# ConfirmDialog

> Модальный диалог подтверждения действия: заголовок + опции выбора (radio) + деструктивная пара кнопок.

## When to use / when not to use
- ✅ Use when a destructive action (delete, block, report) requires the user to confirm intent
- ✅ Use when the action has additional options the user must choose before confirming
- ❌ Don't use for non-destructive confirmations — use a simpler inline prompt or snackbar
- ❌ Don't use for navigation choices — use Tabs or a bottom sheet

## Anatomy
- **container** — white surface, 300px wide, radius 16px, `elevation-3` shadow, padding 32px top/bottom · 24px left/right, flex-col gap 24px
- **title** — centered, `text-title-large`
- **options** — flex-col list of `CellToggle` rows; inside the dialog the cell side padding is removed so labels and controls align with the card edges
- **control** — reused `Toggle` atom (`toggle-radio` / `toggle-cb`), 28px hit area, yellow-secondary fill when checked
- **actions** — flex row, gap 12px; both buttons flex: 1, h 48px, pill radius 30px, border 1.5px

## Composition (Reuse → Compose → Create)
- **CellToggle** — molecule, xSmall, reused (side padding removed within the dialog)
- **Toggle** — atom, `toggle-radio` / `toggle-cb`, reused
- **Button** — Cancel (outlined) + Delete (filled red), reused shape
- **Only new** — the dialog container itself

## Variants
| Variant | Description |
|---|---|
| With options | Title + toggle rows + Cancel/Delete |
| Without options | Title only + Cancel/Delete (rows omitted) |

## States
| State | Description |
|---|---|
| default | Shown as above |
| ⚠️ loading | Not defined in Figma. Suggested: Delete button shows spinner, both disabled. Confirm or describe. |
| ⚠️ disabled | Not defined in Figma. Suggested: dimmed controls, no hover. Confirm or describe. |

## Tokens
| Token | Role |
|---|---|
| `--color-constant-primary` | Container surface |
| `--elevation-3` | Container shadow |
| `--color-brand-yellow-secondary` | Toggle fill (checked) |
| `--color-primary-transparent-87` | Title, labels, toggle mark + border |
| `--color-primary-transparent-32` | Toggle ring (unchecked) |
| `--color-brand-red-secondary` | Delete button background |
| `--color-primary` | Cancel border, Delete border |
| `--text-title-large-*` | Dialog title |
| `--text-body-large-*` | Option row label |
| `--text-title-medium-*` | Button labels |

## Do / Don't
✅ **Do** — always pair Cancel with the destructive action
✅ **Do** — use the red Delete button only for irreversible actions
✅ **Do** — compose options from the existing CellToggle + Toggle, never redraw controls
❌ **Don't** — show more than 3–4 option rows (use a bottom sheet instead)
❌ **Don't** — rename Delete to anything ambiguous — the label must clearly state the action

## Accessibility
- Minimum touch target: buttons 48px tall ≥ 44pt ✓
- Container role: `dialog`; `aria-modal="true"`; `aria-labelledby` pointing to title
- Toggle controls carry `role="radio"`/`role="checkbox"` + `aria-checked`; add `aria-label` or wrap label in production
- Focus trap inside dialog while open
- Contrast: Delete button text on `--color-brand-red-secondary` — verify 4.5:1

## Status
`draft`
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

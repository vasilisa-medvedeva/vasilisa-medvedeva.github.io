# MenuCompact

> A compact horizontal action bar — a rounded white pill of MenuCompactItem entries with a trailing chevron.

## When to use / when not to use
- ✅ Use for a short row of inline actions floating over content (e.g. a contextual toolbar)
- ✅ Use the trailing icon item to signal overflow / "more"
- ❌ Don't use for long vertical lists of options — use DropdownMenu
- ❌ Don't pack more items than fit on one line; the bar does not wrap

## Anatomy
- **container** — white pill, radius 16, `elevation-2`, horizontal padding 8px, items in a row
- **item** — `MenuCompactItem` atom: `text` (label) or `icon` (16px glyph)
- **trailing icon** — chevron-right (`icons/small/arrow-right.svg`) as the last item

## Composition (Reuse → Compose → Create)
- **MenuCompactItem** — atom, reused for every entry (text + icon types)
- **Icon** — reused `icons/small/arrow-right.svg`
- **Only new** — the pill container (surface · radius · shadow · padding)

## Variants
| Variant | Description |
|---|---|
| Default | Row of text items + trailing icon item |

## States
| State | Description |
|---|---|
| default | Static bar as shown |
| ⚠️ item hover/pressed | Not defined in Figma. Suggested: per-item `--color-primary-transparent-08` tint. Confirm or describe. |
| ⚠️ disabled item | Not defined in Figma. Suggested: dimmed label/icon, no pointer. Confirm or describe. |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-constant-primary` | Pill surface |
| `--elevation-2` | Pill shadow |
| `--text-label-large-*` | Item label typography |
| `--color-primary-transparent-87` | Label text · icon fill |

## Do / Don't
✅ **Do** — compose every entry from the MenuCompactItem atom, never redraw labels/icons
✅ **Do** — keep the bar to a single line of actions
❌ **Don't** — hardcode the surface/shadow; use `--color-constant-primary` + `--elevation-2`
❌ **Don't** — substitute a different shadow level — Figma specifies elevation 2

## Accessibility
- Each item should be a focusable control (`<button>`); give the icon item an `aria-label`
- Container `role="toolbar"` with horizontal arrow-key navigation
- Item height 44px meets the touch target; ensure the icon item has ≥44px tappable width
- Contrast: `--color-primary-transparent-87` on white — verify 4.5:1

## Status
`draft`
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

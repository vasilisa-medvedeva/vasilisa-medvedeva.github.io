# TabItem

> Tab button with an icon and label — used to switch between sections (Gallery, Files, etc.).

## When to use / when not to use
- ✅ Use when switching between 2–5 sections that each have an icon
- ❌ Don't use when there is no icon — use plain text tabs instead
- ❌ Don't use as a standalone element — always place in a group

## Anatomy
Container → [Icon 24×24] + [Label]

- **Container** — border-radius 16px, padding 6px / 8px
- **Icon** — 24×24px, from icons/; inverted (white) in Active state
- **Label** — Title/Small · 14/18 · letter-spacing 0.1px
- **Gap icon↔label** — 2px

## States
| State | Description |
|---|---|
| Active | bg brand-red-secondary · white icon and text · no border |
| Inactive | bg brand-yellow-4 · 1.5px border primary-32 · grey text |

## Tokens
| Token | Role |
|---|---|
| `--color-brand-red-secondary` | Container bg (active) |
| `--color-brand-yellow-4` | Container bg (inactive) |
| `--color-primary-transparent-32` | Border (inactive) |
| `--color-primary-transparent-60` | Text (inactive) |
| `--color-constant-primary` | Icon + text (active) |
| `--text-title-small-*` | Label |

## Accessibility
- Minimum touch target: 44×44pt
- Use `<button type="button">`
- `aria-label` with the section name
- `aria-pressed="true"` on the active item

## Status
`draft` — Version 1.0 | Owner: @vasilisamedvedeva

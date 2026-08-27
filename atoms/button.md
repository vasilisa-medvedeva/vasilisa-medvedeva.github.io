# Button

> Primary action atom — a pill-shaped button in four emphasis levels and four sizes, used everywhere a tap triggers an action.

## When to use / when not to use
- ✅ Primary — the single most important action on a screen (submit, confirm, join)
- ✅ Secondary — an alternative action next to a primary one
- ✅ Only-text — tertiary or inline actions that shouldn't compete for attention
- ✅ Accent — destructive or high-alert actions (leave, delete, exit)
- ❌ Don't use a Button for navigation between sections — that's Tabs / SegmentedControl
- ❌ Don't place two Primary buttons on one screen

## Anatomy
- **container** — inline-flex pill, radius 30px, border 1.5px
- **label** — text token depends on size (see Sizes)
- **spinner** — centered, replaces the label in the Process state only

## Variants
| Variant | Description |
|---|---|
| primary | Yellow bg · dark border & text |
| secondary | White bg · dark border & text |
| only-text | No bg/border · dark text · body-medium weight |
| accent | Red bg · dark border · white text |

## Sizes
| Size | Description |
|---|---|
| xs | pad 5/12 · body-small |
| sm | pad 9/12 · title-small |
| md | 48px height · pad 8/16 · title-medium |
| lg | pad 18/16 · title-medium |

## States
| State | Description |
|---|---|
| enabled | Default appearance |
| pressed | Darker bg per variant |
| disabled | Muted bg · 48% opacity text/border |
| process | Muted bg · spinner replaces the label |
| ⚠️ State missing: focus | Not defined in Figma. Suggested: 2px focus ring (`--color-brand-yellow-secondary`) for keyboard navigation. Confirm or describe. |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-brand-yellow-primary` | Primary bg |
| `--color-brand-yellow-60` | Primary pressed bg |
| `--color-brand-yellow-32` | Primary disabled bg |
| `--color-brand-red-quaternary` | Accent bg |
| `--color-warning-transparent-60` | Accent pressed bg |
| `--color-warning-transparent-48` | Accent disabled bg |
| `--color-primary-transparent-87` | Border and label |
| `--color-primary-transparent-48` | Disabled label/border |
| `--color-primary-transparent-04` | Secondary/only-text pressed bg |
| `--color-constant-primary` | Secondary bg · accent label |
| `--text-body-small-*` / `--text-title-small-*` / `--text-title-medium-*` | Label per size |

## Do / Don't
✅ **Do** — keep the label to one or two words; the pill grows with the label
❌ **Don't** — disable a button without explaining elsewhere why it's disabled; use Process instead while waiting

## Accessibility
- Minimum touch target: 44×44pt (xs/sm hit area extends beyond the visual pill)
- Native `<button>`; `aria-busy="true"` in the Process state
- `aria-disabled="true"` rather than removing it from the tab order
- Label/bg contrast ≥ 4.5:1 in every variant

## Status
`draft`
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

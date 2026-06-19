# SearchField

> Search input with an icon and clear button — used for filtering content within screens.

## When to use / when not to use
- ✅ Use when the user needs to search or filter a list, channel, or contact
- ✅ Use inside a screen header or modal as a standalone search control
- ❌ Don't use for multi-field forms — use a plain input atom instead
- ❌ Don't use when search results are instantaneous and no loading state is needed (use S size without progressing)

## Anatomy
```
[ icon ] [ value / placeholder ] [ cancel ]
```
- **icon** — 24×24px search icon (placeholder/focused/typed) or loader (progressing)
- **value** — Body/Large text; placeholder at 48% opacity, active text at 87%
- **caret** — `|` character indicating focus/typing state
- **cancel** — 24×24px button; clears the field; visible on typed, progressing (+ M focused)

## Variants
| Variant | Description |
|---|---|
| S | `py: 4px`, `border-radius: 20px` — compact, for embedded search bars |
| M | `py: 10px`, `border-radius: 25px` — prominent, for full-screen search headers |

## States
| State | Description |
|---|---|
| placeholder | 1px border primary-24; search icon; placeholder text primary-48 |
| focused | 1.5px border primary-87; search icon; caret only; cancel on M |
| typed | 1.5px border primary-87; search icon; typed text + caret + cancel |
| progressing | 1.5px border primary-87; loader icon; typed text + caret + cancel |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-constant-primary` | Field background |
| `--color-primary-transparent-24` | Default (placeholder) border |
| `--color-primary-transparent-48` | Placeholder text color |
| `--color-primary-transparent-87` | Active border, typed text, caret |
| `--text-body-large-*` | All text inside the field |

## Do / Don't
✅ **Do** — switch to `--progressing` while an async search request is in flight  
❌ **Don't** — show the cancel button in placeholder state; it should appear only when the field has content or is focused (M)

## Accessibility
- Minimum touch target: 44×44pt (cancel button is 24px — pad hit area in production)
- Field should be a real `<input type="search">` or `<input type="text">` in production
- `aria-label="Search"` on the input; `aria-label="Clear search"` on cancel button
- Contrast: placeholder (48% on white) passes WCAG AA Large Text; active text (87%) passes AA

## Status
`draft`  
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

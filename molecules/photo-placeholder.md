# PhotoPlaceholder

> Gallery grid cell — a photo or video tile with multi-select checkbox, plus the "add media" tile that opens the camera.

## When to use / when not to use
- ✅ In the attachment gallery grid when composing a message
- ✅ addMedia — always the first cell of the grid, opens the camera/picker
- ❌ Don't use it to display received media inside a chat — that's the Message/Gallery components
- ❌ Don't show checkboxes outside multi-select mode

## Anatomy
- **container** — 134×134px, radius 4px, bg primary-16
- **checkbox** — 24×24px, top-right 8px — photo & video only
- **chip** — duration label, pad 8/4, radius 60px, bottom-right 8px — video only
- **camera icon** — 32×32px, centered — addMedia only

## Variants
| Variant | Description |
|---|---|
| photo | Checkbox top-right, no chip |
| video | Checkbox top-right + duration chip bottom-right |
| addMedia | Camera icon centered, no checkbox |

## States
| State | Description |
|---|---|
| unchecked | Circle stroke · primary-transparent-32 |
| checked | Yellow fill + white checkmark |
| ⚠️ State missing: loading | Not defined in Figma. Suggested: dimmed tile with progress ring while the thumbnail loads. Confirm or describe. |
| ⚠️ State missing: error | Not defined in Figma. Suggested: bg primary-16 with a retry icon when the thumbnail fails. Confirm or describe. |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-primary-transparent-16` | Tile bg |
| `--color-primary-transparent-32` | Checkbox stroke (unchecked) |
| `--color-brand-yellow-secondary` | Checkbox fill (checked) |
| `--color-constant-transparent-60` | Duration chip bg |
| `--text-label-medium-*` | Duration label |

## Do / Don't
✅ **Do** — keep the checkbox hit area a full 44pt even though it draws at 24px
❌ **Don't** — crop the duration chip with long values; it grows leftwards

## Accessibility
- Minimum touch target: 44×44pt per tile; checkbox has its own 44pt hit area
- Tile: `role="checkbox"` + `aria-checked` in multi-select; addMedia: `role="button"`, label "Add photo or video"
- Video duration is part of the accessible name ("Video, 0:32")

## Status
`draft`
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

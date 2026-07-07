# CellLinks

> Cell variant for displaying a saved web link: preview thumbnail (favicon letter or photo) + title, optional subtitle, and underlined URL.

## When to use / when not to use
- ✅ Use when displaying a list of saved or shared web links
- ✅ Use when the link has a known domain initial or a photo preview available
- ❌ Don't use for internal navigation — use CellCategory or CellSubchannel instead
- ❌ Don't use when no URL is present — the underlined link is a required element

## Anatomy
- **container** — CellBase shell; no divider
- **preview** — 40×40px rounded square (radius 8px), in the left slot; contains either favicon or photo
- **favicon** — `--color-primary-transparent-16` background + capital letter in `text-title-medium`, color `--color-primary-transparent-60`
- **photo** — `<img>` with `object-fit: cover`, fills the 40×40 container
- **title** — CellBase primary text slot; `text-body-large` via CellBase
- **subtitle** — CellBase secondary text slot (Row 3 only); `text-body-medium` via CellBase
- **link** — underlined URL text; `text-link-medium`, color `--color-primary-transparent-87`
- **right slot** — empty 24px spacer (Row 3 only; absent in Row 2)

## Composition (Reuse → Compose → Create)
- **CellBase** — molecule, structural shell for all 4 variants; reused
- **Only new** — `.cell-links__preview`, `.cell-links__favicon`, `.cell-links__favicon-letter`, `.cell-links__photo`, `.cell-links__link`

## Variants
| Variant | Description |
|---|---|
| Row 3 · Favicon | xlarge CellBase, row-3, letter preview, title + subtitle + link |
| Row 3 · Photo | xlarge CellBase, row-3, image preview, title + subtitle + link |
| Row 2 · Favicon | medium CellBase, letter preview, title + link |
| Row 2 · Photo | medium CellBase, image preview, title + link |

## States
| State | Description |
|---|---|
| default | Static display, no interactive states |
| ⚠️ pressed/hover | Not defined in Figma. Suggested: `--color-primary-transparent-08` background tint. Confirm or describe. |
| ⚠️ loading (skeleton) | Not defined in Figma. Suggested: grey shimmer replacing preview + text. Confirm or describe. |

## Tokens
| Token | Role |
|---|---|
| `--color-primary-transparent-16` | Favicon background |
| `--color-primary-transparent-60` | Favicon letter color |
| `--color-primary-transparent-87` | Link text color |
| `--text-title-medium-*` | Favicon letter typography |
| `--text-link-medium-*` | URL link typography |

> ⚠️ Preview border-radius is currently **8px** (assumed). Verify against Figma node 2680-49895.

## Do / Don't
✅ **Do** — always include the underlined link element; it is the defining element of this cell
✅ **Do** — use `object-fit: cover` so photo thumbnails fill the 40×40 slot cleanly
✅ **Do** — use Row 2 when there is no meaningful subtitle
❌ **Don't** — add a divider; Figma shows none for this cell variant
❌ **Don't** — use raster favicons directly — prefer a letter placeholder until favicon loading is implemented

## Accessibility
- Minimum touch target: 44pt — ensured by CellBase height
- The `.cell-links__link` element should be an `<a>` in production with `href` and `aria-label` describing the destination
- Contrast: `--color-primary-transparent-87` on `--color-constant-primary` — verify 4.5:1

## Status
`draft`
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

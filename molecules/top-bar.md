# TopBar

> Top navigation bar — displays screen context, a back button, and right-side actions.

## When to use / when not to use
- ✅ Use on every screen that has a parent — always include the back button
- ✅ Use `direct` / `channel` type when the screen is a conversation
- ✅ Use `search` type to replace the title with a search field
- ❌ Don't omit the back button on secondary screens — `onlyArrow` is only for edge cases like modals
- ❌ Don't mix centered and left title in the same navigation flow

## Anatomy
```
┌──────────────────────────────────────────────────┐  ← top-bar · 412px · h:56px · p:4px · gap:8px
│  [←]  [avatar]  Title                  [Action] │
└──────────────────────────────────────────────────┘
```

- **top-bar** — 412px wide, `h: 56px`, `background: brand-red-secondary`, `padding: 4px`, `gap: 8px`
- **back** — 48×48px button, `arrow-back.svg` white (filter invert), `border-radius: 100px`
- **body** — `flex: 1`, contains optional avatar + title
- **avatar** — `avatar--sm` (32×32px circle) for direct; `avatar--sm avatar--channel` (rounded square) for channel
- **title** — `top-bar__title`: `title-large` 22px/500 for regular/medium types; `top-bar__title--md`: `title-medium` 16px/500/0.15px for direct/channel types
- **channel-name** — title + chevron (`arrow-down.svg`) in a row, `gap: 4px`
- **right** — `icon-btn` 48×48px; `text-btn` px:12px h:48px; or 2 × `icon-btn` with `gap: 6px`
- **search** — reuses `.search-field` with `flex: 1; width: auto; border-color: transparent`

## Variants
| type | title | right | arrowBack | padding-right | Description |
|---|---|---|---|---|---|
| regular | left | button | ✅ | 4px | Standard screen, text button right |
| regular | left | icon | ✅ | 4px | Standard screen, icon right |
| onlyArrow | — | — | ✅ | 4px | Back button only, transparent bg |
| regular | medium | 2icon | ✅ | 4px | Centered title, two icons |
| regular | medium | icon | ✅ | 4px | Centered title, one icon |
| regular | left | icon | ❌ | 4px | No back, title left, icon right |
| search | no | no | ✅ | 16px | SearchField replaces title |
| direct | left | icon | ✅ | 12px | DM — round avatar + title-medium + pin |
| channel | left | icon+av | ✅ | 12px | Channel — square avatar + title-medium + chevron + pin + avatar |

## States
| State | Description |
|---|---|
| default | Red background, all elements white |
| onlyArrow | Transparent background, icon in primary color (not white) |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-brand-red-secondary` | Background |
| `--color-constant-primary` | Icons, text, buttons (white) |
| `--text-title-large-*` | Title: regular and medium types (22px / 500) |
| `--text-title-medium-*` | Title: direct and channel types (16px / 500 / 0.15px) |
| `--text-body-large-*` | SearchField placeholder |

## Do / Don't
✅ **Do** — use `filter: brightness(0) invert(1)` on all icons against the red background  
✅ **Do** — use `.top-bar__title--md` (16px) for `direct` and `channel` types  
❌ **Don't** — use `.top-bar__title` (22px) for `direct`/`channel` — titles there are smaller per Figma  
❌ **Don't** — hardcode `#ffffff` — use `--color-constant-primary`

## Accessibility
- Minimum touch target: 44×44pt (back and icon-btn are 48px — meets requirement)
- `aria-label="Back"` on the back button is required
- Each `icon-btn` needs `aria-label` (e.g. "Edit", "Search", "Pin")
- In `search` type: use a real `<input type="search">` — already done via the SearchField molecule
- Avatar: `aria-label="[Name]"` on the avatar div

## Status
`draft`  
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

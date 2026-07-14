# SwipeTabItem

> A switcher in the horizontal swipe navigation — shows the channel name, unread counter, and active-tab indicator.

## When to use / when not to use
- ✅ Use when presenting a horizontal list of switchable channels/sections (chats, groups, etc.)
- ✅ Use with NotificationCounter to display unread message counts
- ❌ Don't use for vertical navigation or standalone actions
- ❌ Don't use more than ~5–6 items in a single row without scrolling support

## Anatomy
Button → [Label] [Badge?] → [Indicator bar?]

- **Container** — `button`, full-unset, `inline-flex`, `flex-direction: column`, `padding: 12px`
- **Header row** — `flex-direction: row`, `gap: 4px` — wraps label + optional badge
- **Label** — channel name; Body/Large when inactive, Title/Medium when active
- **Badge** — NotificationCounter atom (yellow pill); shown only when count > 0
- **Indicator bar** — `height: 5px`, `border-radius: 3px 3px 0 0`, flush to bottom edge; gap `7px` (no badge) / `5px` (with badge); visible only on active tab
- **Add button** — special `type-add` variant using `icons/general/add-circle.svg` 24×24; no label or indicator

## Variants
| Variant | Description |
|---|---|
| Inactive + badge | Label + NotificationCounter, row layout, `width: 104px` |
| Active | Bold label (Title/Medium) + indicator bar, `padding-bottom: 0` |
| Add | `add-circle.svg` icon only, `flex-direction: row`, `padding: 10px` |
| Active + badge | Header row (label + badge) + indicator, `width: 103px` |
| Inactive | Label only, Body/Large weight, no indicator |

## States
| State | Description |
|---|---|
| Enabled | Default resting state |
| Pressed (dark) | Background → `--color-brand-red-primary` |
| Pressed (light) | Background → `--color-constant-transparent-60` |

⚠️ State missing: **Disabled**. Not defined in Figma. Suggested alternative: `opacity: 0.38`, `pointer-events: none`. Confirm or describe what you want.

## Tokens
| Token | Role in this component |
|---|---|
| `--color-brand-red-secondary` | Dark theme background (enabled) |
| `--color-brand-red-primary` | Dark theme background (pressed) |
| `--color-constant-transparent-60` | Light theme background (pressed) |
| `--color-constant-primary` | Indicator bar (dark); active label (dark) |
| `--color-constant-transparent-87` | Inactive label (dark) |
| `--color-primary-transparent-87` | Indicator bar (light); label (light) |
| `--text-body-large-*` | Inactive label typography |
| `--text-title-medium-*` | Active label typography |

## Do / Don't
✅ **Do** — set `padding-bottom: 0` on active tab so the indicator sits flush to the container edge  
❌ **Don't** — show the indicator on inactive tabs  
✅ **Do** — use `icons/general/add-circle.svg` for the add button — do not hand-draw it in CSS  
❌ **Don't** — use this component outside of a horizontal scrolling tab bar

## Accessibility
- Minimum touch target: 44×44pt — ensure container height ≥ 44px
- Use `role="tab"` on the button; wrap the tab bar in `role="tablist"`
- `aria-selected="true/false"` on the active/inactive tab
- Add button: `aria-label="Add tab"` since it has no visible label

## Status
`draft`
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

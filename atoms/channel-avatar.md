# ChannelAvatar

> Channel, folder, or direct-chat icon with a visual activity status — displayed in the sidebar navigation.

## When to use / when not to use
- ✅ Use in the sidebar list of channels, folders, and direct messages
- ❌ Don't use in place of Avatar for individual users

## Anatomy
- **channel-avatar** — `<span>` 48×48px (52px tall for the live variant)
- **img** — `.channel-avatar__img`; Figma SVG export; shape and status are baked into the file

## Variants (types)
| Type | Shape |
|---|---|
| channel | Squircle border-radius 12px |
| folder | Tab shape (body + top protrusion) |
| direct | Circle |

## States
| State | Description |
|---|---|
| regular | Neutral display |
| not active | Muted colours |
| active | Highlighted accent |
| live | 48×52px; Live chip baked into the SVG |

## Tokens
Colours are baked into the Figma SVG files; CSS tokens are not used directly in this component.

## Assets
`assets/channel-avatar/{type}-{status}.svg` — 12 files (3 types × 4 states).

## Do / Don't
✅ **Do** — use the SVG file that matches the exact type × state matrix; do not override size via CSS  
❌ **Don't** — edit colours inside the SVG manually; update only through a Figma re-export

## Accessibility
- `alt` on `.channel-avatar__img` describes type and status: `"Channel avatar, live"`
- 48×48px meets the minimum touch target requirement

## Status
`draft`  
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

# Gallery

> 189×189px media content card composed of the VideoChip atom and library icons.

## When to use / when not to use
- ✅ Use when displaying gallery items (photos/videos) in a grid
- ✅ Use when you need to show download, loading, playing, or hidden-content states
- ❌ Don't use when you need a document or message preview — use PreviewDocChat instead

## Anatomy
- **container** — 189×189px, border-radius 8px, bg `--color-primary-transparent-16`
- **overlay** — absolute dark layer rgba(0,0,0,0.4) + backdrop-filter blur 2px (download/loading/more)
- **chip** — VideoChip atom; centered (download/loading/regular) or bottom-right 8px (playing)
- **icon** — 32×32px, centered (image/download and image/loading)
- **more-label** — Headline/Medium, white, centered (more/regular)

## Atoms reused
| Atom | Variant | Usage |
|---|---|---|
| VideoChip | chip--not-loaded | video/download |
| VideoChip | chip--loading | video/loading |
| VideoChip | chip--regular | video/regular |
| VideoChip | chip--playing | video/playing |
| Icon | download.svg (icons/general) | image/download |
| Icon | chip-ic-loading.svg (assets) | image/loading |

## Variants
| Variant | Description |
|---|---|
| video/download | Overlay + chip not-loaded centered |
| video/loading | Overlay + chip loading centered |
| video/regular | Chip regular centered, no overlay |
| video/playing | Chip playing, bottom-right 8px, no overlay |
| image/download | Overlay + download icon centered |
| image/loading | Overlay + spinner centered |
| image/regular | Clean card, no overlay |
| more/regular | Overlay + "+N" text centered |

## States
| State | Description |
|---|---|
| download | Content not loaded; download available |
| loading | Download or processing in progress |
| regular | Content ready, not playing |
| playing | Video is actively playing |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-primary-transparent-16` | Container background (placeholder) |
| `--color-constant-primary` | "+N" text color in more/regular |
| `--text-headline-medium-*` | Typography for "+N" label |

## Do / Don't
✅ **Do** — reuse the VideoChip atom for all chip variants; do not create a new one  
❌ **Don't** — change the card size arbitrarily; 189×189px is the fixed size from the design

## Accessibility
- Minimum touch target: 44×44pt
- `role="img"` on the container with `aria-label` describing the content
- Loading state: `aria-busy="true"`
- Overlay must not block focus — interactive elements inside must remain reachable

## Status
`draft`
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

# Statusbar

> System status bar displayed at the top of each screen — shows the time, Wi-Fi, signal, and battery.

## When to use / when not to use
- ✅ Use as the topmost element on every full-screen view (above TopBar, if present)
- ✅ Use `red` variant on screens with a red background (TopBar, splash screens)
- ✅ Use `light` variant on white/light-background screens
- ❌ Don't place inside scroll containers — it must always stay at the top

## Anatomy
```
┌─────────────────────────────────────┐  ← statusbar · 412px · h:50px · px:24px · py:10px
│  9:30              [wifi][sig][bat] │
└─────────────────────────────────────┘
```

- **statusbar** — 412px wide, `h: 50px`, `align-items: flex-end`, `padding: 10px 24px`
- **time** — `flex: 1`, `label-large` 14px/500, `line-height: 20px`, `letter-spacing: 0.14px`
- **icons** — `46×17px` container, three absolutely positioned SVG images

## Variants
| Variant | Description |
|---|---|
| red | Default — red background, white text + white icons |
| light | `.statusbar--light` — transparent bg, dark text + dark icons |

## States
| State | Description |
|---|---|
| red | `background: --color-brand-red-secondary`, icons: `*-white.svg` |
| light | `background: transparent`, icons: `*-dark.svg` |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-brand-red-secondary` | Background (red variant) |
| `--color-constant-primary` | Time text color (red variant) |
| `--color-primary-transparent-87` | Time text color (light variant) |
| `--text-label-large-*` | Time typography |

## Do / Don't
✅ **Do** — swap both the icon set (`*-white` ↔ `*-dark`) and the text color when switching variants  
❌ **Don't** — use white icons on the light variant — they won't be readable on light backgrounds

## Accessibility
- Minimum touch target: n/a — Statusbar is display-only, no interactive elements
- Time text is decorative context; no `aria-label` required
- Icons: `aria-hidden="true"` on the icons container (already in markup)
- Contrast: white text on red (`--color-brand-red-secondary`) — verify WCAG AA in final brand palette

## Status
`draft`  
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

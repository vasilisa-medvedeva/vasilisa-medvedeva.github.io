# Tabs

> Bottom navigation bar — switches between 4 app sections via icon buttons.

## When to use / when not to use
- ✅ Use as the primary bottom navigation in screens with 4 top-level sections
- ✅ Use with the home indicator pill on screens that sit above the iOS home bar
- ❌ Don't use more than one Tabs bar per screen
- ❌ Don't put more than 4 tabs — icon targets become too small

## Anatomy
```
┌─────────────────────────────────────┐  ← tab-bar (318px · yellow-8 · border-top primary-16 0.5px)
│  [ icon ] [ icon ] [ icon ] [ icon ]│  ← tab-bar__tabs / tab-bar__tab-btn × 4
├─────────────────────────────────────┤
│           ▬ (pill)                  │  ← tab-bar__indicator (optional)
└─────────────────────────────────────┘
```

- **tab-bar** — 318px wide, `background: brand-yellow-8`, `border-top: 0.5px primary-transparent-16`
- **tab-btn** — `flex: 1`, height 48px, icon 24×24px; `aria-current="page"` on active
- **tab-icon** — SVG from `icons/tabbar/`; switches between `*-default.svg` and `*-active.svg`
- **indicator** — centred pill `72×2px`, `primary-transparent-87`; omit on screens without home bar

## Variants
| Variant | Description |
|---|---|
| tabs | 4 icon buttons, no indicator |
| tabs + indicator | 4 icon buttons + home indicator pill |

## States
| State | Description |
|---|---|
| default | icon `*-default.svg` |
| active | icon `*-active.svg` (filled) · `aria-current="page"` on button |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-brand-yellow-8` | Component background |
| `--color-primary-transparent-16` | Top border |
| `--color-primary-transparent-87` | Home indicator pill |

## Do / Don't
✅ **Do** — set `aria-current="page"` on the active `tab-btn` and update it on navigation  
❌ **Don't** — hardcode `tab-btn` width; use `flex: 1` so buttons distribute evenly at any bar width

## Accessibility
- Minimum touch target: 44×44pt (tab-btn is 48px height × 25% width — meets requirement)
- Each `tab-bar__tab-btn` requires `aria-label="[Section name]"`
- Active tab: `aria-current="page"` on the button
- Icon images: `alt=""` (decorative); label comes from `aria-label` on the button

## Status
`draft`  
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

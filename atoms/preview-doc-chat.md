# PreviewDocChat

> A 56×56px attachment thumbnail used in chat message bubbles, supporting photo, video, and document types across three download states.

## When to use / when not to use
- ✅ Use inside chat message bubbles to represent an attached file
- ✅ Use when the attachment has a download state (not yet loaded, loading, ready)
- ❌ Don't use in chat list rows — use Preview (40×40px) instead
- ❌ Don't use as a standalone media viewer

## Anatomy

```
┌────────────────────┐
│                    │
│  [thumb / doc-bg]  │  ← 56×56px, r 8px
│  [overlay]         │  ← rgba(0,0,0,0.2) + blur 2px (states only)
│     [icon]         │  ← 32×32px centered, z-index 1
│                    │
└────────────────────┘
```

- **Container** — 56×56px, `border-radius: 8px`, `overflow: hidden`, `position: relative`
- **Thumb** — `object-fit: cover`, fills 100% (photo / video types)
- **Doc background** — `--color-info-primary` fill with corner fold (`--color-info-secondary`); label uses `--text-title-medium`
- **Overlay** — `rgba(0,0,0,0.2)` + `backdrop-filter: blur(2px)`; shown in Not loaded and Loading states
- **Icon** — 32×32px SVG from Media icon set, absolutely centered, `z-index: 1`
  - Regular video → `assets/chip-ic-play.svg`
  - Not loaded → `assets/chip-ic-download.svg`
  - Loading → `assets/chip-ic-loading.svg`

## Variants

| Variant | Description |
|---|---|
| photo | Thumbnail image |
| video | Thumbnail image + play icon (regular state only) |
| doc | Blue background + corner fold + filename label |

## States

| State | Description |
|---|---|
| Regular | No overlay; play icon on video type |
| Not loaded | Overlay + download icon centered |
| Loading | Overlay + close-loading icon centered |

## Tokens

| Token | Role in this component |
|---|---|
| `--color-info-primary` | Doc background fill |
| `--color-info-secondary` | Doc corner fold |
| `--color-constant-primary` | Doc label text color |
| `--text-title-medium-*` | Doc label (16/20, weight 500) |

## Do / Don't

✅ **Do** — always use icons from the Media section of the icon library  
✅ **Do** — apply overlay before the icon so the icon stays on top  
❌ **Don't** — animate the loading icon (static per design spec)  
❌ **Don't** — use hardcoded overlay color; keep `rgba(0,0,0,0.2)` as defined

## Accessibility

- Minimum touch target: 44×44pt — add tap padding in the parent container
- `role="button"` with `aria-label` describing the action and file type, e.g. `"Download photo"`
- Loading state: `aria-label="Cancel download"`
- Verify icon visibility against the blurred overlay

## Status

`draft`
Version 1.0 | Owner: @...

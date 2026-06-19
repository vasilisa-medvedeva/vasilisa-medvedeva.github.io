# Preview

> A small 40×40px thumbnail used in chat message rows to represent photo, video, or document attachments.

## When to use / when not to use
- ✅ Use in chat message lists as a compact attachment preview
- ✅ Use when space is constrained and a small visual hint is sufficient
- ❌ Don't use as a full-size media viewer
- ❌ Don't use in contexts where the user needs to see file details

## Anatomy

```
┌──────────────┐
│              │
│  [thumb/bg]  │  ← 40×40px, r 8px
│   [icon]     │  ← 32×32px centered (video only)
│              │
└──────────────┘
```

- **Container** — 40×40px, `border-radius: 8px`, `overflow: hidden`
- **Thumb** — `object-fit: cover`, fills 100% of container (photo/video types)
- **Play icon** — 32×32px SVG centered absolutely (video type only); uses `assets/chip-ic-play.svg` from Media icon set
- **Doc background** — `--color-info-primary` fill with corner fold (`--color-info-secondary`)
- **Doc label** — filename/extension text, `--text-title-small` (14px / 18px, weight 500)

## Variants

| Variant | Description |
|---|---|
| photo | Thumbnail image only |
| video | Thumbnail image + centered play icon |
| doc | Blue background + corner fold + filename label |

## States

| State | Description |
|---|---|
| Default | Base appearance |

## Tokens

| Token | Role in this component |
|---|---|
| `--color-info-primary` | Doc background fill |
| `--color-info-secondary` | Doc corner fold |
| `--color-constant-primary` | Doc label text color |
| `--text-title-small-*` | Doc label (14/18, weight 500) |

## Do / Don't

✅ **Do** — use `object-fit: cover` so thumbnails never stretch or distort  
✅ **Do** — use `assets/chip-ic-play.svg` from the Media icon set for the video play icon  
❌ **Don't** — use hardcoded colors or font values; reference tokens only  
❌ **Don't** — show the play icon on photo or doc variants

## Accessibility

- Minimum touch target: 44×44pt — wrap in a container with added tap padding if used as a button
- `alt=""` on decorative thumbnails; use descriptive `alt` if the image conveys meaning
- Verify contrast of doc label against `--color-info-primary` background

## Status

`draft`
Version 1.0 | Owner: @...

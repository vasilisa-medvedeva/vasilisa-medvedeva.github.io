# VideoChip

> A compact media overlay chip that displays video status, duration, and file size — used exclusively on video thumbnails in the gallery.

## When to use / when not to use
- ✅ Use as an overlay on video previews in the gallery
- ✅ Use to communicate the download/playback status of a video file

## Anatomy

```
┌──────────────────────────────────────────┐
│ 4px                                      │
│ ┌────────┐  4px  duration          8px   │
│ │ icon   │───────filesize                │
│ │ 32×32  │                              │
│ └────────┘                              │
│ 4px                                      │
└──────────────────────────────────────────┘
```

- **Container** — pill shape, `border-radius: 60px`, padding `4px 8px 4px 4px`; gap between icon and text `4px`
- **Playing variant** — no icon, padding `4px 8px` (equal horizontal)
- **Icon** — 32×32px SVG with built-in white circle (`fill-opacity: 0.6`); rendered at 32×32px
- **Duration** — `--text-label-medium` (12px / 14px, weight 500), e.g. "0:32"
- **Filesize** — `--text-body-small` (12px / 12px, weight 400), e.g. "102.6 MB"

## Variants

| Variant | Icon | Description |
|---|---|---|
| Regular | Play | Video is ready to play |
| Not loaded | Download | File is not yet downloaded |
| Loading | Cancel / Spinner | Download in progress, tap to cancel |
| Playing | — | Video is actively playing, no icon shown |

## States

| State | Description |
|---|---|
| Default | Base appearance |
| Hover | Background darkens to `transparent-16` |
| Pressed | Background darkens to `transparent-24` |
| Disabled | opacity 0.38, non-interactive |
| Error | Download failed — error icon + "Failed" label, icon in `--color-warning-primary` |

## Tokens

| Token | Role in this component |
|---|---|
| `--color-primary-transparent-08` | Container background (default) |
| `--color-primary-transparent-16` | Container background (hover) |
| `--color-primary-transparent-24` | Container background (pressed) |
| `--color-primary-transparent-87` | Label text color |
| `--color-warning-primary` | Icon color in Error state |
| `--text-label-medium-*` | Duration label (12/14, weight 500) |
| `--text-body-small-*` | Filesize label (12/12, weight 400) |

## Do / Don't

✅ **Do** — always show both duration and filesize together; they give the user context for the action  
✅ **Do** — use glyph-only SVG icons (no embedded circle) — the white circle comes from the container  
❌ **Don't** — don't omit the icon except in the Playing variant

## Accessibility

- Minimum touch target: 44×44pt — the chip is 32px tall, so the tap area container must add vertical padding to reach 44px
- `role="button"` with descriptive `aria-label` that includes the action, duration, and size: `"Play video, 0:32, 102.6 MB"`
- Loading state: `aria-label="Cancel download"`
- Error state: `aria-label="Download failed. Tap to retry"`
- Verify text contrast against the dark video thumbnail background

## Status

`draft`
Version 1.0 | Owner: @...

# Allocation

> A horizontal span marker that highlights an allocated range, with primary-blue end caps and two diagonal handle dots.

## When to use / when not to use
- ✅ Use to mark an allocated or selected span on a timeline, schedule, or progress track
- ✅ Use when the span has a clear start and end that the user may adjust
- ❌ Don't use as a progress bar with a single fill — use a dedicated progress component
- ❌ Don't use for static dividers or separators

## Anatomy
- **bar** — 50×18 container filled with `--color-info-transparent-24` (the allocated region)
- **cap** — 1px vertical line at the left and right edges, `--color-info-primary` (span boundaries)
- **handle** — 7px circle, `--color-info-primary`; `start` sits at the top-left, `end` at the bottom-right (diagonal drag anchors)

```
 ●────────────────┐   ← start handle (top-left) + left cap
 │░░░░░░░░░░░░░░░░░│   ← transparent-24 bar
 └────────────────●   ← right cap + end handle (bottom-right)
```

## Variants
| Variant | Description |
|---|---|
| default | Single span with both caps and both diagonal handles |

## States
| State | Description |
|---|---|
| default | Static span as shown |
| ⚠️ dragging | Not defined in Figma. Suggested: handle enlarges / gains halo while being moved. Confirm or describe. |
| ⚠️ disabled | Not defined in Figma. Suggested: caps + handles dimmed, no drag. Confirm or describe. |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-info-transparent-24` | Bar fill |
| `--color-info-primary` | Left/right caps and both handles |

## Do / Don't
✅ **Do** — keep the handles on opposite diagonal corners (start top-left, end bottom-right)
✅ **Do** — let the bar stretch in width to match the allocated duration
❌ **Don't** — hardcode the blue values; always use `--color-info-*` tokens
❌ **Don't** — remove a cap or handle — both ends must remain identifiable

## Accessibility
- If interactive, expose as a slider/range with `role="slider"`, `aria-valuemin/max/now` per handle
- Handles are 7px visually — provide a ≥44×44pt hit area around each for touch
- Contrast: caps/handles `--color-info-primary` on `--color-info-transparent-24` — verify against background

## Status
`draft`
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

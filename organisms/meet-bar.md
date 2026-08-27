# MeetBar

> Persistent bar pinned under the TopBar while a meet is live in the channel — device toggles on the left, join/exit on the right.

## When to use / when not to use
- ✅ Pinned under the TopBar of a channel for the whole duration of a live meet
- ❌ Don't stack it with other bars; one MeetBar per screen
- ❌ Don't keep it on screen after the meet ends — it disappears with the meet

## Anatomy
- **container** — 360px, pad 8×16, bottom border 1.5px, bg brand-yellow-8
- **ButtonIcon ×2** — reused atom · voice + video toggles
- **title + subtitle** — title-medium + body-medium, centered
- **Button** — reused atom · size sm · JOIN (primary) or EXIT (accent)

## Variants
| Variant | Description |
|---|---|
| join | Button primary "JOIN" — meet available, user not in it |
| exit | Button accent "EXIT" — user has joined |

## States
| State | Description |
|---|---|
| default | Per variant above |
| ⚠️ State missing: connecting | Not defined in Figma. Suggested: Button switches to its Process state (spinner) between tap and joined. Confirm or describe. |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-brand-yellow-8` | Bar bg |
| `--color-brand-yellow-primary` | JOIN button bg |
| `--color-brand-red-quaternary` | EXIT button bg |
| `--color-primary-transparent-87` | Title · borders |
| `--color-primary-transparent-60` | Subtitle |
| `--text-title-medium-*` | Title |
| `--text-body-medium-*` | Subtitle |

## Do / Don't
✅ **Do** — let the device toggles work before joining, so people enter with mic/camera set the way they want
❌ **Don't** — swap JOIN/EXIT positions between variants; the action stays in one place

## Accessibility
- Minimum touch target: 44×44pt for every control
- The bar is a `role="region"` labeled with the meet title
- State changes (joined / left) announced via `aria-live="polite"`

## Status
`draft`
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

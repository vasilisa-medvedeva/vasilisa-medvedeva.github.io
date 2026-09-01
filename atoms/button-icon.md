# ButtonIcon

> Round icon-only toggle for meet controls — microphone and camera on/off.

## When to use / when not to use
- ✅ Toggling a device (mic, camera) inside a meet — in MeetBar or the call screen
- ❌ Don't use for actions that need a text label — use Button
- ❌ Don't use as a generic icon button outside meet controls; its on/off semantics are baked in

## Anatomy
- **container** — 40×40px circle, radius 30px, border 1.5px
- **icon** — 24×24px from `icons/general` (icon.meet set)

## Variants
| Variant | Description |
|---|---|
| voice | Mic icon (off / on) |
| video | Camera icon (off / on) |

## States
| State | Description |
|---|---|
| inactive | bg constant-primary · slashed icon — device is off |
| active | bg brand-yellow-primary · filled icon — device is on |
| ⚠️ State missing: pressed | Not defined in Figma. Suggested: bg dims one step while held. Confirm or describe. |
| ⚠️ State missing: disabled | Not defined in Figma. Suggested: 38% opacity, no interaction (e.g. no camera permission). Confirm or describe. |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-constant-primary` | Inactive bg |
| `--color-brand-yellow-primary` | Active bg |
| `--color-primary-transparent-87` | Border and icon |

## Do / Don't
✅ **Do** — keep the slashed icon for "off": color alone must not carry the state
❌ **Don't** — invert the mapping; yellow always means the device is live

## Accessibility
- Minimum touch target: 44×44pt
- `role="switch"` with `aria-checked` reflecting on/off
- `aria-label` names the device: "Microphone", "Camera"

## Status
`draft`
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

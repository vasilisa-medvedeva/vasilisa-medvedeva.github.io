# Avatar

> Circular or square avatar with initials or a photo — identifies a user, channel, or subchannel.

## When to use / when not to use
- ✅ Use to display user or channel identity in lists, profiles, and chat headers
- ❌ Don't use for action icons or illustrations

## Anatomy
- **container** — `.avatar` with a size modifier; shape depends on type
- **initials** — `.avatar__initials`; 1–2 character text; hidden when a photo is present
- **photo** — `.avatar__photo`; covers the full container
- **live-chip** — `.avatar__live-chip`; "Live" badge at the bottom; live state only

## Variants (sizes)
| Class | Size |
|---|---|
| `avatar--xl` | 122×122px |
| `avatar--lg` | 72×72px |
| `avatar--md` | 48×48px |
| `avatar--sm` | 32×32px |

## Variants (types)
| Type | Description |
|---|---|
| direct | `border-radius: 50%` — for user avatars |
| channel | `avatar--channel` — rounded square — for channels |
| subchannel | Circle, 1 initial — for subchannels |

## States
| State | Description |
|---|---|
| regular | No modifier |
| active | `avatar--active` — yellow ring |
| not active | `avatar--not-active` — opacity 0.38 |
| live | `avatar--live` — red ring + Live chip |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-brand-yellow-16` | Initials background |
| `--color-primary-transparent-70` | Initials text color |
| `--color-brand-yellow-secondary` | Active ring |
| `--color-warning-secondary` | Live ring |
| `--text-headline-medium-*` | Initials typography |

## Do / Don't
✅ **Do** — always set `aria-label` with the user or channel name on the container  
❌ **Don't** — use `avatar--xl` in sidebars; it is intended for profile screens only

## Accessibility
- Minimum touch target: 44×44pt (sm is 32px — expand the hit area)
- `aria-label="Name"` on the `.avatar` container
- `aria-hidden="true"` on `.avatar__initials` and `.avatar__photo`

## Status
`draft`  
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

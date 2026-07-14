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
| `--color-brand-yellow-16` | Initials background (default) |
| `--color-brand-yellow-quaternary` | Initials text (default) — darker shade of the yellow-16 background |
| `--color-avatar-{green\|purple\|teal\|peach\|rose\|sky\|lime\|lavender\|mint\|indigo\|sand}` | Initials background (palette, by name hash) |
| `--color-avatar-{…}-text` | Initials text for the matching palette background — a darker shade of that color |
| `--color-brand-yellow-secondary` | Active ring |
| `--color-warning-secondary` | Live ring |
| `--text-headline-medium-*` | Initials typography |

**Initials color rule:** the initials text is always a **darker shade of the avatar's own background**, not neutral grey. The default yellow-16 avatar pairs with `--color-brand-yellow-quaternary`; each `--color-avatar-*` palette background pairs with its `--color-avatar-*-text` token. Never mix a background from one hue with text from another.

## Do / Don't
✅ **Do** — always set `aria-label` with the user or channel name on the container  
✅ **Do** — pair each palette background with its matching `-text` token so initials stay tonal  
❌ **Don't** — use `avatar--xl` in sidebars; it is intended for profile screens only  
❌ **Don't** — use neutral grey (`--color-primary-transparent-70`) for initials; it breaks the tonal pairing

## Accessibility
- Minimum touch target: 44×44pt (sm is 32px — expand the hit area)
- `aria-label="Name"` on the `.avatar` container
- `aria-hidden="true"` on `.avatar__initials` and `.avatar__photo`

## Status
`stable`  
Version 1.1 | Owner: @vasilisamedvedeva19940625-ui

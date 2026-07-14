# CardProfile

> A user profile card: avatar with initials, name, subtitle, privacy status, and bio.

## When to use / when not to use
- ✅ Use on profile screens as the main identity block
- ✅ Use in profile preview cards (e.g. in search results or friend suggestions)
- ❌ Don't use as a list item in a feed — too heavyweight for repetition

## Composition
| Layer | Element | Status |
|---|---|---|
| Atom | AvatarInitials | new — created here |
| Molecule | CardProfileText | reused from molecules/ |
| Icon | ic16_lock (via CardProfileText) | icons/small/lock.svg |

## Anatomy
- **card** — outer container: 380px wide, border-radius 20px, bg brand-yellow-4, border 0.5px primary-24, padding 24px 12px
- **container** — inner flex-col: height 240px, gap 12px, centered
- **ava slot** — flex: 1, centers the AvatarInitials atom
- **AvatarInitials** — 72×72px circle, bg brand-yellow-16, initials text Headline/Medium, color primary-70
- **CardProfileText** — molecule, 356px wide; handles title, subtitle, private badge, bio

## Variants
| Variant | Description |
|---|---|
| private + bio | Lock badge + biography shown |
| public + bio | Only biography shown |
| private, no bio | Only lock badge |
| public, no bio | Title + subtitle only |

## States
| State | Description |
|---|---|
| default | Static display block |

## Tokens
| Token | Role |
|---|---|
| `--color-brand-yellow-4` | Card background |
| `--color-brand-yellow-16` | AvatarInitials background |
| `--color-primary-transparent-24` | Card border |
| `--color-primary-transparent-70` | Initials text color |
| `--text-headline-medium-*` | Initials text style |

## Do / Don't
✅ **Do** — pass real initials (1–2 chars) from the user's display name  
❌ **Don't** — don't hardcode initials or text content in the component

## Accessibility
- `avatar-initials` has `aria-label` with the user's full name
- Initials `<span>` is `aria-hidden="true"` — meaning carried by aria-label
- CardProfileText private badge: lock icon is `aria-hidden`, "Private" text carries meaning

## Design Review
- ✅ **Structure** — Avatar atom + CardProfileText molecule → organism, no extra nesting
- ✅ **Reusability** — works on any profile screen, slots are replaceable
- ✅ **Consistency** — tokens only, reuses CardProfileText as-is
- ✅ **API** — initials, name, subtitle, private, bio are all configurable externally

## Status
`draft` — Version 1.0 | Owner: @vasilisa

# CardProfileText

> Text block for a user profile header: display name, handle, privacy status, and bio.

## When to use / when not to use
- ✅ Use when displaying a user profile header (name, handle, privacy, bio)
- ✅ Use in profile preview cards
- ❌ Don't use as a generic page title or heading outside profile context

## Anatomy
- **title** — display name (Title/Large, primary-87)
- **subtitle** — handle or tagline (Body/Medium, primary-60)
- **private** — ic16_lock icon + "Private" label (Body/Medium, primary-87); visible only when account is private
- **bio** — biography text (Body/Large, primary-87); optional

## Variants
| Variant | Description |
|---|---|
| private + bio | Closed account with biography |
| private, no bio | Closed account without biography |
| public + bio | Open account with biography |
| public, no bio | Open account with only title + subtitle |

## States
| State | Description |
|---|---|
| default | Static display block, no interactive states |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-primary-transparent-87` | title, private label |
| `--color-primary-transparent-60` | subtitle |
| `--text-title-large-*` | title style |
| `--text-body-medium-*` | subtitle and private label style |
| `--text-body-large-*` | bio style |

## Do / Don't
✅ **Do** — show bio only when the user has filled it in  
❌ **Don't** — don't make the entire block a single clickable target; individual parts may be links

## Accessibility
- Minimum touch target: 44×44pt (if the block becomes interactive)
- Lock icon: `aria-hidden="true"` — the label "Private" carries the meaning in text
- Title contrast meets AA on light backgrounds

## Status
`draft` — Version 1.0 | Owner: @vasilisa

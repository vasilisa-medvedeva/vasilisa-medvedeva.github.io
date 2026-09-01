# AvatarPlaceholder

> A gray placeholder avatar with a centered initial — used until a real photo loads. Distinct from the yellow Avatar atom.

## When to use / when not to use
- ✅ Use as a stand-in avatar (no photo yet) in chat, lists, channel messages.
- ❌ Don't use when a real avatar image is available — use the Avatar atom.

## Anatomy
```
.avatar-ph                 gray circle
└── .avatar-ph__initials   centered letter · primary/48
(area) .avatar-ph--area → 56px yellow/24 ring wrapping .avatar-ph__inner (24px circle)
```

## Variants / Sizes
| Variant | Size | Initial |
|---|---|---|
| `--s` | 24px | label-medium (12/14) |
| `--m` | 40px | title-medium (16/20) |
| `--s --area` | 24px in 56px ring | label-medium |

## States
| State | Description |
|---|---|
| Default | Static presentational element — no interactive states |

## Tokens
| Token | Role |
|---|---|
| `--color-primary-transparent-08` | Placeholder circle fill |
| `--color-primary-transparent-48` | Initial colour |
| `--color-brand-yellow-24` | Area (selection ring) background |
| `--text-label-medium-*` | S initial typography |
| `--text-title-medium-*` | M initial typography |

## Do / Don't
✅ **Do** — keep the initial to one uppercase letter, centered.
❌ **Don't** — recolor the circle or initial outside the tokens.

## Accessibility
- Provide an `aria-label` with the person's name on `.avatar-ph`; the initial is `aria-hidden`.

## Status
`draft`  
Version 0.1 | Owner: @medvedeva_vas

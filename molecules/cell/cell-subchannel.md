# CellSubchannel

> A sub-channel list row: avatar (with an optional lock), title (with an optional unread counter), menu button and drag handle on the right.

## When to use / when not to use
- ✅ Use inside a categorized channel list for a single subchannel row.
- ✅ Use `--message` when there are unread messages in the subchannel.
- ❌ Don't use for a top-level channel — use CellContact.
- ❌ Don't use for a user contact row — use CellContact (direct variant).

## Anatomy
```
.cell-subchannel  [--selected] [--message]   flex · gap 8px · pl 16 / pr 12
├── .cell-subchannel__avatar-wrap   position:relative · 32×32
│   ├── .avatar.avatar--sm          Avatar atom · circle · initials
│   └── .cell-subchannel__lock-badge  (lock) absolute bottom-right · 16×16 pill
├── .cell-subchannel__text          flex:1 · column · py 18px (16px if --message)
│   └── .cell-subchannel__title-row  flex · gap 4px · align center
│       ├── .cell-subchannel__title  Title/Medium · flex:1 (flex:0 if --message)
│       └── NotificationCounter--cell  (--message) red pill "2"
└── .cell-subchannel__right         (owner) flex · gap 16px
    ├── .cell-subchannel__menu      icons/small/menu.svg · 16px
    └── .cell-subchannel__move      icons/small/moving.svg · 16px
```

## Variants
| Prop | Default | Effect |
|---|---|---|
| `owner` | `true` | Shows menu + drag handle |
| `message` | `false` | Shows NotificationCounter; title shrinks to content width; reduces vertical padding to 16px |
| `lock` | `false` | Lock badge on avatar bottom-right corner |
| `state` | `regular` | `selected` → `brandYellow/16` row background; lock badge bg matches |

## States
| State | Token |
|---|---|
| regular | `--color-constant-primary` |
| selected (`--selected`) | `--color-brand-yellow-16` |

⚠️ Hover/pressed states are not defined in Figma — not implemented.

## Tokens
| Token | Role |
|---|---|
| `--text-title-medium-*` | Title — Roboto Medium 16/20 · 0.15 |
| `--color-primary-transparent-87` | Title colour |
| `--color-brand-yellow-16` | Selected row background |
| `--color-brand-yellow-4` | Lock badge background (regular) |
| `--color-brand-yellow-16` | Lock badge background (selected — blends with row) |

## Do / Don't
✅ **Do** — use `--message` modifier together with NotificationCounter; they control padding and title width together.
✅ **Do** — omit `.cell-subchannel__right` entirely when `owner=false`.
❌ **Don't** — show the lock badge outside `.cell-subchannel__avatar-wrap`; positioning is relative to the avatar.
❌ **Don't** — hardcode selected background; use `--selected` modifier class.

## Accessibility
- Minimum touch target: 44×44pt — row py 18px + avatar 32px = 68px, satisfies this.
- Avatar `.avatar` carries `aria-label` with the subchannel name; initials are `aria-hidden`.
- Lock badge is decorative — `aria-hidden="true"` on icon; add visually-hidden "(private)" text for screen readers.
- NotificationCounter uses `role="status"` and `aria-label="N new messages"`.

## Uses atoms / molecules
| Component | Role |
|---|---|
| Avatar | `avatar--sm` · circle · initials |
| NotificationCounter | `--cell` variant · red pill · unread count |
| icons/small/lock.svg | Lock badge · 16px |
| icons/small/menu.svg | Context menu trigger · 16px |
| icons/small/moving.svg | Drag handle (owner) · 16px |

## Status
`stable` — confirmed by the user.
Version 1.0 | Owner: @medvedeva_vas

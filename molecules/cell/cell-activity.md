# CellActivity

> An activity-feed cell: avatar on the left (optionally with an emoji reaction), title and subtitle. Built on the Avatar and EmojiBadge atoms.

## When to use / when not to use
- ✅ Use in an activity / notifications feed (who reacted, who read).
- ❌ Don't use for a contacts or chats list — use CellContact.
- ❌ Don't use for a menu action row — use CellMenu.

## Anatomy
```
.cell-activity                       flex row · h 56px · px 16px · gap 8px
├── .cell-activity__avatar           position:relative · 32px
│   ├── .avatar avatar--sm           Avatar atom · circle · initials
│   └── .cell-activity__emoji        EmojiBadge atom (sm) · overlay bottom-right
└── .cell-activity__text             flex:1
    ├── .cell-activity__title        Title/Medium
    └── .cell-activity__subtitle     Body/Medium (reacted / read only)
```

## Variants
| Variant | Subtitle | Emoji badge |
|---|---|---|
| `reacted` | ✅ | ✅ |
| `read` | ✅ | — |
| `emoji` | — | ✅ |

## States
| State | Description |
|---|---|
| Default | Static row — no interactive states defined in the design |

## Tokens
| Token | Role in this component |
|---|---|
| `--text-title-medium-*` | Title |
| `--text-body-medium-*` | Subtitle |
| `--color-primary-transparent-87` | Title colour |
| `--color-primary-transparent-60` | Subtitle colour |
| `--color-constant-primary` | Row background |
| (Avatar atom) | Left avatar shape, initials, size |
| (EmojiBadge atom) | Reaction badge overlay |

## Do / Don't
✅ **Do** — use the Avatar atom for the left element and EmojiBadge for the overlay.
✅ **Do** — keep the badge as a sibling of `.avatar` (avatar has `overflow:hidden`).
❌ **Don't** — add a subtitle to the `emoji` variant — it's title-only by design.

## Accessibility
- Render the row as a `<button>` / `<a>` if it navigates to the activity source.
- Avatar carries an `aria-label`; initials and emoji badge are `aria-hidden` (the row text conveys meaning).
- Minimum touch target: 44×44pt — the row is 56px tall, satisfying this.

## Uses atoms / molecules
| Component | Role |
|---|---|
| Avatar | sm · circle · initials |
| EmojiBadge | sm · reaction overlay (reacted / emoji) |

## Status
`draft`  
Version 0.1 | Owner: @medvedeva_vas

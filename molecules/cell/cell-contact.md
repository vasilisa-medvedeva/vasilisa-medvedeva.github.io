# CellContact

> Ячейка списка контактов/чатов: аватар слева, заголовок (+ опц. подзаголовок), справа — чеврон раскрытия или чекбокс выбора. Собрана на базе атома Avatar.

## When to use / when not to use
- ✅ Use in a contacts, chats, channels, or folders list.
- ✅ Use the `toggle` variant for multi-select (e.g. "add members").
- ❌ Don't use for a menu action row — use CellMenu.
- ❌ Don't use for a settings toggle row — use CellToggle.

## Anatomy
```
.cell-contact [--open] [--toggle]   flex row · h 56px · px 16px · gap 8px (16 if toggle)
├── .cell-contact__avatar   Avatar atom · sm (32px) · circle / channel / folder
├── .cell-contact__text     flex:1
│   ├── .cell-contact__title      Title/Medium
│   └── .cell-contact__subtitle   Body/Medium (channel/folder only)
└── right:
    ├── .cell-contact__chevron  arrow-right (closed) / arrow-down (open)   — channel/folder
    └── .toggle-cb              checkbox   — direct + toggle only
```

## Variants
| Variant | Avatar | Subtitle | Right |
|---|---|---|---|
| `direct` | circle | — | — |
| `direct · toggle` | circle | — | checkbox |
| `channel` | rounded-square | ✅ | chevron |
| `folder` | folder shape (dimmed initials) | ✅ | chevron |

## States
| State | Description |
|---|---|
| closed | chevron points right (→) |
| open (`--open`) | chevron points down (↓) + `brandYellow/8` background |

## Tokens
| Token | Role |
|---|---|
| `--text-title-medium-*` | Title |
| `--text-body-medium-*` | Subtitle |
| `--color-primary-transparent-87` | Title colour |
| `--color-primary-transparent-60` | Subtitle colour |
| `--color-primary-transparent-48` | Folder avatar initials (dimmed) |
| `--color-brand-yellow-8` | Open-state background |
| (Avatar atom) | Avatar shape, initials, sizes |

## Do / Don't
✅ **Do** — use the Avatar atom for the left element; only the shape modifier changes per type.
✅ **Do** — pair `--open` with the down chevron; keep them in sync via JS.
❌ **Don't** — add a subtitle to the `direct` variant — it's title-only by design.
❌ **Don't** — hardcode the open background; use `--color-brand-yellow-8`.

## Accessibility
- Render the row as a `<button>` / `<a>` with `aria-expanded` for channel/folder open/closed.
- Avatar carries an `aria-label` (contact/channel name); initials are `aria-hidden`.
- Toggle variant: checkbox is keyboard-operable (Space / Enter), `role="checkbox"`, `aria-checked`.

## Uses atoms / molecules
| Component | Role |
|---|---|
| Avatar | sm · circle / channel / folder · initials |
| Toggle | checkbox (toggle variant) |

## Status
`draft` — proposed by Claude, confirm to change.
Version 0.1 | Owner: @medvedeva_vas

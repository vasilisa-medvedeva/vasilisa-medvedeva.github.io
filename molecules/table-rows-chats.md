# TableRows / Chats

> A single row in the Chats list — avatar, name, last-message preview, time, and unread state. The primary building block of the chats screen.

## When to use / when not to use
- ✅ Use for rows in the **Chats** list (direct chats and channels).
- ✅ Use when a row needs an unread counter, favourite star, or grouped (attached) styling.
- ❌ Don't use for contact pickers with chevrons/toggles → use `cell-contact`.
- ❌ Don't use for generic settings/menu rows → use `cell-base`.

## Anatomy
`[ avatar 48 ] [ text: title + subtitle ] [ right: time + counter/star ]` · bottom hairline divider inset 64px.
- **avatar** — 48px; round (direct) or rounded-square (channel); initials or photo
- **title** — chat name (Title/Medium)
- **subtitle** — last message; Body/Medium (regular) — read = primary-60, unread = primary-87 (darker only)
- **right** — time (top) + NotificationCounter or pin icon (below)
- **divider** — 0.5px hairline, inset under the text (left 64px)

## Variants
| Variant | Description |
|---|---|
| `type` = direct (default) | Round avatar |
| `type` = channel (`--channel`) | Rounded-square avatar; sender ("General:") on its own line above the message (3 lines: name / sender / message) |
| `attached` (`--attached`) | Grouped/consecutive marker — no colour highlight (`yellow-4`, same as default) |

## States
| State | Description |
|---|---|
| read (default) | Subtitle Body/Medium · primary-60; no counter |
| unread (`--unread`, `new=yes`) | Subtitle Body/Medium (regular) · primary-87 (darker); NotificationCounter shown |
| pinned | Pin icon (`icons/chats/pin.svg`) instead of counter |
| pressed (`--pressed` / `:active`) | Press feedback — `brand-yellow-8` surface |
| no-divider (`--no-divider`) | Hairline hidden (last row of a group) |

Note: chats are **not** colour-highlighted by state — read, unread and attached rows all use `brand-yellow-4`. Only the transient pressed state tints to `brand-yellow-8`.

## Tokens
| Token | Role in this component |
|---|---|
| `--color-brand-yellow-4` | Default row surface |
| `--color-brand-yellow-8` | Pressed row surface (transient `--pressed` / `:active` only) |
| `--color-brand-yellow-16` | Avatar background |
| `--color-brand-yellow-quaternary` | Avatar initials — darker shade of the yellow-16 background (tonal rule, see Avatar atom) |
| `--color-primary-transparent-87` | Title · unread subtitle |
| `--color-primary-transparent-60` | Read subtitle · time |
| `--color-primary-transparent-16` | Divider hairline |
| `--color-brand-red-secondary` | NotificationCounter background |
| `--color-constant-primary` | NotificationCounter number |
| `icons/chats/pin.svg` | Pinned-chat icon (gold pin) |
| `--text-title-medium-*` | Title |
| `--text-body-medium-*` | Read subtitle |
| `--text-label-large-*` | Unread subtitle |
| `--text-body-small-*` | Time |

## Do / Don't
✅ **Do** — swap read↔unread by toggling `--unread` (bolder, darker subtitle + counter).
✅ **Do** — reuse the NotificationCounter (`--cell`) and Avatar atoms rather than restyling them.
❌ **Don't** — drop the counter's `1.5px primary-87` border; it's part of the atom.
❌ **Don't** — use a square avatar for direct chats — direct is round, channel is rounded-square.

## Accessibility
- Minimum touch target: 44×44pt (row is 64px tall → OK)
- Row role: `button`/`link` when tappable; label = chat name
- Unread counter: `role="status"` `aria-label="N new messages"`
- Contrast: title/subtitle on the cream surface meet AA

## Status
`draft`  
Version 0.1 | Owner: @medvedeva

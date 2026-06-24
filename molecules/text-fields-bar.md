# TextFields

> Bottom bar that houses the message composer — a growing text field with a Send button that appears when there is content.

## When to use / when not to use
- ✅ Use in chat detail screens as the message input area
- ✅ Use with the home indicator pill when the screen sits above the iOS home bar
- ❌ Don't use for forms — use TextFields.S or TextFields.L instead
- ❌ Don't show the Send button when the field is empty

## Anatomy
```
┌──────────────────────────────────────────┐  ← tab-bar (318px · yellow-8 · border-top primary-16 0.5px)
│  [+] [ textarea · emoji ] [ ▲ send ]    │  ← tab-bar__text-row · py 4px · px 10px
├──────────────────────────────────────────┤
│           ▬ (pill)                        │  ← tab-bar__indicator (optional)
└──────────────────────────────────────────┘
```

- **tab-bar** — 318px wide, `background: brand-yellow-8`, `border-top: 0.5px primary-transparent-16`
- **text-row** — `display: flex; align-items: flex-end; gap: 4px; py: 4px; px: 10px`
- **text-field** — reuses the `.text-field` atom (btn-add + textarea + emoji icon); grows up to 64px
- **send** — 36×36px circle, `background: info-primary`, `arrow-up-send.svg` white (`filter: brightness(0) invert(1)`); animated opacity + scale 0.15s ease; class `.is-visible` activates it
- **indicator** — centred pill `72×2px`, `primary-transparent-87`; omit on screens without home bar

## Variants
| Variant | Description |
|---|---|
| textFields | text-field + send button, no indicator |
| textFields + indicator | text-field + home indicator pill |

## States
| State | Description |
|---|---|
| empty | Send button hidden (`opacity: 0 · scale: 0.6 · pointer-events: none`) |
| has content | Send button visible (`.is-visible` → `opacity: 1 · scale: 1`) |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-brand-yellow-8` | Component background |
| `--color-primary-transparent-16` | Top border |
| `--color-info-primary` | Send button background |
| `--color-primary-transparent-87` | Home indicator pill |

## Do / Don't
✅ **Do** — apply `filter: brightness(0) invert(1)` to the send icon to make it white on the blue background  
❌ **Don't** — show the Send button when the textarea is empty; it must only appear when there is content

## Accessibility
- Minimum touch target: 44×44pt (send button is 36px — pad hit area in production or increase to 44px)
- Textarea: `aria-label="Message"` required
- Send button: `aria-label="Send message"`; add `aria-hidden="true"` and `tabindex="-1"` while hidden
- Contrast: `info-primary` background with white icon — verify brand blue passes WCAG AA

## Status
`draft`  
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

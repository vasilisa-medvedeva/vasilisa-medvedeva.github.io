# AboveTheTextField

> Панель над полем ввода текста, появляющаяся при ответе на сообщение, пересылке или редактировании.

## When to use / when not to use
- ✅ Use when the user is replying to, forwarding, or editing a message — to provide context before sending
- ❌ Don't use as a standalone element; it always appears anchored to the top of the text input area

## Anatomy
```
┌─────────────────────────────────────────────────────┐
│  [accent line]  InfoTitle (icon + label/name)   [×] │
│                 Message preview text                 │
└─────────────────────────────────────────────────────┘
```
- **container** — yellow background, rounded top corners, upward shadow
- **row** — flex row with bottom divider
- **content** — flex-1 area with InfoTitle and message preview
- **body** — inner content with left indent (10px) for line clearance
- **line** — 2px vertical accent bar (absent in Editing variant)
- **cancel** — dismiss button (icon `cancel.svg`, 24×24)

## Variants
| Variant | Description |
|---|---|
| reply | Reply icon + sender name; dark accent line |
| forward | Forward icon + "Forwarded from" + sender name (all info/secondary); blue accent line |
| editing | Edit icon + "Edit Message"; no accent line, no body indent |

## States
| State | Description |
|---|---|
| default | Static — component is always visible when active |

⚠️ State missing: dismissed/animated-out. The component disappears when cancel is tapped. Animation is not defined in Figma. Suggested alternative: CSS `opacity`/`transform` collapse on dismiss. Confirm or describe desired behavior.

## Tokens
| Token | Role in this component |
|---|---|
| `--color-brand-yellow-8` | Container background |
| `--color-primary-transparent-16` | Bottom divider border |
| `--color-primary-transparent-87` | Accent line · reply variant |
| `--color-info-tertiary` | Accent line · forward variant |
| `--color-primary-transparent-60` | Message preview text |
| `--text-body-medium-*` | Message preview text style |
| `--text-label-medium-*` | InfoTitle name (via InfoTitle atom) |
| `--text-body-small-*` | InfoTitle label "Forwarded from" (via InfoTitle atom) |

## Do / Don't
✅ **Do** — always pair with the text input; this component has no standalone use case  
❌ **Don't** — add content other than InfoTitle + one line of message preview

## Accessibility
- Minimum touch target: 44×44pt (cancel button satisfies this at 40px — ⚠️ consider padding to 44px in production)
- Cancel button: `aria-label="Dismiss reply"` / `"Dismiss forward"` / `"Dismiss editing"` (contextual)
- Decorative icons: `aria-hidden="true"`

## Status
`draft`  
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

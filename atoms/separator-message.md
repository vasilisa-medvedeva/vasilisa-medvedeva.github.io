# SeparatorMessage

> A text separator in the chat feed — splits messages by date or marks the unread boundary.

## When to use / when not to use
- ✅ Use to mark a date boundary between messages (e.g. "Today", "Mon 16 Jun")
- ✅ Use to mark the first unread message boundary ("Unread Messages")
- ❌ Don't use as a section header outside of a chat feed
- ❌ Don't add icons or interactive elements inside the pill

## Anatomy
Container → Pill → Text

- **Container** — `div.separator-message`, flex center, `width: 272px`
- **Pill** — `div.separator-message__pill`, `border-radius: 12px`, `padding: 4px 8px`, transparent background
- **Text** — `span.separator-message__text`, Label/Medium, color `primary/transparent-60`, centered

## Variants
| Variant | Description |
|---|---|
| Date | Shows a date string: "Today", "Mon 16 Jun", etc. |
| Unread | Shows "Unread Messages" — marks unread boundary |

## States
| State | Description |
|---|---|
| Default | Single static state — no interaction |

⚠️ State missing: **Focused / empty background variant**. Not defined in Figma. In dark chat themes the transparent pill may be hard to read. Suggested alternative: add a semi-transparent background token. Confirm or describe what you want.

## Tokens
| Token | Role in this component |
|---|---|
| `--color-primary-transparent-60` | Text color |
| `--text-label-medium-*` | Text typography (12px / 500 / lh 14px / ls 0.5px) |

## Do / Don't
✅ **Do** — pass any date string as text content; the pill adapts to content width  
❌ **Don't** — hardcode the width of the pill — it grows with the text  
✅ **Do** — center the separator horizontally within the chat feed container  
❌ **Don't** — use this component for labels or headings outside chat

## Accessibility
- Minimum touch target: not interactive — no touch target required
- Wrap in `role="separator"` or `aria-label="Date separator: Today"` for screen readers
- "Unread Messages" variant: add `aria-live="polite"` if injected dynamically

## Status
`draft`
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

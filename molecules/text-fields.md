# TextFields

> Chat message input with an add button and emoji icon — the primary text entry control in a conversation.

## When to use / when not to use
- ✅ Use when the user needs to type and send a chat message
- ✅ Use when the input area should expand across 1–3 rows as text grows
- ❌ Don't use for short single-line form inputs (use a plain input atom instead)
- ❌ Don't use when attachment or media actions aren't relevant

## Anatomy
```
[ btn-add ] [ field: [ text-area ] [ emoji-icon ] ]
```
- **btn-add** — circular button (36×36px) with `+` icon; triggers attachment/action picker
- **field** — pill-shaped container holding the text area and emoji icon
- **value** — placeholder or typed text inside the field
- **caret** — blinking cursor indicator (visible in focused state)
- **emoji-icon** — 24×24px icon at the right edge of the field; opens emoji picker

## Variants
| Variant | Description |
|---|---|
| Row 1 | Single-line input (default) |
| Row 2 | Two-row input; field grows to `min-height: 56px` |
| Row 3 | Three-row input; field grows to `min-height: 76px` |

## States
| State | Description |
|---|---|
| Enabled | Empty field, placeholder text visible |
| Focused | Caret visible, placeholder faded |
| Typing | Caret + partial text, body color |
| Typed | Full text, no caret, body color |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-constant-primary` | Background of btn-add and field |
| `--color-primary-transparent-24` | Border of btn-add and field |
| `--color-primary-transparent-60` | Placeholder text color |
| `--color-primary-transparent-87` | Typed text and caret color |
| `--text-body-large-*` | Typography for all text inside field |

## Do / Don't
✅ **Do** — let the field grow vertically by switching to `--row-2` or `--row-3` modifier when text wraps  
❌ **Don't** — resize the field width; it is fixed at 318px per Figma spec

## Accessibility
- Minimum touch target: 44×44pt (btn-add is 36px — wrap in a larger hit area if needed)
- `<button>` for btn-add with `aria-label="Add"`
- Text input area should be a `<textarea>` or `contenteditable` in production
- Placeholder contrast must meet WCAG AA against the field background

## Status
`draft`  
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

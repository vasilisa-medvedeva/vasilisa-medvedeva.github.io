# TextFields.S

> Compact single-line text field with a static placeholder and inline error icon — used for short inputs where vertical space is at a premium.

## When to use / when not to use
- ✅ Use when the input sits in a dense form or toolbar (e.g. search filters, inline editing)
- ✅ Use for short values where a floating label is unnecessary
- ❌ Don't use when the field requires a password — use TextFields.L instead
- ❌ Don't use when vertical space is not constrained — TextFields.L is the default field

## Anatomy
container (.tf-s) → control (.tf-s__control) → [input or text] + [error icon]
                  → supporting text (.tf-s__supporting)

- **control** — pill shape, border-radius 30px, 318px wide, py 6px / pl 16px / pr 8px
- **input** — Body/Large, transparent background; or static `<p class="tf-s__text">` for display
- **icon** — 24×24px `error.svg`, visible on error state only
- **supporting** — Body/Medium, pl 16px, below control

## Variants
| Variant | Description |
|---|---|
| default | White background, static placeholder |

## States
| State | Modifier class | Description |
|---|---|---|
| enabled | — | 1px border · primary-24 · placeholder primary-60 |
| focused | `tf-s--focused` | 1.5px border · primary-87 · caret visible |
| typing | `tf-s--typing` | 1.5px border · primary-87 · text + caret |
| typed | `tf-s--typed` | 1px border · primary-24 · text primary-87 |
| error | `tf-s--error` | 1.5px border · warning-primary · error.svg · red supporting |
| disabled | `tf-s--disabled` | 1.5px border · primary-32 · text primary-32 · px 16px both sides |
| disabled + text | `tf-s--disabled-text` | 1.5px border · primary-32 · placeholder text primary-60 |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-constant-primary` | Control background |
| `--color-primary-transparent-24` | Border (enabled, typed) |
| `--color-primary-transparent-32` | Border + text (disabled) |
| `--color-primary-transparent-48` | Supporting text (disabled + text) |
| `--color-primary-transparent-60` | Placeholder text |
| `--color-primary-transparent-87` | Border (focused, typing) · value text |
| `--color-warning-primary` | Border + icon + supporting (error) |
| `--text-body-large-*` | Input / value text |
| `--text-body-medium-*` | Supporting text |

## Do / Don't
✅ **Do** — add `tf-s--error` class and show the error icon together  
❌ **Don't** — use this field for passwords or inputs requiring a floating label

## Accessibility
- Minimum touch target: 44×44pt (control height is 32px — expand hit area if needed)
- `<input>` must have a visible `<label>` or `aria-label`
- Error state must announce the error message via `aria-describedby` pointing to `.tf-s__supporting`
- `aria-invalid="true"` on the input when in error state

## Status
`draft`  
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

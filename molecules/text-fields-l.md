# TextFields.L

> Large text field with a floating label animation — the default input field for forms, supporting text and password inputs.

## When to use / when not to use
- ✅ Use as the standard form field for any user-facing input
- ✅ Use when a password field with visibility toggle is needed
- ❌ Don't use in dense toolbars or tight layouts — use TextFields.S instead
- ❌ Don't use without a label — the floating label is required for accessibility

## Anatomy
container (.tf-l) → control (.tf-l__control) → [label] + [input] + [eye-btn or error icon]
                  → supporting text (.tf-l__supporting)

- **control** — pill shape, border-radius 30px, 318px wide, p 16px all sides, bg brand-yellow-4
- **label** — Body/Large inside the field (acts as placeholder); rises to border-top at Body/Medium on focus/has-value
- **input** — Body/Large, transparent background; `type="text"` or `type="password"`
- **eye-btn** — 24×24px icon button, password fields only; toggles `eye-close.svg` ↔ `eye.svg`; opacity 0.87, color matches text
- **icon** — 24×24px `error.svg`, error state only
- **supporting** — Body/Medium, pl 16px, below control

## Variants
| Variant | Description |
|---|---|
| text | Standard text input |
| password | Includes eye-btn for visibility toggle |

## States
| State | Modifier class | Description |
|---|---|---|
| enabled | — | 1px border · primary-24 · label inside at Body/Large |
| focused | `tf-l--focused` | 1.5px border · primary-87 · label floats up (primary-48) |
| typing | `tf-l--typing` | 1.5px border · primary-87 · label up · text + caret |
| typed | `tf-l--typed` | 1px border · primary-48 · label up (primary-48) |
| error | `tf-l--error` | 1.5px border · warning-primary · label up (warning) · error.svg |
| disabled | `tf-l--disabled` | 1.5px border · primary-32 · label inside (primary-32) · eye-btn opacity 0.32 |
| disabled + text | `tf-l--disabled-text` | 1.5px border · primary-32 · label inside (primary-60) · eye-btn opacity 0.32 |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-brand-yellow-4` | Control background |
| `--color-primary-transparent-24` | Border (enabled) |
| `--color-primary-transparent-32` | Border + label (disabled) |
| `--color-primary-transparent-48` | Border (typed) · label floated |
| `--color-primary-transparent-60` | Label (disabled + text) |
| `--color-primary-transparent-87` | Border (focused, typing) · value text · label inside (enabled) · eye-btn opacity |
| `--color-warning-primary` | Border + label + icon (error) |
| `--text-body-large-*` | Label inside · input value |
| `--text-body-medium-*` | Label floated · supporting text |

## Do / Don't
✅ **Do** — pair `<label class="tf-l__label" for="id">` with `<input id="id">` for correct floating and accessibility  
❌ **Don't** — use `tf-l--typed` border color (primary-48) for the focused state — focused uses primary-87

## Accessibility
- Minimum touch target: 44×44pt (control height is 52px — meets requirement)
- `<label for="input-id">` is required; do not use `placeholder` as the only label
- Eye button: `aria-label="Show password"` / `"Hide password"` toggles on click
- Error state: `aria-invalid="true"` on input + `aria-describedby` pointing to `.tf-l__supporting`
- Floating label must remain readable at both sizes (contrast ≥ 4.5:1 against yellow-4 background)

## Status
`draft`  
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

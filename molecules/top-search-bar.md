# TopSearchBar

> Search field embedded in the top navigation bar — provides global search access within the red header strip.

## When to use / when not to use
- ✅ Use as the primary search entry point at the top of a screen
- ✅ Use when search scope is global (across chats, channels, messages)
- ❌ Don't use inside content areas — for inline search use SearchField directly
- ❌ Don't add extra controls (Cancel button, filters) at this level

## Anatomy
Container → [SearchField]

- **Container** — `div.top-search-bar`, red background, `padding: 10px 16px`, `width: 350px`
- **Field** — SearchField molecule (`div.search-field`), fills remaining width, border suppressed via context override
- **Icon** — `search.svg` 18×18, inside SearchField
- **Input** — `input.search-field__input`, placeholder "Search"
- **Clear button** — `button.search-field__cancel` with `cancel.svg`, visible only when typed (via `search-field--typed`)

## Variants
| Variant | Description |
|---|---|
| Empty | Placeholder "Search" visible, no clear button |
| Typed | Input has value, clear (×) button appears |

## States
| State | Description |
|---|---|
| Empty | Default resting state, placeholder shown |
| Typed | `search-field--typed` applied to field, clear button visible |

⚠️ State missing: **Focused (empty)**. Not defined in Figma. Suggested alternative: same as Empty — no visible difference until text is typed. Confirm or describe what you want.

## Tokens
| Token | Role in this component |
|---|---|
| `--color-brand-red-secondary` | Container background |
| `--color-constant-primary` | SearchField pill background (white) |
| `--color-primary-transparent-48` | Placeholder text color |
| `--color-primary-transparent-87` | Typed text color |
| `--text-body-large-*` | Input text typography |

## Do / Don't
✅ **Do** — use `.search-field` molecule classes inside the container; override only border and width via `.top-search-bar .search-field`  
❌ **Don't** — add a Cancel button or extra controls to this component  
✅ **Do** — keep padding `10px 16px` on all sides (no asymmetric overrides)  
❌ **Don't** — define custom input/icon styles — inherit from SearchField

## Accessibility
- Minimum touch target: 44×44pt — container height ≥ 44px (current: 44px with 10px vertical padding + 24px field)
- Wrap in `role="search"` landmark
- Input: `aria-label="Search"` (no visible label)
- Clear button: `aria-label="Clear search"`

## Status
`draft`
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

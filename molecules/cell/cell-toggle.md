# CellToggle

> A cell row with list text on the left and a toggle (Radio or Checkbox) on the right — used in selection lists, settings, and forms.

## When to use / when not to use
- ✅ Use when presenting a mutually exclusive choice (radio) or a multi-select item (checkbox) in a list.
- ❌ Don't use when the option applies immediately without a submit action — use Switch instead.
- ❌ Don't use a standalone toggle outside a list — use the Toggle atom directly.

## Anatomy
```
.cell-toggle [--small] [--medium]
└── .cell-toggle__base      flex row · px 16px · height 36/48/56px
    ├── .cell-toggle__text  flex:1
    │   └── .cell-toggle__title   Body/Large
    └── .toggle-radio / .toggle-cb   Toggle atom (28×28px)
```

## Variants
| Variant | Description |
|---|---|
| `type: radio` | `.toggle-radio` — single-select within a group |
| `type: checkbox` | `.toggle-cb` — multi-select |
| `size: xSmall` *(default)* | Cell height 36px |
| `size: small` (`--small`) | Cell height 48px |
| `size: medium` (`--medium`) | Cell height 56px |

## States
| State | Description |
|---|---|
| off / unchecked | `aria-checked="false"` — `t-ring` visible |
| on / checked | `aria-checked="true"` — yellow fill + dark border + mark |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-constant-primary` | Cell background |
| `--color-primary-transparent-87` | Title text colour |
| `--text-body-large-*` | Title typography |
| (Toggle atom tokens) | Control fill, ring, mark |

## Do / Don't
✅ **Do** — manage state via `aria-checked`; the CSS switches layers automatically.  
❌ **Don't** — hardcode cell height or text colour outside the modifier classes and tokens.  
❌ **Don't** — re-implement the toggle SVG; reuse `.toggle-radio` / `.toggle-cb` from the Toggle atom.

## Accessibility
- Minimum touch target: 44×44pt — wrap cells in a sufficient tap area; the cell itself is 36–56px tall.
- Radio: `role="radio"`, `aria-checked="true|false"`, grouped inside `role="radiogroup"`.
- Checkbox: `role="checkbox"`, `aria-checked="true|false"`.
- Toggle button is keyboard-operable: Space / Enter toggles state.

## Status
`draft`  
Version 0.1 | Owner: @medvedeva_vas

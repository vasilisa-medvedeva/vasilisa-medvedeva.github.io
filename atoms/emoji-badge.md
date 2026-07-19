# EmojiBadge

> A single emoji on a white circular chip — used as a small overlay badge (e.g. a reaction on an avatar).

## When to use / when not to use
- ✅ Use as an overlay on an avatar to show a reaction or status emoji.
- ✅ Use standalone where a single emoji needs a contained white backing.
- ❌ Don't use to show an emoji + count — that's the Reaction atom.
- ❌ Don't use as a button to open the emoji picker.

## Anatomy
```
.emoji-badge            white circle · pad 4px · radius 26px
└── .emoji-badge__glyph single emoji · 16px (sm 12px)
```

## Variants
| Variant | Description |
|---|---|
| medium (default) | 16px glyph |
| `--sm` | 12px glyph — for overlaying on small (32px) avatars |

## States
| State | Description |
|---|---|
| Default | Static presentational element — no interactive states |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-constant-primary` | White circle background |

## Do / Don't
✅ **Do** — keep exactly one emoji inside the glyph span.
❌ **Don't** — hardcode the white background; use `--color-constant-primary`.

## Accessibility
- Decorative by default — the parent component conveys meaning (e.g. "reacted with 😂").
- If meaningful standalone, wrap with `role="img"` and an `aria-label`.
- Minimum touch target: 44×44pt — pad the surrounding area; the badge itself is ~20px.

## Status
`draft`  
Version 0.1 | Owner: @medvedeva_vas

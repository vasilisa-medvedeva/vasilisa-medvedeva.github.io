# ChipLive

> Compact "Live" badge that marks a channel with a meet in progress.

## When to use / when not to use
- ✅ In the chats list — replaces the unread counter while a meet is live
- ✅ On a channel avatar — baked into the live SVG (48×52px)
- ❌ Don't show ChipLive and NotificationCounter at the same time; live wins
- ❌ Don't use it for any meaning other than a live meet (no "new", no "beta")

## Anatomy
- **container** — inline-flex, pad 2/8/4, radius 4px, border 1.5px
- **label** — label-medium-bold, fixed text "Live"

## Variants
| Variant | Description |
|---|---|
| standalone | In list rows, right-aligned where the counter sits |
| on-avatar | Part of the live channel-avatar SVG |

## States
| State | Description |
|---|---|
| default | Single static state — the badge itself doesn't change |

## Tokens
| Token | Role in this component |
|---|---|
| `--color-brand-yellow-4` | Badge bg |
| `--color-warning-primary` | Border and label |
| `--text-label-medium-bold-*` | Label |

## Do / Don't
✅ **Do** — remove the badge the moment the meet ends; a stale "Live" destroys trust in it
❌ **Don't** — translate or reword the label; "Live" is a fixed term across the product

## Accessibility
- Not interactive on its own — the whole row/avatar is the tap target
- Exposed to screen readers as text ("Live") within the row's label
- Border + text on warning color keep ≥ 3:1 contrast against the pale bg

## Status
`draft`
Version 1.0 | Owner: @vasilisamedvedeva19940625-ui

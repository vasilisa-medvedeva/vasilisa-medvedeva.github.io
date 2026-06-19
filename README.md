# plannix-test

## Design QA Checklist

Before completing any task, verify the implementation against Figma designs and the Design System Library. **A task is not considered done until all checklist items pass.**

### Typography

- Verify that correct text tokens from the Design System are used.
- Check:
  - text style / token name
- Do not create local text styles if an equivalent token already exists in the library.

### Colors

- Verify that all colors match Design System tokens.
- Double-check:
  - text colors
  - background colors
  - icon colors
  - state colors (hover, pressed, disabled, selected)

### Spacing

Always verify all spacing values against Figma designs and the Design System:

- External spacing (margins)
- Internal spacing (padding)
- Gaps between elements
- Spacing inside components and containers
- Alignment and element anchoring

### Final Verification

Before closing a task, answer the following questions:

- Do all text styles use existing tokens?
- Are all colors taken from the Design System?
- Do all external and internal spacing values match Figma?
- Are there no local styles or arbitrary values without justification?
- Does the visual implementation match the design pixel-perfect?

**Do not consider a task complete until every item on this checklist has been verified.**

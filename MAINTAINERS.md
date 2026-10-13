# Maintainers and governance

## Maintainers

| Name | GitHub | Areas |
|---|---|---|
| Saish | `@saishmenon` | Lead maintainer · design, Figma library, React, releases |

## How decisions are made

Evenkeel is a small project with a **lead-maintainer** model.

- **Day-to-day changes** (bug fixes, docs, small props) are merged by any maintainer after one approving review and green CI.
- **New components, new tokens or roles, and theme changes** start as an issue. They need a short written proposal (the component request template is enough) and lead-maintainer approval before work starts, because they must land in Figma and code together.
- **Breaking changes** need an issue labelled `breaking`, open for at least 7 days for comments, and a migration note in `CHANGELOG.md`.
- If maintainers disagree, the lead maintainer decides, and writes down why in the issue.

## Design principles are the tie-breaker

When two options are both reasonable, pick the one that better serves the principles in Storybook › Introduction: clarity, restraint, depth, calm density and accessible by default. Accessibility regressions are never accepted as a trade-off.

## Becoming a maintainer

Contributors who have landed several meaningful changes, review others' work kindly, and care about Figma ↔ code parity may be invited by the lead maintainer. Maintainers who are inactive for 6 months move to "emeritus" and can return any time.

## Code of Conduct

Maintainers enforce the [Code of Conduct](CODE_OF_CONDUCT.md).

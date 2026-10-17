# Accessibility

Evenkeel aims for WCAG 2.2 AA.

## What's checked automatically

- Colour contrast for every text and control colour, in every theme and mode. The build fails if anything drops below AA.
- An axe scan of every Storybook story, in a light and a dark theme, on every pull request.
- The colour palettes in code match the Figma file, so a colour that passes in code is the same colour in the design.

## What's built in

- Keyboard support that follows the [WAI-ARIA patterns](https://www.w3.org/WAI/ARIA/apg/) for menus, combo boxes, tabs and dialogs. Escape closes popovers and returns focus, and the focus ring is always visible.
- Native elements first: buttons are `<button>`, fields have real labels.
- Icon-only buttons and tables require a label.
- Errors are linked to their field and never rely on colour alone. Neither does status.
- Toasts and changes to data views are announced to screen readers.
- Animations respect reduced motion.
- Controls are at least 24×24 px, even in compact density. Compact changes spacing, never text size.

Automated tools only catch part of the picture, so new interactive components are also tried with a keyboard and a screen reader.

## What's still up to you

- Give each page a title, one main heading and a sensible heading order.
- Write clear button and link text ("Refund payment", not "Click here").
- Check the contrast of any colours you add outside the tokens, and test a custom theme in both light and dark.

Found a problem? Please [open an issue](https://github.com/saishmenon/evenkeel/issues/new?template=bug_report.yml).

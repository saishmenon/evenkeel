# Accessibility

Evenkeel targets **WCAG 2.2 level AA**. Some of that is enforced automatically on every pull request; some needs a person. This page says which is which, so you know what Evenkeel guarantees and what is still your job.

## What is tested automatically

| Check | Command | What it covers | When it runs |
|---|---|---|---|
| **Contrast** | `npm run test:contrast` (part of `npm test`) | Every text and UI colour-role pair in **every theme × mode**: text ≥ 4.5:1, large text and UI parts (control borders, focus rings, solid accent) ≥ 3:1. The build fails if any pair drops below. (Data-viz palettes are generated to reach 3:1 against every chart background in both modes.) | CI, `build-storybook`, release |
| **axe scan** | `npm run test:a11y` | Opens every component, pattern, demo, template and flow story in headless Chromium and runs [axe-core](https://github.com/dequelabs/axe-core) with the `wcag2a`, `wcag2aa`, `wcag21aa` and `wcag22aa` rule tags, in two combinations (Default light and Studio dark). Any violation fails CI. | CI |
| **Figma parity** | `npm run test:parity` | Palettes in code match the Figma primitives, so a contrast-checked colour in code is the same colour in the design. | CI, release |
| **Storybook a11y panel** | `npm run storybook` | The same axe rules, live, for the story you are looking at. | While developing |

Run the full set locally:

```sh
npm test                     # contrast + parity
npm run build-storybook      # builds storybook-static/
npx playwright install chromium   # once
npm run test:a11y            # axe over every story
```

## What is built in

- **Keyboard.** Interactive components follow the [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) pattern for their widget: Menu (arrow keys, Home/End, type-ahead), Combo box (ARIA 1.2 combobox), Tabs, Sheet (dialog), Tooltip and Popover (Escape closes and returns focus). Focus is always visible: a 2px ring, 2px outside the control, that meets 3:1.
- **Native first.** Buttons are `<button>`, fields are `<input>`/`<textarea>`/`<select>` with real `<label>`s; ARIA is added only where there is no native element.
- **Names.** Icon-only controls (`IconButton`) require a `label`. Tables require a `label`, and row-header columns are announced with each cell.
- **Errors.** Field errors are linked to the input with `aria-describedby` and always pair red with an icon and a message.
- **Colour is never the only signal.** Status badges and alerts carry text or an icon; charts have labels, legends and accessible names.
- **Live regions.** Toasts and data-view changes (sorting, filtering, selection) are announced to screen readers.
- **Motion.** Components that animate respect `prefers-reduced-motion`.
- **Target size.** Controls are at least 24×24 CSS px (WCAG 2.5.8), including in compact density.
- **Density never shrinks text.** Compact changes spacing, not type size.

## What automated tests cannot tell you

axe catches roughly a third to a half of real accessibility issues. Before a release, and for any new interactive component, a maintainer also checks:

- [ ] Keyboard only: every action reachable, in a sensible order, with no traps.
- [ ] A screen reader (VoiceOver, NVDA, JAWS or Orca): names, roles, states and announcements make sense.
- [ ] 200% browser zoom and 320px-wide viewport (reflow).
- [ ] Windows High Contrast / `forced-colors: active`: focus and control edges stay visible.
- [ ] Reduced motion turned on.

Contributors say which screen reader they used in the pull request template.

## Your responsibilities when using Evenkeel

Evenkeel gives you accessible parts; the page is still yours.

- Give every page a `<title>`, one `<h1>` (`PageHeader level={1}`) and a logical heading order.
- Provide labels: `label` on `Table`, `IconButton`, `Spinner`; visible labels on fields.
- Write meaningful link and button text ("Refund payment", not "Click here").
- If you add colours outside the roles (custom illustrations, brand blocks), check their contrast yourself.
- Custom themes from `applyTheme()` are contrast-adjusted for the accent, but test your brand in both modes.

## Reporting an issue

Accessibility bugs are treated as high-priority bugs. Open an issue with the [bug report template](https://github.com/saishmenon/evenkeel/issues/new?template=bug_report.yml), and include the component, browser, assistive technology and what you expected to hear or see.

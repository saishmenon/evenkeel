# Changelog

All notable changes to Evenkeel (the `evenkeel-ui` package and the Figma library) are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
The Figma Community file uses the same version numbers as the package.

## [Unreleased]

## [1.1.0] - 2026-10-12

One story everywhere. Templates, demos, sample data and the Figma file now follow the same week at Lantern Bikes as the user flows.

### Added
- **Published on the [Figma Community](https://www.figma.com/community/file/1691663776222213480/evenkeel-design-system).** The React package, GitHub repository and Storybook site follow.
- **Start here** walkthrough (`START_HERE.md`) and a Start here section in the Storybook introduction.
- **Story page** in Figma: the cast, the week of 5–9 October and every flow grouped into chapters.
- **Mobile app (Figma only):** phone foundations, components and Mintline app screens, with three phone flows (3.2 Ask Mintline from your phone, 3.4 Approve from your phone, 4.1 Refund on the go).
- **Views templates in Storybook** (Transactions, Disputes), with templates ordered Views → Account → Data → Auth → AI.
- **Products grid** for Lantern Bikes' products and a **Schedule** calendar of the story's week (Figma Views templates).
- `scripts/fill-placeholders.mjs` fills in the GitHub username, contact email and Figma Community link in one command. `npm run release:check` lists any left and runs before every npm publish.
- New README screenshots in `docs/images/` (story, dashboard, products, two flows) and a v1.1 release card in Figma.

### Changed
- Removed the `funding` link from `package.json` until there is a sponsors page.
- The dashboard's activity feed no longer says Kenji paused payouts, which the story never has him do.
- Customers are now a bike shop's customers: people plus a few clubs, couriers and rental shops. Their subscriptions are a service club (Ride, Ride Plus, Pro Care).
- The Grid view shows Lantern Bikes' products instead of merchants, and the Schedule (calendar) view shows the story's week: the move to Mintline, the first payment, the dispute and its deadline, and the Thanksgiving payout delay.
- Volume charts and the Explain answer agree with the code: October up 7% to 456k CAD.
- Every Figma component's description now has an **In code** section: import, example, Figma → React property mapping and Storybook location.
- Numbers use one scale everywhere: Lantern Bikes processes about 456k CAD and 1,284 payments a month (was 12.4M on some screens).
- Fixed story contradictions found in an audit (people, IDs, dates, times, plan names), removed real brand names (banks, browsers) and cloud-console leftovers.
- Templates, demos and sample data now use the same story as the user flows: Lantern Bikes, its team (Nora, Ana, Kenji), its customers (Maya, Jordan), the week of 5–9 October and the Tuesday 9:10 declines spike.
- Account templates use Lantern Bikes emails, roles (Owner, Admin, Staff, Viewer) and payment usage meters (transactions, payouts, API calls).
- The shop owner is now Nora Ellis. In the story, Lantern Bikes moves to Mintline on Monday and brings its sales history, which is why the dashboards go back months.
- Template pages in Figma are organised into sections, each with a description, the flow it appears in and its Storybook name. Views templates (Transactions, Disputes) are now in Storybook too.
- Dashboard and revenue report show regions in Canada and the US instead of countries the shop doesn't sell to.

## [1.0.0] - 2026-10-04

First public release. Evenkeel is a themeable design system for data-heavy web apps, in Figma and React, with the same names in both.

### Added

- **Tokens.** 12-step OKLCH colour scales generated from five theme knobs (accent, neutral, shape, display font, text font); colour roles named by job (`label`, `fill`, `background`, `border`, `accent`, status); foundations for space (4-point grid), radius, type (15 text styles), depth, materials and motion. Generated as CSS custom properties and `tokens.json` for the Figma sync.
- **4 themes:** Default, Graphite, Ember and Studio, plus `applyTheme()` for custom themes at runtime.
- **Light and dark** for every theme, using `light-dark()`. Follows the OS by default; `data-mode` forces one. Themes and modes nest.
- **2 densities:** comfortable and compact (`data-density`), changing spacing and control heights, never text size.
- **48 components** in React, mirrored in Figma with matching names and variants: actions, inputs, status, layout, app structure, navigation, data and overlays. Each has the same usage guidance (when to use, when not to, dos and don'ts, accessibility) in Storybook and Figma.
- **Charts:** bar, line, area and stacked charts, donut, bar list, sparkline, gauge and heatmap, with accessible names and a categorical palette tuned to reach 3:1 against chart backgrounds.
- **Data views:** table, list, grid, board, calendar, timeline and split views over the same records, sharing one state for search, filters, sorting and grouping.
- **Colour palettes:** a 13-hue spectrum (12 steps each), static grey scales and data-visualisation palettes (categorical, sequential, diverging), in light and dark, as `--ek-*` custom properties and a Figma Palettes collection.
- **Icons:** 500+ icons: Evenkeel's own line icons drawn on a 24px grid, plus a curated set from [Lucide](https://lucide.dev) (ISC). See `THIRD_PARTY_NOTICES.md`.
- **Illustrations:** 17 spot illustrations for empty states, onboarding, errors and success, built from colour roles so they follow every theme.
- **Brand:** the Evenkeel mark and lockup (`brand/`), a brand guide page and 12 marketing templates in Figma (social, banners, Open Graph, GitHub preview, Community cover, slides, release card, email header).
- **Patterns:** payments list, payment details, create flow, dashboard, empty states and expressive theming.
- **Templates:** 20+ page templates across account, auth, data and AI.
- **User flows:** 12 flows told as one story (*A week at Lantern Bikes*), 9 of them click-through in Storybook, all mirrored in Figma as screens and arrows.
- **Demos** built on Mintline, a fictional payments platform.
- **Accessibility tooling:** WCAG AA contrast check for every theme × mode, axe scan (WCAG 2.2 AA rule set) of every component, pattern, template, flow and demo story in CI, and a Figma parity check.
- **Package:** ESM + CommonJS builds, TypeScript declarations, a single `evenkeel-ui/css` stylesheet, `evenkeel-ui/tokens.css`, `evenkeel-ui/tokens.json`, `evenkeel-ui/icons` and optional `evenkeel-ui/fonts.css`. Published with npm provenance.
- **Docs:** getting started, theming, tokens, Figma, accessibility and publishing guides in `docs/`, and a Storybook site.

[Unreleased]: https://github.com/saishmenon/evenkeel/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/saishmenon/evenkeel/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/saishmenon/evenkeel/releases/tag/v1.0.0

# Contributing to Evenkeel

Thanks for helping. Evenkeel lives in **two places at once**: a Figma library and a React package. Every token, text style and component has the **same name in both**, and most of the work in a change is keeping that true.

By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

- [Getting set up](#getting-set-up)
- [Scripts](#scripts)
- [Branches and pull requests](#branches-and-pull-requests)
- [Commit messages](#commit-messages)
- [Adding a component (code + Figma)](#adding-a-component-code--figma)
- [Changing tokens](#changing-tokens)
- [Accessibility and contrast](#accessibility-and-contrast)
- [Releasing](#releasing)

## Getting set up

You need **Node 20** (see `.nvmrc`) and npm 10.

```sh
git clone https://github.com/saishmenon/evenkeel.git
cd evenkeel
nvm use            # optional, picks Node 20
npm ci
npm run build:tokens
npm run storybook  # http://localhost:6006
```

For the accessibility scan you also need Playwright's Chromium once:

```sh
npx playwright install chromium
```

## Scripts

| Script | What it does |
|---|---|
| `npm run storybook` | Generates tokens, then starts Storybook on port 6006. |
| `npm run build:tokens` | Generates `build/css/*.css` and `build/tokens.json` from the theme presets and foundations. |
| `npm run typecheck` | `tsc` over `src/` and `.storybook/`. |
| `npm test` | WCAG contrast for every theme × mode, plus Figma parity (palettes match the Figma primitives exactly). |
| `npm run build` | Tokens + library build to `dist/` (ESM, CJS, `.d.ts`, `evenkeel.css`). |
| `npm run test:smoke` | Imports the built package by name and server-renders a few components. Run after `build`. |
| `npm run build-storybook` | Static Storybook in `storybook-static/` (also runs tokens + contrast first). |
| `npm run test:a11y` | axe (WCAG 2.2 AA rules) on every component, pattern, demo, template and flow story, in two theme/mode combinations. Run after `build-storybook`. |
| `npm run test:all` | Storybook build, tests and the a11y scan, in one go. |

Before you open a PR, at least run:

```sh
npm run typecheck && npm test && npm run build
```

CI runs all of the above, including the axe scan, on every pull request.

## Branches and pull requests

1. **Open or find an issue first** for anything bigger than a typo, so we can agree on the shape before you build it. New components start as a [component request](.github/ISSUE_TEMPLATE/component_request.yml).
2. **Fork, then branch from `main`.** Name branches by type: `feat/date-picker`, `fix/table-focus`, `docs/theming`, `chore/deps`.
3. **Keep PRs small and focused.** One component or one fix per PR is ideal.
4. **Fill in the PR template.** Include before/after screenshots in light and dark.
5. **Squash-merge.** The PR title becomes the commit on `main`, so it must follow Conventional Commits.

`main` is always releasable. Releases are cut from tags; see [docs/publishing.md](docs/publishing.md).

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<scope>): <summary in the imperative, lower case, no full stop>
```

| Type | Use for | Version bump |
|---|---|---|
| `feat` | A new component, prop, token or theme | minor |
| `fix` | A bug fix | patch |
| `docs` | Docs, Storybook stories, README | none |
| `style` | Formatting only (no CSS behaviour change) | none |
| `refactor` | Code change with no behaviour change | none |
| `perf` | Performance | patch |
| `test` | Tests and checks | none |
| `build` / `ci` / `chore` | Tooling, CI, dependencies | none |

Scopes are component or area names in kebab case: `button`, `combo-box`, `tokens`, `theme`, `figma`, `charts`.
Breaking changes add `!` and a footer: `feat(table)!: rename onSort to onSortingChange` + `BREAKING CHANGE: …`.

## Adding a component (code + Figma)

A component is done when it exists in **both** places with matching names. Use an existing component (Badge or Tag are small, Table is large) as the template.

### 1. Name it once

Pick the name people would say out loud: **Combo box**, **Key-value list**. That name is used:

| Where | Form | Example |
|---|---|---|
| Figma component set and page | Sentence case | `Combo box` |
| Figma variant properties | Title case property, lower-case values | `Size = md`, `State = disabled` |
| React component and folder | PascalCase | `src/components/ComboBox/ComboBox.tsx` |
| React props | camelCase of the Figma property | `size`, `disabled` |
| CSS classes | `ek-` + kebab case, BEM modifiers | `.ek-combo-box`, `.ek-combo-box--invalid` |
| Docs entry | Figma name | `content['Combo box']` |

Interaction states (`hover`, `pressed`, `focus`) are Figma variants but **browser states** in code (`:hover`, `:active`, `:focus-visible`), not props.

### 2. Code

```
src/components/ComboBox/
  ComboBox.tsx          # component + exported props type; a comment maps Figma props → React props
  ComboBox.css          # imported by the .tsx; only var(--…) tokens, no raw colours or pixel sizes outside the scales
  ComboBox.stories.tsx  # Default, every variant, every state, plus real-content examples
```

- Use tokens only: colours from `--color-*` roles, spacing from `--space-*`, control sizes from density tokens (`--control-height-md` …), text from one of the 15 text styles.
- Follow the shared rules: disabled = 40% opacity, pressed = 85% opacity, 2px focus ring 2px outside, fields get the accent halo on focus, errors pair red with an icon and a message.
- Export the component and its props type from `src/index.ts`.
- Add guidance to `src/docs/content.ts` (summary, use / avoid, dos / don'ts, accessibility, Figma ↔ code mapping). Storybook and the Figma docs page both read it.
- Stories go under the right group: `Components/<Group>/<Name>`, with `tags: ['autodocs']` and `docsParams(content['<Name>'])`.

### 3. Figma

- Add a page with the same name, built with the standard docs layout (the scripts in `scripts/figma/` generate it from the same `content.ts`).
- Build the component set with variant properties named as above. Bind **every** fill, stroke, radius, padding and gap to a variable; use text styles, never local text formatting. The final audit should report **0 unbound colours**.
- Use the `Icon/*` components for icons; never paste raw vectors.
- Check it in every Theme mode (Default, Graphite, Ember, Studio), Light and Dark, and both Density modes.

### 4. Finish

- `npm run typecheck && npm test && npm run build`, then `npm run build-storybook && npm run test:a11y`.
- Add a line to `CHANGELOG.md` under **Unreleased**.
- In the PR, link the Figma page (from your duplicate) or open a linked follow-up issue if someone else will do the Figma side.

## Changing tokens

Tokens are **generated**, never hand-edited. The sources:

| Source | Generates | Figma collection |
|---|---|---|
| `src/theme/presets.ts` (theme knobs) | `build/css/themes.css` | Theme (4 modes) + Primitives |
| `src/theme/engine.ts`, `palette.ts` (12-step OKLCH scales) | palettes in `themes.css` | Primitives |
| `src/theme/roles.ts` (colour roles) | `build/css/roles.css` (`light-dark()`) | Color (Light / Dark) |
| `src/tokens/foundations.ts` | `build/css/foundations.css` | Size, Density, Motion, text + effect styles |
| all of the above | `build/tokens.json` | used by the Figma sync |

Workflow:

1. Edit the source file.
2. `npm run build:tokens && npm test`. The contrast check fails if any text pair drops below WCAG AA in any theme or mode; the parity check fails if palettes no longer match the Figma primitives.
3. Mirror the change in Figma with the **same variable name** (role `label/secondary` ↔ CSS `--color-label-secondary`). A new preset also needs a new Theme mode in Figma (the collection holds 4 modes on a Pro plan).
4. Note the change in `CHANGELOG.md`. Renaming or removing a role or token is a **breaking change**.

## Accessibility and contrast

Evenkeel targets **WCAG 2.2 AA**. A change is not mergeable if it regresses any of these:

- **Contrast:** text ≥ 4.5:1, large text ≥ 3:1, UI parts (control borders, focus rings, chart marks that carry meaning) ≥ 3:1, in every theme × mode. `npm test` checks the token pairs; check any new pair you introduce.
- **Automated:** `npm run test:a11y` reports **zero** axe violations.
- **Keyboard:** everything works without a mouse. Follow the [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) pattern for the widget (menu, combobox, tabs, dialog…). Escape closes and returns focus. Focus is always visible.
- **Semantics:** native elements first (`<button>`, `<dialog>`, `<input>`), ARIA only when there is no native element.
- **Names:** every control has an accessible name; icon-only controls require `label`.
- **Colour is never the only signal:** status pairs colour with an icon or text; charts have labels, a legend or a table alternative.
- **Motion:** respect `prefers-reduced-motion`.
- **Target size:** at least 24×24 CSS px (WCAG 2.5.8), even in compact density.

Test with a screen reader (NVDA, JAWS, Orca or the one built into your OS) for any new interactive component, and say which one you used in the PR.

## Releasing

Maintainers only. See [docs/publishing.md](docs/publishing.md).

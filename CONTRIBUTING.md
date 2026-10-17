# Contributing

Thanks for taking a look. Bug reports, fixes and new components are all welcome.

For anything bigger than a small fix, please open an issue first so we can agree on the approach before you build it.

## Setup

You need Node 20.

```sh
git clone https://github.com/saishmenon/evenkeel.git
cd evenkeel
npm ci
npm run storybook   # http://localhost:6006
```

Before opening a pull request, run:

```sh
npm run typecheck && npm test && npm run build
```

`npm test` checks colour contrast in every theme and mode, and that the colour palettes still match the Figma file. CI also runs an accessibility scan (axe) on every story.

## Keeping Figma and code in step

Every component exists in both places with the same name. A Figma component called `Combo box` with a `Size` property becomes `ComboBox` with a `size` prop in React, and `.ek-combo-box` in CSS. If you change one side, either update the other or say in the pull request that it still needs doing.

Tokens are generated from `src/theme/` and `src/tokens/`, so edit those files rather than the CSS in `build/`. Renaming or removing a token is a breaking change.

## Adding a component

Copy an existing one (Badge is small, Table is large). A component folder has the component, its CSS and its stories. Use tokens for colour, spacing and type, export it from `src/index.ts`, and add its usage notes to `src/docs/content.ts`.

It should work with a keyboard, have an accessible name, and look right in all four themes, light and dark, and both densities.

## Pull requests

Keep them small, add before-and-after screenshots for visual changes, and add a line to `CHANGELOG.md` if users will notice the change.

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md).

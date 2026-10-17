# Using the Figma file

The [Figma file](https://www.figma.com/community/file/1691663776222213480/evenkeel-design-system) uses the same tokens, component names and variants as the React package.

## Set it up

1. Open the Community file and duplicate it.
2. Move the copy into a team project and publish it as a library (Assets › Libraries › Publish). Publishing a library needs a paid Figma plan. On a free plan you can still design inside the copy.
3. Turn the library on in your own files.
4. Select a frame and set its variable modes: a theme, light or dark, and a density. Everything inside follows, just like `data-theme`, `data-mode` and `data-density` in code.

The Get started page in the file explains the rest, and the User flows page is a good place to see everything working together.

## Variables

| Collection | Modes | In code |
|---|---|---|
| Theme | Default, Graphite, Ember, Studio | `data-theme` |
| Color | Light, Dark | `data-mode`, `--color-*` |
| Density | Comfortable, Compact | `data-density` |
| Size | | `--space-*`, `--radius-*` |
| Motion | | `--duration-*`, `--easing-*` |
| Palettes | Light, Dark | `--ek-*` |

Names translate directly. The variable `label/secondary` is `--color-label-secondary`, the text style `callout-emphasized` is `.text-callout-emphasized`, and a component set called `Combo box` with `Size = md` is `<ComboBox size="md">`. Hover, pressed and focus are variants in Figma but browser states in code.

## Tips

- Use variables and text styles rather than hard-coded values, so your designs follow themes and dark mode.
- Pick colour roles like `background/elevated`, not raw palette steps.
- Check your frame in light and dark before handing it off.
- Each component's description ends with an "In code" section showing the import and the matching props.

Found a problem? [Open an issue](https://github.com/saishmenon/evenkeel/issues/new?template=bug_report.yml) and choose "Figma file".

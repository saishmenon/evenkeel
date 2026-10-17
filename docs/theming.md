# Theming

An Evenkeel theme is **five knobs**. Everything else, about 150 colours plus radii and fonts, is generated from them and checked for contrast.

| Knob | Values | What it changes |
|---|---|---|
| `accent` | `{ light: '#hex', dark?: '#hex' }` | The 12-step accent scale: buttons, links, focus, selection. Dark is derived when omitted. |
| `neutral` | `slate` (cool) · `gray` (pure) · `sand` (warm) | Text, backgrounds, separators, borders |
| `shape` | `sharp` · `soft` · `round` | Radii for controls, containers and panels |
| `displayFont` | any font family | Headings and large titles |
| `textFont` | any font family | Body text and controls |

Status colours (danger, warning, success, info) are the **same in every theme**, so red always means danger.

## Built-in themes

| Theme | Accent | Neutral | Shape | Display font |
|---|---|---|---|---|
| `default` | Blue | Slate | Soft | Inter |
| `graphite` | Indigo | Gray | Sharp | Inter |
| `ember` | Orange | Sand | Round | Inter |
| `studio` | Purple | Sand | Round | Bricolage Grotesque |

Pick one with `data-theme`:

```html
<html data-theme="ember">
```

The knob values live in `src/theme/presets.ts` and are exported as `presets`:

```ts
import { presets } from 'evenkeel-ui';
presets.graphite; // { accent, neutral: 'gray', shape: 'sharp', ... }
```

## Light and dark

Every theme has a light and a dark mode. Colour roles are written with CSS `light-dark()`, so:

- With no `data-mode`, the page follows the OS (`color-scheme: light dark`).
- `data-mode="light"` or `data-mode="dark"` forces one, for that element and everything inside it.

```html
<body>                      <!-- follows the OS -->
  <aside data-mode="dark">  <!-- always dark -->
```

## Density

`data-density="compact"` tightens spacing, control heights and row heights (48px → 32px rows). Text size never changes, so compact stays readable. Use compact for logs, large tables and power-user screens; comfortable everywhere else.

## Custom themes at runtime

`applyTheme()` runs the same engine the build uses, in the browser:

```ts
import { applyTheme, clearTheme } from 'evenkeel-ui';

const el = document.documentElement;
applyTheme(el, {
  accent: { light: '#FF5A1F', dark: '#FF7A45' },
  neutral: 'sand',
  shape: 'round',
  displayFont: 'Bricolage Grotesque',
  textFont: 'Inter',
});
```

It writes the palette variables onto `el` as inline styles and sets `data-theme="custom"`. Colour roles recompute from those palettes, so every component restyles itself. `clearTheme(el, 'default')` removes the inline styles and returns to a preset.

Notes:

- **Scope it.** Pass any element, not only `<html>`, to theme part of a page (a preview card, a customer-branded portal).
- **Load your fonts.** `applyTheme` sets the font-family tokens; it does not download fonts.
- **Contrast.** The engine nudges the solid accent step until it reaches 3:1 against the page and its label (white or black, whichever works) reaches 4.5:1. A very light brand colour (yellows, pastels) may therefore come out darker than the hex you passed. Try your brand in Storybook › Foundations › Theming before you ship it.

## Theming a section

Because themes are attributes, you can mix them:

```html
<main data-theme="default">
  ...
  <section data-theme="studio" data-mode="dark">Marketing band</section>
</main>
```

## Adding a built-in theme

1. Add an entry to `presets` in `src/theme/presets.ts`.
2. `npm run build:tokens && npm test`. The contrast check fails if any text pair drops below WCAG AA in either mode.
3. Add `data-theme` to the Storybook toolbar in `.storybook/preview.tsx`.
4. Add a matching mode to the **Theme** collection in Figma (see [figma.md](figma.md)). On a Figma Professional plan a collection holds at most 4 modes; more needs an Organization plan or a separate file.

## Overriding individual tokens

Prefer the knobs. If you must override a role, do it on a theme selector so both modes keep working:

```css
[data-theme="default"] {
  --color-border-focus: light-dark(#0055d4, #6aa7ff);
}
```

Overriding palette steps (`--palette-*`) directly is unsupported: they are regenerated on every build and their names may change.

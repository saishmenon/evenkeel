# Tokens

Evenkeel's tokens are **generated, never hand-edited**. TypeScript sources in `src/theme/` and `src/tokens/` produce the CSS custom properties in `build/css/` and `build/tokens.json`, which feeds the Figma variables. Run `npm run build:tokens` after any change.

They come in four layers. Each layer only reads from the one below it, and components only read the top two.

```
primitives  →  theme  →  roles  →  foundations
(scales)       (5 knobs)  (by job)   (space, type, depth, motion, density)
                              ↑            ↑
                              └─ components ┘
```

## 1. Primitives: colour scales

Source: `src/theme/engine.ts`, `src/theme/palette.ts`, `src/theme/palettes.ts`

Every colour is a **12-step scale** generated in OKLCH, one for light and one for dark. Each step has one job:

| Steps | Job |
|---|---|
| 1–2 | App and subtle backgrounds |
| 3–5 | Control backgrounds: resting, hover, pressed |
| 6–8 | Separators, control borders, focus rings |
| 9–10 | Solid fills: resting, hover (step 9 is the brand colour) |
| 11 | Readable coloured text |
| 12 | High-contrast text |

The theme's scales are written as `--palette-<scale>-<mode>-<step>`, for example `--palette-accent-light-9` or `--palette-neutral-alpha-dark-11`. Treat these as **internal**: use roles instead.

### Palettes

Beside the theme scales sit larger palettes for illustration, tagging and data visualisation:

| Palette | Contents | CSS |
|---|---|---|
| Spectrum | 13 hues × 12 steps, light and dark | `--ek-<hue>-<step>` (switches with mode), `--ek-<hue>-light-<step>`, `--ek-<hue>-dark-<step>` |
| Greys | Slate, gray and sand as static scales, plus the theme's own neutral | `--ek-slate-<step>`, `--ek-gray-<step>`, `--ek-sand-<step>`, `--ek-neutral-<step>` (follows the theme) |
| Viz | Categorical (12), sequential and diverging ramps, chart status colours, each reaching 3:1 on chart backgrounds | `--ek-viz-cat-1…12`, `--ek-viz-seq-<ramp>-1…9`, `--ek-viz-div-<ramp>-1…11`, `--ek-viz-<status>` |

Spectrum hues: red, orange, amber, yellow, lime, green, teal, cyan, blue, indigo, violet, purple, pink. See Storybook › Foundations › Color for every swatch with its contrast.

## 2. Theme

Source: `src/theme/presets.ts`

A theme picks scales and shape from five knobs (accent, neutral, shape, display font, text font) and exposes them per `[data-theme]`:

- the accent and neutral palettes (`--palette-accent-*`, `--palette-neutral-*`)
- `--radius-control`, `--radius-container`, `--radius-panel`
- `--font-display`, `--font-text`

See [Theming](theming.md).

## 3. Roles: colour by job

Source: `src/theme/roles.ts` → `build/css/roles.css`

Roles are what components and designers use. They are named by **what the colour is for**, not what it looks like, and each one holds a light and a dark value via `light-dark()`.

| Group | Roles | Use for |
|---|---|---|
| `label/*` | `primary`, `secondary`, `tertiary`, `quaternary`, `link`, `on-accent` | Text and icons, from most to least important |
| `fill/*` | `primary` … `quaternary` | Control and chip fills on top of backgrounds |
| `background/*` | `primary`, `secondary`, `tertiary`, `grouped`, `grouped-item`, `elevated` | Surfaces |
| `separator/*` | `default`, `opaque` | Dividers and hairlines |
| `border/*` | `control`, `control-hover`, `focus`, `invalid` | Field outlines and focus rings |
| `control/*` | `track-off`, `knob` | Toggles and sliders |
| `accent/*` | `solid`, `solid-hover`, `subtle`, `subtle-hover`, `border` | Brand fills and selection |
| `danger/*` `warning/*` `success/*` `info/*` | `solid`, `text`, `subtle`, `border`, `on-solid` | Status |
| `material/*` | `thick`, `regular`, `thin`, `ultrathin` | Translucent, blurred surfaces |
| `overlay/scrim`, `shadow/color` | | Behind sheets; shadow tint |

Naming is the same in Figma and code: the Figma variable **`label/secondary`** is the CSS custom property **`--color-label-secondary`** (slash becomes hyphen, `--color-` prefix).

## 4. Foundations

Source: `src/tokens/foundations.ts` → `build/css/foundations.css`

| Foundation | Tokens | Notes |
|---|---|---|
| Space | `--space-0` … `--space-24`, plus half steps like `--space-1_5` | 4-point grid; `--space-1` = 4px |
| Radius | `--radius-none` … `--radius-full`, and the theme's `--radius-control` / `-container` / `-panel` | Prefer the three semantic radii |
| Type | 15 text styles as classes: `.text-display-1`, `.text-display-2`, `.text-large-title`, `.text-title-1` … `-3`, `.text-headline`, `.text-body`, `.text-callout`, `.text-callout-emphasized`, `.text-subheadline`, `.text-subheadline-emphasized`, `.text-footnote`, `.text-footnote-emphasized`, `.text-caption` | Every size in the system is one of these, matching the Figma text styles |
| Depth | `--elevation-1` … `--elevation-3` | Shadows tinted by `shadow/color` |
| Materials | `--blur-material-thick` … `-ultrathin` | Paired with `material/*` roles |
| Motion | `--duration-instant` / `-quick` / `-standard` / `-slow`, `--easing-standard` / `-enter` / `-exit` / `-spring` | Components that animate respect `prefers-reduced-motion` |
| Density | `--control-height-sm` / `-md` / `-lg`, `--control-padding-x`, `--control-gap`, `--field-gap`, `--row-height`, `--container-padding`, `--section-gap` | Switch with `data-density` |

## tokens.json

`evenkeel-ui/tokens.json` is the same data as JSON, shaped for the Figma sync: primitives keyed by `<scale>/<mode>/<step>`, theme modes, roles and foundations. Use it to feed other tools (native apps, documentation sites, Style Dictionary).

## Rules for contributors

- Never hand-edit `build/`. Change the source and rebuild.
- Components use **roles and foundations only**: no hex values, no `--palette-*`, no pixel sizes outside the scales.
- Renaming or removing a role or token is a **breaking change** and must be mirrored in Figma in the same release.

# Using the Figma library

Evenkeel's Figma library is the design half of the system. It uses the same tokens, the same component names and the same variants as the React package, so a design built with it can be handed off without a translation step.

**Community file:** [Evenkeel on Figma Community](https://www.figma.com/community/file/1691663776222213480/evenkeel-design-system)

## Get started

1. **Duplicate.** Open the Community file and click **Open in Figma** (or **Duplicate**). A copy lands in your drafts.
2. **Move it to a team.** Drag the copy into a team project so others can use it.
3. **Publish it as a library.** In the copy, open the **Assets** panel → **Libraries** (book icon) → **Publish**. Publish variables, styles and components.
4. **Enable it in your files.** In any design file: **Assets → Libraries →** turn on *Evenkeel*. Components appear in the Assets panel; variables appear in the fill, stroke, radius and spacing pickers.
5. **Set modes on a frame.** Select a top-level frame → **Layer** section of the right panel → the variable-mode control. Choose a Theme, a Color mode (Light/Dark) and a Density. Everything inside follows, exactly like `data-theme`, `data-mode` and `data-density` in code.

Publishing a library needs a paid Figma plan. On a free plan you can still design inside the duplicated file itself.

## What's in the file

The page list is split into sections by dividers. Each section starts with an overview page, and its pages are indented underneath (↳). Components are grouped one level deeper (◇ Actions, ◇ Inputs …).

| Section | Contents |
|---|---|
| 📘 Cover, 👋 Get started | How to use the file |
| 🎨 Foundations | Theming, Color, Color palettes, Typography, Spacing & density, Shape, depth & materials, Motion, Icons, Illustrations |
| 🧩 Components | One page per component in six groups (Actions, Inputs, Status & feedback, Layout & navigation, Data & charts, Overlays), with the same usage guidance as Storybook |
| ✨ AI | AI components, AI patterns (7 principles, 9 patterns) and AI templates for Mintline |
| 📱 Mobile app | Mobile foundations (type scale, touch targets, safe areas), mobile components and 16 Mintline app screens (one in Graphite dark). Its three phone flows sit in the story on the User flows page. Figma only for now |
| 🧭 Patterns | Pattern guide: payments list, payment details, create flow, dashboard, empty states, expressive theming |
| 🖥️ Templates | Views (table, list, grid, board, calendar, timeline, split), Account, Data, Auth. Each page opens with a header and a contents list; each template sits in its own section with a description, the user flow it appears in, and its Storybook name |
| 🔀 Flows & demos | Twelve user flows told as one story, *A week at Lantern Bikes*: a story page with the cast and the week, then chapters 1–5 and Everyday. Each flow has a header (who, when, web or phone, what comes before and after), numbered steps, and arrows from the element clicked. Plus demos for Mintline, the fictional payments platform used in the examples |
| 🪪 Brand & marketing | Logo, brand guide and marketing templates |

## Variable collections

| Collection | Modes | What it holds | Code equivalent |
|---|---|---|---|
| **Primitives** | – (hidden from publishing) | Every 12-step scale for every theme, light and dark | `--palette-*` (internal) |
| **Theme** | Default · Graphite · Ember · Studio | Which accent and neutral scale, radii, font families | `data-theme`, `--radius-control`, `--font-text` … |
| **Color** | Light · Dark | Colour roles, aliased to Theme and Primitives | `data-mode`, `--color-*` |
| **Density** | Comfortable · Compact | Control heights, padding, gaps, row height | `data-density`, `--control-height-md` … |
| **Size** | – | Space and radius scales | `--space-*`, `--radius-*` |
| **Motion** | – | Durations and easings (for prototypes and documentation) | `--duration-*`, `--easing-*` |
| **Palettes** | Light · Dark | Spectrum hues, greys and data-viz palettes | `--ek-<hue>-<step>`, `--ek-viz-*` |

Text is set with **15 text styles** (Display 1 → Caption) and shadows with **effect styles** (Elevation 1–3), matching the `.text-*` classes and `--elevation-*` tokens.

### Name mapping

| Figma | Code |
|---|---|
| Variable `label/secondary` | `--color-label-secondary` |
| Variable `control/height-md` | `--control-height-md` |
| Text style `callout-emphasized` | `.text-callout-emphasized` |
| Component set `Combo box` | `<ComboBox>` |
| Variant property `Size = md` | `size="md"` |
| Variant `State = hover / pressed / focus` | Browser states (`:hover`, `:active`, `:focus-visible`), not props |
| Variant `State = disabled` | `disabled` prop |

## Rules when designing with Evenkeel

- **Bind everything.** Fills, strokes, radii, padding and gaps should use variables; text should use a text style. A hard-coded colour will not follow themes or dark mode, and it will not exist in code.
- **Use roles, not primitives.** Pick `background/elevated`, not `slate/light/1`.
- **Use `Icon/*` instances**, never pasted vectors, so icons swap and recolour.
- **Check all modes.** Flip the frame through every Theme, Light and Dark, and both densities before handing off.

### Finding the code for a component

Every component's description in Figma ends with an **In code** section: the import, a short example, how each Figma property maps to a React prop, and where it lives in Storybook. Select a component or instance and read it in the right panel (or in Dev Mode). Mobile components say they are Figma only for now.

Figma's Code Connect would show this automatically, but it needs an Organization or Enterprise plan, so Evenkeel uses descriptions instead.

## Keeping Figma and code in sync

Code is the source of truth for token **values**; the two must agree on **names**.

1. Token values are generated by `npm run build:tokens` into `build/tokens.json`.
2. The scripts in `scripts/figma/` read that data and write it into the Figma variable collections (and build the component docs pages from `src/docs/content.ts`). They run through Figma's plugin API, for example from a development plugin or an MCP-connected agent.
3. `npm run test:parity` compares the theme palettes in code against the primitives in `build/tokens.json` and fails on any mismatch. CI runs it on every pull request.
4. Component changes must land in both places in the same release. A pull request that changes a component links the Figma page (or a follow-up issue) in its description; see [CONTRIBUTING.md](../CONTRIBUTING.md).

### Parity check before a release

- [ ] `npm test` passes (contrast + parity).
- [ ] Every new or renamed role, token, text style and component exists in Figma with the same name.
- [ ] Variant properties match React props (names and values).
- [ ] The Figma file has no unbound colours (select all → **Selection colors** shows only variables).
- [ ] Every Theme × Color × Density mode combination has been eyeballed on the component pages.
- [ ] The Figma file's version note uses the same version number as the npm package.

## Reporting a Figma problem

Use the [Figma issue template](https://github.com/saishmenon/evenkeel/issues/new?template=figma_issue.yml) and include the page name, the layer, and the modes you had set.

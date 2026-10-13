/**
 * COLOUR ROLES (what designers and components use)
 * ------------------------------------------------
 * Named by job (label, fill, background, separator), then adapted for web apps (border, accent, status, material).
 *
 * Each role points at a step of a scale. The scale itself comes from the theme,
 * so switching theme or mode never requires touching a component.
 *
 * Reference format:
 *   'neutral.12'   solid neutral, step 12
 *   'neutralA.11'  alpha neutral, step 11 (see-through: works on materials)
 *   'accent.9'     theme accent
 *   'red.9'        status hue (same in every theme)
 *   'violet.9'     any other spectrum hue (src/theme/palettes.ts), same in every theme
 *   'onAccent'     white or black, whichever passes AA on accent.9
 *   'material.regular'  frosted background, theme-dependent
 *   'white' | 'black' | '#rrggbbaa'
 */
export type Scope = 'text' | 'fill' | 'stroke' | 'effect';
export interface Role { name: string; light: string; dark: string; scope: Scope; description: string }

const status = (name: string, hue: string): Role[] => [
  { name: `${name}/solid`, light: `${hue}.9`, dark: `${hue}.9`, scope: 'fill', description: `Solid ${name} fill for buttons, badges and indicators` },
  { name: `${name}/text`, light: `${hue}.11`, dark: `${hue}.11`, scope: 'text', description: `Readable ${name} text and icons on neutral backgrounds` },
  { name: `${name}/subtle`, light: `${hue}.3`, dark: `${hue}.3`, scope: 'fill', description: `Tinted ${name} background for banners and badges` },
  { name: `${name}/border`, light: `${hue}.7`, dark: `${hue}.7`, scope: 'stroke', description: `${name} outline, e.g. an invalid field or banner edge` },
  { name: `${name}/on-solid`, light: `on:${hue}`, dark: `on:${hue}`, scope: 'text', description: `Text on the solid ${name} fill` },
];

export const roles: Role[] = [
  // LABELS: text and icons, from most to least important (primary → quaternary)
  { name: 'label/primary', light: 'neutral.12', dark: 'neutral.12', scope: 'text', description: 'Body text, titles, primary icons' },
  { name: 'label/secondary', light: 'neutralA.11', dark: 'neutralA.11', scope: 'text', description: 'Supporting text, descriptions (passes AA)' },
  { name: 'label/tertiary', light: 'neutralA.9', dark: 'neutralA.9', scope: 'text', description: 'Placeholders, hints. Not for essential text' },
  { name: 'label/quaternary', light: 'neutralA.8', dark: 'neutralA.8', scope: 'text', description: 'Disabled text' },
  { name: 'label/link', light: 'accent.11', dark: 'accent.11', scope: 'text', description: 'Links and accent-coloured text' },
  { name: 'label/on-accent', light: 'onAccent', dark: 'onAccent', scope: 'text', description: 'Text and icons on accent/solid' },

  // FILLS: see-through greys for controls
  { name: 'fill/primary', light: 'neutralA.5', dark: 'neutralA.5', scope: 'fill', description: 'Pressed control, selected row' },
  { name: 'fill/secondary', light: 'neutralA.4', dark: 'neutralA.4', scope: 'fill', description: 'Hovered control' },
  { name: 'fill/tertiary', light: 'neutralA.3', dark: 'neutralA.3', scope: 'fill', description: 'Resting control (segmented control, toggle off)' },
  { name: 'fill/quaternary', light: 'neutralA.2', dark: 'neutralA.2', scope: 'fill', description: 'Very subtle wash, e.g. table header' },

  // BACKGROUNDS: layered surfaces (base + grouped backgrounds)
  { name: 'background/primary', light: 'white', dark: 'neutral.1', scope: 'fill', description: 'The main app canvas' },
  { name: 'background/secondary', light: 'neutral.2', dark: 'neutral.2', scope: 'fill', description: 'Sidebars, side panels' },
  { name: 'background/tertiary', light: 'neutral.3', dark: 'neutral.3', scope: 'fill', description: 'Wells and insets inside secondary areas' },
  { name: 'background/grouped', light: 'neutral.2', dark: 'neutral.1', scope: 'fill', description: 'Page behind grouped cards (settings-style layouts)' },
  { name: 'background/grouped-item', light: 'white', dark: 'neutral.3', scope: 'fill', description: 'Cards and rows sitting on background/grouped' },
  { name: 'background/elevated', light: 'white', dark: 'neutral.3', scope: 'fill', description: 'Popovers, menus, sheets (lighter in dark mode = closer to you)' },

  // SEPARATORS & BORDERS
  { name: 'separator/default', light: 'neutralA.6', dark: 'neutralA.6', scope: 'stroke', description: 'Hairlines between content (see-through)' },
  { name: 'separator/opaque', light: 'neutral.6', dark: 'neutral.6', scope: 'stroke', description: 'Separators that must not show what is behind' },
  { name: 'border/control', light: 'neutralA.9', dark: 'neutralA.9', scope: 'stroke', description: 'Text field and select outlines (3:1, so fields are findable)' },
  { name: 'border/control-hover', light: 'neutralA.10', dark: 'neutralA.10', scope: 'stroke', description: 'Control outline on hover' },
  { name: 'border/focus', light: 'accent.11', dark: 'accent.11', scope: 'stroke', description: 'Keyboard focus ring (3:1 on every theme)' },
  { name: 'border/invalid', light: 'red.11', dark: 'red.11', scope: 'stroke', description: 'Outline of a field with an error (3:1, not colour alone: always paired with a message)' },

  // CONTROL PARTS: pieces of switches and similar controls
  { name: 'control/track-off', light: 'neutralA.9', dark: 'neutralA.9', scope: 'fill', description: 'Toggle track when off (3:1, so the off state is visible)' },
  { name: 'control/knob', light: 'white', dark: 'white', scope: 'fill', description: 'Toggle knob. White in both modes' },

  // ACCENT: the theme's brand colour
  { name: 'accent/solid', light: 'accent.9', dark: 'accent.9', scope: 'fill', description: 'Primary buttons, selected toggles, active indicators' },
  { name: 'accent/solid-hover', light: 'accent.10', dark: 'accent.10', scope: 'fill', description: 'accent/solid on hover' },
  { name: 'accent/subtle', light: 'accent.3', dark: 'accent.3', scope: 'fill', description: 'Tinted background, e.g. selected sidebar item' },
  { name: 'accent/subtle-hover', light: 'accent.4', dark: 'accent.4', scope: 'fill', description: 'accent/subtle on hover' },
  { name: 'accent/border', light: 'accent.7', dark: 'accent.7', scope: 'stroke', description: 'Accent outline' },

  // STATUS: same hues in every theme
  ...status('danger', 'red'),
  { name: 'danger/subtle-hover', light: 'red.4', dark: 'red.4', scope: 'fill', description: 'Destructive button background on hover' },
  ...status('warning', 'yellow'),
  ...status('success', 'green'),
  ...status('info', 'blue'),

  // AI: marks AI-generated content and AI entry points only, never decoration. Violet spectrum, same in every theme.
  { name: 'ai/solid', light: 'violet.9', dark: 'violet.9', scope: 'fill', description: 'AI badge fill, the primary AI action, the streaming caret' },
  { name: 'ai/solid-hover', light: 'violet.10', dark: 'violet.10', scope: 'fill', description: 'ai/solid on hover' },
  { name: 'ai/subtle', light: 'violet.3', dark: 'violet.3', scope: 'fill', description: 'Background of AI messages, summaries and suggestions' },
  { name: 'ai/border', light: 'violet.7', dark: 'violet.7', scope: 'stroke', description: 'Outline of AI-generated content' },
  { name: 'ai/text', light: 'violet.11', dark: 'violet.11', scope: 'text', description: 'AI labels and links inside AI content (passes AA on ai/subtle and the page)' },
  { name: 'ai/on-solid', light: 'white', dark: 'white', scope: 'text', description: 'Text and icons on ai/solid' },

  // MATERIALS: frosted, see-through surfaces. Pair with a backdrop blur.
  { name: 'material/thick', light: 'material.thick', dark: 'material.thick', scope: 'fill', description: 'Mostly opaque: sheets over busy content' },
  { name: 'material/regular', light: 'material.regular', dark: 'material.regular', scope: 'fill', description: 'Toolbars, sidebars over content' },
  { name: 'material/thin', light: 'material.thin', dark: 'material.thin', scope: 'fill', description: 'Popovers and overlays on calm content' },
  { name: 'material/ultrathin', light: 'material.ultrathin', dark: 'material.ultrathin', scope: 'fill', description: 'Expressive glass for marketing pages' },

  // OVERLAYS & SHADOWS
  { name: 'overlay/scrim', light: '#0000004d', dark: '#00000099', scope: 'fill', description: 'Dims the page behind a sheet or dialog' },
  { name: 'shadow/color', light: '#0000001f', dark: '#00000080', scope: 'effect', description: 'Colour of elevation shadows' },
];

/** Material opacity: how much of background/primary shows. */
export const materialAlpha = { thick: 0.92, regular: 0.8, thin: 0.66, ultrathin: 0.5 };

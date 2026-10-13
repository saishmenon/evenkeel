/**
 * THEMES = five knobs.
 * Change these and everything else (≈150 colours, radii, fonts) follows.
 */
export type NeutralName = 'slate' | 'gray' | 'sand';
export type ShapeName = 'sharp' | 'soft' | 'round';

export interface ThemeConfig {
  /** One brand colour per mode. Dark can be omitted; it is derived. */
  accent: { light: string; dark?: string };
  neutral: NeutralName;
  shape: ShapeName;
  /** Font for headings. Body text always uses the text font for readability. */
  displayFont: string;
  textFont: string;
}

/** Bright, friendly system hues (light / dark variants). */
export const hues = {
  blue:   { light: '#007AFF', dark: '#0A84FF' },
  indigo: { light: '#5856D6', dark: '#5E5CE6' },
  purple: { light: '#AF52DE', dark: '#BF5AF2' },
  orange: { light: '#FF9500', dark: '#FF9F0A' },
  red:    { light: '#FF3B30', dark: '#FF453A' },
  green:  { light: '#34C759', dark: '#30D158' },
  yellow: { light: '#FFCC00', dark: '#FFD60A' },
} as const;
export type HueName = keyof typeof hues;

export const neutrals: Record<NeutralName, { hue: number; chroma: number }> = {
  slate: { hue: 265, chroma: 0.012 }, // cool, a touch of blue
  gray:  { hue: 0,   chroma: 0 },     // pure
  sand:  { hue: 75,  chroma: 0.010 }, // warm
};

/** Corner radii per shape: control (buttons, inputs) · container (cards) · panel (sheets) */
export const shapes: Record<ShapeName, { control: number; container: number; panel: number }> = {
  sharp: { control: 4, container: 6, panel: 8 },
  soft:  { control: 8, container: 12, panel: 16 },
  round: { control: 12, container: 20, panel: 28 },
};

export const presets = {
  default:  { accent: hues.blue,   neutral: 'slate', shape: 'soft',  displayFont: 'Inter', textFont: 'Inter' },
  graphite: { accent: hues.indigo, neutral: 'gray',  shape: 'sharp', displayFont: 'Inter', textFont: 'Inter' },
  ember:    { accent: hues.orange, neutral: 'sand',  shape: 'round', displayFont: 'Inter', textFont: 'Inter' },
  studio:   { accent: hues.purple, neutral: 'sand',  shape: 'round', displayFont: 'Bricolage Grotesque', textFont: 'Inter' },
} satisfies Record<string, ThemeConfig>;
export type PresetName = keyof typeof presets;

/** Status colours stay the same in every theme, so "red means danger" everywhere. */
export const status = { danger: 'red', warning: 'yellow', success: 'green', info: 'blue' } as const satisfies Record<string, HueName>;

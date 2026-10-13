/**
 * NON-COLOUR FOUNDATIONS
 * Everything here is the same in every theme, except where noted.
 */

/** Spacing: a 4-point grid, with half steps where controls need them. */
export const space = {
  '0': 0, '0.5': 2, '1': 4, '1.5': 6, '2': 8, '2.5': 10, '3': 12, '3.5': 14, '4': 16,
  '5': 20, '6': 24, '8': 32, '10': 40, '12': 48, '16': 64, '20': 80, '24': 96,
} as const;

/** Raw radius scale. Components use the theme's shape roles, not these directly. */
export const radius = { none: 0, xs: 2, sm: 4, md: 8, lg: 12, xl: 16, '2xl': 20, '3xl': 28, full: 9999 } as const;

/**
 * DENSITY: comfortable (generous breathing room) vs compact (dense dashboards).
 * Values are space-scale keys, so density only re-points; it never invents numbers.
 */
export const density = {
  'control/height-sm': { comfortable: '8', compact: '6' },      // 32 / 24
  'control/height-md': { comfortable: '10', compact: '8' },     // 40 / 32
  'control/height-lg': { comfortable: '12', compact: '10' },    // 48 / 40
  'control/padding-x': { comfortable: '3.5', compact: '2.5' },  // 14 / 10
  'control/gap': { comfortable: '2', compact: '1.5' },          // 8 / 6
  'field/gap': { comfortable: '1.5', compact: '1' },            // label → box: 6 / 4
  'row/height': { comfortable: '12', compact: '8' },            // list & table rows: 48 / 32
  'container/padding': { comfortable: '5', compact: '4' },      // cards: 20 / 16
  'section/gap': { comfortable: '8', compact: '6' },            // between sections: 32 / 24
} as const;

/**
 * TYPE: text styles named by role (large title → caption), sized for web.
 * Data-heavy apps are read up close and all day, so body is 15px
 * and every role steps down to match.
 * `font: 'display'` styles use the theme's display font (expressive themes can swap it).
 */
export type TextStyle = { size: number; line: number; weight: 400 | 500 | 600 | 700; tracking: number; font: 'display' | 'text'; description: string };
export const textStyles: Record<string, TextStyle> = {
  'display-1':   { size: 64, line: 68, weight: 700, tracking: -3,   font: 'display', description: 'Hero headlines (marketing, onboarding)' },
  'display-2':   { size: 48, line: 52, weight: 700, tracking: -2.5, font: 'display', description: 'Large feature headlines' },
  'large-title': { size: 34, line: 40, weight: 700, tracking: -2,   font: 'display', description: 'Page title' },
  'title-1':     { size: 28, line: 34, weight: 600, tracking: -1.5, font: 'display', description: 'Section title' },
  'title-2':     { size: 22, line: 28, weight: 600, tracking: -1,   font: 'display', description: 'Card or panel title' },
  'title-3':     { size: 20, line: 25, weight: 600, tracking: -0.5, font: 'display', description: 'Group title' },
  'headline':    { size: 15, line: 22, weight: 600, tracking: 0,    font: 'text', description: 'Emphasised body: list titles, table headers' },
  'body':        { size: 15, line: 22, weight: 400, tracking: 0,    font: 'text', description: 'Default text' },
  'callout':     { size: 14, line: 20, weight: 400, tracking: 0,    font: 'text', description: 'Controls, dense text, alerts' },
  'callout-emphasized': { size: 14, line: 20, weight: 500, tracking: 0, font: 'text', description: 'Button labels, field labels' },
  'subheadline': { size: 13, line: 18, weight: 400, tracking: 0,    font: 'text', description: 'Secondary text in rows and cards' },
  'subheadline-emphasized': { size: 13, line: 18, weight: 500, tracking: 0, font: 'text', description: 'Small buttons, tabs' },
  'footnote':    { size: 12, line: 16, weight: 400, tracking: 0,    font: 'text', description: 'Helper and error text' },
  'footnote-emphasized': { size: 12, line: 16, weight: 500, tracking: 1, font: 'text', description: 'Badges, overlines' },
  'caption':     { size: 11, line: 14, weight: 400, tracking: 1,    font: 'text', description: 'Timestamps, chart labels' },
};
/** Font style names in Figma for each weight. Inter writes "Semi Bold" with a space; Bricolage writes "SemiBold". */
export const weightStyle = { 400: 'Regular', 500: 'Medium', 600: 'Semi Bold', 700: 'Bold' } as const;
export const figmaStyle = (family: string, weight: keyof typeof weightStyle) =>
  family === 'Inter' ? weightStyle[weight] : weightStyle[weight].replace(' ', '');

/** DEPTH: elevation shadows. Colour comes from the shadow/color role, so dark mode gets deeper shadows. */
export const elevation = {
  '1': [{ y: 1, blur: 2, spread: 0, alpha: 0.6 }, { y: 1, blur: 3, spread: 0, alpha: 0.4 }],   // cards that lift on hover
  '2': [{ y: 4, blur: 12, spread: -2, alpha: 0.7 }, { y: 2, blur: 4, spread: -1, alpha: 0.4 }], // popovers, menus
  '3': [{ y: 12, blur: 32, spread: -6, alpha: 0.9 }, { y: 4, blur: 8, spread: -2, alpha: 0.4 }],// sheets, dialogs
} as const;

/** Blur for materials (backdrop-filter in code, background blur in Figma). */
export const materialBlur = { thick: 40, regular: 30, thin: 20, ultrathin: 16 } as const;

/**
 * MOTION: physical, not mechanical.
 * Springs in CSS are approximated with linear() easing curves.
 */
export const motion = {
  duration: { instant: 100, quick: 200, standard: 300, slow: 500 },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',       // most UI changes
    enter: 'cubic-bezier(0, 0, 0, 1)',             // things arriving
    exit: 'cubic-bezier(0.3, 0, 1, 1)',            // things leaving
    // a gentle spring with a tiny overshoot (≈ SwiftUI .smooth / .snappy)
    spring: 'linear(0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.723 15.5%, 0.938 20.7%, 1.017 25.1%, 1.04 29.2%, 1.039 33.8%, 1.004 46.6%, 0.997 55.3%, 1)',
  },
} as const;

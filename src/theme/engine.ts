/**
 * EVENKEEL THEME ENGINE
 * ------------------
 * Turns one colour into a 12-step scale for light and dark mode.
 * Used in two places:
 *   1. At build time  → preset themes → CSS files + Figma variables
 *   2. At runtime     → applyTheme({ accent: '#FF5A1F' }) for custom themes
 *
 * The 12 steps each have one job (same idea as Radix Colors):
 *   1–2   app and subtle backgrounds
 *   3–5   control backgrounds: resting, hover, pressed
 *   6–8   separators, control borders, focus rings
 *   9–10  solid fills: resting, hover   (step 9 = your brand colour)
 *   11    readable coloured text
 *   12    high-contrast text
 */
import { converter, formatHex, formatHex8, inGamut, wcagContrast, clampChroma, type Oklch } from 'culori';

const toOklch = converter('oklch');
const inSrgb = inGamut('rgb');

export type Mode = 'light' | 'dark';
export type Scale = string[]; // 12 hex colours, index 0 = step 1

// Lightness targets per step. Step 9 is replaced by the brand colour.
const L = {
  light: [0.993, 0.982, 0.962, 0.940, 0.915, 0.885, 0.840, 0.775, 0, 0, 0.520, 0.300],
  dark:  [0.170, 0.200, 0.250, 0.290, 0.325, 0.365, 0.425, 0.510, 0, 0, 0.790, 0.945],
};
// How much of the brand's chroma each step keeps.
const C = {
  light: [0.06, 0.12, 0.22, 0.32, 0.42, 0.52, 0.64, 0.80, 1, 1, 0.92, 0.42],
  dark:  [0.20, 0.25, 0.38, 0.48, 0.56, 0.62, 0.70, 0.82, 1, 1, 0.80, 0.30],
};

const fit = (c: Oklch): string => formatHex(inSrgb(c) ? c : clampChroma(c, 'oklch'));

/** Make a 12-step scale from a brand colour. */
export function makeScale(base: string, mode: Mode): Scale {
  const b = toOklch(base)!;
  const hue = b.h ?? 0;
  const steps = L[mode].map((l, i) => {
    if (i === 8) return formatHex(b as any)!;
    if (i === 9) {
      // hover: a little darker in light mode, a little lighter in dark mode
      const dl = mode === 'light' ? -0.045 : 0.05;
      return fit({ mode: 'oklch', l: b.l + dl, c: b.c, h: hue });
    }
    return fit({ mode: 'oklch', l, c: b.c * C[mode][i], h: hue });
  });
  return steps;
}

/** A neutral scale is just a scale with very little chroma. */
export function makeNeutral(hue: number, chroma: number, mode: Mode): Scale {
  const steps = L[mode].map((l, i) => {
    const target = i === 8 ? (mode === 'light' ? 0.640 : 0.560) : i === 9 ? (mode === 'light' ? 0.600 : 0.620) : l;
    // neutrals stay calm: chroma peaks gently in the middle
    const c = chroma * (i < 2 ? 0.5 : i > 10 ? 0.7 : 1);
    return fit({ mode: 'oklch', l: target, c, h: hue });
  });
  return steps;
}

/**
 * Alpha version of a neutral scale: the same colours, made from one ink at
 * different transparencies. Alpha greys look right on any surface,
 * including frosted materials. That's why label colours are alpha.
 */
export function makeAlpha(solid: Scale, mode: Mode): Scale {
  const bg = mode === 'light' ? { r: 1, g: 1, b: 1 } : { r: 0.04, g: 0.04, b: 0.05 };
  const inkHex = mode === 'light' ? solid[11] : solid[11];
  const ink = converter('rgb')(mode === 'light' ? '#000' : '#fff')!;
  const tint = converter('rgb')(inkHex)!;
  return solid.map((hex) => {
    const c = converter('rgb')(hex)!;
    // solve c = a*ink + (1-a)*bg using the average channel
    const a = Math.min(1, Math.max(0, ((bg.r - c.r) + (bg.g - c.g) + (bg.b - c.b)) / ((bg.r - ink.r) + (bg.g - ink.g) + (bg.b - ink.b))));
    // keep the neutral's tint in the ink so tinted greys stay tinted
    const mix = mode === 'light' ? 0.35 : 0.0;
    return formatHex8({ mode: 'rgb', r: ink.r * (1 - mix) + tint.r * mix, g: ink.g * (1 - mix) + tint.g * mix, b: ink.b * (1 - mix) + tint.b * mix, alpha: Math.round(a * 1000) / 1000 });
  });
}

/**
 * Text that sits on a solid accent fill: white if it reaches AA (4.5:1),
 * otherwise near-black. Yellow and light green get dark text this way.
 * If white is close but not quite there, the fill is nudged darker until
 * it passes, so bright blues still meet WCAG AA on the web.
 */
export function solidWithOnColor(
  scale: Scale,
  mode: Mode,
  opts: { page?: string } = {},
): { scale: Scale; on: 'white' | 'black' } {
  const s = [...scale];
  let c = toOklch(s[8])!;
  const hex = () => fit(c);

  // 1. If a page colour is given, the fill itself must stand out from it (3:1),
  //    so a checked checkbox or a toggle is visible. Bright oranges get deepened.
  if (opts.page) {
    const dir = mode === 'light' ? -1 : 1;
    for (let i = 0; i < 40 && wcagContrast(hex(), opts.page) < 3; i++) c = { ...c, l: c.l + dir * 0.01 };
  }
  // 2. Pick the text colour that reaches AA. If neither does, deepen until white does.
  //    White text is preferred (it looks crisper): a small deepening of the
  //    fill (up to 0.08 lightness) is allowed to get there. Only genuinely light
  //    colours (orange, yellow, light green) switch to dark text.
  let on: 'white' | 'black';
  let trial = { ...c };
  for (let i = 0; i < 8 && wcagContrast(fit(trial), '#ffffff') < 4.5; i++) trial = { ...trial, l: trial.l - 0.01 };
  if (wcagContrast(fit(trial), '#ffffff') >= 4.5) { c = trial; on = 'white'; }
  else if (wcagContrast(hex(), '#111111') >= 4.5) on = 'black';
  else {
    for (let i = 0; i < 30 && wcagContrast(hex(), '#ffffff') < 4.5; i++) c = { ...c, l: c.l - 0.01 };
    on = 'white';
  }
  s[8] = hex();
  // 3. Hover moves AWAY from the text colour, so the label never loses contrast.
  const step = on === 'white' ? -0.045 : 0.045;
  let hover = { ...c, l: c.l + step };
  const ink = on === 'white' ? '#ffffff' : '#111111';
  for (let i = 0; i < 10 && wcagContrast(fit(hover), ink) < 4.5; i++) hover = { ...hover, l: hover.l + step / 3 };
  s[9] = fit(hover);
  return { scale: s, on };
}

export const contrast = wcagContrast;

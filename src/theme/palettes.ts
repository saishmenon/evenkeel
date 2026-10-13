/**
 * EVENKEEL PALETTES
 * ----------------
 * The large colour system that sits beside the theme:
 *
 *   spectrum   13 hues × 12 steps, light and dark. Same step jobs as the accent scale
 *              (1–2 backgrounds · 3–5 component fills · 6–8 borders · 9–10 solid · 11–12 text).
 *              Made by the theme engine (makeScale + solidWithOnColor), so they behave exactly
 *              like a theme accent. Red, orange, yellow, green, blue, indigo and purple use the
 *              same seeds as the status hues, so "spectrum red" and "danger" are one colour.
 *   greys      the existing neutrals (slate, gray, sand) as static 12-step scales.
 *   viz        data-visualisation palettes: categorical (12), sequential (3 × 9),
 *              diverging (2 × 11) and chart status colours. Each has a light and a dark variant,
 *              tuned so every mark reaches 3:1 against the chart background.
 *
 * Nothing here changes the theme palettes: themes, roles and Figma primitives are untouched.
 * CSS:  --ek-<hue>-<step> (switches with light/dark), --ek-<hue>-light-<step>, --ek-<hue>-dark-<step>
 *       --ek-viz-cat-1…12, --ek-viz-seq-<ramp>-1…9, --ek-viz-div-<ramp>-1…11, --ek-viz-<status>
 */
import { formatHex, inGamut, clampChroma, wcagContrast, type Oklch } from 'culori';
import { makeScale, makeNeutral, solidWithOnColor, type Mode, type Scale } from './engine';
import { hues, neutrals, status, type NeutralName } from './presets';

const inSrgb = inGamut('rgb');
const fit = (c: Oklch): string => formatHex(inSrgb(c) ? c : clampChroma(c, 'oklch'));
const MODES = ['light', 'dark'] as const;
const ON = { white: '#ffffff', black: '#111111' } as const;

/* ------------------------------------------------------------------ spectrum */

export const spectrumHues = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'teal', 'cyan', 'blue', 'indigo', 'violet', 'purple', 'pink'] as const;
export type SpectrumHue = (typeof spectrumHues)[number];

/** Seed (step 9) per hue and mode. Seven are shared with the status/theme hues. */
export const spectrumSeeds: Record<SpectrumHue, { light: string; dark: string }> = {
  red: hues.red,
  orange: hues.orange,
  amber: { light: '#FFB300', dark: '#FFBA1A' },
  yellow: hues.yellow,
  lime: { light: '#A2D51C', dark: '#AEE02D' },
  green: hues.green,
  teal: { light: '#00A99D', dark: '#14BFB0' },
  cyan: { light: '#00A8D6', dark: '#1CBCE8' },
  blue: hues.blue,
  indigo: hues.indigo,
  violet: { light: '#8250F0', dark: '#9468FF' },
  purple: hues.purple,
  pink: { light: '#E5348B', dark: '#F04B9E' },
};

export interface SpectrumScale { scale: Scale; /** text on step 9 and 10 */ on: string }
export type Spectrum = Record<SpectrumHue, Record<Mode, SpectrumScale>>;

/** Build every spectrum scale (same recipe as the status hues). */
export function buildSpectrum(): Spectrum {
  const out = {} as Spectrum;
  for (const hue of spectrumHues) {
    out[hue] = {} as Spectrum[SpectrumHue];
    for (const mode of MODES) {
      const { scale, on } = solidWithOnColor(makeScale(spectrumSeeds[hue][mode], mode), mode);
      out[hue][mode] = { scale, on: ON[on] };
    }
  }
  return out;
}

/** Static grey scales: the theme neutrals, unchanged. */
export const greyNames = Object.keys(neutrals) as NeutralName[];
export function buildGreys(): Record<NeutralName, Record<Mode, Scale>> {
  return Object.fromEntries(greyNames.map((n) => [n, {
    light: makeNeutral(neutrals[n].hue, neutrals[n].chroma, 'light'),
    dark: makeNeutral(neutrals[n].hue, neutrals[n].chroma, 'dark'),
  }])) as Record<NeutralName, Record<Mode, Scale>>;
}

/* ------------------------------------------------------- data visualisation */

/**
 * Chart backgrounds every viz colour must reach 3:1 against: every page and card
 * surface of every neutral (white, background/secondary, dark page, dark cards).
 */
export function chartBackgrounds(mode: Mode): string[] {
  const g = buildGreys();
  return mode === 'light'
    ? ['#ffffff', ...greyNames.map((n) => g[n].light[1])]
    : greyNames.flatMap((n) => [g[n].dark[0], g[n].dark[1], g[n].dark[2]]);
}

/**
 * Move a colour's lightness (darker in light mode, lighter in dark mode)
 * until it reaches `min` contrast against every background.
 */
export function ensureContrast(c: Oklch, mode: Mode, bgs: string[], min = 3.05): string {
  let x = { ...c };
  const dir = mode === 'light' ? -1 : 1;
  const worst = () => Math.min(...bgs.map((b) => wcagContrast(fit(x), b)));
  for (let i = 0; i < 80 && worst() < min; i++) x = { ...x, l: x.l + dir * 0.005 };
  return fit(x);
}

/**
 * Categorical slots: hue, chroma and a lightness per mode.
 * The ORDER is the product: neighbours alternate warm/cool and light/dark. scripts/check-contrast.ts
 * simulates deuteranopia, protanopia and tritanopia and fails if two neighbours (or any two of the
 * first five) collapse into one colour. Lightness alternates so neighbours never rely on hue alone.
 * In light mode gold is a deep ochre: a bright gold would read as orange to protanopes.
 */
export const categoricalSlots: { name: string; h: number; c: number; l: { light: number; dark: number } }[] = [
  { name: 'blue', h: 255, c: 0.19, l: { light: 0.54, dark: 0.70 } },
  { name: 'orange', h: 52, c: 0.17, l: { light: 0.66, dark: 0.78 } },
  { name: 'teal', h: 182, c: 0.12, l: { light: 0.48, dark: 0.80 } },
  { name: 'magenta', h: 345, c: 0.20, l: { light: 0.60, dark: 0.70 } },
  { name: 'gold', h: 92, c: 0.14, l: { light: 0.50, dark: 0.86 } },
  { name: 'violet', h: 295, c: 0.18, l: { light: 0.52, dark: 0.72 } },
  { name: 'green', h: 145, c: 0.15, l: { light: 0.58, dark: 0.80 } },
  { name: 'red', h: 27, c: 0.19, l: { light: 0.54, dark: 0.70 } },
  { name: 'cyan', h: 220, c: 0.12, l: { light: 0.62, dark: 0.82 } },
  { name: 'brown', h: 55, c: 0.08, l: { light: 0.50, dark: 0.72 } },
  { name: 'pink', h: 355, c: 0.12, l: { light: 0.66, dark: 0.84 } },
  { name: 'indigo', h: 275, c: 0.14, l: { light: 0.44, dark: 0.66 } },
];

export function buildCategorical(order = categoricalSlots): Record<Mode, string[]> {
  return Object.fromEntries(MODES.map((mode) => [mode, order.map((s) =>
    ensureContrast({ mode: 'oklch', l: s.l[mode], c: s.c, h: s.h }, mode, chartBackgrounds(mode)))])) as Record<Mode, string[]>;
}

/**
 * Sequential ramps: one hue, 9 steps, low → high.
 * Light mode runs pale → deep; dark mode runs dim → bright, so "more" always means
 * "more contrast with the background". Hue drifts slightly so steps stay apart.
 */
export const sequentialRamps = {
  blue: { h: [235, 262], c: [0.03, 0.17] },
  green: { h: [130, 160], c: [0.04, 0.14] },
  purple: { h: [310, 290], c: [0.03, 0.17] },
} as const;
export type SequentialRamp = keyof typeof sequentialRamps;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const SEQ_L = { light: [0.96, 0.40], dark: [0.32, 0.93] };

export function buildSequential(): Record<SequentialRamp, Record<Mode, string[]>> {
  return Object.fromEntries(Object.entries(sequentialRamps).map(([name, r]) => [name, Object.fromEntries(MODES.map((mode) => [mode,
    Array.from({ length: 9 }, (_, i) => {
      const t = i / 8;
      // chroma peaks just past the middle and eases off at the extremes, so the ends stay calm
      const cBoost = Math.sin(Math.PI * Math.min(1, t * 0.85 + 0.1));
      const c = lerp(r.c[0], r.c[1], t) * (0.55 + 0.45 * cBoost);
      const h = mode === 'light' ? lerp(r.h[0], r.h[1], t) : lerp(r.h[1], r.h[0], t);
      return fit({ mode: 'oklch', l: lerp(SEQ_L[mode][0], SEQ_L[mode][1], Math.pow(t, 0.92)), c, h });
    })]))]),
  ) as Record<SequentialRamp, Record<Mode, string[]>>;
}

/**
 * Diverging ramps: two hues meeting at a neutral grey midpoint (step 6).
 * Steps 1 and 11 are the extremes; the midpoint sits close to the background.
 */
export const divergingRamps = {
  redblue: { low: { h: 27, c: 0.19 }, high: { h: 255, c: 0.17 } },
  orangeteal: { low: { h: 55, c: 0.16 }, high: { h: 190, c: 0.12 } },
} as const;
export type DivergingRamp = keyof typeof divergingRamps;
const DIV_L = { light: { end: 0.44, mid: 0.95 }, dark: { end: 0.84, mid: 0.36 } };

export function buildDiverging(): Record<DivergingRamp, Record<Mode, string[]>> {
  return Object.fromEntries(Object.entries(divergingRamps).map(([name, r]) => [name, Object.fromEntries(MODES.map((mode) => [mode,
    Array.from({ length: 11 }, (_, i) => {
      if (i === 5) return fit({ mode: 'oklch', l: DIV_L[mode].mid, c: 0.004, h: 260 });
      const side = i < 5 ? r.low : r.high;
      const t = Math.abs(i - 5) / 5; // 0.2 … 1
      return fit({ mode: 'oklch', l: lerp(DIV_L[mode].mid, DIV_L[mode].end, Math.pow(t, 0.9)), c: side.c * Math.pow(t, 0.7), h: side.h });
    })]))]),
  ) as Record<DivergingRamp, Record<Mode, string[]>>;
}

/** Status colours for charts: lines and bars, 3:1 against the chart background. */
export const vizStatusSeeds = {
  positive: { h: 150, c: 0.15, l: { light: 0.58, dark: 0.76 } },
  negative: { h: 27, c: 0.20, l: { light: 0.56, dark: 0.72 } },
  warning: { h: 70, c: 0.15, l: { light: 0.64, dark: 0.82 } },
  neutral: { h: 260, c: 0.015, l: { light: 0.56, dark: 0.68 } },
} as const;
export type VizStatus = keyof typeof vizStatusSeeds;

export function buildVizStatus(): Record<Mode, Record<VizStatus, string>> {
  return Object.fromEntries(MODES.map((mode) => [mode, Object.fromEntries(Object.entries(vizStatusSeeds).map(([k, s]) =>
    [k, ensureContrast({ mode: 'oklch', l: s.l[mode], c: s.c, h: s.h }, mode, chartBackgrounds(mode))]))])) as Record<Mode, Record<VizStatus, string>>;
}

/* ----------------------------------------------------------- system colours */

/**
 * System (status) colours: one documented set, mapped from the spectrum by step.
 * The hues come from presets.status, the steps from roles.ts, so --ek-danger-text is
 * exactly --color-danger-text (scripts/check-contrast.ts asserts it).
 * Neutral follows the theme's neutral; its solid is step 11 (step 9 of a grey can't carry text).
 */
export const systemColorNames = ['success', 'warning', 'danger', 'info', 'neutral'] as const;
export type SystemColor = (typeof systemColorNames)[number];

/** Step jobs. Same names for every system colour. */
export const systemColorJobs = {
  bg: { step: 2, use: 'Page-level tint: a whole section or row in this state' },
  subtle: { step: 3, use: 'Banner, badge and callout background' },
  'subtle-hover': { step: 4, use: 'subtle on hover (tinted buttons, clickable badges)' },
  'border-subtle': { step: 6, use: 'Quiet edge of a banner or callout' },
  border: { step: 7, use: 'Outline of a tinted surface (not a 3:1 control border)' },
  solid: { step: 9, use: 'Solid fill: buttons, dots, counters, filled badges' },
  'solid-hover': { step: 10, use: 'solid on hover' },
  text: { step: 11, use: 'Coloured text and icons on the page or on subtle' },
  'text-strong': { step: 12, use: 'Titles inside a subtle banner' },
} as const;
export type SystemColorJob = keyof typeof systemColorJobs | 'on-solid';

export const systemColors: Record<SystemColor, { scale: SpectrumHue | 'neutral'; role?: string; meaning: string }> = {
  success: { scale: status.success, role: 'success', meaning: 'Done, healthy, within limits' },
  warning: { scale: status.warning, role: 'warning', meaning: 'Needs attention soon; nothing is broken yet' },
  danger: { scale: status.danger, role: 'danger', meaning: 'Failed, destructive, over limit' },
  info: { scale: status.info, role: 'info', meaning: 'Neutral news, tips, in progress' },
  neutral: { scale: 'neutral', meaning: 'No state: draft, paused, unknown, archived' },
};

/** Step a system colour uses for a job (neutral solids use 11/12). */
export function systemStep(name: SystemColor, job: keyof typeof systemColorJobs): number {
  if (name === 'neutral' && job === 'solid') return 11;
  if (name === 'neutral' && job === 'solid-hover') return 12;
  return systemColorJobs[job].step;
}

/** On-colour for neutral solids (step 11): dark grey in light mode, light grey in dark mode. */
const NEUTRAL_ON: Record<Mode, string> = { light: ON.white, dark: ON.black };

/** Resolve every job of a system colour to hex. Neutral resolves against a grey (default: slate). */
export function resolveSystemColor(name: SystemColor, mode: Mode, grey: NeutralName = 'slate'): Record<SystemColorJob, string> {
  const def = systemColors[name];
  const scale = def.scale === 'neutral' ? greys[grey][mode] : spectrum[def.scale][mode].scale;
  const out = Object.fromEntries((Object.keys(systemColorJobs) as (keyof typeof systemColorJobs)[]).map((job) =>
    [job, scale[systemStep(name, job) - 1]])) as Record<SystemColorJob, string>;
  out['on-solid'] = def.scale === 'neutral' ? NEUTRAL_ON[mode] : spectrum[def.scale][mode].on;
  return out;
}

/* ------------------------------------------------------------------ exports */

// @__PURE__ lets bundlers drop these (≈10 ms of colour maths) when an app imports none of them.
export const spectrum = /* @__PURE__ */ buildSpectrum();
export const greys = /* @__PURE__ */ buildGreys();
export const viz = {
  categorical: /* @__PURE__ */ buildCategorical(),
  sequential: /* @__PURE__ */ buildSequential(),
  diverging: /* @__PURE__ */ buildDiverging(),
  status: /* @__PURE__ */ buildVizStatus(),
};

/** Hard limits for charts. More series than this needs a different chart, not more colours. */
export const VIZ_MAX_CATEGORICAL = 12;
/** Past this many series, group the smallest into "Other". The first five stay apart under colour-blindness. */
export const VIZ_RECOMMENDED_CATEGORICAL = 8;

/* ---------------------------------------------------------------------- CSS */

/** Static, mode-specific variables: --ek-blue-light-9, --ek-viz-cat-dark-3 … */
export function paletteStaticVars(): Record<string, string> {
  const v: Record<string, string> = {};
  for (const mode of MODES) {
    for (const hue of spectrumHues) {
      spectrum[hue][mode].scale.forEach((hex, i) => (v[`--ek-${hue}-${mode}-${i + 1}`] = hex));
      v[`--ek-${hue}-on-${mode}`] = spectrum[hue][mode].on;
    }
    for (const n of greyNames) greys[n][mode].forEach((hex, i) => (v[`--ek-${n}-${mode}-${i + 1}`] = hex));
    viz.categorical[mode].forEach((hex, i) => (v[`--ek-viz-cat-${mode}-${i + 1}`] = hex));
    for (const [r, m] of Object.entries(viz.sequential)) m[mode].forEach((hex, i) => (v[`--ek-viz-seq-${r}-${mode}-${i + 1}`] = hex));
    for (const [r, m] of Object.entries(viz.diverging)) m[mode].forEach((hex, i) => (v[`--ek-viz-div-${r}-${mode}-${i + 1}`] = hex));
    for (const [k, hex] of Object.entries(viz.status[mode])) v[`--ek-viz-${k}-${mode}`] = hex;
  }
  return v;
}

/** Mode-switching variables: --ek-blue-9: light-dark(var(--ek-blue-light-9), var(--ek-blue-dark-9)). */
export function paletteModeVars(): Record<string, string> {
  const v: Record<string, string> = {};
  const ld = (name: string, light: string, dark: string) => (v[name] = `light-dark(var(${light}), var(${dark}))`);
  const steps = (prefix: string, n: number) => {
    for (let i = 1; i <= n; i++) ld(`--${prefix}-${i}`, `--${prefix}-light-${i}`, `--${prefix}-dark-${i}`);
  };
  for (const hue of spectrumHues) { steps(`ek-${hue}`, 12); ld(`--ek-${hue}-on`, `--ek-${hue}-on-light`, `--ek-${hue}-on-dark`); }
  for (const n of greyNames) steps(`ek-${n}`, 12);
  // the theme's own neutral, so "grey" follows the theme
  for (let i = 1; i <= 12; i++) ld(`--ek-neutral-${i}`, `--palette-neutral-light-${i}`, `--palette-neutral-dark-${i}`);
  steps('ek-viz-cat', 12);
  for (const r of Object.keys(viz.sequential)) steps(`ek-viz-seq-${r}`, 9);
  for (const r of Object.keys(viz.diverging)) steps(`ek-viz-div-${r}`, 11);
  for (const k of Object.keys(viz.status.light)) ld(`--ek-viz-${k}`, `--ek-viz-${k}-light`, `--ek-viz-${k}-dark`);
  // system colours: --ek-success-subtle, --ek-danger-on-solid …
  for (const name of systemColorNames) {
    const scale = systemColors[name].scale;
    for (const job of Object.keys(systemColorJobs) as (keyof typeof systemColorJobs)[]) {
      const step = systemStep(name, job);
      if (scale === 'neutral') ld(`--ek-${name}-${job}`, `--palette-neutral-light-${step}`, `--palette-neutral-dark-${step}`);
      else ld(`--ek-${name}-${job}`, `--ek-${scale}-light-${step}`, `--ek-${scale}-dark-${step}`);
    }
    v[`--ek-${name}-on-solid`] = scale === 'neutral'
      ? `light-dark(${NEUTRAL_ON.light}, ${NEUTRAL_ON.dark})`
      : `light-dark(var(--ek-${scale}-on-light), var(--ek-${scale}-on-dark))`;
  }
  return v;
}

/* --------------------------------------------------------- JSON (Figma, tokens) */

type LD = Record<Mode, string[]>;
export interface FigmaPalettes {
  spectrum: Record<SpectrumHue, { light: string[]; dark: string[]; on: { light: string; dark: string } }>;
  greys: Record<NeutralName, LD>;
  viz: {
    categorical: LD & { names: string[] };
    sequential: Record<SequentialRamp, LD>;
    diverging: Record<DivergingRamp, LD>;
    status: Record<VizStatus, { light: string; dark: string }>;
  };
  system: Record<SystemColor, { scale: string; meaning: string; steps: Record<string, number | 'on'>; light: Record<SystemColorJob, string>; dark: Record<SystemColorJob, string> }>;
}

/** Everything as plain data: build/figma/palettes.json and tokens.json → palettes. */
export function palettesJson(): FigmaPalettes {
  const pick = <T,>(f: (m: Mode) => T) => ({ light: f('light'), dark: f('dark') });
  return {
    spectrum: Object.fromEntries(spectrumHues.map((h) => [h, { ...pick((m) => spectrum[h][m].scale), on: pick((m) => spectrum[h][m].on) }])) as FigmaPalettes['spectrum'],
    greys: Object.fromEntries(greyNames.map((n) => [n, pick((m) => greys[n][m])])) as FigmaPalettes['greys'],
    viz: {
      categorical: { ...pick((m) => viz.categorical[m]), names: categoricalSlots.map((s) => s.name) },
      sequential: Object.fromEntries(Object.entries(viz.sequential).map(([r, v]) => [r, pick((m) => v[m])])) as FigmaPalettes['viz']['sequential'],
      diverging: Object.fromEntries(Object.entries(viz.diverging).map(([r, v]) => [r, pick((m) => v[m])])) as FigmaPalettes['viz']['diverging'],
      status: Object.fromEntries((Object.keys(vizStatusSeeds) as VizStatus[]).map((k) => [k, pick((m) => viz.status[m][k])])) as FigmaPalettes['viz']['status'],
    },
    system: Object.fromEntries(systemColorNames.map((name) => [name, {
      scale: systemColors[name].scale,
      meaning: systemColors[name].meaning,
      steps: { ...Object.fromEntries((Object.keys(systemColorJobs) as (keyof typeof systemColorJobs)[]).map((j) => [j, systemStep(name, j)])), 'on-solid': 'on' as const },
      ...pick((m) => resolveSystemColor(name, m)),
    }])) as unknown as FigmaPalettes['system'],
  };
}

/** Flat list for the Figma sync: { name: 'spectrum/blue/light/9', hex }. */
export function figmaPaletteList(): { name: string; hex: string }[] {
  const out: { name: string; hex: string }[] = [];
  for (const hue of spectrumHues) for (const mode of MODES) spectrum[hue][mode].scale.forEach((hex, i) => out.push({ name: `spectrum/${hue}/${mode}/${i + 1}`, hex }));
  for (const hue of spectrumHues) for (const mode of MODES) out.push({ name: `spectrum/${hue}/${mode}/on`, hex: spectrum[hue][mode].on });
  for (const n of greyNames) for (const mode of MODES) greys[n][mode].forEach((hex, i) => out.push({ name: `spectrum/${n}/${mode}/${i + 1}`, hex }));
  for (const mode of MODES) viz.categorical[mode].forEach((hex, i) => out.push({ name: `viz/categorical/${mode}/${i + 1}`, hex }));
  for (const [r, m] of Object.entries(viz.sequential)) for (const mode of MODES) m[mode].forEach((hex, i) => out.push({ name: `viz/sequential/${r}/${mode}/${i + 1}`, hex }));
  for (const [r, m] of Object.entries(viz.diverging)) for (const mode of MODES) m[mode].forEach((hex, i) => out.push({ name: `viz/diverging/${r}/${mode}/${i + 1}`, hex }));
  for (const mode of MODES) for (const [k, hex] of Object.entries(viz.status[mode])) out.push({ name: `viz/status/${mode}/${k}`, hex });
  return out;
}


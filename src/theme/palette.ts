import { formatHex8, converter } from 'culori';
import { makeScale, makeNeutral, makeAlpha, solidWithOnColor, type Mode, type Scale } from './engine';
import { hues, neutrals, shapes, status, type ThemeConfig, type HueName } from './presets';
import { materialAlpha } from './roles';

export interface ModePalette {
  accent: Scale;
  neutral: Scale;
  neutralA: Scale;
  onAccent: string;
  material: Record<keyof typeof materialAlpha, string>;
}
export interface ThemePalette {
  light: ModePalette;
  dark: ModePalette;
  radius: { control: number; container: number; panel: number };
  font: { display: string; text: string };
}

const ON = { white: '#ffffff', black: '#111111' };

function material(bgHex: string): ModePalette['material'] {
  const rgb = converter('rgb')(bgHex)!;
  return Object.fromEntries(
    Object.entries(materialAlpha).map(([k, a]) => [k, formatHex8({ ...rgb, alpha: a })]),
  ) as ModePalette['material'];
}

function modePalette(cfg: ThemeConfig, mode: Mode): ModePalette {
  const base = mode === 'light' ? cfg.accent.light : (cfg.accent.dark ?? cfg.accent.light);
  const n = neutrals[cfg.neutral];
  const neutral = makeNeutral(n.hue, n.chroma, mode);
  const page = mode === 'light' ? '#ffffff' : neutral[0];
  // the accent must stand out from the page (3:1) as well as carry readable text
  const { scale: accent, on } = solidWithOnColor(makeScale(base, mode), mode, { page });
  return {
    accent,
    neutral,
    neutralA: makeAlpha(neutral, mode),
    onAccent: ON[on],
    material: material(mode === 'light' ? '#ffffff' : neutral[0]),
  };
}

/** The whole theme, from five knobs. */
export function buildTheme(cfg: ThemeConfig): ThemePalette {
  return {
    light: modePalette(cfg, 'light'),
    dark: modePalette(cfg, 'dark'),
    radius: shapes[cfg.shape],
    font: { display: cfg.displayFont, text: cfg.textFont },
  };
}

/** Status hues: identical in every theme. */
export function buildStatus() {
  const out: Record<string, Record<Mode, { scale: Scale; on: string }>> = {};
  for (const hue of new Set(Object.values(status)) as Set<HueName>) {
    out[hue] = {} as any;
    for (const mode of ['light', 'dark'] as const) {
      const { scale, on } = solidWithOnColor(makeScale(hues[hue][mode], mode), mode);
      out[hue][mode] = { scale, on: ON[on] };
    }
  }
  return out;
}

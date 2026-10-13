/**
 * Turns palettes and roles into CSS custom properties.
 * Mirrors the Figma collections one-to-one:
 *   Figma "Theme" collection  →  --palette-* (set per [data-theme])
 *   Figma "Color" collection  →  --color-*   (light on :root, dark on [data-mode=dark])
 */
import type { ThemePalette } from './palette';
import { roles } from './roles';
import { status } from './presets';

/** Hues with a --palette-* scale (status hues). Every other hue comes from the spectrum (--ek-*). */
const statusHues = new Set<string>(Object.values(status));

export const cssName = (figmaName: string) => figmaName.replace(/\//g, '-');

export function paletteVars(p: ThemePalette): Record<string, string> {
  const v: Record<string, string> = {};
  for (const mode of ['light', 'dark'] as const) {
    const m = p[mode];
    m.accent.forEach((hex, i) => (v[`--palette-accent-${mode}-${i + 1}`] = hex));
    m.neutral.forEach((hex, i) => (v[`--palette-neutral-${mode}-${i + 1}`] = hex));
    m.neutralA.forEach((hex, i) => (v[`--palette-neutral-alpha-${mode}-${i + 1}`] = hex));
    v[`--palette-on-accent-${mode}`] = m.onAccent;
    for (const [k, hex] of Object.entries(m.material)) v[`--palette-material-${mode}-${k}`] = hex;
  }
  v['--radius-control'] = `${p.radius.control}px`;
  v['--radius-container'] = `${p.radius.container}px`;
  v['--radius-panel'] = `${p.radius.panel}px`;
  // "X Variable" is the name the npm font packages use; "X" is the Google Fonts name.
  const stack = (f: string) => [...new Set([`'${f} Variable'`, `'${f}'`, `'Inter Variable'`, `'Inter'`])].join(', ') + ', system-ui, sans-serif';
  v['--font-display'] = stack(p.font.display);
  v['--font-text'] = stack(p.font.text);
  return v;
}

/** Resolve a role reference (see roles.ts) to a CSS value for one mode. */
export function roleValue(ref: string, mode: 'light' | 'dark'): string {
  if (ref === 'white') return '#ffffff';
  if (ref === 'black') return '#000000';
  if (ref.startsWith('#')) return ref;
  if (ref === 'onAccent') return `var(--palette-on-accent-${mode})`;
  if (ref.startsWith('on:')) return `var(--palette-${ref.slice(3)}-on-${mode})`;
  const [scale, step] = ref.split('.');
  if (scale === 'material') return `var(--palette-material-${mode}-${step})`;
  if (scale === 'neutralA') return `var(--palette-neutral-alpha-${mode}-${step})`;
  if (scale === 'accent' || scale === 'neutral' || statusHues.has(scale)) return `var(--palette-${scale}-${mode}-${step})`;
  return `var(--ek-${scale}-${mode}-${step})`; // spectrum hue, e.g. violet for the ai/* roles
}

export function roleVars(mode: 'light' | 'dark'): Record<string, string> {
  return Object.fromEntries(roles.map((r) => [`--color-${cssName(r.name)}`, roleValue(r[mode], mode)]));
}

/**
 * Custom themes at runtime: one function call.
 *
 *   applyTheme(document.documentElement, {
 *     accent: { light: '#FF5A1F' }, neutral: 'sand', shape: 'round',
 *     displayFont: 'Bricolage Grotesque', textFont: 'Inter',
 *   });
 *
 * It writes the same palette variables a preset theme sets, so every
 * component restyles itself. Nothing else needs to change.
 */
import { buildTheme } from './palette';
import { paletteVars } from './css';
import type { ThemeConfig } from './presets';

export function applyTheme(el: HTMLElement, cfg: ThemeConfig) {
  const vars = paletteVars(buildTheme(cfg));
  for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
  // any [data-theme] value re-computes the colour roles from these palettes
  el.setAttribute('data-theme', 'custom');
}

export function clearTheme(el: HTMLElement, preset = 'default') {
  el.removeAttribute('style');
  el.setAttribute('data-theme', preset);
}

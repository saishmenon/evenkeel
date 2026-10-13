import { readFileSync } from 'node:fs';
import { presets, hues } from '../src/theme/presets';
import { buildTheme } from '../src/theme/palette';
import { roles } from '../src/theme/roles';
import { spectrum, type SpectrumHue } from '../src/theme/palettes';
const t = JSON.parse(readFileSync('build/tokens.json', 'utf8'));
let bad = 0;
for (const [name, cfg] of Object.entries(presets)) {
  const pal = buildTheme(cfg as any);
  const hue = t.themeModes[name].accent;
  for (const mode of ['light', 'dark'] as const) pal[mode].accent.forEach((hex: string, i: number) => {
    const p = t.primitives[`${hue}/${mode}/${i + 1}`];
    if (p !== hex) { bad++; console.log(name, mode, i + 1, 'css', hex, 'figma', p); }
  });
  for (const mode of ['light', 'dark'] as const) pal[mode].neutral.forEach((hex: string, i: number) => {
    if (t.primitives[`${cfg.neutral}/${mode}/${i + 1}`] !== hex) { bad++; console.log('neutral', name, mode, i + 1); }
  });
}
// roles that point straight at a spectrum hue (ai/* → violet) need that hue as Figma primitives
for (const r of roles) for (const mode of ['light', 'dark'] as const) {
  const [hue, step] = r[mode].split('.');
  if (!(hue in spectrum) || !step) continue;
  const p = t.primitives[`${hue}/${mode}/${step}`], hex = spectrum[hue as SpectrumHue][mode].scale[Number(step) - 1];
  if (p !== hex) { bad++; console.log('role', r.name, mode, 'css', hex, 'figma', p); }
}
console.log(bad ? `${bad} mismatches` : 'All theme palettes match the Figma primitives exactly');

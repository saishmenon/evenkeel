/**
 * npm run test:contrast
 * Checks every theme × mode against WCAG 2.2:
 *   text      ≥ 4.5 : 1   (AA, normal text)
 *   UI parts  ≥ 3   : 1   (1.4.11 non-text contrast: control borders, focus rings)
 * Alpha colours are blended onto their background first, like the browser does.
 * Then the palettes (src/theme/palettes.ts):
 *   spectrum + greys   step 11 and 12 text ≥ 4.5 on steps 1–2 · step 9/10 with its on-colour ≥ 4.5
 *   system colours     text on page/subtle, on-solid on solid, and the same hex as the roles
 *   viz categorical    ≥ 3 : 1 on every chart background, neighbours apart under colour-blindness
 *   viz sequential     lightness strictly monotonic, darkest/brightest end ≥ 3 : 1
 *   viz diverging      neutral midpoint, both arms monotonic and balanced, ends ≥ 3 : 1
 * Exits with an error if anything fails, so it can run in CI.
 */
import { converter, formatHex, wcagContrast, differenceEuclidean, filterDeficiencyDeuter, filterDeficiencyProt, filterDeficiencyTrit } from 'culori';
import { presets } from '../src/theme/presets';
import { buildTheme, buildStatus } from '../src/theme/palette';
import { roles } from '../src/theme/roles';
import {
  spectrum, spectrumHues, greys, greyNames, viz, chartBackgrounds, categoricalSlots,
  systemColorNames, systemColors, systemStep, resolveSystemColor, type SystemColor,
} from '../src/theme/palettes';

const rgb = converter('rgb');
const statusPal = buildStatus();

function resolve(ref: string, theme: ReturnType<typeof buildTheme>, mode: 'light' | 'dark'): string {
  const m = theme[mode];
  if (ref === 'white') return '#ffffff';
  if (ref === 'black') return '#000000';
  if (ref.startsWith('#')) return ref;
  if (ref === 'onAccent') return m.onAccent;
  if (ref.startsWith('on:')) return statusPal[ref.slice(3)][mode].on;
  const [scale, step] = ref.split('.');
  if (scale === 'material') return (m.material as any)[step];
  const i = Number(step) - 1;
  if (scale === 'accent') return m.accent[i];
  if (scale === 'neutral') return m.neutral[i];
  if (scale === 'neutralA') return m.neutralA[i];
  return (statusPal[scale] ?? spectrum[scale as keyof typeof spectrum])[mode].scale[i]; // status hue, or a spectrum hue (violet for ai/*)
}
/** Blend a possibly see-through colour onto an opaque background. */
function over(fg: string, bg: string): string {
  const f = rgb(fg)!, b = rgb(bg)!;
  const a = f.alpha ?? 1;
  return formatHex({ mode: 'rgb', r: f.r * a + b.r * (1 - a), g: f.g * a + b.g * (1 - a), b: f.b * a + b.b * (1 - a) });
}

const pairs: [string, string, number][] = [];
for (const bg of ['background/primary', 'background/secondary', 'background/grouped-item', 'background/elevated']) {
  pairs.push(['label/primary', bg, 4.5], ['label/secondary', bg, 4.5], ['label/link', bg, 4.5]);
}
pairs.push(
  ['label/tertiary', 'background/primary', 3],
  ['label/on-accent', 'accent/solid', 4.5],
  ['label/on-accent', 'accent/solid-hover', 4.5],
  ['label/link', 'accent/subtle', 4.5],
  ['border/control', 'background/primary', 3],
  ['border/focus', 'background/primary', 3],
  ['accent/solid', 'background/primary', 3],
  ['border/invalid', 'background/primary', 3],
  ['control/track-off', 'background/primary', 3],
  ['control/knob', 'control/track-off', 2.5],
  ['danger/text', 'danger/subtle-hover', 4.5],
  ['label/link', 'accent/subtle-hover', 4.5],
  ['label/primary', 'fill/secondary', 4.5],
  ['label/primary', 'background/elevated', 4.5],
);
// AI roles: labels and links inside AI content, text on the AI fill, the caret/badge against the page
for (const bg of ['background/primary', 'background/secondary', 'background/elevated', 'ai/subtle']) pairs.push(['ai/text', bg, 4.5]);
pairs.push(
  ['ai/on-solid', 'ai/solid', 4.5],
  ['ai/on-solid', 'ai/solid-hover', 4.5],
  ['ai/solid', 'background/primary', 3],
  ['label/primary', 'ai/subtle', 4.5],
  ['label/secondary', 'ai/subtle', 4.5],
);
for (const s of ['danger', 'warning', 'success', 'info']) {
  pairs.push([`${s}/text`, 'background/primary', 4.5], [`${s}/text`, `${s}/subtle`, 4.5], [`${s}/on-solid`, `${s}/solid`, 4.5], ['label/primary', `${s}/subtle`, 4.5]);
}

const byName = Object.fromEntries(roles.map((r) => [r.name, r]));
let failures = 0, checks = 0;
for (const [themeName, cfg] of Object.entries(presets)) {
  const theme = buildTheme(cfg);
  for (const mode of ['light', 'dark'] as const) {
    const page = resolve(byName['background/primary'][mode], theme, mode);
    for (const [fgName, bgName, min] of pairs) {
      const bg = over(resolve(byName[bgName][mode], theme, mode), page);
      const fg = over(resolve(byName[fgName][mode], theme, mode), bg);
      const ratio = wcagContrast(fg, bg);
      checks++;
      if (ratio < min) {
        failures++;
        console.log(`✗ ${themeName.padEnd(8)} ${mode.padEnd(5)} ${fgName} on ${bgName}: ${ratio.toFixed(2)} (needs ${min})`);
      }
    }
  }
}
console.log(`\n${checks - failures}/${checks} contrast checks pass across ${Object.keys(presets).length} themes × 2 modes`);
const roleChecks = checks, roleFailures = failures;

/* ---------------------------------------------------------------- palettes */
const MODES = ['light', 'dark'] as const;
const okl = converter('oklch');
const L = (hex: string) => okl(hex)!.l;
const tally: Record<string, [number, number]> = {}; // group → [checks, failures]
function expect(group: string, ok: boolean, msg: string) {
  tally[group] ??= [0, 0];
  tally[group][0]++;
  if (!ok) { tally[group][1]++; console.log(`✗ ${group}: ${msg}`); }
}
const ratio = (fg: string, bg: string, min: number, group: string, label: string) => {
  const r = wcagContrast(fg, bg);
  expect(group, r >= min, `${label}: ${r.toFixed(2)} (needs ${min})`);
};

// spectrum and greys: text steps on background steps, solids with their on-colour
for (const mode of MODES) {
  for (const hue of spectrumHues) {
    const { scale: s, on } = spectrum[hue][mode];
    for (const t of [11, 12]) for (const b of [1, 2]) ratio(s[t - 1], s[b - 1], 4.5, 'spectrum text', `${hue} ${mode} ${t} on ${b}`);
    for (const t of [9, 10]) ratio(on, s[t - 1], 4.5, 'spectrum solid', `${hue} ${mode} on-colour on ${t}`);
  }
  for (const g of greyNames) {
    const s = greys[g][mode];
    for (const t of [11, 12]) for (const b of [1, 2]) ratio(s[t - 1], s[b - 1], 4.5, 'grey text', `${g} ${mode} ${t} on ${b}`);
  }
}

// system colours: readable on every page (each theme neutral), and identical to the roles
for (const mode of MODES) for (const g of greyNames) {
  const page = mode === 'light' ? '#ffffff' : greys[g].dark[0];
  for (const name of systemColorNames) {
    const c = resolveSystemColor(name, mode, g);
    const tag = `${name} ${mode} (${g})`;
    ratio(c.text, page, 4.5, 'system colours', `${tag} text on page`);
    ratio(c.text, c.bg, 4.5, 'system colours', `${tag} text on bg`);
    ratio(c.text, c.subtle, 4.5, 'system colours', `${tag} text on subtle`);
    ratio(c['text-strong'], c.subtle, 4.5, 'system colours', `${tag} text-strong on subtle`);
    ratio(c['text-strong'], c['subtle-hover'], 4.5, 'system colours', `${tag} text-strong on subtle-hover`);
    ratio(c['on-solid'], c.solid, 4.5, 'system colours', `${tag} on-solid on solid`);
    ratio(c['on-solid'], c['solid-hover'], 4.5, 'system colours', `${tag} on-solid on solid-hover`);
  }
}
const statusRoleSteps = { subtle: 'subtle', solid: 'solid', text: 'text', border: 'border' } as const;
for (const name of systemColorNames) {
  const def = systemColors[name as SystemColor];
  if (!def.role) continue;
  for (const mode of MODES) {
    for (const [job, role] of Object.entries(statusRoleSteps)) {
      const ref = byName[`${def.role}/${role}`][mode];                      // e.g. 'green.3'
      const viaRole = statusPal[ref.split('.')[0]][mode].scale[Number(ref.split('.')[1]) - 1];
      const viaPalette = resolveSystemColor(name, mode)[job as 'subtle'];
      expect('system = roles', viaRole === viaPalette && ref === `${def.scale}.${systemStep(name, job as 'subtle')}`, `${name}/${job} ${mode}: role ${ref} ${viaRole} vs palette ${viaPalette}`);
    }
    expect('system = roles', statusPal[def.scale][mode].on === resolveSystemColor(name, mode)['on-solid'], `${name} on-solid ${mode}`);
  }
}

// viz categorical: 3:1 against every chart background
for (const mode of MODES) {
  const bgs = chartBackgrounds(mode);
  viz.categorical[mode].forEach((c, i) => bgs.forEach((bg) => ratio(c, bg, 3, 'viz categorical', `${mode} cat-${i + 1} (${categoricalSlots[i].name}) on ${bg}`)));
  for (const [k, c] of Object.entries(viz.status[mode])) bgs.forEach((bg) => ratio(c, bg, 3, 'viz status', `${mode} ${k} on ${bg}`));
}
// …and distinguishable: neighbours (any order a legend shows) and the first five under colour-blindness
const dE = differenceEuclidean('oklab');
const vision = { normal: (c: string) => c, deuteranopia: filterDeficiencyDeuter(1), protanopia: filterDeficiencyProt(1), tritanopia: filterDeficiencyTrit(1) } as Record<string, (c: string) => unknown>;
for (const mode of MODES) {
  const cat = viz.categorical[mode];
  for (const [v, sim] of Object.entries(vision)) {
    for (let i = 0; i + 1 < cat.length; i++) {
      const d = dE(sim(cat[i]) as string, sim(cat[i + 1]) as string);
      expect('viz colour-blind', d >= 0.08, `${mode} ${v} cat-${i + 1}/${i + 2}: ΔE ${d.toFixed(3)} (needs 0.08)`);
    }
    for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) {
      const d = dE(sim(cat[i]) as string, sim(cat[j]) as string);
      expect('viz colour-blind', d >= 0.05, `${mode} ${v} cat-${i + 1}/${j + 1}: ΔE ${d.toFixed(3)} (needs 0.05)`);
    }
  }
}

// viz sequential: monotonic lightness (light: pale → deep, dark: dim → bright), top end visible
for (const [r, ramp] of Object.entries(viz.sequential)) for (const mode of MODES) {
  const ls = ramp[mode].map(L);
  const dir = mode === 'light' ? -1 : 1;
  expect('viz sequential', ls.every((l, i) => i === 0 || (l - ls[i - 1]) * dir >= 0.03), `${r} ${mode} not monotonic: ${ls.map((l) => l.toFixed(3)).join(' ')}`);
  chartBackgrounds(mode).forEach((bg) => ratio(ramp[mode][ramp[mode].length - 1], bg, 3, 'viz sequential', `${r} ${mode} top step on ${bg}`));
}

// viz diverging: neutral midpoint, arms monotonic away from it and balanced, ends visible
for (const [r, ramp] of Object.entries(viz.diverging)) for (const mode of MODES) {
  const s = ramp[mode], mid = (s.length - 1) / 2;
  const m = okl(s[mid])!;
  expect('viz diverging', (m.c ?? 0) < 0.01, `${r} ${mode} midpoint not neutral: chroma ${(m.c ?? 0).toFixed(4)}`);
  const away = (i: number) => Math.abs(L(s[i]) - m.l);
  for (let i = 1; i <= mid; i++) {
    expect('viz diverging', away(mid - i) > away(mid - i + 1) && away(mid + i) > away(mid + i - 1), `${r} ${mode} arm not monotonic at ±${i}`);
  }
  expect('viz diverging', Math.abs(L(s[0]) - L(s[s.length - 1])) < 0.05, `${r} ${mode} arms unbalanced: ${L(s[0]).toFixed(3)} vs ${L(s[s.length - 1]).toFixed(3)}`);
  chartBackgrounds(mode).forEach((bg) => { ratio(s[0], bg, 3, 'viz diverging', `${r} ${mode} low end on ${bg}`); ratio(s[s.length - 1], bg, 3, 'viz diverging', `${r} ${mode} high end on ${bg}`); });
}

let palChecks = 0, palFailures = 0;
for (const [g, [c, f]] of Object.entries(tally)) { palChecks += c; palFailures += f; console.log(`  ${f ? '✗' : '✓'} ${g.padEnd(18)} ${c - f}/${c}`); }
console.log(`${palChecks - palFailures}/${palChecks} palette checks pass (${spectrumHues.length} hues, ${greyNames.length} greys, ${systemColorNames.length} system colours, ${viz.categorical.light.length} categorical, ${Object.keys(viz.sequential).length} sequential, ${Object.keys(viz.diverging).length} diverging × 2 modes)`);
console.log(`\nTotal: ${roleChecks + palChecks - roleFailures - palFailures}/${roleChecks + palChecks} checks pass`);
if (roleFailures || palFailures) process.exit(1);

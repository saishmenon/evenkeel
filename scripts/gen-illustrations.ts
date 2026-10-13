/**
 * npm run gen:illustrations
 *
 * Writes build/figma/illustrations.json from the SAME drawings the React <Illustration> renders
 * (src/illustrations/art.ts). In the Figma export every colour is a unique placeholder hex, and
 * `roles` maps each hex back to its Figma variable (e.g. "#3E63DD" → "accent/solid"), so the Figma
 * sync can bind fills and strokes to variables and the art follows the theme there too.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createKit, svgDocument, rolePlaceholder, roleVar, ILLUSTRATION_ROLES } from '../src/illustrations/kit';
import { illustrationDefs, illustrationNames } from '../src/illustrations/art';

const root = resolve(import.meta.dirname, '..');

const hexes = ILLUSTRATION_ROLES.map((r) => rolePlaceholder[r].toUpperCase());
if (new Set(hexes).size !== hexes.length) throw new Error('Placeholder hexes must be unique, one per role');

const k = createKit('hex');
const items = illustrationNames.map((name) => {
  const def = illustrationDefs[name];
  const svg = svgDocument(def.draw(k), 'width="240" height="180"');
  if (/var\(|NaN|undefined/.test(svg)) throw new Error(`${name}: bad SVG output`);
  const used = [...new Set(svg.match(/#[0-9A-F]{6}/gi) ?? [])].map((h) => h.toUpperCase());
  const unknown = used.filter((h) => !hexes.includes(h));
  if (unknown.length) throw new Error(`${name}: colours outside the role map: ${unknown.join(', ')}`);
  return { name, title: def.title, alt: def.alt, svg };
});

const roles = Object.fromEntries(ILLUSTRATION_ROLES.map((r) => [rolePlaceholder[r].toUpperCase(), r]));
const cssVars = Object.fromEntries(ILLUSTRATION_ROLES.map((r) => [r, `var(${roleVar(r)})`]));

mkdirSync(resolve(root, 'build/figma'), { recursive: true });
writeFileSync(resolve(root, 'build/figma/illustrations.json'), JSON.stringify({ viewBox: '0 0 240 180', roles, cssVars, items }, null, 1) + '\n');
console.log(`✓ build/figma/illustrations.json  ${items.length} illustrations, ${ILLUSTRATION_ROLES.length} colour roles`);

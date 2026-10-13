import { roles } from '../src/theme/roles';
import { readFileSync } from 'node:fs';
const t = JSON.parse(readFileSync('build/tokens.json', 'utf8'));
const target = (ref: string, mode: string) => {
  if (ref === 'white' || ref === 'black') return 'P:' + ref;
  if (ref.startsWith('#')) return ref;
  if (ref === 'onAccent') return `T:on-accent/${mode}`;
  if (ref.startsWith('on:')) return 'P:' + (t.statusOn[ref.slice(3)][mode] === '#ffffff' ? 'white' : 'ink');
  const [s, step] = ref.split('.');
  if (s === 'material') return `T:material/${mode}/${step}`;
  if (s === 'neutralA') return `T:neutral-alpha/${mode}/${step}`;
  if (s === 'neutral' || s === 'accent') return `T:${s}/${mode}/${step}`;
  return `P:${s}/${mode}/${step}`;
};
console.log(JSON.stringify(roles.map((r) => [r.name, target(r.light, 'light'), target(r.dark, 'dark'), r.scope, r.description])));

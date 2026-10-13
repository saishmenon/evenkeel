/**
 * npm run test:smoke  (after npm run build)
 * Imports the built package the way a consumer would (by its package name, through the
 * "exports" map) and server-renders a few components. Fails loudly if anything is missing.
 */
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
let failed = 0;
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${detail ? ` (${detail})` : ''}`);
  if (!ok) failed++;
};

// ESM
const esm = await import('evenkeel-ui');
check('ESM entry exports Button, Table, Chart, applyTheme', ['Button', 'Table', 'Chart', 'applyTheme', 'presets'].every((k) => k in esm));
const html = renderToStaticMarkup(h(esm.Button, { variant: 'filled', iconLeft: 'plus' }, 'Create payment link'));
check('<Button> renders', html.includes('Create payment link') && html.includes('<button'), html.slice(0, 80) + '…');
const badge = renderToStaticMarkup(h(esm.Badge, { tone: 'success' }, 'Paid'));
check('<Badge> renders', badge.includes('Paid'));

// CJS
const cjs = require('evenkeel-ui');
check('CJS entry exports Button', typeof cjs.Button === 'object' || typeof cjs.Button === 'function');

// Icons subpath
const icons = await import('evenkeel-ui/icons');
check('evenkeel-ui/icons exports icon data', icons.icons && Object.keys(icons.icons).length > 0, `${Object.keys(icons.icons ?? {}).length} icons`);

// Static files through the exports map
for (const sub of ['css', 'tokens.css', 'fonts.css', 'tokens.json']) {
  let path = '';
  try { path = require.resolve(`evenkeel-ui/${sub}`); } catch {}
  check(`evenkeel-ui/${sub} resolves`, !!path && existsSync(path));
}
const css = readFileSync(require.resolve('evenkeel-ui/css'), 'utf8');
check('evenkeel.css has tokens', css.includes('--color-') && css.includes('[data-theme="studio"]'));
check('evenkeel.css has density', css.includes('[data-density'));
check('evenkeel.css has component styles', css.includes('.ek-button'));
check('evenkeel.css has no unresolved @import', !/^@import/m.test(css));
const tokens = JSON.parse(readFileSync(require.resolve('evenkeel-ui/tokens.json'), 'utf8'));
check('tokens.json parses', typeof tokens === 'object' && Object.keys(tokens).length > 0);

// Types
check('type declarations exist', existsSync(new URL('../dist/types/index.d.ts', import.meta.url)));

if (failed) { console.error(`\n${failed} smoke check(s) failed`); process.exit(1); }
console.log('\nSmoke test passed: the built package imports, renders and ships its CSS.');

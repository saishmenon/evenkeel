/**
 * npm run test:a11y
 * Opens every component story in a real browser and runs axe (WCAG 2.2 AA rules),
 * in two theme/mode combinations. Fails if any violation is found.
 */
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join } from 'node:path';

const root = 'storybook-static';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const server = createServer((req, res) => {
  const path = join(root, decodeURIComponent(req.url.split('?')[0]) === '/' ? 'index.html' : decodeURIComponent(req.url.split('?')[0]));
  let body;
  try { body = readFileSync(path); } catch { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[extname(path)] || 'application/octet-stream' });
  res.end(body);
}).listen(6010);

const index = JSON.parse(readFileSync(`${root}/index.json`, 'utf8'));
// Every component (incl. Components / AI), pattern, demo, template and flow story. A11Y_FILTER=ai narrows a local run to ids containing "ai".
const stories = Object.values(index.entries).filter((e) => e.type === 'story' && ['components-', 'components-ai-', 'patterns-', 'demos-', 'templates-', 'flows-'].some((p) => e.id.startsWith(p))
  && (!process.env.A11Y_FILTER || e.id.includes(process.env.A11Y_FILTER)));
const combos = ['theme:default;mode:light', 'theme:studio;mode:dark'];
// CHROMIUM_PATH lets you point at a preinstalled Chromium; otherwise Playwright's own (npx playwright install chromium).
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const context = await browser.newContext();
const page = await context.newPage();
let fails = 0, runs = 0;
for (const s of stories) for (const g of combos) {
  await page.goto(`http://localhost:6010/iframe.html?id=${s.id}&viewMode=story&globals=${g}`);
  await page.waitForSelector('#storybook-root > *', { timeout: 15000 });
  await page.waitForTimeout(250);
  const r = await new AxeBuilder({ page }).include('#storybook-root').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  runs++;
  for (const v of r.violations) { fails++; console.log(`✗ ${s.id} [${g}] ${v.id}: ${v.help} (${v.nodes.length})`); }
}
console.log(`\n${runs} story checks · ${stories.length} stories × ${combos.length} themes · ${fails} violations`);
await browser.close(); server.close();
if (fails) process.exit(1);

/**
 * npm run gen:icons
 *
 * Builds src/icons/lucide.generated.ts from a CURATED list of Lucide icons (lucide-static, ISC),
 * and writes build/figma/icons.json (Evenkeel + Lucide) for the Figma sync.
 *
 * Every Lucide element (path, circle, rect, line, polyline, polygon, ellipse) is converted to
 * plain path data, so each icon is ONE `d` string, exactly like Evenkeel's own icons.
 * Stroke width, caps and colour stay controlled by <Icon>. Evenkeel's icons win on name collisions.
 *
 * Never add brand logos to this list.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { evenkeelIcons, evenkeelCategoryOf, ICON_CATEGORIES, type EvenkeelIconName, type IconCategory } from '../src/icons/evenkeel';

const root = resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);
const lucideDir = dirname(require.resolve('lucide-static/package.json'));
const lucideVersion: string = JSON.parse(readFileSync(resolve(lucideDir, 'package.json'), 'utf8')).version;
type Node = [string, Record<string, string>];
const nodes: Record<string, Node[]> = JSON.parse(readFileSync(resolve(lucideDir, 'icon-nodes.json'), 'utf8'));

/* ------------------------------------------------------------------ curated list */
const curated: Record<IconCategory, string> = {
  'Navigation & arrows': `arrow-left arrow-up-right arrow-down-right arrow-down-left arrow-left-right arrow-up-down arrow-down-to-line arrow-up-from-line
    arrow-right-to-line chevron-up chevrons-left chevrons-right chevrons-up-down chevrons-down-up chevron-first chevron-last corner-down-left
    corner-down-right circle-arrow-right square-arrow-out-up-right move house map map-pin navigation route log-in maximize-2 minimize-2 ellipsis
    ellipsis-vertical grip-vertical rotate-cw rotate-ccw refresh-cw repeat`,
  'Actions & editing': `circle-plus circle-minus square-plus pen pen-line square-pen eraser scissors clipboard clipboard-copy clipboard-paste clipboard-check save
    upload share share-2 send link link-2 unlink paperclip pin bookmark heart thumbs-up thumbs-down flag tag tags archive inbox funnel list-filter
    sliders-horizontal sliders-vertical settings-2 wrench zoom-in zoom-out undo-2 redo-2 check-check printer import wand-sparkles sparkles power
    toggle-right mouse-pointer-click`,
  'Files & documents': `file files file-plus file-check file-x file-search file-code file-spreadsheet file-chart-column file-image file-lock file-clock file-pen
    file-down file-up file-archive folder-open folder-plus folder-check folder-lock folder-search folders notebook-pen book-open library
    sticky-note newspaper signature package package-open boxes`,
  Communication: `message-circle message-square message-square-text message-square-plus messages-square message-circle-more mail-open mail-check mail-warning
    at-sign phone phone-call phone-missed video mic mic-off megaphone bell-ring bell-off bell-dot reply languages headset contact presentation`,
  'People & accounts': `user-plus user-minus user-check user-x user-cog user-lock user-round user-round-plus users-round circle-user circle-user-round id-card
    accessibility handshake building briefcase-business graduation-cap award badge-check trophy`,
  'Commerce & money': `wallet wallet-cards receipt receipt-text receipt-euro banknote banknote-arrow-up banknote-arrow-down banknote-check banknote-x landmark
    piggy-bank coins hand-coins credit-card-check credit-card-plus credit-card-x dollar-sign euro pound-sterling circle-dollar-sign
    badge-dollar-sign percent calculator scale shopping-cart shopping-bag store ticket gift vault nfc qr-code scan-barcode package-check
    warehouse`,
  'Data & charts': `chart-area chart-bar chart-bar-big chart-column chart-column-stacked chart-column-increasing chart-line chart-spline chart-pie chart-scatter
    chart-candlestick chart-gantt chart-no-axes-combined trending-up trending-down trending-up-down gauge sigma database-zap database-search
    target goal waypoints arrow-down-a-z arrow-down-wide-narrow`,
  'Devices & media': `monitor laptop smartphone monitor-smartphone keyboard hard-drive cpu wifi wifi-off signal battery battery-charging plug camera image images
    image-plus music headphones volume-2 volume-x play pause circle-play skip-forward webcam`,
  'Time & calendar': `calendar-days calendar-check calendar-plus calendar-minus calendar-x calendar-clock calendar-search calendar-sync clock-alert clock-check
    alarm-clock timer hourglass rotate-ccw-clock`,
  'Status & alerts': `circle-alert triangle-alert octagon-alert circle-check-big circle-check circle-x circle-question-mark badge-alert circle-dot ban loader
    loader-circle zap flame life-buoy square-check square-x construction`,
  Security: `shield-check shield-alert shield-x shield-off shield-ban shield-user lock-open lock-keyhole key-round fingerprint-pattern scan-face
    eye-closed globe-lock bug rotate-ccw-key`,
  Development: `code code-xml braces brackets terminal square-terminal git-branch git-commit-horizontal git-merge git-pull-request git-pull-request-closed
    git-fork webhook bot server-cog server-crash cloud cloud-upload cloud-download cloud-off cloud-check cloud-alert container puzzle variable
    command flask-conical blocks workflow network logs list-tree`,
  'Layout & views': `table table-2 table-columns-split table-of-contents kanban square-kanban grid-2x2 layout-grid layout-list layout-dashboard layout-panel-left
    layout-panel-top layout-template columns-2 rows-2 panel-left panel-left-close panel-left-open panel-right panel-right-close panel-right-open
    panel-bottom app-window gallery-horizontal list-collapse list-checks list-todo align-start-vertical align-center-vertical fold-vertical
    unfold-vertical view layers-2`,
  'Text formatting': `bold italic underline strikethrough type heading-1 heading-2 heading-3 text-align-start text-align-center text-align-end text-align-justify
    list-ordered list-indent-increase pilcrow case-sensitive highlighter remove-formatting spell-check text-cursor-input text-wrap text-quote
    hash`,
  'Nature & misc': `sun moon cloud-sun snowflake droplet wind sprout tree-pine mountain earth recycle factory solar-panel plane car coffee party-popper
    lightbulb palette paintbrush pen-tool swatch-book anchor toolbox`,
  Shapes: `circle square triangle diamond hexagon octagon pentagon shapes rectangle-horizontal ellipse square-dashed vector-square squares-unite
    squares-intersect contrast`,
};

/** Brand marks we never ship, even if Lucide adds them. */
const banned = /^(github|gitlab|figma|apple|chrome|chromium|codepen|codesandbox|dribbble|facebook|framer|instagram|linkedin|pocket|slack|trello|twitch|twitter|youtube|bitcoin|app-window-mac)$/;

/* ------------------------------------------------------------------ element → path data */
const n = (v: string | number) => {
  const x = Math.round(Number(v) * 1000) / 1000;
  return String(x).replace(/^(-?)0\./, '$1.');
};
function ellipsePath(cx: number, cy: number, rx: number, ry: number) {
  return `M${n(cx - rx)} ${n(cy)}a${n(rx)} ${n(ry)} 0 1 0 ${n(2 * rx)} 0a${n(rx)} ${n(ry)} 0 1 0 ${n(-2 * rx)} 0z`;
}
/**
 * A path that starts with a relative `m` is absolute on its own, but not once it is joined after another
 * element's path (it would be relative to the previous point). Rewrite the head as `M x y` + `l …`.
 */
function absoluteStart(d: string): string {
  const s = d.trim();
  if (s[0] !== 'm') return s;
  const re = /-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/gy;
  let i = 1;
  const nums: string[] = [];
  for (;;) {
    while (i < s.length && /[\s,]/.test(s[i])) i++;
    re.lastIndex = i;
    const m = re.exec(s);
    if (!m) break;
    nums.push(m[0]);
    i = re.lastIndex;
  }
  const head = `M${nums[0]} ${nums[1]}`;
  const rest = nums.slice(2);
  return head + (rest.length ? `l${rest.join(' ')}` : '') + s.slice(i);
}
function toPath([tag, a]: Node): string {
  const f = (k: string, d = 0) => (a[k] === undefined ? d : Number(a[k]));
  switch (tag) {
    case 'path': return absoluteStart(a.d);
    case 'circle': return ellipsePath(f('cx'), f('cy'), f('r'), f('r'));
    case 'ellipse': return ellipsePath(f('cx'), f('cy'), f('rx'), f('ry'));
    case 'line': return `M${n(f('x1'))} ${n(f('y1'))}L${n(f('x2'))} ${n(f('y2'))}`;
    case 'polyline':
    case 'polygon': {
      const p = a.points.trim().split(/[\s,]+/).map(Number);
      let d = `M${n(p[0])} ${n(p[1])}`;
      for (let i = 2; i < p.length; i += 2) d += `L${n(p[i])} ${n(p[i + 1])}`;
      return tag === 'polygon' ? d + 'z' : d;
    }
    case 'rect': {
      const x = f('x'), y = f('y'), w = f('width'), h = f('height');
      let rx = a.rx !== undefined ? f('rx') : a.ry !== undefined ? f('ry') : 0;
      let ry = a.ry !== undefined ? f('ry') : rx;
      rx = Math.min(rx, w / 2); ry = Math.min(ry, h / 2);
      if (!rx || !ry) return `M${n(x)} ${n(y)}h${n(w)}v${n(h)}h${n(-w)}z`;
      return `M${n(x + rx)} ${n(y)}h${n(w - 2 * rx)}a${n(rx)} ${n(ry)} 0 0 1 ${n(rx)} ${n(ry)}v${n(h - 2 * ry)}a${n(rx)} ${n(ry)} 0 0 1 ${n(-rx)} ${n(ry)}h${n(-(w - 2 * rx))}a${n(rx)} ${n(ry)} 0 0 1 ${n(-rx)} ${n(-ry)}v${n(-(h - 2 * ry))}a${n(rx)} ${n(ry)} 0 0 1 ${n(rx)} ${n(-ry)}z`;
    }
    default: throw new Error(`Unsupported Lucide element <${tag}>`);
  }
}

/* ------------------------------------------------------------------ build */
const evenkeelNames = new Set(Object.keys(evenkeelIcons));
const lucide: Record<string, string> = {};
const lucideCats: Partial<Record<IconCategory, string[]>> = {};
const missing: string[] = [], skippedCollision: string[] = [], dupes: string[] = [];
for (const cat of ICON_CATEGORIES) {
  for (const name of curated[cat].split(/\s+/).filter(Boolean)) {
    if (banned.test(name)) throw new Error(`Brand icon "${name}" is not allowed`);
    if (!nodes[name]) { missing.push(name); continue; }
    if (evenkeelNames.has(name)) { skippedCollision.push(name); continue; }
    if (lucide[name]) { dupes.push(name); continue; }
    lucide[name] = nodes[name].map(toPath).join('');
    (lucideCats[cat] ??= []).push(name);
  }
}
if (missing.length) { console.error(`✗ Not in lucide-static ${lucideVersion}: ${missing.join(', ')}`); process.exit(1); }

const q = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
const names = Object.keys(lucide).sort();
const ts = `/* eslint-disable */
// GENERATED by scripts/gen-icons.ts from lucide-static ${lucideVersion} (ISC, see THIRD_PARTY_NOTICES.md). Do not edit.
// A curated subset of Lucide (https://lucide.dev), each icon flattened to one SVG path on the 24 × 24 grid.

export const lucideIcons = {
${names.map((k) => `  ${q(k)}: ${q(lucide[k])},`).join('\n')}
} as const;

export type LucideIconName = keyof typeof lucideIcons;

/** Category → Lucide icons, in curated order. */
export const lucideCategories: Record<string, readonly LucideIconName[]> = {
${ICON_CATEGORIES.filter((c) => lucideCats[c]?.length).map((c) => `  ${q(c)}: [${lucideCats[c]!.map(q).join(', ')}],`).join('\n')}
};

/** Lucide search keywords (from lucide-static tags.json), for the docs gallery. */
export const lucideTags: Partial<Record<LucideIconName, string>> = {
${(() => {
  const tags: Record<string, string[]> = JSON.parse(readFileSync(resolve(lucideDir, 'tags.json'), 'utf8'));
  return names.filter((k) => tags[k]?.length).map((k) => `  ${q(k)}: ${q(tags[k].slice(0, 8).join(' '))},`).join('\n');
})()}
};
`;
writeFileSync(resolve(root, 'src/icons/lucide.generated.ts'), ts);

/* Figma: every icon as a complete SVG */
const svg = (d: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
const figma = [
  ...(Object.keys(evenkeelIcons) as EvenkeelIconName[]).map((name) => ({ name, category: evenkeelCategoryOf(name), source: 'evenkeel', svg: svg(evenkeelIcons[name]) })),
  ...ICON_CATEGORIES.flatMap((category) => (lucideCats[category] ?? []).map((name) => ({ name, category, source: 'lucide', svg: svg(lucide[name]) }))),
];
mkdirSync(resolve(root, 'build/figma'), { recursive: true });
writeFileSync(resolve(root, 'build/figma/icons.json'), JSON.stringify(figma, null, 1) + '\n');

/* Report */
const byCat = Object.fromEntries(ICON_CATEGORIES.map((c) => [c, figma.filter((i) => i.category === c).length]));
console.log(`✓ src/icons/lucide.generated.ts  ${names.length} Lucide icons (lucide-static ${lucideVersion})`);
console.log(`✓ build/figma/icons.json         ${figma.length} icons (${evenkeelNames.size} Evenkeel + ${names.length} Lucide)`);
if (skippedCollision.length) console.log(`  Evenkeel wins over Lucide: ${skippedCollision.join(', ')}`);
if (dupes.length) console.log(`  Listed twice (first category kept): ${dupes.join(', ')}`);
console.table(byCat);

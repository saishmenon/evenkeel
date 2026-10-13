#!/usr/bin/env node
/**
 * Fills in the release placeholders in one go, or checks that none are left.
 *
 *   node scripts/fill-placeholders.mjs --github <username> --contact <email> [--figma <community-url>]
 *   node scripts/fill-placeholders.mjs --check      # exits 1 if any placeholder is left
 *
 * You can run it twice: once before the first push (GitHub and contact), and again
 * after the Figma Community file is live (--figma).
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const SKIP_DIRS = new Set(['node_modules', 'dist', 'storybook-static', 'build', '.git']);
// Files that describe the placeholders on purpose.
const SKIP_FILES = new Set(['docs/publishing.md', 'scripts/fill-placeholders.mjs']);
const TEXT = /\.(md|mdx|ts|tsx|mjs|js|json|yml|yaml|cff|css|html)$|^CODEOWNERS$|^LICENSE$/;

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]?.startsWith('--') ? true : all[i + 1] ?? true]] : acc), []),
);

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (!SKIP_DIRS.has(name)) walk(p); continue; }
    const rel = relative(root, p);
    if (TEXT.test(name) && !SKIP_FILES.has(rel)) files.push(p);
  }
})(root);

const PATTERNS = [/<you>/g, /<figma-community-link>/g, /\(coming soon\)<!--figma-->/g, /\[INSERT [A-Z ]+\]/g];

if (args.check) {
  const left = [];
  for (const f of files) {
    const lines = readFileSync(f, 'utf8').split('\n');
    lines.forEach((l, i) => { if (PATTERNS.some((re) => { re.lastIndex = 0; return re.test(l); })) left.push(`${relative(root, f)}:${i + 1}  ${l.trim().slice(0, 100)}`); });
  }
  if (left.length) {
    console.error(`✗ ${left.length} placeholder line(s) left. Run: node scripts/fill-placeholders.mjs --github <username> --contact <email> --figma <url>\n`);
    console.error(left.join('\n'));
    process.exit(1);
  }
  console.log('✓ No placeholders left');
  process.exit(0);
}

const gh = typeof args.github === 'string' ? args.github.replace(/^@/, '') : null;
const contact = typeof args.contact === 'string' ? args.contact : null;
const figma = typeof args.figma === 'string' ? args.figma : null;
if (!gh && !contact && !figma) {
  console.error('Usage: node scripts/fill-placeholders.mjs --github <username> --contact <email> [--figma <community-url>]');
  process.exit(1);
}
if (gh && !/^[A-Za-z0-9-]{1,39}$/.test(gh)) { console.error(`"${gh}" is not a valid GitHub username`); process.exit(1); }
if (figma && !/^https:\/\/(www\.)?figma\.com\/community\//.test(figma)) { console.error('--figma should be a https://www.figma.com/community/... link'); process.exit(1); }

let changed = 0;
for (const f of files) {
  const before = readFileSync(f, 'utf8');
  let s = before;
  if (gh) {
    s = s.replace(/^# Replace <you> with the maintainer's GitHub username.*\n/m, '');
    s = s.replace(/`@<you>` \(update before publishing\)/g, `\`@${gh}\``);
    s = s.replace(/<you>/g, gh);
  }
  if (contact) s = s.replace(/\[INSERT [A-Z ]+\]/g, contact);
  if (figma) {
    s = s.replace(/<figma-community-link>/g, figma);
    // Links shown as "(coming soon)" until the Community file is live.
    s = s.replace(/(\*\*)?([^*\n·:]+?)(\*\*)? \(coming soon\)<!--figma-->/g, (_, b1 = '', text, b2 = '') => `${b1}${text.match(/^\s*/)[0]}[${text.trim()}](${figma})${b2}`);
  }
  if (s !== before) { writeFileSync(f, s); changed++; console.log(`  updated ${relative(root, f)}`); }
}
console.log(`\n${changed} file(s) updated. Run with --check to see anything still left.`);

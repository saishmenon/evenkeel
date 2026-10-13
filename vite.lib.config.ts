/**
 * Library build (npm run build:lib) → dist/
 *
 *   dist/index.js · index.cjs     the React components + applyTheme (ESM + CommonJS)
 *   dist/icons.js · icons.cjs     icon path data, for use without React
 *   dist/types/**                 TypeScript declarations (tsc -p tsconfig.build.json)
 *   dist/evenkeel.css              ONE stylesheet: tokens (build/css) + base + every component's CSS
 *   dist/tokens.css               tokens only (themes, colour roles, foundations), no components
 *   dist/fonts.css                optional: Inter + Bricolage Grotesque via @fontsource (needs a bundler)
 *   dist/tokens.json              the token data, shaped for the Figma sync
 *
 * Named vite.lib.config.ts (not vite.config.ts) so Storybook does not pick it up.
 * Run `npm run build:tokens` first; `npm run build` does both.
 */
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = import.meta.dirname;
const r = (p: string) => resolve(root, p);

// Optional entries: only built when the source exists (other parts of the system land independently).
const optional: Record<string, string[]> = {
  icons: ['src/icons/index.ts', 'src/icons/icons.ts'],
  illustrations: ['src/illustrations/index.ts', 'src/illustrations/index.tsx'],
};
const entry: Record<string, string> = { index: r('src/index.ts') };
for (const [name, candidates] of Object.entries(optional)) {
  const found = candidates.find((c) => existsSync(r(c)));
  if (found) entry[name] = r(found);
}

// The token files, in the order build/css/evenkeel.css imports them (so new generated files are picked up).
const tokenFilesFrom = (): string[] => {
  const index = r('build/css/evenkeel.css');
  if (!existsSync(index)) return ['themes.css', 'roles.css', 'foundations.css'];
  return [...readFileSync(index, 'utf8').matchAll(/@import\s+(?:url\()?['"]\.\/([^'"]+\.css)['"]/g)].map((m) => m[1]);
};
const stripImports = (css: string) => css.replace(/^@import[^;]+;\s*$/gm, '').trim();

function stripCssImportsFromTypes(dir: string) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir, { recursive: true }) as string[]) {
    if (!name.endsWith('.d.ts')) continue;
    const file = join(dir, name);
    const src = readFileSync(file, 'utf8');
    const next = src.replace(/^import\s+['"][^'"]+\.css['"];?\s*\n/gm, '');
    if (next !== src) writeFileSync(file, next);
  }
}

/** Puts tokens + base styles in front of the component CSS, and writes the side files. */
const COMPONENTS_CSS = 'evenkeel-components';
function evenkeelCss(): Plugin {
  return {
    name: 'evenkeel-css-bundle',
    apply: 'build',
    buildStart() {
      if (!existsSync(r('build/css/evenkeel.css'))) this.error('build/css/evenkeel.css is missing. Run "npm run build:tokens" first.');
      for (const f of tokenFilesFrom()) {
        if (!existsSync(r(`build/css/${f}`))) this.error(`build/css/${f} is missing. Run "npm run build:tokens" first.`);
      }
    },
    // Runs once per output format, after Vite has written the extracted component CSS.
    writeBundle(opts) {
      const out = opts.dir ?? r('dist');
      const compPath = join(out, `${COMPONENTS_CSS}.css`);
      if (!existsSync(compPath)) return; // already merged by the previous format
      const components = readFileSync(compPath, 'utf8');
      rmSync(compPath);
      const tokens = tokenFilesFrom().map((f) => `/* ---- ${f} ---- */\n` + stripImports(readFileSync(r(`build/css/${f}`), 'utf8'))).join('\n\n');
      // src/styles/index.css minus its @imports (fonts ship separately in fonts.css; tokens are inlined above).
      const base = stripImports(readFileSync(r('src/styles/index.css'), 'utf8'));
      const banner = '/*! Evenkeel | MIT License | https://github.com/saishmenon/evenkeel */\n';
      writeFileSync(join(out, 'evenkeel.css'), `${banner}\n/* ===== Tokens ===== */\n${tokens}\n\n/* ===== Base ===== */\n${base}\n\n/* ===== Components ===== */\n${components}`);
      writeFileSync(join(out, 'tokens.css'), `${banner}${tokens}\n`);
      writeFileSync(join(out, 'fonts.css'), `${banner}/* Optional. Needs a bundler that resolves package imports (Vite, webpack, Next.js…). */\n@import '@fontsource-variable/inter/opsz.css';\n@import '@fontsource-variable/bricolage-grotesque';\n`);
      if (existsSync(r('build/tokens.json'))) copyFileSync(r('build/tokens.json'), join(out, 'tokens.json'));
      // Lets `import 'evenkeel-ui/css'` type-check without a *.css module declaration.
      writeFileSync(join(out, 'css.d.ts'), '// Side-effect stylesheet import. Nothing is exported.\nexport {};\n');
      // tsc keeps `import './X.css'` in the .d.ts files; consumers have no such files. Drop them.
      stripCssImportsFromTypes(join(out, 'types'));
    },
  };
}

export default defineConfig({
  plugins: [react(), evenkeelCss()],
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: false, // tsc writes dist/types first
    sourcemap: true,
    minify: false,
    cssCodeSplit: false,
    lib: { entry, cssFileName: COMPONENTS_CSS, formats: ['es', 'cjs'], fileName: (format, name) => `${name}.${format === 'es' ? 'js' : 'cjs'}` },
    rollupOptions: {
      external: (id) => /^(react|react-dom|culori|@fontsource)(\/|$)/.test(id),
    },
  },
});

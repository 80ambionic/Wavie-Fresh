// Builds the offline assets that dist/index.html loads from dist/assets/:
//   tailwind.css  – compiled from the Tailwind classes used in dist/index.html
//   lucide.js     – only the Lucide icons the page uses (window.lucide.createIcons)
//   fonts.css + fonts/*.woff2 – Inter and JetBrains Mono, bundled locally
// Run with: npm run build:web
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const assets = join(dist, 'assets');
const fontsDir = join(assets, 'fonts');
mkdirSync(fontsDir, { recursive: true });

const html = readFileSync(join(dist, 'index.html'), 'utf8');

// ---------- 1. Tailwind CSS ----------
const twInput = join(root, 'build', 'tailwind.input.css');
writeFileSync(twInput, '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n');
execFileSync(
  process.execPath,
  [require.resolve('tailwindcss/lib/cli.js'), '-c', join(root, 'tailwind.config.cjs'),
   '-i', twInput, '-o', join(assets, 'tailwind.css'), '--minify'],
  { cwd: root, stdio: 'inherit' }
);

// ---------- 2. Lucide icons (only the ones used) ----------
const toPascal = (name) => name.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
const iconNames = [...new Set([...html.matchAll(/data-lucide="([a-z0-9-]+)"/g)].map((m) => m[1]))].sort();
const lucide = require('lucide');
const missing = iconNames.filter((n) => !lucide[toPascal(n)]);
if (missing.length) throw new Error(`Unknown Lucide icons: ${missing.join(', ')}`);
const imports = iconNames.map(toPascal);
await build({
  stdin: {
    contents: `import { createIcons, ${imports.join(', ')} } from 'lucide';
const icons = { ${imports.join(', ')} };
window.lucide = { icons, createIcons: (opts = {}) => createIcons({ icons, ...opts }) };`,
    resolveDir: root,
    loader: 'js',
  },
  bundle: true,
  minify: true,
  format: 'iife',
  target: ['es2019'],
  outfile: join(assets, 'lucide.js'),
  logLevel: 'warning',
});

// ---------- 3. Fonts ----------
const fonts = [
  { family: 'Inter', pkg: '@fontsource-variable/inter', file: 'inter' },
  { family: 'JetBrains Mono', pkg: '@fontsource-variable/jetbrains-mono', file: 'jetbrains-mono' },
];
const ranges = {
  'latin-ext': 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
  latin: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
};
let fontCss = '/* Bundled fonts (SIL Open Font License) */\n';
for (const f of fonts) {
  const pkgDir = dirname(require.resolve(`${f.pkg}/package.json`));
  for (const [subset, range] of Object.entries(ranges)) {
    const name = `${f.file}-${subset}-wght-normal.woff2`;
    copyFileSync(join(pkgDir, 'files', name), join(fontsDir, name));
    fontCss += `@font-face{font-family:'${f.family}';font-style:normal;font-display:swap;font-weight:100 900;src:url(fonts/${name}) format('woff2-variations'),url(fonts/${name}) format('woff2');unicode-range:${range}}\n`;
  }
}
writeFileSync(join(assets, 'fonts.css'), fontCss);

console.log(`Built offline assets: tailwind.css, lucide.js (${iconNames.length} icons), fonts.css`);

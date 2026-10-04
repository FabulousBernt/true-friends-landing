#!/usr/bin/env node
/* Keeps the landing page's stylesheets honest about the landing page.
 *
 *   node tools/check-css.js
 *
 * Three checks fail the run, one is advisory:
 *
 *   DEAD   a class rule exists that index.html never puts on an element
 *   TOKEN  a custom property is declared that no rule reads
 *   HUE    --gradient-hero carries a chromatic colour
 *   WARN   a class in index.html that no rule matches (may be inline-styled)
 *
 * Only the root index.html is scanned, and that is the whole justification: it
 * is the sole page in this repository that loads these four stylesheets.
 * consulting.html, studio.html and the reference-case pages are meta-refresh
 * stubs, and 1996/ has its own CSS. So DEAD means dead everywhere, not dead
 * on one page of many.
 *
 * The DEAD check exists because the alternative is invisible. A stylesheet
 * that used to be shared across five pages accumulates rules for the four
 * that moved to other domains, and no other tool here can see them:
 * check-links.js reads href/src in HTML and has no idea a selector exists, so
 * a sweep that deletes one rule too many passes every check in this repo.
 *
 * Note what is stripped before scanning, and why each strip is load-bearing.
 * Comments carry path-like text — `css/base.css`, `img/`, and the `g` unit in
 * `linear-gradient(...)` — and url("...hero.webp") carries a dot followed by a
 * word. Left in, the count is 102 rather than 97: the comments alone
 * contribute `css`, `js` and `g`, and the url()s contribute `webp` and `svg`.
 * Neither kind can produce a bare number, because the class pattern requires
 * a letter or underscore first — `.5` and the `4.66:1` in a comment are safe.
 *
 * One known blind spot, stated rather than hidden: DEAD reads class
 * attributes out of index.html and does not read js/main.js, so a class that
 * JavaScript puts on an element at runtime is reported as dead even while the
 * script still names it. Eight were — gallery__item, gallery__tile,
 * lightbox__thumb and the rest, all assigned by the gallery and lightbox code
 * in main.js. That code is itself inert and is being deleted, so the
 * conclusion holds; but if it is ever revived, this tool will not notice the
 * stylesheet underneath it going missing. Read DEAD together with main.js.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SHEETS = ['tokens.css', 'base.css', 'components.css', 'layout.css'];
const read = p => fs.readFileSync(path.join(ROOT, p), 'utf8');

const strip = s =>
  s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/url\((['"]?)[^)]*\1\)/g, 'url()');

/* ---- classes: rule -> element, and element -> rule ---- */
const inHtml = new Set();
for (const m of strip(read('index.html')).matchAll(/class="([^"]*)"/g)) {
  for (const c of m[1].split(/\s+/)) if (c) inHtml.add(c);
}

const declared = new Map();
for (const f of SHEETS) {
  for (const m of strip(read(path.join('css', f))).matchAll(/\.([A-Za-z_][\w-]*)/g)) {
    if (!declared.has(m[1])) declared.set(m[1], f);
  }
}

const dead = [...declared.keys()].filter(c => !inHtml.has(c)).sort();
const unstyled = [...inHtml].filter(c => !declared.has(c)).sort();

/* ---- tokens: declared -> read ---- */
const tokenSrc = read(path.join('css', 'tokens.css'));
const tokens = [...new Set([...tokenSrc.matchAll(/^\s*(--[\w-]+)\s*:/gm)].map(m => m[1]))];
const consumers = SHEETS.map(f => read(path.join('css', f))).join('\n');
const unused = tokens.filter(t => !consumers.includes('var(' + t + ')')).sort();

/* ---- the hero gradient must carry no hue ----
   Scoped to this one declaration on purpose. The page is not colourless and
   should not be: --color-accent is brand yellow and sets the CTA buttons. The
   requirement is that the layer *behind* the photograph is a greyscale ramp. */
const chromatic = [];
const grad = tokenSrc.match(/--gradient-hero:\s*([\s\S]*?);/);
if (!grad) {
  chromatic.push('--gradient-hero is not declared at all');
} else {
  const test = (r, g, b, at) => {
    if (r !== g || g !== b) chromatic.push(`${at} -> rgb(${r}, ${g}, ${b})`);
  };
  for (const m of grad[1].matchAll(/#([0-9a-f]{3,8})\b/gi)) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h.slice(0, 3)].map(c => c + c).join('');
    if (h.length < 6) continue;
    test(parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), '#' + m[1]);
  }
  for (const m of grad[1].matchAll(/rgba?\(([^)]*)\)/gi)) {
    const p = m[1].split(/[,/]/).map(s => s.trim()).filter(Boolean);
    const n = i => Math.round(parseFloat(p[i]) || 0);
    test(n(0), n(1), n(2), `rgba(${p.join(', ')})`);
  }
  for (const m of grad[1].matchAll(/hsla?\(([^)]*)\)/gi)) {
    const p = m[1].split(/[,/]/).map(s => s.trim());
    if ((parseFloat(p[1]) || 0) > 0) chromatic.push(`hsl(${p.join(', ')})`);
  }
}

/* ---- report ----
   A section header is followed immediately by its items, with no blank line
   between them. That is deliberate: the blank line goes ABOVE the header, so
   `sed -n '/^DEAD$/,/^HUE$/p'` captures a whole section. Leading the section
   with a blank line instead makes that range stop on the first line and
   silently print a header and nothing else. */
const count = (label, arr) => console.log('  ' + label.padEnd(26) + arr.length);
const section = (label, arr) => {
  if (!arr.length) return;
  console.log('\n' + label);
  console.log(arr.map(x => '  ' + x).join('\n'));
};

console.log('check-css — index.html against the four stylesheets it loads\n');
console.log(`  ${inHtml.size} classes in markup, ${declared.size} class rules, ${tokens.length} tokens\n`);
count('DEAD  rule, no element', dead);
count('TOKEN declared, no reader', unused);
count('HUE   chromatic gradient', chromatic);
count('WARN  unstyled (advisory)', unstyled);
section('DEAD', dead);
section('TOKEN', unused);
section('HUE', chromatic);
section('WARN', unstyled);

const failures = dead.length + unused.length + chromatic.length;
console.log(`\n${failures} problem(s)`);
process.exit(failures ? 1 : 0);

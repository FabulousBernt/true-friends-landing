#!/usr/bin/env node
/* Keeps the landing page's stylesheets honest about the landing page.
 *
 *   node tools/check-css.js
 *
 * Four checks fail the run, one is advisory:
 *
 *   DEAD   a class rule exists that index.html never puts on an element
 *   TOKEN  a custom property is declared that no rule reads
 *   HUE    --gradient-hero carries a chromatic #hex, rgb() or hsl() stop
 *   LINK   a stylesheet index.html loads that is not one of the four
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
 * Comments carry path-like text — `css/base.css`, `img/`, and the `e.g.` in
 * the prose comments in layout.css — and url("...hero.webp") carries a dot
 * followed by a word. Left in, the count is 102 rather than 97: the comments
 * alone contribute `css`, `js` and `g`, and the url()s contribute `webp` and
 * `svg`. Neither kind can produce a bare number, because the class pattern
 * requires a letter or underscore first — `.5` and the `4.66:1` in a comment
 * are safe.
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
const read = p => {
  const full = path.join(ROOT, p);
  if (!fs.existsSync(full)) {
    console.error('check-css: cannot read ' + p);
    process.exit(1);
  }
  return fs.readFileSync(full, 'utf8');
};

const stripCss = s =>
  s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/url\((['"]?)[^)]*\1\)/g, 'url()');
const stripHtml = s => s.replace(/<!--[\s\S]*?-->/g, '');

/* ---- classes: rule -> element, and element -> rule ----
   index.html gets the HTML stripper: a commented-out block would otherwise
   keep a dead rule alive silently. None of its five comments is one today. */
const inHtml = new Set();
for (const m of stripHtml(read('index.html')).matchAll(/class="([^"]*)"/g)) {
  for (const c of m[1].split(/\s+/)) if (c) inHtml.add(c);
}

const declared = new Map();
for (const f of SHEETS) {
  for (const m of stripCss(read(path.join('css', f))).matchAll(/\.([A-Za-z_][\w-]*)/g)) {
    if (!declared.has(m[1])) declared.set(m[1], new Set());
    declared.get(m[1]).add(f);
  }
}

/* A dead rule names the sheets carrying it, because the sweep deletes per
   file: dropping one copy of a two-sheet rule is not dropping the rule. */
const dead = [...declared.keys()]
  .filter(c => !inHtml.has(c))
  .sort()
  .map(c => `${c} (${[...declared.get(c)].join(', ')})`);
const unstyled = [...inHtml].filter(c => !declared.has(c)).sort();

/* ---- tokens: declared -> read ---- */
const tokenSrc = read(path.join('css', 'tokens.css'));
const tokens = [...new Set([...tokenSrc.matchAll(/^\s*(--[\w-]+)\s*:/gm)].map(m => m[1]))];
const consumers = SHEETS.map(f => read(path.join('css', f))).join('\n');
/* Matches both var(--x) and var(--x, fallback). The comma-or-paren is what
   makes the prefix case safe too: var(--color-bg-hover) does not match
   var(--color-bg). */
const isRead = t => new RegExp('var\\(\\s*' + t + '\\s*[,)]').test(consumers);
const unused = tokens.filter(t => !isRead(t)).sort();

/* ---- the hero gradient must carry no hue ----
   Scoped to this one declaration on purpose. The page is not colourless and
   should not be: --color-accent is brand yellow and sets the CTA buttons. The
   requirement is that the layer *behind* the photograph is a greyscale ramp.
   It reads #hex in 3, 4, 6 and 8 digit form, rgb()/rgba() and hsl()/hsla(),
   and nothing else — not oklch(), not color-mix(), not named colours. Enough,
   because this declaration is ours to write and uses those three. */
const chromatic = [];
/* Matched against the STRIPPED source, not the raw one. Stripping the captured
   value afterwards is too late: the non-greedy capture stops at the first `;`,
   which for a value holding url("…;…") is inside the url, and every stop after
   it goes unseen — a fully chromatic gradient reporting HUE 0. */
const grad = stripCss(tokenSrc).match(/--gradient-hero:\s*([\s\S]*?);/);
if (!grad) {
  chromatic.push('--gradient-hero is not declared at all');
} else {
  /* Already stripped, same as the sheets above: a comment inside the
     declaration is not a colour stop, and url() is not a colour either. */
  const stops = grad[1];
  const test = (r, g, b, at) => {
    if (r !== g || g !== b) chromatic.push(`${at} -> rgb(${r}, ${g}, ${b})`);
  };
  for (const m of stops.matchAll(/#([0-9a-f]{3,8})\b/gi)) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h.slice(0, 3)].map(c => c + c).join('');
    if (h.length < 6) continue;
    test(parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), '#' + m[1]);
  }
  for (const m of stops.matchAll(/rgba?\(([^)]*)\)/gi)) {
    const p = m[1].split(/[\s,/]+/).map(s => s.trim()).filter(Boolean);
    const n = i => Math.round(parseFloat(p[i]) || 0);
    test(n(0), n(1), n(2), `${m[0].slice(0, m[0].indexOf('('))}(${p.join(', ')})`);
  }
  for (const m of stops.matchAll(/hsla?\(([^)]*)\)/gi)) {
    const p = m[1].split(/[\s,/]+/).map(s => s.trim());
    if ((parseFloat(p[1]) || 0) > 0) chromatic.push(`hsl(${p.join(', ')})`);
  }
}

/* ---- the four sheets are the four index.html links ----
   The header's claim is that index.html is the only page loading these
   stylesheets. That is only half of it: the sheets also have to BE the ones
   it links. A fifth stylesheet added to the markup and used consistently
   would otherwise be invisible here, and its dead rules uncounted. */
/* rel and href are pulled out of each tag independently. HTML attribute order
   carries no meaning, and neither does quote style, so a matcher that assumes
   rel-then-href and double quotes reports a false LINK mismatch the first time
   anyone tidies the markup — and index.html's <head> is edited by this change.
   A cache-busting query is dropped for the same reason: css/tokens.css?v=2 is
   the same sheet. */
const attr = (tag, name) => {
  /* The i flag because HTML attribute names are case-insensitive: REL= and
     HREF= are the same attributes as rel= and href=. */
  const m = tag.match(new RegExp('\\b' + name + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i'));
  return m ? m[1] || m[2] || m[3] : null;
};
const linked = [];
for (const m of stripHtml(read('index.html')).matchAll(/<link\b[^>]*>/g)) {
  const rel = attr(m[0], 'rel');
  const href = attr(m[0], 'href');
  /* Same-tree only: index.html also links Google Fonts, which carries no rule
     of ours and so cannot make a class dead. */
  if (!rel || !href || /^(?:[a-z]+:)?\/\//.test(href)) continue;
  if (!rel.split(/\s+/).includes('stylesheet')) continue;
  linked.push(path.basename(href.split('?')[0]));
}
const linkMismatch = [];
for (const f of SHEETS) {
  if (!linked.includes(f)) linkMismatch.push(`${f} is styled but not linked from index.html`);
}
for (const f of linked) {
  if (!SHEETS.includes(f)) linkMismatch.push(`index.html links ${f}, which is not scanned`);
}

/* ---- report ----
   A section header is followed immediately by its items, with no blank line
   between them, and the blank line goes ABOVE the header. Two consequences,
   both learned the hard way:
     - A range keyed to the next header captures a whole section. Leading the
       section with a blank line instead makes `sed -n '/^DEAD/,/^$/p'` stop on
       that line and print a bare header.
     - But a header is only printed when its section is non-empty, so a sed
       range terminated by the next header runs on to EOF once that section
       empties. Extract with awk instead, which returns nothing when the
       header is absent:
         awk '/^DEAD$/{f=1;next} /^[A-Z]+$/{f=0} f && /^  /' report.txt
       Or just read the summary counts, which are printed unconditionally. */
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
count('LINK  sheet scan mismatch', linkMismatch);
section('DEAD', dead);
section('TOKEN', unused);
section('HUE', chromatic);
section('WARN', unstyled);
section('LINK', linkMismatch);

const failures = dead.length + unused.length + chromatic.length + linkMismatch.length;
console.log(`\n${failures} problem(s)`);
process.exit(failures ? 1 : 0);

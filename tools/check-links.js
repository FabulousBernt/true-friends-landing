#!/usr/bin/env node
/* Verifies every local reference in a site tree resolves to a real file.
 *
 * Covers three classes the split can break:
 *   - href/src in HTML, including pages nested two levels deep
 *   - anchor targets (#id) on same-tree pages, because a file can exist
 *     while the anchor on it does not
 *   - path-like strings inside js/translations/, where the wordmark and
 *     CV paths live and which no HTML scan would ever see
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(process.argv[2] || '.');
let broken = 0, checked = 0;

const walk = (d, out = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(d, e.name);
    e.isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
};

const files = walk(root);
/* `template.html` is a scaffold meant to be copied and filled in, not a page.
   Its live markup carries deliberate placeholders — <consultant-slug>, <slug>,
   <filename> — which are not references and cannot resolve. It is linked from
   nowhere and served to nobody. */
const html = files.filter(f => f.endsWith('.html') && path.basename(f) !== 'template.html');

/* HTML comments are stripped before scanning. The reference-case pages carry
   instructional blocks showing how to add a new case, full of placeholders
   like `<slug>` and `src="..."`. Those are documentation, not references, and
   scanning them reports 30 broken links in a repo that is entirely intact. */
const strip = src => src.replace(/<!--[\s\S]*?-->/g, '');
const idsOf = f => new Set(
  [...strip(fs.readFileSync(f, 'utf8')).matchAll(/\bid="([^"]+)"/g)].map(m => m[1])
);

const report = (from, target, why) => {
  broken++;
  console.log('BROKEN  ' + path.relative(root, from) + '  ->  ' + target + '  (' + why + ')');
};

for (const f of html) {
  const src = strip(fs.readFileSync(f, 'utf8'));
  /* The lookbehind matters: `\b` also matches the hyphen in
     `data-i18n-src="hero.consultingMark"`, which made the checker read a
     translation KEY as a path. Those keys resolve to real paths inside
     js/translations/, which the translation scan below already covers. */
  const refs = [...src.matchAll(/(?<![-\w])(?:href|src)="([^"]+)"/g)].map(m => m[1]);
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(ref)) {
      // Same-page anchors still need their target to exist.
      if (ref.startsWith('#') && ref !== '#') {
        checked++;
        if (!idsOf(f).has(ref.slice(1))) report(f, ref, 'no such id on this page');
      }
      continue;
    }
    const [rel, hash] = ref.split('#');
    let abs = path.resolve(path.dirname(f), rel.split('?')[0]);
    checked++;
    if (!fs.existsSync(abs)) { report(f, ref, 'file not found'); continue; }
    /* A link to a directory is served as its index.html. This matters: after
       the rename, reference cases point at `../../#services`, and checking
       only that the directory exists would pass while the anchor is missing —
       which is the exact failure Review Focus 2 names. */
    if (fs.statSync(abs).isDirectory()) {
      const idx = path.join(abs, 'index.html');
      if (!fs.existsSync(idx)) { report(f, ref, 'directory has no index.html'); continue; }
      abs = idx;
    }
    if (hash && abs.endsWith('.html')) {
      if (!idsOf(abs).has(hash)) report(f, ref, 'file exists, anchor does not');
    }
  }
}

// Paths that live in translation data rather than markup.
for (const f of files.filter(f => f.includes(path.sep + 'translations' + path.sep) || f.endsWith('translations.js'))) {
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(/"((?:img|css|js|cv)\/[^"]+)"/g)) {
    const abs = path.resolve(root, m[1]);
    checked++;
    if (!fs.existsSync(abs)) report(f, m[1], 'referenced from translation data');
  }
}

console.log('\n' + checked + ' references checked, ' + broken + ' broken');
process.exit(broken ? 1 : 0);

#!/usr/bin/env node
/* Keep the pages and the translation files honest about each other.
 *
 *   node tools/i18n.js check   verify every key resolves, and every inline
 *                              fallback matches its English string
 *   node tools/i18n.js sync    rewrite the fallbacks from the English strings
 *
 * Why the fallbacks matter: the text inside a data-i18n element is what the
 * browser paints before the translation pass runs, and what it keeps when
 * scripting is off. Let it drift and the page flashes the stale value on
 * every load — which is how "TF Classic" kept surfacing for a moment after
 * the button had been renamed to "TF 1996".
 *
 * Run `sync` after editing a translation file or regenerating a page, and
 * `check` before committing.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const ATTRS = [
  "data-i18n", "data-i18n-html", "data-i18n-placeholder", "data-i18n-aria-label",
  "data-i18n-content", "data-i18n-href", "data-i18n-alt", "data-i18n-title",
  "data-i18n-src",
];

// Each page loads the shared dictionary plus one of its own. The reference-case
// templates are kept in the list so their chrome stays in sync, but they are
// exempt from the key scan: their prose keys carry a literal <slug> that the
// person copying the file fills in.
const pages = [];
for (const dir of [".", "1996"]) {
  pages.push([`${dir}/index.html`, dir, "landing.js"]);
  pages.push([`${dir}/consulting.html`, dir, "consulting.js"]);
  pages.push([`${dir}/studio.html`, dir, "studio.js"]);
  pages.push([`${dir}/reference-cases/template.html`, dir, "consulting.js", "template"]);
  for (const slug of ["avarn", "bufab", "epiroc", "kopparbergs-brewery", "ske-kraft", "sectra"]) {
    pages.push([`${dir}/reference-cases/johnny-vigersten/${slug}.html`, dir, `johnny-vigersten/${slug}.js`]);
  }
}

function dictionaries(dir, page) {
  // The translation files assign onto `window`, so give them one.
  global.window = {};
  const paths = [
    path.join(ROOT, dir, "js/translations/common.js"),
    path.join(ROOT, dir, "js/translations", page),
  ].filter(fs.existsSync);
  for (const p of paths) require(p);
  const dict = global.window.TF_TRANSLATIONS;
  for (const p of paths) delete require.cache[require.resolve(p)];
  return dict;
}

const get = (o, p) => p.split(".").reduce((a, k) => (a && a[k] !== undefined ? a[k] : undefined), o);
const stripComments = (s) => s.replace(/<!--[\s\S]*?-->/g, "");
const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const decode = (s) => s
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").replace(/&times;/g, "×")
  .replace(/&hellip;/g, "…").replace(/&amp;/g, "&");

// <tag ... data-i18n="key">text</tag>, text only (no nested markup).
const FALLBACK = /(<(\w+)(?=[\s>])[^<>]*\sdata-i18n="([^"]+)"[^<>]*>)([^<]*)(<\/\2>)/g;

const mode = process.argv[2] || "check";
let problems = 0, synced = 0, touched = 0;

for (const [file, dir, own, kind] of pages) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) continue;
  const dict = dictionaries(dir, own);
  const source = fs.readFileSync(full, "utf8");
  const html = stripComments(source);

  if (mode === "check") {
    // Every key referenced must exist in both languages.
    for (const attr of kind === "template" ? [] : ATTRS) {
      const re = new RegExp(`\\s${attr}="([^"]+)"`, "g");
      for (const [, key] of html.matchAll(re)) {
        for (const lang of ["en", "sv"]) {
          if (typeof get(dict[lang], key) !== "string") {
            console.log(`MISSING  ${file}\n         ${attr}="${key}" unresolved in ${lang}`);
            problems++;
          }
        }
      }
    }
    // Every fallback must read as the English string.
    for (const [, , , key, text] of html.matchAll(FALLBACK)) {
      const en = get(dict.en, key);
      if (typeof en !== "string" || !text.trim() || en.includes("{")) continue;
      if (decode(text) !== en) {
        console.log(`DRIFT    ${file}\n         key:    ${key}\n         markup: ${decode(text)}\n         en:     ${en}`);
        problems++;
      }
    }
  } else {
    const next = source.replace(FALLBACK, (whole, open, tag, key, text, close) => {
      const en = get(dict.en, key);
      if (typeof en !== "string" || !text.trim() || en.includes("{")) return whole;
      const wanted = escape(en);
      if (text === wanted) return whole;
      synced++;
      return open + wanted + close;
    });
    if (next !== source) { fs.writeFileSync(full, next); touched++; }
  }
}

if (mode === "check") {
  console.log(problems ? `\n${problems} problem(s) across ${pages.length} pages` : `clean — ${pages.length} pages`);
  process.exit(problems ? 1 : 0);
}
console.log(`synced ${synced} fallback(s) across ${touched} file(s)`);

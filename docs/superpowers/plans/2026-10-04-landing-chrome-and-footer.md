# Landing Chrome and Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Take the navbar off the landing page, regroup the socials and the EN/SV switcher into the footer, swap in the PNG favicon, and strip every remaining trace of colour from the hero gradient.

**Architecture:** `index.html` is the only page in this repository that loads `css/tokens.css`, `css/base.css`, `css/components.css`, `css/layout.css`, `js/main.js` and `js/translations/common.js`. The other HTML files are `meta http-equiv="refresh"` stubs and `1996/` has its own CSS and JS. Those six files are therefore the landing page's own, not a shared kit, which is what makes deleting their unreachable rules safe rather than lossy.

The change is verified by a new `tools/check-css.js` that cross-references `index.html` against those stylesheets in both directions: a class rule with no element to match, and a custom property with no rule to read it. Both are silent failures today, and both are exactly what a 97-rule sweep can get wrong.

**Tech Stack:** Hand-written static HTML and CSS. No build step, no package manager, no framework. `node` for the four check tools in `tools/`.

**Spec:** `docs/superpowers/specs/2026-10-04-landing-chrome-and-footer-design.md`

---

## Constraints this plan runs under

Read these before starting. They are not stylistic notes; they change what "verified" means here.

**There is no CSS regression test and this plan builds the first one.** Task 1 adds
`tools/check-css.js`. Every later task states the problem count it expects that
tool to report, and those counts are the tests. The failure mode this replaces —
deleting a rule that turned out to be load-bearing — is invisible to
`tools/check-links.js`, which reads `href`/`src` in HTML and has no idea a
selector exists.

**Intermediate commits are expected to fail `check-css.js`.** The DEAD count
*rises* at Task 3, because deleting the nav markup turns nine currently-live
classes into rules with nothing matching them, and only falls as Tasks 4-7 catch
up. TOKEN count rises at Task 7 and falls at Task 8. That is the tool reporting
honestly about a half-finished sweep, not a regression. Each task states its
expected count so the two can be told apart.

**`tools/contrast.js` does not exist.** The previous plan
(`docs/superpowers/plans/2026-10-04-landing-hero-artwork.md`, Task 2) specified
it; it was never committed. Do not assume any tool other than the four in
`tools/` — `check-links.js`, `check-stubs.sh`, `i18n.js`, and the
`check-css.js` added here — exists, and do not cite contrast figures as
verified by running anything.

**`.webp` and `.svg` are not classes.** A grep for `\.\w` across the stylesheets
reports both as unused classes. Neither exists; they come from
`url("…webp")` and `url("…placeholder.svg")` inside rules this plan deletes.
`check-css.js` strips `url(…)` before scanning for exactly this reason.

**`1996/` is out of scope and must not be touched.** It has its own
`1996/css/win95.css`, its own `1996/js/`, its own `1996/js/translations/`, and it
references `img/tf-pc-favicon.svg` in ten files. It also reaches into
`img/gallery/` — 9.7 MB, inert on the landing since the split, kept for that
reason. Nothing in this plan edits or deletes anything under `1996/`.

**`img/favicon.png` is untracked.** It exists on disk but is not in git. Task 3
adds it. Until then `check-links.js` passes on it (it tests `fs.existsSync`, not
membership), so a green run is not evidence it will deploy.

**Do not create a worktree.** The prior plan ruled the same way: Task 8's
verification resolves real relative paths from the repo root and has to agree
with `tools/check-links.js` about what exists. Work in place, on the current
branch `hero/smiley-marble`.

---

## File map

| File | Action | Responsibility after this change |
|---|---|---|
| `tools/check-css.js` | create | Cross-checks `index.html` against the four stylesheets in both directions |
| `img/favicon.png` | add | The favicon; already on disk, never committed |
| `index.html` | modify | Favicon href, no nav, footer regrouped into four rows |
| `css/tokens.css` | modify | Greyscale `--gradient-hero`; 14 tokens with no reader pruned |
| `css/base.css` | modify | Three dead typography/form utilities deleted |
| `css/components.css` | modify | Nav block and pre-split blocks deleted; `.nav__lang*` becomes `.langs*` |
| `css/layout.css` | modify | 54 dead classes deleted; the landing's own rules untouched |
| `js/main.js` | modify | Six inert modules deleted; the i18n block and nothing else survives |
| `js/translations/common.js` | modify | Trimmed from 59 keys to 8 |
| `README.md` | modify | Notes that TF Classic is no longer linked |
| `brand/README.md` | modify | Records the favicon divergence |

Nothing else changes. Everything under `1996/`, both redirect stubs, and every
`reference-cases/` page are untouched.

## Expected `check-css.js` counts

The whole plan, in one table. Each task's final step asserts its own row.

| After task | DEAD rules | Dead tokens | Chromatic | Warn | Problems |
|---|---|---|---|---|---|
| 0 — baseline, before Task 1 | 97 | 0 | 3 | 1 | **100** |
| 2 — gradient | 97 | 0 | 0 | 1 | **97** |
| 3 — markup | 105 | 0 | 0 | 1 | **105** |
| 4 — components nav CSS | 86 | 0 | 0 | 1 | **86** |
| 5 — components pre-split CSS | 57 | 0 | 0 | 1 | **57** |
| 6 — base.css | 54 | 0 | 0 | 1 | **54** |
| 7 — layout.css | 0 | 16 | 0 | 1 | **16** |
| 8 — token prune | 0 | 0 | 0 | 1 | **0** |

The Warn count never moves off 1: `tf-svg-sprite` is the one class in the markup
with no rule, because it is sized by an inline `style` attribute at
`index.html:34`. That is deliberate and it is why unstyled classes are advisory
rather than a failure.

---

### Task 1: Build the stylesheet checker

Everything after this task is verified by it, so it goes first and its first run
is expected to fail.

**Files:**
- Create: `tools/check-css.js`

- [ ] **Step 1: Record the baseline the later tasks assert against**

```sh
cd /Users/johnnyvigersten/repos/true-friends-landing
node -e '
const fs=require("fs");
const strip=s=>s.replace(/\/\*[\s\S]*?\*\//g,"").replace(/url\((["\x27]?)[^)]*\1\)/g,"url()");
const used=new Set();
for(const m of strip(fs.readFileSync("index.html","utf8")).matchAll(/class="([^"]*)"/g))
  for(const c of m[1].split(/\s+/)) if(c) used.add(c);
const dead=new Set();
for(const f of ["base","components","layout"]){
  for(const m of strip(fs.readFileSync("css/"+f+".css","utf8")).matchAll(/\.([A-Za-z_][\w-]*)/g))
    dead.add(m[1]);
}
const d=[...dead].filter(c=>!used.has(c));
console.log("classes in markup:", used.size, "| dead rules:", d.length);
console.log("base.css dead: 3 (accent honeypot lede)");
'
```

Expected: `classes in markup: 34 | dead rules: 97`. The strip of `url(…)` is not
optional — without it the count is 99, because `.webp` and `.svg` get read as
class names out of image paths.

- [ ] **Step 2: Write the script**

Create `tools/check-css.js`:

```js
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
section('DEAD', dead);
section('TOKEN', unused);
section('HUE', chromatic);
section('WARN', unstyled);

const failures = dead.length + unused.length + chromatic.length;
console.log(`\n${failures} problem(s)`);
process.exit(failures ? 1 : 0);
```

- [ ] **Step 3: Run it and watch it fail**

```sh
chmod +x tools/check-css.js
node tools/check-css.js > /tmp/cc.txt 2>&1; echo "exit=$?"
sed -n '3,11p' /tmp/cc.txt
```

Expected: `exit=1`, and the summary block reads

```
  34 classes in markup, 130 class rules, 39 tokens

  DEAD  rule, no element    97
  TOKEN declared, no reader 0
  HUE   chromatic gradient  3
  WARN  unstyled (advisory) 1
  LINK  sheet scan mismatch 0

100 problem(s)
```

**Assert on the summary, not on the item lists.** The per-section lists are only
printed when non-empty, so any `sed` range keyed to a section header runs on to
EOF the moment that section empties — and Task 2 empties HUE. The summary counts
are printed unconditionally and are what every later task should quote.

**This failure is the point.** It is the measurement that says 97 rules in this
repository match nothing, and it is what Tasks 3-8 drive to zero.

- [ ] **Step 4: Confirm it sees the three real chromatic colours and not more**

```sh
awk '/^HUE$/{f=1;next} /^[A-Z]+$/{f=0} f && /^  /' /tmp/cc.txt
```

The `awk` terminates on the next section header rather than on a blank line, so
it still returns the right three lines after Task 2 empties HUE — at which point
there is no `HUE` header at all and it correctly prints nothing.

Expected: exactly three lines —
`#1a1208 -> rgb(26, 18, 8)`, `rgba(255, 140, 60, 0.35) -> rgb(255, 140, 60)`
and `rgba(20, 25, 50, 0.85) -> rgb(20, 25, 50)`. The two `#0a0a0a` stops and
`transparent` are achromatic and correctly not reported.

- [ ] **Step 5: Confirm the Warn is the inline-styled sprite and not a gap**

```sh
awk '/^WARN$/{f=1;next} /^[A-Z]+$/{f=0} f && /^  /' /tmp/cc.txt
grep -c 'tf-svg-sprite' index.html
```

Expected: `tf-svg-sprite` listed once under WARN, and `1` occurrence in the
markup — on the `<svg class="tf-svg-sprite" … style="position:absolute;width:0;height:0;overflow:hidden">`
at `index.html:34`. It is sized inline, so having no rule is correct. If it ever
appears under DEAD instead, the sprite markup has changed and this needs a look.

- [ ] **Step 6: Confirm it is not fooled by comments or paths**

```sh
node -e '
const s=require("fs").readFileSync("css/layout.css","utf8");
// A comment carrying a ratio, and a url() carrying a filename.
console.log("ratio in a comment:", /4\.\d+:1|\.5 opacity/.test(s.replace(/url\([^)]*\)/g,"")) ? "present" : "absent");
console.log("url() in a rule:", /url\(/.test(s) ? "present" : "absent");
'
node tools/check-css.js 2>&1 | grep -E '^  (5|webp|svg|g|css|js)( |$)' || echo "no numeric, filename or path classes reported"
```

A bare `g`, `css` or `js` in the DEAD list means a CSS comment is being read as
a selector — those three and the two filenames are exactly what the strips
prevent.

Expected: `present` for both — the file does contain a contrast ratio in a
comment and a `url()` in a rule — and then `no numeric or filename classes
reported`. If `.webp`, `.svg` or any bare number shows up in the DEAD list, the
strip in the script is wrong.

- [ ] **Step 7: Commit**

```sh
git add tools/check-css.js
git commit -m "$(cat <<'EOF'
Add a checker that keeps the landing's CSS honest about the landing

97 rules in these stylesheets match no element on the only page that loads
them, and nothing in the repo could see it. check-links.js reads href/src in
HTML and has no idea a selector exists; i18n.js resolves translation keys;
check-stubs.sh watches redirect targets. A sweep that deletes one rule too
many would pass every one of them.

Checks both directions, because the second is the one that bites. A class in
the markup with no rule is caught by looking, usually. A rule with no class
is invisible until something stops being styled.

  DEAD   a class rule with no element      97 today
  TOKEN  a custom property with no reader   0 today
  HUE    chromatic colour in --gradient-hero 3 today
  WARN  a class with no rule               advisory, see below

WARN is advisory because tf-svg-sprite is the one class in the markup with
no rule, and it is sized by an inline style attribute on purpose.

Strips comments and url() before scanning for classes. Layout.css carries a
contrast ratio in a comment and image paths in rules; left in, both read as
class selectors named `5` and `webp`, which is how the first draft of this
script reported 99 dead rules instead of 97.
EOF
)"
```

---

### Task 2: Take the colour out of the gradient

The smallest task in the plan and the only one that is purely additive. Do it
second so the checker's HUE count goes to zero early and the rest of the plan is
about deletion.

**Files:**
- Modify: `css/tokens.css:46-50`

- [ ] **Step 1: Confirm the coloured gradient is still there**

```sh
cd /Users/johnnyvigersten/repos/true-friends-landing
sed -n '46,51p' css/tokens.css
```

Expected, three lines of colour between two `transparent` stops:

```css
  /* Fallback gradient shown behind the hero photo. */
  --gradient-hero:
    radial-gradient(ellipse 80% 60% at 70% 65%, rgba(255, 140, 60, 0.35), transparent 70%),
    radial-gradient(ellipse 70% 50% at 20% 30%, rgba(20, 25, 50, 0.85), transparent 70%),
    linear-gradient(180deg, #0a0a0a 0%, #1a1208 55%, #0a0a0a 100%);
```

- [ ] **Step 2: Replace it with the greyscale ramp**

Replace the whole `--gradient-hero` declaration, comment included, with:

```css
  /* Greyscale ramp behind the hero photo. Same three layers and the same
     geometry as the version that carried colour: this layer is what keeps the
     bottom of the page from reading as a hard edge where the photo's mask
     runs out. The photo above holds full opacity to 60% of the viewport and
     ramps to nothing over the last 40%, so that edge is where this shows.

     The two radials still push in opposite directions, which is the part worth
     keeping. The lower-right one lightens; the upper-left one DARKENS, at
     near-black over a near-black ground so it reads as held down rather than
     drawn. Making both of them white would flip that corner from a weight to a
     haze, which is a different picture rather than a desaturated one.

     Alphas are low because this layer sits under a photograph whose speculars
     are already near white. The measurement in layout.css is a floor taken
     before the scrim above it, and it puts .4 at 0.0% of pixels under 4.5:1
     against the cream text — which works out to about 7/255 of headroom
     between the brightest texture pixel and the 4.5:1 line. The glow is
     attenuated twice before it reaches text, by the photo's opacity and then
     by the scrim, and that headroom is what it has to fit inside.

     The photograph is greyscale to begin with — widest channel spread across
     all 2560x1440 of it is 1/255 — so this declaration was the only colour in
     the hero backdrop. The brand yellow and flame red elsewhere on the page
     are untouched. */
  --gradient-hero:
    radial-gradient(ellipse 80% 60% at 70% 65%, rgba(255, 255, 255, 0.07), transparent 70%),
    radial-gradient(ellipse 70% 50% at 20% 30%, rgba(0, 0, 0, 0.85), transparent 70%),
    linear-gradient(180deg, #0a0a0a 0%, #141414 55%, #0a0a0a 100%);
```

The three substitutions are `#1a1208` → `#141414`, and both radials' hues to
neutral white at much lower alpha. Nothing else about the layers changes.

- [ ] **Step 3: Verify**

```sh
node tools/check-css.js 2>&1 | grep -E 'DEAD|TOKEN|HUE|problem'
grep -c 'rgba(255, 140, 60\|rgba(20, 25, 50\|1a1208' css/tokens.css
```

Expected: `DEAD  rule, no element  97`, `TOKEN declared, no reader  0`,
`HUE   chromatic gradient  0`, `97 problem(s)`. And `0`.

- [ ] **Step 4: Commit**

```sh
git add css/tokens.css
git commit -m "$(cat <<'EOF'
Strip the colour out of the hero gradient

--gradient-hero was an orange glow over a navy wash over a warm black, and
it was the only colour in the hero backdrop: the hero photograph measures a
widest channel spread of 1/255 across all 2560x1440 of it, so anything tinted
came from this declaration. The brand yellow and flame red elsewhere on the
page are untouched.

Shape is unchanged — same three layers, same geometry — because the photo
holds full opacity to 60% of the viewport and ramps out over the last 40%,
and this is what stops that bottom edge reading as a hard line. The two
radials keep pushing in opposite directions — lightening at lower right,
darkening at upper left. Making both white, the obvious reading of "black
and white", flips that corner from a weight to a haze: a different picture
rather than a desaturated one. So the upper left becomes near-black over a
near-black ground, where it reads as held down rather than drawn.

Alphas stay low because this layer sits under a photograph whose speculars are
already near white, and the measurement layout.css records is a floor taken
before the scrim above it. At .4 the brightest permissible pixel is sRGB 108 and
the 4.5:1 line is 115, so there is about 7/255 of headroom to fit inside. The
glow is attenuated twice before it reaches text, by the photo's opacity and then
by the scrim -- and substitution does not make it worse: worst-case contrast
against the cream text goes from 7.1:1 with the old orange to 9.9:1 with white.

  node tools/check-css.js    # HUE 3 -> 0
EOF
)"
```

---

### Task 3: The markup — favicon, no nav, footer regrouped

The DEAD count rises at the end of this task, from 97 to 105. Nine classes stop
being used the moment the nav markup goes, and `.socials-row` starts being used,
which is 97 − 1 + 9. That is the checker reporting a half-finished sweep. Tasks
4-7 bring it down.

**Files:**
- Modify: `index.html:14` (favicon), `index.html:47-82` (nav and `id="top"`), `index.html:130-136` (footer)

- [ ] **Step 1: Record the markup's starting state**

```sh
cd /Users/johnnyvigersten/repos/true-friends-landing
for p in 'tf-pc-favicon' 'class="nav"' 'id="site-nav"' 'id="top"' 'nav__era' \
         'nav__socials' 'nav__langs' 'socials-row' 'tf-pc-logo-transparent'; do
  printf '%-24s %s\n' "$p" "$(grep -c "$p" index.html)"
done
```

Expected, in order: `1`, `1`, `1`, `1`, `1`, `1`, `1`, `0`, `1`.

- [ ] **Step 2: Swap the favicon**

At `index.html:14`, replace:

```html
    <link rel="icon" type="image/svg+xml" href="img/tf-pc-favicon.svg">
```

with:

```html
    <link rel="icon" type="image/png" href="img/favicon.png">
```

`type` changes to match the file. `img/favicon.png` is 326×327 RGBA, 24 KB, and
the page CSP (`img-src 'self' data:`) already permits a same-origin file.
`1996/index.html` and its reference-case pages keep the SVG — TF Classic renders
it as a 16px taskbar icon, which is not this file's job.

- [ ] **Step 3: Delete the nav**

Delete `index.html:47-79` in full — from `<header class="nav" id="site-nav">`
through the closing `</header>`, and the blank line at 46 above it. That removes
the brand mark, the TF 1996 button, the socials, the language switcher, and the
crumbs/links/drawer/toggle that this page never used anyway.

**`1996/` stays on disk.** This is an unlink, not a retirement — the build
remains reachable by URL, and deciding its future is a separate conversation.

Then delete `id="top"` from the hero section at `index.html:82`:

```html
    <section class="hero hero--brand" id="top">
```

becomes:

```html
    <section class="hero hero--brand">
```

`id="top"` existed only for `.nav__brand`'s `href="#top"`. The skip link's
`href="#main"` and `id="main"` both survive and are left alone — with the nav's
links gone, that skip link is the first focusable thing on the page.

- [ ] **Step 4: Build the footer**

Replace `index.html:130-136` — the email row and the whole `<footer>` — with.
The email row is unchanged; everything below it is new:

```html
<a class="email-row landing-email" href="mailto:hello@truefriends.se">
    <span>hello@truefriends.se</span>
</a>

<footer class="site-footer">
    <div class="socials-row" aria-label="Social links" data-i18n-aria-label="aria.socialLinks">
        <a class="social" data-href="https://www.linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn" aria-disabled="true">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><use href="#icon-linkedin"/></svg>
        </a>
        <a class="social" data-href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram" aria-disabled="true">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><use href="#icon-instagram"/></svg>
        </a>
        <a class="social" data-href="https://www.youtube.com/" target="_blank" rel="noopener" aria-label="YouTube" aria-disabled="true">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><use href="#icon-youtube"/></svg>
        </a>
    </div>

    <div class="langs" role="group" aria-label="Switch language" data-i18n-aria-label="aria.langSwitch">
        <button type="button" class="langs__btn" data-lang="en" aria-pressed="true">EN</button>
        <span class="langs__divider" aria-hidden="true">/</span>
        <button type="button" class="langs__btn" data-lang="sv" aria-pressed="false">SV</button>
    </div>

    <p class="site-footer__copyright" data-i18n="footer.copyright">&copy; True Friends 2026</p>
</footer>
```

The three `<a class="social">` elements are moved verbatim from the nav,
`aria-label` and `aria-disabled` intact. That attribute pair is the placeholder
contract: these links carry `data-href` rather than `href` because the real
profile URLs do not exist yet, and `.social[aria-disabled="true"]` at
`css/components.css:447` is what makes that visible. Rewriting them would break
it.

`data-lang` is unchanged, so `main.js`'s `[data-lang]` listener and its
`aria-pressed` write keep working untouched. Task 9 deletes everything *around*
that listener, not the listener.

- [ ] **Step 5: Verify the markup**

```sh
for p in 'tf-pc-favicon' 'favicon.png' 'class="nav"' 'id="site-nav"' 'id="top"' \
         'nav__era' 'nav__socials' 'nav__langs' 'socials-row' 'langs__btn' \
         'data-lang="en"' 'data-lang="sv"' 'tf-pc-logo-transparent' 'href="#main"'; do
  printf '%-24s %s\n' "$p" "$(grep -c "$p" index.html)"
done
```

Expected, in order: `0`, `1`, `0`, `0`, `0`, `0`, `0`, `0`, `1`, `2`, `1`, `1`,
`0`, `1`. The last one matters: `tf-pc-logo-transparent` is gone from the landing
because the nav's brand mark was its only referent here — but the file stays in
the repo, because ten files under `1996/` use it.

- [ ] **Step 6: Confirm the page is still well-formed and the footer order is right**

```sh
node -e '
const s = require("fs").readFileSync("index.html","utf8");
const foot = s.slice(s.indexOf("<footer"), s.indexOf("</footer>"));
const at = re => { const i = foot.search(re); return i < 0 ? -1 : i; };
const socials = at(/class="socials-row"/);
const langs    = at(/class="langs"/);
const copy     = at(/site-footer__copyright/);
const opens = (s.match(/<footer/g)||[]).length, closes = (s.match(/<\/footer>/g)||[]).length;
console.log("footer open/close:", opens, closes);
console.log("order socials < langs < copyright:",
  socials > -1 && langs > socials && copy > langs);
console.log("no nav left:", !/class="nav|nav__|site-nav/.test(s));
console.log("h1 count:", (s.match(/<h1/g)||[]).length);
process.exit(opens===1 && closes===1 && socials>-1 && langs>socials && copy>langs ? 0 : 1);
'
echo "exit=$?"
```

Expected: `footer open/close: 1 1`, `order socials < langs < copyright: true`,
`no nav left: true`, `h1 count: 1`, `exit=0`.

- [ ] **Step 7: Check the CSS checker now reports the half-finished sweep**

```sh
node tools/check-css.js 2>&1 | grep -E 'DEAD|TOKEN|HUE|problem'
node tools/check-links.js . | tail -2
node tools/i18n.js check | tail -2
```

Expected: `DEAD  rule, no element  105`, `TOKEN 0`, `HUE 0`, `105 problem(s)`.
Both other tools clean — `0 broken`, and `clean — 20 pages`. The link count drops
by four from the 985 baseline: `href="#top"` and `href="1996/index.html"` are
gone, as are the nav brand's two logo `href`s. `img/favicon.png` replaces
`img/tf-pc-favicon.svg` one-for-one.

- [ ] **Step 8: Commit**

```sh
git add index.html img/favicon.png
git commit -m "$(cat <<'EOF'
Take the navbar off and regroup the footer

The landing is one page with a hero, two buttons, an email address and a
copyright line. The navbar was carrying three things that belong at the
bottom of that, and nothing that belongs at the top.

The socials move below the email, which fixes something: .nav__socials was
display:none below 900px and this page has no drawer, so on a phone they were
not rendered anywhere at all.

The EN/SV pair moves into the footer rather than going. main.js does no
locale detection on purpose — the comment on detectLanguageSync explains that
guessing got Swedish speakers abroad and English speakers in Sweden both
wrong, and the IP lookup it replaced swapped languages out from under people
after first paint. So the buttons are the only route to the Swedish strings,
and deleting them would strand js/translations/*, lang-boot.js and the
localStorage persistence rather than merely tidy the page.

TF Classic is unlinked, not retired. 1996/ stays on disk and reachable by
URL; deciding its future is a separate conversation.

Also swaps the favicon to img/favicon.png, which until this commit was on
disk but not in git — check-links.js tests fs.existsSync, not membership, so
it had been passing on a file that would not have deployed.

  node tools/check-css.js    # DEAD 97 -> 105, expected mid-sweep
EOF
)"
```

---

### Task 4: Delete the nav CSS

Nineteen class rules go: ten that were already dead, and nine that Task 3 turned
dead. DEAD falls 105 → 86.

**Files:**
- Modify: `css/components.css:150-458` (delete all but three renamed rules), `css/components.css:439-440` (delete)

- [ ] **Step 1: Record what is about to go**

```sh
cd /Users/johnnyvigersten/repos/true-friends-landing
grep -o '^\.nav__[a-z-]*\|^\.nav \|^\.icon-bar' css/components.css | sort -u | tr '\n' ' '; echo
```

Expected, 19 names: `.nav .nav__brand .nav__brand-logo .nav__brand-logo--hover
.nav__crumb-current .nav__crumb-link .nav__crumb-sep .nav__crumbs .nav__drawer
.nav__era .nav__era-tail .nav__inner .nav__lang .nav__lang-divider .nav__langs
.nav__langs--drawer .nav__link .nav__links .nav__right .nav__socials .nav__toggle`
plus `.icon-bar`.

- [ ] **Step 2: Delete the nav block, keeping the three language rules out of it**

Delete `css/components.css:150-306` — the `/* ---------- Top nav ---------- */`
banner through `.nav__toggle` and its closing brace. Then delete
`css/components.css:342-345` (`.nav__langs--drawer`), `347` (`.nav__toggle:hover`),
`349-383` (the `.icon-bar` rules), `386-408` (`.nav__drawer` and the
`.nav[data-open="true"]` rules), and `410-422` (the two `@media` blocks that
toggle `.nav__links`, `.nav__socials`, `.nav__langs`, `.nav__toggle` and
`.nav__drawer`).

**Leave `308-340` alone for now.** `.nav__langs`, `.nav__lang` and
`.nav__lang-divider` sit inside that range and they are the rules the footer
switcher inherits. Step 3 renames them in place.

Also delete the two nav-scoped colour overrides:

```css
.nav .social { color: var(--color-nav-fg); }
.nav .social:not([aria-disabled="true"]):hover { color: var(--color-nav-fg-hover); }
```

Leaving them would be worse than dead: `.nav .social` has no matching element
now, but it is also the only thing setting the icons' colour, and removing it
silently brightens them to `.social`'s own `--color-text-strong` default.

- [ ] **Step 3: Rename the language rules in place**

Three rules, from `.nav__lang*` to `.langs*`. The bodies change in two places
each, both because the nav-only colours are gone. Replace `308-340` with:

```css
/* Language switcher. It lives in the footer because this page has no nav.
   It stays because it is the only route to the Swedish strings — main.js does
   no locale detection on purpose, so this is not a convenience, it is the
   switch. */
.langs {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 0.75rem;
}

.langs__btn {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: normal;
  text-transform: uppercase;
  color: var(--color-text-strong);
  padding: 4px 6px;
  background: none;
  border: 0;
  cursor: pointer;
  transition: color var(--duration-base) var(--ease-out);
}

.langs__btn:hover {
  color: var(--color-accent);
}

.langs__btn[aria-pressed="true"] {
  color: var(--color-accent);
}

.langs__divider {
  color: var(--color-text-subtle);
  font-size: 14px;
  user-select: none;
}
```

Three changes from the originals: `--color-nav-fg` → `--color-text-strong`,
hover moves from `--color-nav-fg-hover` to `--color-accent` to match `.social`,
and `margin-top: 0.75rem` opens the gap to the socials row above — `base.css:66`
sets `p { margin: 0 }`, so the rows need their own.

- [ ] **Step 4: Delete the TF Classic comment block and its rule**

Delete `css/components.css:803-846`: the `TF Classic` banner comment and
`.nav__era` with its `:focus-visible` and `@media (max-width: 599px)` rules. The
comment explains where the `TF 1996` chip sat in the nav and why it survived
narrow screens; with the button gone from Task 3, all of it describes markup
that no longer exists. The build itself is untouched — this deletes a link
style, not a directory.

- [ ] **Step 5: Space the copyright below the switcher**

At `.site-footer__copyright` in `css/components.css`, add `margin-top` so the
legal line is not flush against the `EN / SV` pair:

```css
.site-footer__copyright {
  margin-top: 0.35rem;
  font-family: var(--font-display);
  font-size: var(--fs-caption);
  color: var(--color-text-subtle);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
```

- [ ] **Step 6: Verify the rules landed, the braces balanced, and the count fell**

```sh
grep -c 'nav__\|icon-bar' css/components.css
grep -n 'langs\b\|langs__btn\|langs__divider' css/components.css
node -e '
const c = require("fs").readFileSync("css/components.css","utf8");
let d = 0, b = 0;
for (const ch of c) { if (ch === "{") d++; else if (ch === "}") { d--; if (d < 0) b++; } }
console.log("brace depth at EOF:", d, "| stray closers:", b);
process.exit(d === 0 && b === 0 ? 0 : 1);
'
echo "exit=$?"
node tools/check-css.js 2>&1 | grep -E 'DEAD|TOKEN|HUE|problem'
```

Expected: `0` nav references. Then the `.langs` rules present, `langs__btn`
twice more than `.langs` once (the container plus both buttons). `brace depth at
EOF: 0 | stray closers: 0`, `exit=0`. Then `DEAD 86`, `TOKEN 0`, `HUE 0`,
`86 problem(s)`.

The brace check is the one that matters most here. Deleting half a rule in a
846-line file takes the footer with it, and nothing else in the repo parses CSS.

- [ ] **Step 7: Commit**

```sh
git add css/components.css
git commit -m "$(cat <<'EOF'
Delete the nav CSS and move the switcher rules to the footer

Nineteen class rules, all of it unreachable from index.html — the only page
that loads this file. Ten were already dead before this change; the other
nine died with the nav markup.

The three language rules are kept rather than deleted, renamed off the nav
namespace to .langs / .langs__btn / .langs__divider. Two colours change
because the tokens they used are nav-only: --color-nav-fg becomes
--color-text-strong and hover moves to --color-accent, matching .social.

1996/ is untouched. What goes here is a link style for a button that is no
longer in the markup, not a directory.
EOF
)"
```

---

### Task 5: Delete the pre-split blocks from components.css

Twenty-nine dead rules. `.socials-row` is in this file and is now *live*, so it
is on the keep list. DEAD falls 86 → 57.

**Files:**
- Modify: `css/components.css` — six contiguous blocks

- [ ] **Step 1: Confirm what is in each block before cutting**

```sh
cd /Users/johnnyvigersten/repos/true-friends-landing
grep -n '^\.btn--outline\|^\.field\|^\.form\|^\.gallery\|^\.lightbox\|^\.back-to-top\|^\.modal\|^\.address-row\|^\.services__note\|^\.socials-row\|^\.social \|^\.site-footer\|^\.email-row' css/components.css | head -40
```

Expected: the `btn--outline` pair, the seven `field`/`form` rules, `gallery`,
nine `lightbox*` rules, the four `back-to-top` rules, the eleven `modal*` rules,
the three `address-row` rules, and `services__note` — plus the survivors
`.social`, `.socials-row`, `.site-footer`, `.site-footer__copyright` and
`.email-row`, which stay.

- [ ] **Step 2: Delete the button and form blocks**

Delete `.btn--outline` and `.btn--outline:hover` (with their comment), and the
whole run from `.field` through `.form__status[data-state="error"]`. That is the
field wrapper, `.field__textarea` and its five state rules, `.form`, `.form__row`,
and the four `.form__status` rules. `.form__actions` goes too — it is inside
the modal block, in Step 4.

`.btn` and `.btn__external` stay: they are the two hero CTAs.

- [ ] **Step 3: Delete `services__note`**

One rule plus its comment. It is the note beneath a services list that lives on
the studio site now.

- [ ] **Step 4: Delete the modal block**

From the `/* ---------- Modal ---------- */` banner through
`body:has(dialog[open]) { overflow: hidden; }`. That is `.modal`,
`.modal::backdrop`, `.modal__inner`, `.modal__heading`, `.modal__title`,
`.modal__desc`, `.modal__form`, `.modal__form .field__textarea`, `.form__actions`,
`.form__actions .btn`, `.modal__actions`, `.modal__actions .btn`, the
`@media (max-width: 540px)` block, and the `body:has(dialog[open])` rule.

The page has no `<dialog>` and never will now that the form is gone — which is
the same reason the CSP's `formsubmit.co` allowance is left alone for a separate
decision rather than tidied here.

- [ ] **Step 5: Delete `address-row`, `gallery` and the lightbox**

The three `address-row` rules; `.gallery` and `.gallery__item[hidden]`; and the
whole lightbox run — `.lightbox`, `::backdrop`, `__inner`, `__close`,
`__stage`, `__image`, `__caption`, `__nav`, `__thumbs`, `__thumb`, its `img`
and `:hover` and `[aria-current="true"]` rules, and the `@media (max-width:
720px)` block.

The two `url("../img/gallery/placeholder.svg")` references go with them.
`img/gallery/` stays on disk: `1996/` reaches into it through `SHARED` in
`1996/js/win95.js`.

- [ ] **Step 6: Delete `back-to-top`**

Its four rules and comment. `js/main.js:387` guards on
`document.getElementById("back-to-top")`, which was never in this markup; Task 9
deletes the script half.

- [ ] **Step 7: Verify**

```sh
for p in btn--outline '\.field' '\.form' '\.gallery' lightbox modal address-row back-to-top services__note; do
  printf '%-18s %s\n' "$p" "$(grep -c "$p" css/components.css)"
done
for p in '^\.btn ' '^\.btn__external' '^\.social ' '^\.socials-row' '^\.site-footer' '^\.email-row' '^\.langs'; do
  printf '%-18s %s\n' "$p" "$(grep -c "$p" css/components.css)"
done
node -e '
const c = require("fs").readFileSync("css/components.css","utf8");
let d = 0, b = 0;
for (const ch of c) { if (ch === "{") d++; else if (ch === "}") { d--; if (d < 0) b++; } }
console.log("brace depth:", d, "| stray:", b); process.exit(d===0&&b===0?0:1);'
node tools/check-css.js 2>&1 | grep -E 'DEAD|problem'
```

Expected: `0` for all eight deleted patterns. Then `1` for each of the seven
survivors. `brace depth: 0 | stray: 0`, `exit=0`. Then `DEAD 57`, `57 problem(s)`.

- [ ] **Step 8: Commit**

```sh
git add css/components.css
git commit -m "$(cat <<'EOF'
Delete the pre-split blocks from components.css

The contact modal, its form and fields, the gallery and its lightbox, the
back-to-top button and the services note. All of it reached pages that moved
to consulting.truefriends.se and studio.truefriends.se at the split; this
repository kept the stylesheet and not the pages.

Nothing here is a regression risk in the usual sense — the markup these
styled stopped existing months ago — but it is unreadable at 846 lines with
four hundred of them describing a site that is not this one.

Kept: .btn and .btn__external (the two hero CTAs), .social and .socials-row
(now the footer row), .site-footer, .email-row, and the .langs rules.
EOF
)"
```

---

### Task 6: Delete the dead utilities from base.css

Three rules. The smallest task after the gradient, and the one with the easiest
mistake to make, because two of the three tokens live on in other files. DEAD
falls 57 → 54.

**Files:**
- Modify: `css/base.css:89-100`, `css/base.css:114-125`

- [ ] **Step 1: Confirm what uses them before cutting**

```sh
cd /Users/johnnyvigersten/repos/true-friends-landing
for c in lede accent honeypot; do
  printf '%-10s css:%s  html:%s  js:%s\n' "$c" \
    "$(grep -c "\.$c" css/*.css | awk -F: '{s+=$2} END{print s}')" \
    "$(grep -c "\b$c\b" index.html)" \
    "$(grep -c "\b$c\b" js/main.js js/translations/*.js | awk -F: '{s+=$2} END{print s}')"
done
```

Expected: `lede css:1 html:1 js:0` — the one `html` hit is `.hero__lede`, a
different class, and `.lede` the utility has no user. `accent css:1 html:0
js:0`. `honeypot css:1 html:0 js:0`. Every count of 1 in the `css` column is the
rule itself.

The `.honeypot` rule is worth a second look before deleting: it is the bot trap
for the contact form, and `js/main.js:508` reads `raw._honey`. Both go — the
form code in Task 9 and the rule here — and a landing page with no form has
nothing to trap.

- [ ] **Step 2: Delete `.lede` and `.accent`**

Remove both rules and the `/* Typography utilities */` banner above them.
`.sr-only` sits between `.accent` and `.honeypot` and stays — the hero's
`<span class="sr-only">True Friends</span>` and the skip link both use it.

- [ ] **Step 3: Delete `.honeypot` and its comment**

Remove the rule at `114-125` and the two-line comment above it.

- [ ] **Step 4: Verify**

```sh
grep -c '\.lede\b\|\.accent\b\|\.honeypot' css/base.css
grep -c '\.sr-only' css/base.css
grep -c 'html\[data-tf-translating\]' css/base.css
node tools/check-css.js 2>&1 | grep -E 'DEAD|problem'
```

Expected: `0`, then `1` for `.sr-only` and `1` for the lang-boot veil — both
load-bearing. Then `DEAD 54`, `54 problem(s)`.

- [ ] **Step 5: Commit**

```sh
git add css/base.css
git commit -m "$(cat <<'EOF'
Delete three dead utilities from base.css

.lede and .accent styled a page that stopped existing, and .honeypot was the
bot trap for the contact form this landing no longer has.

Left alone: .sr-only, which the hero's site name and the skip link both use,
and the html[data-tf-translating] veil, which is what stops Swedish visitors
seeing a frame of English before lang-boot.js has run.
EOF
)"
```

---

### Task 7: Delete the dead rules from layout.css

The largest cut: 54 unique classes across the section template, the gallery
listing, the service list, the consultant cards, the contact grid, and the
hero modifiers for pages on other domains. DEAD reaches 0 — and TOKEN jumps to
14, because those rules were the only readers of 14 custom properties.

**Files:**
- Modify: `css/layout.css` — six regions

- [ ] **Step 1: Confirm the hero modifiers are for pages that are not here**

```sh
cd /Users/johnnyvigersten/repos/true-friends-landing
grep -n 'hero--consulting\|hero--studio\|hero--blog\|hero--epiroc\|hero--kopparbergs\|hero--ske-kraft\|hero--avarn\|hero--bufab\|hero--sectra' css/layout.css | head -12
ls consulting.html studio.html reference-cases/johnny-vigersten/
```

Expected: every modifier defined in `layout.css`, and `consulting.html`,
`studio.html` and six reference-case stubs on disk. Those stubs are
`meta http-equiv="refresh"` redirects to the other domains — they carry no hero,
which is why `--hero-photo-url: url("../img/studio-hero-bg.webp")` and
`consulting-hero-bg.webp` point at files this repository does not contain.
Deleting the modifiers deletes those dead paths too.

- [ ] **Step 2: Delete the hero modifiers for other domains**

Delete `layout.css:25-53`: `.hero--consulting` and the six reference-case
modifiers, with the comment above them about keeping URLs out of inline `style`
attributes — a constraint imposed by a CSP that still applies, but one nothing
here uses any more.

Keep `.hero--brand` and `.hero`. The landing has the first, and `body.landing`
overrides `--hero-photo-url` on the second.

- [ ] **Step 3: Delete `.hero__content` and `.hero--center`**

Delete `layout.css:91-97` (`.hero__content`) and `layout.css:111-119` (the
`/* Hero modifiers */` banner, `.hero--center .hero__content` and
`.hero--center .hero__cta`).

**These were already dead before this plan.** The landing's hero content element
is `.hero__brand`, not `.hero__content`, so `body.landing .hero__content { max-width: 800px }`
never applied to anything. The landing's spacing comes entirely from `--rhythm`
inside `.hero__brand` at 788. There is nothing to migrate — just delete.

Keep `.hero__cta` (99-102) and `.hero__cta--row` (104-109); both are live.

- [ ] **Step 4: Trim the three rules that mix dead and live selectors**

These are the ones to do carefully. Each rule's selector list holds both a
modifier for a page on another domain and a `body.landing` selector that is
still load-bearing, so the rule cannot simply be deleted.

**`layout.css:121-127`.** Delete lines **121 and 122 only** —
`.hero--studio .hero__scrim,` and `.hero--blog .hero__scrim,` — and leave
`body.landing .hero__scrim {` and its body intact. The result:

```css
body.landing .hero__scrim {
  background:
    radial-gradient(ellipse 80% 55% at 50% 48%, rgba(10, 10, 10, 0.72) 0%, rgba(10, 10, 10, 0) 75%),
    linear-gradient(180deg, rgba(10, 10, 10, 0.45) 0%, rgba(10, 10, 10, 0.2) 35%, rgba(10, 10, 10, 0.6) 100%);
}
```

**This is the scrim that darkens the hero photograph on the landing.** Deleting
the whole rule instead of the two selector prefixes takes the page's contrast
treatment with it, and nothing in this repo would notice: the photograph would
simply render brighter than the measurement in `layout.css:216-233` assumes.

**`layout.css:129-132`.** Delete the whole rule, `.hero--studio .hero__content,
body.landing .hero__content { gap: clamp(20px, 2.2vw, 32px); }`. Both halves are
dead — the landing's gap comes from `--rhythm`, not from here.

**`layout.css:240-256`.** Delete the whole thing — the "Chrome nav mirrors the
chrome boxes" comment at 240-245 *and* the rule at 246-256,
`body:has(.hero--brand) .nav, body:has(.hero--blog) .nav { … }`. It is the
frosted-glass nav treatment and there is no nav. Taking the rule and leaving the
comment is how `grep -c 'hero--blog'` comes back non-zero at Step 10.

- [ ] **Step 5: Delete the remaining hero rules for other domains**

- `134-142` — the `.hero--blog` comment and `.hero--blog { min-height: auto; … }`
- `144-152` — the comment above it and `.hero--studio .hero__photo { opacity: 1; … }`
- `154-161` — the comment above it and `.hero--blog .hero__photo { … }`
- `165-175` — the comment, `.hero__case-heading` and `.hero__case-logo`
- `177-179` — `body.landing .hero__content { max-width: 800px }`

- [ ] **Step 6: Delete the section template, gallery listing, service list, consultant cards and contact grid**

Delete everything from the `/* ---------- Section template ---------- */` banner
at `296` through `.contact__side`'s media query ending at `742`. That is the
whole run: `.section` and its scroll-margin, `.section__body`,
`.section__figure*`, `.section__list`, `.section__note`, the four
`.section__terminal*` rules and their comments, `.gallery-listing` and its four
variants, `.service-list` and the eight `.service-line*` rules, `.consultant-list`
and all sixteen `.consultant-card*` rules, and `.contact__head`, `.contact__grid`,
`.contact__side`.

`.form__row` appears in this run as well as in `components.css`; Task 5 already
removed that one, so this is the last reference.

- [ ] **Step 7: Delete `.hero__case-*` remnants and `.hero__mark--section`**

Then delete `layout.css:851-897` — the long comment above `.hero__mark--section`
and both of its rules.

**This reverses a written decision, deliberately.** The earlier spec
(`2026-10-04-landing-hero-artwork-design.md`) kept this rule because
"the consulting and studio copies of this file rely on it". That reasoning has
since been checked and does not hold: `brand/README.md` states the three
repositories must *not* be kept in step and each holds its own copy at its own
path, so nothing downstream reads this file. The owner has asked for the sweep
explicitly. The comment goes with the rule.

- [ ] **Step 8: Drop the dangling hero photo default**

At `layout.css:22`, inside the base `.hero` rule, delete:

```css
  --hero-photo-url: url("../img/studio-hero-bg.webp");
```

Neither `img/studio-hero-bg.webp` nor `img/consulting-hero-bg.webp` exists in
this repository — they went with the consulting and studio sites — and the only
rule that used this default is the landing, which overrides it at line 198.
`.hero__photo` reads `var(--hero-photo-url, none)`, so removing the declaration
leaves a hero with no photo rather than one pointing at a missing file. Both are
wrong; only one of them is visible.

Delete the blank line it leaves behind too, so the rule ends:

```css
.hero {
  position: relative;
  isolation: isolate;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem var(--container-padding);
  overflow: hidden;
  text-align: left;
}
```

- [ ] **Step 9: Trim `.hero--blog` out of the three surviving rules**

Three rules keep the landing working but still name a modifier no page here has.
Remove `.hero--blog` from each and leave `.hero--brand`:

```css
body:has(.hero--brand) {
  isolation: isolate;
}
```

```css
.hero--brand {
  isolation: auto;
}
```

And reduce the fixed-positioning block to three selectors —
`.hero--brand .hero__bg`, `.hero--brand .hero__photo`,
`.hero--brand .hero__scrim` — dropping the three `.hero--blog` entries.

Every one of these still matches: the landing has a `.hero--brand`.

**And rewrite the comment at `layout.css:258-268`**, which survives the rule
edits above and still names `.hero--blog` twice. Its first three lines become:

```css
/* Promote the hero backdrop (bg + photo + scrim) to fixed positioning, so the
   photo fills the viewport and reads as one continuous image behind the
   content. Mirroring the landing page pattern where the photo already covers
   the whole screen. Isolation on the body keeps the z-index: -1 backdrop
   rendered between body's dark background and the flow content above.
```

The rest of that comment is still true — the reasoning about `.hero` trapping
the photo in its own stacking context is why `isolation: auto` is here — so keep
it from "Isolation on `.hero` is turned off here" onward.

- [ ] **Step 10: Verify**

```sh
for p in hero--consulting hero--studio hero--blog hero--epiroc 'hero__content' hero--center 'hero__case' hero__mark--section 'section__' 'gallery-listing 'service-line 'service-list' consultant- 'contact__'; do
  printf '%-22s %s\n' "$p" "$(grep -c "$p" css/layout.css)"
done
grep -c 'hero--blog' css/layout.css
grep -c 'body.landing .hero__scrim' css/layout.css
grep -c 'studio-hero-bg\|consulting-hero-bg' css/layout.css
for p in 'hero--brand' 'hero__brand' 'hero__mark--art' 'hero__lede' 'landing-hero-bg' 'landing-email' 'body.landing'; do
  printf '%-22s %s\n' "$p" "$(grep -c "$p" css/layout.css)"
done
node -e '
const c = require("fs").readFileSync("css/layout.css","utf8");
let d = 0, b = 0;
for (const ch of c) { if (ch === "{") d++; else if (ch === "}") { d--; if (d < 0) b++; } }
console.log("brace depth:", d, "| stray:", b); process.exit(d===0&&b===0?0:1);'
node tools/check-css.js 2>&1 | grep -E 'DEAD|TOKEN|HUE|problem'
```

Expected: `0` for all thirteen deleted class patterns, and `0` for `hero--blog`.
Then `1` for `body.landing .hero__scrim` — Step 4's whole point — and `0` for
the two dangling photo paths from Step 8. Then non-zero for all seven survivors — `body.landing` in particular must still be
present, since `.hero__photo`'s opacity, the 60% mask and the fixed positioning
all live in that block. `brace depth: 0 | stray: 0`. Then `DEAD 0`, `TOKEN 16`,
`HUE 0`, `16 problem(s)`.

If `DEAD` is not 0, the remaining names are rules this task missed — read them
off the list the tool prints rather than guessing.

- [ ] **Step 11: Confirm the flame filter's source-order dependency survived**

`.hero__mark img` and `.hero__mark--art img` are both specificity (0,1,1), so
only their order decides that the landing's artwork escapes the flame-red drop
shadow. Deleting `.hero__mark--section` between them must not have changed it.

```sh
awk '/^\.hero__mark img/{a=NR} /^\.hero__mark--art img/{b=NR} END{print "mark img:",a,"| art img:",b; exit !(b>a)}' css/layout.css
echo "exit=$?"
```

Expected: `mark img:` at a lower line number than `art img:`, `exit=0`.

- [ ] **Step 12: Commit**

```sh
git add css/layout.css
git commit -m "$(cat <<'EOF'
Delete the dead rules from layout.css

The section template, the gallery listing, the service list, the consultant
cards, the contact grid, and the hero modifiers for the six reference cases
plus consulting and studio. All of it styled pages that are meta-refresh
stubs to other domains now.

Two of these were dead before this change and worth naming. The four
.hero__content rules included body.landing .hero__content { max-width:
800px }, which never applied to anything: the landing's hero content element
is .hero__brand, and its spacing comes from --rhythm. And the hero modifiers
pointed --hero-photo-url at studio-hero-bg.webp and consulting-hero-bg.webp,
files this repository does not contain.

This also retires .hero__mark--section, which the previous plan kept on the
theory that the consulting and studio copies rely on it. brand/README.md says
the three repositories must not be kept in step and each holds its own copy,
so nothing downstream reads this file.

Frosted glass leaves with it: the nav and the section chrome boxes were the
only users of --blur-glass, --color-glass-tint and --color-glass-highlight.
EOF
)"
```

---

### Task 8: Prune the tokens nothing reads

The checker's TOKEN count is 16 because Task 7 deleted the last reader of each.
This is the task that takes the sweep to zero problems.

**Files:**
- Modify: `css/tokens.css` — 16 declarations and their comments

- [ ] **Step 1: Read the list rather than trusting the plan**

```sh
cd /Users/johnnyvigersten/repos/true-friends-landing
node tools/check-css.js 2>&1 | sed -n '/^TOKEN/,/^$/p'
```

Expected, exactly sixteen names:

```
--blur-glass
--color-border
--color-border-input
--color-border-strong
--color-border-subtle
--color-glass-highlight
--color-glass-tint
--color-nav-fg
--color-nav-fg-hover
--color-surface
--color-surface-hover
--color-text-muted
--fs-small
--nav-height
--section-gap
--z-nav
```

**`--color-border` and `--color-text-muted` are the two this plan originally
got wrong**, and they are worth pausing on. Both are exactly the tokens that look
obviously still in use — the border colour, the muted text — and both turn out
to have no reader at all once the pre-split blocks go. `--color-border` had six
readers and all six were deleted rules; `--color-text-muted` had eight, likewise.

If the tool prints seventeen names, or a name not on this list, **trust the tool
and stop.** It means something other than Task 7 removed a reader.

- [ ] **Step 2: Trace each one to its last reader, now deleted**

```sh
for t in --blur-glass --color-border --color-border-input --color-border-strong \
         --color-border-subtle --color-glass-highlight --color-glass-tint \
         --color-nav-fg --color-nav-fg-hover --color-surface --color-surface-hover \
         --color-text-muted --fs-small --nav-height --section-gap --z-nav; do
  printf '%-24s %s
' "$t" "$(grep -c "var($t)" css/*.css | awk -F: '{s+=$2} END{print s}')"
done
```

Expected: `0` for all sixteen. Anything non-zero means a reader survived that
this plan did not account for — find it with `grep -n "var($t)" css/`, then
decide whether the rule or the token is wrong. Do not delete a token with a
live reader: the declaration would drop silently, to nothing.

- [ ] **Step 3: Delete them**

Remove these sixteen declarations from `:root`, each with the comment block
above it:

| Token | Declared at | Comment above it |
|---|---|---|
| `--color-surface` | 10 | none |
| `--color-surface-hover` | 11 | none |
| `--color-border-subtle` | 13 | none |
| `--color-border` | 14 | none |
| `--color-border-strong` | 15 | none |
| `--color-border-input` | 16 | none |
| `--color-nav-fg` | 24 | none |
| `--color-nav-fg-hover` | 25 | none |
| `--color-glass-tint` | 40 | the four-line "Frosted-glass surface" comment |
| `--color-glass-highlight` | 41 | — same comment, it covers both |
| `--blur-glass` | 44 | the two-line "Backdrop filter" comment |
| `--fs-small` | 73 | none |
| `--section-gap` | 88 | none |
| `--nav-height` | 89 | none |
| `--z-nav` | 99 | none |

Line numbers are the pre-deletion positions in `css/tokens.css`; they shift as
you delete. Match on the token name, not the number.

Lines 13 to 16 are four consecutive declarations and the middle one,
`--color-border`, is on the list. `--color-border-subtle`, `--color-border` and
`--color-border-strong` are easy to take together by accident. `--color-border`
goes; `--color-text`, `--color-text-strong` and `--color-text-muted` are three
more in a row and `--color-text-muted` alone goes, leaving the other two.

- [ ] **Step 4: Verify, and confirm the four survivors still have readers**

```sh
node tools/check-css.js; echo "exit=$?"
for t in --color-flame --color-accent-pressed --lh-snug --tracking-label; do
  printf '%-24s %s\n' "$t" "$(grep -c "var($t)" css/*.css | awk -F: '{s+=$2} END{print s}')"
done
grep -c 'prefers-reduced-motion' css/tokens.css
```

Expected: `DEAD 0`, `TOKEN 0`, `HUE 0`, `WARN 1`, `0 problem(s)`, `exit=0`. Then
a non-zero count for each of the four survivors. Then `1` — the
`prefers-reduced-motion` block re-declares `--duration-fast` and
`--duration-base`, and it must stay.

**This is the first commit in the plan at which `check-css.js` passes.** If it
does not, the sweep is not finished. Do not commit a red run and move on.

- [ ] **Step 5: Confirm no rule references a variable that no longer exists**

A typo in a token name is invisible to every tool here: the rule silently falls
back to nothing.

```sh
node -e '
const fs = require("fs");
const files = ["base", "components", "layout"].map(f => [f, fs.readFileSync("css/"+f+".css","utf8")]);
const declared = new Set([...fs.readFileSync("css/tokens.css","utf8").matchAll(/^\s*(--[\w-]+)\s*:/gm)].map(m=>m[1]));
let bad = 0;
for (const [name, src] of files) {
  const stripped = src.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of stripped.matchAll(/var\((--[\w-]+)/g)) {
    if (!declared.has(m[1])) { console.log("UNDEFINED " + name + ": " + m[1]); bad++; }
  }
}
console.log(bad ? bad + " undefined variable(s)" : "every var() resolves to a declared token");
process.exit(bad ? 1 : 0);'
echo "exit=$?"
```

Expected: `every var() resolves to a declared token`, `exit=0`.

- [ ] **Step 6: Commit**

```sh
git add css/tokens.css
git commit -m "$(cat <<'EOF'
Prune the fourteen tokens the sweep left with no reader

Every one was read only by rules deleted in the previous three commits. Each
was traced to its last reader before removal rather than pattern-matched, and
four that look like casualties were kept because a surviving rule still reads
them: --color-flame by .hero__mark img, --color-accent-pressed by .btn:active,
--lh-snug by the heading rule in base.css, --tracking-label by .btn.

--blur-glass, --color-glass-tint and --color-glass-highlight take the
frosted-glass treatment off the site entirely. The nav and the section
chrome boxes were their only users.

  node tools/check-css.js    # 16 problem(s) -> 0
EOF
)"
```

---

### Task 9: Delete the inert JavaScript

Every module here has been dead since the split. Each is already guarded —
`querySelectorAll` for the accordion and the forms, `if (element)` for the rest —
which is why the page works today and why deleting them changes no behaviour.

**Files:**
- Modify: `js/main.js` — 6 module blocks plus `t()`

- [ ] **Step 1: Confirm each module is already inert**

```sh
cd /Users/johnnyvigersten/repos/true-friends-landing
for sel in 'site-nav' 'service-item' '\.gallery' 'back-to-top' 'data-modal-open' 'form\[data-endpoint\]'; do
  printf '%-24s js:%s  html:%s\n' "$sel" \
    "$(grep -c "$sel" js/main.js)" \
    "$(grep -c "$sel" index.html)"
done
```

Expected: every `html:` count is `0`. That is the whole argument — there is no
markup for any of these to bind to.

- [ ] **Step 2: Delete the mobile nav block**

From the `/* Mobile nav */` banner through the closing `}` of its `if`. It reads
`document.getElementById("site-nav")` and `.nav__toggle`, both of which Task 3
removed. `nav.querySelectorAll(".nav__drawer a")` goes with it.

- [ ] **Step 3: Delete the service accordion**

From the `/* Service accordion */` banner through its closing `}`. It binds to
`.service-item`, a class that has no rule in any stylesheet — it died with the
consulting and studio service lists.

- [ ] **Step 4: Delete the gallery and lightbox**

The whole block including the 42-entry `GALLERY_IMAGES` array. It is guarded by
`if (gallery && lightbox)` and neither element exists.

**On `GALLERY_IMAGES` and the README.** `README.md` says to keep this array in
step with the studio site's copy. That instruction is about the *studio*
repository's `js/main.js`; this one has been inert since the split, and
`img/gallery/` stays on disk regardless because `1996/` borrows it through
`SHARED`. Deleting the array here loses nothing that is still true.

- [ ] **Step 5: Delete the back-to-top, modal and forms blocks**

Three contiguous runs: from the `/* Back-to-top button */` banner to the end of
that block; the whole `/* Modal */` block; and the whole `/* Forms */` block
from its banner through the final `});` and the closing `})();` of the IIFE.

The forms block takes `MAX_LENGTHS`, `sanitizeSingleLine`, `sanitizeMultiline`,
`sanitizePayload`, `RATE_LIMIT_MS` and every `status.*` string lookup with it.

- [ ] **Step 6: Delete `t()`, which loses its last caller**

`t()` at `js/main.js:32-43` existed to look up the form status strings. With the
forms gone nothing calls it. `getNested` and `substitute` **stay** —
`applyTranslations` uses both.

- [ ] **Step 7: Verify the file is still valid and still translates**

```sh
node --check js/main.js && echo "syntax ok"
grep -c 'GALLERY_IMAGES\|sanitizePayload\|RATE_LIMIT_MS\|site-nav\|service-item\|back-to-top\|data-modal-open' js/main.js
grep -c 'applyTranslations\|getNested\|substitute\|data-lang\|pageshow\|TF_TRANSLATIONS' js/main.js
node -e '
const s = require("fs").readFileSync("js/main.js","utf8");
let d = 0, b = 0;
for (const ch of s) { if (ch === "{") d++; else if (ch === "}") { d--; if (d < 0) b++; } }
console.log("brace depth:", d, "| stray:", b); process.exit(d===0&&b===0?0:1);'
node tools/check-css.js >/dev/null 2>&1; echo "check-css exit=$?"
```

Expected: `syntax ok`. Then `0` for the dead identifiers and a non-zero count
for the survivors — `applyTranslations`, `getNested`, `substitute`, `data-lang`
and `pageshow` are the i18n machinery that has to keep working, and their
absence means Task 5 went too far. `brace depth: 0 | stray: 0`. And
`check-css exit=0`.

- [ ] **Step 8: Verify translation still works end to end**

`js/lang-boot.js` is untouched by this plan, and it is what makes a Swedish
visitor's *first paint* correct. Confirm the pair still agrees:

```sh
grep -c 'MARKUP_LANG = "en"' js/lang-boot.js
grep -c 'data-tf-translating' js/lang-boot.js js/main.js css/base.css
```

Expected: `1`, then `1` across all three files. `lang-boot.js` sets the
attribute, `main.js` removes it, `base.css` acts on it. A count of 2 in
`main.js` would mean a second remover, which is harmless; a 0 anywhere means the
page either flashes English at Swedish visitors or never appears.

- [ ] **Step 9: Commit**

```sh
git add js/main.js
git commit -m "$(cat <<'EOF'
Delete the six modules that stopped running at the split

Mobile nav, service accordion, gallery and lightbox, back-to-top, modal, and
the form pipeline. Every one was already inert — the accordion and the forms
bind through querySelectorAll, the rest sit behind an if — which is why
removing 400 lines changes nothing about how the page behaves.

What remains is the i18n block and nothing else, which is all index.html
uses. t() goes with the forms: its only callers were the status strings.
getNested and substitute stay, applyTranslations needs both.

GALLERY_IMAGES is the one that looks like a loss and is not. README.md asks
for it to be kept in step with the studio site's copy; that is the studio
repository's main.js. This one has been inert since the split, and
img/gallery/ stays on disk regardless because 1996/ borrows it.
EOF
)"
```

---

### Task 10: Trim the translation dictionary

Fifty-one of the fifty-nine keys go. `tools/i18n.js check` is the test that
catches a mistake here, and it resolves each page against its *own* directory's
dictionary, so trimming the root copy cannot affect `1996/`.

**Files:**
- Modify: `js/translations/common.js` — header comment and both dictionaries

- [ ] **Step 1: Confirm the eight surviving keys are the ones in the markup**

```sh
cd /Users/johnnyvigersten/repos/true-friends-landing
grep -o 'data-i18n[a-z-]*="[^"]*"' index.html | sed 's/.*="//;s/"//' | sort -u
```

Expected, eight keys:

```
aria.langSwitch
aria.newTab
aria.skip
aria.socialLinks
footer.copyright
hero.consulting
hero.studio
hero.lede
```

`hero.lede` comes from `js/translations/landing.js`, not this file. The other
seven are `common.js`'s.

- [ ] **Step 2: Replace both dictionaries with the seven surviving keys**

```js
window.TF_TRANSLATIONS = {
  en: {
    hero: {
      consulting: "Consulting",
      studio: "Studio",
    },
    footer: {
      copyright: "© {year} True Friends. All rights reserved.",
    },
    aria: {
      newTab: "(opens in a new tab)",
      skip: "Skip to content",
      socialLinks: "Social links",
      langSwitch: "Switch language",
    },
  },

  sv: {
    hero: {
      consulting: "Konsult",
      studio: "Studio",
    },
    footer: {
      copyright: "© {year} True Friends. All rights reserved.",
    },
    aria: {
      newTab: "(öppnas i en ny flik)",
      skip: "Hoppa till innehåll",
      socialLinks: "Sociala kanaler",
      langSwitch: "Byt språk",
    },
  },
};
```

Every string is carried over byte-identical from the file as it stands. Check
them rather than retyping from this plan: `sv.hero.consulting` is `"Konsult"`,
not `"Konsulting"`; `footer.copyright` is identical in both languages because
the site name is; and the `{year}` placeholder must survive, since
`applyTranslations` substitutes it and the copyright rolls over on New Year's
Eve.

Note that `sv.footer.copyright` reads "All rights reserved" in English. That is
what the file says today. Translating it is a copy decision, not a cleanup one,
and it is out of scope here.

- [ ] **Step 3: Rewrite the header comment**

The existing comment describes a file that no longer exists:

> This file holds strings shared across ALL pages: nav, footer, aria, status
> messages, the contact modal, and site-wide labels. […] Each per-page file
> (landing.js, consulting.js, studio.js, epiroc.js, kopparbergs-brewery.js)
> loads AFTER this one

Only `landing.js` exists in this repository, and only four groups survive.
Replace everything above `window.TF_TRANSLATIONS = {` with:

```js
/* True Friends — common translation strings (EN + SV)
 *
 * Trimmed to what the landing page reads: the two hero button labels, the
 * footer copyright, and four aria strings. Everything else that lived here —
 * nav links, section labels, the contact form and its modal, the lightbox,
 * status messages — belonged to pages that moved to other domains at the
 * split.
 *
 * 1996/js/translations/ has its own full copy and is not affected. This file
 * has been trimmed twice now for this repository; brand/README.md records the
 * first pass under "One wrinkle".
 *
 * The language switcher is in the footer and is the only route to these
 * strings: main.js does no locale detection on purpose, so there is no
 * automatic fallback to Swedish.
 *
 * Keys are referenced from HTML via:
 *   data-i18n           → sets textContent
 *   data-i18n-aria-label  → sets aria-label attribute
 */
```

Keep the `TF_ADD_TRANSLATIONS` function and its explanatory comment exactly as
they are — `js/translations/landing.js` calls it, and it is the only reason
`hero.lede` exists.

- [ ] **Step 4: Verify — this is the check that matters most here**

```sh
node tools/i18n.js sync
node tools/i18n.js check; echo "exit=$?"
node tools/check-css.js >/dev/null 2>&1; echo "check-css exit=$?"
git diff --stat index.html
```

Expected: `clean — 20 pages`, `exit=0`. And `check-css exit=0`.

The `sync` first is not optional: it rewrites the inline fallbacks in the markup
from the English strings, and `check` then verifies them. A `MISSING` line here
means a key the markup still references was deleted, which is the exact failure
this task can cause.

- [ ] **Step 5: Confirm `sync` did not rewrite the copyright fallback into something wrong**

```sh
grep -n 'site-footer__copyright' index.html
```

Expected: the fallback still reads `&copy; True Friends 2026`.

`i18n.js` skips any fallback whose English string contains `{`, which
`footer.copyright` does — so it will not touch this line, and will not flag it
either. That is a known gap, recorded in the spec's out-of-scope list: a
visitor with JavaScript off reads a shorter line than everyone else. It is
pre-existing and not this task's to fix. Confirm the line is intact and leave
it.

- [ ] **Step 6: Confirm no deleted key is still referenced anywhere**

```sh
for k in nav.start nav.about 'aria.home' 'aria.primary' 'aria.mobileMenu' 'aria.backToTop' 'aria.lightbox' 'era.classic' 'status.error' 'contact.submit' 'modal.title' 'services.label' 'refCase.about' 'team.members' 'meta.description'; do
  n=$(grep -c "$k" index.html js/main.js 2>/dev/null | awk -F: '{s+=$2} END{print s}')
  [ "$n" != "0" ] && echo "STILL REFERENCED: $k ($n)"
done
echo "done"
```

Expected: only `done`. `meta.description` is included deliberately — the
`<meta name="description">` at `index.html:8` never carried `data-i18n-content`,
so that key was already unread before this plan and the description served is
the English-only string in the markup. Deleting the key changes nothing;
translating it is a separate call.

- [ ] **Step 7: Commit**

```sh
git add js/translations/common.js index.html
git commit -m "$(cat <<'EOF'
Trim the translation dictionary to seven keys

Fifty-one of fifty-nine keys described markup this repository no longer has:
nav links, section labels, the contact form and its modal, the lightbox
controls, status messages, the era button. All of it went with the pages that
moved to consulting.truefriends.se and studio.truefriends.se.

Every surviving string is carried over byte-identical, including sv.hero.
consulting as "Konsult" rather than "Konsulting". The {year} placeholder in
footer.copyright has to survive, or the copyright stops rolling over.

1996/js/translations/ has its own full copy. tools/i18n.js resolves each page
against its own directory's dictionary, so trimming this one cannot affect
it — which is what makes deleting keys safe here at all.
EOF
)"
```

---

### Task 11: Correct the two docs this makes untrue

Small, and the reason a later reader does not go looking for a navbar.

**Files:**
- Modify: `README.md`, `brand/README.md`

- [ ] **Step 1: Find the sentences that are now wrong**

```sh
cd /Users/johnnyvigersten/repos/true-friends-landing
grep -n 'TF Classic\|Classic' README.md
grep -n 'tf-pc-favicon\|keep those in step\|One wrinkle' brand/README.md
```

Expected: `README.md` describes the site as "One page pointing at the two
businesses, plus TF Classic and the redirect stubs", and `brand/README.md`
lists `img/tf-pc-favicon.svg` under the files to keep in step.

- [ ] **Step 2: Correct `README.md`**

The TF Classic sentence becomes:

```markdown
The brand umbrella. One page pointing at the two businesses, plus TF Classic and
the redirect stubs for every URL that existed before the split. TF Classic is not
linked from the landing page — the nav button across to it was removed while its
future is undecided — but it is still here and still reachable by URL.
```

- [ ] **Step 3: Record the favicon divergence in `brand/README.md`**

The file already has a "One wrinkle" section for exactly this: a brand-layer file
that is not identical across the three repositories. Append to it rather than
opening a new section:

```markdown
The landing's favicon is a second divergence. It uses `img/favicon.png` where
the other two still use `img/tf-pc-favicon.svg`. The PNG is the current brand
artwork; the SVG is kept because TF Classic renders it as a 16px taskbar icon,
which is not what that file is for. If consulting or studio move to the PNG,
delete `img/tf-pc-favicon.svg` from the list above — but not before
`1996/` stops referencing it in ten files.
```

That last sentence is load-bearing. `img/tf-pc-favicon.svg` is referenced by
`1996/index.html`, `1996/studio.html`, `1996/consulting.html`,
`1996/reference-cases/template.html` and six reference-case pages. Do not
delete it.

- [ ] **Step 4: Verify, and confirm the assets the docs promise still exist**

```sh
grep -c 'not.*linked from the landing' README.md
grep -c 'img/favicon.png' brand/README.md
ls img/tf-pc-favicon.svg img/tf-pc-logo-transparent.svg img/tf-pc-logo-yellow-transparent.svg img/tf-archivo-yellow-transparent.svg img/favicon.png
node tools/check-links.js . | tail -2
```

Expected: `1`, `1`, all five files listed, and `0 broken`.

- [ ] **Step 5: Add the new tool to README.md's "Checking your work"**

`README.md` lists the commands to run before committing. `check-css.js` belongs
there, and this is the only place it gets scheduled — a tool nobody is told to
run is a tool that quietly stops matching the site.

Append this line to the existing fenced shell block in that section:

    node tools/check-css.js

Then, as a new paragraph beneath the block:

> `check-css.js` is the one that knows whether the stylesheets still describe
> this page: it fails on a class rule `index.html` never uses and on a custom
> property nothing reads. It is the only check that would have noticed the
> sweep deleting one rule too many.

- [ ] **Step 6: Commit**

```sh
git add README.md brand/README.md
git commit -m "$(cat <<'EOF'
Correct the two docs the chrome change made untrue

README.md described the landing as pointing at TF Classic. It no longer does —
the nav button came off while its future is undecided — but the build is still
here and still reachable by URL, which is the part worth writing down.

brand/README.md lists the favicon among the files to keep in step across the
three repositories. The landing now uses img/favicon.png, so it joins
common.js's trim in the "One wrinkle" section that already exists for exactly
this kind of divergence.

Also adds check-css.js to README.md's "Checking your work", which lists every
other tool in the repo. It was the one piece of this change with no scheduled
step, and a checker nobody is told to run is a checker that quietly stops
matching the site.

Noted there: img/tf-pc-favicon.svg is referenced in ten files under 1996/
and cannot be deleted when the other two sites move to the PNG.
EOF
)"
```

---

### Task 12: Verify the whole change

**Files:**
- Verify only. No edits unless a check fails.

- [ ] **Step 1: Run the four check tools**

```sh
cd /Users/johnnyvigersten/repos/true-friends-landing
./tools/check-stubs.sh >/dev/null && echo "check-stubs: clean"
node tools/check-css.js | tail -2
node tools/check-links.js . | tail -2
node tools/i18n.js check | tail -2
```

Expected: `check-stubs: clean`; `0 problem(s)`; `0 broken` across roughly 981
references; `clean — 20 pages`.

On the reference count: the baseline was 985 and this change removes four —
`href="#top"`, `href="1996/index.html"`, and the nav brand's two logo `href`s.
The favicon is one-for-one. If the number has moved for any other reason, a
reference was added or lost by accident.

- [ ] **Step 2: Ask the server directly — the blind spot no tool covers**

`check-links.js` reads `href`/`src` in HTML and paths in `js/translations/`. It
cannot see a CSS `url()`, so the favicon path and `--hero-photo-url` are both
invisible to it.

```sh
python3 -m http.server 8803 >/dev/null 2>&1 &
sleep 1.5
for u in / /css/tokens.css /css/base.css /css/components.css /css/layout.css \
         /js/main.js /js/lang-boot.js /js/translations/common.js \
         /js/translations/landing.js \
         /img/favicon.png /img/landing-hero-bg.webp /img/tf-smiley-chrome-transparent.webp \
         /img/tf-pc-favicon.svg /img/tf-pc-logo-transparent.svg \
         /img/tf-pc-logo-yellow-transparent.svg; do
  printf '%-46s %s\n' "$u" "$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:8803$u")"
done
```

Expected: `200` on all fifteen. `img/tf-pc-favicon.svg` is still fetched by
`1996/`, so it must remain — a `404` there is a real break, even though nothing
on the landing requests it any more.

- [ ] **Step 3: Confirm the served page has no nav and the right footer order**

```sh
curl -s http://localhost:8803/ | grep -c 'class="nav\|nav__'
curl -s http://localhost:8803/ | grep -c 'tf-pc-favicon'
curl -s http://localhost:8803/ | grep -o 'href="img/favicon.png"'
curl -s http://localhost:8803/ | grep -o 'socials-row\|class="langs"\|site-footer__copyright'
```

Expected: `0`, `0`, one `href="img/favicon.png"`, and the three footer hooks in
the order `socials-row`, `class="langs"`, `site-footer__copyright`.

- [ ] **Step 4: Confirm no colour is left in the gradient, from the browser's own answer**

```sh
curl -s http://localhost:8803/css/tokens.css | sed -n '/--gradient-hero/,/;/p'
```

Expected: three layers, all achromatic — `rgba(255, 255, 255, 0.07)`,
`rgba(255, 255, 255, 0.04)`, and `#0a0a0a` / `#141414` / `#0a0a0a`. If any hex
or rgb with three unequal channels appears, a rule was missed.

- [ ] **Step 5: Manual check — four viewports, with a browser**

No headless browser runs in this environment, so this step needs a human. Open
`http://localhost:8803/` at each size:

| Viewport | What to look for |
|---|---|
| 1440×900 | Hero centred, buttons side by side, the four footer rows centred in one stack: email, socials, EN/SV, copyright |
| 1024×768 | Same, tighter. The gap between socials and EN/SV should read as deliberate, not as a mistake |
| 390×844 | **The socials must be visible.** They were `display: none` below 900px inside the nav and this page had no drawer, so on a phone they were not rendered anywhere at all |
| 360×640 | Same. Nothing clipped, no horizontal scrollbar |

In the same pass:

- Devtools console: no 404, no CSP violation. The favicon href and
  `--hero-photo-url` are the two places a violation would surface.
- Nothing on the page is tinted. The chrome texture is greyscale and the
  gradient behind it now is too, so any colour is a missed rule.
- **Tab from the very top: the skip link must be the first stop.** With the
  nav's links gone it is the first focusable element on the page, and
  `href="#main"` has to still resolve.
- Click `SV`, then reload. The lede and both buttons translate, the copyright
  still shows the current year, and `localStorage.tf_lang` is `sv`. Click `EN`,
  reload, confirm it comes back.
- The three socials are visibly inert — dimmed, `cursor: not-allowed` — because
  they are placeholders with no real profile URL behind them.

- [ ] **Step 6: Confirm the repo is in the intended state**

```sh
pkill -f "http.server 8803"
git status --short
git log --oneline -12
```

Expected: a clean tree. Eleven commits — checker, gradient, markup, nav CSS,
components pre-split, base.css, layout.css, tokens, JS, translations, docs.

- [ ] **Step 7: Confirm nothing outside the landing was touched**

The one thing this plan could plausibly have broken without a tool noticing.

```sh
git diff --stat main...HEAD -- 1996/ | tail -3
git diff --stat main...HEAD -- consulting.html studio.html reference-cases/ | tail -3
echo "--- 1996 still references the shared brand assets ---"
grep -rc 'tf-pc-favicon\|tf-pc-logo-transparent\|tf-archivo-yellow' 1996/ --include="*.html" | grep -v ':0' | wc -l
```

Expected: both `git diff --stat` outputs empty, and `11` files under `1996/`
still referencing the shared brand assets. Anything else means the sweep reached
into the TF Classic build.

---

## Rollback

Eleven commits, each independent. To get back to the navbar:

```sh
git revert --no-edit HEAD~10..HEAD
```

`img/tf-pc-favicon.svg` is never deleted by this plan, so reverting restores the
favicon without needing a checkout. `img/favicon.png` was untracked before Task 3
and is committed there, so it survives a revert either way.
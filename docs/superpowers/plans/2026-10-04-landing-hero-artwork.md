# Landing Hero Swap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the landing hero's monogram-over-wordmark lockup with `Smiley-world-chrome.png`, and put the liquid-marbling paint texture behind the page as its background.

**Architecture:** The page already has a working three-layer hero backdrop (`.hero__bg` gradient, `.hero__photo` texture at `opacity: .5` behind a radial scrim, `.hero__scrim`), positioned `fixed` so it covers the viewport under the frosted nav. That pipeline is kept and only its `--hero-photo-url` custom property is retargeted. The artwork becomes a single `<img>` inside the existing `<h1 class="hero__mark">`, sized by a new landing-scoped `.hero__mark--art` modifier that states its own width cap and clears the flame filter `.hero__mark img` puts on every hero mark.

**Tech Stack:** Hand-written static HTML and CSS. No build step, no package manager, no framework. `cwebp` for asset conversion, `ffmpeg` for pixel sampling, `node` for the two check tools in `tools/`.

**Spec:** `docs/superpowers/specs/2026-10-04-landing-hero-artwork-design.md`

---

## Constraints this plan runs under

Read these before starting. They are not stylistic notes; they change what
"verified" means here.

**There is no automated CSS regression test, and this plan does not build one.**
The repo has no `package.json`, no test runner and no DOM. `tools/check-links.js`
scans `href`/`src` in HTML only. Every "does this rule exist" assertion below is
therefore a `grep -c` with an expected count — that is the whole harness. The
value is that it fails loudly when an edit is missed, not that it proves the page
looks right.

**The link checker cannot see the marble.** Its path lives in a `url()` inside a
custom property in `css/layout.css`. `tools/check-links.js` will happily pass with
a typo in it. Task 6 closes that gap with a direct HTTP request per asset, which
is the only automated check that reaches a CSS-only reference.

**Screenshots cannot be automated in this environment.** Firefox is present at
`/Applications/Firefox.app` but the sandbox blocks it (`xattr: Operation not
permitted` on the app bundle), and no Chrome or Playwright is present. The four
viewport checks in Task 6 are a manual checklist for a human with a browser.
Everything else in Task 6 is automated.

**The flame filter depends on source order.** `.hero__mark img` and
`.hero__mark--art img` are both specificity (0,1,1). Nothing but their order in
the file decides which wins. Task 5 puts the new rule after the old one and says
so in a comment; do not move it.

**`img/tf-archivo-yellow-transparent.svg` must survive.** It looks like a dead
hero asset once the lockup goes, but eleven files under `1996/` reference it.
Nothing in this plan deletes it. If a find-and-replace reaches for "archivo",
stop.

**Do not create a worktree.** This change edits `css/layout.css`, a file
`brand/README.md` describes as copied into three repositories. Task 6 resolves
real relative paths from the repo root and has to agree with `tools/check-links.js`
about what exists. Work in place.

---

## File map

| File | Action | Responsibility after this change |
|---|---|---|
| `img/tf-smiley-chrome-transparent.webp` | create | Hero artwork, 1200×553, alpha, 80 KB |
| `img/landing-hero-bg.webp` | create | Page background texture, 2560×1281, 100 KB |
| `img/landing-page-hero.webp` | delete | Was the sunset hero photo; unreferenced after Task 4 |
| `Smiley-world-chrome.png` | delete | Source, folded into the webp |
| `liquid-marbling-...wallpaper(1).jpg` | delete | Source, folded into the webp |
| `index.html` | modify | The `<h1>` markup, plus a preload for the marble |
| `css/layout.css` | modify | `--hero-photo-url`, the art modifier, the short-window cap, six comment blocks |
| `tools/contrast.js` | create | Re-measures text contrast against a background image |

Nothing else changes. `css/tokens.css`, `css/base.css`, `css/components.css`,
`js/`, and everything under `1996/` are untouched.

---

### Task 1: Build the two webp assets and retire the old hero photo

The only task where the deliverable is a binary. Everything after it depends on
these two paths existing.

**Files:**
- Create: `img/tf-smiley-chrome-transparent.webp`
- Create: `img/landing-hero-bg.webp`
- Delete: `img/landing-page-hero.webp`, `Smiley-world-chrome.png`, `liquid-marbling-paint-texture-background-fluid-painting-abstract-texture-intensive-color-mix-wallpaper(1).jpg`

- [ ] **Step 1: Record the starting state**

```sh
cd /Users/johnnyvigersten/repos/true-friends-landing
ls -la img/landing-page-hero.webp "Smiley-world-chrome.png" "liquid-marbling-paint-texture-background-fluid-painting-abstract-texture-intensive-color-mix-wallpaper(1).jpg"
ls img/tf-smiley-chrome-transparent.webp img/landing-hero-bg.webp 2>&1 | tail -2
```

Expected: the three source files exist with sizes 68K, 3.1M and 7.1M. Both
`ls` calls for the new paths print `No such file or directory`.

- [ ] **Step 2: Crop the smiley to its inked bounding box**

The source canvas is 3840×2160 but the artwork occupies only 3090×1422 — 47% of
the canvas is empty. Cropping first is what makes the CSS `max-width` mean what
it says. `sips --cropOffset` takes **top then left**.

```sh
sips -c 1422 3090 --cropOffset 369 375 "Smiley-world-chrome.png" --out /tmp/tf-smiley-crop.png
```

Expected: `sips` prints the input and output paths. Verify the geometry:

```sh
sips -g pixelWidth -g pixelHeight /tmp/tf-smiley-crop.png
```

Expected: `pixelWidth: 3090`, `pixelHeight: 1422`.

- [ ] **Step 3: Encode the smiley to webp at 1200w, alpha intact**

```sh
cwebp -quiet -resize 1200 0 /tmp/tf-smiley-crop.png -o img/tf-smiley-chrome-transparent.webp
sips -g pixelWidth -g pixelHeight -g hasAlpha img/tf-smiley-chrome-transparent.webp
```

Expected: `1200`, `553`, `hasAlpha: yes`. The alpha matters — the file is a
sphere on transparency, and losing it puts a black box behind the hero.

- [ ] **Step 4: Encode the marble to webp at 2560w, q72**

```sh
cwebp -quiet -resize 2560 0 -q 72 \
  "liquid-marbling-paint-texture-background-fluid-painting-abstract-texture-intensive-color-mix-wallpaper(1).jpg" \
  -o img/landing-hero-bg.webp
sips -g pixelWidth -g pixelHeight -g hasAlpha img/landing-hero-bg.webp
```

Expected: `2560`, `1281`, `hasAlpha: no`.

- [ ] **Step 5: Check the weights against the budget**

```sh
du -h img/tf-smiley-chrome-transparent.webp img/landing-hero-bg.webp
```

Expected: roughly 80K and 100K, 180K together. If either lands above 200K the
encode settings are wrong — re-check the `-resize` and `-q` flags above rather
than accepting it.

- [ ] **Step 6: Delete the three superseded files**

```sh
git rm -q img/landing-page-hero.webp
rm "Smiley-world-chrome.png" "liquid-marbling-paint-texture-background-fluid-painting-abstract-texture-intensive-color-mix-wallpaper(1).jpg" /tmp/tf-smiley-crop.png
```

The two root images were never tracked, so `rm` is correct for them; the webp was
tracked, so `git rm`. Confirm:

```sh
git status --short
```

Expected: `D img/landing-page-hero.webp`, two `??` entries for the new webp
files, and nothing for the two deleted sources.

- [ ] **Step 7: Commit**

```sh
git add img/tf-smiley-chrome-transparent.webp img/landing-hero-bg.webp
git commit -m "$(cat <<'EOF'
Fold the hero's artwork and background into webp

The two source files are 10.2 MB between them. Cropped to its inked
bounding box and re-encoded, the artwork is 80 KB and the background is
100 KB — 180 KB against the 68 KB sunset photo they replace.

The crop is the part that matters beyond weight. The artwork sat in a
3840x2160 canvas using 3090x1422 of it, so a CSS max-width sized the empty
margin rather than the smiley.
EOF
)"
```

---

### Task 2: Add the contrast checker

The spec quotes specific contrast figures. This is what keeps them checkable
instead of being numbers in a document that drift the first time an image
changes.

**Files:**
- Create: `tools/contrast.js`

- [ ] **Step 1: Write the script**

Create `tools/contrast.js`:

```js
#!/usr/bin/env node
/* Measures text contrast against a background image.
 *
 *   node tools/contrast.js <image> [opacity-over-#0a0a0a]
 *
 * A texture can look dark in a thumbnail and be nothing of the sort: this
 * samples the whole file rather than trusting the dominant colour, and
 * reports the WORST pixel as well as the failure rate. The worst pixel is
 * the number that decides whether text is safe, because one bright vein
 * under a line of copy is one unreadable line.
 *
 * Sampling is done by ffmpeg at 128x64. The file only needs to be
 * representative, not exhaustive — it is read for its distribution, not
 * measured to a standard.
 */
const { execFileSync } = require('child_process');

const lum = (r, g, b) => {
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const cr = (l1, l2) => { const hi = Math.max(l1, l2), lo = Math.min(l1, l2); return (hi + 0.05) / (lo + 0.05); };

const file = process.argv[2];
if (!file) { console.error('usage: node tools/contrast.js <image> [opacity-over-ink]'); process.exit(1); }
const alpha = process.argv[3] === undefined ? 1 : Number(process.argv[3]);
if (!(alpha >= 0 && alpha <= 1)) { console.error('opacity must be 0..1'); process.exit(1); }

const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-vf', 'scale=128:64',
  '-pix_fmt', 'rgb24', '-f', 'rawvideo', '-'], { maxBuffer: 1 << 28 });

const n = raw.length / 3;
const INK = [10, 10, 10];                       // --color-bg
const CREAM = lum(0xfa, 0xf9, 0xf5);            // --color-cream, the lede
const YELLOW = lum(0xfe, 0xe4, 0x40);           // --color-accent

let worstCream = Infinity, worstYellow = Infinity, failCream = 0, failYellow = 0;
for (let i = 0; i < raw.length; i += 3) {
  // Composite onto ink at the given opacity: what the page actually paints
  // beneath its scrim. Scrim and gradient layers only darken, so this is a
  // floor for the finished result, never an overstatement of it.
  const c = [
    alpha * raw[i] + (1 - alpha) * INK[0],
    alpha * raw[i + 1] + (1 - alpha) * INK[1],
    alpha * raw[i + 2] + (1 - alpha) * INK[2],
  ];
  const l = lum(c[0], c[1], c[2]);
  worstCream = Math.min(worstCream, cr(CREAM, l));
  worstYellow = Math.min(worstYellow, cr(YELLOW, l));
  if (cr(CREAM, l) < 4.5) failCream++;
  if (cr(YELLOW, l) < 4.5) failYellow++;
}

const pct = x => (x / n * 100).toFixed(1);
console.log(`${file.split('/').pop()} at opacity ${alpha} over ink`);
console.log(`  worst cream  ${worstCream.toFixed(2)}:1   worst yellow ${worstYellow.toFixed(2)}:1`);
console.log(`  under 4.5:1  cream ${pct(failCream)}%   yellow ${pct(failYellow)}%`);

process.exit(failCream ? 1 : 0);
```

Exits non-zero when cream drops below 4.5:1 anywhere, so it can gate a build if
this repo ever grows one.

- [ ] **Step 2: Run it against the new background and watch it fail**

```sh
chmod +x tools/contrast.js
node tools/contrast.js img/landing-hero-bg.webp
```

Expected: exit code 1, with roughly 24% of pixels under 4.5:1 for cream and a
worst-case ratio near 1.3:1. **This failure is the point** — it is the
measurement that rules out using the texture raw.

- [ ] **Step 3: Run it at the opacity the page uses**

```sh
node tools/contrast.js img/landing-hero-bg.webp 0.5
```

Expected: exit code 0, `0.0%` cream, worst cream `4.66:1`, worst yellow `3.83:1`,
about 3.2% of pixels under 4.5:1 for yellow. Those figures are what the spec
claims; if they differ materially, the encode settings in Task 1 changed the
image and the spec needs correcting before the page is built on it.

- [ ] **Step 4: Confirm the argument handling**

```sh
node tools/contrast.js 2>&1; echo "exit=$?"
node tools/contrast.js img/landing-hero-bg.webp 5 2>&1; echo "exit=$?"
```

Expected: a usage line with `exit=1`, then `opacity must be 0..1` with `exit=1`.

- [ ] **Step 5: Commit**

```sh
git add tools/contrast.js
git commit -m "$(cat <<'EOF'
Add a contrast checker for background textures

The hero background is a texture, and a texture is not a colour. Sampling
the whole file instead of trusting what dominates it is the difference
between "looks dark" and the quarter of this image that is too light to
carry body text.

Reports the worst pixel alongside the failure rate, because one bright vein
under a line of copy is one unreadable line. Exits non-zero when cream
drops below 4.5:1 anywhere, so it can gate a build if this repo grows one.

  node tools/contrast.js img/landing-hero-bg.webp 0.5
EOF
)"
```

---

### Task 3: Swap the hero markup

**Files:**
- Modify: `index.html:14-26` (preload), `index.html:81-88` (the `<h1>`)

- [ ] **Step 1: Record the markup's starting state**

```sh
cd /Users/johnnyvigersten/repos/true-friends-landing
for p in 'hero__mark--lockup' 'hero__mark-monogram' 'hero__mark--art' \
         'tf-pc-logo-transparent' 'tf-archivo-yellow' 'rel="preload"'; do
  printf '%-26s %s\n' "$p" "$(grep -c "$p" index.html)"
done
```

Expected, in order: `1`, `1`, `0`, `2`, `1`, `0`. The two logos in the hero are
what this task removes; the nav's copy of `tf-pc-logo-transparent.svg` is one of
the two hits and stays.

- [ ] **Step 2: Add the preload for the marble**

In `<head>`, after the four stylesheet links and before the `lang-boot.js`
script tag:

```html
    <link rel="stylesheet" href="css/layout.css">
    <!-- The hero background is a CSS custom property, so nothing in the markup
         points at it and the browser only finds it after parsing the CSS.
         100 KB, on the critical path. -->
    <link rel="preload" as="image" href="img/landing-hero-bg.webp">
```

The page CSP is `default-src 'self'` with no `img-src` narrowing beyond
`'self' data:`, so a same-origin preload is permitted.

- [ ] **Step 3: Replace the `<h1>` lockup**

Replace the whole `<h1>` at `index.html:81-88` — both images and the wrapper —
with:

```html
            <h1 class="hero__mark hero__mark--art">
                <!-- The name has no artwork of its own to show any more, so it
                     is carried as text. The smiley is decoration and is marked
                     as such rather than described as the site's name. -->
                <span class="sr-only">True Friends</span>
                <img src="img/tf-smiley-chrome-transparent.webp"
                     alt="" aria-hidden="true"
                     width="1200" height="553" decoding="async">
            </h1>
```

The `width`/`height` are the file's real dimensions, so the browser reserves the
right box before the image loads and the lede does not jump. `alt=""` together
with `aria-hidden="true"` matches the convention already used at
`index.html:82-84` and `:49-50`.

No `data-i18n` on the `.sr-only` span: the site name is "True Friends" in both
locales, which is why the `alt="True Friends"` it replaces was untranslated too.

- [ ] **Step 4: Verify the swap landed**

```sh
for p in 'hero__mark--lockup' 'hero__mark-monogram' 'hero__mark--art' \
         'tf-pc-logo-transparent' 'tf-archivo-yellow' 'rel="preload"' '<h1'; do
  printf '%-26s %s\n' "$p" "$(grep -c "$p" index.html)"
done
```

Expected, in order: `0`, `0`, `1`, `1`, `0`, `1`, `1`. Exactly one `<h1>`, one
logo reference left (the nav's), no Archivo reference on the landing.

- [ ] **Step 5: Confirm the file is still well-formed and the name sits inside the h1**

```sh
node -e '
const s = require("fs").readFileSync("index.html","utf8");
const open  = (s.match(/<h1\b/g) || []).length;
const close = (s.match(/<\/h1>/g) || []).length;
// The sr-only span has to fall between the h1 tags, whatever sits around it.
const start = s.indexOf("<h1");
const end   = s.indexOf("</h1>");
const inner = start >= 0 && end > start ? s.slice(start, end) : "";
const named = /<span class="sr-only">True Friends<\/span>/.test(inner);
const deco  = /<img src="img\/tf-smiley-chrome-transparent\.webp"[^>]*alt=""/.test(inner);
console.log("h1 open/close:", open, close, "| name inside h1:", named, "| decorative img:", deco);
process.exit(open === 1 && close === 1 && named && deco ? 0 : 1);
'
echo "exit=$?"
```

Expected: `h1 open/close: 1 1 | name inside h1: true | decorative img: true` and
`exit=0`. This checks containment rather than an exact match on adjacent lines,
so the explanatory comment inside the `<h1>` cannot break it.

- [ ] **Step 6: Commit**

```sh
git add index.html
git commit -m "$(cat <<'EOF'
Lead the hero with the smiley instead of the wordmark lockup

The monogram-over-wordmark lockup is gone from the landing. The Archivo
wordmark it used is not: TF Classic still references it in eleven files
under 1996/, so it stays as a shared brand asset.

The h1 needed something to carry it. The wordmark used to supply the name
through its alt text, but alt="True Friends" on a picture of a smiley in
orbit rings describes something the image is not, so the name is now real
text in an .sr-only span and the artwork is marked decorative.

Preloads the marble as well. It arrives through a CSS custom property, so
nothing in the markup points at it and the browser would otherwise find
those 100 KB only after parsing the CSS.
EOF
)"
```

---

### Task 4: Retarget the hero background

**Files:**
- Modify: `css/layout.css:198`

- [ ] **Step 1: Confirm the old path is still referenced**

```sh
cd /Users/johnnyvigersten/repos/true-friends-landing
grep -n "landing-page-hero" css/layout.css
```

Expected: one hit, `198:  --hero-photo-url: url("../img/landing-page-hero.webp");`

- [ ] **Step 2: Point it at the marble**

In the `body.landing` block, change:

```css
  --hero-photo-url: url("../img/landing-hero-bg.webp");
```

Nothing else in this file changes. The `body.landing > .hero__photo` block at
216-220 already sets `opacity: .5` and the 60% bottom fade, and the fixed
positioning at 208-214 already covers the viewport under the nav. That pipeline
is the treatment the spec commits to; this step swaps which file flows through it.

- [ ] **Step 3: Verify**

```sh
grep -c "landing-page-hero" css/layout.css
grep -n "landing-hero-bg" css/layout.css
```

Expected: `0`, then `198:  --hero-photo-url: url("../img/landing-hero-bg.webp");`

- [ ] **Step 4: Commit**

```sh
git add css/layout.css
git commit -m "$(cat <<'EOF'
Put the marble texture behind the landing page

One custom property. The three-layer hero backdrop already in layout.css —
gradient, texture at 0.5 opacity, radial scrim — is measured sufficient for
the cream lede to clear 4.5:1 across the whole texture, so it was kept
rather than replaced with a new scrim.

  node tools/contrast.js img/landing-hero-bg.webp        # 24.5% fail
  node tools/contrast.js img/landing-hero-bg.webp 0.5    # 0.0% fail
EOF
)"
```

---

### Task 5: Add the art modifier and retire the lockup rules

The rules only. The comments those rules sit inside are stale the moment this
lands, and Task 6 rewrites them as its own commit so neither commit is half a
thought.

**Files:**
- Modify: `css/layout.css:807-848` (delete, replace), `css/layout.css:930-932`

- [ ] **Step 1: Record what is about to be removed**

```sh
cd /Users/johnnyvigersten/repos/true-friends-landing
for p in 'hero__mark--lockup' 'hero__mark-monogram' 'hero__mark--art'; do
  printf '%-24s %s\n' "$p" "$(grep -c "$p" css/layout.css)"
done
```

Expected: `1`, `1`, `0`.

- [ ] **Step 2: Delete the two lockup rules and their comments**

Remove lines 807-848 in full — that is the `.hero__mark--lockup` comment block
(807-818), the `.hero__mark--lockup` rule (819-824), the
`.hero__mark-monogram` comment block (826-844) and the `.hero__mark-monogram`
rule (845-847), plus the blank line at 848. It leaves the
`.hero__mark--section` comment starting at 849.

Delete `.hero__mark--lockup` and `.hero__mark-monogram`, not
`.hero__mark--section`: nothing in this repo uses the section modifier, but it
is the rule the consulting and studio copies of this file rely on, and removing
it is not this change's business.

- [ ] **Step 3: Add `.hero__mark--art` in the gap**

In the space just vacated, add:

```css
/* The landing's hero mark: the smiley artwork, sized off the container the
   way the wordmark used to be. One image rather than a two-row lockup, so
   one modifier — --lockup and -monogram only existed because there were two
   images at different sizes.

   30rem is 480px, which at the file's 2.17:1 is 221px tall. That is close to
   the height the old lockup column took while reading as a single object
   instead of a badge sitting on a line of type.

   The filter is the other half of this rule. .hero__mark img puts a
   flame-red drop shadow on every hero mark on the site; the artwork does not
   want it. It is already a lit, shaded sphere with its own chrome rings, and
   a red offset behind a yellow ball on a warm gold ground has nothing left
   to misregister against — the flame was the one hot note, and the ground
   is now a second one.

   MUST come after .hero__mark img in this file. Both selectors are
   (0,1,1), so source order is the only thing clearing the filter. Move this
   above it and the red offset silently returns. */
.hero__mark--art {
  max-width: 30rem;
}

.hero__mark--art img {
  filter: none;
}
```

`.hero__mark img` (798-805) already supplies `display: block; width: 100%;
height: auto`, so the image fills the cap with no further sizing rule.

- [ ] **Step 4: Verify the rules landed in the right order**

```sh
for p in 'hero__mark--lockup' 'hero__mark-monogram' 'hero__mark--art' 'hero__mark--section'; do
  printf '%-24s %s\n' "$p" "$(grep -c "$p" css/layout.css)"
done
awk '/^\.hero__mark img/{a=NR} /^\.hero__mark--art img/{b=NR} END{print "mark img at",a,"| art img at",b; exit !(b>a)}' css/layout.css
echo "exit=$?"
```

Expected, in order: `0`, `0`, `2`, `1` — `--art` twice, once in the comment and
once in each of the two rules; `--section` untouched. Then
`mark img at 798 | art img at ...` with a **higher** line number and `exit=0`.

- [ ] **Step 5: Retune the short-window cap**

At `css/layout.css:930-932`, change:

```css
@media (max-height: 820px) {
  body.landing .hero__mark { max-width: 24rem; }
}
```

`40rem` was tuned for the two-row lockup this replaces — a monogram row over a
wordmark row. At `24rem` the artwork is 384×177.

This query is insurance, not a live constraint: at the `30rem` cap the column
clears a 768px-tall laptop with room to spare. Task 6 asks for a measurement, and
if nothing clips this query should be deleted rather than kept at a number tuned
to artwork that no longer exists.

- [ ] **Step 6: Verify**

```sh
grep -n -A2 "max-height: 820px" css/layout.css
```

Expected: the query with `max-width: 24rem`.

- [ ] **Step 7: Commit**

```sh
git add css/layout.css
git commit -m "$(cat <<'EOF'
Size the hero artwork with a landing-scoped modifier

The artwork is one image where the lockup was two, so one modifier replaces
--lockup and -monogram rather than adding a third name. It states its own
width cap and clears the flame filter that .hero__mark img puts on every
hero mark.

Note in the comment that the new rule must stay after .hero__mark img: the
two selectors have identical specificity, so source order is the only thing
clearing the filter, and moving it up brings the red offset back silently.

.hero__mark--section is deliberately kept. Nothing here uses it, but the
consulting and studio copies of this file do.
EOF
)"
```

---

### Task 6: Make the comments true again

`css/layout.css` is commented at a density that treats a stale comment as a real
defect — blocks explain what was tried, what was measured, and why a number is
the number. This change falsifies six of those blocks. Leaving them would make
the file lie in detail, which is worse than having no comments.

**Files:**
- Modify: `css/layout.css` — comment blocks at 732-739, 759-776, 778-788,
  849-868, 885, 917-928. No rules change in this task.

- [ ] **Step 1: List every stale reference**

```sh
cd /Users/johnnyvigersten/repos/true-friends-landing
grep -n "lockup\|monogram\|17.45\|8\.2:1\|wordmark" css/layout.css
```

Expected: 20-odd hits. Every one of them is now describing artwork this change
removed. This list is the checklist for the steps that follow.

- [ ] **Step 2: Rewrite the brand-hero banner (732-739)**

```css
/* ====================================================================
   Brand hero — every page
   --------------------------------------------------------------------
   Every page opens on drawn artwork in the same hand: the smiley mark on
   the landing, the page name on Consulting and Studio.

   One bold move, and only on the section pages — a flame-red offset behind
   the mark, standing in for the misregistration you get from a cheap
   two-colour screen print. The landing takes none. That artwork is already
   a lit, shaded, finished object, and a red offset behind a yellow ball on
   a gold ground had nothing left to misregister against: the flame was the
   one hot note, and the ground is now a second one.
   ==================================================================== */
```

- [ ] **Step 3: Rewrite the vertical-rhythm diagram (759-776)**

```css
/* Vertical rhythm. A single flex gap spaced every row equally, which made
   the lede look as attached to the button below it as to the title above —
   proximity was encoding nothing. The rows are now steps on one modular
   scale, ratio 1.618, so the spacing states the relationships:

     mark -> lede          1.618  the lede explains the mark
     lede -> say hi        2.618  reading ends, acting begins

   Two steps, where there were three. The mark used to be two rows — monogram
   over wordmark — and carried a 1.000 step of its own; one image is one row,
   so the scale starts at 1.618 now.

   The two survivors are unchanged on purpose. Artwork -> lede is the same
   relationship wordmark -> lede already was, and the CTA step never moved.
   Retuning them would have shifted spacing this change was not asked to
   shift, and the ratios would have survived either way.

   One variable drives both, so the whole stack still retunes from a single
   number. */
```

- [ ] **Step 4: Trim the `.hero__mark` comment (778-788)**

Keep everything except the final sentence, which describes the removed wordmark's
proportions. The block now ends:

```css
   inherited heading size rather than the artwork. */
```

- [ ] **Step 5: Fix the `.hero__mark--section` comment (849-868)**

In the first paragraph, replace:

```css
   thing on the page is also the boldest. The landing keeps the full
   monogram-over-wordmark lockup; that is where the brand introduces itself.
```

with:

```css
   thing on the page is also the boldest. The landing leads with the smiley
   instead, so the flame stays a section-page move.
```

And in the yellow paragraph, replace:

```css
   Yellow, not cream, so one rule covers every hero mark on the site — the
   landing wordmark is yellow with the same flame behind it, and a cream
   page name would have made the section pages the exception. It also costs
   the "say hi" button its monopoly on the accent, but the landing already
   sets a giant yellow wordmark above yellow buttons, so that price is
   already paid there. And the flame is specified as the hot note against
```

with:

```css
   Yellow, not cream, so one rule covers every hero mark on the site; a cream
   page name would have made the section pages the exception. It also costs
   the "say hi" button its monopoly on the accent, but the landing puts a
   large yellow mark above yellow buttons, so that price is already paid
   there. And the flame is specified as the hot note against
```

The argument survives the swap intact — it was the *wordmark* that was yellow,
and now the artwork is.

- [ ] **Step 6: Fix the `--section` note about the cap (885)**

Replace `landing lockup; here height is the lever` with
`landing mark; here height is the lever`.

- [ ] **Step 7: Rewrite the short-window comment (917-928)**

```css
/* Short windows: on the landing the mark is the one element with room to
   give, so shrink it rather than let the column overflow. Scoped to the
   landing because it is the only page that has to fit the window — the
   section pages open onto content below and scroll. Left unscoped it would
   also clamp the section mark's width, and since that one is sized by
   height, object-fit would letterbox it inside a box taller than the
   artwork rather than simply making it smaller.

   820px, not the 700px the gap rule below uses. At the 30rem cap the artwork
   is 221px tall, so the column clears a 768px-tall laptop with room to spare
   and this query is insurance rather than a live constraint. Measure before
   trusting it: if nothing clips, delete it rather than leave a clamp tuned
   to a two-row lockup that no longer exists. */
```

- [ ] **Step 8: Verify no stale reference survives**

```sh
cd /Users/johnnyvigersten/repos/true-friends-landing
for p in lockup monogram '17\.45' '8\.2:1' wordmark; do
  printf '%-12s %s\n' "$p" "$(grep -c "$p" css/layout.css)"
done
```

Expected, in order: `1`, `0`, `0`, `0`, `3`.

The survivors are all historical, and each has to earn its place:

- **`lockup` ×1** — the short-window comment from Step 7, explaining that its cap
  is a number tuned to a two-row lockup that no longer exists. That is the
  comment doing its job: recording why a clamp is suspect.
- **`wordmark` ×3** — two in the `.hero__mark--section` history ("It used to sit
  under a small True Friends wordmark", "The wordmark is gone"), and one in the
  Step 3 rhythm text ("the same relationship wordmark -> lede already was").
  Read all three and confirm none of them claims the landing still has one.

- [ ] **Step 9: Confirm the rules were not disturbed by the comment pass**

```sh
grep -c "hero__mark--art" css/layout.css
node -e '
const c = require("fs").readFileSync("css/layout.css","utf8");
let d=0,b=0;
for (const ch of c) { if (ch==="{") d++; else if (ch==="}") { d--; if (d<0) b++; } }
console.log("brace depth at EOF:", d, "| stray closers:", b);
process.exit(d===0 && b===0 ? 0 : 1);
'
echo "exit=$?"
```

Expected: `2` for `--art` — one per rule, since the new comment block never
spells the class name — and `brace depth at EOF: 0 | stray closers: 0` with
`exit=0`. A comment that eats a brace is the easy way to break this file, because
it takes the scrim and the glass with it.

- [ ] **Step 10: Commit**

```sh
git add css/layout.css
git commit -m "$(cat <<'EOF'
Rewrite the layout.css comments the hero swap falsified

Six blocks described the monogram-over-wordmark lockup, the 8.2:1 wordmark
proportions and the 17.45% monogram cap — artwork this change removed. In
a file commented at this density that is a real defect: the next reader
would be reasoning from a hero that no longer exists.

The vertical-rhythm diagram loses a step rather than being renumbered. Two
rows became one, so the scale starts at 1.618 now; the two surviving steps
are untouched because artwork -> lede is the same relationship wordmark ->
lede already was.

The flame argument needed the least rewriting of the lot. It was the
wordmark that was yellow; now the artwork is, so the reasoning about the
accent not having a monopoly on the section pages still holds.
EOF
)"
```

---

### Task 7: Verify the whole change

Everything automated in one place, then the two things that need a human.

**Files:**
- Verify only. No edits unless a check fails.

- [ ] **Step 1: Clear the brainstorming scratch**

`tools/check-links.js` walks the entire tree, including paths that are not part
of the site. `.superpowers/` holds this design session's mockups — four
throwaway HTML screens with their own images — and the checker would count their
references as if they were pages. Git ignores the directory, so this is about
the checker's reference count staying honest, not about a clean `git status`.

```sh
cd /Users/johnnyvigersten/repos/true-friends-landing
pkill -f "brainstorm/server.cjs" 2>/dev/null
rm -rf .superpowers
ls -d .superpowers 2>&1
```

Expected: `No such file or directory`.

- [ ] **Step 2: Run both repo checks**

```sh
./tools/check-stubs.sh
node tools/check-links.js .
```

Expected: the stub checker passes, and the link checker reports `0 broken` across
a few hundred references. It now validates `img/tf-smiley-chrome-transparent.webp`
from the `<img src>` in Task 3.

- [ ] **Step 3: Close the link checker's blind spot**

The checker reads `href` and `src` in HTML. It cannot see
`--hero-photo-url`, which is a CSS `url()` inside a custom property — a typo
there passes every check in this plan. Ask the server directly.

```sh
python3 -m http.server 8803 >/dev/null 2>&1 &
sleep 1.5
for u in / /css/layout.css /css/tokens.css /css/base.css /css/components.css \
         /js/main.js /js/lang-boot.js /js/translations/common.js \
         /js/translations/landing.js \
         /img/landing-hero-bg.webp /img/tf-smiley-chrome-transparent.webp \
         /img/tf-pc-logo-transparent.svg /img/tf-pc-logo-yellow-transparent.svg \
         /img/tf-pc-favicon.svg /img/tf-archivo-yellow-transparent.svg; do
  printf '%-46s %s\n' "$u" "$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:8803$u")"
done
```

Expected: `200` on all fourteen. `img/landing-page-hero.webp` is deliberately
absent from that list — it is deleted, and `200` on the two new paths is what
proves Task 1 and Task 4 agree with each other.

- [ ] **Step 4: Re-measure the contrast**

```sh
node tools/contrast.js img/landing-hero-bg.webp 0.5; echo "exit=$?"
```

Expected: `exit=0`, `0.0%` cream, worst cream `4.66:1`.

- [ ] **Step 5: Check the served markup**

```sh
curl -s http://localhost:8803/ | grep -c "<h1"
curl -s http://localhost:8803/ | grep -o 'src="img/[^"]*"'
curl -s http://localhost:8803/ | grep -o 'href="img/landing-hero-bg.webp"'
```

Expected: `1`; two `img/tf-pc-logo*` references and one
`img/tf-smiley-chrome-transparent.webp` from the nav and the artwork, with the
favicon counted separately; and one `href="img/landing-hero-bg.webp"` — the
preload, present in the served HTML rather than only in the source file.

- [ ] **Step 6: Manual check — four viewports**

Firefox and Safari are installed; no headless browser can run in this
environment, so this step needs a human. Open `http://localhost:8803/` at each
size and confirm:

| Viewport | What to look for |
|---|---|
| 1440×900 | The artwork sits at the top of the centred column, the marble reads as gold grain in the dark rather than as a texture, the lede is comfortable to read |
| 1440×768 | The tight case the short-window cap exists for. Nothing clipped, hero still fits the window. **If nothing clips, delete the `max-height: 820px` query** and commit that separately |
| 390×844 | Artwork scales down with the container, buttons wrap to two rows if they already did, no horizontal scrollbar |
| 360×640 | The smallest case. Same checks |

Also confirm, in the same pass:

- The devtools console shows no 404 and no CSP violation. The preload in Task 3
  and the CSS `url()` in Task 4 are the two places a violation would appear.
- Tab to the first link: the skip link, then the nav. The `.sr-only` name in the
  `<h1>` must not appear in the visible page but must be inside the `<h1>` in the
  accessibility tree.
- The nav's frosted glass still reads over the marble, and the email row and
  footer at the bottom are legible over the faded edge.

- [ ] **Step 7: Confirm the repo is in the intended state**

```sh
pkill -f "http.server 8803"
git status --short
git log --oneline -8
```

Expected: a clean tree apart from anything Step 6 asked you to change, and seven
commits — assets, contrast tool, markup, background, rules, comments, and this
verification pass if it needed an edit.

---

## Rollback

Six commits, each independent. To get back to the sunset hero:

```sh
git revert --no-edit HEAD~5..HEAD
```

To go further back, `git reset --hard 4510591` returns the repo to the last
commit before the spec.

The three deleted files are recoverable with `git checkout HEAD -- img/`
because only `img/landing-page-hero.webp` was ever tracked. The two source
images at the repo root were never committed — if they are gone, they are gone,
so keep a copy outside the repo before Step 6 of Task 1 if the originals matter.
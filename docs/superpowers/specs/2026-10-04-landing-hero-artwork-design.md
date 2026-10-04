# Landing hero: smiley artwork and marble background

**Date:** 2026-10-04
**Status:** approved, not yet implemented
**Scope:** the landing page only (`index.html` + `css/layout.css`)

## The change

The landing hero loses both parts of the monogram-over-wordmark lockup. In their
place: `Smiley-world-chrome.png` as the hero artwork, and the liquid-marbling
paint texture as the page background.

The lede, the two buttons, the nav, the email row and the footer are untouched.

## Decisions taken

Each of these was chosen over at least one alternative; the reasoning is kept
here so a later reader can tell a decision from an accident.

| Decision | Chosen | Rejected | Why |
|---|---|---|---|
| Artwork position | Top row of the existing centred column | Pinned to the viewport top; centred but oversized | Keeps `align-items: center` and the vertical rhythm already in `layout.css` intact. |
| Background strength | The site's existing treatment — texture at `opacity: .5` over ink, radial scrim, 60% bottom fade | Marble forward at .78 with a heavier scrim; full-strength wallpaper with a dark pool; no scrim at all | The existing treatment is measured-sufficient (below) and requires changing one custom property rather than authoring a new scrim. |
| Artwork finish | As drawn, no shadow | The flame-red offset `.hero__mark img` already applies; a dark plate behind the ball | The artwork carries its own chrome rings and lit sphere, so it reads as a finished object. The flame also loses its function: red as "the one hot note" no longer holds when the background is itself a warm gold. |
| The `<h1>` | `.sr-only` "True Friends" + decorative image | `alt="True Friends"` on the image; no `h1` | The name is real page text that has nothing to show for itself. Putting it on the image would describe a picture of a smiley in orbit rings as the site's name. Dropping the `h1` loses the top-level heading. |
| Asset weight | Convert to webp, delete the 10.2 MB sources | Ship the sources; convert and keep the sources | The rest of the site already ships webp, and `README.md` treats the 9.7 MB gallery as a problem worth writing paragraphs about. |
| CSS wiring | One landing-scoped `.hero__mark--art` modifier | Override `.hero__mark img` under `body.landing`; move the marble to `body`'s own background | No shared rule gets bent. `brand/README.md` says this CSS is copied into three repos and expected to diverge — an override whose only job is to undo a shared rule is the divergence it warns about. |

## Contrast: measured, not eyeballed

The texture looks dark in a thumbnail and is not. Sampled across the whole file:

| | value |
|---|---|
| Median pixel | `#473801` (dark olive) |
| Mean pixel | `#635301` |
| 95th-percentile luminance | `0.51` (a bright gold vein) |

Relative luminance has to stay under `0.1715` for the cream lede
(`#faf9f5`) to clear 4.5:1 against it.

| Treatment | Worst pixel (cream) | Worst pixel (yellow) | Pixels under 4.5:1 (cream) | (yellow) |
|---|---|---|---|---|
| Texture at full strength | 1.35:1 | 1.11:1 | **24.5%** | 28.7% |
| Texture at `opacity: .5` over `--color-bg` | **4.66:1** | 3.83:1 | **0%** | 3.2% |

The second row is a floor, not a measurement of the finished page: the scrim
and the gradient only ever darken what is under them, so the painted result
lands at or above those figures. Cream clears 4.5:1 across the whole texture
before either is applied.

Yellow does not clear 4.5:1 everywhere at that opacity — 3.2% of the texture
sits under. It is not load-bearing on this page: the only yellow text is
`--color-nav-fg-hover` on the nav's "TF 1996" link, and the nav's frosted tint
puts its own 50% dark panel behind that. Re-measure if the accent ever sets
body copy over the bare texture.

This is why the background is not simply "the image". Untreated, a quarter of
the texture is too light to carry body text. The treatment already in
`layout.css` resolves it.

## Assets

Two files added to `img/`, both produced with `cwebp` (already installed;
`sips` on this machine cannot write webp, which is why it is not the tool here).
Both sources are deleted from the repo.

| New file | Built from | Dimensions | Weight |
|---|---|---|---|
| `img/tf-smiley-chrome-transparent.webp` | `Smiley-world-chrome.png`, cropped to its inked bbox, then 1200w. Alpha preserved. | 1200×553 | 80 KB |
| `img/landing-hero-bg.webp` | the liquid-marbling `.jpg`, 2560w, q72 | 2560×1281 | 100 KB |

The crop matters. The source canvas is 3840×2160 but the artwork only occupies
3090×1422 of it — 9.8% dead space left and right, 17.1% top and bottom, 47% of
the canvas empty. Trimming first is what makes a `max-width` in CSS mean what it
says.

Names follow existing convention: `landing-hero-bg` after
`studio-hero-bg` / `consulting-hero-bg`, and `tf-*-transparent` for the file
with an alpha channel.

Exact build, so the weights above are reproducible rather than approximate:

```sh
# smiley: crop to the inked bbox (offset is top-left), then 1200w, alpha kept
sips -c 1422 3090 --cropOffset 369 375 Smiley-world-chrome.png --out /tmp/s.png
cwebp -quiet -resize 1200 0 /tmp/s.png -o img/tf-smiley-chrome-transparent.webp

# marble: 2560w, q72
cwebp -quiet -resize 2560 0 -q 72 \
  "liquid-marbling-paint-texture-background-fluid-painting-abstract-texture-intensive-color-mix-wallpaper(1).jpg" \
  -o img/landing-hero-bg.webp
```

**New hero payload: 180 KB**, against 68 KB for the sunset photo it replaces.

### Deleted

- `img/landing-page-hero.webp` — 68 KB, unreferenced once `--hero-photo-url`
  moves.
- The two source images at the repo root (10.2 MB).
- `.hero__mark--lockup` and `.hero__mark-monogram` in `css/layout.css`
  (819-847). Landing-only classes; TF Classic carries its own logo CSS.
  `.hero__mark--section` deliberately **survives** even though nothing in this
  repo uses it — it is the rule the consulting and studio copies of this file
  rely on, and deleting it is not this change's business.

### Kept, and it must stay

`img/tf-archivo-yellow-transparent.svg`. Removing the hero's use of it looks
like dead weight, but **eleven files under `1996/` reference it** — TF Classic's
masthead, taskbar, dialog and every reference-case page. It is a shared brand
asset, not a hero asset.

`css/tokens.css` is not touched. `--gradient-hero` still sits behind the
texture, the scrim is unchanged, and the brand yellow is unchanged.

## Markup

`index.html:81-88` becomes:

```html
<h1 class="hero__mark hero__mark--art">
    <span class="sr-only">True Friends</span>
    <img src="img/tf-smiley-chrome-transparent.webp" alt="" aria-hidden="true"
         width="1200" height="553" decoding="async">
</h1>
```

One modifier, not two. The old markup needed `--lockup` on the `<h1>` and
`-monogram` on the image only because there were two images at different sizes.

`alt="" aria-hidden="true"` together matches the convention already at
`index.html:82-84`. The `.sr-only` name carries no `data-i18n` because the site
name is "True Friends" in both locales — the `alt="True Friends"` it replaces
was untranslated for the same reason.

A `<link rel="preload" as="image" href="img/landing-hero-bg.webp">` goes in
`<head>`, after the stylesheet links. The marble is a CSS background, so without
it the browser only discovers the 100 KB after parsing the CSS. The page CSP
(`default-src 'self'`) permits it.

That preload is **change 2 of 2 in `index.html`** — the `<h1>` above is change 1.
The four CSS edits follow.

## CSS

Four edits, all in `css/layout.css`.

**1. The background hook (line 198).** `--hero-photo-url` retargeted to
`url("../img/landing-hero-bg.webp")`. Nothing downstream changes: the
`body.landing > .hero__photo` block at 216-220 already sets `opacity: .5` and
the 60% bottom fade, and the fixed positioning at 208-214 already covers the
viewport under the nav.

**2. A new modifier, replacing the lockup rules.**

```css
.hero__mark--art { max-width: 30rem; }
.hero__mark--art img { filter: none; }
```

`.hero__mark img` (798-805) already supplies `display: block; width: 100%;
height: auto`, so the artwork fills the cap — 480×221 at the file's 2.17:1.

**This must come after `.hero__mark img` in the file.** Both selectors are
(0,1,1), so source order is the only thing clearing the flame filter; move the
rule up and the red offset silently returns. That goes in a comment.

**3. The short-window cap (930-932).** `@media (max-height: 820px)` retunes
from `max-width: 40rem` to `24rem` (→ 384×177). The old number was tuned for
the two-row lockup this replaces. Measure the rendered column at a **1440×768**
viewport: if nothing clips or pushes the hero past the window, **delete the
query** rather than keep a clamp that is no longer earning its place. A stale
clamp is worse than none.

**4. The rhythm comment (759-776), comment only.** `.hero__lede`'s
`margin-top: calc(var(--rhythm) * 1.618)` and `.hero--brand .hero__cta`'s
`2.618` stay byte-identical: artwork→lede is the same relationship
wordmark→lede was. What is wrong is the comment, which advertises a `1.000`
step for the lockup's internal gap that no longer exists. It gets rewritten to
say the scale now starts at 1.618, and why the two surviving steps are untouched.

## Verification

- `./tools/check-stubs.sh` — clean.
- `node tools/check-links.js .` — clean, **after** `.superpowers/` is removed.
  The checker walks the whole tree, so the brainstorming scratch must be gone
  first or it scans mockups that are not part of the site.
- **Known blind spot:** the checker reads `href`/`src` in HTML only. It will
  confirm the smiley resolves and will **not** see the marble, whose path lives
  in a CSS `url()` inside a custom property. A typo there fails silently.
  Confirm it from the browser console (no 404) instead of trusting the checker.
- Serve on `python3 -m http.server 8803` and inspect at 1440×900, 1024×768,
  390×844, 360×640.
- Exactly one `<h1>`, reading "True Friends".
- Re-measure the cream lede against the *composited* background — texture at
  `.5` over ink, plus the scrim — rather than trusting the per-pixel numbers
  above, which were taken on the raw texture. `tools/contrast.js`, added by this
  change, is the thing that does it: it takes an image path and prints the
  worst-case ratios and failure percentages.

## Not in scope

The consulting and studio sites, and TF Classic. `consulting.html`,
`studio.html` and the reference-case stubs are bare redirects with no imagery,
and `1996/` is a deliberate separate design. The marble is the landing page's
background; nothing else in this repo has a hero backdrop to change.
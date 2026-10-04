# Landing chrome: drop the navbar, regroup the footer, neutralise the gradient

**Date:** 2026-10-04
**Status:** approved, not yet implemented
**Scope:** the landing page and the brand-layer files only it loads

## The change

Six things, all on `truefriends.se`'s front page.

1. The social icons move from the navbar to the bottom of the page, below the
   email address.
2. The navbar is deleted.
3. The `EN` / `SV` switcher moves to the footer, above the copyright.
4. `img/favicon.png` becomes the favicon.
5. The `TF 1996` button is deleted. The `1996/` build stays on disk.
6. `--gradient-hero` loses its colour and becomes a greyscale ramp.

Then a sweep: everything in the four stylesheets, `js/main.js` and
`js/translations/common.js` that no page in this repository reaches any more is
deleted, so those files describe the one page that loads them.

## Why the sweep is safe

`brand/README.md` calls `css/*.css` and `js/main.js` a *brand layer* copied into
three repositories, which reads as an argument for leaving them alone. It is not,
and the same file settles it:

> The CSS and JS are starting points and are expected to diverge. […] Do not try
> to keep `components.css` or `layout.css` in step across the three
> repositories — they are copied precisely so each site can change them freely.

The landing has its own copy at its own path. Consulting and Studio have theirs.
Nothing here is upstream of anything.

The stronger point is narrower. **Only the root `index.html` loads these four
stylesheets and this `js/main.js`.** Verified:

| Path | Loads `css/tokens.css`? |
|---|---|
| `index.html` | yes |
| `consulting.html`, `studio.html` | no — bare `meta http-equiv="refresh"` stubs |
| `reference-cases/**` | no — same stub shape |
| `1996/**` | no — has its own `1996/css/win95.css` and its own `1996/js/` |

So these files are the landing page's stylesheets that happen to be named like a
kit. Every rule in them that `index.html` does not reach is dead, and most of it
was already dead before this change.

### This reverses one earlier decision, on purpose

`2026-10-04-landing-hero-artwork-design.md` kept `.hero__mark--section` for a
specific reason:

> `.hero__mark--section` deliberately **survives** even though nothing in this
> repo uses it — it is the rule the consulting and studio copies of this file
> rely on, and deleting it is not this change's business.

The reasoning was sound as scope discipline for a change about hero artwork.
The premise has since been checked and does not hold: `brand/README.md` says
the three repositories must **not** be kept in step, and consulting and studio
each hold their own copy at their own path. There is no "their copy" downstream
of this one to rely on the rule.

The barrier was always scope, and the owner has now asked for the sweep
explicitly. `.hero__mark--section` is deleted with the rest. Flagged here
because it contradicts a written decision rather than merely extending one, and
a later reader deserves to know that was deliberate.

### Two false positives to not "clean up"

A grep for `\.\w` across the stylesheets reports `.webp` and `.svg` as unused
classes. Neither exists. They come from `url("…webp")` and
`url("…placeholder.svg")` inside otherwise-deleted rules. They are not classes
and there is nothing to delete.

### Dead before this change, found while auditing

Worth recording, because it sets the baseline the sweep works from:

- **`layout.css:91, 112, 129, 177` — four `.hero__content` rules.** The
  landing's hero content div is `.hero__brand`, not `.hero__content`, so
  `body.landing .hero__content { max-width: 800px }` never applied to anything.
  The landing's spacing comes entirely from `--rhythm` inside `.hero__brand`
  (`layout.css:788`). Nothing to migrate; just delete.
- **`meta.description` in `common.js` — unreferenced.** The `<meta name=
  "description">` at `index.html:8` carries no `data-i18n-content`, so the
  dictionary entry has never been read. The description served is the
  English-only string in the markup.
- **`.socials-row` (`components.css:454`)** is defined and used by nothing. This
  change gives it its first consumer.

## Decisions taken

Each of these was chosen over at least one alternative; the reasoning is kept
here so a later reader can tell a decision from an accident.

| Decision | Chosen | Rejected | Why |
|---|---|---|---|
| Switcher placement | Footer, above the copyright, centred in the existing stack | Beside the copyright on one line; a corner control; removed outright | The footer is already `text-align: center`, so a stacked row needs no flex and no breakpoint. Below the copyright buries it; a corner control contradicts the page's centred axis. |
| Switcher kept at all | Keep, moved | Delete the toggle; auto-detect from `navigator.language` | `js/main.js:107-124` deliberately does no locale guessing, and its comment explains why: a Swedish speaker abroad and an English speaker in Sweden both got the wrong page, and the IP lookup swapped languages out from under people after first paint. Deleting the toggle therefore strands `js/translations/*`, `lang-boot.js` and the `localStorage` persistence. |
| Footer row order | socials → `EN / SV` → copyright | socials → copyright → `EN / SV` | Asked for explicitly. It also reads right: channels, then language, then the legal line last. |
| Socials container | Reuse `.socials-row` | Rename it; inline the styles | The class already exists, already says what it does, and already has the right display. It was written for exactly this and never used. |
| Socials markup | Moved verbatim | Rewritten | The links are placeholders carrying `data-href` rather than `href` and `aria-disabled="true"` (`components.css:444-450`). Moving them verbatim keeps that contract intact. |
| Nav CSS | Delete, including `.nav__lang*`, which survive renamed as `.langs*` | Leave in place | Option chosen. `index.html` is the only consumer, so there is no second reader to preserve it for. |
| Pre-split dead CSS | Delete | Keep as a library for the sibling sites | Same reasoning. `brand/README.md` forbids keeping them in step; the siblings were copied at split time and own their files now. |
| TF 1996 | Unlink only | Delete `1996/`, add a redirect stub | Not this change's decision to make. The build stays reachable by URL and in the repo. |
| Gradient shape | Same three layers, same geometry, hues stripped | Flat `--color-bg`; vertical ramp only | The photo above it is masked out below 60% height, and that is exactly where the lift is doing work. Keeping the geometry preserves it. |
| Gradient radials | Near-black (`rgba(255,255,255,0.07)` / `0.04`) | White or light grey | See below. |
| Favicon | Root `index.html` only | Also in `1996/` | TF Classic renders its own 16px `titlebar__icon` from the SVG, at a size and on a taskbar the PNG does not suit. |
| Translation keys | Delete unreachable keys | Leave the dictionary whole | `brand/README.md`'s "One wrinkle" section records that `common.js` has already been trimmed once for this repository. Doing it again is established practice, not a departure. |

## Markup

`index.html`, four edits.

**1. The favicon (line 14).**

```html
<link rel="icon" type="image/png" href="img/favicon.png">
```

`img/favicon.png` is 326×327 RGBA, 24 KB. `type` changes from
`image/svg+xml` to `image/png` to match the file. The page CSP
(`img-src 'self' data:`) already permits it. `1996/index.html` and its
reference-case pages keep the SVG.

**2. Delete `<header class="nav" id="site-nav">` (lines 47-79),** and with it:

- `id="top"` on the hero `<section>` (line 82). Its only referent was
  `.nav__brand`'s `href="#top"`.
- `.nav__brand` and its two wordmark `<img>`s. The hero artwork is the brand
  statement now; a second mark in a corner would compete with it.
- `.nav__era` — the `TF 1996` button.
- `.nav__links`, `.nav__crumbs*`, `.nav__drawer`, `.nav__toggle` — already
  unused by this page's markup, which is why the hamburger never appeared.

`<a href="#main" class="sr-only" data-i18n="aria.skip">` **survives**, and so
does `id="main"` on `<main>`. It is the first focusable thing on the page once
the nav's links are gone, so it does more work than before, not less.

**3. The socials move into the footer,** verbatim from the nav, `aria-label` and
all:

```html
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

The `data-lang` attributes are untouched, so `js/main.js`'s `[data-lang]`
listener and its `aria-pressed` write keep working unchanged. The email row
between `</main>` and `<footer>` does not move.

**4. Nothing else in `<head>`.** The
`<link rel="preload" as="image" href="img/landing-hero-bg.webp">` and the
blocking `js/lang-boot.js` both stay as they are.

## The gradient

`--gradient-hero` in `css/tokens.css:47`, painted by `.hero__bg`
(`css/layout.css:61`) — the bottom of the three backdrop layers, behind
`.hero__photo` and `.hero__scrim`.

| Now | Becomes |
|---|---|
| `radial-gradient(ellipse 80% 60% at 70% 65%, rgba(255, 140, 60, 0.35), transparent 70%)` | `radial-gradient(ellipse 80% 60% at 70% 65%, rgba(255, 255, 255, 0.07), transparent 70%)` |
| `radial-gradient(ellipse 70% 50% at 20% 30%, rgba(20, 25, 50, 0.85), transparent 70%)` | `radial-gradient(ellipse 70% 50% at 20% 30%, rgba(255, 255, 255, 0.04), transparent 70%)` |
| `linear-gradient(180deg, #0a0a0a 0%, #1a1208 55%, #0a0a0a 100%)` | `linear-gradient(180deg, #0a0a0a 0%, #141414 55%, #0a0a0a 100%)` |

Orange out, warm-black `#1a1208` out. Nothing coloured is left on the page.

**The radials go near-black rather than white, and this is the one judgement in
the change worth arguing for.** `layout.css:216-233` records a measurement: at
`opacity: 0.4` the chrome texture already puts 0.6% of its pixels under 4.5:1
against the cream text, and 0.4 is the first opacity that is clean everywhere. A
white radial behind a photo that already carries blown-out white speculars
raises its luminance in exactly the region the measurement is about, and undoes
work that was done deliberately. Near-white at 7% and 4% keeps the tonal
separation between the two glows while adding no hue and almost no luminance.

**It is a fallback layer, and barely visible.** `.hero__photo` sits above it at
`opacity: 0.4` and masks out below 60% of the viewport height
(`layout.css:234-238`). The gradient only reads in the bottom 40%, which is
where the change from `#1a1208` to `#141414` actually shows.

### The image above it is already greyscale

Decoded and sampled across the whole of `img/landing-hero-bg.webp`
(2560×1440): the widest channel spread anywhere in the image is **1/255**, at
`(82, 81, 82)`. There is no colour in the photograph. `--gradient-hero` was the
only source, which is why the change is three lines rather than a re-render.

`.hero__scrim` (`layout.css:82-89` and `123-127`) is already pure
`rgba(10, 10, 10, …)` and does not change.

## CSS

### `css/tokens.css`

Prune the tokens the sweep leaves with no consumer. Each one traced to the rule
that reads it, and that rule checked against the delete list above — not eyeballed:

| Token | Its only reader | Why it goes |
|---|---|---|
| `--color-surface` | `.gallery__*`, `.lightbox__*`, `.consultant-card__portrait` | all deleted |
| `--color-surface-hover` | `.nav__toggle:hover` | nav deleted |
| `--color-border-subtle` | `.consultant-card` | deleted |
| `--color-border-strong` | `.field__textarea:hover` | form deleted |
| `--color-border-input` | `.field__textarea` | form deleted |
| `--fs-small` | `.form__status`, `.services__note`, `.section__figure-caption`, `.section__note` | all deleted |
| `--nav-height` | `.section` | deleted |
| `--section-gap` | `.section` | deleted |
| `--z-nav` | `.nav`, `.back-to-top` | both deleted |
| `--color-nav-fg` | `.nav__link`, `.nav__lang`, `.nav .social`, `.nav__era` | nav deleted, and the one survivor (`.langs__btn`) is retargeted below |
| `--color-nav-fg-hover` | `.nav__crumb-link`, `.nav__link`, `.nav__lang`, `.nav .social` | nav deleted, survivor retargeted |
| `--color-glass-tint` | `.nav`, `.section__terminal` | both deleted |
| `--color-glass-highlight` | `.section__terminal-chrome`, `.service-line__summary:hover` | both deleted |
| `--blur-glass` | `.nav`, `.section__terminal` | both deleted |

**The last three are the one to look at.** They back the frosted-glass chrome —
`.nav` (`layout.css:246-256`) and `.section__terminal*` — and with both gone,
**the frosted-glass treatment leaves the site entirely.** It is correct, and it
is a bigger aesthetic consequence than it sounds, so it is called out here
rather than left to be discovered in a diff.

Four tokens look like casualties and are **not**, which is why the trace matters:

| Token | Its surviving reader |
|---|---|
| `--color-flame` | `.hero__mark img` (`layout.css:821`) still declares the flame filter. `.hero__mark--art img { filter: none }` clears it on the landing, but the rule and the token both stay. |
| `--color-accent-pressed` | `.btn:active` (`components.css:36`) — `.btn` is one of only three component classes the landing still uses. |
| `--lh-snug` | `base.css:74` sets it on every heading. Its other two uses (`.lede`, `.service-line__name`) go, but the token does not. |
| `--tracking-label` | `.btn` (`components.css:22`) still uses it. |

### `css/components.css`

Delete: the whole nav block (150-422) bar the three `.langs*` rules; the
`.nav .social` overrides (439-440); `.services__note`; the modal block; the form
and field blocks; `.gallery`, `.gallery__*` and the whole lightbox; `.honeypot`'s
sibling `.back-to-top`; `.address-row`; `.btn--outline`.

Rename out of the nav namespace and keep:

| Was | Becomes |
|---|---|
| `.nav__langs` | `.langs` |
| `.nav__lang` | `.langs__btn` |
| `.nav__lang-divider` | `.langs__divider` |

Their bodies change in two places only, both because the nav-specific colour is
being deleted: `color: var(--color-nav-fg)` becomes
`var(--color-text-strong)`, and `:hover` moves from `--color-nav-fg-hover` to
`--color-accent`, matching `.social`'s existing hover. `display: inline-flex`
survives as-is.

`.socials-row` (454) and `.social` (425-452) are kept as written. `.social`'s
default `color: var(--color-text-strong)` is what the nav's `.nav .social`
override was replacing, so the icons come out one step brighter than they were
in the nav. That is the intent.

### `css/layout.css`

Delete: `.hero--consulting`, `.hero--studio`, `.hero--blog` and the six
`hero--epiroc`-style reference-case modifiers (22-53); `.hero__content` and
`.hero--center` (91-119); `.hero__case-heading`, `.hero__case-logo`;
`.hero__mark--section` (883-901); the whole `.section*` template (296-443);
`.gallery-listing*`; `.service-*`; `.consultant-*`; `.contact__*`; and
`body:has(.hero--brand) .nav` (246-256).

Keep, with `.hero--blog` dropped from each list: `body:has(.hero--brand) { isolation: isolate }`
(269-272) — the landing still has a `.hero--brand`, so this still matches — and
the fixed-positioning block at 274-288.

`.hero__brand`, `.hero__mark`, `.hero__mark--art`, `.hero__lede`,
`.hero--brand .hero__cta`, `--rhythm`, the `max-height` media queries at
929-941, `.landing-email`, and the whole `body.landing` block (188-238) are
untouched.

### Spacing the new footer rows

`base.css:66` sets `p { margin: 0 }`, so the copyright `<p>` has no top margin
of its own. The two rows above it need theirs:

```css
.langs { margin-top: 0.75rem; }
.site-footer__copyright { margin-top: 0.35rem; }
```

`.site-footer`'s existing `padding: 1rem var(--container-padding)` supplies the
gap between the email row and the socials. Both rows are `inline-flex` inside a
`text-align: center` parent, so they centre with no extra rules.

## JS

### `js/main.js`

Delete: mobile nav (151-170); service accordion (172-184); gallery + lightbox
(186-381, including the 42-entry `GALLERY_IMAGES` array); back-to-top (383-402);
modal (404-436); forms (438-550).

All of it is already inert — the accordion and every form hook are
`querySelectorAll`, the rest are `if (element)` guards — so this is deletion of
code that has not run since the split, not a behaviour change.

`GALLERY_IMAGES` going is worth a line of its own. `README.md` tells you to keep
it in step with the studio site's copy. That instruction is about the *studio*
repository's `js/main.js`; the array here has been inert since the split, and
`img/gallery/` stays on disk regardless because `1996/` borrows it.

What remains is the i18n block, which is all `index.html` uses. Inside it, `t()`
(32-43) goes too: its only callers were the form status strings. `getNested`
and `substitute` stay — `applyTranslations` uses both.

### `js/translations/common.js`

Eight keys survive the change. Everything else in the file is unreachable from
`index.html`:

**Kept:** `hero.consulting`, `hero.studio`, `footer.copyright`, `aria.newTab`,
`aria.skip`, `aria.socialLinks`, `aria.langSwitch`. Plus `hero.lede` from
`js/translations/landing.js`.

**Deleted:** `meta`, `nav`, `services`, `refCase`, `contact`, `modal`, `era`,
`team`, `status`, `hero.cta`, and from `aria`: `home`, `primary`, `mobileMenu`,
`backToTop`, `lightbox`, `prevPhoto`, `nextPhoto`, `closeLightbox`, `firstName`,
`lastName`, `email`, `message`.

The file's header comment lists what it holds — "nav, footer, aria, status
messages, the contact modal" — and names five per-page files that do not exist
here. It gets rewritten to describe what is left. `TF_ADD_TRANSLATIONS` and its
deep-merge stay; `landing.js` calls it.

`1996/js/translations/` has its own full copy and is not touched.

## Side effects worth knowing

- **The socials were invisible on mobile.** `.nav__socials` was
  `display: none` below 900px and this page has no drawer, so under 900px wide
  the icons did not render anywhere. Moving them fixes a bug as a side effect.
- **`1996/` becomes orphaned.** Nothing on the landing links to it any more. It
  stays reachable by URL, stays in the repo, and `tools/check-links.js` will not
  complain — it checks that references resolve, not that pages are reachable.
- **The skip link matters more.** With the nav's links gone,
  `href="#main"` is the first focusable element on the page.
- **No breadcrumb trail to `1996/`** beyond typing the URL.

## Docs

Two files describe things this change makes untrue.

**`README.md`** — the opening line says the site is "One page pointing at the
two businesses, plus TF Classic and the redirect stubs". Still true of the files,
no longer true of the navigation. One sentence noting that TF Classic is no
longer linked from the landing.

**`brand/README.md`** — lists `img/tf-pc-favicon.svg` under the assets to "keep
in step by hand" across the three repositories. The landing now uses
`img/favicon.png` instead. Add the divergence to the "One wrinkle" section, which
already exists for exactly this: a file in the brand layer that is not the same
in all three.

## Verification

- `./tools/check-stubs.sh` — unaffected, must stay clean.
- `node tools/check-links.js .` — must stay clean. This is what catches the
  removed `id="top"`: if any reference to `#top` survives, it reports "no such
  id on this page".
- `node tools/i18n.js check` — must stay clean, and is the check that matters
  most for the translation trim. It resolves every `data-i18n*` key against each
  page's *own* directory dictionary (`tools/i18n.js:42-53`), so trimming the root
  `common.js` cannot affect the `1996/` pages. A missed trim shows up here as
  `MISSING`.
- **Known blind spot:** `check-links.js` reads `href`/`src` in HTML and paths in
  `js/translations/`. It does not read CSS `url()`. The favicon path and
  `--hero-photo-url` are both invisible to it — confirm no 404 in the browser
  console.
- `node tools/i18n.js sync` before `check`, since the markup fallbacks move.
- Serve on `python3 -m http.server 8803`. Inspect at 1440×900, 1024×768,
  390×844, 360×640.
- Nothing coloured remains: load the page, and in the console confirm
  `getComputedStyle(document.querySelector('.hero__bg')).backgroundImage`
  contains no hue. Decode `img/landing-hero-bg.webp` again if the ground looks
  off — the photograph was measured at 1/255 spread, so any colour seen is from
  a stylesheet rule that was missed.
- Switch to SV, reload, confirm the lede and both buttons translate, the
  copyright still rolls its `{year}`, and `localStorage.tf_lang` is set. Confirm
  EN still restores.
- Tab from the top of the document: the skip link must be the first stop.
- Exactly one `<h1>`, reading "True Friends".

## Not in scope

**The consulting and studio sites, and TF Classic.** `1996/` keeps its own
CSS, JS, translations, favicon and logo files, all untouched.

**The CSP.** `index.html:10` still allows `connect-src 'self'
https://formsubmit.co` and `form-action 'self' https://formsubmit.co` even
though this change removes the last form on the page. Tightening it is correct
and is a separate decision about how much to prune.

**`img/gallery/`** — 9.7 MB, inert since the split, but `1996/` reaches into it
via `SHARED` in `1996/js/win95.js`. It stays.

**The `footer.copyright` fallback drift.** The markup fallback at `index.html:135`
reads `© True Friends 2026`; the English string is `© {year} True Friends. All
rights reserved.`. `tools/i18n.js` skips fallbacks whose English contains `{`, so
it does not flag this, and with scripting on nobody sees the fallback — but a
visitor with JS off reads a shorter line than everyone else. Pre-existing, worth
a separate fix.
# The brand layer

These files were copied from `true-friends-website` when the site was split into
three. They are identical in the landing, consulting and studio repositories at
the moment of the split.

```
css/tokens.css  css/base.css  css/components.css  css/layout.css
js/main.js  js/lang-boot.js  js/translations/common.js
img/tf-pc-logo-transparent.svg  img/tf-pc-logo-yellow-transparent.svg
img/tf-pc-favicon.svg
tools/i18n.js
```

They keep their normal paths rather than moving into this folder — moving them
would break every relative reference on every page for no benefit. This file is
a label for the set, not a directory they live in.

## The rule

**The CSS and JS are starting points and are expected to diverge.** Consulting
and Studio are separate businesses and are being redesigned to look different.
Do not try to keep `components.css` or `layout.css` in step across the three
repositories — they are copied precisely so each site can change them freely.

**The logo files and the colour values in `tokens.css` are the umbrella.** Keep
those in step by hand, on the rare occasions they change. That is what makes
three different-looking sites read as one brand.

## One wrinkle

`js/translations/common.js` is not purely common. It carried
`hero.consultingMark`, which resolves to the consulting wordmark and its Swedish
variant — files that belong to the consulting site and do not exist here.
Neither the landing page nor TF Classic reads that key, so both have been
trimmed. If you copy `common.js` from another repository in future, trim them
again.

The landing's favicon is a second divergence. It uses `img/favicon.png` where
the other two still use `img/tf-pc-favicon.svg`. The PNG is the current brand
artwork; the SVG is kept because TF Classic renders it as a 16px taskbar icon,
which is not what that file is for. If consulting or studio move to the PNG,
delete `img/tf-pc-favicon.svg` from the list above — but not before `1996/`
stops referencing it in ten files.

The landing's copy of `css/*.css`, `js/main.js` and `js/translations/common.js`
is now trimmed to what one page renders: the contact form, gallery, lightbox,
nav and back-to-top all went with the September sweep. Copying from a sibling
repository will bring those back. Trim them again for this one.

## Two rules worth knowing before you redesign

Everything else about how a site looks is yours to change. These two are not
preferences — they are things that will cost you an afternoon if you learn them
the hard way.

### The brand colours cannot be text on a light ground

Measured contrast against each candidate ground:

| | on ink `#0a0a0a` | on cream `#faf9f5` | on white |
|---|---|---|---|
| yellow `#fee440` | **15.45** — body text | 1.22 — unusable | 1.28 — unusable |
| flame `#ff3b1f` | **5.56** — body text | 3.38 — large only | 3.56 — large only |

On dark, both work as ink and yellow is the natural text accent. **On light,
neither can set body text.** Yellow can only be a fill with ink knocked out of
it; flame is limited to 24px+ or 19px-bold, so headings and large UI only.

A light-ground site that wants yellow emphasis has to invent a fill-based
device. That is not a style choice, it is the only option left.

### Do not recolour the logo

`tf-pc-logo-transparent.svg` is drawn artwork carrying three colours — a
near-black body, a white screen and a yellow smiley. Treating it as a
silhouette destroys the screen and the face. A CSS `filter: brightness(0)`
turns it into a black blob; this has been tried.

Use the all-yellow variant only over a dark ground, where it reads.

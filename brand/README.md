# The brand layer

These files are shared, by hand, with the consulting and studio repositories.

```
css/tokens.css  css/base.css  css/components.css  css/layout.css
js/main.js  js/lang-boot.js  js/translations/common.js
tools/i18n.js
```

They keep their normal paths rather than moving into this folder — moving them
would break every relative reference for no benefit. This file is a label for
the set, not a directory they live in.

## The rule

**The CSS and JS are starting points and are expected to diverge.** Consulting
and Studio are separate businesses and are being redesigned to look different.
Do not try to keep `components.css` or `layout.css` in step across the three
repositories — they are copied precisely so each site can change them freely.

**The colour values in `tokens.css` are the umbrella.** Keep those in step by
hand, on the rare occasions they change. That is what makes three
different-looking sites read as one brand.

The landing's copy of `css/*.css`, `js/main.js` and `js/translations/common.js`
is trimmed to what one page renders: the contact form, gallery, lightbox, nav
and back-to-top all went with the September sweep. Copying from a sibling
repository will bring those back. Trim them again for this one.

## A rule worth knowing before you redesign

Everything else about how a site looks is yours to change. This one is not a
preference — it is something that will cost you an afternoon if you learn it
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

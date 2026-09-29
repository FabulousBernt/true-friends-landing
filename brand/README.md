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

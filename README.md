# True Friends — landing

`truefriends.se`

The brand umbrella. One page pointing at the two businesses, plus TF Classic and
the redirect stubs for every URL that existed before the split. TF Classic is not
linked from the landing page — the nav button across to it was removed while its
future is undecided — but it is still here and still reachable by URL.

A hand-written static site: no build step, no package manager, no framework.

## Running it

```sh
python3 -m http.server 8803
```

## Structure

```
index.html            the landing page
1996/                 TF Classic — Windows 95 and Navigator 3
consulting.html       redirect stub -> consulting.truefriends.se
studio.html           redirect stub -> studio.truefriends.se
reference-cases/      redirect stubs, one per case
cv/  img/team/  img/reference-cases/  img/gallery/
                      borrowed by TF Classic, see below
brand/README.md       what is shared with the other two sites
tools/check-stubs.sh  verifies every redirect stub
```

## TF Classic borrows a lot

`1996/` is not self-contained. It reaches out of its own folder for the team
photo, both CVs, every reference-case image and the whole 9.7 MB gallery — about
11.8 MB of content that otherwise belongs to the consulting and studio sites.
The gallery paths are built in JavaScript (`SHARED + "img/gallery/"` in
`1996/js/win95.js`), so nothing static reveals them.

**Consequence:** adding a photograph to the studio gallery means adding it here
too if TF Classic should show it, and updating `GALLERY_IMAGES` in both
`js/main.js` on the studio site and `1996/js/win95.js` here.

The alternative is pointing `SHARED` at `https://studio.truefriends.se/` and
deleting the copy — 9.7 MB and the drift saved, at the cost of TF Classic's
gallery depending on another site being up. The split chose the copy; it is
reversible.

## Checking your work

```sh
./tools/check-stubs.sh
node tools/check-links.js .
node tools/i18n.js check
node tools/check-css.js
```

`check-css.js` is the one that knows whether the stylesheets still describe this
page: it fails on a class rule `index.html` never uses, on a custom property
nothing reads, and on any colour left in `--gradient-hero`. It is the only check
that would have noticed the September sweep deleting one rule too many.

The link checker cannot see paths built in JavaScript, and it does not read CSS
`url()` at all. That is how the 1996 gallery was missed once already, and why
the CSS-only references are worth an eyeball in the console.

## History

Split out of `true-friends-website` on 2026-09-29, which remains the archive for
everything before that date.

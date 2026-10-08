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

## The hero backdrop is a video

`img/hero-bg-loop.webm` and `img/hero-bg-poster.webp`. Ten seconds of a blue
glowing ribbon on near-black, looping, sitting in the layer the chrome still
photograph used to occupy. The poster is frame 0 of the same file, so the
no-video fallback is the artwork rather than a different picture.

**Not a GIF, and not by preference.** This footage is smooth gradients, and a
GIF's 256-colour palette with dithering is the worst possible encoder for
smooth gradients — it bands across exactly the dark-blue falloff the whole image
is made of, before the file size even comes up. Measured here: an H.264 encode
at 369KB bands visibly at 4× magnification, and the VP9 at 2.3MB does not.

VP9 and nothing else, no second `<source>`. A browser that cannot play VP9
(Safari before 14) gets the poster, which is the intended degradation rather
than a banded fallback.

Encoded from `14483720_1920_1080_30fps.mp4`, which is **not in this
repository** — it is 125MB and it lives wherever the original was downloaded.
At 1920x1080/30 with a 105 Mbps bitrate it is not a web asset in any form; the
shipped file is two thirds of the width, two thirds of the frame rate, and a
fortieth of the bitrate.

1280x720 rather than the 960x540 this started at, because object-fit: cover
upscales it 2× on a 1080p screen and 3.6× on a 3440px one, and the
difference is 1.3MB to 2.3MB. The extra resolution buys nothing visible on the
smooth gradients — the sparkle texture in the ribbon is the only thing it
sharpens — but it was asked for and it is not expensive.

```sh
ffmpeg -i 14483720_1920_1080_30fps.mp4 \
  -vf "scale=1280:720:flags=lanczos,fps=20" -an \
  -c:v libvpx-vp9 -crf 44 -b:v 1400k -row-mt 1 -cpu-used 4 -deadline good \
  -pix_fmt yuv420p img/hero-bg-loop.webm

# poster = frame 0 exactly, so there is no jump at the handover
ffmpeg -i 14483720_1920_1080_30fps.mp4 \
  -vf "select=eq(n\,0),scale=1280:720:flags=lanczos" -frames:v 1 /tmp/poster.png
cwebp -q 72 -m 6 -sharp_yuv /tmp/poster.png -o img/hero-bg-poster.webp
```

`-an` because there is no audio track and `muted` is then not a policy but a
statement of fact — though `muted` still has to be in the markup either way, as
both iOS and Android refuse to autoplay a video element without it.

**The loop is real.** Frame 0 against frame 299, which is what a wrap-around
costs, is 33.5dB PSNR; two adjacent frames mid-clip are 34.5dB and 35.6dB. So
the seam is roughly one frame's worth of change and `loop` is invisible.

**Dimmed to the same 0.4 the chrome still used**, on the same reasoning: the
bright edge swallows body text. The measured table is on the rule in
`css/layout.css`. Short version — 0.4 is the highest opacity at which nothing in
the loop falls under 4.5:1 against `--color-text`, and the worst pixel lands at
4.98:1, the identical figure the chrome reached at the identical value.

**`autoplay` is not in the markup and `preload="none"` is.** `js/main.js` calls
`play()` only when the reader has not set `prefers-reduced-motion: reduce`. A
reader who asked for reduced motion is therefore never made to download 2.3MB in
order to be shown the 228KB poster that is already there — verified: with
reduced motion emulated, the page fetches the poster and no media request is
made at all. With JavaScript off, the poster is the whole of it.

## The wordmark is chrome, and its dark stop is not black

`.hero__name` is painted with a `background-clip: text` gradient rather than set
in a colour, so the metal is in the glyphs and the text itself is still real text
— it is the h1's accessible name, the site's own name, and it has to stay
selectable and readable by a screen reader.

It is wrapped in `@supports ((-webkit-background-clip: text) or (background-clip:
text))` because the failure mode is not a plainer wordmark, it is **no**
wordmark: `color: transparent` outside a block that `background-clip` actually
applies is an invisible h1 and an unnameable page. A browser without support
keeps `--color-text-strong`.

**The gradient's floor is #8b98ab, which is a measured number and then a
judgement on top of it.** The usual chrome recipe bottoms out at near-black, and
near-black is invisible here: the ground is `#0a0a0a` with the video over it.
Measured by hiding the element and sampling the backdrop behind it at 56 points
across the loop, the brightest pixel that ever passes behind these letters is
L 0.0235, at t=5.1s, where the ribbon's edge swings closest. Against that:

| stop | L | contrast | |
|---|---|---|---|
| `#3d4753` | 0.0612 | 1.51:1 | the recipe's floor — fails |
| `#55606f` | 0.1144 | 2.24:1 | fails |
| `#6d7b8d` | 0.1934 | 3.31:1 | clears 3:1 — **where it started** |
| **`#8b98ab`** | **0.3089** | **4.88:1** | **where it is now** |

It sat at `#6d7b8d` first, which was the darkest value clearing 3:1 — the bar for
large text, and this is 29.6px of type. That met the number and looked like a
shadow with a chrome gradient laid over it rather than like metal. A tube
photographed against a dark room does not have a black side: it picks up ambient
light, and its dark band is a mid grey. `#8b98ab` is that grey, and the whole
lower half of the ramp came up with it rather than one stop being lifted out of a
still-heavy gradient.

Note the floor is specific to *this* backdrop at *this* opacity. Darkening the
video layer or lightening the page ground moves it, and re-measuring is a browser
run rather than a calculation.

## The lockup's three gaps are even

`.hero__name`, `.hero__lede` and `.hero__cta` were spaced on a golden-ratio scale,
`1 : 1.618 : 2.618` of `--rhythm`. That is a scale, and a scale in the gaps is not
the same thing as a gap. Measured as **ink** — baseline plus the font's own ascent
and descent, not box to box — they came out:

| viewport | artwork→name | name→lede | lede→buttons | spread |
|---|---|---|---|---|
| 1920×1080 | 23.4 | 43.3 | 57.0 | 33.6 |
| 1024×667 | 17.3 | 30.9 | 41.8 | 24.5 |
| 390×844 | 15.0 | 27.6 | 35.7 | 20.7 |

Very nearly 1 : 2 : 2.4. Nobody spaces a lockup on purpose like that, and the eye
reads the last step as the buttons having been pushed away from the mark.

They are now `1.8 / 1.4 / 1.7` of the rhythm, and the worst spread across
seventeen viewports from 320×568 to 1920×1080 is **1.4px**, mean 0.8px.

They cannot all be one number, because each block hides slack the eye does not
count as space — the name's line box carries ascent above the caps and descent
below the baseline, and the lede's `line-height: 1.6` puts half a leading above
and below the text. Subtracting each margin from its ink gap gives back the slack
that has to be taken out. The three multiples are fitted to that, so they are
approximations of ~1.83 / ~1.40 / ~1.74, and the residual is under 2px.

All three are shorter than the scale they replaced, so the lockup is 3 to 6px
shorter rather than taller — which is why 320×568 and 360×640, the two viewports
that overflow, both came down by 4px.

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

`img/landing-hero-bg.webp` — 403KB — is **no longer referenced by anything.** It
was the hero still and the `<link rel="preload">` that went with it; the video's
poster replaced both. It is left in place rather than deleted, because deleting a
tracked asset is not this repository's decision to make quietly. Delete it when
you are sure.

## History

Split out of `true-friends-website` on 2026-09-29, which remains the archive for
everything before that date.

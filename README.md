# True Friends — landing

`truefriends.se`

The brand umbrella. One page pointing at the two businesses.

A hand-written static site: no build step, no package manager, no framework.

## Running it

```sh
python3 -m http.server 8803
```

## Structure

```
index.html            the landing page
css/                  tokens, base, components, layout
js/                   language boot, page behaviour, translations
img/                  favicon, hero artwork, hero video and poster
tools/                link, i18n and CSS checks
brand/README.md       what is shared with the other two sites
```

## The hero backdrop is a video

`img/hero-bg-loop.webm` (1.97MB, 1280x720, 19 seconds) and
`img/hero-bg-poster.webp` (73KB). Monochrome smoke drifting through itself,
looping, sitting in the layer the chrome still photograph used to occupy. The
poster is frame 0 of the same file, so the no-video fallback is the artwork
rather than a different picture.

**Not a GIF, and not by preference.** This footage is smooth greyscale gradient
in motion, which is what a 256-colour palette with dithering mangles first: it
bands the soft passages and dithers the thin wisps, before the file size even
comes up.

VP9 and nothing else, no second `<source>`. A browser that cannot play VP9
(Safari before 14) gets the poster, which is the intended degradation rather
than a banded fallback.

Encoded from a master that is not in this repository: 80 seconds, 1920x1080 at
24fps, 57MB, with an AAC track — larger than everything else here combined.
None of that ships. The clip is cut to a 20-second window starting at 0:20 —
long enough that the loop does not announce itself, short enough that 38dB PSNR
fits inside 1.97MB — and the shipped file is four ninths of the pixels, five
sixths of the frame rate, and no audio at all.

1280x720 rather than the 960x540 this started at, because object-fit: cover
upscales it 2× on a 1080p screen and 3.6× on a 3440px one. On this footage the
resolution is spent on the thin wisps, which are where the detail is; the soft
areas compress to nothing either way.

```sh
ffmpeg -ss 20 -t 20 -i master.mp4 \
  -filter_complex "
    [0:v]scale=1280:720:flags=lanczos,fps=20,split=3[a][b][c];
    [a]trim=0:1.0,setpts=PTS-STARTPTS[head];
    [b]trim=19.0:20.0,setpts=PTS-STARTPTS[tail];
    [c]trim=1.0:19.0,setpts=PTS-STARTPTS[mid];
    [head][tail]blend=all_expr='A*(T/1.0)+B*(1-T/1.0)'[xf];
    [xf][mid]concat=n=2:v=1:a=0[out]" \
  -map "[out]" -an \
  -c:v libvpx-vp9 -crf 46 -b:v 1200k -row-mt 1 -cpu-used 4 -deadline good \
  -pix_fmt yuv420p img/hero-bg-loop.webm

# poster = frame 0 exactly, so there is no jump at the handover
ffmpeg -i img/hero-bg-loop.webm -vf "select=eq(n\,0)" -frames:v 1 /tmp/poster.png
cwebp -q 72 -m 6 -sharp_yuv /tmp/poster.png -o img/hero-bg-poster.webp
```

`-an` because the source's audio track is not part of the artwork, and `muted` is
then a statement of fact rather than a policy — though `muted` still has to be in
the markup either way, as both iOS and Android refuse to autoplay a video
element without it.

**The loop is a dissolve, because the footage does not line up with itself.**
Two adjacent frames are 38.3dB apart, ten seconds of drift is 16.6dB, and the
window's first frame against its last is 16.1dB — by twenty seconds the smoke
has become a different picture, and a hard cut there would read as a jump. So
the last second is crossfaded into the first, and the join a viewer actually
reaches is the wrap, which is temporally continuous: 39.5dB, indistinguishable
from any other frame step.

**Dimmed to 0.5**, one step up from the 0.4 the two backdrops before it used,
because this clip is much darker than either: composited mean luminance 0.0065
at 0.5, against the ribbon's 0.0078 at 0.4 and the foliage's 0.0154. Carrying
the same number over would have made it nearly invisible. At 0.5 it clears
4.5:1 before the scrim (4.51:1, 0.00% under) and comfortably after it (6.51:1,
0.00% under). The full table is on the rule in `css/layout.css`.

**`autoplay` is not in the markup and `preload="none"` is.** `js/main.js` calls
`play()` only when the reader has not set `prefers-reduced-motion: reduce`. A
reader who asked for reduced motion is therefore never made to download 2MB in
order to be shown the 73KB poster that is already there — verified: with
reduced motion emulated, the page fetches the poster and no media request is
made at all. With JavaScript off, the poster is the whole of it.

## The wordmark is cream, and it has no floor to defend

`.hero__name` is set in `--color-cream` (#faf9f5), the same cream the lede and
the buttons wear, and it is a flat fill: no `background-clip: text`, no
gradient, no `@supports` guard. It wore the chrome gradient — floor `#8b98ab`,
measured against the backdrop behind it at every point in the loop, plus a
drop-shadow holding the metal off the moving video — until it was set in the
lede's cream instead, which took both with it. A flat fill needs neither the
clip nor the guard that kept the gradient from failing into an invisible h1, and
the measurement below is why the shadow could go.

The measurement: cream at L 0.9467 against the brightest pixel that ever passes
behind these letters, composited the way the page composites it (twelve frames
of the loop at 0.5 over the gradient, then the scrim — the same compositing the
table in `css/layout.css` uses), sampled in the band the name actually occupies:

| where the pixels come from | brightest L | cream vs it |
|---|---|---|
| the name's own band, y36–46% x25–75% | 0.0555 | 9.44:1 |
| a wider band, y30–52% x10–90% | 0.0764 | 7.89:1 |
| the whole frame | 0.0789 | 7.73:1 |

Body text against that same worst pixel is 6.51:1, so the wordmark sits above
the body rather than with it, and there is no dark stop to defend. The figure is
still specific to *this* backdrop at *this* opacity: darkening the video layer
or lightening the page ground moves it, and re-measuring after either is a
browser run rather than a calculation.

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

## Checking your work

```sh
node tools/check-links.js .
node tools/i18n.js check
node tools/check-css.js
```

`check-css.js` is the one that knows whether the stylesheets still describe this
page: it fails on a class rule `index.html` never uses, on a custom property
nothing reads, and on any colour left in `--gradient-hero`. It is the only check
that would have noticed the September sweep deleting one rule too many.

The link checker cannot see paths built in JavaScript, and it does not read CSS
`url()` at all, so the CSS-only references are worth an eyeball in the console.

## History

Split out of `true-friends-website` on 2026-09-29, which remains the archive for
everything before that date. The redirect stubs, the reference cases, the CVs
and TF Classic were removed on 2026-10-28, leaving the landing page alone.

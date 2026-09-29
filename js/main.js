/* True Friends — page behavior
 * Translations, mobile nav, accordion, modal, forms.
 */
(function () {
  "use strict";

  /* ====================================================================
   * i18n
   * ==================================================================== */

  const SUPPORTED = ["en", "sv"];
  const DEFAULT_LANG = "en";
  const STORAGE_KEY = "tf_lang";

  const getNested = (obj, path) =>
    path
      .split(".")
      .reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);

  // Substituted into any translation string containing `{year}` — used for
  // the footer copyright so it rolls over automatically on New Year's Eve.
  const CURRENT_YEAR = new Date().getFullYear();
  const substitute = (s) => s.replace("{year}", CURRENT_YEAR);

  // Current language, exposed so other modules below can read it
  let currentLang = DEFAULT_LANG;

  /**
   * Look up a translation key in the active language, with English fallback.
   * Supports {placeholder} substitution via the params object.
   */
  function t(key, params) {
    const dicts = window.TF_TRANSLATIONS || {};
    let value = getNested(dicts[currentLang], key);
    if (value === undefined) value = getNested(dicts[DEFAULT_LANG], key);
    if (typeof value !== "string") return key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(`{${k}}`, String(v));
      }
    }
    return value;
  }

  function applyTranslations(lang) {
    const dict = (window.TF_TRANSLATIONS || {})[lang];
    if (!dict) {
      // No dictionary to apply — reveal rather than sit behind the veil.
      document.documentElement.removeAttribute("data-tf-translating");
      return;
    }
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const v = getNested(dict, el.getAttribute("data-i18n"));
      if (typeof v === "string") el.textContent = substitute(v);
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const v = getNested(dict, el.getAttribute("data-i18n-html"));
      if (typeof v === "string") el.innerHTML = substitute(v);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const v = getNested(dict, el.getAttribute("data-i18n-placeholder"));
      if (typeof v === "string") el.setAttribute("placeholder", v);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const v = getNested(dict, el.getAttribute("data-i18n-aria-label"));
      if (typeof v === "string") el.setAttribute("aria-label", v);
    });
    document.querySelectorAll("[data-i18n-content]").forEach((el) => {
      const v = getNested(dict, el.getAttribute("data-i18n-content"));
      if (typeof v === "string") el.setAttribute("content", v);
    });
    document.querySelectorAll("[data-i18n-href]").forEach((el) => {
      const v = getNested(dict, el.getAttribute("data-i18n-href"));
      if (typeof v === "string") el.setAttribute("href", v);
    });
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const v = getNested(dict, el.getAttribute("data-i18n-alt"));
      if (typeof v === "string") el.setAttribute("alt", v);
    });
    // The section heroes set their page name as drawn artwork rather than
    // type, so translating one means swapping the file, not the string.
    document.querySelectorAll("[data-i18n-src]").forEach((el) => {
      const v = getNested(dict, el.getAttribute("data-i18n-src"));
      if (typeof v === "string" && el.getAttribute("src") !== v) {
        el.setAttribute("src", v);
      }
    });


    // Language switcher button state
    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.setAttribute(
        "aria-pressed",
        String(btn.getAttribute("data-lang") === lang),
      );
    });

    // lang-boot.js hid the page so the English markup would not flash before
    // this ran. It has run.
    document.documentElement.removeAttribute("data-tf-translating");
  }

  /**
   * English is the default for everyone. The only thing that changes it is
   * the visitor picking SV from the switcher, which is stored in
   * localStorage and so carries across pages and return visits until they
   * pick EN again.
   *
   * There is deliberately no locale guessing here — no IP lookup, no
   * navigator.language. A Swedish-speaking visitor abroad, or an English
   * speaker in Sweden, both got the wrong page under that scheme, and the
   * IP lookup also meant a network round-trip that could swap the language
   * out from under someone after first paint.
   */
  function detectLanguageSync() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED.includes(stored)) return stored;
    } catch (e) {} // storage blocked — fall through to the default
    return DEFAULT_LANG;
  }

  // Applied immediately so the first paint is already in the right language.
  applyTranslations(detectLanguageSync());

  // Language switcher (desktop + drawer)
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      if (!SUPPORTED.includes(lang)) return;
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {}
      applyTranslations(lang);
    });
  });

  // A page restored from the browser's back/forward cache keeps its frozen DOM
  // and JS state — none of the code above re-runs. So a language picked on
  // another page in the meantime would never reach this page when the user
  // navigates back to it. Re-read the stored choice and re-apply if it moved.
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    const lang = detectLanguageSync();
    if (lang !== currentLang) applyTranslations(lang);
  });

  /* ====================================================================
   * Mobile nav
   * ==================================================================== */
  const nav = document.getElementById("site-nav");
  const toggle = nav && nav.querySelector(".nav__toggle");

  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });

    nav.querySelectorAll(".nav__drawer a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ====================================================================
   * Service accordion: single-open behavior
   * ==================================================================== */
  const serviceItems = document.querySelectorAll(".service-item");
  serviceItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        serviceItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ====================================================================
   * Gallery: full listing + lightbox
   *
   * To add a photo: drop the file into img/gallery/, run
   * `bash tools/make-thumbs.sh`, and add its filename to the
   * GALLERY_IMAGES array below. Every photo renders in array order
   * as one tile — the listing shows the whole directory at once, the way
   * `ls` does, and `loading="lazy"` keeps offscreen rows off the wire.
   * ==================================================================== */
  const GALLERY_IMAGES = [
    "01.webp",
    "02.webp",
    "03.webp",
    "04.webp",
    "05.webp",
    "06.webp",
    "07.webp",
    "08.webp",
    "09.webp",
    "10.webp",
    "11.webp",
    "12.webp",
    "13.webp",
    "14.webp",
    "15.webp",
    "16.webp",
    "17.webp",
    "18.webp",
    "19.webp",
    "20.webp",
    "21.webp",
    "22.webp",
    "23.webp",
    "24.webp",
    "25.webp",
    "26.webp",
    "27.webp",
    "28.webp",
    "29.webp",
    "30.webp",
    "31.webp",
    "32.webp",
    "33.webp",
    "34.webp",
    "35.webp",
    "36.webp",
    "37.webp",
    "38.webp",
    "39.webp",
    "40.webp",
    "41.webp",
    "42.webp",
  ];

  const gallery = document.querySelector(".gallery");
  const lightbox = document.getElementById("gallery-lightbox");

  if (gallery && lightbox) {
    // Two sources per photo: a 400px square thumbnail for the grid and the
    // lightbox strip, and the full-size file, which is only fetched once the
    // lightbox opens. Thumbnails are built by tools/make-thumbs.sh.
    const photos = GALLERY_IMAGES.map((file, i) => ({
      full: `img/gallery/${file}`,
      thumb: `img/gallery/thumbs/${file}`,
      alt: `Gallery photo ${i + 1}`,
    }));

    // If a file is missing, hide the broken <img> so the tile's CSS
    // placeholder background shows through cleanly.
    const hideIfBroken = (img) =>
      img.addEventListener(
        "error",
        () => {
          img.style.display = "none";
        },
        { once: true },
      );

    const grid = gallery.querySelector(".gallery__grid");
    photos.forEach((photo, i) => {
      const li = document.createElement("li");
      li.className = "gallery__item";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery__tile";
      btn.dataset.index = String(i);
      btn.setAttribute("aria-label", `Open photo ${i + 1} in lightbox`);

      const img = document.createElement("img");
      hideIfBroken(img);
      img.src = photo.thumb;
      img.alt = photo.alt;
      img.setAttribute("loading", "lazy");

      btn.appendChild(img);

      li.appendChild(btn);
      grid.appendChild(li);
    });

    const tiles = Array.from(gallery.querySelectorAll(".gallery__tile"));

    /* ---------- Lightbox ---------- */
    const lbImage = lightbox.querySelector(".lightbox__image");
    const lbCaption = lightbox.querySelector(".lightbox__caption");
    const lbThumbs = lightbox.querySelector("[data-lightbox-thumbs]");
    const lbPrev = lightbox.querySelector("[data-lightbox-prev]");
    const lbNext = lightbox.querySelector("[data-lightbox-next]");
    const lbClose = lightbox.querySelector("[data-lightbox-close]");

    // Build the thumbnail strip once
    photos.forEach((photo, idx) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lightbox__thumb";
      btn.dataset.index = String(idx);
      btn.setAttribute("aria-label", `Photo ${idx + 1}`);
      const img = document.createElement("img");
      hideIfBroken(img);
      img.src = photo.thumb;
      img.alt = "";
      img.setAttribute("loading", "lazy");
      btn.appendChild(img);
      li.appendChild(btn);
      lbThumbs.appendChild(li);
    });

    lbImage.addEventListener("error", () => {
      lbImage.style.visibility = "hidden";
    });
    lbImage.addEventListener("load", () => {
      lbImage.style.visibility = "";
    });

    let activeIndex = 0;
    const showPhoto = (index) => {
      activeIndex = (index + photos.length) % photos.length;
      const photo = photos[activeIndex];
      // A fresh src leaves the previous frame painted until the new one
      // decodes, so blank the element before swapping — otherwise reopening
      // the lightbox flashes whichever photo was shown last. Anything already
      // in cache is revealed in the same tick, so there is no blink.
      lbImage.style.visibility = "hidden";
      lbImage.src = photo.full;
      if (lbImage.complete && lbImage.naturalWidth) lbImage.style.visibility = "";
      lbImage.alt = photo.alt;
      lbCaption.textContent = `${activeIndex + 1} / ${photos.length}`;
      lbThumbs.querySelectorAll(".lightbox__thumb").forEach((thumb, i) => {
        const isActive = i === activeIndex;
        thumb.setAttribute("aria-current", String(isActive));
        if (isActive)
          thumb.scrollIntoView({ inline: "center", block: "nearest" });
      });
    };

    const openLightbox = (index) => {
      showPhoto(index);
      if (typeof lightbox.showModal === "function") lightbox.showModal();
      else lightbox.setAttribute("open", "");
    };

    // Tile click → open at that photo's index
    tiles.forEach((tile) => {
      tile.addEventListener("click", () => {
        openLightbox(parseInt(tile.dataset.index, 10) || 0);
      });
    });

    lbPrev.addEventListener("click", () => showPhoto(activeIndex - 1));
    lbNext.addEventListener("click", () => showPhoto(activeIndex + 1));
    lbClose.addEventListener("click", () => lightbox.close());

    lbThumbs.addEventListener("click", (event) => {
      const thumb = event.target.closest(".lightbox__thumb");
      if (thumb) showPhoto(parseInt(thumb.dataset.index, 10) || 0);
    });

    // Backdrop click closes (clicking the dialog element itself, not its inner box)
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) lightbox.close();
    });

    // Keyboard: ←/→ navigate while open; Esc closes (native dialog handles Esc)
    document.addEventListener("keydown", (event) => {
      if (!lightbox.open) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPhoto(activeIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showPhoto(activeIndex + 1);
      }
    });
  }

  /* ====================================================================
   * Back-to-top button
   * Reveals after the user scrolls past ~60% of the viewport.
   * ==================================================================== */
  const backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    backToTop.hidden = false;
    const threshold = () => window.innerHeight * 0.6;
    const updateVisibility = () => {
      backToTop.setAttribute(
        "data-visible",
        String(window.scrollY > threshold()),
      );
    };
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ====================================================================
   * Modal
   * ==================================================================== */
  document.querySelectorAll("[data-modal-open]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      const id = trigger.getAttribute("data-modal-open");
      const dialog = document.getElementById(id);
      if (dialog && typeof dialog.showModal === "function") {
        dialog.showModal();
      } else if (dialog) {
        dialog.setAttribute("open", "");
      }
    });
  });

  document.querySelectorAll("[data-modal-close]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      const dialog = trigger.closest("dialog");
      if (dialog) dialog.close();
      const status = dialog.querySelector(".form__status");
      if (status) {
        status.textContent = "";
      }
    });
  });

  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  /* ====================================================================
   * Forms — sanitization, rate limit, submit
   * ==================================================================== */

  const MAX_LENGTHS = {
    firstName: 50,
    lastName: 50,
    email: 254,
    message: 2000,
  };

  const sanitizeSingleLine = (value) =>
    String(value)
      .replace(/[\r\n\t\0\x00-\x1F\x7F]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const sanitizeMultiline = (value) =>
    String(value)
      .replace(/\r\n/g, "\n")
      .replace(/[\0\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      .trim();

  const sanitizePayload = (raw) => {
    const out = {};
    for (const [key, val] of Object.entries(raw)) {
      const capped = String(val).slice(0, MAX_LENGTHS[key] || 5000);
      out[key] =
        key === "message"
          ? sanitizeMultiline(capped)
          : sanitizeSingleLine(capped);
    }
    return out;
  };

  const RATE_LIMIT_MS = 10_000;

  document.querySelectorAll("form[data-endpoint]").forEach((form) => {
    const status = form.querySelector(".form__status");
    const submitBtn = form.querySelector('button[type="submit"]');
    let lastSubmitAt = 0;

    const setStatus = (text, state) => {
      if (!status) return;
      status.textContent = text;
      if (state) status.setAttribute("data-state", state);
      else status.removeAttribute("data-state");
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const now = Date.now();
      if (now - lastSubmitAt < RATE_LIMIT_MS) {
        const wait = Math.ceil((RATE_LIMIT_MS - (now - lastSubmitAt)) / 1000);
        setStatus(t("status.rateLimited", { wait }), "error");
        return;
      }

      if (!form.reportValidity()) return;

      const endpoint = form.dataset.endpoint;
      if (!endpoint) {
        setStatus(t("status.notConfigured"), "error");
        return;
      }

      const raw = Object.fromEntries(new FormData(form).entries());

      // Honeypot — silently succeed if a bot filled the hidden field
      if (raw._honey && String(raw._honey).trim() !== "") {
        form.reset();
        setStatus(t("status.success"), "success");
        lastSubmitAt = now;
        return;
      }

      const userKeys = ["firstName", "lastName", "email", "message"];
      const sanitized = sanitizePayload(
        Object.fromEntries(userKeys.map((k) => [k, raw[k] ?? ""])),
      );
      const payload = { ...raw, ...sanitized };
      delete payload._honey;

      submitBtn.disabled = true;
      setStatus(t("status.sending"));
      lastSubmitAt = now;

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.success !== "false") {
          form.reset();
          setStatus(t("status.success"), "success");
        } else {
          setStatus(data.message || t("status.error"), "error");
        }
      } catch (err) {
        setStatus(t("status.network"), "error");
      } finally {
        submitBtn.disabled = false;
      }
    });
  });
})();

/* True Friends — page behavior
 *
 * Translations, and nothing else. The mobile nav, service accordion, gallery
 * and lightbox, back-to-top button, contact modal and form pipeline all went
 * with the pages that moved to consulting.truefriends.se and studio.truefriends.se
 * at the split. Every one of them was already inert: the accordion and the forms
 * bind through querySelectorAll, the rest sit behind an `if (element)` guard
 * for markup that is not in this document. So removing 400 lines changed nothing
 * about how the page behaves.
 */
(function () {
  "use strict";

  /* ====================================================================
   * i18n
   *
   * The footer switcher is the only control here, and it is the only route to
   * the Swedish strings: detectLanguageSync deliberately does no locale
   * guessing, so there is no automatic fallback.
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

  let currentLang = DEFAULT_LANG;

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
  // and JS state — none of the code above re-reuns. So a language picked on
  // another page in the meantime would never reach this page when the user
  // navigates back to it. Re-read the stored choice and re-apply if it moved.
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    const lang = detectLanguageSync();
    if (lang !== currentLang) applyTranslations(lang);
  });

  // The hero backdrop video.
  //
  // It is not autoplayed from the markup and it is not preloaded: both are on
  // this side of the decision, so a reader who asked for reduced motion is never
  // made to download 1.3MB of video in order to be shown the poster that is
  // already sitting there. The poster is the first frame of the loop, so "does
  // not play" and "plays" are the same picture at different times rather than
  // two different pictures.
  //
  // matchMedia is read once and not watched. A reader who turns reduced motion on
  // while the page is open has already got the video by then, and stopping it
  // mid-loop is a worse answer than letting it finish — the switch is about the
  // page as a whole, not about this element.
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll("video[data-hero-video]").forEach((video) => {
      // play() rejects when the browser refuses autoplay — Low Power Mode on
      // iOS, a data-saver extension, a locked-down embed. The poster is the
      // fallback in every one of those cases, so there is nothing to do but not
      // throw an unhandled rejection at the console.
      video.play().catch(() => {});
    });
  }
})();


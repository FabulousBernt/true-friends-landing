/* True Friends — language boot
 *
 * The pages ship as English: the text inside every data-i18n element is the
 * English string, so an English visitor gets a correct first paint for free.
 * A visitor who picked Svenska is a different story. The translation pass
 * lives in a deferred script, and a browser is free to paint before deferred
 * scripts run — so Swedish visitors caught a frame of English first.
 *
 * This runs ahead of everything, as a blocking script in <head>. There is no
 * body yet, so it cannot translate anything; what it can do is work out
 * whether the markup is about to be rewritten and, if so, hold the first
 * paint until it has been. English visitors are never held back.
 *
 * It lives in its own file rather than an inline snippet because the pages
 * set `script-src 'self'`. A same-origin file satisfies that as it stands; an
 * inline snippet would need a hash kept in step by hand on every page.
 */
(function () {
  "use strict";

  var SUPPORTED = ["en", "sv"];
  var MARKUP_LANG = "en"; // the language the HTML is written in
  var STORAGE_KEY = "tf_lang";

  // If the translation pass never arrives — script blocked, a dictionary that
  // failed to load, a parse error — the page must not stay hidden. Reveal on
  // a timer; English is a far better outcome than a blank page.
  var FAILSAFE_MS = 1500;

  var lang = MARKUP_LANG;
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED.indexOf(stored) !== -1) lang = stored;
  } catch (e) {} // storage blocked — English it is

  if (lang === MARKUP_LANG) return;

  var root = document.documentElement;
  root.lang = lang;
  root.setAttribute("data-tf-translating", "");
  window.setTimeout(function () {
    root.removeAttribute("data-tf-translating");
  }, FAILSAFE_MS);
})();

/* ============================================================================
 * True Friends 96 — browser behaviour
 *
 * One file, because the site is one browser. Sections below, in order:
 *   i18n        translation swap, EN/SV, no locale guessing
 *   menus       menu bar and Start menu
 *   window      minimize / maximize / close, taskbar
 *   browser     location bar, history buttons, throbber, progress, status bar
 *   options     Auto Load Images and the three chrome rows, persisted
 *   find        Find in Page, over the document only
 *   gallery     thumbnails and the image viewer
 *   counter     the visitor's own page-view count
 *   dialogs     About / Save / Exit / Read Me / Shortcuts / Document Info
 *   boot        the dial-up handshake, once per session
 *   forms       sanitising, rate limiting, submit
 * ========================================================================= */
(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const body = document.body;
  const pageEl = $(".page");
  /* Every page states where the site root is relative to itself and what its
     canonical address is. The location bar and the URL resolver are built on
     those two facts, so neither has to guess at directory depth. */
  const ROOT = body.dataset.root || "";
  /* Photos, logos and CVs are shared with the 2026 site and live one level
     above the 1996 site's own root, so they get their own prefix. */
  const SHARED = ROOT + "../";
  const SITE_URL = body.dataset.url || "http://www.truefriends.se/";
  const HOST = "www.truefriends.se";
  /* Where the files actually live, e.g. "/1996/". The Location field and the
     status bar both advertise truefriends.se, so the real directory has to be
     stripped off every address before either of them prints it. */
  const SITE_BASE = new URL(ROOT || ".", window.location.href).pathname;

  /** Rewrite a real URL into the address this browser claims to be showing. */
  function asSiteUrl(href) {
    let url;
    try {
      url = new URL(href, window.location.href);
    } catch (e) {
      return href;
    }
    let path = url.pathname;
    if (path.startsWith(SITE_BASE)) path = "/" + path.slice(SITE_BASE.length);
    return `http://${HOST}${path}${url.search}${url.hash}`;
  }

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

  // Substituted into any string containing `{year}` — the footer copyright
  // rolls over on its own that way.
  const CURRENT_YEAR = new Date().getFullYear();
  const substitute = (s) => s.replace("{year}", CURRENT_YEAR);

  /* The links across to the other era name the current year, so they are
     written from the clock rather than typed into the markup. */
  $$("[data-year]").forEach((el) => { el.textContent = String(CURRENT_YEAR); });

  let currentLang = DEFAULT_LANG;

  /** Look up a key in the active language, falling back to English. */
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

  const ATTR_MAP = {
    "data-i18n-placeholder": "placeholder",
    "data-i18n-aria-label": "aria-label",
    "data-i18n-content": "content",
    "data-i18n-href": "href",
    "data-i18n-alt": "alt",
    "data-i18n-title": "title",
  };

  function applyTranslations(lang) {
    const dict = (window.TF_TRANSLATIONS || {})[lang];
    if (!dict) {
      // No dictionary to apply — reveal rather than sit behind the veil.
      document.documentElement.removeAttribute("data-tf-translating");
      return;
    }
    currentLang = lang;
    document.documentElement.lang = lang;

    $$("[data-i18n]").forEach((el) => {
      const v = getNested(dict, el.getAttribute("data-i18n"));
      if (typeof v === "string") el.textContent = substitute(v);
    });
    $$("[data-i18n-html]").forEach((el) => {
      const v = getNested(dict, el.getAttribute("data-i18n-html"));
      if (typeof v === "string") el.innerHTML = substitute(v);
    });
    for (const [dataAttr, target] of Object.entries(ATTR_MAP)) {
      $$(`[${dataAttr}]`).forEach((el) => {
        let v = getNested(dict, el.getAttribute(dataAttr));
        if (typeof v !== "string") return;
        v = substitute(v);
        if (el.getAttribute(target) !== v) el.setAttribute(target, v);
      });
    }

    // Language switchers: the View menu's check items.
    $$("[data-lang]").forEach((el) => {
      el.setAttribute("aria-pressed", String(el.getAttribute("data-lang") === lang));
    });

    // Anything rendered by JS has to be relabelled in the new language too.
    setStatus(null);
    paintTrayDate();
    const count = $("[data-gallery-count]");
    if (count) count.textContent = t("gallery.count", { n: GALLERY_IMAGES.length });

    // lang-boot.js hid the page so the English markup would not flash before
    // this ran. It has run.
    document.documentElement.removeAttribute("data-tf-translating");
  }

  /**
   * English is the default for everyone. The only thing that changes it is
   * the visitor picking Svenska, which is stored in localStorage and so
   * carries across pages and return visits until they pick English again.
   *
   * There is deliberately no locale guessing — no IP lookup, no
   * navigator.language. A Swedish speaker abroad and an English speaker in
   * Sweden both got the wrong page under that scheme.
   */
  function detectLanguageSync() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED.includes(stored)) return stored;
    } catch (e) {} // storage blocked — fall through to the default
    return DEFAULT_LANG;
  }

  function setLanguage(lang) {
    if (!SUPPORTED.includes(lang)) return;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
    applyTranslations(lang);
  }

  document.addEventListener("click", (event) => {
    const el = event.target.closest("[data-lang]");
    if (el) setLanguage(el.getAttribute("data-lang"));
  });

  // A page restored from the back/forward cache keeps its frozen DOM — none
  // of the code above re-runs, so a language picked on another page in the
  // meantime would never reach this one. Re-read and re-apply if it moved.
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    const lang = detectLanguageSync();
    if (lang !== currentLang) applyTranslations(lang);
  });

  /* ====================================================================
   * The tray date
   *
   * Today's day and month, with the year held at 1996 — the clock is real,
   * the calendar is not. Formatted through Intl against the active language
   * so Swedish reads "24 sep 1996" without a table of month names here.
   * ==================================================================== */

  const trayDate = $("[data-tray-date]");

  function paintTrayDate() {
    if (!trayDate) return;
    const now = new Date();
    const then = new Date(1996, now.getMonth(), now.getDate());
    try {
      trayDate.textContent = new Intl.DateTimeFormat(currentLang, {
        day: "numeric", month: "short", year: "numeric",
      }).format(then);
    } catch (e) {
      trayDate.textContent = "1996";
    }
  }

  /* ====================================================================
   * Menu bar + Start menu
   *
   * One open menu at a time, anywhere on the page. Opening any menu closes
   * every other, clicking away closes all, Escape closes and returns focus.
   * ==================================================================== */

  const menuTriggers = $$("[data-menu]");

  function closeAllMenus(except) {
    menuTriggers.forEach((trigger) => {
      if (trigger === except) return;
      const menu = document.getElementById(trigger.getAttribute("data-menu"));
      if (menu) menu.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    });
  }

  menuTriggers.forEach((trigger) => {
    const menu = document.getElementById(trigger.getAttribute("data-menu"));
    if (!menu) return;

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = trigger.getAttribute("aria-expanded") === "true";
      closeAllMenus(trigger);
      menu.hidden = open;
      trigger.setAttribute("aria-expanded", String(!open));
      if (!open) {
        const first = menu.querySelector(".menu__item:not([aria-disabled='true'])");
        if (first) first.focus();
      }
    });

    // Once a menu is open, sliding along the bar switches menus without a
    // second click — exactly how a menu bar has always behaved.
    trigger.addEventListener("mouseenter", () => {
      const anyOpen = menuTriggers.some((m) => m.getAttribute("aria-expanded") === "true");
      if (!anyOpen || trigger.getAttribute("aria-expanded") === "true") return;
      closeAllMenus(trigger);
      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
    });

    // Checkable items stay put while you flip several in a row; everything
    // else dismisses the menu.
    menu.addEventListener("click", (event) => {
      const item = event.target.closest(".menu__item");
      if (item && !item.classList.contains("menu__item--check")) closeAllMenus();
    });
  });

  document.addEventListener("click", () => closeAllMenus());
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const open = menuTriggers.find((m) => m.getAttribute("aria-expanded") === "true");
    if (open) {
      closeAllMenus();
      open.focus();
    }
  });

  /* ====================================================================
   * Window chrome
   * ==================================================================== */

  const setMinimized = (on) => {
    body.classList.toggle("is-minimized", on);
    const btn = $("[data-window='min']");
    if (btn) btn.setAttribute("aria-pressed", String(on));
  };

  $$("[data-window]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-window");
      if (action === "min") {
        setMinimized(!body.classList.contains("is-minimized"));
      } else if (action === "max") {
        const on = !body.classList.contains("is-maximized");
        body.classList.toggle("is-maximized", on);
        btn.setAttribute("aria-pressed", String(on));
        $$("[data-option='maximize']").forEach((o) => o.setAttribute("aria-pressed", String(on)));
      } else if (action === "close") {
        openDialog("dlg-exit");
      }
    });
  });

  // The taskbar button is the only way back once the window is rolled up.
  const task = $(".taskbar__task");
  if (task) task.addEventListener("click", () => setMinimized(false));

  /* ====================================================================
   * Browser: location bar, history, throbber, progress, status
   * ==================================================================== */

  const statusMsg = $("[data-status]");
  const meterFill = $("[data-meter]");
  const locField = $("#location-field");
  const stopBtn = $("[data-nav='stop']");

  let defaultStatus = "";

  /** Passing null restores the resting message, which is language-dependent. */
  function setStatus(text) {
    if (!statusMsg) return;
    if (text === null) {
      defaultStatus = t("ui.status.done");
      statusMsg.textContent = defaultStatus;
    } else {
      statusMsg.textContent = text;
    }
  }

  function setProgress(pct) {
    if (meterFill) meterFill.style.width = `${pct}%`;
  }

  function setLoading(on) {
    body.classList.toggle("is-loading", on);
    if (stopBtn) {
      stopBtn.setAttribute("aria-disabled", String(!on));
      stopBtn.disabled = !on;
    }
  }

  /* The load sequence. Navigator narrated every step of a request because
     over a modem each one could take seconds, and watching the messages was
     how you knew the connection had not died. Here it is theatre, but it is
     the theatre that makes the chrome read as a browser. */
  let loadTimers = [];
  function playLoad() {
    loadTimers.forEach(clearTimeout);
    loadTimers = [];
    setLoading(true);
    const steps = [
      [0, "ui.status.connecting", 8],
      [260, "ui.status.contacted", 34],
      [560, "ui.status.transferring", 72],
      [900, null, 100],
    ];
    steps.forEach(([delay, key, pct]) => {
      loadTimers.push(
        setTimeout(() => {
          setProgress(pct);
          if (key) setStatus(t(key, { host: HOST }));
          else {
            setStatus(null);
            setLoading(false);
            loadTimers.push(setTimeout(() => setProgress(0), 400));
          }
        }, delay),
      );
    });
  }

  function stopLoad() {
    loadTimers.forEach(clearTimeout);
    loadTimers = [];
    setLoading(false);
    setProgress(0);
    setStatus(t("ui.status.stopped"));
  }

  /**
   * Turn whatever was typed in the Location field into somewhere to go.
   *
   * Accepts the full address, the bare host, a path, or just a page name —
   * "http://www.truefriends.se/studio.html", "truefriends.se/studio",
   * "/studio.html" and "studio" all land in the same place. Returns a URL to
   * navigate to, or an error code for the dialog to report.
   */
  const PAGES = {
    "": "index.html",
    "index.html": "index.html",
    "index": "index.html",
    "home": "index.html",
    "start": "index.html",
    "consulting.html": "consulting.html",
    "consulting": "consulting.html",
    "konsult": "consulting.html",
    "studio.html": "studio.html",
    "studio": "studio.html",
    "gallery": "studio.html#gallery",
    "galleri": "studio.html#gallery",
    "photos": "studio.html#gallery",
    "services": "consulting.html#services",
    "about": "consulting.html#about",
    "contact": "consulting.html#contact",
    "guestbook": "consulting.html#contact",
    "kontakt": "consulting.html#contact",
    "cases": "consulting.html#team",
    "reference-cases": "consulting.html#team",
  };

  const CASES = [
    "epiroc", "bufab", "avarn", "kopparbergs-brewery", "ske-kraft", "sectra",
  ];

  function resolveLocation(raw) {
    let input = String(raw).trim();
    if (!input) return { error: "notfound" };

    if (/^mailto:/i.test(input)) return { href: input };

    // Strip the scheme, then the host if one was typed at all.
    input = input.replace(/^[a-z]+:\/\//i, "");
    const slash = input.indexOf("/");
    const maybeHost = (slash === -1 ? input : input.slice(0, slash)).toLowerCase();

    if (/[a-z0-9-]+\.[a-z]{2,}$/i.test(maybeHost)) {
      const known = ["truefriends.se", "www.truefriends.se", "localhost"];
      if (!known.includes(maybeHost.split(":")[0])) return { error: "host", host: maybeHost };
      input = slash === -1 ? "" : input.slice(slash + 1);
    }

    let path = input.replace(/^\/+/, "").toLowerCase();
    const hash = path.includes("#") ? path.slice(path.indexOf("#")) : "";
    if (hash) path = path.slice(0, path.indexOf("#"));
    path = path.replace(/\/+$/, "");

    const caseMatch = path.match(/^(?:reference-cases\/[a-z-]+\/)?([a-z-]+)\.html?$/);
    if (caseMatch && CASES.includes(caseMatch[1])) {
      return { href: `${ROOT}reference-cases/johnny-vigersten/${caseMatch[1]}.html` };
    }
    if (CASES.includes(path)) {
      return { href: `${ROOT}reference-cases/johnny-vigersten/${path}.html` };
    }
    if (path in PAGES) return { href: ROOT + PAGES[path] + hash };

    return { error: "notfound", path: "/" + path };
  }

  const locForm = $("#location-form");
  if (locForm && locField) {
    locForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const result = resolveLocation(locField.value);

      if (result.href) {
        playLoad();
        window.location.href = result.href;
        return;
      }

      // Navigator's two failure modes, and they read very differently: a bad
      // host never resolved, a bad path came back from a server that did.
      const dialog = document.getElementById(
        result.error === "host" ? "dlg-nohost" : "dlg-404",
      );
      const slot = dialog && $("[data-error-url]", dialog);
      if (slot) slot.textContent = result.host || locField.value.trim();
      openDialog(result.error === "host" ? "dlg-nohost" : "dlg-404");
      locField.value = SITE_URL;
    });

    // Clicking into the field selects the whole address, the way it has
    // worked in every browser since.
    locField.addEventListener("focus", () => locField.select());
  }

  $$("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      const action = btn.getAttribute("data-nav");
      if (action === "back") window.history.back();
      else if (action === "forward") window.history.forward();
      else if (action === "reload") { playLoad(); window.location.reload(); }
      else if (action === "stop") stopLoad();
      else if (action === "print") window.print();
      else if (action === "location") {
        if (!locField) return;
        body.classList.remove("hide-location");
        applyOptions();
        locField.focus();
      }
    });
  });

  /* The status bar doubles as the link preview. Printing the destination of
     whatever the pointer is over is the single most browser-ish behaviour
     there is, and it costs two listeners. */
  document.addEventListener("mouseover", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || !statusMsg) return;
    const href = link.getAttribute("href");
    // Show the address this browser advertises, not the one the file is
    // served from — the same rewrite the Location field gets.
    if (href.startsWith("#")) setStatus(SITE_URL + href);
    else setStatus(asSiteUrl(link.href));
  });
  document.addEventListener("mouseout", (event) => {
    if (event.target.closest("a[href]")) setStatus(null);
  });

  // A link click starts a real navigation, so narrate it the way the
  // location bar does.
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || link.hasAttribute("download")) return;
    playLoad();
  });

  /* ====================================================================
   * Options
   *
   * Navigator's Options menu, and the four entries that mattered: the three
   * chrome rows you could hide to win back screen space, and Auto Load
   * Images, which is why people wrote alt text.
   * ==================================================================== */

  const OPTION_KEY = "tf_options";
  const OPTION_CLASS = {
    toolbar: "hide-toolbar",
    location: "hide-location",
    dirbar: "hide-dirbar",
    images: "no-images",
  };

  let options = {};
  try {
    options = JSON.parse(localStorage.getItem(OPTION_KEY) || "{}");
  } catch (e) {
    options = {};
  }

  const optionButtons = $$("[data-option]");

  /**
   * With images off the browser drew a broken-image icon followed by the
   * alt text, which is the whole reason alt text was written carefully. The
   * placeholders are generated from each image's own alt rather than written
   * into the markup, so decorative images (alt="") correctly show nothing.
   */
  function syncAltSlugs(imagesOn) {
    if (!pageEl) return;
    if (imagesOn) {
      $$(".alt-slug[data-generated]", pageEl).forEach((el) => el.remove());
      return;
    }
    $$("img[alt]", pageEl).forEach((img) => {
      const text = img.getAttribute("alt").trim();
      if (!text) return;
      const next = img.nextElementSibling;
      if (next && next.classList.contains("alt-slug")) return;
      const slug = document.createElement("span");
      slug.className = "alt-slug";
      slug.dataset.generated = "true";
      slug.innerHTML =
        '<svg class="i" viewBox="0 0 16 16" aria-hidden="true"><use href="#i-broken"/></svg>';
      slug.appendChild(document.createTextNode(text));
      img.after(slug);
    });
  }

  function applyOptions() {
    optionButtons.forEach((btn) => {
      const name = btn.getAttribute("data-option");
      if (name === "maximize") return;
      // Every option is on by default; "images" is the odd one out because
      // its class is a negation.
      const on = name in options ? !!options[name] : true;
      btn.setAttribute("aria-pressed", String(on));
      body.classList.toggle(OPTION_CLASS[name], !on);
      if (name === "images") syncAltSlugs(on);
    });
  }

  optionButtons.forEach((btn) => {
    const name = btn.getAttribute("data-option");
    if (name === "maximize") return;
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const on = btn.getAttribute("aria-pressed") === "true";
      options[name] = !on;
      try {
        localStorage.setItem(OPTION_KEY, JSON.stringify(options));
      } catch (e) {}
      applyOptions();
    });
  });
  applyOptions();

  /* ====================================================================
   * Find in Page
   *
   * Searches the document only, never the chrome — the same scope the
   * browser's own Find had. Matches are wrapped in <mark> and unwrapped
   * again on the next search, so the page is left exactly as it was.
   * ==================================================================== */

  const findDialog = $("#dlg-find");

  function clearFind() {
    if (!pageEl) return;
    $$("mark.find-hit", pageEl).forEach((mark) => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
  }

  function runFind(term) {
    clearFind();
    if (!pageEl || !term) return [];

    const needle = term.toLowerCase();
    const walker = document.createTreeWalker(pageEl, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.toLowerCase().includes(needle)) return NodeFilter.FILTER_REJECT;
        // Skip anything inside a control — matching the label of a button is
        // not what anyone means by "find in page".
        if (node.parentElement.closest("button, select, textarea, input, script, style")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const targets = [];
    let node;
    while ((node = walker.nextNode())) targets.push(node);

    const hits = [];
    targets.forEach((textNode) => {
      let rest = textNode;
      let index = rest.nodeValue.toLowerCase().indexOf(needle);
      while (index !== -1) {
        const match = rest.splitText(index);
        rest = match.splitText(term.length);
        const mark = document.createElement("mark");
        mark.className = "find-hit";
        mark.textContent = match.nodeValue;
        match.parentNode.replaceChild(mark, match);
        hits.push(mark);
        index = rest.nodeValue.toLowerCase().indexOf(needle);
      }
    });
    return hits;
  }

  if (findDialog) {
    const findInput = $("#find-input", findDialog);
    const findStatus = $("[data-find-status]", findDialog);
    let hits = [];
    let hitIndex = -1;
    let lastTerm = "";

    const goToHit = (i) => {
      if (!hits.length) return;
      hits.forEach((m) => m.removeAttribute("data-current"));
      hitIndex = (i + hits.length) % hits.length;
      const mark = hits[hitIndex];
      mark.setAttribute("data-current", "true");
      mark.scrollIntoView({ block: "center", behavior: "smooth" });
      findStatus.textContent = t("ui.find.count", {
        n: hitIndex + 1,
        total: hits.length,
      });
    };

    $("#find-form", findDialog).addEventListener("submit", (event) => {
      event.preventDefault();
      const term = findInput.value.trim();
      if (!term) return;
      if (term !== lastTerm) {
        hits = runFind(term);
        lastTerm = term;
        hitIndex = -1;
      }
      if (!hits.length) {
        findStatus.textContent = t("ui.find.none", { term });
        return;
      }
      goToHit(hitIndex + 1);
    });

    findDialog.addEventListener("close", () => {
      clearFind();
      hits = [];
      lastTerm = "";
      findStatus.textContent = "";
    });
  }

  /* ====================================================================
   * Gallery + Image Viewer
   *
   * To add a photo: drop the file into img/gallery/, run
   * `bash tools/build-gallery.sh`, and add its filename below. Each entry
   * renders one square tile from the 400px thumbnail; the full-size file is
   * only fetched once the viewer opens.
   * ==================================================================== */

  const GALLERY_IMAGES = [
    "01.webp", "02.webp", "03.webp", "04.webp", "05.webp", "06.webp",
    "07.webp", "08.webp", "09.webp", "10.webp", "11.webp", "12.webp",
    "13.webp", "14.webp", "15.webp", "16.webp", "17.webp", "18.webp",
    "19.webp", "20.webp", "21.webp", "22.webp", "23.webp", "24.webp",
    "25.webp", "26.webp", "27.webp", "28.webp", "29.webp", "30.webp",
    "31.webp", "32.webp", "33.webp", "34.webp", "35.webp", "36.webp",
    "37.webp", "38.webp", "39.webp", "40.webp", "41.webp", "42.webp",
  ];

  const thumbGrid = $("#gallery-grid");
  const viewer = $("#dlg-viewer");

  if (thumbGrid && viewer) {
    const photos = GALLERY_IMAGES.map((file, i) => ({
      full: `${SHARED}img/gallery/${file}`,
      thumb: `${SHARED}img/gallery/thumbs/${file}`,
      alt: `Gallery photo ${i + 1}`,
      name: file,
    }));

    // A missing file would otherwise show a broken-image glyph; hiding the
    // <img> lets the tile's grey background stand in cleanly.
    const hideIfBroken = (img) =>
      img.addEventListener("error", () => { img.style.display = "none"; }, { once: true });

    const strip = $("[data-viewer-strip]", viewer);
    const frag = document.createDocumentFragment();
    const stripFrag = document.createDocumentFragment();

    photos.forEach((photo, i) => {
      const li = document.createElement("li");
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "thumbs__tile";
      tile.dataset.index = String(i);
      tile.setAttribute("aria-label", photo.alt);
      const img = document.createElement("img");
      hideIfBroken(img);
      img.src = photo.thumb;
      img.alt = "";
      img.loading = "lazy";
      tile.appendChild(img);
      li.appendChild(tile);
      frag.appendChild(li);

      const sBtn = document.createElement("button");
      sBtn.type = "button";
      sBtn.dataset.index = String(i);
      sBtn.setAttribute("aria-label", photo.alt);
      const sImg = document.createElement("img");
      hideIfBroken(sImg);
      sImg.src = photo.thumb;
      sImg.alt = "";
      sImg.loading = "lazy";
      sBtn.appendChild(sImg);
      stripFrag.appendChild(sBtn);
    });

    thumbGrid.appendChild(frag);
    strip.appendChild(stripFrag);

    const vImg = $(".viewer__img", viewer);
    const vCount = $("[data-viewer-count]", viewer);
    const vTitle = $("[data-viewer-name]", viewer);
    let activeIndex = 0;

    const show = (index) => {
      activeIndex = (index + photos.length) % photos.length;
      const photo = photos[activeIndex];
      // A fresh src leaves the previous frame painted until the new one
      // decodes, so blank the element before swapping — otherwise reopening
      // the viewer flashes whichever photo was shown last. Anything already
      // in cache is revealed in the same tick, so there is no blink.
      vImg.style.visibility = "hidden";
      vImg.src = photo.full;
      if (vImg.complete && vImg.naturalWidth) vImg.style.visibility = "";
      vImg.alt = photo.alt;
      vCount.textContent = `${activeIndex + 1} / ${photos.length}`;
      if (vTitle) vTitle.textContent = photo.name;
      $$("button", strip).forEach((btn, i) => {
        const on = i === activeIndex;
        btn.setAttribute("aria-current", String(on));
        if (on) btn.scrollIntoView({ inline: "center", block: "nearest" });
      });
    };

    vImg.addEventListener("error", () => { vImg.style.visibility = "hidden"; });
    vImg.addEventListener("load", () => { vImg.style.visibility = ""; });

    thumbGrid.addEventListener("click", (event) => {
      const tile = event.target.closest(".thumbs__tile");
      if (!tile) return;
      show(parseInt(tile.dataset.index, 10) || 0);
      openDialog("dlg-viewer");
    });

    strip.addEventListener("click", (event) => {
      const btn = event.target.closest("button");
      if (btn) show(parseInt(btn.dataset.index, 10) || 0);
    });

    $("[data-viewer-prev]", viewer).addEventListener("click", () => show(activeIndex - 1));
    $("[data-viewer-next]", viewer).addEventListener("click", () => show(activeIndex + 1));

    document.addEventListener("keydown", (event) => {
      if (!viewer.open) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); show(activeIndex - 1); }
      else if (event.key === "ArrowRight") { event.preventDefault(); show(activeIndex + 1); }
    });

    const countLine = $("[data-gallery-count]");
    if (countLine) countLine.textContent = t("gallery.count", { n: photos.length });
  }

  /* ====================================================================
   * Hit counter
   *
   * A real number, counted honestly: this visitor's own page views, kept in
   * their browser and sent nowhere. The 1996 part is the odometer and the
   * seed — every counter on the web started at a flattering figure.
   * ==================================================================== */

  const counter = $("[data-counter]");
  if (counter) {
    let views = 0;
    try {
      views = parseInt(localStorage.getItem("tf_hits") || "0", 10) || 0;
      views += 1;
      localStorage.setItem("tf_hits", String(views));
    } catch (e) {
      views = 1;
    }
    const digits = String(1995 + views).padStart(6, "0");
    counter.textContent = "";
    for (const d of digits) {
      const span = document.createElement("span");
      span.textContent = d;
      counter.appendChild(span);
    }
  }

  /* ====================================================================
   * Dialogs
   * ==================================================================== */

  function openDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog) return;
    closeAllMenus();
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    const focusTarget = dialog.querySelector("[data-autofocus]");
    if (focusTarget) focusTarget.focus();
  }

  $$("[data-open-dialog]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openDialog(trigger.getAttribute("data-open-dialog"));
    });
  });

  $$("[data-close-dialog]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      const dialog = trigger.closest("dialog");
      if (!dialog) return;
      dialog.close();
      const status = $(".form__status", dialog);
      if (status) {
        status.textContent = "";
        status.removeAttribute("data-state");
      }
    });
  });

  // Clicking the shaded area outside a dialog closes it.
  $$("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  // View → Document Info. A real Navigator feature, and the natural home for
  // the connection details the old build kept in a side panel.
  const infoUrl = $("[data-doc-url]");
  if (infoUrl) infoUrl.textContent = SITE_URL;
  const infoTitle = $("[data-doc-title]");
  if (infoTitle) infoTitle.textContent = document.title;
  const infoModified = $("[data-doc-modified]");
  if (infoModified) infoModified.textContent = document.lastModified;

  $$("[data-select-page]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      if (!pageEl) return;
      const range = document.createRange();
      range.selectNodeContents(pageEl);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    });
  });

  /* ====================================================================
   * DOOM
   *
   * The game is the Internet Archive's emulated shareware episode, framed
   * rather than hosted: no engine, no wad, nothing of id's in this repo.
   * The frame has no src until somebody opens the window, so a visitor who
   * never touches the Start menu never talks to archive.org at all — and
   * clearing it on close stops the emulator instead of leaving DOSBox
   * running behind a hidden dialog.
   * ==================================================================== */

  const doomWindow = $("#dlg-doom");
  const doomLaunchers = $$("[data-doom-launch]");

  if (doomWindow && doomLaunchers.length) {
    const frame = $("#doom-frame", doomWindow);

    /* A keyboard, and a screen with room for a DOS window on it. Touch
       devices have neither, and the joke only works if the menu entry is
       still there to be pressed. */
    const playable = () =>
      window.matchMedia("(min-width: 760px) and (min-height: 560px)").matches &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const markLaunchers = () =>
      doomLaunchers.forEach((btn) => btn.setAttribute("aria-disabled", String(!playable())));
    markLaunchers();
    window.addEventListener("resize", markLaunchers);

    doomLaunchers.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        if (!playable()) {
          openDialog("dlg-doom-mobile");
          return;
        }
        openDialog("dlg-doom");
        if (frame && !frame.src) frame.src = frame.dataset.src;
        // The emulator only hears the keyboard once it has it.
        if (frame) setTimeout(() => frame.focus(), 400);
      });
    });

    /* Unload DOSBox whenever the window stops being open, however it got
       there — the X, Escape, the backdrop, or a script.
   
       This watches the `open` attribute rather than listening for the dialog's
       `close` event. `close` is the correct API and fires in browsers, but it
       is not observable in every environment, and the cost of missing it here
       is an emulator left running with sound behind a window the visitor
       thinks they shut. The attribute is always right. */
    new MutationObserver(() => {
      if (!doomWindow.open && frame && frame.getAttribute("src")) {
        frame.removeAttribute("src");
      }
    }).observe(doomWindow, { attributes: true, attributeFilter: ["open"] });
  }

  /* ====================================================================
   * Keyboard
   * ==================================================================== */

  document.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const tag = (document.activeElement.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if ($$("dialog").some((d) => d.open)) return;

    if (event.key === "/") {
      event.preventDefault();
      body.classList.remove("hide-location");
      applyOptions();
      if (locField) locField.focus();
    }
  });

  /* ====================================================================
   * Connecting splash — once per browser session
   * ==================================================================== */

  const boot = $("#boot");
  if (boot) {
    let seen = false;
    try {
      seen = sessionStorage.getItem("tf_booted") === "1";
    } catch (e) {}

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduced) {
      boot.hidden = true;
    } else {
      const dismiss = () => {
        boot.hidden = true;
        try {
          sessionStorage.setItem("tf_booted", "1");
        } catch (e) {}
      };
      boot.hidden = false;
      const timer = setTimeout(dismiss, 1900);
      boot.addEventListener("click", () => {
        clearTimeout(timer);
        dismiss();
      });
      document.addEventListener("keydown", function skip(event) {
        if (event.key !== "Escape" && event.key !== "Enter" && event.key !== " ") return;
        clearTimeout(timer);
        dismiss();
        document.removeEventListener("keydown", skip);
      });
    }
  }

  /* ====================================================================
   * Forms — sanitisation, rate limit, submit
   * ==================================================================== */

  const MAX_LENGTHS = { firstName: 50, lastName: 50, email: 254, message: 2000 };

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
      out[key] = key === "message" ? sanitizeMultiline(capped) : sanitizeSingleLine(capped);
    }
    return out;
  };

  const RATE_LIMIT_MS = 10_000;

  $$("form[data-endpoint]").forEach((form) => {
    const status = $(".form__status", form);
    const submitBtn = form.querySelector('button[type="submit"]')
      || document.querySelector(`button[type="submit"][form="${form.id}"]`);
    let lastSubmitAt = 0;

    const setFormStatus = (text, state) => {
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
        setFormStatus(t("status.rateLimited", { wait }), "error");
        return;
      }

      if (!form.reportValidity()) return;

      const endpoint = form.dataset.endpoint;
      if (!endpoint) {
        setFormStatus(t("status.notConfigured"), "error");
        return;
      }

      const raw = Object.fromEntries(new FormData(form).entries());

      // Honeypot — silently succeed if a bot filled the hidden field.
      if (raw._honey && String(raw._honey).trim() !== "") {
        form.reset();
        setFormStatus(t("status.success"), "success");
        lastSubmitAt = now;
        return;
      }

      const userKeys = ["firstName", "lastName", "email", "message"];
      const sanitized = sanitizePayload(
        Object.fromEntries(userKeys.map((k) => [k, raw[k] ?? ""])),
      );
      const payload = { ...raw, ...sanitized };
      delete payload._honey;

      if (submitBtn) submitBtn.disabled = true;
      setFormStatus(t("status.sending"));
      lastSubmitAt = now;

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.success !== "false") {
          form.reset();
          setFormStatus(t("status.success"), "success");
        } else {
          setFormStatus(data.message || t("status.error"), "error");
        }
      } catch (err) {
        setFormStatus(t("status.network"), "error");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });

  /* ====================================================================
   * Go
   * ==================================================================== */

  applyTranslations(detectLanguageSync());
  if (locField) locField.value = SITE_URL;
  setStatus(null);
  playLoad();
})();

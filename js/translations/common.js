/* True Friends — common translation strings (EN + SV)
 *
 * Trimmed to what the landing page reads: the two hero button labels, the
 * footer copyright, and four aria strings. Everything else that lived here —
 * nav links, section labels, the contact form and its modal, the lightbox,
 * status messages — belonged to pages that moved to other domains at the
 * split, and none of it had a reader in this repository.
 *
 * 1996/js/translations/ has its own full copy and is not affected. This file
 * has now been trimmed twice for this repository; brand/README.md records the
 * first pass under "One wrinkle".
 *
 * The language switcher is in the footer and is the only route to these
 * strings: main.js does no locale detection on purpose, so there is no
 * automatic fallback to Swedish.
 *
 * Keys are referenced from HTML via:
 *   data-i18n           → sets textContent
 *   data-i18n-aria-label  → sets aria-label attribute
 */
window.TF_TRANSLATIONS = {
  en: {
    hero: {
      consulting: "Consulting",
      studio: "Studio",
    },
    footer: {
      copyright: "© {year} True Friends. All rights reserved.",
    },
    aria: {
      newTab: "(opens in a new tab)",
      skip: "Skip to content",
      socialLinks: "Social links",
      langSwitch: "Switch language",
    },
  },

  sv: {
    hero: {
      consulting: "Konsult",
      studio: "Studio",
    },
    footer: {
      copyright: "© {year} True Friends. All rights reserved.",
    },
    aria: {
      newTab: "(öppnas i en ny flik)",
      skip: "Hoppa till innehåll",
      socialLinks: "Sociala kanaler",
      langSwitch: "Byt språk",
    },
  },
};

/* Deep-merges a per-page translation object into TF_TRANSLATIONS. Each
 * per-page file calls this exactly once with { en: {...}, sv: {...} }.
 * Arrays replace wholesale; nested objects merge key-by-key. */
window.TF_ADD_TRANSLATIONS = function (additions) {
  const merge = (target, source) => {
    for (const key of Object.keys(source)) {
      const value = source[key];
      if (value && typeof value === "object" && !Array.isArray(value)) {
        if (!target[key] || typeof target[key] !== "object" || Array.isArray(target[key])) {
          target[key] = {};
        }
        merge(target[key], value);
      } else {
        target[key] = value;
      }
    }
  };
  if (additions.en) merge(window.TF_TRANSLATIONS.en, additions.en);
  if (additions.sv) merge(window.TF_TRANSLATIONS.sv, additions.sv);
};

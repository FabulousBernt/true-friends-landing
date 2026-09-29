/* True Friends 96 — common translation strings (EN + SV)
 *
 * Strings shared across every page: the browser chrome (menus, toolbar,
 * location bar, directory buttons, status bar, taskbar, dialogs), the
 * document's own furniture (nav strip, footer, counter, badges), the
 * contact form, and the status messages. Page prose — the about text, the
 * service descriptions, the client work — lives in the per-page file, which
 * loads AFTER this one and merges in via TF_ADD_TRANSLATIONS at the bottom.
 *
 * Keys are referenced from HTML via:
 *   data-i18n              → textContent
 *   data-i18n-html         → innerHTML (trusted markup only)
 *   data-i18n-placeholder  → placeholder attribute
 *   data-i18n-aria-label   → aria-label attribute
 *   data-i18n-content      → content attribute (meta tags)
 *   data-i18n-href         → href attribute (per-language files)
 *   data-i18n-title        → title attribute
 */
window.TF_TRANSLATIONS = {
  en: {
    meta: {
      description:
        "True Friends is a creative and technical studio & consulting firm delivering services in software testing, web development, UI/UX design, graphic design, market communication, photography, video production and editing. We are based in Motala, Sweden, but available worldwide.",
    },

    /* ---------- Browser chrome ---------- */
    ui: {
      appName: "True Friends 96",
      title: {
        start: "True Friends — Welcome — True Friends 96",
        consulting: "True Friends — Consulting — True Friends 96",
        studio: "True Friends — Studio — True Friends 96",
      },

      menu: {
        file: "File",
        edit: "Edit",
        view: "View",
        go: "Go",
        bookmarks: "Bookmarks",
        options: "Options",
        help: "Help",
      },
      file: {
        openLocation: "Open Location…",
        saveAs: "Save As…",
        print: "Print…",
        exit: "Exit",
      },
      edit: {
        undo: "Undo",
        cut: "Cut",
        copy: "Copy",
        paste: "Paste",
        selectAll: "Select All",
        find: "Find in Page…",
      },
      view: {
        reload: "Reload",
        docInfo: "Document Info…",
        english: "English",
        swedish: "Svenska",
      },
      go: {
        back: "Back",
        forward: "Forward",
        home: "Home",
      },
      bookmarks: {
        heading: "True Friends",
        cases: "Reference cases",
      },
      options: {
        toolbar: "Show Toolbar",
        location: "Show Location",
        dirbar: "Show Directory Buttons",
        images: "Auto Load Images",
        maximize: "Maximize window",
      },
      helpMenu: {
        readme: "Read Me",
        shortcuts: "Keyboard Shortcuts",
        about: "About True Friends 96",
      },

      tb: {
        back: "Back",
        forward: "Forward",
        home: "Home",
        reload: "Reload",
        images: "Images",
        print: "Print",
        find: "Find",
        stop: "Stop",
        travel: "{year} website",
        travelLabel: "Travel to the {year} website",
      },

      location: "Location:",
      goBtn: "Go",

      dir: {
        home: "Home",
        consulting: "Consulting",
        studio: "Studio",
        gallery: "Gallery",
        cases: "Reference Cases",
      },

      status: {
        done: "Document: Done",
        connecting: "Connecting to {host}…",
        contacted: "Host contacted. Waiting for reply…",
        transferring: "Transferring data…",
        stopped: "Transfer interrupted.",
      },
      secure: "This document is not encrypted.",

      find: {
        title: "Find",
        label: "Find what:",
        next: "Find Next",
        count: "Match {n} of {total}.",
        none: "No match for “{term}”.",
      },

      docinfo: {
        title: "Document Info",
        location: "Location:",
        docTitle: "Title:",
        modified: "Last modified:",
        server: "Server:",
        protocol: "Protocol:",
        connStatus: "Status:",
        online: "ONLINE",
        latency: "Latency:",
        security: "Security:",
        insecure: "None (this is a 1996 browser)",
        note: "Connected via dial-up modem.",
      },

      start: {
        label: "Start",
        consulting: "Consulting",
        studio: "Studio",
        home: "Home page",
        contact: "Say hi…",
        readme: "Read Me",
        shortcuts: "Keyboard Shortcuts",
        doom: "DOOM",
        shutDown: "Shut Down…",
      },

      boot: {
        dialing: "Dialing 08-555 1996…",
        negotiating: "Negotiating at 33.6 kbps…",
      },

      dlg: {
        ok: "OK",
        cancel: "Cancel",
        close: "Close",

        aboutTitle: "About True Friends 96",
        aboutHeading: "True Friends 96",
        aboutVersion: "Version 96 (Build 1996.03.12)",
        aboutBody:
          "A creative and technical studio & consulting firm based in Motala, Sweden, but available worldwide.",
        aboutLicense: "This product is licensed to: a true friend.",

        saveTitle: "Save As",
        saveBody:
          "The document could not be saved. Insert a formatted floppy disk in drive A: and try again.",

        exitTitle: "True Friends 96",
        exitBody:
          "This program cannot be closed. A true friend does not walk out on you.",
        exitBody2: "Say hi instead — we answer faster than a modem.",

        notFoundTitle: "Error 404",
        notFoundBody: "The requested URL was not found on this server:",
        notFoundBody2:
          "Check the spelling, or use the directory buttons above — there are only a handful of pages here and all of them are worth a look.",

        noHostTitle: "Network Error",
        noHostBody: "True Friends 96 is unable to locate the server:",
        noHostBody2:
          "The server does not have a DNS entry. This browser only knows one host, and it is www.truefriends.se.",

        shortcutsTitle: "Keyboard Shortcuts",
        shortcutsIntro: "While the document has focus:",

        readmeTitle: "README.TXT",
        readmeBody:
          "True Friends is a creative and technical studio & consulting firm. Based in Motala, Sweden. Available worldwide.",

        shutDownTitle: "Shut Down",
        shutDownBody: "Do you want to travel back to the future?",

        viewerTitle: "Image Viewer",
        contactTitle: "Say hi!",
      },

      doom: {
        title: "DOOM",
        keys: "Arrows move · Ctrl fires · Space opens doors · X closes the window",
        mobile: "DOOM is not available on mobile devices, it's 1996…",
      },

      shortcuts: {
        slash: "Jump to the Location field",
        enter: "Go to the address in the Location field",
        esc: "Close the open dialog",
        arrows: "Previous / next photo in the image viewer",
        tab: "Move between controls",
      },
    },

    /* ---------- The document's own furniture ---------- */
    page: {
      counter: "You are visitor number",
      updated: "Last updated: {year}",
      badges: {
        res: "Best viewed at 800 × 600",
        handcoded: "Hand-coded, no frames",
        motala: "Made in Motala, Sweden",
        modem: "Dial-up friendly",
      },
      altOff: "Image not loaded — Auto Load Images is off.",
      travel: "Back to the future ({year} website)",
    },

    /* ---------- Site-wide labels ---------- */
    nav: {
      start: "Start",
      about: "About",
      services: "Services",
      team: "Consultants",
      gallery: "Gallery",
      contact: "Contact",
    },
    hero: {
      cta: "Say hi",
      consulting: "Consulting",
      studio: "Studio",
    },
    services: { label: "Services" },
    refCase: {
      about: "About",
      myRole: "My role",
      workflow: "Workflow",
      back: "Back to Consulting",
    },
    contact: {
      label: "Contact",
      lede: "Find us on our social media channels, reach out via email or send a message through the form below.",
      placeholders: {
        firstName: "First name",
        lastName: "Last name",
        email: "Email",
        message: "Message",
      },
      submit: "Send",
      otherWays: "Other ways to reach us",
    },
    modal: {
      title: "Say hi!",
      desc: "Please fill out the contact form and we will get back to you as soon as we can.",
      close: "Close",
      send: "Send",
    },
    footer: {
      copyright: "© {year} True Friends. All rights reserved.",
    },
    status: {
      sending: "Sending…",
      success: "Thanks — we'll be in touch soon.",
      error: "Something went wrong. Please try again.",
      network: "Network error. Please try again.",
      rateLimited: "Please wait {wait}s before sending again.",
      notConfigured:
        "Form endpoint not configured. Email hello@truefriends.se directly.",
    },
    aria: {
      skip: "Skip to the document",
      home: "True Friends home",
      socialLinks: "Social links",
      langSwitch: "Switch language",
      lightbox: "Photo gallery",
      prevPhoto: "Previous photo",
      nextPhoto: "Next photo",
      closeLightbox: "Close",
      firstName: "First name",
      lastName: "Last name",
      email: "Email",
      message: "Message",
      minimize: "Minimize",
      maximize: "Maximize",
      close: "Close",
      menubar: "Browser menu",
      toolbar: "Navigation toolbar",
      dirbar: "Directory buttons",
      locationBar: "Location",
      statusBar: "Status bar",
      document: "Document",
      pagenav: "Page navigation",
      startMenu: "Start menu",
      taskbar: "Taskbar",
      boot: "Connecting",
    },
  },

  sv: {
    meta: {
      description:
        "True Friends är en kreativ och teknisk studio och konsultbolag som levererar tjänster inom webbutveckling, webbdesign, testning, UI/UX design, grafisk design, marknadskommunikation, fotografering, filmproduktion och redigering/retusch. Vi är baserade i Motala, Sverige, men tillgängliga världen över.",
    },

    ui: {
      appName: "True Friends 96",
      title: {
        start: "True Friends — Välkommen — True Friends 96",
        consulting: "True Friends — Konsult — True Friends 96",
        studio: "True Friends — Studio — True Friends 96",
      },

      menu: {
        file: "Arkiv",
        edit: "Redigera",
        view: "Visa",
        go: "Gå",
        bookmarks: "Bokmärken",
        options: "Alternativ",
        help: "Hjälp",
      },
      file: {
        openLocation: "Öppna adress…",
        saveAs: "Spara som…",
        print: "Skriv ut…",
        exit: "Avsluta",
      },
      edit: {
        undo: "Ångra",
        cut: "Klipp ut",
        copy: "Kopiera",
        paste: "Klistra in",
        selectAll: "Markera allt",
        find: "Sök på sidan…",
      },
      view: {
        reload: "Läs om",
        docInfo: "Dokumentinfo…",
        english: "English",
        swedish: "Svenska",
      },
      go: {
        back: "Bakåt",
        forward: "Framåt",
        home: "Hem",
      },
      bookmarks: {
        heading: "True Friends",
        cases: "Referensuppdrag",
      },
      options: {
        toolbar: "Visa verktygsfält",
        location: "Visa adressfält",
        dirbar: "Visa katalogknappar",
        images: "Läs in bilder automatiskt",
        maximize: "Maximera fönster",
      },
      helpMenu: {
        readme: "Läs mig",
        shortcuts: "Kortkommandon",
        about: "Om True Friends 96",
      },

      tb: {
        back: "Bakåt",
        forward: "Framåt",
        home: "Hem",
        reload: "Läs om",
        images: "Bilder",
        print: "Skriv ut",
        find: "Sök",
        stop: "Stopp",
        travel: "{year} webbplats",
        travelLabel: "Res till {year} års webbplats",
      },

      location: "Adress:",
      goBtn: "Gå",

      dir: {
        home: "Hem",
        consulting: "Konsult",
        studio: "Studio",
        gallery: "Galleri",
        cases: "Referensuppdrag",
      },

      status: {
        done: "Dokument: Klart",
        connecting: "Ansluter till {host}…",
        contacted: "Värden kontaktad. Väntar på svar…",
        transferring: "Överför data…",
        stopped: "Överföringen avbröts.",
      },
      secure: "Det här dokumentet är inte krypterat.",

      find: {
        title: "Sök",
        label: "Sök efter:",
        next: "Sök nästa",
        count: "Träff {n} av {total}.",
        none: "Ingen träff för ”{term}”.",
      },

      docinfo: {
        title: "Dokumentinfo",
        location: "Adress:",
        docTitle: "Titel:",
        modified: "Senast ändrad:",
        server: "Server:",
        protocol: "Protokoll:",
        connStatus: "Status:",
        online: "UPPKOPPLAD",
        latency: "Svarstid:",
        security: "Säkerhet:",
        insecure: "Ingen (det här är en webbläsare från 1996)",
        note: "Ansluten via uppringt modem.",
      },

      start: {
        label: "Start",
        consulting: "Konsult",
        studio: "Studio",
        home: "Startsida",
        contact: "Säg hej…",
        readme: "Läs mig",
        shortcuts: "Kortkommandon",
        doom: "DOOM",
        shutDown: "Avsluta…",
      },

      boot: {
        dialing: "Ringer upp 08-555 1996…",
        negotiating: "Förhandlar på 33,6 kbit/s…",
      },

      dlg: {
        ok: "OK",
        cancel: "Avbryt",
        close: "Stäng",

        aboutTitle: "Om True Friends 96",
        aboutHeading: "True Friends 96",
        aboutVersion: "Version 96 (Build 1996.03.12)",
        aboutBody:
          "En kreativ och teknisk studio & konsultfirma baserad i Motala, Sverige, men tillgänglig världen över.",
        aboutLicense: "Denna produkt är licensierad till: en true friend.",

        saveTitle: "Spara som",
        saveBody:
          "Dokumentet kunde inte sparas. Sätt in en formaterad diskett i enhet A: och försök igen.",

        exitTitle: "True Friends 96",
        exitBody: "Programmet kan inte avslutas. En true friend lämnar dig inte.",
        exitBody2:
          "Säg hej i stället — vi svarar snabbare än ett modem.",

        notFoundTitle: "Fel 404",
        notFoundBody: "Den begärda adressen finns inte på den här servern:",
        notFoundBody2:
          "Kontrollera stavningen, eller använd katalogknapparna ovan — det finns bara en handfull sidor här och alla är värda ett besök.",

        noHostTitle: "Nätverksfel",
        noHostBody: "True Friends 96 hittar inte servern:",
        noHostBody2:
          "Servern saknar DNS-post. Den här webbläsaren känner bara till en värd, och det är www.truefriends.se.",

        shortcutsTitle: "Kortkommandon",
        shortcutsIntro: "När dokumentet har fokus:",

        readmeTitle: "LASMIG.TXT",
        readmeBody:
          "True Friends är en kreativ och teknisk studio och konsultfirma. Baserade i Motala, Sverige men tillgängliga världen över.",

        shutDownTitle: "Avsluta",
        shutDownBody: "Vill du resa tillbaka till framtiden?",

        viewerTitle: "Bildvisare",
        contactTitle: "Säg hej!",
      },

      doom: {
        title: "DOOM",
        keys: "Piltangenter går · Ctrl skjuter · Mellanslag öppnar dörrar · X stänger fönstret",
        mobile: "Doom finns bara på datorn, det är 1996…",
      },

      shortcuts: {
        slash: "Hoppa till adressfältet",
        enter: "Gå till adressen i adressfältet",
        esc: "Stäng öppen dialogruta",
        arrows: "Föregående / nästa foto i bildvisaren",
        tab: "Flytta mellan kontroller",
      },
    },

    page: {
      counter: "Du är besökare nummer",
      updated: "Senast uppdaterad: {year}",
      badges: {
        res: "Bäst i 800 × 600",
        handcoded: "Handkodad, inga ramar",
        motala: "Gjord i Motala, Sverige",
        modem: "Modemvänlig i 33,6 kbit/s",
      },
      altOff: "Bilden är inte inläst — automatisk bildinläsning är av.",
      travel: "Tillbaka till framtiden ({year} webbplats)",
    },

    nav: {
      start: "Start",
      about: "Om oss",
      services: "Tjänster",
      team: "Konsulter",
      gallery: "Galleri",
      contact: "Kontakt",
    },
    hero: {
      cta: "Säg hej",
      consulting: "Konsult",
      studio: "Studio",
    },
    services: { label: "Tjänster" },
    refCase: {
      about: "Om uppdraget",
      myRole: "Min roll",
      workflow: "Arbetsprocess",
      back: "Tillbaka till Konsult",
    },
    contact: {
      label: "Kontakt",
      lede: "Hitta oss i våra sociala kanaler, kontakta oss via e‑post eller skicka ett meddelande via formuläret nedan.",
      placeholders: {
        firstName: "Förnamn",
        lastName: "Efternamn",
        email: "E‑post",
        message: "Meddelande",
      },
      submit: "Skicka",
      otherWays: "Andra sätt att nå oss",
    },
    modal: {
      title: "Säg hej!",
      desc: "Fyll i kontaktformuläret så återkommer vi så snart vi kan.",
      close: "Stäng",
      send: "Skicka",
    },
    footer: {
      copyright: "© {year} True Friends. All rights reserved.",
    },
    status: {
      sending: "Skickar…",
      success: "Tack — vi hör av oss så snart vi kan.",
      error: "Något gick fel. Vänligen försök igen.",
      network: "Nätverksfel. Vänligen försök igen.",
      rateLimited: "Vänta {wait}s innan du skickar igen.",
      notConfigured:
        "Formulärets adress är inte konfigurerad. Mejla hello@truefriends.se direkt.",
    },
    aria: {
      skip: "Hoppa till dokumentet",
      home: "True Friends startsida",
      socialLinks: "Sociala kanaler",
      langSwitch: "Byt språk",
      lightbox: "Fotogalleri",
      prevPhoto: "Föregående foto",
      nextPhoto: "Nästa foto",
      closeLightbox: "Stäng",
      firstName: "Förnamn",
      lastName: "Efternamn",
      email: "E‑post",
      message: "Meddelande",
      minimize: "Minimera",
      maximize: "Maximera",
      close: "Stäng",
      menubar: "Webbläsarmeny",
      toolbar: "Navigeringsverktygsfält",
      dirbar: "Katalogknappar",
      locationBar: "Adress",
      statusBar: "Statusfält",
      document: "Dokument",
      pagenav: "Sidnavigering",
      startMenu: "Startmeny",
      taskbar: "Aktivitetsfält",
      boot: "Kopplar upp",
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

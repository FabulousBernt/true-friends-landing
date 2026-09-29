/* True Friends — studio page translations
 *
 * Adds studio-only keys onto TF_TRANSLATIONS. Site-wide labels
 * (nav, footer, aria, contact, modal, hero.cta,
 * hero.consulting/studio labels, tagline) live in
 * js/translations/common.js. The about section is page-specific —
 * studio and consulting each carry their own copy.
 */
window.TF_ADD_TRANSLATIONS({
  en: {
    meta: {
      title: "True Friends — Creative & Technical Studio",
    },
    hero: {
      lede: {
        studio: "We offer services in web development, design, marketing, photo, video and editing.",
      },
    },
    about: {
      label: "About",
      ledeHTML:
        'Here at True Friends, we deliver both a <span class="accent">creative</span> vision and <span class="accent">technical</span> expertise to every project and role we take on.',
      body1:
        "We have a long experience in web development, photography, video production and design. Working with companies, organisations, bands and individuals in numerous areas.",
      body2:
        "Our vision is to be a close and genuine partner, a true friend to you as a customer, helping your projects, visions, and business forward with high quality and dedication. To achieve this, we focus on gaining a deep understanding of your work, goals, audience, and challenges.",
      body3:
        "True Friends rests on a foundation of honesty, creativity, responsibility, and commitment. These pillars are essential for our work and our shared success.",
    },
    gallery: {
      label: "Gallery",
      intro: "A selection of our photography. Click any thumbnail to open it in the image viewer.",
      count: "{n} images in this folder.",
    },
    services: {
      note: "Our media services are available to both businesses and private individuals.<br>We also collaborate with various partners for larger and more complex projects.",
      items: {
        webDev: {
          name: "Web Production",
          body: "We deliver high-end websites and web applications tailored to your needs. We follow international standards in accessibility, usability and security, and make every decision based on the context of your business needs.",
        },
        graphicDesign: {
          name: "Graphic Design",
          body: "Using visual design principles and design thinking processes we create graphical profiles, logotypes, posters, clothing and other digital and printable media.",
        },
        market: {
          name: "Market communication",
          body: "We help with brand identity, campaign strategy and content that connects your business to the world across digital and printable medias.",
        },
        photo: {
          name: "Photography",
          body: "Our photography services ranges from portraits, products, landscapes, real estate, food & drinks, weddings, concerts, sports and other events.",
        },
        video: {
          name: "Video & Production",
          body: "A complete video production solution. From analysing your needs to concept, script writing, filming and editing. Whether it’s simpler productions for web and social media to more advanced commercials, we take care of the entire process, from idea to finished video.",
        },
        editing: {
          name: "Editing & Retouch",
          body: "We provide professional post-production for photo and video to ensure everything looks as intended, from colour and lighting adjustments to detailed retouch.",
        },
      },
    },
  },

  sv: {
    meta: {
      title: "True Friends — Kreativ & Teknisk Studio",
    },
    hero: {
      lede: {
        studio: "Vi erbjuder tjänster inom webbproduktion, design, marknadsföring, foto, video och redigering.",
      },
    },
    about: {
      label: "Om oss",
      ledeHTML:
        'Vi på True Friends levererar både en <span class="accent">kreativ</span> vision och <span class="accent">teknisk</span> expertis i varje projekt och roll som vi tar oss an.',
      // TODO: translate — still the previous shared Swedish copy,
      // re-split to match the three English paragraphs.
      body1:
        "Vi har lång erfarenhet av webbutveckling, fotografi, videoproduktion och design, och arbetar med företag, organisationer, band och privatpersoner inom en rad olika områden.",
      body2:
        "Vår vision är att vara en nära och genuin partner, en true friend till dig som kund genom att med hög kvalitet och stort engagemang föra dina projekt, visioner och din verksamhet framåt. För att lyckas med detta fokuserar vi på att skapa en djup förståelse för er, ert arbete, era mål, målgrupp och utmaningar.",
      body3:
        "True Friends är byggt på en grund av ärlighet, kreativitet, ansvar och engagemang. Dessa grundpelare är avgörande för vårt arbete och vår gemensamma framgång.",
    },
    gallery: {
      label: "Galleri",
      intro: "Ett urval av vår fotografi. Klicka på en miniatyr så öppnas den i bildvisaren.",
      count: "{n} bilder i den här mappen.",
    },
    services: {
      note: "Våra mediatjänster är tillgängliga för både företag och privatpersoner.<br>Vid större och mer komplexa projekt samarbetar vi ibland med olika partners.",
      items: {
        webDev: {
          name: "Webbproduktion",
          body: "Vi levererar moderna webbsidor och webbapplikationer skräddarsydda utefter era behov och önskemål. Vi följer alltid internationella standarder för tillgänglighet, användbarhet och säkerhet, och baserar varje beslut på kontexten kring er verksamhet.",
        },
        graphicDesign: {
          name: "Grafisk design",
          body: "Med visuella design principer och design thinking processer skapar vi grafiska profiler, logotyper, affischer, klädestryck och andra digitala och tryckbara medier.",
        },
        market: {
          name: "Marknadskommunikation",
          body: "Vi hjälper till med varumärkesidentitet, kampanjstrategi och innehåll som kopplar samman ditt företag med omvärlden i såväl digitala som tryckta medier.",
        },
        photo: {
          name: "Fotografering",
          body: "Våra fotograferingstjänster täcker allt från porträtt, produkter, landskap, fastigheter, mat & dryck, bröllop, konserter, sport och andra event.",
        },
        video: {
          name: "Videoproduktion",
          body: "Från idé till färdig video. Genom att analysera era behov och koncept till manus, filma och redigera. Oavsett om det är en enklare produktion för webben och sociala medier till mer avancerade reklamfilmer så tar vi hand om hela processen från ide till färdig video.",
        },
        editing: {
          name: "Redigering/Retusch",
          body: "Vi erbjuder professionell bildbehandling och videoredigering för att säkerställa att allt visas och ser ut som det är tänkt. Från färgkorrigering, vitbalans och exponering till detaljerad retusch.",
        },
      },
    },
  },
});

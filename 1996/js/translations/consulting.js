/* True Friends — consulting page translations
 *
 * Adds consulting-only keys onto TF_TRANSLATIONS. Site-wide labels
 * (nav, footer, aria, contact, modal, hero.cta,
 * hero.consulting/studio labels, tagline, refCase labels) live in
 * js/translations/common.js. The about section is page-specific —
 * consulting and studio each carry their own copy.
 */
window.TF_ADD_TRANSLATIONS({
  en: {
    meta: {
      titleConsulting: "True Friends — Consulting",
    },
    hero: {
      lede: {
        consulting: "We provide consulting services in testing, ux/ui design, web production, software development and cybersecurity.",
      },
    },
    about: {
      label: "About",
      ledeHTML:
        'Here at True Friends, we deliver both a <span class="accent">creative</span> vision and <span class="accent">technical</span> expertise to every project and role we take on.',
      body1:
        "We have a long experience in design, testing and development from numerous projects across both the private and public sectors.",
      body2:
        "Our vision is to be a close and genuine partner, a true friend to you as a customer, helping you build high-quality products and software solutions. To achieve this, we focus on gaining a deep understanding of your business, goals, customers, users, problems and challenges.",
      body3:
        "True Friends rests on a foundation of honesty, creativity, responsibility, and commitment. These pillars are essential for our work and our shared success.",
    },
    services: {
      items: {
        testing: {
          name: "Testing",
          body: "When testing we like to be involved as early as possible to help identify risks and potential problems long before any code is written. By working both proactively and reactively we can increase our chances of eliminating late and costly problems. We explore, investigate, experiment, and verify the software/product based on requirements, risks and experience to uncover and deliver as much valuable information as possible. We also lead the testing in teams and coach how to approach a quality first mindset.",
        },
        uxDesign: {
          name: "UX Design",
          body: "By applying a design thinking process, we put ourselves in the environment of your users to understand the root problem. Together with you and your users, we work iteratively with research, wireframes, prototypes, and interface design to create a solution that solves the problems we set out to solve and that are user friendly and accessible.",
        },
        uiDesign: {
          name: "UI Design",
          body: "Using visual design principles, we design interfaces for systems, websites, and mobile applications that are not only visually appealing but also functional from both a usability and accessibility perspective. We always base our work on WCAG and user feedback to ensure inclusive interfaces.",
        },
      },
    },
    team: {
      label: "Consultants",
      cv: "Download cv",
      members: {
        johnny: {
          name: "Johnny Vigersten",
          role: "Tester / UX/UI Designer",
          bio: "I like exploring and investigating software and solving problems for customers. I advocate usability, security and aesthetics.",
          cvHref: "../cv/johnny-vigersten-cv-EN.pdf",
        },
      },
    },
  },

  sv: {
    meta: {
      titleConsulting: "True Friends — Konsult",
    },
    hero: {
      lede: {
        consulting: "Vi erbjuder konsulttjänster inom testning, ux/ui-design, webbproduktion, mjukvaruutveckling och cybersäkerhet.",
      },
    },
    about: {
      label: "Om oss",
      ledeHTML:
        'Vi på True Friends levererar både en <span class="accent">kreativ</span> vision och <span class="accent">teknisk</span> expertis i varje projekt och roll som vi tar oss an.',
      body1:
        "Vi har lång erfarenhet av design, testning och utveckling från en mängd projekt inom både privat och offentlig sektor.",
      body2:
        "Vår vision är att vara en nära och genuin partner, en true friend för dig som kund och hjälpa dig att skapa högkvalitativa produkter och mjukvarulösningar. För att lyckas med detta fokuserar vi på att skapa en djup förståelse för din verksamhet, dina mål, kunder, användare och de problem och utmaningar ni står inför.",
      body3:
        "True Friends vilar på en grund av ärlighet, kreativitet, ansvarstagande och engagemang. Dessa värdeord är avgörande för vårt arbete och vår gemensamma framgång.",
    },
    services: {
      items: {
        testing: {
          name: "Testning",
          body: "I testarbetet vill vi vara involverade så tidigt som möjligt för att hjälpa till att identifiera risker och potentiella problem långt innan någon kod skrivs. Genom att arbeta både proaktivt och reaktivt ökar vi chanserna att eliminera sena och kostsamma problem. Vi utforskar, undersöker, experimenterar och verifierar mjukvaran eller produkten utifrån krav, risker och erfarenhet för att ta fram och förmedla så mycket värdefull information som möjligt. Vi leder även testarbetet i team och coachar kring hur man anammar ett kvalitetstänk där kvaliteten sätts i första rummet.",
        },
        uxDesign: {
          name: "UX-Design",
          body: "Genom att tillämpa en design thinking-process sätter vi oss in i er och era användares miljö för att förstå det grundläggande problemet. Tillsammans med er och era användare arbetar vi iterativt med research, wireframes, prototyper och gränssnittsdesign för att skapa en lösning som åtgärdar de problem vi identifierat och som är användarvänlig och tillgänglig.",
        },
        uiDesign: {
          name: "UI-Design",
          body: "Genom visuella design principer utformar vi gränssnitt för system, webbplatser och mobilappar som inte bara är visuellt tilltalande, utan även funktionella ur både användbarhets- och tillgänglighetsperspektiv. Vi baserar alltid vårt arbete på WCAG och användarfeedback för att säkerställa inkluderande gränssnitt.",
        },
      },
    },
    team: {
      label: "Konsulter",
      cv: "Ladda ner CV",
      members: {
        johnny: {
          name: "Johnny Vigersten",
          role: "Testare / Designer",
          bio: "Jag tycker om att utforska och undersöka mjukvara samt att lösa problem åt mina kunder. Jag förespråkar användbarhet, säkerhet och estetik.",
          cvHref: "../cv/johnny-vigersten-cv-SE.pdf",
        },
      },
    },
  },
});

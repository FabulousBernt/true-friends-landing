/* True Friends — Epiroc reference case translations
 *
 * Adds Epiroc-only case-study copy onto TF_TRANSLATIONS. Generic refCase
 * section labels ("About", "My role", "Workflow") live in
 * js/translations/common.js. Help Center is the one section without a
 * shared label — no other case has it — so it carries a `label` key
 * alongside its body copy below.
 */
window.TF_ADD_TRANSLATIONS({
  en: {
    refCases: {
      epiroc: {
        about: {
          lede: "MyEpiroc is a large and versatile platform created for Epiroc, a leading manufacturer in the mining industry.",
          body1: "The platform is available on desktop, iOS, and Android. For Epiroc employees, it streamlines customer and user management, enables technical modules, product promotions, and FAQ maintenance. For customers, it provides real-time oversight of their equipment, enabling services, inspections, fault reporting, machine tracking, and efficient management of drilling and blasting operations.",
          caption1: "MyEpiroc's landing page on desktop.",
        },
        myRole: {
          body1: "While employed as a consultant at B3 Commit I spent two and a half years as a tester and designer on the MyEpiroc project. Initially, I worked as a co-designer alongside three others, but I quickly transitioned into the role of design lead within my team.",
          body2: "As a tester, I collaborated with two other testers, each responsible for the quality mindset and testing efforts within our respective teams. We also worked cross-team to exchange ideas, align efforts, and address any dependencies that we might have to one another. In the next section, I will outline the workflow and outcomes of my design and testing work for a module of the system called Help Center.",
        },
        helpCenter: {
          label: "Help Center",
          body1: "The Help Center was a newly introduced feature designed for both Epiroc employees and customers. It served as a centralised hub where users could access support for MyEpiroc, it’s tools, integration systems, equipment manuals, and more. Of course available in all supported languages.",
        },
        workflow: {
          body1: "We began our research by interviewing reference customers and Epiroc back-office staff to gather insights into their needs, problems and challenges. This approach helped us empathise with them and better understand their requirements & needs.",
          body2: "We collected both quantitative and qualitative data from our research. Using Miro we organised and analysed the data with digital post-it’s, created clusters of metrics, defining user roles, created user story maps and identified functions and pain points.",
          body3: "After analysing the research data and having had brainstorming sessions regarding how we could solve the problems that our customer and users where facing I started creating prototypes. Firstly on paper that I quickly ran by the team, then I’d move on to create them in Figma for more detailed feedback sessions with the team, our reference customers and users. We iterated with prototypes and user testing sessions until we achieved a something that we felt worked.",
          body4: "The design featured two main components: a content-management part for Epiroc users to manage content such as products, questions, media, links, styles, inline translations, and other resources, and a frontend portal where customers could easily search and access the help they needed.",
          body5: "Iteratively throughout the development cycle we broke the design into user story maps and value-sliced it to prioritise the tasks that delivered the most value with the least effort.",
          body6: "As a development team we worked with Extreme Programming in short iterations with frequent feedback loops, design updates, development, testing and customer demos. This approach allowed us to quickly validate whether we were on the right track and make necessary adjustments to the solution if needed.",
          body7: "The workflow of Extreme Programming minimised context switching, kept the everyone in the team aligned on what we where working on, kept everyone involved, reduced personal dependencies, and significantly reduced the number of bugs that reached end users.",
          caption1: "Image from seannhicks.com",
          body8: "Throughout the process, we maintained close communication with users, continuously gathering their feedback and incorporating it into our design prototypes and development iterations. We made frequent, small releases, ensuring users felt their feedback was valued and they remained involved throughout the process. During one particularly productive week, we completed 5 releases in 5 days, each delivering distinct value to different users, with no bugs* reported. We referred to this as our “perfect week.”",
          body9: "*Bugs were rarely reported during development or from production, though the absence of bugs doesn’t mean they don’t exist. However we experienced a huge increase in the overall quality when working with extreme programming instead of our old individual task-based workflow.",
          body10: '<a href="https://www.media.epiroc.com/en/search-results?filters=properties/products/drill-rigs-and-rock-drills&amp;sort=most_relevant" target="_blank" rel="noopener">*All marketing photos belong to Epiroc.</a>',
        },
      },
    },
  },

  sv: {
    refCases: {
      epiroc: {
        about: {
          lede: "MyEpiroc är en stor och mångsidig plattform byggt för Epiroc som är en världsledande tillverkare inom gruvindustrin.",
          body1: "Plattformen finns för desktop, iOS och Android. För Epirocs anställda effektiviserar den hanteringen av kunder och användare och ger tillgång till flera olika tekniska moduler, produktkampanjer och underhåll av FAQ. För kunderna ger den överblick över utrustningen i realtid och möjliggör service, besiktningar, felanmälan, maskinspårning och effektiv styrning av borrning och sprängning.",
          caption1: "MyEpirocs startsida på desktop.",
        },
        myRole: {
          body1: "Som anställd konsult på B3 Commit tillbringade jag två och ett halvt år som testare och designer i MyEpiroc-projektet. Till en början arbetade jag som designer tillsammans med tre andra, men jag gick snabbt över i rollen som designansvarig i mitt team.",
          body2: "Som testare samarbetade jag med två andra testare, där var och en ansvarade för kvalitetsmindset och testarbetet i sitt respektive team. Vi arbetade även över teamgränserna för att utbyta idéer, koordinera arbetet och hantera de beroenden vi kunde ha till varandra. I nästa avsnitt beskriver jag arbetssättet och resultatet av mitt design- och testarbete för en modul i systemet som heter Help Center.",
        },
        helpCenter: {
          label: "Help Center",
          body1: "Help Center var en helt ny funktion som togs fram för både Epirocs anställda och deras kunder. Det fungerade som en central plats där användarna kunde få hjälp med MyEpiroc, dess verktyg, integrerade system, maskinmanualer och mycket mer, tillgängligt på alla språk som plattformen stödjer.",
        },
        workflow: {
          body1: "Vi inledde vår research med att intervjua referenskunder och Epirocs back office-personal för att samla insikter om deras behov, problem och utmaningar. Det hjälpte oss att sätta oss in i deras situation och bättre förstå vad de faktiskt behövde.",
          body2: "Vi samlade in både kvantitativ och kvalitativ data. I Miro strukturerade och analyserade vi materialet med digitala post it-lappar, grupperade datan, definierade användarroller, byggde user story maps och identifierade funktioner och smärtpunkter.",
          body3: "Efter att ha analyserat researchen och hållit brainstormingmöten om hur vi kunde lösa problemen som kunden och användarna stod inför började jag ta fram prototyper. Först på papper, som jag snabbt stämde av med teamet, och därefter i Figma för mer detaljerade feedbacksessioner med teamet, våra referenskunder och användare. Vi itererade med prototyper och användartester tills vi landade i något som vi kände fungerade.",
          body4: "Designen bestod av två huvuddelar: en innehållshanteringsdel där Epirocs användare kunde hantera innehåll som produkter, frågor, media, länkar, stilar, översättningar direkt i gränssnittet och andra resurser, samt en portal där kunderna enkelt kunde söka efter och hitta den hjälp de behövde.",
          body5: "Löpande genom utvecklingscykeln bröt vi ner designen i user story maps och value slices för att prioritera de uppgifter som gav mest värde med minst insats.",
          body6: "Som utvecklingsteam arbetade vi med Extreme Programming i korta iterationer med täta återkopplingar, designuppdateringar, utveckling, testning och kunddemos. Arbetssättet gjorde att vi snabbt kunde validera om vi var på rätt spår och justera arbetet när det behövdes.",
          body7: "Arbetssättet i Extreme Programming minimerade kontextbyten, höll alla i teamet samspelta kring vad vi arbetade med, gjorde alla delaktiga, minskade personberoendet och sänkte antalet buggar som nådde slutanvändarna avsevärt.",
          caption1: "Bild från seannhicks.com",
          body8: "Genom hela processen hade vi nära kontakt med användarna, samlade kontinuerligt in deras feedback och vävde in den i våra designprototyper och utvecklingsiterationer. Vi gjorde små och täta releaser, vilket gjorde att användarna kände att deras feedback togs på allvar och att de var delaktiga hela vägen. Under en särskilt produktiv vecka gjorde vi 5 releaser på 5 dagar, där varje release levererade tydligt värde till olika användare, utan att en enda bugg* rapporterades. Vi kallade det för vår ”perfekta vecka”.",
          body9: "*Buggar rapporterades sällan under utvecklingen eller från produktion, även om frånvaron av rapporterade buggar inte betyder att de inte finns. Vi upplevde ändå en enorm kvalitetshöjning när vi började arbeta med Extreme Programming i stället för vårt gamla, individuella uppgiftsbaserade arbetssätt.",
          body10: '<a href="https://www.media.epiroc.com/en/search-results?filters=properties/products/drill-rigs-and-rock-drills&amp;sort=most_relevant" target="_blank" rel="noopener">*Alla marknadsföringsbilder tillhör Epiroc.</a>',
        },
      },
    },
  },
});

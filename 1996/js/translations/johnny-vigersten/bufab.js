/* True Friends — Bufab reference case translations
 *
 * Adds Bufab-only case-study copy onto TF_TRANSLATIONS. Shared
 * refCase section labels ("About", "My role", "Workflow" …) live in
 * js/translations/common.js.
 */
window.TF_ADD_TRANSLATIONS({
  en: {
    refCases: {
      bufab: {
        about: {
          lede: "Bufab is a global full service partner for C-parts. They reached out to us when I was working at Nethouse and of course we answered.",
          body1: "Bufab needed to solve many different problems. Some for the people working with sales and trading between customers and manufacturing suppliers, and some for the manufacturing suppliers themselves.",
          body2: "We quickly came to the conclusion that this would require two custom built systems that integrated with each other.",
          body3: "One system would allow Bufab to add manufacturing suppliers in a portal. The suppliers contained detailed information about their manufacturing capabilities, ISO certifications and contact information. The suppliers could also update their own capabilities and certifications via a shared link if they where to change. In this portal Bufab could search and filter the suppliers by criteria such as manufacturing capabilities, certification and location.",
          body4: "The other system replaced a huge Excel that they had worked with for a long time. It was an interactive RFQ (Request for quotation) configurator. The sales personnel could create customer requests, set manufacturing criteria, price items and send quotations to customers almost instantly. The system could match items requested from customers with suppliers manufacturing capabilities via an integration to the other system. This enabled suppliers to quickly respond to new RFQs and provided a streamlined flow from RFQ to sale for everyone involved.",
        },
        myRole: {
          body1: "My role in this project was to design the User Experience, User Interface and lead the testing. The system was branded according to Bufab’s styling guide.",
        },
        workflow: {
          body1: "Our work started with a few days of workshops at our office together with the product owners from Bufab and a few of their sales and supplier personnel that was assigned the roles of super users. During the workshops we tried to understand their problems, their day to day and their workflow. We also did several visits to their offices and warehouse to gain further insights into their daily work.",
          caption1: "I created a fun little timeline that we put up in the team room to visualize our sprints and our various activities. We required at least one day of Extreme/Mob programming, internally we called this PÖBEL.",
          body2: "In the design process we analysed the insights that we had gathered during our workshops and field visits. We clustered business goals, user needs, problems, workflows and mapped it to user flows for the systems. We refined our ideas regularly with the stakeholders and super users.",
          body3: "The design process was continuous throughout the entire project. I worked a lot with prototyping of the systems to present our ideas to the customer, discuss the flows and functions with them and their users to test it and gather feedback before we started to build it. This iterative process was ongoing and helped us to gain a common understanding on what and how the feature/flow was going to work and look, it also minimised the risk for surprises and misunderstanding.",
          caption2: "A picture of my very cluttered notebook, fully encrypted.",
          body4: "During all of this I also managed the testing part of this project. I worked a lot with prioritising our testing efforts based on risk and our identified quality criterias. The testing efforts included integration testing, APIs, functional, backend, browser and OS compatibility, frontend, usability, exploratory testing and verification tests. I held testing sessions each sprint with the entire development team as well as with Bufab personnel in acceptance testing and user testing (I didn't tell them what to test but I guided and help them).",
          caption3: "Two examples of my mind maps. Mind mapping is a vital tool in my workflow, supporting everything from research and visualization to design and testing activities.",
          body5: "The end result of all this work was two systems that transformed Bufab's operations. They received a maintainable and accessible supplier portal and an intuitive RFQ sales process which improved the efficiency for their sales personnel and supplier managers as well as also getting more enjoyable systems to work with on a daily basis.",
        },
      },
    },
  },

  sv: {
    refCases: {
      bufab: {
        about: {
          lede: "Bufab är en global leverantör av C-parts. De hörde av sig till Nethouse medans jag arbetade där och självklart svarade vi.",
          body1: "Bufab behövde lösa flera olika problem. Dels för dem som arbetade med försäljning och handel mellan kunder och tillverkande leverantörer, och dels för de tillverkande leverantörerna själva.",
          body2: "Vi kom snabbt fram till att det skulle kräva två specialbyggda system som integrerade väl med varandra.",
          body3: "Det ena systemet gjorde det möjligt för Bufab att lägga upp tillverkande leverantörer i en portal. Varje leverantör innehöll detaljerad information om sina tillverkningsmöjligheter, ISO-certifieringar och kontaktuppgifter. Leverantörerna kunde också uppdatera sina egna uppgifter och certifieringar via en delad länk om något behövde ändras. I portalen kunde Bufab söka och filtrera leverantörer utifrån kriterier som tillverkningsmöjligheter, certifiering och geografiskt läge.",
          body4: "Det andra systemet ersatte ett enormt Excel-ark som de hade arbetat med under lång tid. Det var en interaktiv RFQ-konfigurator (Request for Quotation). Säljarna kunde skapa kundförfrågningar, ange tillverkningskriterier, prissätta artiklar och skicka offerter till kunderna nästan omgående. Systemet kunde matcha de artiklar som kunderna efterfrågade mot leverantörernas tillverkningsmöjligheter via en integration mot det andra systemet. Det gjorde att leverantörerna snabbt kunde svara på nya förfrågningar och gav ett strömlinjeformat flöde från förfrågan till affär för alla inblandade.",
        },
        myRole: {
          body1: "Min roll i projektet var att designa användarupplevelsen och användargränssnittet samt att leda testarbetet. Systemet formgavs enligt Bufabs grafiska profil.",
        },
        workflow: {
          body1: "Arbetet började med några dagars workshops på vårt kontor tillsammans med produktägarna från Bufab och några av deras sälj- och leverantörsansvariga som fick rollen som super-users. Under våra workshops försökte vi förstå deras problem, vardag och arbetsflöde. Vi gjorde flera besök på deras kontor och lager för att få djupare insikter i det dagliga arbetet.",
          caption1: "Jag gjorde en liten rolig tidslinje som vi satte upp i teamrummet för att visualisera våra sprintar och våra olika aktiviteter. Vi krävde minst en dag av Extreme/Mob-programmering i teamet, internt kallade vi det för PÖBEL.",
          body2: "I designprocessen analyserade vi de insikter vi samlat in under workshops och besök på plats. Vi grupperade affärsmål, användarbehov, problem och arbetsflöden och översatte dem till användarflöden för systemen. Vi förfinade våra idéer löpande tillsammans med kunden och deras super-users.",
          body3: "Designarbetet pågick löpande genom hela projektet. Jag arbetade mycket med prototyper av systemen för att presentera våra idéer för kunden, diskutera flöden och funktioner med dem och deras användare, testa dem och samla in feedback innan vi började bygga. Den iterativa processen pågick hela tiden och hjälpte oss att nå en gemensam bild av vad funktionen eller flödet skulle göra och hur det skulle se ut. Den minskade också risken för överraskningar och missförstånd.",
          caption2: "En bild på mitt snabbt kladdade anteckningsblock, helt krypterat.",
          body4: "Parallellt med allt detta ansvarade jag också för testarbetet i projektet. Jag lade mycket tid på att prioritera testinsatserna utifrån risk och de kvalitetskriterier vi identifierat. Testningen omfattade integrationstester, API:er, funktionella tester, backend, webbläsar- och OS-kompatibilitet, frontend, användbarhet, utforskande testning och verifieringstester. Varje sprint höll jag testsessioner med hela utvecklingsteamet och även med Bufabs personal i acceptanstester och användartester (jag talade inte om för dem vad de skulle testa, men jag vägledde och hjälpte dem).",
          caption3: "Två exempel på mina mindmaps. Mindmapping är ett centralt verktyg i mitt arbetssätt och stöttar allt från research och visualisering till design- och testaktiviteter.",
          body5: "Slutresultatet av allt detta arbete blev två system som förändrade Bufabs verksamhet. De fick en förvaltningsbar och tillgänglig leverantörsportal och en intuitiv RFQ-säljprocess som ökade effektiviteten för både säljare och leverantörsansvariga och dessutom system som var roligare att arbeta i till vardags.",
        },
      },
    },
  },
});

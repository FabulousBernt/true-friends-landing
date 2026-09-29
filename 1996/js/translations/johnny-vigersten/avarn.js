/* True Friends — Avarn reference case translations
 *
 * Adds Avarn-only case-study copy onto TF_TRANSLATIONS. Shared
 * refCase section labels ("About", "My role", "Workflow" …) live in
 * js/translations/common.js.
 */
window.TF_ADD_TRANSLATIONS({
  en: {
    refCases: {
      avarn: {
        about: {
          lede: "Avarn Security Group (formerly known as Nokas) reached out to Nethouse while I was working there. They needed a system to help them improve their sales process of alarms and surveillance equipment.",
          body1: "Their sales personnel where equipped with tablets on which they entered sale information and showed customers the equipment. The idea was to use these tablets with a custom built system that streamlined and improve this process.",
          body2: "The system that we built enabled the sales personnel to create new projects for each unique sale. The first step in each project was to add customer information and contact details. The second step  was to take a photograph of the floor plan that sits at the entrance of every commercial building in Sweden. The photograph was then used as the “background” in the new project, the users could search for various equipment and drag and drop them on the floor plan to instantly show the customer where each alarm, camera and other equipment would be mounted and map out the installation.",
          body3: "The system also calculated pricing and materials in real-time, allowing the sales representatives to generate and send very detailed quotations and installation plans directly to customers on the spot. ",
          body4: "The sales configurator (as we called it) was also accompanied by a backend system where backend users could add new equipment, upload icons to each item that where used to show the item on the map, add pricing and other material that was needed for each item.",
          body5: "The end result and reception for this system from the users where great. They loved to be able to live-edit the project in front of the customer, which enabled them to discuss and collaborate with the customer about equipment, possibilities and quickly generating a quotation with no lead-time. This kind of visualisation really helped the sales personnel and was very appreciated.",
          caption: "Image by <a href='https://unsplash.com/@samuelbryngelsson' target='_blank' rel='noopener'>samuelbryngelsson</a>",
        },
        myRole: {
          body1: "My role in this project was to design the User Experience, User Interface, the components used to build it and lead the testing. The system was branded according to Avarns styling guide.",
        },
        workflow: {
          body1: "As usual in our team we worked iteratively in sprints in this project. We started by meeting and talking to the customer and their users to gain as much understanding about their daily work as possible. This research continued throughout the project when we developed new areas and designed new prototypes to make sure that we where on the right track.",
          body2: "The design process was as per usual heavily focused on understanding the user needs, mapping their workflows in user story maps. I iterated quickly on the user flows and the UI design and presented my prototypes to the customer on a regular basis. I also tested my prototypes on them to make sure that they felt the solution was good and actually solved the problems they where having, after this the developers started working on the function, user flow or area that I had designed. ",
          body3: "The testing process began at the same time as the design process started. By understanding the customer, requirements, technical design set up by the developers, users and their environments as well as the technical devices to be used in order to prioritise the testing efforts. By incorporating testing early in the process we identified risks and worked as proactively as we possible could to minimise these risks that could cause potential problems further down the road.",
          body4: "The testing involved functional, backend, frontend, compatibility, hardware, usability, exploratory testing as well as test planning, test strategy and test design. I involved the entire team in testing sessions, ensuring continuous feedback and improvement during each iteration as well as user testing with the customer. I also coached and helped the customer to organise themselves to perform acceptance tests before the delivery of each iteration and the full system.",
        },
      },
    },
  },

  sv: {
    refCases: {
      avarn: {
        about: {
          lede: "Avarn Security Group (tidigare Nokas) kontaktade Nethouse medan jag arbetade där. De behövde ett system som kunde förbättra deras säljprocess för larm och övervakningsutrustning.",
          body1: "Deras säljare var utrustade med surfplattor där de registrerade säljinformation och visade utrustningen för kunderna. Tanken var att använda plattorna tillsammans med ett specialbyggt system som effektiviserade och förbättrade processen.",
          body2: "Systemet vi byggde gjorde det möjligt för säljarna att skapa ett nytt projekt för varje enskild affär. Det första steget i varje projekt var att lägga in kunduppgifter och kontaktinformation. Det andra steget var att fotografera den planritning som sitter i entrén till varje kommersiell fastighet i Sverige. Fotot användes sedan som ”bakgrund” i det nya projektet, och användarna kunde söka fram olika larmkomponenter och dra och släppa dom på ritningen för att direkt visa kunden var varje larm, kamera och annan utrustning skulle monteras och kartlägga installationen.",
          body3: "Systemet räknade också ut priser och material i realtid, vilket gjorde att säljarna kunde generera och skicka mycket detaljerade offerter och installationsplaner direkt till kunden på plats.",
          body4: "Säljkonfiguratorn, som vi kallade den, kompletterades av ett backendsystem där administratörer kunde lägga till ny utrustning, ladda upp ikoner för varje artikel som användes för att visa den på ritningen, samt lägga in priser och annat material som behövdes för respektive artikel.",
          body5: "Slutresultatet och mottagandet från användarna var mycket bra. De uppskattade att kunna redigera projektet live framför kunden, vilket gjorde att de kunde diskutera och samarbeta med kunden kring utrustning och möjligheter och snabbt ta fram en offert utan ledtid. Den här typen av visualisering hjälpte säljarna och var mycket uppskattad.",
          caption: "Bild av <a href='https://unsplash.com/@samuelbryngelsson' target='_blank' rel='noopener'>samuelbryngelsson</a>",
        },
        myRole: {
          body1: "Min roll i projektet var att designa användarupplevelsen, användargränssnittet och de komponenter som systemet byggdes av, samt att leda testarbetet. Systemet formgavs enligt Avarns grafiska profil.",
        },
        workflow: {
          body1: "Som vanligt i vårt team arbetade vi iterativt i sprintar. Vi började med att träffa och prata med kunden och deras användare för att förstå deras vardagliga arbete så väl som möjligt. Den researchen fortsatte genom hela projektet när vi utvecklade nya områden och tog fram nya prototyper, för att säkerställa att vi var på rätt spår.",
          body2: "Designprocessen var som vanligt starkt fokuserad på att förstå användarnas behov och kartlägga deras arbetsflöden i user story maps. Jag itererade snabbt på användarflödena och gränssnittsdesignen och presenterade mina prototyper för kunden löpande. Jag testade också prototyperna på dem för att säkerställa att de tyckte att lösningen var bra och faktiskt löste de problem de hade. Därefter började utvecklarna arbeta med den funktion, det användarflöde eller det område som jag hade designat.",
          body3: "Testarbetet startade samtidigt som designarbetet. Genom att sätta oss in i kunden, kraven, den tekniska lösning som utvecklarna byggde upp, användarna och deras miljöer samt de enheter som skulle användas kunde vi prioritera testinsatserna. Genom att få in testningen tidigt i processen identifierade vi risker och arbetade så proaktivt vi kunde för att minimera de risker som annars kunde ställa till problem längre fram.",
          body4: "Testningen omfattade funktionella tester, backend, frontend, kompatibilitet, hårdvara, användbarhet och utforskande testning, liksom testplanering, teststrategi och testdesign. Jag involverade hela teamet i testsessioner för att säkerställa kontinuerlig återkoppling och förbättring under varje iteration, och vi genomförde även användartester med kunden. Jag coachade dessutom och hjälpte kunden att organisera sig för att kunna genomföra acceptanstester inför leveransen av varje iteration och av hela systemet.",
        },
      },
    },
  },
});

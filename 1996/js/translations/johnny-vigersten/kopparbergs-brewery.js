/* True Friends — Kopparbergs Brewery reference case translations
 *
 * Adds Kopparbergs-only case-study copy onto TF_TRANSLATIONS. Shared
 * refCase section labels ("About", "My role", "Workflow" …) live in
 * js/translations/common.js.
 */
window.TF_ADD_TRANSLATIONS({
  en: {
    refCases: {
      kopparbergsBrewery: {
        about: {
          lede: "While I was working at Nethouse, we were approached by Kopparbergs Brewery & Örebro University to do a proof of concept.",
          body1: "Kopparbergs needed a solution to help train their summer employees on setting up the machines in the brewery for different drinks, bottles and can sizes, both faster and with less failure rates. We utilised Microsofts HoloLens to demonstrate how augmented reality could be applied to help them solve this problem.",
          caption: "Microsoft HoloLens",
        },
        myRole: {
          body1: "My role in this project was to design the UI and interaction points for the solution. In addition to designing the user interface, I also tested the product.",
          body2: "The HoloLens was entirely new to me and having never used one before, both designing and testing this solution meant new exciting challenges, lessons learned and a large amount of personal development.",
          caption: "A photo of me using the HoloLens.",
        },
        workflow: {
          body1: "This project was initialised as a proof of concept and co-financed with Örebro University. It had a small budget cap and a very limited timeframe to be completed. We set out to do the most of what we could with the time given to us.",
          body2: "Just like any other project we started by meeting the customer. We traveled to the Brewery to meet directly with the brewing master and employees and to get a tour of the brewery to gain deeper insights. During the visit we did research by asking questions, observed and took notes about the environment, technical and human challenges, their workflow, what their day-to-day looked like and what problems they experienced.",
          body3: "Back at the office I started analysing the data that we gathered. The product needed to seamlessly integrate a user interface with real-world environments and assist with complex machine setups. I started using user journeys to map out each flow, I drew  inspiration from video games, sci-fi movies, and of course Microsoft demo videos about the HoloLens capabilities. These elements helped me iterate towards the final solution.",
          body4: "The solution began with the user putting on the HoloLens headset and launching a native-built application. The app consisted of a menu in the center of the field of view, allowing the user to select a brewing recipe. Once selected, the menu moved over to the left and a live arrow appeared at the top center of the field of view, guiding the user to the first step of the recipe (which where a part of the machine). The arrow adjusted dynamically as the user moved just like in a video game.",
          body5: "On the left side of the field of view the recipe steps were always visible, providing instructions such as: “Set X to 5.5mm” or “Attach THIS to Y”. After completing a step the user marked it as done. The interface then updated the progress, displayed the next step, and redirected the arrow to guide the user to the following task.",
          body6: "The solution allowed for a clear and intuitive process, ensuring users could follow each step accurately and efficiently. The project reduced training time for new employees, improved the quality of machine setups and minimised the risk of human error.",
          caption: "Image from an <a href='https://www.svt.se/nyheter/lokalt/orebro/verklighetsblandande-teknik-ska-utbilda-arbetare-genom-specialglasogon' target='_blank' rel='noopener'>article at SVT</a> of an employee using the HoloLens.",

        },
      },
    },
  },

  sv: {
    refCases: {
      kopparbergsBrewery: {
        about: {
          lede: "När jag arbetade på Nethouse blev vi kontaktade av Kopparbergs Bryggeri och Örebro universitet för att göra ett proof of concept.",
          body1: "Kopparbergs behövde en lösning som kunde hjälpa deras sommarvikarier att ställa in bryggeriets maskiner för olika drycker, flaskor och burkstorlekar. Detta för att korta ner inlärningsprocessen och minska risken för fel. Vi använde Microsofts HoloLens för att visa hur Augmented Reality kunde tillämpas för att lösa problemet.",
          caption: "Microsoft HoloLens",
        },
        myRole: {
          body1: "Min roll i projektet var att designa gränssnittet och interaktionspunkterna för lösningen. Utöver att designa användargränssnittet testade jag även produkten.",
          body2: "HoloLens var helt nytt för mig och eftersom jag aldrig hade använt ett tidigare innebar både designen och testningen av lösningen nya spännande utmaningar, lärdomar och en hel del personlig utveckling.",
          caption: "Ett foto på mig när jag använder HoloLens.",
        },
        workflow: {
          body1: "Projektet startade som ett proof of concept och samfinansierades med Örebro universitet. Det hade ett litet budgettak och en mycket begränsad tidsram. Vi gjorde allt vi kunde för att få ut så mycket som möjligt av den tid vi hade.",
          body2: "Precis som i alla andra projekt började vi med att träffa kunden. Vi åkte till bryggeriet för att träffa bryggmästaren och de anställda på plats och för att få en rundtur som gav oss djupare insikter. Under besöket gjorde vi research genom att ställa frågor, observera och anteckna kring arbetsmiljön, tekniska och mänskliga utmaningar, deras arbetsflöde, övrigt kring hur deras vardag såg ut och vilka problem de upplevde.",
          body3: "Väl tillbaka på kontoret började vi analysera datan vi samlat in. Produkten behövde väva samman användargränssnittet med den fysiska miljön utan att vara ivägen och samtidigt hjälpa till vid komplexa maskininställningar. Jag använde user journeys för att kartlägga varje flöde och hämtade inspiration från tv-spel, sci fi-filmer och såklart Microsofts demovideor om vad HoloLens klarade av. De delarna hjälpte mig att iterera fram den slutgiltiga lösningen.",
          body4: "Lösningen började med att användaren tog på sig HoloLens och startade en nativebyggd applikation. Appen bestod av en meny mitt i synfältet där användaren kunde välja ett bryggrecept. När receptet var valt flyttades menyn åt vänster och en pil dök upp högst upp i mitten av synfältet som ledde användaren till receptets första steg (som var en del av maskinen). Pilen justerades dynamiskt när användaren rörde sig, precis som i ett tv-spel, och pekade användaren i rätt riktning.",
          body5: "På vänster sida av synfältet var receptets steg alltid synliga med instruktioner som: ”Ställ in X på 5,5 mm” eller ”Fäst DEN HÄR på Y”. När ett steg var klart markerade användaren det som slutfört. Gränssnittet uppdaterade då förloppet, visade nästa steg och riktade om pilen mot nästa uppgift.",
          body6: "Lösningen gav en tydlig och intuitiv process där användarna kunde följa varje steg korrekt och effektivt. Projektet kortade upplärningstiden för nyanställda, höjde kvaliteten på maskininställningarna och minimerade risken för mänskliga fel.",
          caption: "Bild från en <a href='https://www.svt.se/nyheter/lokalt/orebro/verklighetsblandande-teknik-ska-utbilda-arbetare-genom-specialglasogon' target='_blank' rel='noopener'>artikel hos SVT</a> på en anställd som använder HoloLens.",
        },
      },
    },
  },
});

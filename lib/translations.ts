import type { Translations } from "./types";

export const translations: Record<"en" | "cz", Translations> = {
  en: {
    langToggle: "CZ",
    nav: {
      personas: "For whom",
      spaces: "Spaces",
      contribute: "Join",
      join: "Contact",
    },
    hero: {
      tag: "Concept in progress",
      headline: "A place where you go for a few hours to truly create something",
      sub: "Calm workspaces in nature and cities, close to you. No commute, no distractions. Subscribe, show up, focus.",
      cta: "Let me know",
      ctaSub: "Be among the first to learn about the launch",
    },
    problem: {
      tag: "The Problem",
      headline: "The office is far. Home is loud. There's nothing in between.",
      items: [
        {
          title: "Commuting kills your day",
          text: "Hours lost in traffic. By the time you arrive, half your energy is gone.",
        },
        {
          title: "Home isn't for work",
          text: "Kids, deliveries, chores. Your brain never fully switches to work mode. Home should be for living.",
        },
        {
          title: "Where else can you go?",
          text: "Cafés are loud, coworking is expensive. There's no creative third place close to where you actually live.",
        },
      ],
    },
    solution: {
      tag: "The Third Place",
      headline: "Closer than the office. Calmer than home.",
      text: "CalmPod places small, beautifully designed workspaces in forgotten spots near you — parks, forests, lakesides, quiet neighborhoods. A dedicated space for focus and creativity, just around the corner.",
      badge: "0 min",
      badgeSub: "commute",
    },
    personas: {
      tag: "For whom",
      headline: "One place. A thousand reasons to come.",
      sub: "CalmPod is for anyone who wants to create, learn, or connect — wherever they are.",
      personas: [
        {
          title: "Creators",
          description: "Need inspiration and new environments. Writers, designers, filmmakers.",
          icon: "PaintBrush",
        },
        {
          title: "Builders",
          description: "Need focus and project space. Developers, entrepreneurs, makers.",
          icon: "Code",
        },
        {
          title: "Learners",
          description: "Want to read, research with AI, educate themselves. Lifelong students.",
          icon: "BookOpen",
        },
        {
          title: "Parents",
          description: "Need flexible places close to daily life. Two hours of deep focus between pickups.",
          icon: "Heart",
        },
        {
          title: "Communities",
          description: "Need shared social infrastructure. Meetups, workshops, local talks.",
          icon: "UsersThree",
        },
        {
          title: "Mentors",
          description: "Want to share knowledge. Host small workshops and 1:1 sessions.",
          icon: "Chalkboard",
        },
        {
          title: "Explorers",
          description: "Want beautiful places and new experiences. Combine travel with creation.",
          icon: "Compass",
        },
        {
          title: "Remote workers",
          description: "Need alternatives to home and cafés. Quiet, equipped, nearby.",
          icon: "Laptop",
        },
      ],
    },
    gallery: {
      tag: "The Spaces",
      headline: "Designed for focus",
      sub: "Panoramic windows. Ergonomic setup. Air conditioning. Fast WiFi. A kitchen corner for coffee. Space to meet others.",
    },
    hosts: {
      tag: "CalmPod Hosts",
      headline: "Own forgotten land? Give it purpose.",
      text: "We install the pod, bring the brand, tech, and customers. You provide the location. Together we bring life to unused spaces and create passive income for you.",
      perks: [
        "Turnkey pod installation",
        "Revenue share model",
        "Revive unused land",
        "CalmPod brand & community",
      ],
      cta: "Become a Host",
    },
    futureNetwork: {
      tag: "Vision",
      headline: "From one pod to a network.",
      text: "We start with one. Then ten. Every city, every village, every beautiful place. A distributed infrastructure for human creativity.",
      counter: "locations",
      counterSub: "planned across Czech Republic",
    },
    contribute: {
      tag: "Join us",
      headline: "We're building this together.",
      cards: [
        {
          title: "Suggest a Pod",
          description: "What kind of space do you dream about? Tell us your ideal pod.",
          cta: "Share your idea",
        },
        {
          title: "Suggest a Location",
          description: "Know a perfect spot? A forgotten place that deserves life?",
          cta: "Pin on map",
        },
        {
          title: "Early Access",
          description: "Be among the first to experience CalmPod. Shape the future with us.",
          cta: "Get early access",
        },
      ],
      mapPickerTitle: "Pin a location on the map",
      mapPickerConfirm: "Submit location",
      mapPickerHint: "Click on the map to place a pin",
    },
    discord: {
      headline: "Join the community",
      text: "Share ideas and inspiration with other creatives.",
      cta: "Discord",
    },
    waitlist: {
      tag: "Contact",
      headline: "Interested? Get in touch.",
      sub: "Write to us or join the community",
      placeholder: "your@email.com",
      namePlaceholder: "Your name",
      messagePlaceholder: "Your message...",
      formTitle: "Write to us",
      discordTitle: "Join Discord",
      discordText: "Discuss with us and other creatives. Share ideas, places, and inspiration.",
      cta: "Send message",
      success: "Sent! We'll get back to you.",
    },
    footer: {
      copy: "© 2026 CalmPod",
      tagline: "Deep Work Pods",
      contact: "support@calmpod.cz",
      links: ["Privacy", "Contact"],
      privacy: "Privacy Policy",
    },
    privacy: {
      consent: "I consent to the processing of my personal data for the purpose of processing my suggestion.",
      link: "Privacy Policy",
    },
  },
  cz: {
    langToggle: "EN",
    nav: {
      personas: "Pro koho",
      spaces: "Prostory",
      contribute: "Přidej se",
      join: "Kontakt",
    },
    hero: {
      tag: "Koncept v přípravě",
      headline: "Místo, kam si jdeš na pár hodin opravdu něco vytvořit",
      sub: "Klidné pracovní prostory v přírodě i ve městě, blízko tebe. Bez dojíždění, bez rušení. Předplať si, přijď, soustřeď se.",
      cta: "Dej mi vědět",
      ctaSub: "Buď mezi prvními, kdo se dozví o spuštění",
    },
    problem: {
      tag: "Problém",
      headline: "Kancelář je daleko. Doma je hluk. Mezi tím nic není.",
      items: [
        {
          title: "Dojíždění zabíjí den",
          text: "Hodiny v dopravě. Než dorazíš, půlka energie je pryč.",
        },
        {
          title: "Doma se nepracuje",
          text: "Děti, zásilky, domácnost. Mozek se nikdy nepřepne do práce. Doma se má žít a relaxovat.",
        },
        {
          title: "Kam jinam jít?",
          text: "Kavárny jsou hlučné, coworking drahý. Žádné kreativní třetí místo blízko bydliště neexistuje.",
        },
      ],
    },
    solution: {
      tag: "Třetí místo",
      headline: "Bližší než kancelář. Tišší než domov.",
      text: "CalmPod umísťuje malé, krásně navržené pracovní prostory na zapomenutá místa poblíž — parky, lesy, jezera, tiché čtvrti. Dedikovaný prostor pro soustředění a kreativitu, hned za rohem.",
      badge: "0 min",
      badgeSub: "dojíždění",
    },
    personas: {
      tag: "Pro koho",
      headline: "Jedno místo. Tisíc důvodů přijít.",
      sub: "CalmPod je pro každého, kdo chce tvořit, učit se nebo se propojit — kdekoliv je.",
      personas: [
        {
          title: "Tvůrci",
          description: "Potřebují inspiraci a nová prostředí. Spisovatelé, designéři, filmaři.",
          icon: "PaintBrush",
        },
        {
          title: "Stavitelé",
          description: "Potřebují soustředění a prostor pro projekty. Vývojáři, podnikatelé, makeři.",
          icon: "Code",
        },
        {
          title: "Studenti",
          description: "Chtějí číst, zkoumat s AI, vzdělávat se. Celoživotní studenti.",
          icon: "BookOpen",
        },
        {
          title: "Rodiče",
          description: "Potřebují flexibilní místa blízko denního života. Dvě hodiny soustředění mezi vyzvedáváním.",
          icon: "Heart",
        },
        {
          title: "Komunity",
          description: "Potřebují sdílenou sociální infrastrukturu. Setkání, workshopy, lokální přednášky.",
          icon: "UsersThree",
        },
        {
          title: "Mentoři",
          description: "Chtějí sdílet znalosti. Pořádat malé workshopy a individuální konzultace.",
          icon: "Chalkboard",
        },
        {
          title: "Průzkumníci",
          description: "Chtějí krásná místa a nové zážitky. Spojit cestování s tvorbou.",
          icon: "Compass",
        },
        {
          title: "Na dálku",
          description: "Potřebují alternativy k domovu a kavárnám. Ticho, vybavení, blízkost.",
          icon: "Laptop",
        },
      ],
    },
    gallery: {
      tag: "Prostory",
      headline: "Navrženo pro soustředění",
      sub: "Panoramatická okna. Ergonomické vybavení. Klimatizace. Rychlé WiFi. Kuchyňský koutek na kafe. Prostor na setkání.",
    },
    hosts: {
      tag: "CalmPod Hostitelé",
      headline: "Máš nevyužitý pozemek? Dej mu smysl.",
      text: "My nainstalujeme pod, přineseme značku, tech a zákazníky. Ty poskytneš místo. Společně oživíme zapomenuté prostory a vytvoříme ti pasivní příjem.",
      perks: [
        "Kompletní instalace podu",
        "Model sdílení příjmů",
        "Oživení nevyužité půdy",
        "Značka & komunita CalmPod",
      ],
      cta: "Stát se hostitelem",
    },
    futureNetwork: {
      tag: "Vize",
      headline: "Od jednoho podu k síti.",
      text: "Začínáme jedním. Pak deset. Každé město, každá vesnice, každé krásné místo. Distribuovaná infrastruktura pro lidskou kreativitu.",
      counter: "lokací",
      counterSub: "plánovaných po celé České republice",
    },
    contribute: {
      tag: "Připoj se",
      headline: "Budujeme to společně.",
      cards: [
        {
          title: "Navrhni pod",
          description: "O jakém prostoru sníš? Řekni nám svůj ideální pod.",
          cta: "Sdílej nápad",
        },
        {
          title: "Navrhni místo",
          description: "Znáš perfektní lokalitu? Zapomenuté místo, které si zaslouží život?",
          cta: "Označ na mapě",
        },
        {
          title: "Early Access",
          description: "Buď mezi prvními, kdo zažije CalmPod. Utváříme budoucnost společně.",
          cta: "Získej přístup",
        },
      ],
      mapPickerTitle: "Označ místo na mapě",
      mapPickerConfirm: "Odeslat lokaci",
      mapPickerHint: "Klikni na mapu pro umístění pinu",
    },
    discord: {
      headline: "Připoj se ke komunitě",
      text: "Sdílej nápady a inspiraci s dalšími kreativci.",
      cta: "Discord",
    },
    waitlist: {
      tag: "Kontakt",
      headline: "Máš zájem? Ozvi se.",
      sub: "Napiš nám nebo se připoj ke komunitě",
      placeholder: "tvuj@email.cz",
      namePlaceholder: "Tvoje jméno",
      messagePlaceholder: "Tvoje zpráva...",
      formTitle: "Napiš nám",
      discordTitle: "Připoj se na Discord",
      discordText: "Diskutuj s námi a dalšími kreativci. Sdílej nápady, místa a inspiraci.",
      cta: "Odeslat zprávu",
      success: "Odesláno! Ozveme se.",
    },
    footer: {
      copy: "© 2026 CalmPod",
      tagline: "Deep Work Pods",
      contact: "support@calmpod.cz",
      links: ["Soukromí", "Kontakt"],
      privacy: "Ochrana osobních údajů",
    },
    privacy: {
      consent: "Souhlasím se zpracováním osobních údajů za účelem zpracování mého návrhu.",
      link: "Zásady ochrany osobních údajů",
    },
  },
};

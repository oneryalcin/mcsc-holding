import type { Locale } from '../i18n/utils';

export interface NetworkEntry {
  name: string;
  url: string;
  logo?: string;
  desc: Record<Locale, string>;
}

export const partnerships: NetworkEntry[] = [
  {
    name: 'LSA',
    url: 'https://legacysportart.com',
    logo: '/images/network/lsa.avif',
    desc: {
      en: "The goal of Legacy Sport & Art Management (LSA) is bridging the worlds of sports and arts.\n\nThe mission of LSA is to create global opportunities for our talents — whether it's athletic careers, artistic representation, or inspiring collaborations. We believe that passion, creativity, and perseverance shape legacy. The company's founders recognized that athletes and artists face similar challenges and opportunities: they need professional representation that focuses not only on managing their careers but also on their long-term development and creating international opportunities.",
      fr: "L'objectif de Legacy Sport & Art Management (LSA) est de relier les mondes du sport et de l'art.\n\nLa mission de LSA est de créer des opportunités mondiales pour nos talents — qu'il s'agisse de carrières sportives, de représentation artistique ou de collaborations inspirantes. Nous croyons que la passion, la créativité et la persévérance forgent l'héritage. Les fondateurs de l'entreprise ont reconnu que les athlètes et les artistes font face à des défis et des opportunités similaires : ils ont besoin d'une représentation professionnelle qui se concentre non seulement sur la gestion de leur carrière, mais aussi sur leur développement à long terme et la création d'opportunités internationales.",
      it: "L'obiettivo di Legacy Sport & Art Management (LSA) è quello di unire i mondi dello sport e dell'arte.\n\nLa missione di LSA è creare opportunità globali per i nostri talenti — che si tratti di carriere atletiche, rappresentanza artistica o collaborazioni ispiratrici. Crediamo che passione, creatività e perseveranza plasmino l'eredità. I fondatori dell'azienda hanno riconosciuto che atleti e artisti affrontano sfide e opportunità simili: necessitano di una rappresentanza professionale che si concentri non solo sulla gestione delle loro carriere, ma anche sul loro sviluppo a lungo termine e sulla creazione di opportunità internazionali.",
    },
  },
  {
    name: 'Coldwell Banker',
    url: 'https://www.coldwellbankerluxury.it',
    logo: '/images/network/coldwell-banker.png',
    desc: {
      en: "The Coldwell Banker Global Luxury℠ program redefines the world of luxury real estate marketing. The prestige of the Coldwell Banker® name, combined with state-of-the-art technology, bespoke marketing strategies and one of real estate's most robust global networks encompassing 96,000 independent sales associates in approximately 3,000 offices in 40 countries and territories, culminates in extraordinary representation that crosses oceans, continents and language barriers.",
      fr: "Le programme Coldwell Banker Global Luxury℠ redéfinit l'univers du marketing immobilier de luxe. Le prestige du nom Coldwell Banker®, associé à une technologie de pointe, à des stratégies marketing sur mesure et à l'un des réseaux mondiaux les plus solides de l'immobilier — comptant 96 000 agents commerciaux indépendants dans environ 3 000 bureaux répartis dans 40 pays et territoires — aboutit à une représentation exceptionnelle qui franchit océans, continents et barrières linguistiques.",
      it: "Il programma Coldwell Banker Global Luxury℠ ridefinisce il mondo del marketing immobiliare di lusso. Il prestigio del nome Coldwell Banker®, unito a tecnologie all'avanguardia, strategie di marketing su misura e a una delle reti globali più solide del settore immobiliare — che comprende 96.000 agenti indipendenti in circa 3.000 uffici distribuiti in 40 paesi e territori — culmina in una rappresentanza straordinaria che attraversa oceani, continenti e barriere linguistiche.",
    },
  },
];

export const providers: NetworkEntry[] = [
  {
    name: 'Fidinam',
    url: 'https://www.fidinam.com',
    logo: '/images/network/fidinam.svg',
    desc: {
      en: "Fidinam is a private consulting firm that was founded in Lugano (Switzerland) in 1960 and offers tax, business, real estate and digital consulting to companies, entrepreneurs and individuals.\n\nIn over 60 years of activity, we have acquired a wealth of contacts and skills that enables us to meet the needs of clients of all types and to be ready to face the most difficult challenges posed by the markets.",
      fr: "Fidinam est un cabinet de conseil privé fondé à Lugano (Suisse) en 1960, qui propose des services de conseil fiscal, commercial, immobilier et numérique aux entreprises, aux entrepreneurs et aux particuliers.\n\nEn plus de 60 ans d'activité, nous avons acquis une richesse de contacts et de compétences qui nous permet de répondre aux besoins de clients de tous types et d'être prêts à relever les défis les plus difficiles posés par les marchés.",
      it: "Fidinam è una società di consulenza privata fondata a Lugano (Svizzera) nel 1960, che offre consulenza fiscale, aziendale, immobiliare e digitale a società, imprenditori e privati.\n\nIn oltre 60 anni di attività, abbiamo acquisito un patrimonio di contatti e competenze che ci consente di soddisfare le esigenze di clienti di ogni tipo e di essere pronti ad affrontare le sfide più difficili poste dai mercati.",
    },
  },
];

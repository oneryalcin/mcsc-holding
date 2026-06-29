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
  {
    name: 'Repeople Network',
    url: 'https://www.repeoplenetwork.net/',
    logo: '/images/network/repeople-network.jpg',
    desc: {
      en: "Repeople Network facilitates connections and relationships among professionals in the world of real estate and alternative investments.\n\nThey foster the creation of strategic partnerships to build new business opportunities, within a framework of social and environmental responsibility. They aspire to become the go-to community for building meaningful human relationships, aimed at transforming the entrepreneurial world into a sustainable ecosystem driven by responsible investment.",
      fr: "Repeople Network facilite les connexions et les relations entre professionnels du monde de l'immobilier et des investissements alternatifs.\n\nIls favorisent la création de partenariats stratégiques pour construire de nouvelles opportunités d'affaires, dans un cadre de responsabilité sociale et environnementale. Ils aspirent à devenir la communauté de référence pour nouer des relations humaines significatives, visant à transformer le monde entrepreneurial en un écosystème durable fondé sur l'investissement responsable.",
      it: "Repeople Network facilita connessioni e relazioni tra professionisti nel mondo dell'immobiliare e degli investimenti alternativi.\n\nPromuovono la creazione di partnership strategiche per costruire nuove opportunità di business, nell'ambito di un quadro di responsabilità sociale e ambientale. Aspirano a diventare la comunità di riferimento per costruire relazioni umane significative, con l'obiettivo di trasformare il mondo imprenditoriale in un ecosistema sostenibile guidato dagli investimenti responsabili.",
    },
  },
  {
    name: 'K2MATCH',
    url: 'https://www.k2match.com/',
    logo: '/images/network/k2match.webp',
    desc: {
      en: 'K2MATCH is an ecosystem of curated Startups and ScaleUps (2000+), Investors, Corporates, Experts, Business Communities & Solution Partners. They provide best-in-class matching services and growth solutions for businesses across multiple industries aiming to achieve your business goals.',
      fr: 'K2MATCH est un écosystème de startups et scaleups sélectionnées (plus de 2 000), d’investisseurs, d’entreprises, d’experts, de communautés business et de partenaires solutions. Ils proposent des services de matching de premier plan et des solutions de croissance pour les entreprises de multiples secteurs souhaitant atteindre leurs objectifs business.',
      it: 'K2MATCH è un ecosistema di startup e scaleup selezionate (oltre 2.000), investitori, aziende, esperti, community business e solution partner. Offre servizi di matching di primo livello e soluzioni di crescita per aziende di molteplici settori che puntano a raggiungere i propri obiettivi di business.',
    },
  },
  {
    name: 'KA PARTNER',
    url: 'https://www.kapartner.mc/',
    logo: '/images/network/ka-partner.svg',
    desc: {
      en: 'KA Partner simplifies life by providing support to individuals and professionals in their daily lives, project development and management, as well as all administrative procedures within the Principality of Monaco.',
      fr: 'KA Partner simplifie la vie en accompagnant particuliers et professionnels dans leur quotidien, le développement et la gestion de leurs projets, ainsi que dans toutes les démarches administratives au sein de la Principauté de Monaco.',
      it: 'KA Partner semplifica la vita offrendo supporto a privati e professionisti nella quotidianità, nello sviluppo e nella gestione dei progetti, nonché in tutte le procedure amministrative all’interno del Principato di Monaco.',
    },
  },
  {
    name: 'HIGH PROFILE',
    url: 'https://highprofile.aero/',
    logo: '/images/network/high-profile.png',
    desc: {
      en: 'Founded in 2009, HIGH PROFILE is a VIP air charter broker. From their offices located in Paris, Nice, and Dubai, they provide their clients with a selection of over 25 000 jets worldwide.\n\nHIGH PROFILE is the one and only broker which benefits from an operational support of its sister company G-OPS, the French leader of ground service support dedicated to business aviation.\n\nThis synergy allows a step-by-step follow-up of the flight operations and bespoke customer service, making HIGH PROFILE an A-Player in the industry.',
      fr: 'Fondée en 2009, HIGH PROFILE est un courtier en affrètement aérien VIP. Depuis ses bureaux situés à Paris, Nice et Dubaï, l’entreprise propose à ses clients une sélection de plus de 25 000 jets dans le monde.\n\nHIGH PROFILE est le seul courtier bénéficiant du soutien opérationnel de sa société sœur G-OPS, leader français des services d’assistance au sol dédiés à l’aviation d’affaires.\n\nCette synergie permet un suivi étape par étape des opérations de vol et un service client sur mesure, faisant de HIGH PROFILE un acteur majeur du secteur.',
      it: 'Fondata nel 2009, HIGH PROFILE è un broker di charter aereo VIP. Dai suoi uffici situati a Parigi, Nizza e Dubai, offre ai propri clienti una selezione di oltre 25.000 jet in tutto il mondo.\n\nHIGH PROFILE è l’unico broker a beneficiare del supporto operativo della società sorella G-OPS, leader francese dei servizi di assistenza a terra dedicati all’aviazione business.\n\nQuesta sinergia consente un monitoraggio passo dopo passo delle operazioni di volo e un servizio clienti su misura, rendendo HIGH PROFILE un protagonista del settore.',
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

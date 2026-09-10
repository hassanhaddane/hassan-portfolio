import { text, type Localized } from "./portfolio-data";

export type StoryStep = {
  id: string;
  eyebrow: Localized;
  title: Localized;
  description: Localized;
  image: string;
  imageAlt: Localized;
  format?: "desktop" | "mobile";
  mobileImage?: string;
};

export const greeCheck = {
  url: "https://gree-check.vercel.app/fr",
  period: "2025 — 2026",
  kind: text("PWA · PRODUIT PERSONNEL", "PWA · PERSONAL PRODUCT"),
  description: text(
    "Une aide au choix pour scanner, comprendre et comparer des produits alimentaires.",
    "A decision aid for scanning, understanding and comparing food products.",
  ),
  facts: [
    text("Français · anglais · arabe", "French · English · Arabic"),
    text("Desktop et mobile", "Desktop and mobile"),
    text("Historique et favoris locaux", "Local history and favourites"),
    text("Critères personnels et listes", "Personal criteria and lists"),
  ],
  stack: [
    "Next.js App Router",
    "React",
    "TypeScript",
    "Open Food Facts",
    "OpenStreetMap",
    "CI/CD",
    "Vercel",
  ],
};

export const storySteps: StoryStep[] = [
  {
    id: "home",
    eyebrow: text("01 · PROBLÈME", "01 · PROBLEM"),
    title: text("Décider sans déchiffrer.", "Decide without decoding."),
    description: text(
      "Les données alimentaires existent, mais elles restent difficiles à lire au moment du choix. GreeCheck les réunit dans un point d’entrée direct : scanner ou rechercher.",
      "Food data exists, but it is still difficult to read at the point of choice. GreeCheck brings it together through a direct entry point: scan or search.",
    ),
    image: "/projects/greecheck/home-desktop.png",
    mobileImage: "/projects/greecheck/home-mobile-clean.png",
    imageAlt: text(
      "Accueil public de GreeCheck sur ordinateur",
      "GreeCheck public home screen on desktop",
    ),
  },
  {
    id: "scan",
    eyebrow: text("02 · APPROCHE", "02 · APPROACH"),
    title: text("Du produit à l’information.", "From product to information."),
    description: text(
      "Le parcours part d’un geste concret : scanner un code-barres, saisir son code ou lancer une recherche textuelle. L’interface s’adapte au bureau comme au mobile.",
      "The journey starts with a concrete action: scan a barcode, enter its code or run a text search. The interface adapts to desktop and mobile.",
    ),
    image: "/projects/greecheck/scan-desktop-crop.png",
    imageAlt: text(
      "Interface publique GreeLens de lecture de code-barres",
      "Public GreeLens barcode scanning interface",
    ),
  },
  {
    id: "product",
    eyebrow: text("03 · SYSTÈME", "03 · SYSTEM"),
    title: text("Un score que l’on peut expliquer.", "A score that can be explained."),
    description: text(
      "Le GreeScore est calculé localement avec des règles déterministes et explicables, adaptées aux données disponibles. La fiche sépare faits, estimations et avis GreeCheck.",
      "GreeScore is computed locally using deterministic, explainable rules adapted to the available data. The product view separates facts, estimates and GreeCheck assessments.",
    ),
    image: "/projects/greecheck/product-desktop.png",
    imageAlt: text(
      "Fiche publique GreeCheck d’un produit alimentaire",
      "Public GreeCheck food product detail screen",
    ),
  },
  {
    id: "compare",
    eyebrow: text("04 · DÉCISION", "04 · DECISION"),
    title: text("Comparer dans le même contexte.", "Compare in the same context."),
    description: text(
      "La recherche, les détails produit et GreeCompare forment un même parcours. L’utilisateur peut confronter les informations plutôt que collectionner des badges isolés.",
      "Search, product details and GreeCompare form one continuous journey. People can weigh the information instead of collecting isolated badges.",
    ),
    image: "/projects/greecheck/compare-desktop.png",
    imageAlt: text(
      "Comparateur public GreeCheck avec un produit sélectionné",
      "Public GreeCheck comparison screen with one selected product",
    ),
  },
  {
    id: "local",
    eyebrow: text("05 · ÉTAT LOCAL", "05 · LOCAL STATE"),
    title: text("Personnaliser sans compte.", "Personalise without an account."),
    description: text(
      "Historique, favoris, listes et critères personnels restent sur l’appareil. Les critères influencent les alertes et le classement sans modifier le GreeScore de base.",
      "History, favourites, lists and personal criteria stay on the device. Criteria influence alerts and ranking without changing the base GreeScore.",
    ),
    image: "/projects/greecheck/criteria-mobile.png",
    imageAlt: text(
      "Écran mobile public des critères personnels de GreeCheck",
      "Public GreeCheck mobile personal criteria screen",
    ),
    format: "mobile",
  },
];

export type ProfessionalWork = {
  id: "iaudiogram" | "sante" | "biosency";
  index: string;
  company: string;
  product?: string;
  period: string;
  role: Localized;
  engagement: Localized;
  context: Localized;
  contributions: Localized[];
  tools: string[];
  signal: "audio" | "breath" | "iot";
};

export const professionalWork: ProfessionalWork[] = [
  {
    id: "iaudiogram",
    index: "02",
    company: "iAudiogram",
    product: "My Medical Assistant",
    period: "09/2022 → 09/2025",
    role: text("Développeur Web Full-Stack", "Full-Stack Web Developer"),
    engagement: text("Alternance", "Work-study"),
    context: text(
      "Applications médicales liées à l’audiométrie et au suivi patient.",
      "Medical applications for audiometry and patient follow-up.",
    ),
    contributions: [
      text(
        "Refonte d’interfaces React, TypeScript et Electron",
        "Redesigned React, TypeScript and Electron interfaces",
      ),
      text(
        "Composants responsives et intégration d’API REST",
        "Responsive components and REST API integration",
      ),
      text(
        "Correction d’anomalies et stabilisation des parcours utilisateurs",
        "Bug fixing and user journey stabilisation",
      ),
      text(
        "Tests Cypress, CI/CD et revues de code",
        "Cypress tests, CI/CD and code reviews",
      ),
      text(
        "Backlog GitHub et échanges avec l’équipe R&D",
        "GitHub backlog and collaboration with the R&D team",
      ),
    ],
    tools: ["React", "TypeScript", "Electron", "REST API", "Cypress", "CI/CD"],
    signal: "audio",
  },
  {
    id: "sante",
    index: "03",
    company: "Santé Respiratoire France",
    period: "01/2022 → 02/2022",
    role: text("Développeur Front-End", "Front-End Developer"),
    engagement: text("Stage", "Internship"),
    context: text(
      "Site web d’information autour de la santé respiratoire.",
      "Health information website focused on respiratory care.",
    ),
    contributions: [
      text(
        "Calculateurs interactifs en JavaScript",
        "Interactive JavaScript calculators",
      ),
      text(
        "Adaptation responsive et corrections d’affichage",
        "Responsive adaptation and display fixes",
      ),
      text(
        "Amélioration des parcours utilisateurs",
        "Improved user journeys",
      ),
    ],
    tools: ["JavaScript", "Responsive UI", "Web"],
    signal: "breath",
  },
  {
    id: "biosency",
    index: "04",
    company: "Biosency",
    product: "Télésuivi médical",
    period: "05/2021 → 06/2021",
    role: text("Développeur Front-End", "Front-End Developer"),
    engagement: text("Stage / CDD", "Internship / fixed-term contract"),
    context: text(
      "Plateforme de télésuivi médical dans un contexte e-santé et IoT.",
      "Remote medical monitoring platform in an e-health and IoT context.",
    ),
    contributions: [
      text("Maintenance du front-end", "Front-end maintenance"),
      text("Correction de bugs et amélioration UX", "Bug fixing and UX improvements"),
      text("Tests end-to-end avec Cypress", "End-to-end testing with Cypress"),
      text("Suivi des anomalies", "Issue tracking"),
    ],
    tools: ["Front-End", "IoT", "Cypress E2E", "Quality"],
    signal: "iot",
  },
];

export const aiLoop = [
  text("Recherche", "Research"),
  text("Prototype", "Prototype"),
  text("Implémentation", "Implementation"),
  text("Refactor", "Refactor"),
  text("Tests", "Tests"),
  text("Validation humaine", "Human validation"),
  text("Production", "Production"),
];

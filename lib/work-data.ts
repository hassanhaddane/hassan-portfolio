import {
  text,
  type Evidence,
  type EvidenceTargetId,
  type Localized,
  type SourceId,
} from "./portfolio-data";

export type ProfessionalWork = {
  id: Extract<EvidenceTargetId, "iaudiogram" | "sante" | "biosency">;
  company: string;
  product?: string;
  productEn?: string;
  start: string;
  end: string;
  period: Localized;
  role: Localized;
  engagement: Localized;
  context: Localized;
  contributions: Evidence[];
  tools: string[];
  signal: "audio" | "breath" | "iot";
};

const cv = (fr: string, en: string): Evidence => ({
  statement: text(fr, en),
  source: "cv2026",
});

export const professionalWork: ProfessionalWork[] = [
  {
    id: "iaudiogram",
    company: "iAudiogram",
    product: "My Medical Assistant",
    start: "2022-09",
    end: "2025-09",
    period: text("sept. 2022 — sept. 2025", "Sep 2022 — Sep 2025"),
    role: text("Développeur Web Full-Stack", "Full-Stack Web Developer"),
    engagement: text("Alternance", "Work-study apprenticeship"),
    context: text(
      "Développement de logiciels médicaux d’audiométrie et de suivi patient au sein de l’équipe R&D.",
      "Developed medical software for audiometry and patient follow-up within the R&D team.",
    ),
    contributions: [
      cv(
        "Refonte d’interfaces React, TypeScript et Electron ; intégration et développement d’API REST",
        "Redesigned React, TypeScript and Electron interfaces; REST API development and integration",
      ),
      cv(
        "Services Python et FastAPI testés avec Docker et PostgreSQL dans des environnements dédiés",
        "Python and FastAPI services tested with Docker and PostgreSQL in dedicated environments",
      ),
      cv(
        "Analyse et correction d’anomalies ; tests E2E automatisés avec Cypress",
        "Investigated and fixed issues; automated end-to-end tests with Cypress",
      ),
      cv(
        "GitHub Actions et CI/CD ; suivi du backlog dans Notion et collaboration avec la R&D",
        "GitHub Actions and CI/CD; backlog tracking in Notion and collaboration with R&D",
      ),
    ],
    tools: [
      "React",
      "TypeScript",
      "Electron",
      "API REST",
      "Python",
      "FastAPI",
      "Docker",
      "PostgreSQL",
      "Cypress",
      "GitHub Actions",
      "CI/CD",
      "Notion",
    ],
    signal: "audio",
  },
  {
    id: "sante",
    company: "Santé Respiratoire France",
    start: "2022-01",
    end: "2022-04",
    period: text("janv. — avr. 2022", "Jan — Apr 2022"),
    role: text("Développeur Web", "Web Developer"),
    engagement: text("Stage", "Internship"),
    context: text(
      "Site web d’information sur la santé respiratoire.",
      "Respiratory health information website.",
    ),
    contributions: [
      cv(
        "Calculateurs interactifs en JavaScript",
        "Interactive calculators in JavaScript",
      ),
      cv(
        "Adaptation responsive, corrections d’affichage et vérification des parcours utilisateurs",
        "Responsive improvements, display fixes and user journey checks",
      ),
    ],
    tools: ["JavaScript", "Responsive Web"],
    signal: "breath",
  },
  {
    id: "biosency",
    company: "Biosency",
    product: "Plateforme médicale IoT",
    productEn: "IoT medical platform",
    start: "2021-05",
    end: "2021-06",
    period: text("mai — juin 2021", "May — Jun 2021"),
    role: text("Développeur Web", "Web Developer"),
    engagement: text(
      "Stage puis CDD",
      "Internship followed by a fixed-term contract",
    ),
    context: text(
      "Maintenance du front-end Angular d’une plateforme de télésuivi médical IoT.",
      "Maintained the Angular front end of an IoT medical monitoring platform.",
    ),
    contributions: [
      cv(
        "Maintenance et correction de bugs ; amélioration des parcours utilisateurs",
        "Maintenance and bug fixes; improvements to user journeys",
      ),
      cv(
        "Tests E2E avec Cypress, reproduction et suivi des anomalies",
        "End-to-end tests with Cypress; reproduced and tracked issues",
      ),
    ],
    tools: ["Angular", "Cypress", "IoT"],
    signal: "iot",
  },
];

export type Project = {
  id: Extract<
    EvidenceTargetId,
    "greecheck" | "bloom" | "tech-express" | "ceo19"
  >;
  name: string;
  kind: Localized;
  status: Localized;
  period?: Localized;
  summary: Localized;
  url?: string;
  repository?: string;
  stack: string[];
  evidence: Evidence[];
  source: SourceId;
  slug: string;
  year: string;
  role: Localized;
  category: Localized;
  media: { src: string; alt: Localized; width: number; height: number }[];
  links: { label: Localized; url: string }[];
  caseStudy: {
    context: Localized;
    goal: Localized;
    decisions: Localized;
    approach: Localized;
    features: Localized[];
    result: Localized;
  };
};

export const greeCheck: Project = {
  id: "greecheck",
  name: "GreeCheck",
  kind: text("Projet personnel", "Personal project"),
  status: text("PWA déployée", "Deployed PWA"),
  period: text("depuis oct. 2025", "since Oct 2025"),
  summary: text(
    "PWA pour scanner, rechercher et comparer des produits alimentaires à partir d’Open Food Facts.",
    "A PWA for scanning, searching and comparing food products using Open Food Facts.",
  ),
  url: "https://gree-check.vercel.app/fr",
  repository: "https://github.com/hassanhaddane/GreeCheck",
  stack: [
    "Next.js",
    "React",
    "TypeScript",
    "Open Food Facts",
    "IndexedDB",
    "Dexie",
    "Vercel",
  ],
  evidence: [
    cv(
      "GreeScore calculé localement ; données conservées sur l’appareil avec IndexedDB et Dexie, sans compte utilisateur",
      "Locally calculated GreeScore; data kept on the device with IndexedDB and Dexie, with no user account",
    ),
    {
      statement: text(
        "Application déployée sur Vercel",
        "Application deployed on Vercel",
      ),
      source: "greecheck",
    },
  ],
  source: "greecheck",
  slug: "greecheck",
  year: "2025—2026",
  role: text(
    "Conception et développement Full-Stack",
    "Product design and full-stack development",
  ),
  category: text("Produit personnel · PWA", "Personal product · PWA"),
  media: [
    {
      src: "/projects/greecheck/home-desktop.png",
      alt: text(
        "Accueil de GreeCheck sur ordinateur",
        "GreeCheck desktop home screen",
      ),
      width: 1440,
      height: 900,
    },
    {
      src: "/projects/greecheck/home-mobile-clean.png",
      alt: text(
        "Accueil de GreeCheck sur mobile",
        "GreeCheck mobile home screen",
      ),
      width: 380,
      height: 822,
    },
  ],
  links: [
    {
      label: text("Ouvrir l’application", "Open the app"),
      url: "https://gree-check.vercel.app/fr",
    },
  ],
  caseStudy: {
    context: text(
      "Une application personnelle autour de la lecture des produits alimentaires. L’interface publique permet de scanner, rechercher, analyser et comparer des produits.",
      "A personal product for understanding food products. The public interface supports scanning, searching, reviewing and comparing items.",
    ),
    goal: text(
      "Rendre les informations d’Open Food Facts plus faciles à parcourir, tout en gardant les choix et l’historique sur l’appareil.",
      "Make Open Food Facts data easier to explore while keeping preferences and history on the device.",
    ),
    decisions: text(
      "Garder le score et les préférences sur l’appareil ; organiser le produit autour du scan, de la recherche et de la comparaison.",
      "Keep scoring and preferences on the device; organise the product around scanning, search and comparison.",
    ),
    approach: text(
      "PWA construite avec Next.js, React et TypeScript. Le GreeScore est calculé localement ; IndexedDB et Dexie conservent les données sans compte utilisateur.",
      "Built a PWA with Next.js, React and TypeScript. GreeScore runs locally; IndexedDB and Dexie store data without user accounts.",
    ),
    features: [
      text("Scan et recherche de produits", "Product scanning and search"),
      text(
        "Fiches produit et calcul local du GreeScore",
        "Product pages and locally calculated GreeScore",
      ),
      text(
        "Comparaison et critères personnalisables",
        "Comparison and adjustable criteria",
      ),
    ],
    result: text(
      "L’application est accessible publiquement et son parcours de scan, de recherche et de comparaison est observable. Aucun usage ou gain n’est chiffré ici.",
      "The app is publicly accessible, with scanning, search and comparison flows visible. No usage or impact figures are claimed here.",
    ),
  },
};

export const bloom: Project = {
  id: "bloom",
  name: "808BLOOM",
  kind: text(
    "Projet associatif et bénévolat",
    "Association project and volunteer work",
  ),
  status: text("Participation en cours", "Ongoing involvement"),
  period: text("depuis mai 2026", "since May 2026"),
  summary: text(
    "Un point de rencontre pour la scène hip-hop rennaise : formats, studio et projets collectifs.",
    "A meeting point for the Rennes hip-hop scene: formats, studio and collective projects.",
  ),
  url: "https://808bloom.vercel.app/fr",
  stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  evidence: [
    cv(
      "Enregistrement, mixage et mastering au studio de l’association",
      "Recording, mixing and mastering at the association’s studio",
    ),
    cv(
      "Participation à l’organisation d’événements et aux projets du collectif",
      "Helped organise events and collective projects",
    ),
    cv(
      "Conception, mise en ligne, contenus, corrections et évolutions du site",
      "Worked on website design, launch, content, fixes and updates",
    ),
  ],
  source: "bloom",
  slug: "808bloom",
  year: "2026",
  role: text(
    "Conception et développement web",
    "Website design and development",
  ),
  category: text(
    "Association · web et culture",
    "Association · web and culture",
  ),
  media: [
    {
      src: "/projects/808bloom/home-desktop.png",
      alt: text(
        "Accueil public du site 808 Bloom sur ordinateur",
        "808 Bloom public desktop home page",
      ),
      width: 1265,
      height: 712,
    },
    {
      src: "/projects/808bloom/home-mobile.png",
      alt: text(
        "Accueil public du site 808 Bloom sur mobile",
        "808 Bloom public mobile home page",
      ),
      width: 375,
      height: 812,
    },
  ],
  links: [
    {
      label: text("Voir le site", "Visit the site"),
      url: "https://808bloom.vercel.app/fr",
    },
  ],
  caseStudy: {
    context: text(
      "808 Bloom est une association rennaise dédiée à la scène rap : contenus audiovisuels, studio, actions culturelles et événements. Le site public rassemble ces parcours.",
      "808 Bloom is a Rennes association supporting the local rap scene through audiovisual formats, a studio, cultural work and events. Its public website brings these paths together.",
    ),
    goal: text(
      "Donner une entrée claire aux artistes, au public et aux partenaires vers les formats, le studio et les informations de l’association.",
      "Give artists, audiences and partners a clear way into the association’s formats, studio and information.",
    ),
    decisions: text(
      "Séparer les entrées médias, studio et événements pour orienter artistes, public et partenaires sans mélanger leurs besoins.",
      "Separate media, studio and event entry points to orient artists, audiences and partners around their needs.",
    ),
    approach: text(
      "Contribution à la conception, aux contenus, à la mise en ligne et aux évolutions du site Next.js. Les activités de studio et d’événementiel relèvent de mon engagement associatif et audio, distinct du développement web.",
      "Contributed to site design, content, launch and updates in Next.js. Studio and event work belongs to my separate association and audio involvement.",
    ),
    features: [
      text(
        "Navigation FR/EN et pages des formats",
        "FR/EN navigation and format pages",
      ),
      text(
        "Parcours studio, actions et événements",
        "Studio, cultural work and event journeys",
      ),
      text(
        "Contenus média et pages d’information",
        "Media content and information pages",
      ),
    ],
    result: text(
      "Le site est accessible publiquement avec des pages média, studio, actions, événements et contact. La demande de studio prépare un e-mail ; elle ne confirme pas une réservation.",
      "The public site includes media, studio, cultural work, events and contact pages. The studio flow prepares an email; it does not confirm a booking.",
    ),
  },
};

export const techExpress: Project = {
  id: "tech-express",
  name: "Tech Express",
  kind: text("Projet web B2B", "B2B web project"),
  status: text(
    "Deux versions web accessibles sur GitHub Pages ; intégration commerciale non vérifiée",
    "Two web versions accessible on GitHub Pages; commercial integration unverified",
  ),
  period: text("2026", "2026"),
  summary: text(
    "Site B2B et catalogue produits en anglais et arabe, avec comparaison et parcours de demande de devis.",
    "English and Arabic B2B website and product catalogue with comparison and quote request flows.",
  ),
  stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  evidence: [
    {
      statement: text(
        "V1 et V2 publiques sur GitHub Pages ; navigation EN/AR, catalogue et parcours de devis visibles",
        "V1 and V2 public on GitHub Pages; EN/AR navigation, catalogue and quote flows visible",
      ),
      source: "techExpress",
    },
    {
      statement: text(
        "La V2 indique que le formulaire de démonstration n’enregistre pas les données",
        "V2 states that its demo form does not store submissions",
      ),
      source: "techExpress",
    },
  ],
  source: "techExpress",
  slug: "tech-express",
  year: "2026",
  role: text(
    "Conception et développement web",
    "Website design and development",
  ),
  category: text("Site B2B · catalogue", "B2B website · catalogue"),
  media: [
    {
      src: "/projects/tech-express/v1-desktop.png",
      alt: text(
        "Accueil public de Tech Express V1",
        "Tech Express V1 public home page",
      ),
      width: 1265,
      height: 712,
    },
    {
      src: "/projects/tech-express/v2-desktop.png",
      alt: text(
        "Accueil public de Tech Express V2",
        "Tech Express V2 public home page",
      ),
      width: 1270,
      height: 714,
    },
  ],
  links: [
    {
      label: text("Voir la V1", "View V1"),
      url: "https://hassanhaddane.github.io/TechExpress/en/",
    },
    {
      label: text("Voir la V2", "View V2"),
      url: "https://hassanhaddane.github.io/TechExpressProject/en/",
    },
  ],
  caseStudy: {
    context: text(
      "Deux itérations publiques d’un site de présentation pour des solutions visuelles B2B. Les deux versions sont accessibles sur GitHub Pages en anglais et en arabe.",
      "Two public iterations of a B2B visual solutions website. Both versions are accessible on GitHub Pages in English and Arabic.",
    ),
    goal: text(
      "Organiser l’offre, les familles de produits et la demande de devis pour un parcours commercial lisible.",
      "Organise the offer, product families and quote request journey into a clear B2B experience.",
    ),
    decisions: text(
      "Structurer le catalogue par familles de produits et prévoir une navigation anglais/arabe, avec les contraintes de lecture RTL.",
      "Structure the catalogue by product family and support English/Arabic navigation, including right-to-left reading.",
    ),
    approach: text(
      "La V1 et la V2 explorent deux directions d’interface. Le dépôt local Next.js documente le catalogue, les catégories, les fiches produit, la comparaison et le parcours de devis.",
      "V1 and V2 explore different interface directions. The local Next.js repository documents the catalogue, categories, product pages, comparison and quote journey.",
    ),
    features: [
      text("Navigation bilingue anglais/arabe", "English/Arabic navigation"),
      text(
        "Catalogue, catégories et fiches produit",
        "Catalogue, categories and product pages",
      ),
      text(
        "Comparaison et demande de devis",
        "Comparison and quote request journey",
      ),
    ],
    result: text(
      "Les deux interfaces sont visibles publiquement. Le formulaire de la V2 indique explicitement qu’il s’agit d’une démonstration sans stockage ; aucune intégration CRM ni livraison commerciale n’est affirmée.",
      "Both interfaces are publicly viewable. V2 explicitly labels its form as a demo without storage; no CRM integration or commercial delivery is claimed.",
    ),
  },
};

export const ceo19: Project = {
  id: "ceo19",
  name: "CEO1.9",
  kind: text("Projet créatif", "Creative project"),
  status: text(
    "Site public accessible · vérifié le 4 novembre 2026",
    "Public site accessible · checked 4 November 2026",
  ),
  period: text("2026", "2026"),
  summary: text(
    "Un univers digital pour un artiste rap : direction visuelle, site immersif et découverte musicale.",
    "A digital world for a rap artist: visual direction, an immersive website and music discovery.",
  ),
  url: "https://ceo19.vercel.app/en",
  repository: "https://github.com/hassanhaddane/ceo19",
  stack: ["Next.js", "React", "TypeScript", "Three.js", "GSAP"],
  evidence: [
    {
      statement: text(
        "Accueil et section musique observés sur le site public le 4 novembre 2026 ; dépôt public consulté.",
        "Home and music section observed on the public site on 4 November 2026; public repository inspected.",
      ),
      source: "ceo19",
    },
  ],
  source: "ceo19",
  slug: "ceo19",
  year: "2026",
  role: text(
    "Direction créative, conception et développement web",
    "Creative direction, website design and development",
  ),
  category: text("Artiste · expérience web", "Artist · web experience"),
  media: [
    {
      src: "/projects/ceo19/home-desktop.jpg",
      alt: text(
        "Accueil réel du site CEO1.9, capturé le 4 novembre 2026",
        "Real CEO1.9 home page, captured on 4 November 2026",
      ),
      width: 1440,
      height: 900,
    },
  ],
  links: [
    {
      label: text("Explorer le site", "Explore the site"),
      url: "https://ceo19.vercel.app/en",
    },
  ],
  caseStudy: {
    context: text(
      "Un site personnel pour un artiste rap, entre identité visuelle, sorties musicales et archives photographiques.",
      "A personal website for a rap artist, combining visual identity, music releases and photographic archives.",
    ),
    goal: text(
      "Créer un univers cohérent autour de l’artiste tout en donnant des accès clairs à ses titres, ses images et ses plateformes d’écoute.",
      "Create a coherent world around the artist while providing clear access to releases, imagery and listening platforms.",
    ),
    decisions: text(
      "Faire de l’identité de l’artiste le point d’entrée, puis organiser la découverte en séquences : accueil, musique, archives. Prévoir une entrée sans son et un accès direct au contenu.",
      "Use the artist’s identity as the entry point, then organise discovery into home, music and archive sequences. Provide a silent entry and direct access to the content.",
    ),
    approach: text(
      "Conception et développement avec Next.js, React et TypeScript. Le dépôt utilise Three.js et GSAP pour son univers visuel et ses transitions ; la navigation conserve des liens explicites vers les contenus.",
      "Designed and developed with Next.js, React and TypeScript. The repository uses Three.js and GSAP for its visual world and transitions; navigation keeps explicit links to content.",
    ),
    features: [
      text(
        "Intro visuelle avec entrée sans son",
        "Visual intro with a silent entry",
      ),
      text("Sélection des sorties musicales", "Music release selector"),
      text(
        "Archives photo et liens vers les plateformes",
        "Photo archives and links to listening platforms",
      ),
    ],
    result: text(
      "Le site public est accessible lors de la vérification du 4 novembre 2026. L’accueil et la section musique ont été observés. La boutique et les parcours de paiement n’ont pas été validés dans cet audit.",
      "The public site was accessible during the 4 November 2026 check. Home and music sections were observed. Shop and payment journeys were not validated in this audit.",
    ),
  },
};

export const projects: Project[] = [greeCheck, bloom, techExpress, ceo19];

export type ProjectStoryStep = {
  id: string;
  src: string;
  title: Localized;
  detail: Localized;
  alt: Localized;
};

export const greeCheckStorySteps: ProjectStoryStep[] = [
  {
    id: "presentation",
    src: "/projects/greecheck/home-mobile-clean.png",
    title: text("Présentation", "Overview"),
    detail: text(
      "Une PWA sur mobile et ordinateur.",
      "A PWA for mobile and desktop.",
    ),
    alt: text(
      "Accueil de GreeCheck sur mobile",
      "GreeCheck home screen on mobile",
    ),
  },
  {
    id: "scan",
    src: "/projects/greecheck/scan-desktop-crop.png",
    title: text("Scanner", "Scan"),
    detail: text("Scanner un code-barres.", "Scan a barcode."),
    alt: text("Interface de scan GreeCheck", "GreeCheck scan interface"),
  },
  {
    id: "search",
    src: "/projects/greecheck/home-desktop.png",
    title: text("Rechercher", "Search"),
    detail: text("Rechercher un produit.", "Search for a product."),
    alt: text("Recherche GreeCheck sur ordinateur", "GreeCheck desktop search"),
  },
  {
    id: "product",
    src: "/projects/greecheck/product-desktop.png",
    title: text("Consulter", "Review"),
    detail: text(
      "Lire une fiche produit et son GreeScore.",
      "Read product details and its GreeScore.",
    ),
    alt: text("Fiche produit GreeCheck", "GreeCheck product page"),
  },
  {
    id: "compare",
    src: "/projects/greecheck/compare-desktop.png",
    title: text("Comparer", "Compare"),
    detail: text("Comparer des produits.", "Compare products."),
    alt: text("Comparaison GreeCheck", "GreeCheck comparison interface"),
  },
  {
    id: "criteria",
    src: "/projects/greecheck/criteria-mobile.png",
    title: text("Personnaliser", "Customise"),
    detail: text("Adapter les critères locaux.", "Adjust local criteria."),
    alt: text(
      "Critères GreeCheck sur mobile",
      "GreeCheck mobile criteria screen",
    ),
  },
];

export function evidenceTargetName(id: EvidenceTargetId): string {
  return (
    professionalWork.find((work) => work.id === id)?.company ??
    projects.find((project) => project.id === id)?.name ??
    id
  );
}

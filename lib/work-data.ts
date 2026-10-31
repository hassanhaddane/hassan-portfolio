import { text, type Evidence, type EvidenceTargetId, type Localized, type SourceId } from "./portfolio-data";

export type ProfessionalWork = {
  id: Extract<EvidenceTargetId, "iaudiogram" | "sante" | "biosency">;
  company: string;
  product?: string;
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

const cv = (fr: string, en: string): Evidence => ({ statement: text(fr, en), source: "cv2026" });

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
      cv("Interfaces React, TypeScript et Electron ; intégration et développement d’API REST", "React, TypeScript and Electron interfaces; REST API development and integration"),
      cv("Services Python et FastAPI testés avec Docker et PostgreSQL dans des environnements dédiés", "Python and FastAPI services tested with Docker and PostgreSQL in dedicated environments"),
      cv("Analyse et correction d’anomalies ; tests E2E automatisés avec Cypress", "Investigated and fixed issues; automated end-to-end tests with Cypress"),
      cv("GitHub Actions et CI/CD ; suivi du backlog dans Notion et collaboration avec la R&D", "GitHub Actions and CI/CD; backlog tracking in Notion and collaboration with R&D"),
    ],
    tools: ["React", "TypeScript", "Electron", "API REST", "Python", "FastAPI", "Docker", "PostgreSQL", "Cypress", "GitHub Actions", "CI/CD", "Notion"],
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
    context: text("Site web d’information sur la santé respiratoire.", "Respiratory health information website."),
    contributions: [
      cv("Calculateurs interactifs en JavaScript", "Interactive calculators in JavaScript"),
      cv("Adaptation responsive, corrections d’affichage et vérification des parcours utilisateurs", "Responsive improvements, display fixes and user journey checks"),
    ],
    tools: ["JavaScript", "Responsive Web"],
    signal: "breath",
  },
  {
    id: "biosency",
    company: "Biosency",
    product: "Plateforme médicale IoT",
    start: "2021-05",
    end: "2021-06",
    period: text("mai — juin 2021", "May — Jun 2021"),
    role: text("Développeur Web", "Web Developer"),
    engagement: text("Stage puis CDD", "Internship followed by a fixed-term contract"),
    context: text("Maintenance du front-end Angular d’une plateforme de télésuivi médical IoT.", "Maintained the Angular front end of an IoT medical monitoring platform."),
    contributions: [
      cv("Maintenance et correction de bugs ; amélioration des parcours utilisateurs", "Maintenance and bug fixes; improvements to user journeys"),
      cv("Tests E2E avec Cypress, reproduction et suivi des anomalies", "End-to-end tests with Cypress; reproduced and tracked issues"),
    ],
    tools: ["Angular", "Cypress", "IoT"],
    signal: "iot",
  },
];

export type Project = {
  id: Extract<EvidenceTargetId, "greecheck" | "bloom" | "tech-express">;
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
};

export const greeCheck: Project = {
  id: "greecheck",
  name: "GreeCheck",
  kind: text("Projet personnel", "Personal project"),
  status: text("PWA déployée", "Deployed PWA"),
  period: text("depuis oct. 2025", "since Oct 2025"),
  summary: text("PWA pour scanner, rechercher et comparer des produits alimentaires à partir d’Open Food Facts.", "A PWA for scanning, searching and comparing food products using Open Food Facts."),
  url: "https://gree-check.vercel.app/fr",
  repository: "https://github.com/hassanhaddane/GreeCheck",
  stack: ["Next.js", "React", "TypeScript", "Open Food Facts", "IndexedDB", "Dexie", "Vercel"],
  evidence: [
    cv("GreeScore calculé localement ; données conservées sur l’appareil avec IndexedDB et Dexie, sans compte utilisateur", "Locally calculated GreeScore; data kept on the device with IndexedDB and Dexie, with no user account"),
    { statement: text("Application déployée sur Vercel", "Application deployed on Vercel"), source: "greecheck" },
  ],
  source: "greecheck",
};

export const bloom: Project = {
  id: "bloom",
  name: "808BLOOM",
  kind: text("Projet associatif et bénévolat", "Association project and volunteer work"),
  status: text("Participation en cours", "Ongoing involvement"),
  period: text("depuis mai 2026", "since May 2026"),
  summary: text("Participation technique au site de l’association, au studio audio et aux événements du collectif.", "Technical contribution to the association’s website, audio studio and collective events."),
  url: "https://808bloom.vercel.app/fr",
  stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  evidence: [
    cv("Enregistrement, mixage et mastering au studio de l’association", "Recording, mixing and mastering at the association’s studio"),
    cv("Participation à l’organisation d’événements et aux projets du collectif", "Helped organise events and collective projects"),
    cv("Conception, mise en ligne, contenus, corrections et évolutions du site", "Worked on website design, launch, content, fixes and updates"),
  ],
  source: "bloom",
};

export const techExpress: Project = {
  id: "tech-express",
  name: "Tech Express",
  kind: text("Projet web B2B", "B2B web project"),
  status: text("Implémentation locale ; publication non vérifiée", "Local implementation; publication unverified"),
  summary: text("Site B2B et catalogue produits en anglais et arabe, avec comparaison et parcours de demande de devis.", "English and Arabic B2B website and product catalogue with comparison and quote request flows."),
  stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  evidence: [
    { statement: text("Pages catalogue, catégories et fiches produit dans le dépôt local", "Catalogue, category and product pages in the local repository"), source: "techExpress" },
  ],
  source: "techExpress",
};

export const projects: Project[] = [greeCheck, bloom, techExpress];

export type ProjectStoryStep = {
  id: string;
  src: string;
  title: Localized;
  detail: Localized;
  alt: Localized;
};

export const greeCheckStorySteps: ProjectStoryStep[] = [
  { id: "presentation", src: "/projects/greecheck/home-mobile-clean.png", title: text("Présentation", "Overview"), detail: text("Une PWA sur mobile et ordinateur.", "A PWA for mobile and desktop."), alt: text("Accueil de GreeCheck sur mobile", "GreeCheck home screen on mobile") },
  { id: "scan", src: "/projects/greecheck/scan-desktop-crop.png", title: text("Scanner", "Scan"), detail: text("Scanner un code-barres.", "Scan a barcode."), alt: text("Interface de scan GreeCheck", "GreeCheck scan interface") },
  { id: "search", src: "/projects/greecheck/home-desktop.png", title: text("Rechercher", "Search"), detail: text("Rechercher un produit.", "Search for a product."), alt: text("Recherche GreeCheck sur ordinateur", "GreeCheck desktop search") },
  { id: "product", src: "/projects/greecheck/product-desktop.png", title: text("Consulter", "Review"), detail: text("Lire une fiche produit et son GreeScore.", "Read product details and its GreeScore."), alt: text("Fiche produit GreeCheck", "GreeCheck product page") },
  { id: "compare", src: "/projects/greecheck/compare-desktop.png", title: text("Comparer", "Compare"), detail: text("Comparer des produits.", "Compare products."), alt: text("Comparaison GreeCheck", "GreeCheck comparison interface") },
  { id: "criteria", src: "/projects/greecheck/criteria-mobile.png", title: text("Personnaliser", "Customise"), detail: text("Adapter les critères locaux.", "Adjust local criteria."), alt: text("Critères GreeCheck sur mobile", "GreeCheck mobile criteria screen") },
];

export function evidenceTargetName(id: EvidenceTargetId): string {
  return professionalWork.find((work) => work.id === id)?.company
    ?? projects.find((project) => project.id === id)?.name
    ?? id;
}

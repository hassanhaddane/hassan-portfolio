import { text, type Localized } from "./portfolio-data";

export type EvidenceId =
  | "greecheck"
  | "iaudiogram"
  | "biosency"
  | "sante"
  | "interface-systems"
  | "api-design"
  | "data-layer"
  | "delivery"
  | "quality-loop"
  | "ai-workflow";

type KnowledgeItem = {
  id: string;
  label: string;
  kind: "technology" | "practice";
  relations: EvidenceId[];
};

export type KnowledgeGroup = {
  id: "front" | "back" | "data" | "devops" | "quality" | "ai";
  label: string;
  code: string;
  side: "left" | "right";
  items: KnowledgeItem[];
};

const technology = (
  id: string,
  label: string,
  relations: EvidenceId[],
): KnowledgeItem => ({ id, label, relations, kind: "technology" });

const practice = (
  id: string,
  label: string,
  relations: EvidenceId[],
): KnowledgeItem => ({ id, label, relations, kind: "practice" });

export const knowledgeGroups: KnowledgeGroup[] = [
  {
    id: "front",
    label: "FRONT-END",
    code: "FE",
    side: "left",
    items: [
      technology("react", "React", [
        "greecheck",
        "iaudiogram",
        "interface-systems",
      ]),
      technology("next", "Next.js / App Router", [
        "greecheck",
        "interface-systems",
      ]),
      technology("electron", "Electron", [
        "iaudiogram",
        "interface-systems",
      ]),
      technology("typescript", "TypeScript", [
        "greecheck",
        "iaudiogram",
        "biosency",
        "interface-systems",
      ]),
      technology("javascript", "JavaScript", [
        "sante",
        "biosency",
        "interface-systems",
      ]),
      technology("html-css", "HTML / CSS", ["sante", "interface-systems"]),
      technology("tanstack", "TanStack Query / Router", [
        "interface-systems",
      ]),
      technology("redux", "Redux", ["interface-systems"]),
      technology("tailwind", "Tailwind CSS", ["interface-systems"]),
      technology("shadcn", "shadcn/ui", ["interface-systems"]),
      technology("flutter", "Flutter", ["interface-systems"]),
      technology("rhf", "React Hook Form", ["interface-systems"]),
      technology("zod", "Zod", ["interface-systems", "quality-loop"]),
    ],
  },
  {
    id: "back",
    label: "BACK-END / API",
    code: "API",
    side: "left",
    items: [
      technology("python", "Python", ["api-design"]),
      technology("fastapi", "FastAPI", ["api-design"]),
      technology("django", "Django", ["api-design"]),
      technology("flask", "Flask", ["api-design"]),
      technology("node", "Node.js", ["api-design"]),
      technology("express", "Express", ["api-design"]),
      technology("rest", "REST API", ["iaudiogram", "api-design"]),
    ],
  },
  {
    id: "data",
    label: "DATABASE",
    code: "DB",
    side: "left",
    items: [
      technology("postgresql", "PostgreSQL", ["data-layer"]),
      technology("mysql", "MySQL", ["data-layer"]),
      technology("mongodb", "MongoDB", ["data-layer"]),
      technology("firebase", "Firebase", ["data-layer"]),
    ],
  },
  {
    id: "devops",
    label: "DEVOPS",
    code: "OPS",
    side: "right",
    items: [
      technology("docker", "Docker", ["delivery"]),
      technology("git", "Git", ["biosency", "delivery"]),
      technology("github", "GitHub", [
        "iaudiogram",
        "delivery",
        "quality-loop",
      ]),
      technology("github-actions", "GitHub Actions", ["delivery"]),
      technology("ci-cd", "CI/CD", [
        "greecheck",
        "iaudiogram",
        "delivery",
      ]),
      technology("vercel", "Vercel", ["greecheck", "delivery"]),
      technology("linux", "Linux", ["delivery"]),
    ],
  },
  {
    id: "quality",
    label: "TEST / QUALITY",
    code: "QA",
    side: "right",
    items: [
      technology("cypress", "Cypress", [
        "iaudiogram",
        "biosency",
        "quality-loop",
      ]),
      technology("vitest", "Vitest", ["quality-loop"]),
      technology("jest", "Jest", ["quality-loop"]),
      technology("rtl", "React Testing Library", ["quality-loop"]),
      practice("unit-tests", "unit tests", ["quality-loop"]),
      practice("e2e-tests", "end-to-end tests", [
        "iaudiogram",
        "biosency",
        "quality-loop",
      ]),
      practice("code-review", "code review", [
        "iaudiogram",
        "quality-loop",
      ]),
      practice("bug-tracking", "bug tracking", [
        "iaudiogram",
        "biosency",
        "quality-loop",
      ]),
    ],
  },
  {
    id: "ai",
    label: "AI DEVELOPMENT",
    code: "AI",
    side: "right",
    items: [
      technology("codex", "Codex", ["greecheck", "ai-workflow"]),
      technology("claude", "Claude CoWork", [
        "greecheck",
        "ai-workflow",
      ]),
      practice("research", "research", ["ai-workflow"]),
      practice("technical-exploration", "technical exploration", [
        "greecheck",
        "ai-workflow",
      ]),
      practice("prototyping", "prototyping", [
        "greecheck",
        "ai-workflow",
      ]),
      practice("refactoring", "refactoring", [
        "greecheck",
        "ai-workflow",
      ]),
      practice("bug-diagnosis", "bug diagnosis", [
        "greecheck",
        "ai-workflow",
      ]),
      practice("critical-review", "critical review", ["ai-workflow"]),
      practice("tests", "tests", ["ai-workflow", "quality-loop"]),
      practice("typing", "typing", ["ai-workflow", "quality-loop"]),
    ],
  },
];

export const evidenceNodes: Array<{
  id: EvidenceId;
  label: Localized;
  kind: Localized;
  x: number;
  y: number;
}> = [
  {
    id: "greecheck",
    label: text("GreeCheck", "GreeCheck"),
    kind: text("Projet personnel", "Personal project"),
    x: 42,
    y: 12,
  },
  {
    id: "iaudiogram",
    label: text("iAudiogram", "iAudiogram"),
    kind: text("Expérience professionnelle", "Professional experience"),
    x: 58,
    y: 12,
  },
  {
    id: "biosency",
    label: text("Biosency", "Biosency"),
    kind: text("Expérience professionnelle", "Professional experience"),
    x: 42,
    y: 31,
  },
  {
    id: "sante",
    label: text("Santé Respiratoire", "Respiratory Health"),
    kind: text("Expérience professionnelle", "Professional experience"),
    x: 58,
    y: 31,
  },
  {
    id: "interface-systems",
    label: text("Systèmes d’interface", "Interface systems"),
    kind: text("Pratique", "Practice"),
    x: 42,
    y: 50,
  },
  {
    id: "api-design",
    label: text("Conception d’API", "API design"),
    kind: text("Pratique", "Practice"),
    x: 58,
    y: 50,
  },
  {
    id: "data-layer",
    label: text("Couche données", "Data layer"),
    kind: text("Pratique", "Practice"),
    x: 42,
    y: 69,
  },
  {
    id: "delivery",
    label: text("Chaîne de livraison", "Delivery pipeline"),
    kind: text("Pratique", "Practice"),
    x: 58,
    y: 69,
  },
  {
    id: "quality-loop",
    label: text("Boucle qualité", "Quality loop"),
    kind: text("Pratique", "Practice"),
    x: 42,
    y: 88,
  },
  {
    id: "ai-workflow",
    label: text("Workflow IA", "AI workflow"),
    kind: text("Pratique", "Practice"),
    x: 58,
    y: 88,
  },
];

export const recruiterGroups = [
  { label: "CORE", items: ["React", "TypeScript", "Next.js", "Python", "FastAPI", "Node.js", "Docker"] },
  { label: "PRODUCT", items: ["TanStack", "Tailwind", "shadcn", "RHF", "Zod"] },
  { label: "QUALITY", items: ["Cypress", "Vitest", "Jest", "RTL"] },
  { label: "SYSTEMS", items: ["PostgreSQL", "GitHub Actions", "Linux", "CI/CD"] },
] as const;

export type TimelineId = "epsi" | "biosency" | "sante" | "iaudiogram" | "greecheck";

export type TimelineEntry = {
  id: TimelineId;
  graphId?: EvidenceId;
  kind: Localized;
  title: string;
  subtitle?: string;
  period: string;
  start: number;
  end: number;
  lane: number;
  role: Localized;
  engagement?: Localized;
  description: Localized;
  facts: Localized[];
  technologies: string[];
};

export const timelineEntries: TimelineEntry[] = [
  {
    id: "epsi",
    kind: text("Formation", "Education"),
    title: "EPSI",
    subtitle: "Montpellier",
    period: "09/2020 → 09/2025",
    start: 2020.67,
    end: 2025.67,
    lane: 0,
    role: text(
      "Un parcours continu, deux certifications",
      "One continuous path, two certifications",
    ),
    description: text(
      "Cinq années de formation en développement, architecture et systèmes d’information.",
      "Five years of study in development, architecture and information systems.",
    ),
    facts: [
      text(
        "Concepteur Développeur d’Application · BAC+3 · RNCP31678 niveau 6",
        "Application Designer and Developer · Bachelor’s level · RNCP31678 level 6",
      ),
      text(
        "Expert en informatique & système d’information · BAC+5 · RNCP40573 niveau 7",
        "Expert in Computing & Information Systems · Master’s level · RNCP40573 level 7",
      ),
    ],
    technologies: [],
  },
  {
    id: "biosency",
    graphId: "biosency",
    kind: text("Expérience professionnelle", "Professional experience"),
    title: "BIOSENCY",
    subtitle: "Télésuivi médical",
    period: "05/2021 → 06/2021",
    start: 2021.34,
    end: 2021.5,
    lane: 1,
    role: text("Développeur Front-End", "Front-End Developer"),
    engagement: text("Stage / CDD", "Internship / fixed-term contract"),
    description: text(
      "Maintenance front-end d’une plateforme e-santé et IoT, correction de bugs et amélioration de l’expérience utilisateur.",
      "Front-end maintenance for an e-health and IoT platform, bug fixing and user experience improvements.",
    ),
    facts: [
      text("Tests end-to-end avec Cypress", "End-to-end tests with Cypress"),
      text("Suivi des anomalies", "Issue tracking"),
    ],
    technologies: ["React", "TypeScript", "JavaScript", "Cypress", "Git"],
  },
  {
    id: "sante",
    graphId: "sante",
    kind: text("Expérience professionnelle", "Professional experience"),
    title: "SANTÉ RESPIRATOIRE FRANCE",
    period: "01/2022 → 02/2022",
    start: 2022.01,
    end: 2022.17,
    lane: 2,
    role: text("Développeur Front-End", "Front-End Developer"),
    engagement: text("Stage", "Internship"),
    description: text(
      "Site d’information santé avec calculateurs JavaScript, adaptation responsive et corrections d’affichage.",
      "Health information website with JavaScript calculators, responsive adaptation and display fixes.",
    ),
    facts: [
      text("Amélioration des parcours utilisateurs", "Improved user journeys"),
    ],
    technologies: ["JavaScript", "HTML / CSS"],
  },
  {
    id: "iaudiogram",
    graphId: "iaudiogram",
    kind: text(
      "Expérience professionnelle principale",
      "Primary professional experience",
    ),
    title: "IAUDIOGRAM",
    subtitle: "My Medical Assistant",
    period: "09/2022 → 09/2025",
    start: 2022.67,
    end: 2025.67,
    lane: 1,
    role: text("Développeur Web Full-Stack", "Full-Stack Web Developer"),
    engagement: text("Alternance", "Work-study"),
    description: text(
      "Applications médicales liées à l’audiométrie et au suivi patient. Environ trois ans au sein de l’équipe R&D.",
      "Medical applications for audiometry and patient follow-up. Around three years within the R&D team.",
    ),
    facts: [
      text(
        "Refonte React, TypeScript et Electron · composants responsives · intégration API REST",
        "React, TypeScript and Electron redesign · responsive components · REST API integration",
      ),
      text(
        "Correction d’anomalies · stabilisation des parcours · tests Cypress",
        "Bug fixing · journey stabilisation · Cypress tests",
      ),
      text(
        "GitHub · backlog · CI/CD · code reviews · échanges équipe R&D",
        "GitHub · backlog · CI/CD · code reviews · R&D team collaboration",
      ),
    ],
    technologies: [
      "React",
      "TypeScript",
      "Electron",
      "REST API",
      "Cypress",
      "GitHub",
      "CI/CD",
    ],
  },
  {
    id: "greecheck",
    graphId: "greecheck",
    kind: text("Projet personnel", "Personal project"),
    title: "GREECHECK",
    period: "2025 → 2026",
    start: 2025,
    end: 2026.3,
    lane: 2,
    role: text("PWA d’aide au choix alimentaire", "Food decision support PWA"),
    description: text(
      "Scanner, rechercher et comparer des produits avec un score local déterministe et explicable.",
      "Scan, search and compare products with a local, deterministic and explainable score.",
    ),
    facts: [
      text(
        "Français, anglais et arabe · historique, favoris, critères et listes",
        "French, English and Arabic · history, favourites, criteria and lists",
      ),
    ],
    technologies: ["React", "TypeScript", "Next.js", "CI/CD", "Vercel", "Codex"],
  },
];

export const languages = [
  { label: text("Français", "French"), value: text("Bilingue", "Bilingual"), code: "FR" },
  { label: text("Anglais", "English"), value: text("Professionnel", "Professional"), code: "EN" },
  { label: text("Arabe", "Arabic"), value: text("Langue maternelle", "Native language"), code: "AR" },
] as const;

export const interests = [
  "Football",
  text("Musculation", "Strength training"),
  text("Histoire", "History"),
  text("Géopolitique", "Geopolitics"),
  text("Enregistrement", "Recording"),
  text("Mixage", "Mixing"),
  "Mastering",
] as const;

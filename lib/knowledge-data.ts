import {
  text,
  type EvidenceTargetId,
  type Localized,
  type SourceId,
} from "./portfolio-data";
import type { Technology } from "./field-signal";

export type Skill = {
  name: string;
  label?: Localized;
  source: SourceId;
  relations: EvidenceTargetId[];
  signal?: Technology;
};
export type SkillGroup = {
  id: string;
  label: Localized;
  description: Localized;
  skills: Skill[];
};
const skill = (
  name: string,
  relations: EvidenceTargetId[] = [],
  signal?: Technology,
  source: SourceId = "cv2026",
): Skill => ({ name, source, relations, signal });

export const skillGroups: SkillGroup[] = [
  {
    id: "front",
    label: text("Front-end & UI engineering", "Front-end & UI engineering"),
    description: text(
      "Des interfaces lisibles, des composants réutilisables et des parcours adaptés aux écrans.",
      "Readable interfaces, reusable components and journeys that adapt to the screen.",
    ),
    skills: [
      skill("React", ["iaudiogram", "greecheck", "bloom"], "React"),
      skill(
        "Next.js",
        ["greecheck", "bloom", "tech-express"],
        "Next.js",
        "portfolio",
      ),
      skill("TypeScript", ["iaudiogram", "greecheck"], "TypeScript"),
      skill("JavaScript", ["sante"], "JavaScript"),
      skill("Electron", ["iaudiogram"]),
      skill("Angular", ["biosency"]),
      skill("Tailwind CSS", ["bloom", "tech-express"]),
      skill("shadcn/ui"),
      skill("Flutter"),
    ],
  },
  {
    id: "back",
    label: text("Back-end & API", "Back-end & APIs"),
    description: text(
      "Relier l’interface aux services, structurer les échanges et comprendre l’application de bout en bout.",
      "Connect interfaces to services, structure exchanges and understand the application end to end.",
    ),
    skills: [
      skill("Python", ["iaudiogram"], "Python"),
      skill("FastAPI", ["iaudiogram"], "FastAPI"),
      skill("Flask"),
      skill("Node.js"),
      skill("Django"),
      skill("REST", ["iaudiogram"]),
    ],
  },
  {
    id: "data",
    label: text("Bases de données & data", "Databases & data"),
    description: text(
      "Choisir où vivent les données, les intégrer et préserver les choix de l’utilisateur.",
      "Choose where data lives, integrate it and preserve user preferences.",
    ),
    skills: [
      skill("PostgreSQL", ["iaudiogram"]),
      skill("MySQL"),
      skill("MongoDB"),
      skill("IndexedDB / Dexie", ["greecheck"]),
      skill("Open Food Facts", ["greecheck"], undefined, "greecheck"),
    ],
  },
  {
    id: "quality",
    label: text("Tests & qualité logicielle", "Tests & software quality"),
    description: text(
      "Reproduire les anomalies, vérifier les parcours et accompagner les évolutions par des tests.",
      "Reproduce issues, verify journeys and support changes with tests.",
    ),
    skills: [
      skill("Cypress", ["iaudiogram", "biosency"], "Cypress"),
      skill("Vitest"),
      skill("Jest"),
      {
        ...skill("Tests E2E", ["iaudiogram", "biosency"]),
        label: text("Tests E2E", "End-to-end tests"),
      },
      {
        ...skill("Tests unitaires"),
        label: text("Tests unitaires", "Unit tests"),
      },
    ],
  },
  {
    id: "delivery",
    label: text("DevOps & livraison", "DevOps & delivery"),
    description: text(
      "Versionner, tester dans des environnements dédiés et rendre la livraison reproductible.",
      "Version changes, test in dedicated environments and make delivery repeatable.",
    ),
    skills: [
      skill("Docker", ["iaudiogram"], "Docker"),
      skill("Git / GitHub", ["iaudiogram"]),
      skill("GitHub Actions", ["iaudiogram"]),
      skill("CI/CD", ["iaudiogram"], "CI/CD"),
      skill("Vercel", ["greecheck"], "Vercel", "greecheck"),
    ],
  },
  {
    id: "product",
    label: text("Conception produit & design", "Product thinking & design"),
    description: text(
      "Partir d’un usage concret, organiser l’information et affiner le résultat avec l’équipe.",
      "Start with a concrete use case, organise information and refine the result with the team.",
    ),
    skills: [
      skill(
        "UX / UI",
        ["greecheck", "bloom", "tech-express"],
        undefined,
        "portfolio",
      ),
      skill("Responsive", ["sante", "tech-express"], undefined, "portfolio"),
      {
        ...skill("Prototypage", ["greecheck"], undefined, "portfolio"),
        label: text("Prototypage", "Prototyping"),
      },
      skill("Notion", ["iaudiogram"]),
      skill("Codex"),
      skill("Claude CoWork"),
    ],
  },
];

export type Degree = {
  level: "Bac+3" | "Bac+5";
  rncpLevel: 6 | 7;
  title: Localized;
  source: SourceId;
};
export const education = {
  school: "EPSI",
  city: "Montpellier",
  startYear: 2020,
  endYear: 2025,
  field: text("Ingénierie informatique", "Computer engineering"),
  degrees: [
    {
      level: "Bac+3",
      rncpLevel: 6,
      title: text(
        "Concepteur Développeur d’Applications",
        "Application Designer and Developer",
      ),
      source: "cv2026",
    },
    {
      level: "Bac+5",
      rncpLevel: 7,
      title: text(
        "Expert en Informatique et Systèmes d’Information",
        "Expert in Computing and Information Systems",
      ),
      source: "cv2026",
    },
  ] satisfies Degree[],
};
export const certifications = [
  { name: "Google AI Fundamentals", year: 2026, source: "cv2026" as SourceId },
];
export const languages = [
  {
    name: text("Français", "French"),
    level: text("Bilingue", "Bilingual"),
    source: "cv2026",
  },
  {
    name: text("Anglais", "English"),
    level: text("Professionnel", "Professional"),
    source: "cv2026",
  },
  {
    name: text("Arabe", "Arabic"),
    level: text("Langue maternelle", "Native language"),
    source: "cv2026",
  },
];

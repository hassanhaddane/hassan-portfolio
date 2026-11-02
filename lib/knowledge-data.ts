import { text, type EvidenceTargetId, type Localized, type SourceId } from "./portfolio-data";
import type { Technology } from "./field-signal";

export type Skill = {
  name: string;
  label?: Localized;
  source: SourceId;
  // Only direct, documented project or experience relationships are shown.
  relations: EvidenceTargetId[];
  signal?: Technology;
};
export type SkillGroup = {
  id: "front" | "back" | "data" | "quality" | "tools" | "ai";
  label: Localized;
  skills: Skill[];
};

const skill = (name: string, relations: EvidenceTargetId[] = [], signal?: Technology, label?: Localized): Skill => ({
  name, label, source: "cv2026", relations, signal,
});

export const skillGroups: SkillGroup[] = [
  {
    id: "front", label: text("Front-end", "Front end"), skills: [
      skill("React", ["iaudiogram", "greecheck", "bloom", "tech-express"], "React"),
      skill("TypeScript", ["iaudiogram", "greecheck", "bloom", "tech-express"], "TypeScript"),
      skill("Angular", ["biosency"]),
      skill("Electron", ["iaudiogram"]),
      skill("Tailwind CSS", ["bloom", "tech-express"]),
      skill("shadcn/ui"),
      skill("Flutter"),
    ],
  },
  {
    id: "back", label: text("Back-end", "Back end"), skills: [
      skill("Python", ["iaudiogram"], "Python"),
      skill("FastAPI", ["iaudiogram"], "FastAPI"),
      skill("Node.js"),
      skill("Django"),
      skill("Flask"),
      skill("API REST", ["iaudiogram"], undefined, text("API REST", "REST APIs")),
    ],
  },
  {
    id: "data", label: text("Bases de données", "Databases"), skills: [
      skill("PostgreSQL", ["iaudiogram"]),
      skill("MySQL"),
      skill("MongoDB"),
      skill("IndexedDB / Dexie", ["greecheck"]),
    ],
  },
  {
    id: "quality", label: text("Tests & qualité", "Testing & quality"), skills: [
      skill("Cypress", ["iaudiogram", "biosency"]),
      skill("Vitest"),
      skill("Jest"),
      skill("Tests unitaires", [], undefined, text("Tests unitaires", "Unit tests")),
      skill("Tests E2E", ["iaudiogram", "biosency"], undefined, text("Tests E2E", "End-to-end tests")),
    ],
  },
  {
    id: "tools", label: text("DevOps", "DevOps"), skills: [
      skill("Docker", ["iaudiogram"], "Docker"),
      skill("Git"),
      skill("GitHub", ["iaudiogram"]),
      skill("GitHub Actions", ["iaudiogram"]),
      skill("CI/CD", ["iaudiogram"], "CI/CD"),
      skill("Notion", ["iaudiogram"]),
    ],
  },
  {
    id: "ai", label: text("Développement assisté par IA", "AI-assisted development"), skills: [
      skill("Codex"),
      skill("Claude CoWork"),
      skill("Recherche et prototypage assistés", [], undefined, text("Recherche et prototypage assistés", "AI-assisted research and prototyping")),
    ],
  },
];

export type Degree = { level: "Bac+3" | "Bac+5"; rncpLevel: 6 | 7; title: Localized; source: SourceId };
export type Education = { school: string; city: string; startYear: number; endYear: number; field: Localized; degrees: Degree[] };

export const education: Education = {
  school: "EPSI", city: "Montpellier", startYear: 2020, endYear: 2025,
  field: text("Ingénierie informatique", "Computer engineering"),
  degrees: [
    { level: "Bac+3", rncpLevel: 6, title: text("Concepteur Développeur d’Applications", "Application Designer and Developer"), source: "cv2026" },
    { level: "Bac+5", rncpLevel: 7, title: text("Expert en Informatique et Systèmes d’Information", "Expert in Computing and Information Systems"), source: "cv2026" },
  ],
};

export const certifications = [
  { name: "Google AI Fundamentals", year: 2026, source: "cv2026" as SourceId },
];

export const languages: { name: Localized; level: Localized; source: SourceId }[] = [
  { name: text("Français", "French"), level: text("Bilingue", "Bilingual"), source: "cv2026" },
  { name: text("Anglais", "English"), level: text("Professionnel", "Professional"), source: "cv2026" },
  { name: text("Arabe", "Arabic"), level: text("Langue maternelle", "Native language"), source: "cv2026" },
];

export const interests: Localized[] = [
  text("Football", "Football"),
  text("Musculation", "Strength training"),
  text("Histoire", "History"),
  text("Géopolitique", "Geopolitics"),
  text("Enregistrement", "Recording"),
  text("Mixage", "Mixing"),
  text("Mastering", "Mastering"),
];

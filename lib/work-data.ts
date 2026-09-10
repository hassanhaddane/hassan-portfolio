import { text, type Localized } from "./portfolio-data";

export const greeCheck = {
  url: "https://gree-check.vercel.app/fr",
  period: "2025 — 2026",
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
    engagement: text("Alternance", "Apprenticeship"),
    context: text(
      "Développement et amélioration d’applications médicales liées à l’audiométrie et au suivi patient.",
      "Development and improvement of medical applications for audiometry and patient follow-up.",
    ),
    contributions: [
      text(
        "Refonte d’interfaces avec React, TypeScript et Electron",
        "Redesigned interfaces with React, TypeScript and Electron",
      ),
      text(
        "Développement de composants responsives et intégration d’API REST",
        "Developed responsive components and integrated REST APIs",
      ),
      text(
        "Correction d’anomalies, tests Cypress, CI/CD et revues de code avec l’équipe R&D",
        "Bug fixing, Cypress tests, CI/CD and code reviews with the R&D team",
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
      "Développement d’un site d’information sur la santé respiratoire.",
      "Development of a respiratory health information website.",
    ),
    contributions: [
      text(
        "Création de calculateurs interactifs en JavaScript",
        "Built interactive calculators in JavaScript",
      ),
      text(
        "Adaptation du site aux écrans mobiles",
        "Adapted the site for mobile screens",
      ),
      text(
        "Correction de problèmes d’affichage et amélioration des parcours",
        "Fixed display issues and improved user flows",
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
      "Maintenance du front-end d’une plateforme de télésuivi médical liée à l’e-santé et à l’IoT.",
      "Front-end maintenance for a remote medical monitoring platform using connected health devices.",
    ),
    contributions: [
      text("Correction de bugs et amélioration de l’interface", "Fixed bugs and improved the interface"),
      text("Ajout et maintenance de tests end-to-end avec Cypress", "Added and maintained end-to-end tests with Cypress"),
      text("Suivi des anomalies", "Tracked reported issues"),
    ],
    tools: ["Front-End", "IoT", "Cypress E2E"],
    signal: "iot",
  },
];

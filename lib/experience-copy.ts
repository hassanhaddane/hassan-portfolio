import { text } from "./portfolio-data";

export const chapters = [
  { id: "profil", label: text("Accueil", "Home") },
  { id: "projets", label: text("Projets", "Work") },
  { id: "experience", label: text("Expérience", "Experience") },
  { id: "stack", label: text("Expertise", "Expertise") },
  { id: "about", label: text("À propos", "About") },
  { id: "contact", label: text("Contact", "Contact") },
] as const;

export const experienceCopy = {
  heroTitle: text("DÉVELOPPEUR", "DEVELOPER"),
  heroCreative: text("ESPRIT CRÉATIF.", "CREATIVE MIND."),
  heroDescription: text(
    "Je conçois des produits solides et des expériences numériques qui ont du rythme.",
    "I build thoughtful software and digital experiences with a sense of rhythm.",
  ),
  heroSpecialty: text(
    "Interfaces React, API Python et attention au détail. Du logiciel médical aux projets culturels.",
    "React interfaces, Python APIs and care for the details. From medical software to cultural projects.",
  ),
  workTitle: text("DU CODE. DU CONCRET.", "BUILT. WITH INTENT."),
  workIntro: text(
    "Des produits à utiliser, des univers à explorer. Une sélection entre ingénierie, design et culture.",
    "Products to use, worlds to explore. Selected work across engineering, design and culture.",
  ),
  journeyTitle: text("L’EXPÉRIENCE DU TERRAIN.", "BUILT ON EXPERIENCE."),
  expertiseTitle: text("DE L’INTERFACE À L’API.", "FROM INTERFACE TO API."),
  aboutTitle: text("LE CODE A SON RYTHME.", "CODE HAS A RHYTHM."),
  contactTitle: text("ON ACCORDE\nNOS IDÉES ?", "LET’S FIND\nOUR FREQUENCY."),
  contactIntro: text(
    "Un produit à construire, une interface à repenser, une équipe à rejoindre. Racontez-moi ce qui vous occupe : je vous parlerai de ce que je peux y apporter.",
    "A product to build, an interface to rethink, a team to join. Tell me what you’re working on. I’ll tell you how I could contribute.",
  ),
};

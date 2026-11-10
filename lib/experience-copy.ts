import { text } from "./portfolio-data";

export const chapters = [
  { id: "profil", label: text("Intro", "Intro") },
  { id: "projets", label: text("Projets", "Work") },
  { id: "stack", label: text("Engineering", "Engineering") },
  { id: "experience", label: text("Parcours", "Journey") },
  { id: "about", label: text("À propos", "About") },
  { id: "contact", label: text("Contact", "Contact") },
] as const;

export const experienceCopy = {
  journeyTitle: text("Parcours.", "Journey."),
  expertiseTitle: text("Du pixel au système.", "From pixel to system."),
  aboutTitle: text(
    "Le même instinct. Deux langages.",
    "One instinct. Two languages.",
  ),
  contactTitle: text("FAISONS DU BRUIT.", "MAKE SOME NOISE."),
  contactIntro: text(
    "Un produit à construire, une interface à repenser, une équipe à rejoindre. Racontez-moi ce qui vous occupe : je vous parlerai de ce que je peux y apporter.",
    "A product to build, an interface to rethink, a team to join. Tell me what you’re working on. I’ll tell you how I could contribute.",
  ),
};

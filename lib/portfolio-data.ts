export type Locale = "fr" | "en";
export type Localized = Record<Locale, string>;
export const text = (fr: string, en: string): Localized => ({ fr, en });

export const profile = {
  name: "Hassan Haddane",
  alias: "LOWKYZ",
  email: "hassanhaddane33s@gmail.com",
  phone: "07 60 58 26 74",
  phoneHref: "+33760582674",
  github: "https://github.com/hassanhaddane",
  linkedin: "https://www.linkedin.com/in/hassanhaddane/",
  cv: "/cv-hassan-haddane.pdf",
};

export const copy = {
  role: text(
    "Développeur Full-Stack · Focus Front-End",
    "Full-Stack developer · Front-End focus",
  ),
  intro: text(
    "Je construis des interfaces claires.\nEt les systèmes qui les font vivre.",
    "I build clear interfaces.\nAnd the systems that bring them to life.",
  ),
  available: text("Ouvert aux opportunités", "Open to opportunities"),
  projects: text("Voir mes projets", "View my work"),
  download: text("Télécharger le CV", "Download résumé"),
  contact: text("Me contacter", "Get in touch"),
  about: text("Profil", "Profile"),
  work: text("Projets", "Work"),
  projectsTitle: text("Du code.\nDu concret.", "Real code.\nReal work."),
  projectsLabel: text("Projets sélectionnés", "Selected work"),
  context: text("Le contexte", "The context"),
  contribution: text("Ma contribution", "My contribution"),
  dossier: text("Explorer le dossier", "Explore the case study"),
  close: text("Fermer", "Close"),
  copyEmail: text("Copier l’adresse", "Copy email"),
  copied: text("Adresse copiée", "Email copied"),
  copyFailed: text(
    "Copie indisponible. Vous pouvez sélectionner l’adresse.",
    "Copy unavailable. You can select the email address.",
  ),
  motionOff: text("Mouvement réduit", "Reduced motion"),
  motionOn: text("Animations autorisées", "Motion enabled"),
  motionSystem: text(
    "Mouvement réduit par votre système",
    "Motion reduced by your system",
  ),
  commandTitle: text("Où voulez-vous aller ?", "Where would you like to go?"),
  commandPlaceholder: text(
    "Rechercher une page ou une action…",
    "Search a section or action…",
  ),
  noResults: text(
    "Aucun résultat. Essayez « projets » ou « contact ».",
    "No results. Try “work” or “contact”.",
  ),
};


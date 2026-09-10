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
  download: text("Télécharger mon CV", "Download my résumé"),
  close: text("Fermer", "Close"),
  copied: text("Email copié", "Email copied"),
  motionSystem: text(
    "Mouvement réduit par votre système",
    "Motion reduced by your system",
  ),
  commandTitle: text("Où voulez-vous aller ?", "Where would you like to go?"),
  commandPlaceholder: text(
    "Rechercher une section ou une action…",
    "Search a section or action…",
  ),
  noResults: text(
    "Aucun résultat. Essayez « projets » ou « contact ».",
    "No results. Try “work” or “contact”.",
  ),
};


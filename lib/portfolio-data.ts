export type Locale = "fr" | "en";
export type Localized = Record<Locale, string>;
export const text = (fr: string, en: string): Localized => ({ fr, en });

// Provenance stays in data, never in the public copy.
export type SourceId = "cv2026" | "portfolio" | "greecheck" | "bloom" | "techExpress" | "ceo19";
export type EvidenceTargetId =
  | "iaudiogram" | "sante" | "biosency"
  | "greecheck" | "bloom" | "tech-express";
export type Evidence = { statement: Localized; source: SourceId };

export const sources: Record<SourceId, string> = {
  cv2026: "CV_Hassan_HADDANE_Dev.pdf, supplied 2026-10-31",
  portfolio: "Existing hassan-portfolio repository and public GreeCheck screenshots",
  greecheck: "https://github.com/hassanhaddane/GreeCheck and https://gree-check.vercel.app/fr",
  bloom: "C:/Users/hassa/Documents/808Bloom and https://808bloom.vercel.app/fr",
  techExpress: "C:/Users/hassa/Documents/TechExpress and public GitHub Pages TechExpress / TechExpressProject deployments, inspected 2026-11-01",
  ceo19: "https://github.com/hassanhaddane/ceo19 (public source); https://ceo19.vercel.app/en paused with HTTP 503 on 2026-11-01",
};

export const profile = {
  name: "Hassan Haddane",
  alias: "LOWKYZ",
  role: text("Développeur Full-Stack", "Full-Stack Developer"),
  experienceYearsMinimum: 3,
  experience: text("3+ ans d’expérience professionnelle", "3+ years of professional experience"),
  educationLevel: text("Bac+5 en ingénierie informatique", "Master’s level degree in computer engineering"),
  location: text("Rennes, France", "Rennes, France"),
  mobility: text("Bretagne, Nantes et Paris", "Brittany, Nantes and Paris"),
  drivingLicence: "B",
  summary: text(
    "Développeur Full-Stack avec plus de trois ans d’expérience professionnelle, principalement dans les logiciels de santé. Je conçois des interfaces, des API et des applications avec une attention portée aux tests et à l’expérience utilisateur.",
    "Full-Stack Developer with over three years of professional experience, mainly in healthcare software. I build interfaces, APIs and applications with a focus on testing and user experience.",
  ),
  email: "hassanhaddane33s@gmail.com",
  phone: "07 60 58 26 74",
  phoneHref: "+33760582674",
  github: "https://github.com/hassanhaddane",
  linkedin: "https://www.linkedin.com/in/hassanhaddane/",
  cv: "/cv-hassan-haddane.pdf",
} as const;

export const copy = {
  download: text("Télécharger mon CV", "Download my résumé"),
  close: text("Fermer", "Close"),
  copied: text("Email copié", "Email copied"),
  motionSystem: text("Mouvement réduit par votre système", "Motion reduced by your system"),
  commandTitle: text("Où voulez-vous aller ?", "Where would you like to go?"),
  commandPlaceholder: text("Rechercher une section ou une action…", "Search a section or action…"),
  noResults: text("Aucun résultat. Essayez « projets » ou « contact ».", "No results. Try “work” or “contact”."),
};

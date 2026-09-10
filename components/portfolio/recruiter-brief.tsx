"use client";

import { ArrowDownToLine, ArrowDownRight } from "lucide-react";
import { usePreferences } from "@/components/system/preferences";
import { profile } from "@/lib/portfolio-data";

export function RecruiterBrief() {
  const { locale } = usePreferences();
  const entries = [
    {
      index: "01",
      label: locale === "fr" ? "PROJET PRINCIPAL" : "FEATURED PROJECT",
      title: "GreeCheck",
      detail: locale === "fr"
        ? "PWA pour scanner, rechercher et comparer des produits alimentaires."
        : "A PWA for scanning, searching and comparing food products.",
      href: "#projets",
    },
    {
      index: "02",
      label: locale === "fr" ? "EXPÉRIENCE PRINCIPALE" : "MAIN EXPERIENCE",
      title: "iAudiogram · My Medical Assistant",
      detail: locale === "fr"
        ? "Développeur Web Full-Stack · Alternance · 09/2022 → 09/2025"
        : "Full-Stack Web Developer · Apprenticeship · 09/2022 → 09/2025",
      href: "#experience",
    },
    {
      index: "03",
      label: locale === "fr" ? "STACK PRINCIPALE" : "CORE STACK",
      title: "React · Next.js · TypeScript",
      detail: "Python · FastAPI · Node.js · Docker · PostgreSQL · CI/CD",
      href: "#stack",
    },
    {
      index: "04",
      label: locale === "fr" ? "DISPONIBILITÉ" : "AVAILABILITY",
      title: locale === "fr" ? "Recherche CDI" : "Open to permanent roles",
      detail: locale === "fr" ? "Rennes · Bretagne / Nantes" : "Rennes · Brittany / Nantes",
      href: "#contact",
    },
  ];

  return (
    <section className="recruiter-brief section-shell" aria-labelledby="recruiter-brief-title">
      <header>
        <div>
          <span className="mono">RECRUITER / {locale === "fr" ? "LECTURE RAPIDE" : "QUICK READ"}</span>
          <h2 id="recruiter-brief-title">
            {locale === "fr" ? "Le profil en un regard." : "The profile at a glance."}
          </h2>
        </div>
        <a href={profile.cv} download="CV-Hassan-Haddane.pdf" data-cursor="DOWNLOAD">
          <span>{locale === "fr" ? "TÉLÉCHARGER LE CV" : "DOWNLOAD RÉSUMÉ"}</span>
          <ArrowDownToLine aria-hidden="true" />
        </a>
      </header>
      <nav aria-label={locale === "fr" ? "Résumé du profil" : "Profile summary"}>
        {entries.map((entry) => (
          <a key={entry.index} href={entry.href} data-cursor="VIEW">
            <span className="mono">{entry.index} / {entry.label}</span>
            <strong>{entry.title}</strong>
            <small>{entry.detail}</small>
            <ArrowDownRight aria-hidden="true" />
          </a>
        ))}
      </nav>
    </section>
  );
}

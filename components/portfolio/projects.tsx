"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { usePreferences } from "@/components/system/preferences";
import { greeCheck } from "@/lib/work-data";
import { ChapterIdentity, EntityTypeMarker } from "./narrative";

const features = {
  fr: [
    "Scanner un code-barres ou rechercher un produit",
    "Comparer plusieurs produits et consulter leur GreeScore",
    "Utiliser l’application en français, anglais ou arabe",
    "Conserver sur l’appareil l’historique, les favoris, les listes et les critères personnalisés",
  ],
  en: [
    "Scan a barcode or search for a product",
    "Compare several products and view their GreeScore",
    "Use the application in French, English or Arabic",
    "Keep history, favourites, lists and custom criteria on the device",
  ],
} as const;

export function Projects() {
  const { locale } = usePreferences();

  return (
    <section
      id="projets"
      data-section
      tabIndex={-1}
      className="clarity-section clarity-project section-shell section-space"
      aria-labelledby="projects-title"
    >
      <header className="clarity-section-header">
        <ChapterIdentity
          index="02"
          kind="project"
          category={{ fr: "PROJET", en: "PROJECT" }}
          title={{ fr: "GREECHECK", en: "GREECHECK" }}
        />
        <div className="clarity-section-heading">
          <span className="mono">2025 — 2026</span>
          <h2 id="projects-title">{locale === "fr" ? "SCANNER, RECHERCHER ET COMPARER." : "SCAN, SEARCH AND COMPARE."}</h2>
          <p>
            {locale === "fr"
              ? "GreeCheck est une application web installable (PWA) qui permet de scanner, rechercher et comparer des produits alimentaires."
              : "GreeCheck is an installable web app (PWA) for scanning, searching and comparing food products."}
          </p>
        </div>
      </header>

      <article id="greecheck" tabIndex={-1} className="clarity-project-case" data-entity-kind="project">
        <header className="clarity-project-title">
          <EntityTypeMarker kind="project" index="01" />
          <div>
            <p className="clarity-project-meta mono">
              <span>{locale === "fr" ? "PROJET PERSONNEL" : "PERSONAL PROJECT"}</span>
              <span>{greeCheck.period}</span>
            </p>
            <h3>GREECHECK</h3>
            <p>
              {locale === "fr"
                ? "L’application fonctionne sur ordinateur et mobile, en français, en anglais et en arabe."
                : "The application works on desktop and mobile in French, English and Arabic."}
            </p>
          </div>
          <a href={greeCheck.url} target="_blank" rel="noopener noreferrer" data-cursor="OPEN">
            {locale === "fr" ? "Ouvrir le projet" : "Open project"}
            <ArrowUpRight aria-hidden="true" />
          </a>
        </header>

        <figure className="clarity-project-preview">
          <div className="clarity-preview-bar mono" aria-hidden="true">
            <span>GREECHECK</span>
            <span>gree-check.vercel.app</span>
          </div>
          <div className="clarity-preview-image project-image-desktop">
            <Image
              src="/projects/greecheck/home-desktop.png"
              alt={locale === "fr" ? "Accueil public de GreeCheck sur ordinateur" : "GreeCheck public home screen on desktop"}
              fill
              sizes="(max-width: 900px) 100vw, 82vw"
            />
          </div>
          <div className="clarity-preview-image project-image-mobile">
            <Image
              src="/projects/greecheck/home-mobile-clean.png"
              alt={locale === "fr" ? "Accueil public de GreeCheck sur mobile" : "GreeCheck public home screen on mobile"}
              fill
              sizes="92vw"
            />
          </div>
          <figcaption>
            {locale === "fr" ? "Capture de l’application." : "Application screenshot."}
          </figcaption>
        </figure>

        <div className="clarity-project-details">
          <section aria-labelledby="project-objective">
            <span className="mono">01 / {locale === "fr" ? "OBJECTIF" : "GOAL"}</span>
            <h4 id="project-objective">{locale === "fr" ? "Objectif" : "Goal"}</h4>
            <p>
              {locale === "fr"
                ? "Présenter les informations utiles d’un produit et fournir un GreeScore calculé localement selon des règles déterministes et explicables."
                : "Present useful product information and provide a GreeScore calculated locally with deterministic, explainable rules."}
            </p>
          </section>

          <section aria-labelledby="project-features">
            <span className="mono">02 / {locale === "fr" ? "FONCTIONNALITÉS" : "FEATURES"}</span>
            <h4 id="project-features">{locale === "fr" ? "Fonctionnalités" : "Features"}</h4>
            <ul>
              {features[locale].map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
          </section>

          <section aria-labelledby="project-technologies">
            <span className="mono">03 / {locale === "fr" ? "TECHNOLOGIES" : "TECHNOLOGIES"}</span>
            <h4 id="project-technologies">Technologies</h4>
            <ul className="clarity-inline-list">
              {greeCheck.stack.map((technology) => <li key={technology}>{technology}</li>)}
            </ul>
          </section>
        </div>
      </article>
    </section>
  );
}

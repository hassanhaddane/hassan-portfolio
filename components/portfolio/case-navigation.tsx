"use client";

import { ArrowLeft, ArrowUp, Waves } from "lucide-react";
import { Wordmark } from "@/components/ui/wordmark";
import {
  useActiveSection,
  usePreferences,
} from "@/components/system/preferences";
import type { Locale } from "@/lib/portfolio-data";

export function CaseNavigation({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const active = useActiveSection();
  const { motion, systemReduced, toggleMotion } = usePreferences();
  const fr = locale === "fr";
  const opposite = fr ? "en" : "fr";
  const entries = [
    ["case-intro", fr ? "Projet" : "Project"],
    ["case-context", fr ? "Intention" : "Intent"],
    ["case-decisions", fr ? "Construction" : "Making"],
    ["case-features", fr ? "Expérience" : "Experience"],
    ["case-result", fr ? "Résultat" : "Result"],
    ["case-links", fr ? "Explorer" : "Explore"],
  ];
  return (
    <>
      <a className="case-skip" href="#case-content">
        {fr ? "Aller au contenu" : "Skip to content"}
      </a>
      <header className="case-topbar">
        <a
          className="case-brand"
          aria-label="LOWKYZ — Hassan Haddane"
          href={`/${locale}`}
        >
          <Wordmark />
        </a>
        <nav
          aria-label={
            fr ? "Navigation de l’étude de cas" : "Case study navigation"
          }
        >
          <a
            href={`/${locale}#${slug}`}
            aria-label={fr ? "Retour aux projets" : "Back to work"}
          >
            <ArrowLeft aria-hidden="true" />
            <span>{fr ? "Retour aux projets" : "Back to work"}</span>
          </a>
          <button
            className="icon-control"
            onClick={toggleMotion}
            disabled={systemReduced}
            aria-pressed={!motion}
            aria-label={
              fr
                ? motion
                  ? "Réduire le mouvement"
                  : "Activer le mouvement"
                : motion
                  ? "Reduce motion"
                  : "Enable motion"
            }
          >
            <Waves aria-hidden="true" />
          </button>
          <a
            href={`/${opposite}/work/${slug}`}
            hrefLang={opposite}
            lang={opposite}
          >
            {opposite.toUpperCase()}
          </a>
        </nav>
        <span className="scroll-progress" aria-hidden="true" />
      </header>
      <nav
        className="case-reading-nav"
        aria-label={fr ? "Sommaire" : "Contents"}
      >
        {entries.map(([id, title], index) => (
          <a
            key={id}
            href={`#${id}`}
            aria-label={`${String(index + 1).padStart(2, "0")} ${title}`}
            aria-current={active === id ? "location" : undefined}
          >
            <span className="mono">0{index + 1}</span>
            <span>{title}</span>
          </a>
        ))}
        <span
          className="case-meter mono"
          data-scroll-meter
          role="progressbar"
          aria-label={fr ? "Progression de lecture" : "Reading progress"}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={0}
        >
          <span data-scroll-readout>000%</span>
          <ArrowUp aria-hidden="true" />
        </span>
      </nav>
    </>
  );
}

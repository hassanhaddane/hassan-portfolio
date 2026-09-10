"use client";

import { usePreferences } from "@/components/system/preferences";
import { ChapterIdentity } from "./narrative";

export function About() {
  const { locale } = usePreferences();

  const languages = locale === "fr"
    ? [["Français", "Bilingue"], ["Anglais", "Professionnel"], ["Arabe", "Langue maternelle"]]
    : [["French", "Bilingual"], ["English", "Professional"], ["Arabic", "Native language"]];

  return (
    <section
      id="about"
      data-section
      tabIndex={-1}
      className="clarity-section clarity-about section-shell section-space"
      aria-labelledby="about-title"
    >
      <header className="clarity-section-header">
        <ChapterIdentity
          index="06"
          kind="about"
          category={{ fr: "À PROPOS", en: "ABOUT" }}
          title={{ fr: "HASSAN HADDANE", en: "HASSAN HADDANE" }}
        />
        <div className="clarity-section-heading">
          <span className="mono">HASSAN HADDANE</span>
          <h2 id="about-title">{locale === "fr" ? "DÉVELOPPEUR WEB À RENNES." : "WEB DEVELOPER IN RENNES."}</h2>
          <p>
            {locale === "fr"
              ? "J’ai plus de trois ans d’expérience, principalement sur des applications web liées à la santé. J’aime surtout développer des interfaces claires, tout en gardant une vue sur les API, les tests et la mise en production."
              : "I have over three years of experience, mainly working on web applications in healthcare. I particularly enjoy building clear interfaces, and I also work on APIs, testing and deployment."}
          </p>
        </div>
      </header>

      <div className="clarity-about-grid">
        <section aria-labelledby="about-languages">
          <span className="mono">01 / {locale === "fr" ? "LANGUES" : "LANGUAGES"}</span>
          <h3 id="about-languages">{locale === "fr" ? "Langues" : "Languages"}</h3>
          <dl>
            {languages.map(([language, level]) => (
              <div key={language}>
                <dt>{language}</dt>
                <dd>{level}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="about-interests">
          <span className="mono">02 / {locale === "fr" ? "EN DEHORS DU TRAVAIL" : "OUTSIDE WORK"}</span>
          <h3 id="about-interests">{locale === "fr" ? "En dehors du développement" : "Outside development"}</h3>
          <p>
            {locale === "fr"
              ? "Je pratique le football et la musculation. Je m’intéresse aussi à l’histoire, à la géopolitique et au travail du son : enregistrement, mixage et mastering."
              : "I play football and train at the gym. I am also interested in history, geopolitics and audio work: recording, mixing and mastering."}
          </p>
        </section>
      </div>
    </section>
  );
}

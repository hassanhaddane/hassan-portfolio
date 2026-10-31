"use client";

import { usePreferences } from "@/components/system/preferences";
import { interests, languages } from "@/lib/knowledge-data";
import { profile } from "@/lib/portfolio-data";
import { bloom } from "@/lib/work-data";
import { ChapterIdentity } from "./narrative";

export function About() {
  const { locale } = usePreferences();

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
          <h2 id="about-title">{profile.role[locale].toUpperCase()} · {profile.location[locale].toUpperCase()}.</h2>
          <p>{profile.summary[locale]}</p>
        </div>
      </header>

      <div className="clarity-about-grid">
        <section aria-labelledby="about-languages">
          <span className="mono">01 / {locale === "fr" ? "LANGUES" : "LANGUAGES"}</span>
          <h3 id="about-languages">{locale === "fr" ? "Langues" : "Languages"}</h3>
          <dl>
            {languages.map((language) => (
              <div key={language.name.en}>
                <dt>{language.name[locale]}</dt>
                <dd>{language.level[locale]}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="lab" data-section tabIndex={-1} aria-labelledby="about-interests">
          <span className="mono">02 / LAB</span>
          <h3 id="about-interests">{locale === "fr" ? "Culture, son et projets associatifs" : "Culture, sound and community work"}</h3>
          <p>{interests.map((interest, index) => (
            <span key={interest.en} className="about-interest">{index > 0 ? " · " : ""}{interest[locale]}</span>
          ))}</p>
          <p>{locale === "fr" ? "Depuis mai 2026, je participe bénévolement à 808BLOOM : studio, événements et site de l’association." : "Since May 2026, I have volunteered with 808BLOOM, contributing to the studio, events and association website."} <a href={bloom.url} target="_blank" rel="noopener noreferrer">{locale === "fr" ? "Voir le site" : "Visit the website"}</a></p>
        </section>
      </div>
    </section>
  );
}

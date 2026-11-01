"use client";

import Image from "next/image";
import { usePreferences } from "@/components/system/preferences";
import { languages } from "@/lib/knowledge-data";
import { personalStory } from "@/lib/personal-data";
import { profile } from "@/lib/portfolio-data";
import { ChapterIdentity } from "./narrative";

export function AboutV2() {
  const { locale } = usePreferences();
  return (
    <section id="about" data-section tabIndex={-1} className="clarity-section section-shell section-space personal-v2" aria-labelledby="about-title">
      <header className="clarity-section-header reveal" data-reveal="mask">
        <ChapterIdentity index="06" kind="about" category={{ fr: "À PROPOS", en: "ABOUT" }} title={{ fr: "HASSAN HADDANE", en: "HASSAN HADDANE" }} />
        <div className="clarity-section-heading">
          <span className="mono">{profile.role[locale].toUpperCase()} / {profile.location[locale].toUpperCase()}</span>
          <h2 id="about-title">{personalStory.title[locale]}</h2>
          <p>{personalStory.introduction[locale]}</p>
        </div>
      </header>

      <div className="personal-v2-composition">
        <figure className="personal-v2-portrait reveal" data-reveal="line">
          <div className="personal-v2-portrait-frame">
            <span className="personal-v2-portrait-ring" aria-hidden="true" />
            <Image src="/profile/hassan-haddane-cv.png" alt={locale === "fr" ? "Portrait de Hassan Haddane issu de son CV" : "Portrait of Hassan Haddane from his résumé"} width={306} height={306} sizes="(max-width: 700px) 180px, 260px" />
          </div>
          <figcaption className="mono">HASSAN HADDANE <span>/</span> {locale === "fr" ? "PORTRAIT DU CV 2026" : "2026 RÉSUMÉ PORTRAIT"}</figcaption>
        </figure>
        <div className="personal-v2-copy">
          <p className="personal-v2-lead">{personalStory.practice[locale]}</p>
          <div className="personal-v2-notes">
            <div><span className="mono">01 / {locale === "fr" ? "AUDIO & COLLECTIF" : "AUDIO & COLLECTIVE"}</span><p>{personalStory.beyond[locale]} <a href={`/${locale}/work/808bloom`}>{locale === "fr" ? "Voir 808BLOOM ↗" : "Explore 808BLOOM ↗"}</a></p></div>
            <div><span className="mono">02 / {locale === "fr" ? "CURIOSITÉ" : "CURIOSITY"}</span><p>{personalStory.curiosity[locale]}</p></div>
          </div>
        </div>
      </div>

      <div className="personal-v2-languages">
        <span className="mono">{locale === "fr" ? "LANGUES" : "LANGUAGES"}</span>
        <ul>{languages.map((language) => <li key={language.name.en}><strong>{language.name[locale]}</strong><span>{language.level[locale]}</span></li>)}</ul>
      </div>
      <svg className="personal-v2-wave" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 50 C130 50 150 12 280 50 S430 87 560 50 S710 12 840 50 S990 87 1120 50 S1290 12 1440 50" /></svg>
    </section>
  );
}

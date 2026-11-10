import type { Locale } from "@/lib/portfolio-data";
import Image from "next/image";
import { PracticeSwitch } from "./practice-switch";
import { languages } from "@/lib/knowledge-data";
import { personalStory } from "@/lib/personal-data";
import { experienceCopy as words } from "@/lib/experience-copy";
import { SectionHeading } from "./section-heading";

export function About({ locale }: { locale: Locale }) {
  return (
    <section
      id="about"
      data-section
      tabIndex={-1}
      className="about-section section-shell section-space"
      aria-labelledby="about-title"
    >
      <SectionHeading
        number="04"
        label={locale === "fr" ? "À PROPOS" : "ABOUT"}
        title={words.aboutTitle[locale]}
        id="about-title"
      />
      <div className="about-composition">
        <figure className="about-portrait">
          <div className="portrait-register" aria-hidden="true">
            LOWKYZ
          </div>
          <div className="portrait-frame">
            <Image
              src="/profile/hassan-haddane-portrait.png"
              alt="Hassan Haddane"
              width={1414}
              height={2000}
              sizes="(max-width: 480px) 105vw, (max-width: 760px) 500px, 43vw"
            />
          </div>
          <figcaption className="mono">
            HASSAN HADDANE<span>RENNES, FRANCE</span>
          </figcaption>
        </figure>
        <div className="about-copy">
          <p className="about-lead">{personalStory.introduction[locale]}</p>
          <PracticeSwitch locale={locale} />
          <div className="about-curiosity">
            <span className="mono">
              {locale === "fr" ? "HORS ÉCRAN" : "OFF SCREEN"}
            </span>
            <p>{personalStory.curiosity[locale]}</p>
          </div>
        </div>
      </div>
      <div className="about-languages mono">
        {languages.map((language) => (
          <span key={language.name.en}>
            {language.name[locale]}
            <strong>{language.level[locale]}</strong>
          </span>
        ))}
      </div>
    </section>
  );
}

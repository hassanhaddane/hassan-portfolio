import type { Locale } from "@/lib/portfolio-data";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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
          <Image
            src="/profile/hassan-haddane-cv.png"
            alt="Hassan Haddane"
            width={306}
            height={306}
            sizes="(max-width: 700px) 65vw, 30vw"
          />
          <figcaption className="mono">
            HASSAN HADDANE<span>RENNES, FRANCE</span>
          </figcaption>
        </figure>
        <div className="about-copy">
          <p className="about-lead">{personalStory.introduction[locale]}</p>
          <p>{personalStory.practice[locale]}</p>
          <div className="about-notes">
            <div>
              <h3>
                {locale === "fr"
                  ? "Le son, l’autre langage."
                  : "Sound, another language."}
              </h3>
              <p>{personalStory.beyond[locale]}</p>
              <a className="text-link" href={`/${locale}/work/808bloom`}>
                808BLOOM
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
            <div>
              <h3>
                {locale === "fr"
                  ? "Garder l’esprit ouvert."
                  : "Keep an open mind."}
              </h3>
              <p>{personalStory.curiosity[locale]}</p>
            </div>
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

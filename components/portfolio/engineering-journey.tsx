import { Plus } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { education, certifications } from "@/lib/knowledge-data";
import { professionalWork } from "@/lib/work-data";
import { EngineeringSystem } from "./engineering-system";
import { experienceCopy as words } from "@/lib/experience-copy";
import type { Locale } from "@/lib/portfolio-data";

function ExperienceJourney({ locale }: { locale: Locale }) {
  return (
    <section
      id="experience"
      data-section
      tabIndex={-1}
      className="journey-section section-shell section-space"
      aria-labelledby="experience-title"
    >
      <SectionHeading
        number="03"
        label={locale === "fr" ? "PARCOURS" : "EXPERIENCE"}
        title={words.journeyTitle[locale]}
        id="experience-title"
      />
      <svg
        className="journey-score"
        viewBox="0 0 600 175"
        role="img"
        aria-label={
          locale === "fr"
            ? "Chronologie des expériences et de la formation, de 2020 à 2026"
            : "Work and education timeline, from 2020 to 2026"
        }
      >
        {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map((year, i) => (
          <g key={year}>
            <path d={`M${i * 100} 20 V150`} />
            <text x={Math.min(575, i * 100)} y="170">
              {year}
            </text>
          </g>
        ))}
        {professionalWork.map((work, i) => {
          const month = (date: string) =>
            Number(date.slice(0, 4)) + (Number(date.slice(5, 7)) - 1) / 12;
          const x = (month(work.start) - 2020) * 100;
          return (
            <a key={work.id} href={`#${work.id}`}>
              <title>{`${work.company} — ${work.period[locale]}`}</title>
              <rect
                x={x}
                y={22 + i * 32}
                width={Math.max(5, (month(work.end) - month(work.start)) * 100)}
                height="12"
              />
              <text x={x + 5} y={18 + i * 32}>
                {work.company}
              </text>
            </a>
          );
        })}
        <a href="#education">
          <title>EPSI / 2020—2025</title>
          <rect x="0" y="122" width="500" height="12" />
          <text x="5" y="118">
            EPSI / 2020—2025
          </text>
        </a>
      </svg>
      <nav
        className="journey-index mono"
        aria-label={
          locale === "fr" ? "Explorer le parcours" : "Explore the journey"
        }
      >
        {professionalWork.map((work) => (
          <a key={work.id} href={`#${work.id}`}>
            <span>
              {work.start.slice(0, 4)}
              {work.start.slice(0, 4) !== work.end.slice(0, 4)
                ? `—${work.end.slice(0, 4)}`
                : ""}
            </span>
            {work.company}
            <span aria-hidden="true">↘</span>
          </a>
        ))}
        <a href="#education">
          <span>2020—2025</span>EPSI<span aria-hidden="true">↘</span>
        </a>
      </nav>
      <div className="experience-ledger">
        {professionalWork.map((work, index) => (
          <article
            key={work.id}
            id={work.id}
            data-story-mode={index % 3}
            tabIndex={-1}
            className="experience-entry"
          >
            <div className="experience-date">
              <span className="mono">
                0{index + 1} / {work.engagement[locale]}
              </span>
              <p>
                <time dateTime={work.start}>
                  {work.period[locale].split(" — ")[0]}
                </time>
                <span> — </span>
                <time dateTime={work.end}>
                  {work.period[locale].split(" — ")[1]}
                </time>
              </p>
            </div>
            <div className="experience-company">
              <span className="journey-mark" aria-hidden="true">
                0{index + 1}
              </span>
              <h3>{work.company}</h3>
              {work.product ? (
                <p>
                  {locale === "en" && work.productEn
                    ? work.productEn
                    : work.product}
                </p>
              ) : null}
              <span>{work.role[locale]}</span>
            </div>
            <div className="experience-content">
              <p>{work.context[locale]}</p>
              <ul>
                {work.contributions.slice(0, 2).map((item) => (
                  <li key={item.statement.en}>{item.statement[locale]}</li>
                ))}
              </ul>
              {/* Native open state can be restored by browser history before hydration. */}
              {work.contributions.length > 2 ? (
                <details suppressHydrationWarning>
                  <summary>
                    {locale === "fr"
                      ? "Qualité, livraison et collaboration"
                      : "Quality, delivery and collaboration"}
                    <Plus aria-hidden="true" />
                  </summary>
                  <ul>
                    {work.contributions.slice(2).map((item) => (
                      <li key={item.statement.en}>{item.statement[locale]}</li>
                    ))}
                  </ul>
                </details>
              ) : null}
              <p className="experience-tools mono">
                {work.tools.filter((tool) => tool !== "Notion").join(" / ")}
              </p>
            </div>
          </article>
        ))}
      </div>
      <div id="education" tabIndex={-1} className="education-strip">
        <div>
          <span className="mono">
            {locale === "fr" ? "FORMATION" : "EDUCATION"} / 2020—2025
          </span>
          <h3>
            {education.school} <span>Montpellier</span>
          </h3>
          <p>{education.field[locale]}</p>
        </div>
        <div>
          {[...education.degrees].reverse().map((degree) => (
            <p key={degree.level}>
              <strong>
                {degree.level} · RNCP {degree.rncpLevel}
              </strong>
              <span>{degree.title[locale]}</span>
            </p>
          ))}
        </div>
        <p className="education-cert mono">
          {certifications[0].name}
          <span>2026</span>
        </p>
      </div>
    </section>
  );
}

function Expertise({ locale }: { locale: Locale }) {
  return (
    <section
      id="stack"
      data-section
      tabIndex={-1}
      className="expertise-section section-shell section-space"
      aria-labelledby="expertise-title"
    >
      <SectionHeading
        number="02"
        label="ENGINEERING"
        title={words.expertiseTitle[locale]}
        id="expertise-title"
      >
        {locale === "fr"
          ? "Relier les couches, soigner les usages et vérifier ce qui est livré."
          : "Connect the layers, care for the experience and verify what ships."}
      </SectionHeading>
      <EngineeringSystem locale={locale} />
    </section>
  );
}

export function EngineeringJourney({ locale }: { locale: Locale }) {
  return (
    <>
      <Expertise locale={locale} />
      <ExperienceJourney locale={locale} />
    </>
  );
}

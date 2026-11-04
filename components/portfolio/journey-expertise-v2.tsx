"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import { usePreferences } from "@/components/system/preferences";
import { setFieldSignal } from "@/lib/field-signal";
import { SectionHeading } from "./section-heading";
import { education, certifications, skillGroups } from "@/lib/knowledge-data";
import {
  evidenceTargetName,
  professionalWork,
  projects,
} from "@/lib/work-data";
import { experienceCopy as words } from "@/lib/experience-copy";
import type { EvidenceTargetId, Locale } from "@/lib/portfolio-data";

function relatedHref(id: EvidenceTargetId, locale: Locale) {
  const project = projects.find((item) => item.id === id);
  return project ? `/${locale}/work/${project.slug}` : `#${id}`;
}

function ExperienceJourney() {
  const { locale } = usePreferences();
  return (
    <section
      id="experience"
      data-section
      tabIndex={-1}
      className="journey-section section-shell section-space"
      aria-labelledby="experience-title"
    >
      <SectionHeading
        number="02"
        label={locale === "fr" ? "PARCOURS" : "EXPERIENCE"}
        title={words.journeyTitle[locale]}
        id="experience-title"
      />
      <div className="experience-ledger">
        {professionalWork.map((work, index) => (
          <article
            key={work.id}
            id={work.id}
            tabIndex={-1}
            className="experience-entry reveal"
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
              {work.contributions.length > 2 ? (
                <details>
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
          <span className="mono text-accent">
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

function Expertise() {
  const { locale } = usePreferences();
  return (
    <section
      id="stack"
      data-section
      tabIndex={-1}
      className="expertise-section section-shell section-space"
      aria-labelledby="expertise-title"
    >
      <SectionHeading
        number="03"
        label="EXPERTISE"
        title={words.expertiseTitle[locale]}
        id="expertise-title"
      >
        {locale === "fr"
          ? "Relier les couches, soigner les usages et vérifier ce qui est livré."
          : "Connect the layers, care for the experience and verify what ships."}
      </SectionHeading>
      <div className="expertise-grid">
        {skillGroups.map((group, index) => {
          const relations = [
            ...new Set(group.skills.flatMap((skill) => skill.relations)),
          ].slice(0, 3);
          return (
            <article key={group.id} className="expertise-group reveal">
              <span className="mono expertise-index">0{index + 1} /</span>
              <h3>{group.label[locale]}</h3>
              <p>{group.description[locale]}</p>
              <ul className="expertise-technologies">
                {group.skills.map((skill) => (
                  <li key={skill.name}>
                    {skill.relations.length ? (
                      <a
                        href={relatedHref(skill.relations[0], locale)}
                        onPointerEnter={() =>
                          setFieldSignal(skill.signal ?? null)
                        }
                        onPointerLeave={() => setFieldSignal(null)}
                        onFocus={() => setFieldSignal(skill.signal ?? null)}
                        onBlur={() => setFieldSignal(null)}
                      >
                        {skill.label?.[locale] ?? skill.name}
                      </a>
                    ) : (
                      (skill.label?.[locale] ?? skill.name)
                    )}
                  </li>
                ))}
              </ul>
              <div className="expertise-evidence">
                {relations.map((id) => (
                  <a
                    className="text-link"
                    key={id}
                    href={relatedHref(id, locale)}
                  >
                    {evidenceTargetName(id)}
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function JourneyExpertiseV2() {
  return (
    <>
      <ExperienceJourney />
      <Expertise />
    </>
  );
}

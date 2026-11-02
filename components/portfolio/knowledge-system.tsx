"use client";

import { useEffect, useRef, useState } from "react";
import { usePreferences } from "@/components/system/preferences";
import { setFieldSignal } from "@/lib/field-signal";
import { certifications, education, skillGroups, type Skill } from "@/lib/knowledge-data";
import { evidenceTargetName, professionalWork, type ProfessionalWork } from "@/lib/work-data";
import { setWorkSignal } from "@/lib/work-signal";
import { ChapterIdentity, EntityTypeMarker } from "./narrative";

const chronologicalWork = [...professionalWork].reverse();

export function KnowledgeSystem() {
  const { locale } = usePreferences();
  const [activeWork, setActiveWork] = useState<ProfessionalWork["id"]>("biosency");
  const [activeSkill, setActiveSkill] = useState("React");
  const experienceList = useRef<HTMLDivElement>(null);

  const activateWork = (work: ProfessionalWork) => {
    setActiveWork(work.id);
    setWorkSignal(work.id);
  };

  const activateSkill = (skill: Skill) => {
    if (!skill.relations.length) return;
    setActiveSkill(skill.name);
    setFieldSignal(skill.signal ?? null);
  };

  useEffect(() => {
    const list = experienceList.current;
    if (!list) return;
    const articles = [...list.querySelectorAll<HTMLElement>("[data-work-id]")];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const work = chronologicalWork.find(
          (item) => item.id === (visible?.target as HTMLElement | undefined)?.dataset.workId,
        );
        if (work) {
          setActiveWork(work.id);
          setWorkSignal(work.id);
        }
      },
      { rootMargin: "-28% 0px -52%", threshold: [0.15, 0.4, 0.7] },
    );
    articles.forEach((article) => observer.observe(article));
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => setFieldSignal(null), []);

  const relation = skillGroups.flatMap((group) => group.skills).find((skill) => skill.name === activeSkill);

  return (
    <>
      <section
        id="experience"
        data-section
        tabIndex={-1}
        className="clarity-section clarity-experience section-shell section-space"
        aria-labelledby="experience-title"
      >
        <header className="clarity-section-header reveal" data-reveal="mask">
          <ChapterIdentity
            index="03"
            kind="experience"
            category={{ fr: "EXPÉRIENCES", en: "EXPERIENCE" }}
            title={{ fr: "EXPÉRIENCES PROFESSIONNELLES", en: "PROFESSIONAL EXPERIENCE" }}
          />
          <div className="clarity-section-heading">
            <span className="mono">2021 — 2025</span>
            <h2 id="experience-title">{locale === "fr" ? "TROIS EXPÉRIENCES EN E-SANTÉ." : "THREE EXPERIENCES IN DIGITAL HEALTH."}</h2>
            <p>
              {locale === "fr"
                ? "Deux premières expériences web en santé, puis une alternance de trois ans en développement Full-Stack chez iAudiogram."
                : "Two early web roles in healthcare, followed by a three-year Full-Stack development apprenticeship at iAudiogram."}
            </p>
          </div>
        </header>

        <div className="clarity-experience-list" ref={experienceList}>
          {chronologicalWork.map((work, index) => (
            <article
              key={work.id}
              className="clarity-experience-entry reveal"
              data-reveal="line"
              data-primary={work.id === "iaudiogram"}
              data-active={activeWork === work.id}
              data-work-id={work.id}
              tabIndex={0}
              onPointerEnter={() => activateWork(work)}
              onFocus={() => activateWork(work)}
            >
              <EntityTypeMarker kind="experience" index={String(index + 1).padStart(2, "0")} />
              <div className="clarity-experience-main">
                <header>
                  <div>
                    <h3>{work.company}</h3>
                    {work.product ? <p>{work.product}</p> : null}
                  </div>
                  <time className="mono" dateTime={work.start}>{work.period[locale]}</time>
                </header>
                <p className="clarity-experience-role">
                  <strong>{work.role[locale]}</strong>
                  <span>{work.engagement[locale]}</span>
                </p>
                <p className="clarity-experience-context">{work.context[locale]}</p>
                <ul className="clarity-proof-list">
                  {work.contributions.map((contribution) => <li key={contribution.statement.en}>{contribution.statement[locale]}</li>)}
                </ul>
                <div className="clarity-technology-context">
                  <span className="mono">{locale === "fr" ? "TECHNOLOGIES UTILISÉES" : "TECHNOLOGIES USED"}</span>
                  <ul className="clarity-inline-list">
                    {work.tools.map((tool) => <li key={tool}>{tool}</li>)}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="stack"
        data-section
        tabIndex={-1}
        className="clarity-section clarity-skills section-shell section-space"
        aria-labelledby="stack-title"
      >
        <header className="clarity-section-header reveal" data-reveal="mask">
          <ChapterIdentity
            index="04"
            kind="stack"
            category={{ fr: "COMPÉTENCES", en: "SKILLS" }}
            title={{ fr: "OUTILS ET TECHNOLOGIES", en: "TOOLS AND TECHNOLOGIES" }}
          />
          <div className="clarity-section-heading">
            <span className="mono">{locale === "fr" ? "OUTILS PRINCIPAUX" : "CORE TOOLKIT"}</span>
            <h2 id="stack-title">{locale === "fr" ? "COMPÉTENCES TECHNIQUES." : "TECHNICAL SKILLS."}</h2>
          </div>
        </header>

        <div className="clarity-skill-groups">
          {skillGroups.map((group, index) => (
            <section key={group.id} aria-labelledby={`skill-group-${index}`}>
              <span className="mono">{String(index + 1).padStart(2, "0")}</span>
              <h3 id={`skill-group-${index}`}>{group.label[locale]}</h3>
              <ul>
                {group.skills.map((item) => {
                  const hasRelation = item.relations.length > 0;
                  return (
                    <li key={item.name} data-related={activeSkill === item.name}>
                      {hasRelation ? (
                        <button
                          type="button"
                          aria-pressed={activeSkill === item.name}
                          onPointerEnter={() => activateSkill(item)}
                          onFocus={() => activateSkill(item)}
                          onClick={() => activateSkill(item)}
                        >
                          {item.name}
                        </button>
                      ) : item.name}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <div className="skill-relation-readout" aria-live="polite">
          <span className="mono">{locale === "fr" ? "PREUVES LIÉES" : "RELATED WORK"}</span>
          <strong>{activeSkill}</strong>
          <span aria-hidden="true">→</span>
          <ul>
            {relation?.relations.map((target) => <li key={target}>{evidenceTargetName(target)}</li>)}
          </ul>
        </div>
      </section>

      <section
        id="education"
        data-section
        tabIndex={-1}
        className="clarity-section clarity-education section-shell section-space"
        aria-labelledby="education-title"
      >
        <header className="clarity-section-header reveal" data-reveal="mask">
          <ChapterIdentity
            index="05"
            kind="education"
            category={{ fr: "FORMATION", en: "EDUCATION" }}
            title={{ fr: "EPSI", en: "EPSI" }}
          />
          <div className="clarity-section-heading">
            <span className="mono">{education.startYear} — {education.endYear}</span>
            <h2 id="education-title">{locale === "fr" ? "CINQ ANNÉES À L’EPSI." : "FIVE YEARS AT EPSI."}</h2>
          </div>
        </header>

        <article className="clarity-education-record" data-entity-kind="education">
          <EntityTypeMarker kind="education" index="01" />
          <div className="clarity-education-name">
            <span className="mono">{education.startYear} — {education.endYear} · {education.city}</span>
            <h3>{education.school}</h3>
            <p>{education.field[locale]}</p>
          </div>
          <ol className="education-progression">
            {education.degrees.map((degree) => (
              <li key={degree.level}>
                <strong>{degree.level.toUpperCase()}</strong>
                <div>
                  <h4>{degree.title[locale]}</h4>
                  <p>RNCP · {locale === "fr" ? "niveau" : "level"} {degree.rncpLevel}</p>
                </div>
              </li>
            ))}
          </ol>
        </article>
        <p className="clarity-education-certification mono">
          {locale === "fr" ? "CERTIFICATION" : "CERTIFICATION"} · {certifications[0].name} · {certifications[0].year}
        </p>
      </section>
    </>
  );
}

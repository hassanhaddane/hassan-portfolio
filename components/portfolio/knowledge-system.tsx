"use client";

import { usePreferences } from "@/components/system/preferences";
import { professionalWork } from "@/lib/work-data";
import { ChapterIdentity, EntityTypeMarker } from "./narrative";

const skillGroups = [
  { label: "FRONT-END", items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind", "shadcn/ui", "TanStack", "Redux"] },
  { label: "BACK-END", items: ["Python", "FastAPI", "Django", "Flask", "Node.js", "Express"] },
  { label: "BASES DE DONNÉES", enLabel: "DATABASES", items: ["PostgreSQL", "MySQL", "MongoDB", "Firebase"] },
  { label: "DEVOPS", items: ["Docker", "GitHub Actions", "CI/CD", "Linux", "Vercel"] },
  { label: "QUALITÉ", enLabel: "QUALITY", items: ["Cypress", "Vitest", "Jest", "React Testing Library"] },
  { label: "IA", enLabel: "AI", items: ["Codex", "Claude CoWork"] },
] as const;

export function KnowledgeSystem() {
  const { locale } = usePreferences();

  return (
    <>
      <section
        id="experience"
        data-section
        tabIndex={-1}
        className="clarity-section clarity-experience section-shell section-space"
        aria-labelledby="experience-title"
      >
        <header className="clarity-section-header">
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
                ? "J’ai commencé par deux expériences front-end, puis j’ai travaillé trois ans comme développeur Web Full-Stack chez iAudiogram."
                : "I started with two front-end roles, then worked for three years as a Full-Stack Web Developer at iAudiogram."}
            </p>
          </div>
        </header>

        <div className="clarity-experience-list">
          {professionalWork.map((work, index) => (
            <article key={work.id} className="clarity-experience-entry" data-primary={work.id === "iaudiogram"}>
              <EntityTypeMarker kind="experience" index={String(index + 1).padStart(2, "0")} />
              <div className="clarity-experience-main">
                <header>
                  <div>
                    <h3>{work.company}</h3>
                    {work.product ? <p>{work.product}</p> : null}
                  </div>
                  <time className="mono">{work.period}</time>
                </header>
                <p className="clarity-experience-role">
                  <strong>{work.role[locale]}</strong>
                  <span>{work.engagement[locale]}</span>
                </p>
                <p className="clarity-experience-context">{work.context[locale]}</p>
                <ul className="clarity-proof-list">
                  {work.contributions.map((contribution) => <li key={contribution.en}>{contribution[locale]}</li>)}
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
        <header className="clarity-section-header">
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
            <section key={group.label} aria-labelledby={`skill-group-${index}`}>
              <span className="mono">{String(index + 1).padStart(2, "0")}</span>
              <h3 id={`skill-group-${index}`}>{locale === "en" && "enLabel" in group ? group.enLabel : group.label}</h3>
              <ul>
                {group.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section
        id="education"
        data-section
        tabIndex={-1}
        className="clarity-section clarity-education section-shell section-space"
        aria-labelledby="education-title"
      >
        <header className="clarity-section-header">
          <ChapterIdentity
            index="05"
            kind="education"
            category={{ fr: "FORMATION", en: "EDUCATION" }}
            title={{ fr: "EPSI", en: "EPSI" }}
          />
          <div className="clarity-section-heading">
            <span className="mono">2020 — 2025</span>
            <h2 id="education-title">{locale === "fr" ? "CINQ ANNÉES À L’EPSI." : "FIVE YEARS AT EPSI."}</h2>
          </div>
        </header>

        <article className="clarity-education-record" data-entity-kind="education">
          <EntityTypeMarker kind="education" index="01" />
          <div className="clarity-education-name">
            <span className="mono">09/2020 — 09/2025</span>
            <h3>EPSI</h3>
            <p>{locale === "fr" ? "Ingénierie informatique" : "Computer engineering"}</p>
          </div>
          <ol>
            <li>
              <strong>BAC+5</strong>
              <div>
                <h4>{locale === "fr" ? "Expert en informatique & système d’information" : "Expert in Computing & Information Systems"}</h4>
                <p>RNCP40573 · {locale === "fr" ? "niveau 7" : "level 7"}</p>
              </div>
            </li>
            <li>
              <strong>BAC+3</strong>
              <div>
                <h4>{locale === "fr" ? "Concepteur Développeur d’Application" : "Application Designer and Developer"}</h4>
                <p>RNCP31678 · {locale === "fr" ? "niveau 6" : "level 6"}</p>
              </div>
            </li>
          </ol>
        </article>
      </section>
    </>
  );
}

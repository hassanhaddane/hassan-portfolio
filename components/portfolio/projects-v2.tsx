"use client";

import Image from "next/image";
import { projectPresentation } from "@/lib/project-presentation";
import { ArrowUpRight } from "lucide-react";
import { usePreferences } from "@/components/system/preferences";
import { CreativeAction } from "@/components/ui/creative-action";
import { experienceCopy as words } from "@/lib/experience-copy";
import { projects } from "@/lib/work-data";
import { SectionHeading } from "./section-heading";

export function ProjectsV2() {
  const { locale } = usePreferences();
  return (
    <section
      id="projets"
      data-section
      tabIndex={-1}
      className="work-section section-shell section-space"
      aria-labelledby="work-title"
    >
      <SectionHeading
        number="01"
        label="SELECTED WORK"
        title={words.workTitle[locale]}
        id="work-title"
      >
        {words.workIntro[locale]}
      </SectionHeading>
      <div className="selected-work">
        {projects.map((project, index) => (
          <article
            id={project.slug}
            tabIndex={-1}
            key={project.id}
            className={`work-entry work-entry--${project.id} reveal`}
          >
            <div className="work-visual" data-motion-parallax="0.22">
              <a
                className="work-image-link"
                href={`/${locale}/work/${project.slug}`}
                title={`${project.name} — ${locale === "fr" ? "étude de cas" : "case study"}`}
              >
                <div className="work-image-caption mono">
                  <span>
                    0{index + 1} / {project.name.toUpperCase()}
                  </span>
                  <ArrowUpRight aria-hidden="true" />
                </div>
                <Image
                  style={{ viewTransitionName: `project-${project.id}` }}
                  src={project.media[project.id === "tech-express" ? 1 : 0].src}
                  alt={
                    project.media[project.id === "tech-express" ? 1 : 0].alt[
                      locale
                    ]
                  }
                  width={1440}
                  height={900}
                  sizes={
                    project.id === "ceo19"
                      ? "(max-width: 700px) calc(100vw - 82px), 86vw"
                      : project.id === "greecheck"
                        ? "(max-width: 700px) calc(100vw - 122px), (max-width: 1100px) 40vw, 48vw"
                        : "(max-width: 700px) calc(100vw - 84px), (max-width: 1100px) 40vw, 50vw"
                  }
                  quality={82}
                />
                <span className="work-preview-note mono">
                  <span>{projectPresentation[project.id].axis}</span>
                  {projectPresentation[project.id].note[locale]}
                </span>
              </a>
              {project.id === "greecheck" ? (
                <Image
                  className="work-mobile-shot"
                  src={project.media[1].src}
                  alt={project.media[1].alt[locale]}
                  width={380}
                  height={822}
                  sizes="(max-width: 760px) 24vw, 13vw"
                />
              ) : null}
              <span className="work-visual-foot mono">
                {project.id === "ceo19"
                  ? "CREATIVE DIRECTION × DEVELOPMENT"
                  : project.id === "tech-express"
                    ? "EN / AR — V2"
                    : project.id === "bloom"
                      ? "WEB × CULTURE HIP-HOP"
                      : "PRODUCT DESIGN × DEVELOPMENT"}
              </span>
            </div>
            <div className="work-copy">
              <div className="work-number mono">
                0{index + 1}
                <span>{project.year}</span>
              </div>
              <p className="work-category mono">{project.category[locale]}</p>
              <h3>
                <a href={`/${locale}/work/${project.slug}`}>{project.name}</a>
              </h3>
              <p className="work-summary">{project.summary[locale]}</p>
              <dl className="work-facts">
                <div>
                  <dt>{locale === "fr" ? "Mon rôle" : "My role"}</dt>
                  <dd>{project.role[locale]}</dd>
                </div>
                <div>
                  <dt>Stack</dt>
                  <dd>{project.stack.slice(0, 5).join(" / ")}</dd>
                </div>
              </dl>
              <div className="work-actions">
                <CreativeAction
                  variant="secondary"
                  href={`/${locale}/work/${project.slug}`}
                  label={locale === "fr" ? "Étude de cas" : "Case study"}
                />
                <div className="work-external-links">
                  {project.links.map((link) => (
                    <a
                      className="text-link"
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label[locale]}
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                  ))}
                  {project.repository ? (
                    <a
                      className="text-link"
                      href={project.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {locale === "fr" ? "Code source" : "Source code"}
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

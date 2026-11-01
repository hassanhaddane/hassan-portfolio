"use client";

import Image from "next/image";
import { usePreferences } from "@/components/system/preferences";
import { CreativeAction } from "@/components/ui/creative-action";
import { bloom, greeCheck, greeCheckStorySteps, techExpress } from "@/lib/work-data";
import { ChapterIdentity, EntityTypeMarker } from "./narrative";

export function Projects() {
  const { locale } = usePreferences();

  return (
    <section
      id="projets"
      data-section
      tabIndex={-1}
      className="clarity-section clarity-project section-shell section-space"
      aria-labelledby="projects-title"
    >
      <header className="clarity-section-header reveal" data-reveal="mask">
        <ChapterIdentity
          index="02"
          kind="project"
          category={{ fr: "PROJETS", en: "PROJECTS" }}
          title={{ fr: "RÉALISATIONS", en: "SELECTED WORK" }}
        />
        <div className="clarity-section-heading">
          <span className="mono">{locale === "fr" ? "PROJETS DOCUMENTÉS" : "DOCUMENTED PROJECTS"}</span>
          <h2 id="projects-title">{locale === "fr" ? "APPLICATIONS, WEB ET AUDIO." : "APPLICATIONS, WEB AND AUDIO."}</h2>
          <p>{locale === "fr" ? "Trois contextes de création : un produit personnel, un projet associatif et un site B2B." : "Three contexts: a personal product, an association project and a B2B website."}</p>
        </div>
      </header>

      <article id="greecheck" tabIndex={-1} className="clarity-project-case" data-entity-kind="project">
        <header className="clarity-project-title">
          <EntityTypeMarker kind="project" index="01" label={greeCheck.kind} />
          <div>
            <p className="clarity-project-meta mono">
              <span>{greeCheck.kind[locale].toUpperCase()}</span>
              <span>{greeCheck.period?.[locale]}</span>
            </p>
            <h3>GREECHECK</h3>
            <p>{greeCheck.summary[locale]}</p>
          </div>
          <CreativeAction variant="secondary" href={greeCheck.url} target="_blank" rel="noopener noreferrer" data-cursor="OPEN" label={locale === "fr" ? "Ouvrir le projet" : "Open project"} />
        </header>

        <figure className="clarity-project-preview reveal" data-reveal="image">
          <div className="clarity-preview-bar mono" aria-hidden="true">
            <span>GREECHECK</span>
            <span>gree-check.vercel.app</span>
          </div>
          <div className="clarity-preview-image project-image-desktop">
            <Image
              src="/projects/greecheck/home-desktop.png"
              alt={locale === "fr" ? "Accueil public de GreeCheck sur ordinateur" : "GreeCheck public home screen on desktop"}
              fill
              sizes="(max-width: 900px) 100vw, 82vw"
            />
          </div>
          <div className="clarity-preview-image project-image-mobile">
            <Image
              src="/projects/greecheck/home-mobile-clean.png"
              alt={locale === "fr" ? "Accueil public de GreeCheck sur mobile" : "GreeCheck public home screen on mobile"}
              fill
              sizes="92vw"
            />
          </div>
          <figcaption>
            {locale === "fr" ? "Capture de l’application." : "Application screenshot."}
          </figcaption>
        </figure>

        <div className="clarity-project-details reveal" data-reveal="line" data-motion-stagger>
          <section aria-labelledby="project-objective">
            <span className="mono">01 / {locale === "fr" ? "OBJECTIF" : "GOAL"}</span>
            <h4 id="project-objective">{locale === "fr" ? "Objectif" : "Goal"}</h4>
            <p>
              {greeCheck.evidence[0].statement[locale]}
            </p>
          </section>

          <section aria-labelledby="project-features">
            <span className="mono">02 / {locale === "fr" ? "FONCTIONNALITÉS" : "FEATURES"}</span>
            <h4 id="project-features">{locale === "fr" ? "Fonctionnalités" : "Features"}</h4>
            <ul>
              {greeCheckStorySteps.map((step) => <li key={step.id}>{step.detail[locale]}</li>)}
            </ul>
          </section>

          <section aria-labelledby="project-technologies">
            <span className="mono">03 / {locale === "fr" ? "TECHNOLOGIES" : "TECHNOLOGIES"}</span>
            <h4 id="project-technologies">Technologies</h4>
            <ul className="clarity-inline-list">
              {greeCheck.stack.map((technology) => <li key={technology}>{technology}</li>)}
            </ul>
          </section>
        </div>
      </article>
      <div className="clarity-project-secondary-list">
        {[bloom, techExpress].map((project, index) => (
          <article key={project.id} id={project.id === "bloom" ? "808bloom" : project.id} className="clarity-project-case clarity-project-secondary" data-entity-kind="project" tabIndex={-1}>
            <header className="clarity-project-title">
              <EntityTypeMarker kind="project" index={String(index + 2).padStart(2, "0")} label={project.kind} />
              <div>
                <p className="clarity-project-meta mono"><span>{project.kind[locale].toUpperCase()}</span>{project.period ? <span>{project.period[locale]}</span> : null}</p>
                <h3>{project.name.toUpperCase()}</h3>
                <p>{project.summary[locale]}</p>
              </div>
              {project.url ? <CreativeAction variant="secondary" href={project.url} target="_blank" rel="noopener noreferrer" data-cursor="OPEN" label={locale === "fr" ? "Voir le site" : "Visit website"} /> : null}
            </header>
            <div className="clarity-project-details reveal" data-reveal="line" data-motion-stagger>
              <section>
                <span className="mono">{locale === "fr" ? "CONTRIBUTIONS" : "CONTRIBUTIONS"}</span>
                <ul>{project.evidence.map((item) => <li key={item.statement.en}>{item.statement[locale]}</li>)}</ul>
              </section>
              <section>
                <span className="mono">{locale === "fr" ? "STATUT" : "STATUS"}</span>
                <p>{project.status[locale]}</p>
              </section>
              <section>
                <span className="mono">{locale === "fr" ? "TECHNOLOGIES" : "TECHNOLOGIES"}</span>
                <ul className="clarity-inline-list">{project.stack.map((tool) => <li key={tool}>{tool}</li>)}</ul>
              </section>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

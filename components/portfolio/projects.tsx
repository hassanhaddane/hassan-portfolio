"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { usePreferences } from "@/components/system/preferences";
import { CreativeAction } from "@/components/ui/creative-action";
import { bloom, greeCheck, greeCheckStorySteps, techExpress } from "@/lib/work-data";
import { ChapterIdentity, EntityTypeMarker } from "./narrative";

function ProjectStory() {
  const { locale, motion } = usePreferences();
  const [activeStep, setActiveStep] = useState(0);
  const storyRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const story = storyRef.current;
    if (!story || !motion) return;
    const steps = [...story.querySelectorAll<HTMLElement>("[data-project-step]")];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveStep(Number((visible.target as HTMLElement).dataset.projectStep));
      },
      { rootMargin: "-32% 0px -46%", threshold: [0.15, 0.45, 0.75] },
    );
    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, [motion]);

  useEffect(() => {
    const visual = visualRef.current;
    if (!visual || !motion || !matchMedia("(pointer: fine) and (hover: hover)").matches) return;
    let frame = 0;
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = visual.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        visual.style.setProperty("--project-tilt-x", `${y * -1.5}deg`);
        visual.style.setProperty("--project-tilt-y", `${x * 2}deg`);
        visual.style.setProperty("--project-pan-x", `${x * 8}px`);
        visual.style.setProperty("--project-pan-y", `${y * 6}px`);
      });
    };
    const reset = () => {
      visual.style.setProperty("--project-tilt-x", "0deg");
      visual.style.setProperty("--project-tilt-y", "0deg");
      visual.style.setProperty("--project-pan-x", "0px");
      visual.style.setProperty("--project-pan-y", "0px");
    };
    visual.addEventListener("pointermove", move, { passive: true });
    visual.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      visual.removeEventListener("pointermove", move);
      visual.removeEventListener("pointerleave", reset);
    };
  }, [motion]);

  return (
    <div className="project-story" ref={storyRef}>
      <figure className="project-story-visual" ref={visualRef} style={{ "--project-step": activeStep } as CSSProperties}>
        <div className="clarity-preview-bar mono" aria-hidden="true">
          <span>GREECHECK</span>
          <span>{String(activeStep + 1).padStart(2, "0")} / {String(greeCheckStorySteps.length).padStart(2, "0")}</span>
        </div>
        <div className="project-story-screen reveal" data-reveal="image" aria-live="polite">
          {greeCheckStorySteps.map((step, index) => (
            <div className="project-story-image" data-active={activeStep === index} key={step.id} aria-hidden={activeStep !== index}>
              <Image
                src={step.src}
                alt={activeStep === index ? step.alt[locale] : ""}
                fill
                priority={index === 0}
                sizes="(max-width: 760px) 94vw, (max-width: 1180px) 58vw, 54vw"
              />
            </div>
          ))}
        </div>
        <figcaption>
          <span className="mono">{String(activeStep + 1).padStart(2, "0")}</span>
          <strong>{greeCheckStorySteps[activeStep].title[locale]}</strong>
          <span>{greeCheckStorySteps[activeStep].detail[locale]}</span>
        </figcaption>
      </figure>

      <ol className="project-story-steps" aria-label={locale === "fr" ? "Parcours dans GreeCheck" : "GreeCheck walkthrough"}>
        {greeCheckStorySteps.map((step, index) => (
          <li key={step.id} data-project-step={index} data-active={activeStep === index}>
            <button type="button" onClick={() => setActiveStep(index)} aria-pressed={activeStep === index}>
              <span className="mono">{String(index + 1).padStart(2, "0")}</span>
              <strong>{step.title[locale]}</strong>
              <small>{step.detail[locale]}</small>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

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

        <ProjectStory />

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
            <div className="clarity-project-details">
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

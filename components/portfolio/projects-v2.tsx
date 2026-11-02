"use client";

import { useEffect, useRef, useState } from "react";
import { usePreferences } from "@/components/system/preferences";
import { CreativeAction } from "@/components/ui/creative-action";
import { subscribeMotionFrame } from "@/lib/motion-runtime";
import { experimentalWork, projects, type Project } from "@/lib/work-data";
import { ChapterIdentity } from "./narrative";
import { ProjectMedia } from "./project-media";

export function ProjectsV2() {
  const { locale, expressiveMotion: motion } = usePreferences();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState(projects[0].id);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;
    const entries = [...section.querySelectorAll<HTMLElement>("[data-showcase-project]")];
    const observer = new IntersectionObserver(() => {
      const candidate = entries
        .map((element) => ({ element, box: element.getBoundingClientRect() }))
        .filter(({ box }) => box.bottom > innerHeight * 0.28 && box.top < innerHeight * 0.72)
        .sort((a, b) => Math.abs(a.box.top - innerHeight * 0.36) - Math.abs(b.box.top - innerHeight * 0.36))[0];
      if (candidate) setActiveId(candidate.element.dataset.showcaseProject as Project["id"]);
    }, { rootMargin: "-24% 0px -24% 0px", threshold: [0, 0.1, 0.5] });
    entries.forEach((entry) => observer.observe(entry));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !motion || !matchMedia("(pointer: fine) and (hover: hover)").matches) return;
    let previous: HTMLElement | null = null;
    const reset = (element: HTMLElement | null) => {
      element?.style.removeProperty("--showcase-tilt-x");
      element?.style.removeProperty("--showcase-tilt-y");
      element?.style.removeProperty("--showcase-pan-x");
      element?.style.removeProperty("--showcase-pan-y");
    };
    const unsubscribe = subscribeMotionFrame((frame) => {
      if (!frame.pointerChanged) return;
      const target = frame.pointerTarget instanceof Element ? frame.pointerTarget : null;
      const visual = frame.pointerInside && frame.pointerType === "mouse" ? target?.closest<HTMLElement>("[data-work-frame]") ?? null : null;
      if (previous !== visual) reset(previous);
      previous = visual;
      if (!visual || !section.contains(visual)) return;
      const box = visual.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (frame.pointerX - box.left - box.width / 2) / (box.width / 2)));
      const y = Math.max(-1, Math.min(1, (frame.pointerY - box.top - box.height / 2) / (box.height / 2)));
      visual.style.setProperty("--showcase-tilt-x", `${(-y * 1.2).toFixed(2)}deg`);
      visual.style.setProperty("--showcase-tilt-y", `${(x * 1.5).toFixed(2)}deg`);
      visual.style.setProperty("--showcase-pan-x", `${(x * 7).toFixed(1)}px`);
      visual.style.setProperty("--showcase-pan-y", `${(y * 5).toFixed(1)}px`);
    });
    return () => { unsubscribe(); reset(previous); };
  }, [motion]);

  return (
    <section id="projets" ref={sectionRef} data-section data-active-project={activeId} tabIndex={-1} className="clarity-section work-showcase section-shell section-space" aria-labelledby="projects-title">
      <header className="work-showcase-intro reveal" data-reveal="mask">
        <ChapterIdentity index="02" kind="project" category={{ fr: "PROJETS", en: "PROJECTS" }} title={{ fr: "RÉALISATIONS", en: "SELECTED WORK" }} />
        <div>
          <span className="mono work-showcase-kicker">{locale === "fr" ? "PROJETS SÉLECTIONNÉS / 2025—2026" : "SELECTED PROJECTS / 2025—2026"}</span>
          <h2 id="projects-title">{locale === "fr" ? "DES IDÉES QUI PRENNENT FORME." : "IDEAS MADE TANGIBLE."}</h2>
          <p>{locale === "fr" ? "Trois contextes, trois langages visuels : une application personnelle, un collectif culturel et un site B2B. Chaque réalisation se lit d’abord par son interface et son rôle réel." : "Three contexts, three visual languages: a personal app, a cultural collective and a B2B website. Each project starts with its real interface and my actual role."}</p>
        </div>
      </header>

      <nav className="work-showcase-index mono" aria-label={locale === "fr" ? "Projets sélectionnés" : "Selected projects"}>
        {projects.map((project, index) => <a href={`#${project.slug}`} key={project.id} aria-current={activeId === project.id ? "location" : undefined}><span>{String(index + 1).padStart(2, "0")}</span>{project.name}<i aria-hidden="true" /></a>)}
      </nav>

      <div className="work-showcase-list">
        {projects.map((project, index) => (
          <article id={project.slug} key={project.id} data-showcase-project={project.id} data-active={activeId === project.id} tabIndex={-1} className={`showcase-project showcase-project--${project.id}`}>
            <div className="showcase-project-heading reveal" data-reveal="line">
              <span className="showcase-project-number mono">{String(index + 1).padStart(2, "0")} / 03</span>
              <div>
                <p className="showcase-project-meta mono">{project.category[locale]} <span>·</span> {project.year}</p>
                <h3>{project.name}</h3>
              </div>
              <p className="showcase-project-summary">{project.summary[locale]}</p>
            </div>
            <div className="reveal showcase-project-reveal" data-reveal="image"><ProjectMedia project={project} locale={locale} /></div>
            <div className="showcase-project-bottom">
              <div className="showcase-project-facts">
                <div><span className="mono">{locale === "fr" ? "RÔLE" : "ROLE"}</span><p>{project.role[locale]}</p></div>
                <div><span className="mono">STACK</span><ul>{project.stack.slice(0, 5).map((tool) => <li key={tool}>{tool}</li>)}</ul></div>
              </div>
              <div className="showcase-project-actions">
                <CreativeAction variant="primary" href={`/${locale}/work/${project.slug}`} label={locale === "fr" ? "Voir l’étude de cas" : "View case study"} data-cursor="READ" />
                {project.links.map((link) => <CreativeAction variant="text" key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" label={link.label[locale]} data-cursor="OPEN" />)}
                {project.repository ? <CreativeAction variant="text" href={project.repository} target="_blank" rel="noopener noreferrer" label={locale === "fr" ? "Code GitHub" : "GitHub source"} /> : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="work-experiment" aria-labelledby="work-experiment-title">
        <span className="mono">04 / {locale === "fr" ? "EXPLORATION" : "EXPLORATION"}</span>
        <h3 id="work-experiment-title">{experimentalWork.name}</h3>
        <p>{experimentalWork.description[locale]}</p>
        <CreativeAction variant="text" href={experimentalWork.repository} target="_blank" rel="noopener noreferrer" label={locale === "fr" ? "Voir le dépôt public" : "Explore the public repository"} />
      </aside>
    </section>
  );
}

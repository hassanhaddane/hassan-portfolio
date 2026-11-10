"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/portfolio-data";
import { projects } from "@/lib/work-data";
import { sendStorySignal } from "@/lib/story-signal";

export function SelectedWork({ locale }: { locale: Locale }) {
  const [selected, setSelected] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [direction, setDirection] = useState(1);
  const root = useRef<HTMLElement>(null);
  const shown = preview ?? selected;
  const fr = locale === "fr";
  useEffect(() => {
    const restore = () => {
      const index = projects.findIndex(
        (project) => `#${project.slug}` === location.hash,
      );
      if (index >= 0) setSelected(index);
      setPreview(null);
    };
    restore();
    setReady(true);
    addEventListener("hashchange", restore);
    addEventListener("popstate", restore);
    return () => {
      removeEventListener("hashchange", restore);
      removeEventListener("popstate", restore);
    };
  }, []);
  useEffect(() => {
    if (root.current)
      sendStorySignal(root.current, { project: projects[shown].slug });
  }, [shown]);
  function select(index: number) {
    setDirection(index === selected ? 1 : index > selected ? 1 : -1);
    setSelected(index);
    setPreview(null);
  }
  function keyboard(event: KeyboardEvent<HTMLElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? projects.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + projects.length) %
            projects.length;
    const link =
      root.current?.querySelectorAll<HTMLAnchorElement>(".gallery-index a")[
        next
      ];
    link?.focus();
  }
  return (
    <section
      id="projets"
      ref={root}
      data-section
      tabIndex={-1}
      className="work-section section-shell section-space"
      aria-labelledby="work-title"
    >
      <header className="work-heading">
        <div>
          <span className="chapter-label mono">
            01 / {fr ? "PROJETS CHOISIS" : "SELECTED PROJECTS"}
          </span>
          <h2 id="work-title">
            Selected work<span>.</span>
          </h2>
        </div>
        <p>
          {fr
            ? "Quatre terrains. Une même exigence. Du logiciel à la culture."
            : "Four territories. The same attention. From software to culture."}
        </p>
      </header>
      <div
        className="work-gallery"
        data-ready={ready ? "true" : undefined}
        data-direction={direction}
        data-project={projects[shown].id}
      >
        <nav
          className="gallery-index"
          aria-label={fr ? "Choisir un projet" : "Choose a project"}
          onPointerLeave={() => setPreview(null)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setPreview(null);
          }}
        >
          {projects.map((project, index) => (
            <a
              key={project.id}
              href={`#${project.slug}`}
              aria-current={shown === index ? "true" : undefined}
              aria-controls={project.slug}
              onClick={() => select(index)}
              onPointerMove={(event) => {
                if (event.pointerType === "mouse" && preview !== index) {
                  setDirection(index >= shown ? 1 : -1);
                  setPreview(index);
                }
              }}
              onFocus={() => {
                setDirection(index >= shown ? 1 : -1);
                setPreview(index);
              }}
              onKeyDown={(event) => keyboard(event, index)}
            >
              <span className="mono">0{index + 1}</span>
              <span>{project.name}</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
        </nav>
        <div
          className="selected-work"
          aria-label={fr ? "Galerie des réalisations" : "Project gallery"}
        >
          {projects.map((project, index) => {
            const active = shown === index;
            const media = project.media[project.id === "tech-express" ? 1 : 0];
            const mobile = project.id !== "tech-express" && project.media[1];
            return (
              <article
                id={project.slug}
                tabIndex={-1}
                key={project.id}
                inert={ready && !active ? true : undefined}
                aria-hidden={ready && !active ? true : undefined}
                data-active={active ? "true" : "false"}
                className={`work-entry work-entry--${project.id}`}
              >
                <a
                  className="work-image-link"
                  href={`/${locale}/work/${project.slug}`}
                  aria-label={`${project.name} — ${fr ? "étude de cas" : "case study"}`}
                >
                  <div className="work-scene-register mono" aria-hidden="true">
                    <span>LOWKYZ / 0{index + 1}</span>
                    <span>{project.category[locale]}</span>
                  </div>
                  <div
                    className="work-image-stage"
                    style={{
                      viewTransitionName: active
                        ? `project-${project.id}`
                        : undefined,
                    }}
                  >
                    <Image
                      src={media.src}
                      alt={media.alt[locale]}
                      width={media.width}
                      height={media.height}
                      sizes="(max-width: 760px) 90vw, (max-width: 1100px) 80vw, 62vw"
                      quality={82}
                    />
                  </div>
                  {mobile ? (
                    <div className="work-mobile-capture" aria-hidden="true">
                      <Image
                        src={mobile.src}
                        alt=""
                        width={mobile.width}
                        height={mobile.height}
                        sizes="(max-width:760px) 20vw, 12vw"
                        quality={75}
                      />
                    </div>
                  ) : null}
                  <span className="work-open">
                    <span>
                      {fr ? "Entrer dans le projet" : "Enter the project"}
                    </span>
                    <ArrowUpRight aria-hidden="true" />
                  </span>
                </a>
                <div className="work-copy">
                  <div className="work-number mono">
                    <span>
                      0{index + 1} / {project.category[locale]}
                    </span>
                    <span>{project.year}</span>
                  </div>
                  <div className="work-editorial">
                    <h3>
                      <a href={`/${locale}/work/${project.slug}`}>
                        {project.name}
                        <ArrowUpRight aria-hidden="true" />
                      </a>
                    </h3>
                    <div>
                      <p className="work-summary">{project.summary[locale]}</p>
                      <p className="work-role">{project.role[locale]}</p>
                    </div>
                  </div>
                  <div className="work-bottom">
                    <p className="work-stack mono">
                      {project.stack.slice(0, 5).join(" / ")}
                    </p>
                    <a
                      className="text-link"
                      href={`/${locale}/work/${project.slug}`}
                    >
                      {fr ? "Étude de cas" : "Case study"}
                      <ArrowUpRight aria-hidden="true" />
                    </a>
                    <div className="work-actions">
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
                          {fr ? "Code source" : "Source code"}
                          <ArrowUpRight aria-hidden="true" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="gallery-transport">
          <span className="mono" aria-live="polite">
            0{shown + 1} / 04 — {projects[shown].name}
          </span>
          <div>
            <a
              href={`#${projects[(selected + 3) % 4].slug}`}
              onClick={() => setDirection(-1)}
              aria-label={fr ? "Projet précédent" : "Previous project"}
            >
              <ArrowLeft aria-hidden="true" />
            </a>
            <a
              href={`#${projects[(selected + 1) % 4].slug}`}
              onClick={() => setDirection(1)}
              aria-label={fr ? "Projet suivant" : "Next project"}
            >
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

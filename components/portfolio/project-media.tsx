import Image from "next/image";
import type { Locale } from "@/lib/portfolio-data";
import type { Project } from "@/lib/work-data";

export function ProjectMedia({ project, locale, priority = false }: { project: Project; locale: Locale; priority?: boolean }) {
  return (
    <div className={`showcase-media showcase-media--${project.id}`} data-work-frame>
      <div className="showcase-media-head mono" aria-hidden="true">
        <span>LOWKYZ / {project.name.toUpperCase()}</span>
        <span>{project.id === "tech-express" ? "V1 ↔ V2" : "LIVE CAPTURE"}</span>
      </div>
      <div className="showcase-media-stage">
        {project.media.length === 0 ? <p className="showcase-media-empty">{locale === "fr" ? "Visuel du projet indisponible" : "Project image unavailable"}</p> : null}
        {project.media.map((media, index) => (
          <div className={`showcase-media-shot showcase-media-shot--${index + 1}`} key={media.src}>
            <div className="showcase-media-layer" data-motion-parallax={index === 0 ? "0.35" : "0.2"}>
              <Image src={media.src} alt={media.alt[locale]} fill sizes={project.id === "tech-express" ? "(max-width: 760px) 90vw, 44vw" : index === 0 ? "(max-width: 760px) 94vw, 85vw" : "(max-width: 760px) 30vw, 20vw"} priority={priority && index === 0} quality={82} />
            </div>
            {project.id === "tech-express" ? <span className="showcase-shot-label mono">V{index + 1} / GITHUB PAGES</span> : null}
          </div>
        ))}
      </div>
      <div className="showcase-media-foot mono" aria-hidden="true">
        <span>{project.category[locale]}</span>
        <span>{project.year}</span>
      </div>
    </div>
  );
}

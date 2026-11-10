import type { Locale } from "@/lib/portfolio-data";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/work-data";

export function SelectedWork({ locale }: { locale: Locale }) {
  return (
    <section
      id="projets"
      data-section
      tabIndex={-1}
      className="work-section section-shell section-space"
      aria-labelledby="work-title"
    >
      <header className="work-heading">
        <div>
          <span className="chapter-label mono">
            01 / {locale === "fr" ? "PROJETS CHOISIS" : "SELECTED PROJECTS"}
          </span>
          <h2 id="work-title">
            Selected work<span>.</span>
          </h2>
        </div>
        <p>
          {locale === "fr"
            ? "Des produits à utiliser. Des univers à explorer. Du logiciel à la culture."
            : "Products to use. Worlds to explore. From software to culture."}
        </p>
      </header>
      <div className="selected-work">
        {projects.map((project, index) => {
          const media = project.media[project.id === "tech-express" ? 1 : 0];
          return (
            <article
              id={project.slug}
              tabIndex={-1}
              key={project.id}
              className={`work-entry work-entry--${project.id}`}
            >
              <a
                className="work-image-link"
                href={`/${locale}/work/${project.slug}`}
                aria-label={`${project.name} — ${locale === "fr" ? "étude de cas" : "case study"}`}
              >
                <div className="work-image-stage">
                  <Image
                    src={media.src}
                    alt={media.alt[locale]}
                    width={media.width}
                    height={media.height}
                    sizes="(max-width: 760px) 90vw, (max-width: 1100px) 80vw, 55vw"
                    quality={82}
                  />
                </div>
                <span className="work-open">
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
                <h3>
                  <a href={`/${locale}/work/${project.slug}`}>
                    {project.name}
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </h3>
                <p className="work-summary">{project.summary[locale]}</p>
                <p className="work-role">{project.role[locale]}</p>
                <p className="work-stack mono">
                  {project.stack.slice(0, 5).join(" / ")}
                </p>
                <div className="work-actions">
                  <a
                    className="text-link"
                    href={`/${locale}/work/${project.slug}`}
                  >
                    {locale === "fr" ? "Étude de cas" : "Case study"}
                    <ArrowUpRight aria-hidden="true" />
                  </a>
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
            </article>
          );
        })}
      </div>
    </section>
  );
}

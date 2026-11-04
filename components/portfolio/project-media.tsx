import Image from "next/image";
import type { Locale } from "@/lib/portfolio-data";
import type { Project } from "@/lib/work-data";

export function ProjectMedia({
  project,
  locale,
  priority = false,
}: {
  project: Project;
  locale: Locale;
  priority?: boolean;
}) {
  return (
    <div className={`case-media case-media--${project.id}`}>
      {project.media.map((media, index) => (
        <figure key={media.src}>
          <Image
            style={{
              viewTransitionName:
                index === (project.id === "tech-express" ? 1 : 0)
                  ? `project-${project.id}`
                  : undefined,
            }}
            src={media.src}
            alt={media.alt[locale]}
            width={media.width}
            height={media.height}
            sizes={
              index === 0
                ? "(max-width: 760px) 90vw, 75vw"
                : "(max-width: 760px) 60vw, 20vw"
            }
            priority={priority && index === 0}
            quality={82}
          />
          <figcaption className="mono">
            {project.id === "tech-express"
              ? `V${index + 1} / EN — AR`
              : locale === "fr"
                ? index
                  ? "VERSION MOBILE"
                  : "VERSION DESKTOP"
                : index
                  ? "MOBILE VIEW"
                  : "DESKTOP VIEW"}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

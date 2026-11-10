"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Maximize2, X } from "lucide-react";
import type { Locale } from "@/lib/portfolio-data";
import type { Project } from "@/lib/work-data";

export function ProjectMedia({
  project,
  locale,
  priority = false,
}: {
  project: Pick<Project, "id" | "name" | "media">;
  locale: Locale;
  priority?: boolean;
}) {
  const [active, setActive] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const fr = locale === "fr";
  const current = active === null ? null : project.media[active];
  return (
    <Dialog.Root
      open={active !== null}
      onOpenChange={(open) => {
        if (!open) setActive(null);
      }}
    >
      <div className={`case-media case-media--${project.id}`}>
        {project.media.map((media, index) => (
          <figure key={media.src}>
            <Dialog.Trigger asChild>
              <button
                className="capture-open"
                data-cursor="zoom"
                onClick={(event) => {
                  trigger.current = event.currentTarget;
                  setActive(index);
                }}
                aria-label={`${fr ? "Agrandir" : "Enlarge"} — ${media.alt[locale]}`}
              >
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
                      : "(max-width: 760px) 60vw, 22vw"
                  }
                  priority={
                    priority &&
                    index === (project.id === "tech-express" ? 1 : 0)
                  }
                  quality={82}
                />
                <span className="capture-zoom mono">
                  <Maximize2 aria-hidden="true" />
                  {fr ? "AGRANDIR" : "ENLARGE"}
                </span>
              </button>
            </Dialog.Trigger>
            <figcaption className="mono">
              <span>
                0{index + 1} /{" "}
                {project.id === "tech-express"
                  ? `V${index + 1} / EN — AR`
                  : fr
                    ? index
                      ? "VERSION MOBILE"
                      : "VERSION DESKTOP"
                    : index
                      ? "MOBILE VIEW"
                      : "DESKTOP VIEW"}
              </span>
              <span>{project.name}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="capture-overlay" />
        <Dialog.Content
          className="capture-dialog"
          aria-describedby="capture-description"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            trigger.current?.focus({ preventScroll: true });
          }}
        >
          <header>
            <Dialog.Title>{project.name}</Dialog.Title>
            <Dialog.Close
              className="icon-control"
              aria-label={fr ? "Fermer la capture" : "Close capture"}
            >
              <X aria-hidden="true" />
            </Dialog.Close>
          </header>
          <div className="capture-full">
            {current ? (
              <Image
                src={current.src}
                alt={current.alt[locale]}
                width={current.width}
                height={current.height}
                sizes="95vw"
                quality={95}
              />
            ) : null}
          </div>
          <footer>
            <Dialog.Description id="capture-description">
              {current?.alt[locale]}
            </Dialog.Description>
            <div className="capture-pagination">
              <button
                className="icon-control"
                onClick={() =>
                  setActive(
                    ((active ?? 0) + project.media.length - 1) %
                      project.media.length,
                  )
                }
                aria-label={fr ? "Capture précédente" : "Previous capture"}
              >
                <ArrowLeft aria-hidden="true" />
              </button>
              <span className="mono">
                0{(active ?? 0) + 1} / 0{project.media.length}
              </span>
              <button
                className="icon-control"
                onClick={() =>
                  setActive(((active ?? 0) + 1) % project.media.length)
                }
                aria-label={fr ? "Capture suivante" : "Next capture"}
              >
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

"use client";

import { chapters } from "@/lib/experience-copy";
import { useActiveSection, usePreferences } from "./preferences";

const labels = ["Intro", "Work", "Engineering", "Journey", "About", "Contact"];

/** Always present; the score's highlighted node follows the current chapter. */
export function LivingSignal() {
  const active = useActiveSection();
  const { locale } = usePreferences();
  return (
    <aside
      className="living-signal"
      aria-label={locale === "fr" ? "Fil des chapitres" : "Chapter thread"}
    >
      <div
        className="scroll-meter"
        data-scroll-meter
        role="progressbar"
        aria-label={
          locale === "fr" ? "Progression de lecture" : "Reading progress"
        }
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
      >
        <span data-scroll-readout className="mono" aria-hidden="true">
          000%
        </span>
      </div>
      <svg
        className="living-signal-line"
        viewBox="0 0 40 600"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className="signal-track"
          d="M20 0V30l-3 6 6 8-5 12 4 9-2 8V130l4 7-8 9 6 15-2 12V230l-5 8 10 11-5 12V330l3 8-6 10 5 12-2 9V430l-5 12 9 18-4 13V530l5 14-10 17 7 16-2 19V600"
        />
        <path
          className="signal-trace"
          d="M20 0V30l-3 6 6 8-5 12 4 9-2 8V130l4 7-8 9 6 15-2 12V230l-5 8 10 11-5 12V330l3 8-6 10 5 12-2 9V430l-5 12 9 18-4 13V530l5 14-10 17 7 16-2 19V600"
        />
      </svg>
      <ol>
        {chapters.map((chapter, index) => (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              aria-label={`${String(index + 1).padStart(2, "0")} ${chapter.label[locale]}`}
              aria-current={active === chapter.id ? "location" : undefined}
            >
              <span className="signal-node" />
              <span className="mono">
                0{index + 1}
                <span>{labels[index]}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
      <span className="signal-mobile-caption mono">
        {labels[chapters.findIndex((chapter) => chapter.id === active)]} / THE
        LIVING SIGNAL
      </span>
    </aside>
  );
}

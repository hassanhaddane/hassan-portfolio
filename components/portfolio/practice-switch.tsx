"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { personalStory } from "@/lib/personal-data";
import type { Locale } from "@/lib/portfolio-data";
import { sendStorySignal } from "@/lib/story-signal";

export function PracticeSwitch({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const fr = locale === "fr";
  return (
    <div ref={root} className="practice-switch" data-practice={active}>
      <div
        className="practice-controls"
        aria-label={fr ? "Mes deux pratiques" : "My two practices"}
      >
        {[fr ? "Construire" : "Build", fr ? "Composer" : "Compose"].map(
          (label, index) => (
            <button
              key={label}
              aria-pressed={active === index}
              aria-controls={`practice-${index}`}
              onClick={() => {
                setActive(index);
                if (root.current)
                  sendStorySignal(root.current, {
                    mode: index,
                    project: index ? "808bloom" : "greecheck",
                  });
              }}
            >
              <span className="mono">0{index + 1} /</span>
              {label}
              <span aria-hidden="true">↗</span>
            </button>
          ),
        )}
      </div>
      <div className="practice-panels">
        <div
          id="practice-0"
          className="practice-panel"
          data-active={active === 0}
        >
          <h3>
            {fr ? "Du service à l’interface." : "From service to interface."}
          </h3>
          <p>{personalStory.practice[locale]}</p>
          <a className="text-link" href={`/${locale}/work/greecheck`}>
            GreeCheck
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <div
          id="practice-1"
          className="practice-panel"
          data-active={active === 1}
        >
          <h3>
            {fr ? "Le son, l’autre langage." : "Sound, another language."}
          </h3>
          <p>{personalStory.beyond[locale]}</p>
          <a className="text-link" href={`/${locale}/work/808bloom`}>
            808BLOOM
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}

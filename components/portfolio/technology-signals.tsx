"use client";

import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  getFieldSignal,
  setFieldSignal,
  technologyGroups,
  useFieldSignal,
} from "@/lib/field-signal";
import { usePreferences } from "@/components/system/preferences";

export function TechnologySignals() {
  const active = useFieldSignal();
  const { locale } = usePreferences();
  useEffect(() => () => setFieldSignal(null), []);
  return (
    <div
      className="technology-signals"
      aria-label={
        locale === "fr"
          ? "Technologies : activer un signal"
          : "Technologies: activate a signal"
      }
    >
      {technologyGroups.map((row, index) => (
        <div className="technology-row" key={index}>
          <div>
            {row.map((technology, i) => (
              <span key={technology}>
                {i > 0 && (
                  <span className="tech-divider" aria-hidden="true">
                    /
                  </span>
                )}
                <button
                  type="button"
                  aria-pressed={active === technology}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse")
                      setFieldSignal(technology);
                  }}
                  onPointerLeave={(event) => {
                    if (
                      event.pointerType === "mouse" &&
                      document.activeElement !== event.currentTarget
                    )
                      setFieldSignal(null);
                  }}
                  onFocus={() => setFieldSignal(technology)}
                  onBlur={() => setFieldSignal(null)}
                  onClick={(event) => {
                    if (event.detail > 0) setFieldSignal(technology);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape" && getFieldSignal())
                      setFieldSignal(null);
                  }}
                >
                  {technology}
                </button>
              </span>
            ))}
          </div>
          <ArrowUpRight aria-hidden="true" />
        </div>
      ))}
      <div
        className="signal-caption mono"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className={active ? "signal-active" : ""} aria-hidden="true" />
        {active
          ? `${active} / ${locale === "fr" ? "signal actif" : "signal active"}`
          : locale === "fr"
            ? "Chaque technologie, une connexion."
            : "Every technology, a connection."}
      </div>
    </div>
  );
}

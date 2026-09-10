"use client";

import { Pause, Play } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePreferences } from "./preferences";
import { copy } from "@/lib/portfolio-data";

export function VisitControls() {
  const { locale, mode, setMode, motion, toggleMotion, systemReduced } =
    usePreferences();
  return (
    <div className="visit-controls">
      <ToggleGroup
        type="single"
        value={mode}
        onValueChange={(value) => {
          if (value === "recruiter" || value === "explore") setMode(value);
        }}
        className="visit-toggle"
        aria-label={locale === "fr" ? "Mode de visite" : "Visit mode"}
      >
        <ToggleGroupItem
          value="recruiter"
          aria-label={locale === "fr" ? "Recruiter, lecture rapide" : "Recruiter, quick read"}
        >
          <span>Recruiter</span>
          <small>{locale === "fr" ? "Lecture rapide" : "Quick read"}</small>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="explore"
          aria-label={locale === "fr" ? "Explore, expérience interactive" : "Explore, interactive experience"}
        >
          <span>Explore <i className="mode-light" aria-hidden="true" /></span>
          <small>{locale === "fr" ? "Expérience interactive" : "Interactive experience"}</small>
        </ToggleGroupItem>
      </ToggleGroup>
      <button
        className="motion-switch"
        onClick={toggleMotion}
        disabled={systemReduced}
        aria-pressed={!motion}
        aria-label={
          systemReduced
            ? copy.motionSystem[locale]
            : motion
              ? locale === "fr"
                ? "Réduire les animations"
                : "Reduce motion"
              : locale === "fr"
                ? "Autoriser les animations"
                : "Enable motion"
        }
      >
        {motion ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
      </button>
    </div>
  );
}

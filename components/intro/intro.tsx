"use client";

import { useEffect, useRef } from "react";
import { usePreferences } from "@/components/system/preferences";
import { CinematicTransition } from "./cinematic-transition";
import { IntroControls } from "./intro-controls";
import { useIntro } from "./intro-context";
import { LogoReveal } from "./logo-reveal";

export function Intro() {
  const { locale } = usePreferences();
  const { phase, skip } = useIntro();
  const skipButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (phase === "blackout" && document.documentElement.dataset.introPending === "true")
      skipButton.current?.focus({ preventScroll: true });
  }, [phase]);

  if (phase === "off") return null;

  return (
    <aside className="cinematic-intro" data-phase={phase} aria-label={locale === "fr" ? "Introduction LOWKYZ" : "LOWKYZ introduction"}>
      <div className="cinematic-intro__grain" aria-hidden="true" />
      <button ref={skipButton} type="button" className="cinematic-intro__skip" onClick={skip}>
        {locale === "fr" ? "Passer l’intro" : "Skip intro"}<span aria-hidden="true">↗</span>
      </button>
      <span className="cinematic-intro__corner mono" aria-hidden="true">LOWKYZ / 001</span>
      <LogoReveal />
      <CinematicTransition />
      <div className="cinematic-intro__footer">
        <span className="cinematic-intro__status mono" aria-hidden="true">
          {locale === "fr" ? "INITIALISATION DU SIGNAL" : "INITIALIZING SIGNAL"}
          <i /><i /><i />
        </span>
        {phase === "choice" && <IntroControls />}
      </div>
    </aside>
  );
}

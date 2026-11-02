"use client";

import { RotateCcw } from "lucide-react";
import { usePreferences } from "@/components/system/preferences";
import { useIntro } from "./intro-context";

export function IntroControls() {
  const { locale } = usePreferences();
  const { enter } = useIntro();
  return (
    <div className="intro-controls">
      <button type="button" className="intro-controls__enter" onClick={enter}>
        <span>{locale === "fr" ? "Entrer dans le portfolio" : "Enter the portfolio"}</span>
        <span className="intro-controls__arrow" aria-hidden="true">↗</span>
      </button>
    </div>
  );
}

export function ReplayIntro({ mobile = false, onReplay }: { mobile?: boolean; onReplay?: () => void }) {
  const { locale } = usePreferences();
  const { replay, phase } = useIntro();
  const label = locale === "fr" ? "Rejouer l’intro" : "Replay intro";
  return (
    <button type="button" className={`intro-replay ${mobile ? "intro-replay--mobile" : ""}`} onClick={() => {
      onReplay?.();
      if (onReplay) requestAnimationFrame(replay);
      else replay();
    }} disabled={phase !== "off"} aria-label={label} title={label}>
      <RotateCcw aria-hidden="true" />
      {mobile && <span>{label}</span>}
    </button>
  );
}

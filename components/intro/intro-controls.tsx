"use client";

import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { usePreferences } from "@/components/system/preferences";
import { useIntro } from "./intro-context";

export function IntroControls() {
  const { locale } = usePreferences();
  const { enter, audioAvailable } = useIntro();
  return (
    <div className="intro-controls" aria-label={locale === "fr" ? "Entrer dans le portfolio" : "Enter the portfolio"}>
      {audioAvailable && (
        <button type="button" className="intro-controls__sound" onClick={() => enter(true)}>
          <Volume2 aria-hidden="true" />
          <span>{locale === "fr" ? "Entrer avec le son" : "Enter with sound"}</span>
          <span className="intro-controls__arrow" aria-hidden="true">↗</span>
        </button>
      )}
      <button type="button" className="intro-controls__silent" onClick={() => enter(false)}>
        <VolumeX aria-hidden="true" />
        <span>{locale === "fr" ? "Entrer sans le son" : "Enter without sound"}</span>
        <span className="intro-controls__arrow" aria-hidden="true">↗</span>
      </button>
    </div>
  );
}

export function SoundToggle() {
  const { locale } = usePreferences();
  const { soundOn, audioAvailable, toggleSound } = useIntro();
  const label = soundOn
    ? locale === "fr" ? "Couper le son" : "Mute sound"
    : locale === "fr" ? "Activer le son" : "Enable sound";
  return (
    <button type="button" className="intro-sound-toggle" onClick={toggleSound} disabled={!audioAvailable} aria-label={audioAvailable ? label : locale === "fr" ? "Son indisponible" : "Sound unavailable"} title={label} aria-pressed={soundOn}>
      {soundOn ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
    </button>
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

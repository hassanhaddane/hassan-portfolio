"use client";
import { RotateCcw } from "lucide-react";
import { usePreferences } from "@/components/system/preferences";
import { useIntro } from "./intro-context";

export function ReplayIntro({
  mobile = false,
  onReplay,
}: {
  mobile?: boolean;
  onReplay?: () => void;
}) {
  const { locale, motion } = usePreferences();
  const { replay, phase } = useIntro();
  const label = locale === "fr" ? "Rejouer l’intro" : "Replay intro";
  return (
    <button
      type="button"
      className="intro-replay"
      onClick={() => {
        onReplay?.();
        if (onReplay) requestAnimationFrame(replay);
        else replay();
      }}
      disabled={phase !== "off" || !motion}
      aria-label={label}
      title={label}
    >
      <RotateCcw aria-hidden="true" />
      {mobile ? label : null}
    </button>
  );
}

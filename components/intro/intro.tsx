"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { usePreferences } from "@/components/system/preferences";
import { useIntro } from "./intro-context";
import { LogoReveal } from "./logo-reveal";

export function Intro() {
  const { locale } = usePreferences();
  const { phase, skip } = useIntro();
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (
      phase === "off" ||
      document.documentElement.dataset.introPending !== "true"
    )
      return;
    const content = document.querySelector<HTMLElement>("[data-site-content]");
    if (content) content.inert = true;
    button.current?.focus({ preventScroll: true });
    return () => {
      if (content) content.inert = false;
    };
  }, [phase]);
  if (phase === "off") return null;
  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-label={
        locale === "fr" ? "Introduction LOWKYZ" : "LOWKYZ introduction"
      }
      className="cinematic-intro"
      data-phase={phase}
    >
      <div className="intro-top mono">
        <span>LOWKYZ / 001</span>
        <button
          ref={button}
          onClick={skip}
          onKeyDown={(event) => {
            if (event.key === "Tab") event.preventDefault();
          }}
        >
          {locale === "fr" ? "Passer l’intro" : "Skip intro"}
          <ArrowUpRight aria-hidden="true" />
        </button>
      </div>
      <LogoReveal />
      <div className="intro-bottom mono">
        <span>HASSAN HADDANE</span>
        <span>
          {locale === "fr"
            ? "DÉVELOPPEMENT × CRÉATION"
            : "DEVELOPMENT × CREATION"}
        </span>
      </div>
    </aside>
  );
}

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
  const overlay = useRef<HTMLElement>(null);
  const active = phase !== "off";
  useEffect(() => {
    if (!active || document.documentElement.dataset.introPending !== "true")
      return;
    const content = document.querySelector<HTMLElement>("[data-site-content]");
    if (content) content.inert = true;
    button.current?.focus({ preventScroll: true });
    const measure = () => {
      const stage = overlay.current?.querySelector<HTMLElement>(".intro-stage");
      const score = document.querySelector<SVGElement>(
        ".hero-art .rhythm-score",
      );
      const dot = document.querySelector<HTMLElement>(".hero-period");
      if (!stage || !overlay.current) return;
      const rect = stage.getBoundingClientRect();
      const scoreBox = score?.getBoundingClientRect();
      const target =
        scoreBox && scoreBox.width > 0
          ? scoreBox
          : dot?.getBoundingClientRect();
      if (!target) return;
      overlay.current.style.setProperty(
        "--dock-x",
        `${(target.left + target.width / 2 - rect.left - rect.width / 2).toFixed(2)}px`,
      );
      overlay.current.style.setProperty(
        "--dock-y",
        `${(target.top + target.height / 2 - rect.top - rect.height / 2).toFixed(2)}px`,
      );
      overlay.current.style.setProperty(
        "--dock-scale",
        (target.width / rect.width).toFixed(4),
      );
    };
    measure();
    addEventListener("resize", measure);
    return () => {
      if (content) content.inert = false;
      removeEventListener("resize", measure);
    };
  }, [active]);
  if (!active) return null;
  return (
    <aside
      ref={overlay}
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
          type="button"
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

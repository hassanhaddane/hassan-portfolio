"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, ArrowRight } from "lucide-react";
import { usePreferences } from "@/components/system/preferences";
import { Wordmark } from "@/components/ui/wordmark";
import { yieldToBrowser } from "@/lib/browser-tasks";

const SESSION_KEY = "lowkyz.intro.v3";
type Phase = "boot" | "loading" | "release" | "closed" | "still";
const total = 3;

/** The SSR hero stays readable and actionable while its signature acquires real resources. */
export function SignalIntro() {
  const { locale, motion } = usePreferences();
  const [phase, setPhase] = useState<Phase>("boot");
  const [cycle, setCycle] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const replay = useRef<HTMLButtonElement>(null);
  const fr = locale === "fr";
  useEffect(() => {
    const automatic = cycle === 0;
    const animated =
      document.documentElement.dataset.motion !== "off" &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "seen";
    } catch {
      /* Storage is optional. */
    }
    if (
      automatic &&
      (!animated ||
        seen ||
        (location.hash && location.hash !== "#profil") ||
        scrollY > 40)
    ) {
      setPhase("closed");
      return;
    }
    let cancelled = false;
    let complete = 0;
    setLoaded(0);
    setPhase(animated ? "loading" : "still");
    const close = () => {
      cancelled = true;
    };
    root.current?.addEventListener("skip-intro", close);
    const node = root.current;
    const typeface = (name: string, size: string) => {
      const family = getComputedStyle(document.body)
        .getPropertyValue(name)
        .split(",")[0]
        .trim();
      return family
        ? document.fonts.load(`${size} ${family}`)
        : Promise.resolve();
    };
    const mark = async (task: Promise<unknown>) => {
      try {
        await task;
      } catch {
        /* CSS provides a complete font fallback. */
      }
      if (!cancelled) setLoaded(++complete);
    };
    const prepare = async () => {
      await yieldToBrowser();
      if (cancelled) return;
      await Promise.all([
        mark(typeface("--font-barlow", "800 64px")),
        mark(typeface("--font-geist-sans", "400 16px")),
        // The vector signature is already in the document. Wait for its layout, not WebGL.
        mark(yieldToBrowser()),
      ]);
      if (cancelled) return;
      try {
        sessionStorage.setItem(SESSION_KEY, "seen");
      } catch {
        /* Storage is optional. */
      }
      if (
        animated &&
        node?.querySelector(".intro-score")?.contains(document.activeElement)
      )
        replay.current?.focus({ preventScroll: true });
      setPhase(animated ? "release" : "still");
    };
    void prepare();
    return () => {
      cancelled = true;
      node?.removeEventListener("skip-intro", close);
    };
  }, [cycle]);
  useEffect(() => {
    if (motion) return;
    root.current?.dispatchEvent(new Event("skip-intro"));
    setPhase((current) => (current === "still" ? current : "closed"));
  }, [motion]);

  function skip() {
    root.current?.dispatchEvent(new Event("skip-intro"));
    try {
      sessionStorage.setItem(SESSION_KEY, "seen");
    } catch {
      /* Storage is optional. */
    }
    setPhase("closed");
    replay.current?.focus({ preventScroll: true });
  }
  const progress = Math.round((loaded / total) * 100);
  return (
    <div
      className="signal-intro"
      ref={root}
      data-intro-phase={phase}
      onKeyDown={(event) => {
        if (event.key === "Escape" && phase !== "closed") skip();
      }}
    >
      <button
        className="intro-replay mono"
        type="button"
        ref={replay}
        onClick={() => setCycle((value) => value + 1)}
      >
        <RotateCcw aria-hidden="true" />{" "}
        {fr ? "Rejouer l’introduction" : "Replay the intro"}
      </button>
      {phase !== "closed" ? (
        <div
          className="intro-score"
          inert={phase === "release" || undefined}
          onAnimationEnd={(event) => {
            if (
              phase === "release" &&
              event.target === event.currentTarget &&
              event.animationName === "intro-release"
            )
              setPhase("closed");
          }}
        >
          <div className="intro-register mono">
            <span>LOWKYZ / V3</span>
            <span>01 — {fr ? "LE SIGNAL" : "THE SIGNAL"}</span>
          </div>
          <div className="intro-emblem" aria-hidden="true">
            <Wordmark />
            <div className="intro-wave">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="intro-controls">
            <div
              className="intro-progress"
              role="progressbar"
              aria-label={
                fr ? "Préparation de l’introduction" : "Preparing the intro"
              }
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div className="mono">
                <span>
                  {loaded === total
                    ? fr
                      ? "SIGNAL PRÊT"
                      : "SIGNAL READY"
                    : fr
                      ? "PRÉPARATION"
                      : "ACQUIRING SIGNAL"}
                </span>
                <span>{String(progress).padStart(3, "0")}%</span>
              </div>
              <span className="intro-progress-track" aria-hidden="true">
                <i style={{ transform: `scaleX(${progress / 100})` }} />
              </span>
            </div>
            <button className="intro-skip mono" type="button" onClick={skip}>
              {fr ? "Passer l’introduction" : "Skip the intro"}
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

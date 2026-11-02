"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePreferences } from "@/components/system/preferences";

export type IntroPhase = "off" | "blackout" | "initialize" | "reveal" | "choice" | "transition";

type IntroState = {
  phase: IntroPhase;
  enter: () => void;
  skip: () => void;
  replay: () => void;
};

const IntroContext = createContext<IntroState | null>(null);
const SESSION_KEY = "lowkyz.cinematic.v1";

export function IntroProvider({ children }: { children: ReactNode }) {
  const { motion } = usePreferences();
  const [phase, setPhase] = useState<IntroPhase>("blackout");
  const [replayCount, setReplayCount] = useState(0);
  const timers = useRef<number[]>([]);
  const phaseRef = useRef<IntroPhase>("blackout");
  const ignoreScrollUntil = useRef(0);

  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }, []);

  const finish = useCallback((focusHero = true) => {
    clearTimers();
    try { sessionStorage.setItem(SESSION_KEY, "seen"); } catch { /* Optional session memory. */ }
    document.documentElement.removeAttribute("data-intro-pending");
    document.documentElement.removeAttribute("data-intro-phase");
    setPhase("off");
    if (focusHero) requestAnimationFrame(() => document.getElementById("profil")?.focus({ preventScroll: true }));
  }, [clearTimers]);

  useEffect(() => {
    if (
      document.documentElement.dataset.introPending !== "true" ||
      !motion || document.hidden || (window.scrollY > 24 && performance.now() >= ignoreScrollUntil.current) ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      document.documentElement.removeAttribute("data-intro-pending");
      setPhase("off");
      return;
    }
    setPhase("blackout");
    const schedule = (next: IntroPhase, delay: number) => {
      timers.current.push(window.setTimeout(() => setPhase(next), delay));
    };
    schedule("initialize", 170);
    schedule("reveal", 620);
    schedule("choice", 1200);
    const leave = () => finish(false);
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") leave(); };
    const onScroll = () => {
      if (performance.now() >= ignoreScrollUntil.current && window.scrollY > 24) leave();
    };
    const onVisibility = () => {
      if (document.hidden) {
        clearTimers();
        if (phaseRef.current === "transition") finish(false);
      } else if (phaseRef.current !== "off") {
        setPhase("choice");
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimers();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [motion, replayCount, clearTimers, finish]);

  useEffect(() => {
    phaseRef.current = phase;
    document.documentElement.dataset.introPhase = phase;
    return () => { document.documentElement.removeAttribute("data-intro-phase"); };
  }, [phase]);

  useEffect(() => clearTimers, [clearTimers]);

  const enter = useCallback(() => {
    clearTimers();
    try { sessionStorage.setItem(SESSION_KEY, "seen"); } catch { /* Optional session memory. */ }
    setPhase("transition");
    timers.current.push(window.setTimeout(() => finish(), 900));
  }, [clearTimers, finish]);

  const replay = useCallback(() => {
    if (location.hash) history.replaceState(history.state, "", `${location.pathname}${location.search}`);
    ignoreScrollUntil.current = performance.now() + 1500;
    window.scrollTo(0, 0);
    document.documentElement.dataset.introPending = "true";
    setReplayCount((count) => count + 1);
  }, []);

  const value = useMemo(() => ({
    phase, enter, skip: () => finish(), replay,
  }), [phase, enter, finish, replay]);

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  const context = useContext(IntroContext);
  if (!context) throw new Error("IntroProvider is required");
  return context;
}

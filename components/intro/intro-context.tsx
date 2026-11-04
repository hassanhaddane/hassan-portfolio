"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePreferences } from "@/components/system/preferences";

export type IntroPhase = "off" | "reveal" | "transition";
type IntroState = { phase: IntroPhase; skip: () => void; replay: () => void };
const IntroContext = createContext<IntroState | null>(null);
const SESSION_KEY = "lowkyz.cinematic.v2";

export function IntroProvider({ children }: { children: ReactNode }) {
  const { motion } = usePreferences();
  const [phase, setPhase] = useState<IntroPhase>("reveal");
  const [replayCount, setReplayCount] = useState(0);
  const timers = useRef<number[]>([]);
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  const finish = useCallback(
    (focusHero = true) => {
      clearTimers();
      try {
        sessionStorage.setItem(SESSION_KEY, "seen");
      } catch {
        /* Optional storage. */
      }
      document.documentElement.removeAttribute("data-intro-pending");
      setPhase("off");
      if (focusHero)
        requestAnimationFrame(() =>
          document.getElementById("profil")?.focus({ preventScroll: true }),
        );
    },
    [clearTimers],
  );
  useEffect(() => {
    if (
      document.documentElement.dataset.introPending !== "true" ||
      !motion ||
      document.hidden ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      finish(false);
      return;
    }
    setPhase("reveal");
    timers.current.push(window.setTimeout(() => setPhase("transition"), 1400));
    timers.current.push(window.setTimeout(() => finish(), 1900));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    const onVisibility = () => {
      if (document.hidden) finish(false);
    };
    const onScroll = () => {
      if (scrollY > 24) finish(false);
    };
    addEventListener("keydown", onKey);
    addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimers();
      removeEventListener("keydown", onKey);
      removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [motion, replayCount, clearTimers, finish]);
  const replay = useCallback(() => {
    if (!motion) return;
    history.replaceState(
      history.state,
      "",
      location.pathname + location.search,
    );
    window.scrollTo({ top: 0, behavior: "instant" });
    document.documentElement.dataset.introPending = "true";
    setReplayCount((count) => count + 1);
  }, [motion]);
  const value = useMemo(
    () => ({ phase, skip: () => finish(), replay }),
    [phase, finish, replay],
  );
  return (
    <IntroContext.Provider value={value}>{children}</IntroContext.Provider>
  );
}

export function useIntro() {
  const context = useContext(IntroContext);
  if (!context) throw new Error("IntroProvider is required");
  return context;
}

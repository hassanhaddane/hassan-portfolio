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

export type IntroPhase = "off" | "signal" | "identity" | "handoff";
type IntroState = { phase: IntroPhase; skip: () => void; replay: () => void };
const IntroContext = createContext<IntroState | null>(null);
const SESSION_KEY = "lowkyz.cinematic.v2";

export function IntroProvider({ children }: { children: ReactNode }) {
  const { motion } = usePreferences();
  const [phase, setPhase] = useState<IntroPhase>("signal");
  const [replayCount, setReplayCount] = useState(0);
  const timers = useRef<number[]>([]);
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  const finish = useCallback(
    (focusHero = true, arrival = false) => {
      clearTimers();
      try {
        sessionStorage.setItem(SESSION_KEY, "seen");
      } catch {
        /* Optional storage. */
      }
      const root = document.documentElement;
      root.removeAttribute("data-intro-pending");
      root.removeAttribute("data-intro-phase");
      if (arrival) {
        root.dataset.heroArrival = "true";
        timers.current.push(
          window.setTimeout(() => delete root.dataset.heroArrival, 1100),
        );
      } else delete root.dataset.heroArrival;
      setPhase("off");
      dispatchEvent(new Event("lowkyz:intro-complete"));
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
      location.hash ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      finish(false);
      return;
    }
    const setStep = (next: IntroPhase) => {
      setPhase(next);
      document.documentElement.dataset.introPhase = next;
    };
    setStep("signal");
    timers.current.push(window.setTimeout(() => setStep("identity"), 480));
    timers.current.push(window.setTimeout(() => setStep("handoff"), 1430));
    timers.current.push(window.setTimeout(() => finish(true, true), 2080));
    // Independent upper bound: an interrupted animation must never lock the page.
    timers.current.push(window.setTimeout(() => finish(false), 2600));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    const onVisibility = () => {
      if (document.hidden) finish(false);
    };
    const onScroll = () => {
      if (scrollY > 24) finish(false);
    };
    const onHash = () => finish(false);
    addEventListener("keydown", onKey);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("hashchange", onHash);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimers();
      removeEventListener("keydown", onKey);
      removeEventListener("scroll", onScroll);
      removeEventListener("hashchange", onHash);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [motion, replayCount, clearTimers, finish]);
  useEffect(
    () => () => {
      clearTimers();
      delete document.documentElement.dataset.heroArrival;
    },
    [clearTimers],
  );
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

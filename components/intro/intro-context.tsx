"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { IntroAudio } from "@/lib/intro-audio";
import { usePreferences } from "@/components/system/preferences";

export type IntroPhase = "off" | "blackout" | "initialize" | "reveal" | "choice" | "transition";

type IntroState = {
  phase: IntroPhase;
  soundOn: boolean;
  audioAvailable: boolean;
  enter: (withSound: boolean) => void;
  skip: () => void;
  replay: () => void;
  toggleSound: () => void;
};

const IntroContext = createContext<IntroState | null>(null);
const SESSION_KEY = "lowkyz.cinematic.v1";

export function IntroProvider({ children }: { children: ReactNode }) {
  const { motion } = usePreferences();
  const [phase, setPhase] = useState<IntroPhase>("blackout");
  const [soundOn, setSoundOn] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [replayCount, setReplayCount] = useState(0);
  const timers = useRef<number[]>([]);
  const audio = useRef<IntroAudio | null>(null);
  const soundRequest = useRef(0);
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
    setAudioAvailable(typeof window.AudioContext !== "undefined");
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

  useEffect(() => {
    const visibility = () => {
      if (document.hidden) void audio.current?.mute();
      else if (soundOn) void audio.current?.resume();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, [soundOn]);

  useEffect(() => () => {
    clearTimers();
    audio.current?.dispose();
  }, [clearTimers]);

  const enableSound = useCallback(() => {
    const request = ++soundRequest.current;
    const engine = audio.current ?? new IntroAudio();
    audio.current = engine;
    void engine.enable().then((enabled) => {
      if (request === soundRequest.current) setSoundOn(enabled);
      else if (enabled) void engine.mute();
    });
  }, []);

  const enter = useCallback((withSound: boolean) => {
    if (withSound) enableSound();
    else { soundRequest.current++; setSoundOn(false); void audio.current?.mute(); }
    clearTimers();
    try { sessionStorage.setItem(SESSION_KEY, "seen"); } catch { /* Optional session memory. */ }
    setPhase("transition");
    timers.current.push(window.setTimeout(() => finish(), 900));
  }, [clearTimers, enableSound, finish]);

  const replay = useCallback(() => {
    soundRequest.current++;
    setSoundOn(false);
    void audio.current?.mute();
    if (location.hash) history.replaceState(history.state, "", `${location.pathname}${location.search}`);
    ignoreScrollUntil.current = performance.now() + 1500;
    window.scrollTo(0, 0);
    document.documentElement.dataset.introPending = "true";
    setReplayCount((count) => count + 1);
  }, []);

  const toggleSound = useCallback(() => {
    if (soundOn) { soundRequest.current++; setSoundOn(false); void audio.current?.mute(); }
    else enableSound();
  }, [enableSound, soundOn]);

  const value = useMemo(() => ({
    phase, soundOn, audioAvailable, enter, skip: () => finish(), replay, toggleSound,
  }), [phase, soundOn, audioAvailable, enter, finish, replay, toggleSound]);

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  const context = useContext(IntroContext);
  if (!context) throw new Error("IntroProvider is required");
  return context;
}

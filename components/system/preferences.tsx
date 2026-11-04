"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Locale } from "@/lib/portfolio-data";
import { chapters } from "@/lib/experience-copy";

type Preferences = {
  locale: Locale;
  motion: boolean;
  systemReduced: boolean;
  toggleMotion: () => void;
};
const Context = createContext<Preferences | null>(null);
const SectionContext = createContext("profil");
const CommandContext = createContext<{
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
} | null>(null);
const KEY = "lowkyz.accessibility.v2";

export function PreferencesProvider({
  children,
  initialLocale = "fr",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [systemReduced, setSystemReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [activeSection, setActiveSection] = useState("profil");
  const [commandOpen, setCommandOpen] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (typeof saved.motion === "boolean") setMotionEnabled(saved.motion);
      localStorage.removeItem("lowkyz.preferences.v1");
    } catch {
      /* Optional storage. */
    }
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReduced(media.matches);
    update();
    media.addEventListener("change", update);
    setReady(true);
    return () => media.removeEventListener("change", update);
  }, []);
  const motion = motionEnabled && !systemReduced;
  const toggleMotion = useCallback(
    () => setMotionEnabled((value) => !value),
    [],
  );
  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = initialLocale;
    document.documentElement.dataset.motion = motion ? "on" : "off";
    try {
      localStorage.setItem(KEY, JSON.stringify({ motion: motionEnabled }));
    } catch {
      /* Optional storage. */
    }
  }, [initialLocale, motion, motionEnabled, ready]);
  useEffect(() => {
    const sections = chapters
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => !!section);
    let frame = 0;
    const update = () => {
      frame = 0;
      let id = sections[0]?.id ?? "profil";
      for (const section of sections)
        if (section.getBoundingClientRect().top <= innerHeight * 0.35)
          id = section.id;
      if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4)
        id = "contact";
      setActiveSection(id);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    addEventListener("keydown", keydown);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      removeEventListener("keydown", keydown);
    };
  }, []);
  const value = useMemo(
    () => ({ locale: initialLocale, motion, systemReduced, toggleMotion }),
    [initialLocale, motion, systemReduced, toggleMotion],
  );
  const command = useMemo(
    () => ({ commandOpen, setCommandOpen }),
    [commandOpen],
  );
  return (
    <Context.Provider value={value}>
      <SectionContext.Provider value={activeSection}>
        <CommandContext.Provider value={command}>
          {children}
        </CommandContext.Provider>
      </SectionContext.Provider>
    </Context.Provider>
  );
}

export const useActiveSection = () => useContext(SectionContext);
export function useCommand() {
  const value = useContext(CommandContext);
  if (!value) throw new Error("PreferencesProvider is required");
  return value;
}
export function usePreferences() {
  const value = useContext(Context);
  if (!value) throw new Error("PreferencesProvider is required");
  return value;
}

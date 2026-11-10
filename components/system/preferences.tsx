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
import { useScrollNarrative } from "@/lib/use-scroll-narrative";

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
  enableCommands = true,
}: {
  children: ReactNode;
  initialLocale?: Locale;
  enableCommands?: boolean;
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
    if (!enableCommands) return;
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    addEventListener("keydown", keydown);
    return () => {
      removeEventListener("keydown", keydown);
    };
  }, [enableCommands]);
  useScrollNarrative(motion, setActiveSection);
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

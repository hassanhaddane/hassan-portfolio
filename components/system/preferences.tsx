"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import type { Locale } from "@/lib/portfolio-data";
import { SITE_ORIGIN, seoContent } from "@/lib/seo";

type Mode = "recruiter" | "explore";
export type Theme = "light" | "dark";
type Preferences = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  motion: boolean;
  toggleMotion: () => void;
  systemReduced: boolean;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};
const Context = createContext<Preferences | null>(null);
const SectionContext = createContext("profil");
const CommandContext = createContext<{
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
} | null>(null);
const KEY = "lowkyz.preferences.v1";

export function PreferencesProvider({
  children,
  initialLocale = "fr",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [mode, setMode] = useState<Mode>("recruiter");
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [theme, setTheme] = useState<Theme>("dark");
  const [systemReduced, setSystemReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [activeSection, setActiveSection] = useState("profil");
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (saved.mode === "recruiter" || saved.mode === "explore")
        setMode(saved.mode);
      if (typeof saved.motion === "boolean") setMotionEnabled(saved.motion);
      if (saved.theme === "light" || saved.theme === "dark")
        setTheme(saved.theme);
    } catch {
      /* Storage can be unavailable in private or restricted contexts. */
    }
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    setSystemReduced(media.matches);
    const update = () => setSystemReduced(media.matches);
    media.addEventListener("change", update);
    setReady(true);
    return () => media.removeEventListener("change", update);
  }, []);

  const motion = motionEnabled && !systemReduced;
  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
  }, []);
  const toggleMotion = useCallback(
    () => setMotionEnabled((value) => !value),
    [],
  );
  const toggleTheme = useCallback(
    () => setTheme((value) => (value === "light" ? "dark" : "light")),
    [],
  );
  const preferences = useMemo(
    () => ({
      locale,
      setLocale,
      mode,
      setMode,
      motion,
      toggleMotion,
      systemReduced,
      theme,
      setTheme,
      toggleTheme,
    }),
    [locale, setLocale, mode, motion, toggleMotion, systemReduced, theme, toggleTheme],
  );
  const command = useMemo(
    () => ({ commandOpen, setCommandOpen }),
    [commandOpen],
  );
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ locale, mode, motion: motionEnabled, theme }),
      );
    } catch {
      /* Optional persistence. */
    }
    document.documentElement.lang = locale;
    document.documentElement.dataset.mode = mode;
    document.documentElement.dataset.motion = motion ? "on" : "off";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "light" ? "#f2f0e9" : "#080a0e");
    const localizedPath = location.pathname.match(/^\/(fr|en)(?=\/|$)/)
      ? location.pathname.replace(/^\/(fr|en)(?=\/|$)/, `/${locale}`)
      : `/${locale}`;
    const nextUrl = `${localizedPath}${location.search}${location.hash}`;
    if (`${location.pathname}${location.search}${location.hash}` !== nextUrl)
      history.replaceState(history.state, "", nextUrl);

    const seo = seoContent[locale];
    document.title = seo.title;
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", seo.description);
    document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute("content", seo.title);
    document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute("content", seo.ogDescription);
    document.querySelector<HTMLMetaElement>('meta[property="og:locale"]')?.setAttribute("content", locale === "fr" ? "fr_FR" : "en_GB");
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", `${SITE_ORIGIN}/${locale}`);
  }, [ready, locale, mode, motionEnabled, motion, theme]);

  useEffect(() => {
    const sections = [
      ...document.querySelectorAll<HTMLElement>("[data-section]"),
    ];
    let frame = 0;
    const updateSection = () => {
      frame = 0;
      const readingLine = innerHeight * 0.34;
      let current = sections[0]?.id ?? "profil";
      for (const section of sections) {
        const box = section.getBoundingClientRect();
        if (box.top <= readingLine) current = section.id;
      }
      setActiveSection((previous) => (previous === current ? previous : current));
    };
    const scheduleSectionUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateSection);
    };
    scheduleSectionUpdate();
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((open) => !open);
      }
    };
    window.addEventListener("scroll", scheduleSectionUpdate, { passive: true });
    document.addEventListener("scroll", scheduleSectionUpdate, {
      capture: true,
      passive: true,
    });
    window.addEventListener("scrollend", updateSection);
    window.addEventListener("resize", scheduleSectionUpdate, { passive: true });
    window.addEventListener("hashchange", scheduleSectionUpdate);
    window.addEventListener("keydown", keydown);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleSectionUpdate);
      document.removeEventListener("scroll", scheduleSectionUpdate, true);
      window.removeEventListener("scrollend", updateSection);
      window.removeEventListener("resize", scheduleSectionUpdate);
      window.removeEventListener("hashchange", scheduleSectionUpdate);
      window.removeEventListener("keydown", keydown);
    };
  }, []);

  useEffect(() => {
    let scrollTimer = 0;
    let previousScrollBehavior = "";
    let nativeSmoothDisabled = false;
    const targetFromHash = (hash: string) => {
      if (!hash.startsWith("#") || hash.length < 2) return null;
      try {
        return document.getElementById(decodeURIComponent(hash.slice(1)));
      } catch {
        return null;
      }
    };
    const motionAllowed = () =>
      document.documentElement.dataset.motion !== "off" &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stopScroll = () => {
      if (scrollTimer) window.clearInterval(scrollTimer);
      scrollTimer = 0;
      if (nativeSmoothDisabled) {
        document.documentElement.style.scrollBehavior = previousScrollBehavior;
        nativeSmoothDisabled = false;
      }
    };
    const disableNativeSmooth = () => {
      previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      nativeSmoothDisabled = true;
    };
    const syncTargetSection = (target: HTMLElement) => {
      const section = target.matches("[data-section]")
        ? target
        : target.closest<HTMLElement>("[data-section]");
      if (section?.id)
        setActiveSection((previous) =>
          previous === section.id ? previous : section.id,
        );
    };
    const scrollToHash = (hash: string, forceInstant = false) => {
      const target = targetFromHash(hash);
      if (!target) return;
      syncTargetSection(target);
      const renderBoundary = target.closest<HTMLElement>(
        "#projets, .knowledge-system-root, #about, #contact",
      );
      renderBoundary?.style.setProperty("content-visibility", "visible");
      const root = document.scrollingElement ?? document.documentElement;
      const rootStyle = getComputedStyle(document.documentElement);
      const targetStyle = getComputedStyle(target);
      const padding = Number.parseFloat(rootStyle.scrollPaddingTop) || 0;
      const margin = Number.parseFloat(targetStyle.scrollMarginTop) || 0;
      const navigationOffset = Math.max(padding, margin);
      const destination = Math.max(
        0,
        target.getBoundingClientRect().top + scrollY - navigationOffset,
      );
      stopScroll();
      disableNativeSmooth();
      if (forceInstant || !motionAllowed()) {
        root.scrollTop = destination;
        stopScroll();
        requestAnimationFrame(() => syncTargetSection(target));
      } else {
        const origin = root.scrollTop;
        const distance = destination - origin;
        const duration = Math.min(
          820,
          Math.max(360, Math.sqrt(Math.abs(distance)) * 9),
        );
        const started = performance.now();
        const advance = () => {
          const time = performance.now();
          const progress = Math.min(1, (time - started) / duration);
          const eased = 1 - Math.pow(1 - progress, 4);
          root.scrollTop = origin + distance * eased;
          if (progress >= 1) {
            stopScroll();
            syncTargetSection(target);
          }
        };
        advance();
        scrollTimer = window.setInterval(advance, 16);
      }
      if (renderBoundary)
        window.setTimeout(() => {
          renderBoundary.style.removeProperty("content-visibility");
          syncTargetSection(target);
        }, forceInstant ? 160 : 1050);
    };
    const handleInternalLink = (event: MouseEvent) => {
      if (
        (typeof event.button === "number" && event.button !== 0) ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const clicked = event.target;
      const origin =
        clicked instanceof Element
          ? clicked
          : clicked instanceof Node
            ? clicked.parentElement
            : null;
      if (!origin) return;
      const anchor = origin.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = anchor?.getAttribute("href");
      if (!anchor || !hash || !targetFromHash(hash)) return;
      event.preventDefault();
      history.pushState(history.state, "", hash);
      scrollToHash(hash);
      if (anchor.classList.contains("skip-link"))
        requestAnimationFrame(() => targetFromHash(hash)?.focus({ preventScroll: true }));
    };
    const handleProgrammaticNavigation = (event: Event) => {
      const hash = (event as CustomEvent<string>).detail;
      if (!targetFromHash(hash)) return;
      history.pushState(history.state, "", hash);
      scrollToHash(hash);
    };
    const restoreDeepLink = () => scrollToHash(location.hash, true);
    document.addEventListener("click", handleInternalLink, true);
    window.addEventListener("lowkyz:navigate", handleProgrammaticNavigation);
    window.addEventListener("popstate", restoreDeepLink);
    const firstFrame = requestAnimationFrame(() =>
      requestAnimationFrame(restoreDeepLink),
    );
    const settled = window.setTimeout(restoreDeepLink, 180);
    return () => {
      cancelAnimationFrame(firstFrame);
      stopScroll();
      window.clearTimeout(settled);
      document.removeEventListener("click", handleInternalLink, true);
      window.removeEventListener("lowkyz:navigate", handleProgrammaticNavigation);
      window.removeEventListener("popstate", restoreDeepLink);
    };
  }, []);

  return (
    <Context.Provider value={preferences}>
      <SectionContext.Provider value={activeSection}>
        <CommandContext.Provider value={command}>
          {children}
        </CommandContext.Provider>
      </SectionContext.Provider>
    </Context.Provider>
  );
}

export function useActiveSection() {
  return useContext(SectionContext);
}
export function useCommand() {
  const value = useContext(CommandContext);
  if (!value) throw new Error("PreferencesProvider is required");
  return value;
}

export function usePreferences() {
  const context = useContext(Context);
  if (!context) throw new Error("PreferencesProvider is required");
  return context;
}

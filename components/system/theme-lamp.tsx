"use client";

import { flushSync } from "react-dom";
import { usePreferences } from "./preferences";

type TransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

export function ThemeLamp() {
  const { locale, motion, theme, setTheme } = usePreferences();
  const isLight = theme === "light";

  const changeTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next = isLight ? "dark" : "light";
    const doc = document as TransitionDocument;
    const root = document.documentElement;
    const rect = event.currentTarget.getBoundingClientRect();
    root.style.setProperty("--theme-origin-x", `${rect.left + rect.width / 2}px`);
    root.style.setProperty("--theme-origin-y", `${rect.top + rect.height / 2}px`);

    if (!motion || !doc.startViewTransition) {
      setTheme(next);
      return;
    }

    root.classList.add("theme-is-changing");
    const transition = doc.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });
    transition.finished.finally(() => root.classList.remove("theme-is-changing"));
  };

  const label = isLight
    ? locale === "fr"
      ? "Éteindre la lampe et activer le thème sombre"
      : "Turn the lamp off and enable dark theme"
    : locale === "fr"
      ? "Allumer la lampe et activer le thème clair"
      : "Turn the lamp on and enable light theme";

  return (
    <aside className="theme-lamp" data-on={isLight} aria-label={locale === "fr" ? "Ambiance du site" : "Site ambience"}>
      <button
        type="button"
        className="theme-lamp-button"
        aria-label={label}
        aria-pressed={isLight}
        title={label}
        data-cursor={isLight ? "DIM" : "LIGHT"}
        onClick={changeTheme}
      >
        <span className="lamp-cord" aria-hidden="true" />
        <span className="lamp-shade" aria-hidden="true">
          <i />
        </span>
        <span className="lamp-glow" aria-hidden="true" />
        <span className="lamp-state mono" aria-hidden="true">
          <b>{isLight ? "ON" : "OFF"}</b>
          <small>{locale === "fr" ? "LUMIÈRE" : "LIGHT"}</small>
        </span>
      </button>
    </aside>
  );
}

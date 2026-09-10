"use client";

import { useEffect, useRef, useState } from "react";
import { usePreferences } from "./preferences";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function EasterEggs() {
  const { locale } = usePreferences();
  const [debug, setDebug] = useState(false);
  const index = useRef(0);
  const timeout = useRef<number | null>(null);

  useEffect(() => {
    console.info(
      "LOWKYZ SYSTEM\nBuilt by Hassan Haddane\nGitHub: https://github.com/hassanhaddane\nContact: hassanhaddane33s@gmail.com",
    );
  }, []);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable='true']")) return;
      const expected = KONAMI[index.current];
      index.current = event.key === expected ? index.current + 1 : event.key === KONAMI[0] ? 1 : 0;
      if (index.current !== KONAMI.length) return;
      index.current = 0;
      setDebug(true);
      document.documentElement.dataset.debug = "true";
      if (timeout.current) window.clearTimeout(timeout.current);
      timeout.current = window.setTimeout(() => {
        setDebug(false);
        delete document.documentElement.dataset.debug;
      }, 12000);
    };
    window.addEventListener("keydown", keydown);
    return () => {
      window.removeEventListener("keydown", keydown);
      if (timeout.current) window.clearTimeout(timeout.current);
      delete document.documentElement.dataset.debug;
    };
  }, []);

  if (!debug) return null;

  return (
    <div className="debug-hud mono" data-visible={debug} role="status" aria-live="polite">
      <span>DEBUG MODE</span>
      <span>{locale === "fr" ? "TRACE DES SIGNAUX · 12 S" : "SIGNAL TRACE · 12 S"}</span>
      <i aria-hidden="true" />
    </div>
  );
}

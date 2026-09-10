"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Command, Menu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useActiveSection, useCommand, usePreferences } from "./preferences";
import { VisitControls } from "./visit-controls";

const chapters = [
  { id: "profil", index: "00", label: { fr: "Aujourd’hui", en: "Now" }, type: { fr: "NOW", en: "NOW" } },
  { id: "projets", index: "01", label: { fr: "Projets", en: "Work" }, type: { fr: "PROJET", en: "PROJECT" } },
  { id: "experience", index: "02", label: { fr: "Expériences", en: "Experience" }, type: { fr: "EXPÉRIENCE", en: "EXPERIENCE" } },
  { id: "stack", index: "03", label: { fr: "Stack", en: "Stack" }, type: { fr: "COMPÉTENCES", en: "SKILLS" } },
  { id: "education", index: "04", label: { fr: "Formation", en: "Education" }, type: { fr: "FORMATION", en: "EDUCATION" } },
  { id: "about", index: "05", label: { fr: "À propos", en: "About" }, type: { fr: "À PROPOS", en: "ABOUT" } },
  { id: "contact", index: "06", label: { fr: "Contact", en: "Contact" }, type: { fr: "CONTACT", en: "CONTACT" } },
] as const;

export function Navigation() {
  const { locale, setLocale } = usePreferences();
  const { setCommandOpen } = useCommand();
  const activeSection = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoSignal, setLogoSignal] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuTarget = useRef<string | null>(null);
  const logoTimer = useRef<number | null>(null);
  const logoResetTimer = useRef<number | null>(null);
  const logoFrame = useRef<number | null>(null);
  const logoText = useRef<HTMLElement>(null);
  const scrambleLogo = () => {
    const source = "LOWKYZ";
    const glyphs = "01/\\<>[]{}";
    const startedAt = performance.now();
    const draw = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / 360);
      if (logoText.current) {
        logoText.current.textContent = source
          .split("")
          .map((character, index) =>
            index / source.length < progress
              ? character
              : glyphs[Math.floor(Math.random() * glyphs.length)],
          )
          .join("");
      }
      if (progress < 1) logoFrame.current = requestAnimationFrame(draw);
      else logoFrame.current = null;
    };
    if (logoFrame.current) cancelAnimationFrame(logoFrame.current);
    logoFrame.current = requestAnimationFrame(draw);
  };
  const primeLogo = () => {
    if (logoTimer.current) window.clearTimeout(logoTimer.current);
    logoTimer.current = window.setTimeout(() => {
      setLogoSignal(true);
      scrambleLogo();
      if (logoResetTimer.current) window.clearTimeout(logoResetTimer.current);
      logoResetTimer.current = window.setTimeout(() => setLogoSignal(false), 1800);
    }, 680);
  };
  const releaseLogo = () => {
    if (logoTimer.current) window.clearTimeout(logoTimer.current);
    logoTimer.current = null;
    if (logoFrame.current) cancelAnimationFrame(logoFrame.current);
    logoFrame.current = null;
    if (logoText.current) logoText.current.textContent = "LOWKYZ";
  };
  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        if (header.current)
          header.current.dataset.floating = String(scrollY > 100);
        frame = 0;
      });
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", update);
      if (logoTimer.current) window.clearTimeout(logoTimer.current);
      if (logoResetTimer.current) window.clearTimeout(logoResetTimer.current);
      if (logoFrame.current) cancelAnimationFrame(logoFrame.current);
    };
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        {locale === "fr" ? "Aller au contenu" : "Skip to content"}
      </a>
      <header ref={header} className="site-masthead">
        <a
          className="wordmark"
          data-signal={logoSignal}
          href="#profil"
          aria-label="LOWKYZ — Hassan Haddane"
          onPointerEnter={primeLogo}
          onPointerLeave={releaseLogo}
          onPointerDown={primeLogo}
          onPointerUp={releaseLogo}
        >
          <b ref={logoText} aria-hidden="true">LOWKYZ</b><span aria-hidden="true">/</span>
          <small aria-hidden="true">HH · 48.1173N</small>
        </a>
        <nav
          className="masthead-links"
          aria-label={
            locale === "fr" ? "Navigation principale" : "Main navigation"
          }
        >
          {chapters.slice(1, 5).map(({ id, label }) => (
            <a
              href={`#${id}`}
              key={id}
              aria-current={activeSection === id ? "location" : undefined}
            >
              {label[locale]}
            </a>
          ))}
        </nav>
        <div className="masthead-utilities">
          <button
            className="locale-switch mono"
            onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
          >
            <span data-current={locale === "fr"}>FR</span>
            <span>/</span>
            <span data-current={locale === "en"}>EN</span>
            <span className="sr-only">
              {locale === "fr" ? "Switch to English" : "Passer en français"}
            </span>
          </button>
          <button
            className="palette-key mono"
            data-command-trigger
            onClick={() => setCommandOpen(true)}
            aria-label={
              locale === "fr"
                ? "Ouvrir la palette de commandes"
                : "Open command palette"
            }
            aria-keyshortcuts="Control+k Meta+k"
          >
            <Command aria-hidden="true" />
            <kbd>K</kbd>
          </button>
          <a className="masthead-contact" href="#contact">
            Contact
            <ArrowUpRight aria-hidden="true" />
          </a>
          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger asChild>
              <button
                className="menu-trigger"
                data-mobile-menu-trigger
                aria-label={locale === "fr" ? "Ouvrir le menu" : "Open menu"}
              >
                <Menu aria-hidden="true" />
              </button>
            </DialogTrigger>
            <DialogContent
              ref={menu}
              className="navigation-dialog"
              onOpenAutoFocus={(event) => {
                event.preventDefault();
                requestAnimationFrame(() =>
                  menu.current
                    ?.querySelector<HTMLAnchorElement>("nav a")
                    ?.focus(),
                );
              }}
              onCloseAutoFocus={(event) => {
                const target = menuTarget.current;
                if (!target) return;
                event.preventDefault();
                menuTarget.current = null;
                requestAnimationFrame(() =>
                  document
                    .getElementById(target)
                    ?.focus({ preventScroll: true }),
                );
              }}
            >
              <DialogTitle className="wordmark">LOWKYZ/</DialogTitle>
              <DialogDescription>
                {locale === "fr"
                  ? "Choisissez un chapitre."
                  : "Choose a chapter."}
              </DialogDescription>
              <nav
                aria-label={
                  locale === "fr" ? "Navigation mobile" : "Mobile navigation"
                }
              >
                {chapters.map(({ id, index, label }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    aria-current={activeSection === id ? "location" : undefined}
                    onClick={() => {
                      menuTarget.current = id;
                      setMenuOpen(false);
                    }}
                  >
                    <span className="mono">{index}</span>
                    {label[locale]}
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </nav>
              <VisitControls />
              <button
                className="mobile-command-link mono"
                onClick={() => {
                  setMenuOpen(false);
                  setCommandOpen(true);
                }}
              >
                {locale === "fr" ? "Palette de commandes" : "Command palette"}
                <Command aria-hidden="true" /> K
              </button>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <ChapterRail />
    </>
  );
}

function ChapterRail() {
  const active = useActiveSection();
  const { locale } = usePreferences();
  const index = Math.max(
    0,
    chapters.findIndex((chapter) => chapter.id === active),
  );
  return (
    <nav
      className="chapter-rail"
      aria-label={
        locale === "fr" ? "Progression par chapitres" : "Chapter progress"
      }
    >
      <span className="chapter-current mono" aria-hidden="true">
        <span>{chapters[index].index}</span>
        <span>/ {chapters[index].type[locale]}</span>
      </span>
      <div className="chapter-stops">
        {chapters.map(({ id, index: chapterIndex, type }, i) => (
          <a
            key={id}
            href={`#${id}`}
            className={i < index ? "is-past" : ""}
            data-chapter-kind={id}
            aria-label={`${chapterIndex} ${type[locale]}`}
            aria-current={active === id ? "step" : undefined}
          >
            <span className="chapter-number mono">{chapterIndex}</span>
            <span className="chapter-label mono">{type[locale]}</span>
            <i aria-hidden="true" />
          </a>
        ))}
      </div>
    </nav>
  );
}

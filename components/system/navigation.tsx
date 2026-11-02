"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDownToLine, ArrowUpRight, Menu, Moon, Orbit, Search, Sun } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { profile } from "@/lib/portfolio-data";
import { useActiveSection, useCommand, usePreferences } from "./preferences";
import { ReplayIntro, SoundToggle } from "@/components/intro/intro-controls";

const chapters = [
  { id: "profil", label: { fr: "Accueil", en: "Home" } },
  { id: "projets", label: { fr: "Projets", en: "Work" } },
  { id: "experience", label: { fr: "Expérience", en: "Experience" } },
  { id: "stack", label: { fr: "Expertise", en: "Expertise" } },
  { id: "education", label: { fr: "Formation", en: "Education" } },
  { id: "about", label: { fr: "À propos", en: "About" } },
  { id: "lab", label: { fr: "Lab", en: "Lab" } },
  { id: "contact", label: { fr: "Contact", en: "Contact" } },
] as const;

const primaryChapters = chapters.filter(({ id }) => !["profil", "education"].includes(id));

export function Navigation() {
  const { locale, setLocale, mode, setMode, motion, toggleMotion, systemReduced, theme, toggleTheme } = usePreferences();
  const { setCommandOpen } = useCommand();
  const activeSection = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuTarget = useRef<string | null>(null);
  const themeLabel = theme === "light"
    ? locale === "fr" ? "Mode sombre" : "Dark mode"
    : locale === "fr" ? "Mode clair" : "Light mode";
  const ThemeIcon = theme === "light" ? Moon : Sun;

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        if (header.current) header.current.dataset.floating = String(scrollY > 72);
        frame = 0;
      });
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", update);
    };
  }, []);

  const openCommand = () => {
    setMenuOpen(false);
    requestAnimationFrame(() => setCommandOpen(true));
  };

  return (
    <>
      <a className="skip-link" href="#main">{locale === "fr" ? "Aller au contenu" : "Skip to content"}</a>
      <header ref={header} className="site-masthead signal-masthead">
        <a className="wordmark signal-masthead__brand" href="#profil" aria-label="LOWKYZ — Hassan Haddane">
          <b>LOWKYZ</b><span aria-hidden="true">/</span>
        </a>

        <nav className="masthead-links" aria-label={locale === "fr" ? "Navigation principale" : "Main navigation"}>
          {primaryChapters.map(({ id, label }) => (
            <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined}>
              {label[locale]}
            </a>
          ))}
        </nav>

        <div className="masthead-utilities">
          <button type="button" className="portfolio-mode-switch" onClick={() => setMode(mode === "recruiter" ? "explore" : "recruiter")} aria-label={mode === "recruiter" ? (locale === "fr" ? "Recruteur : passer en mode Explore" : "Recruiter: switch to Explore mode") : (locale === "fr" ? "Explore : passer en mode Recruteur" : "Explore: switch to Recruiter mode")} aria-pressed={mode === "explore"} title={mode === "recruiter" ? "Explore" : "Recruiter"}>
            <Orbit aria-hidden="true" /><span className="portfolio-mode-switch__label" data-for-mode="recruiter">{locale === "fr" ? "Recruteur" : "Recruiter"}</span><span className="portfolio-mode-switch__label" data-for-mode="explore">Explore</span><span className="portfolio-mode-switch__dot" aria-hidden="true" />
          </button>
          <button type="button" className="signal-masthead__command" data-command-trigger onClick={() => setCommandOpen(true)} aria-label={locale === "fr" ? "⌘ K — Ouvrir la recherche et les commandes" : "⌘ K — Open search and commands"} title="Cmd / Ctrl + K">
            <Search aria-hidden="true" /><kbd>⌘ K</kbd>
          </button>
          <button type="button" className="theme-switch theme-switch-desktop" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}>
            <ThemeIcon aria-hidden="true" />
          </button>
          <SoundToggle />
          <ReplayIntro />
          <button type="button" className="locale-switch mono" onClick={() => setLocale(locale === "fr" ? "en" : "fr")} >
            <span className="sr-only">{locale === "fr" ? "Switch to English : " : "Passer en français : "}</span><span data-current={locale === "fr"}>FR</span><span aria-hidden="true">/</span><span data-current={locale === "en"}>EN</span>
          </button>

          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger asChild>
              <button type="button" className="menu-trigger" data-mobile-menu-trigger aria-label={locale === "fr" ? "Ouvrir le menu" : "Open menu"} aria-expanded={menuOpen}>
                <Menu aria-hidden="true" />
              </button>
            </DialogTrigger>
            <DialogContent
              ref={menu}
              className="navigation-dialog"
              onOpenAutoFocus={(event) => {
                event.preventDefault();
                requestAnimationFrame(() => menu.current?.querySelector<HTMLAnchorElement>("nav a")?.focus());
              }}
              onCloseAutoFocus={(event) => {
                const target = menuTarget.current;
                if (!target) return;
                event.preventDefault();
                menuTarget.current = null;
                requestAnimationFrame(() => document.getElementById(target)?.focus({ preventScroll: true }));
              }}
            >
              <div className="navigation-dialog__intro">
                <DialogTitle className="wordmark">LOWKYZ<span aria-hidden="true">/</span></DialogTitle>
                <DialogDescription>{locale === "fr" ? "Choisir une destination" : "Choose a destination"}</DialogDescription>
              </div>
              <nav aria-label={locale === "fr" ? "Navigation mobile" : "Mobile navigation"}>
                {primaryChapters.map(({ id, label }, index) => (
                  <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined} onClick={() => {
                    menuTarget.current = id;
                    setMenuOpen(false);
                  }}>
                    <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                    <strong>{label[locale]}</strong>
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </nav>
              <div className="navigation-dialog__bottom">
                <div className="navigation-dialog__modes" role="group" aria-label={locale === "fr" ? "Mode de présentation" : "Presentation mode"}>
                  <button type="button" aria-pressed={mode === "recruiter"} onClick={() => setMode("recruiter")}>{locale === "fr" ? "Recruteur" : "Recruiter"}<small>{locale === "fr" ? "Lecture directe" : "Direct overview"}</small></button>
                  <button type="button" aria-pressed={mode === "explore"} onClick={() => setMode("explore")}>Explore<small>{locale === "fr" ? "Expérience interactive" : "Interactive experience"}</small></button>
                </div>
                <div className="navigation-dialog__secondary">
                  <a href="#profil" aria-current={activeSection === "profil" ? "location" : undefined} onClick={() => { menuTarget.current = "profil"; setMenuOpen(false); }}>{chapters[0].label[locale]}</a>
                  <a href="#education" aria-current={activeSection === "education" ? "location" : undefined} onClick={() => { menuTarget.current = "education"; setMenuOpen(false); }}>{chapters[4].label[locale]}</a>
                  <a href={profile.cv} download="CV-Hassan-Haddane.pdf">CV <ArrowDownToLine aria-hidden="true" /></a>
                </div>
                <div className="navigation-dialog__controls">
                  <button type="button" className="signal-masthead__command" onClick={openCommand}><Search aria-hidden="true" />{locale === "fr" ? "Rechercher" : "Search"}<kbd>⌘ K</kbd></button>
                  <button type="button" className="theme-switch theme-switch-mobile" onClick={toggleTheme} aria-label={themeLabel}><ThemeIcon aria-hidden="true" /><span>{themeLabel}</span></button>
                  <button type="button" className="navigation-dialog__motion" onClick={toggleMotion} disabled={systemReduced} aria-pressed={motion}>{systemReduced ? (locale === "fr" ? "Mouvement réduit (système)" : "Reduced motion (system)") : motion ? (locale === "fr" ? "Réduire le mouvement" : "Reduce motion") : (locale === "fr" ? "Activer le mouvement" : "Enable motion")}</button>
                  <ReplayIntro mobile onReplay={() => setMenuOpen(false)} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <ChapterRail />
    </>
  );
}

function ChapterRail() {
  const activeSection = useActiveSection();
  const { locale } = usePreferences();
  const index = Math.max(0, chapters.findIndex((chapter) => chapter.id === activeSection));
  const chapter = chapters[index];

  return (
    <nav className="chapter-rail clarity-chapter-indicator" aria-label={locale === "fr" ? "Section actuelle" : "Current section"}>
      <a href={`#${chapter.id}`} aria-current="location">
        <span className="mono">{String(index + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}</span>
        <strong>{chapter.label[locale]}</strong>
        <i aria-hidden="true" style={{ "--chapter-progress": `${((index + 1) / chapters.length) * 100}%` } as CSSProperties} />
      </a>
    </nav>
  );
}

"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Menu, Moon, Sun } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useActiveSection, usePreferences } from "./preferences";
import { CreativeAction } from "@/components/ui/creative-action";
import { ReplayIntro, SoundToggle } from "@/components/intro/intro-controls";

const chapters = [
  { id: "profil", index: "01", label: { fr: "Accueil", en: "Home" } },
  { id: "projets", index: "02", label: { fr: "Projets", en: "Projects" } },
  { id: "experience", index: "03", label: { fr: "Expériences", en: "Experience" } },
  { id: "stack", index: "04", label: { fr: "Compétences", en: "Skills" } },
  { id: "education", index: "05", label: { fr: "Formation", en: "Education" } },
  { id: "about", index: "06", label: { fr: "À propos", en: "About" } },
  { id: "contact", index: "07", label: { fr: "Contact", en: "Contact" } },
] as const;

export function Navigation() {
  const { locale, setLocale, theme, toggleTheme } = usePreferences();
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
        if (header.current) header.current.dataset.floating = String(scrollY > 80);
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

  return (
    <>
      <a className="skip-link" href="#main">
        {locale === "fr" ? "Aller au contenu" : "Skip to content"}
      </a>
      <header ref={header} className="site-masthead clarity-masthead">
        <a className="wordmark" href="#profil" aria-label="LOWKYZ — Hassan Haddane">
          <b>LOWKYZ</b><span aria-hidden="true">/</span>
        </a>

        <nav className="masthead-links" aria-label={locale === "fr" ? "Navigation principale" : "Main navigation"}>
          {chapters.map(({ id, label }) => (
            <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined}>
              {label[locale]}
            </a>
          ))}
        </nav>

        <div className="masthead-utilities">
          <CreativeAction className="masthead-cta" variant="text" href="#contact" label={locale === "fr" ? "Échanger" : "Get in touch"} />
          <button
            type="button"
            className="theme-switch theme-switch-desktop"
            onClick={toggleTheme}
            aria-label={themeLabel}
            title={themeLabel}
          >
            <ThemeIcon aria-hidden="true" />
            <span>{themeLabel}</span>
          </button>
          <SoundToggle />
          <ReplayIntro />
          <button className="locale-switch mono" onClick={() => setLocale(locale === "fr" ? "en" : "fr")}>
            <span data-current={locale === "fr"}>FR</span>
            <span aria-hidden="true">/</span>
            <span data-current={locale === "en"}>EN</span>
            <span className="sr-only">{locale === "fr" ? "Switch to English" : "Passer en français"}</span>
          </button>

          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger asChild>
              <button className="menu-trigger" data-mobile-menu-trigger aria-label={locale === "fr" ? "Ouvrir le menu" : "Open menu"}>
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
              <DialogTitle className="wordmark">LOWKYZ/</DialogTitle>
              <DialogDescription>{locale === "fr" ? "Choisissez une section." : "Choose a section."}</DialogDescription>
              <nav aria-label={locale === "fr" ? "Navigation mobile" : "Mobile navigation"}>
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
                  </a>
                ))}
              </nav>
              <button
                type="button"
                className="theme-switch theme-switch-mobile"
                onClick={toggleTheme}
                aria-label={themeLabel}
              >
                <ThemeIcon aria-hidden="true" />
                <span>{themeLabel}</span>
              </button>
              <ReplayIntro mobile onReplay={() => setMenuOpen(false)} />
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
        <span className="mono">{chapter.index} / 07</span>
        <strong>{chapter.label[locale]}</strong>
        <i aria-hidden="true" style={{ "--chapter-progress": `${((index + 1) / chapters.length) * 100}%` } as CSSProperties} />
      </a>
    </nav>
  );
}

"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Menu, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Wordmark } from "@/components/ui/wordmark";
import { chapters } from "@/lib/experience-copy";
import { profile } from "@/lib/portfolio-data";
import { ReplayIntro } from "@/components/intro/intro-controls";
import { useActiveSection, useCommand, usePreferences } from "./preferences";

export function Navigation() {
  const { locale, motion, toggleMotion, systemReduced } = usePreferences();
  const { setCommandOpen } = useCommand();
  const activeSection = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);
  const destination = useRef<string | null>(null);
  return (
    <>
      <a className="skip-link" href="#main">
        {locale === "fr" ? "Aller au contenu" : "Skip to content"}
      </a>
      <header className="site-masthead">
        <a
          className="brand"
          href="#profil"
          aria-label="LOWKYZ — Hassan Haddane"
        >
          <Wordmark />
          <span className="brand-dot" />
        </a>
        <nav
          className="masthead-links"
          aria-label={
            locale === "fr" ? "Navigation principale" : "Main navigation"
          }
        >
          {chapters.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={activeSection === id ? "location" : undefined}
            >
              {label[locale]}
            </a>
          ))}
        </nav>
        <div className="masthead-utilities">
          <button
            className="icon-control search-trigger"
            data-command-trigger
            onClick={() => setCommandOpen(true)}
            aria-label={
              locale === "fr" ? "Rechercher (Ctrl K)" : "Search (Ctrl K)"
            }
          >
            <Search aria-hidden="true" />
          </button>
          <a
            className="locale-switch mono"
            href={`/${locale === "fr" ? "en" : "fr"}${activeSection === "profil" ? "" : `#${activeSection}`}`}
            hrefLang={locale === "fr" ? "en" : "fr"}
            lang={locale === "fr" ? "en" : "fr"}
            aria-label={
              locale === "fr"
                ? "FR / EN — Switch to English"
                : "EN / FR — Passer en français"
            }
          >
            {locale.toUpperCase()}
            <span aria-hidden="true"> / {locale === "fr" ? "EN" : "FR"}</span>
          </a>
          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger asChild>
              <button
                className="icon-control menu-trigger"
                data-mobile-menu-trigger
                aria-label={locale === "fr" ? "Ouvrir le menu" : "Open menu"}
                aria-expanded={menuOpen}
              >
                <Menu aria-hidden="true" />
              </button>
            </DialogTrigger>
            <DialogContent
              className="navigation-dialog"
              onCloseAutoFocus={(event) => {
                if (!destination.current) return;
                event.preventDefault();
                const id = destination.current;
                destination.current = null;
                requestAnimationFrame(() => {
                  const target = document.getElementById(id);
                  target?.scrollIntoView();
                  target?.focus({ preventScroll: true });
                });
              }}
            >
              <DialogTitle>LOWKYZ</DialogTitle>
              <DialogDescription>
                {locale === "fr"
                  ? "Choisir une destination"
                  : "Choose a destination"}
              </DialogDescription>
              <nav
                aria-label={
                  locale === "fr" ? "Navigation mobile" : "Mobile navigation"
                }
              >
                {chapters.map(({ id, label }, index) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    aria-current={activeSection === id ? "location" : undefined}
                    onClick={() => {
                      destination.current = id;
                      setMenuOpen(false);
                    }}
                  >
                    <span className="mono">0{index + 1}</span>
                    {label[locale]}
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </nav>
              <div className="menu-secondary">
                <a href={profile.cv} download="CV-Hassan-Haddane.pdf">
                  {locale === "fr"
                    ? "Télécharger mon CV"
                    : "Download my résumé"}
                  <ArrowUpRight aria-hidden="true" />
                </a>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    requestAnimationFrame(() => setCommandOpen(true));
                  }}
                >
                  {locale === "fr" ? "Rechercher" : "Search"}
                  <Search aria-hidden="true" />
                </button>
                <button
                  onClick={toggleMotion}
                  disabled={systemReduced}
                  aria-pressed={!motion}
                >
                  {systemReduced
                    ? locale === "fr"
                      ? "Mouvement réduit (système)"
                      : "Reduced motion (system)"
                    : motion
                      ? locale === "fr"
                        ? "Réduire les animations"
                        : "Reduce motion"
                      : locale === "fr"
                        ? "Activer les animations"
                        : "Enable motion"}
                </button>
                <ReplayIntro mobile onReplay={() => setMenuOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>
    </>
  );
}

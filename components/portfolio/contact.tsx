"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUp,
  ArrowUpRight,
  Check,
  Copy,
} from "lucide-react";
import { usePreferences } from "@/components/system/preferences";
import { Wordmark } from "@/components/ui/wordmark";
import { experienceCopy as words } from "@/lib/experience-copy";
import { profile } from "@/lib/portfolio-data";

export function Contact() {
  const { locale, motion, systemReduced, toggleMotion } = usePreferences();
  const [copyStatus, setCopyStatus] = useState<"copied" | "error" | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopyStatus(null), 3000);
  }
  return (
    <>
      <section
        id="contact"
        data-section
        tabIndex={-1}
        className="contact-section section-shell section-space"
        aria-labelledby="contact-title"
      >
        <div className="contact-top mono">
          <span>05 / CONTACT</span>
          <span>CODE × RHYTHM × CRAFT</span>
        </div>
        <div className="contact-composition">
          <h2 id="contact-title">{words.contactTitle[locale]}</h2>
          <div className="contact-note">
            <p>{words.contactIntro[locale]}</p>
            <span className="mono">
              {profile.location[locale]}
              <br />
              {profile.mobility[locale]}
            </span>
          </div>
        </div>
        <div className="contact-email-row">
          <a href={`mailto:${profile.email}`} className="contact-email">
            {profile.email}
            <ArrowUpRight aria-hidden="true" />
          </a>
          <button
            className="icon-control"
            onClick={copyEmail}
            aria-label={
              locale === "fr" ? "Copier l’adresse email" : "Copy email address"
            }
          >
            {copyStatus === "copied" ? (
              <Check aria-hidden="true" />
            ) : (
              <Copy aria-hidden="true" />
            )}
          </button>
        </div>
        <p className="copy-status" role="status">
          {copyStatus === "copied"
            ? locale === "fr"
              ? "Adresse copiée"
              : "Email copied"
            : copyStatus === "error"
              ? locale === "fr"
                ? "Copie impossible. L’adresse reste accessible via le lien email."
                : "Could not copy. Use the email link above."
              : ""}
        </p>
        <nav
          className="contact-links"
          aria-label={
            locale === "fr" ? "Liens professionnels" : "Professional links"
          }
        >
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a href={profile.cv} download="CV-Hassan-Haddane.pdf">
            {locale === "fr" ? "Télécharger mon CV" : "Download my résumé"}
            <ArrowDownToLine aria-hidden="true" />
          </a>
        </nav>
      </section>
      <footer className="site-footer section-shell">
        <a
          className="brand"
          href="#profil"
          aria-label="LOWKYZ — Accueil / Home"
        >
          <Wordmark />
        </a>
        <span className="mono">© 2026 · HASSAN HADDANE</span>
        <div className="footer-tools">
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
                  ? "Réduire le mouvement"
                  : "Reduce motion"
                : locale === "fr"
                  ? "Activer le mouvement"
                  : "Enable motion"}
          </button>
          <a
            className="icon-control"
            href="#profil"
            aria-label={locale === "fr" ? "Retour en haut" : "Back to top"}
          >
            <ArrowUp aria-hidden="true" />
          </a>
        </div>
      </footer>
    </>
  );
}

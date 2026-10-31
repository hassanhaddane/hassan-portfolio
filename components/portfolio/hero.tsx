"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  Phone,
} from "lucide-react";
import { copy, profile } from "@/lib/portfolio-data";
import { usePreferences } from "@/components/system/preferences";
import { CreativeAction } from "@/components/ui/creative-action";
import { ChapterIdentity } from "./narrative";

function IdentityWord({ word, offset }: { word: string; offset: number }) {
  return (
    <span className="identity-word" aria-hidden="true">
      {word.split("").map((letter, i) => (
        <span className="letter-mask" key={i}>
          <span style={{ "--letter": i + offset } as CSSProperties}>
            {letter}
          </span>
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const { locale } = usePreferences();
  const [entry, setEntry] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);

  useEffect(() => {
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      matchMedia("(max-width: 700px)").matches
    )
      return;
    try {
      const saved = JSON.parse(
        localStorage.getItem("lowkyz.preferences.v1") || "{}",
      );
      if (saved.motion === false || sessionStorage.getItem("lowkyz.intro.v2"))
        return;
    } catch {
      /* A blocked store must never block the interface. */
    }
    setEntry(true);
    const timer = window.setTimeout(() => {
      setEntry(false);
      try {
        sessionStorage.setItem("lowkyz.intro.v2", "seen");
      } catch {
        /* Optional session memory. */
      }
    }, 850);
    return () => clearTimeout(timer);
  }, []);

  useEffect(
    () => () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    },
    [],
  );

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setEmailCopied(true);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setEmailCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  return (
    <section
      id="profil"
      data-section
      tabIndex={-1}
      className="hero-stage"
      data-entry={entry}
      aria-labelledby="hero-title"
    >
      {entry && (
        <div className="entry-signature mono" aria-hidden="true">
          LOWKYZ<span>/</span>
          <small>{locale === "fr" ? "chargement" : "loading"}</small>
        </div>
      )}

      <div className="hero-meta">
        <ChapterIdentity
          index="01"
          kind="now"
          compact
          category={{ fr: "ACCUEIL", en: "HOME" }}
          title={{ fr: "PROFIL PROFESSIONNEL", en: "PROFESSIONAL PROFILE" }}
        />
      </div>

      <div className="identity-composition">
        <h1 id="hero-title" className="identity-title" aria-label="Hassan Haddane">
          <IdentityWord word="HASSAN" offset={0} />{" "}
          <IdentityWord word="HADDANE" offset={4} />
        </h1>
        <div className="identity-experience">
          <strong>
            {String(profile.experienceYearsMinimum).padStart(2, "0")}<span>+</span>
          </strong>
          <span className="mono">
            {locale === "fr" ? "ans d’expérience professionnelle" : "years of professional experience"}
          </span>
        </div>
      </div>

      <div className="hero-professional-deck">
        <div className="hero-professional-summary">
          <div className="hero-role-block">
            <span className="mono">{locale === "fr" ? "POSTE" : "ROLE"}</span>
            <h2>
              {profile.role[locale]}
            </h2>
            <p className="hero-credential mono">{profile.educationLevel[locale]}</p>
            <p className="hero-core-stack">
              <span>React · Next.js · TypeScript</span>
              <span>Python · FastAPI</span>
            </p>
          </div>
          <a
            className="hero-opportunity"
            href={`mailto:${profile.email}?subject=${encodeURIComponent(
              locale === "fr" ? "Échange professionnel" : "Professional enquiry",
            )}`}
            data-cursor="CONTACT"
          >
            <span className="hero-opportunity-status mono">
              <i aria-hidden="true" />
              {locale === "fr" ? "OUVERT AUX ÉCHANGES" : "OPEN TO CONVERSATION"}
            </span>
            <strong>Full-Stack / Front-End</strong>
            <small>
              {profile.location[locale]} · {profile.mobility[locale]}
            </small>
          </a>
        </div>

        <div className="hero-contact-module">
          <span className="hero-contact-label mono">
            {locale === "fr" ? "CONTACT DIRECT" : "DIRECT CONTACT"}
          </span>
          <div className="hero-primary-actions">
            <CreativeAction variant="primary" data-cursor="VIEW" href="#projets" label={locale === "fr" ? "Voir mon travail" : "View my work"} />
            <CreativeAction variant="secondary" data-cursor="OPEN" href={`mailto:${profile.email}`} label={locale === "fr" ? "Me contacter" : "Contact me"} icon={<Mail aria-hidden="true" />} />
          </div>

          <div
            className="hero-contact-rail"
            aria-label={locale === "fr" ? "Contact direct" : "Direct contact"}
          >
            <button
              type="button"
              data-cursor="COPY"
              aria-label={
                locale === "fr"
                  ? `Copier l’adresse email ${profile.email}`
                  : `Copy email address ${profile.email}`
              }
              onClick={copyEmail}
            >
              <span className="mono">EMAIL</span>
              <strong>
                {emailCopied
                  ? locale === "fr"
                    ? "Email copié"
                    : "Email copied"
                  : profile.email}
              </strong>
              {emailCopied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
            </button>
            <a data-cursor="CALL" href={`tel:${profile.phoneHref}`}>
              <span className="mono">TEL</span>
              <strong>{profile.phone}</strong>
              <Phone aria-hidden="true" />
            </a>
            <a
              data-cursor="OPEN"
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="mono">LINKEDIN</span>
              <strong>/hassanhaddane</strong>
              <ArrowUpRight aria-hidden="true" />
            </a>
            <a
              data-cursor="DOWNLOAD"
              href={profile.cv}
              download="CV-Hassan-Haddane.pdf"
            >
              <span className="mono">CV</span>
              <strong>{locale === "fr" ? "Télécharger" : "Download"}</strong>
              <ArrowDownToLine aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div
        className="hero-copy-toast"
        data-visible={emailCopied}
        role="status"
        aria-live="polite"
      >
        {emailCopied && (
          <>
            <Check aria-hidden="true" /> {copy.copied[locale]}
          </>
        )}
      </div>
    </section>
  );
}

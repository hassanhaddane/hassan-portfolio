"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown, ArrowDownToLine, ArrowUpRight, Check, Copy } from "lucide-react";
import { copy, profile } from "@/lib/portfolio-data";
import { subscribeMotionFrame } from "@/lib/motion-runtime";
import { setFieldSignal, useFieldSignal, type Technology } from "@/lib/field-signal";
import { usePreferences } from "@/components/system/preferences";
import { useIntro } from "@/components/intro/intro-context";
import { CreativeAction } from "@/components/ui/creative-action";

function IdentityWord({ word, offset }: { word: string; offset: number }) {
  return (
    <span className="signal-hero__word" aria-hidden="true">
      {word.split("").map((letter, index) => (
        <span className="signal-hero__letter-mask" key={index}>
          <span style={{ "--letter": index + offset } as CSSProperties}>{letter}</span>
        </span>
      ))}
    </span>
  );
}

function HeroTechnology({ technology }: { technology: Technology }) {
  const activeTechnology = useFieldSignal();
  const activate = () => setFieldSignal(technology);
  const clear = () => setFieldSignal(null);

  return (
    <button
      type="button"
      className="signal-hero__technology"
      aria-pressed={activeTechnology === technology}
      onPointerEnter={activate}
      onPointerLeave={clear}
      onFocus={activate}
      onBlur={clear}
      onClick={activate}
    >
      {technology}
    </button>
  );
}

export function Hero() {
  const { locale, expressiveMotion: motion } = usePreferences();
  const { phase } = useIntro();
  const [entry, setEntry] = useState(true);
  useEffect(() => {
    if (phase === "transition") { setEntry(false); return; }
    if (phase !== "off") { setEntry(true); return; }
    const timer = window.setTimeout(() => setEntry(false), 1000);
    return () => clearTimeout(timer);
  }, [phase]);
  const [emailCopied, setEmailCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
  }, []);

  useEffect(() => {
    if (!motion) return;
    const hero = document.getElementById("profil");
    const unsubscribe = subscribeMotionFrame((frame) => {
      if (!hero || (!frame.scrolled && !frame.resized)) return;
      hero.style.setProperty("--hero-scroll-y", `${Math.min(1, frame.scrollY / frame.height) * 18}px`);
    });
    return () => {
      unsubscribe();
      hero?.style.removeProperty("--hero-scroll-y");
    };
  }, [motion]);

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
    <section id="profil" data-entry={entry} data-section tabIndex={-1} className="signal-hero" aria-labelledby="hero-title">
      <div className="signal-hero__technical-grid motion-parallax" data-motion-parallax="0.2" aria-hidden="true" />
      <div className="signal-hero__topline mono">
        <span>LOWKYZ <i aria-hidden="true">/</i> HASSAN HADDANE</span>
        <span>{locale === "fr" ? "DÉVELOPPEMENT · INTERFACES · SON" : "DEVELOPMENT · INTERFACES · SOUND"}</span>
      </div>

      <div className="signal-hero__composition">
        <div className="signal-hero__main">
          <div className="signal-hero__eyebrow mono">
            <span className="signal-hero__pulse" aria-hidden="true" />
            PORTFOLIO / 2026
          </div>
          <h1 id="hero-title" className="signal-hero__name" aria-label={profile.name}>
            <IdentityWord word="HASSAN" offset={0} />
            <IdentityWord word="HADDANE" offset={6} />
          </h1>
          <div className="signal-hero__role-line">
            <span className="signal-hero__role-mark" aria-hidden="true" />
            <h2>{profile.role[locale]}</h2>
            <span className="signal-hero__creative-note mono">
              {locale === "fr" ? "INGÉNIERIE + SENS CRÉATIF" : "ENGINEERING + CREATIVE INSTINCT"}
            </span>
          </div>
          <p className="signal-hero__statement">
            {locale === "fr"
              ? "Je conçois et développe des expériences numériques qui ont du caractère."
              : "I design and build digital experiences with a point of view."}
          </p>
          <p className="signal-hero__explanation">
            {locale === "fr"
              ? "Des interfaces aux API, je relie précision technique et attention à l’expérience."
              : "From interfaces to APIs, I bring technical precision and care for the experience together."}
          </p>
          <div className="signal-hero__actions">
            <CreativeAction className="magnetic" variant="primary" href="#projets" label={locale === "fr" ? "Découvrir mes projets" : "Explore my work"} data-cursor="WORK" />
            <CreativeAction className="magnetic" variant="secondary" href={profile.cv} download="CV-Hassan-Haddane.pdf" label={copy.download[locale]} icon={<ArrowDownToLine aria-hidden="true" />} data-cursor="CV" />
            <a className="signal-hero__contact-link" href="#contact" data-cursor="CONTACT">
              {locale === "fr" ? "Me contacter" : "Get in touch"}<ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="signal-hero__aside">
          <div className="signal-hero__signal-caption mono" aria-hidden="true">
            <span>LOWKYZ / SIGNAL 001</span>
            <i />
          </div>
          <div className="signal-hero__facts" aria-label={locale === "fr" ? "Profil en bref" : "Profile at a glance"}>
            <div><strong>{profile.experienceYearsMinimum}+</strong><span>{locale === "fr" ? "ans d’expérience professionnelle" : "years of professional experience"}</span></div>
            <div><strong>BAC+5</strong><span>{locale === "fr" ? "ingénierie informatique" : "computer engineering"}</span></div>
            <div><strong>RENNES</strong><span>France</span></div>
          </div>
          <div className="signal-hero__stack">
            <span className="mono">{locale === "fr" ? "TECHNOLOGIES CLÉS" : "CORE TECHNOLOGIES"}</span>
            <div>
              <HeroTechnology technology="React" />
              <HeroTechnology technology="Next.js" />
              <HeroTechnology technology="TypeScript" />
              <HeroTechnology technology="Python" />
              <HeroTechnology technology="FastAPI" />
            </div>
          </div>
        </div>
      </div>

      <div className="signal-hero__base">
        <a className="signal-hero__availability" href={`mailto:${profile.email}?subject=${encodeURIComponent(locale === "fr" ? "Échange professionnel" : "Professional enquiry")}`}>
          <i aria-hidden="true" />
          <span>{locale === "fr" ? "Ouvert aux échanges professionnels" : "Open to professional conversations"}</span>
        </a>
        <button className="signal-hero__email" type="button" onClick={copyEmail} aria-label={locale === "fr" ? `Copier l’adresse email ${profile.email}` : `Copy email address ${profile.email}`}>
          <span className="mono">EMAIL</span>
          <strong>{emailCopied ? copy.copied[locale] : profile.email}</strong>
          {emailCopied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        </button>
        <a className="signal-hero__scroll" href="#greecheck">
          <span className="mono">{locale === "fr" ? "DÉFILER POUR EXPLORER" : "SCROLL TO EXPLORE"}</span>
          <ArrowDown aria-hidden="true" />
        </a>
      </div>
      <div className="sr-only" role="status" aria-live="polite">{emailCopied ? copy.copied[locale] : ""}</div>
    </section>
  );
}

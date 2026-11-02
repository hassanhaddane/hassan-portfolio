"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownToLine, ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react";
import { usePreferences } from "@/components/system/preferences";
import { CreativeAction } from "@/components/ui/creative-action";
import { subscribeMotionFrame } from "@/lib/motion-runtime";
import { contactStory } from "@/lib/personal-data";
import { profile } from "@/lib/portfolio-data";
import { ChapterIdentity } from "./narrative";

type CopyStatus = "copied" | "error" | null;

export function ContactV2() {
  const { locale, expressiveMotion: motion } = usePreferences();
  const section = useRef<HTMLElement>(null);
  const emailAction = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<number | null>(null);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>(null);

  useEffect(() => {
    const root = section.current;
    const action = emailAction.current;
    if (!root || !action || !motion) return;
    let previousStrength = -1;
    const emit = (strength: number, x: number, y: number) => {
      if (Math.abs(previousStrength - strength) < 0.01 && strength === 0) return;
      previousStrength = strength;
      root.style.setProperty("--contact-v2-x", `${((x + 1) * 50).toFixed(2)}%`);
      root.style.setProperty("--contact-v2-y", `${((y + 1) * 50).toFixed(2)}%`);
      root.style.setProperty("--contact-v2-strength", strength.toFixed(3));
      dispatchEvent(new CustomEvent("lowkyz:contact-attract", { detail: { strength, x, y } }));
    };
    const unsubscribe = subscribeMotionFrame((frame) => {
      if (!frame.pointerChanged && !frame.scrolled && !frame.resized) return;
      const bounds = root.getBoundingClientRect();
      if (!frame.pointerInside || frame.pointerType !== "mouse" || bounds.bottom < 0 || bounds.top > frame.height) {
        emit(0, 0, 0);
        return;
      }
      const target = action.getBoundingClientRect();
      const closestX = Math.max(target.left, Math.min(frame.pointerX, target.right));
      const closestY = Math.max(target.top, Math.min(frame.pointerY, target.bottom));
      const distance = Math.hypot(frame.pointerX - closestX, frame.pointerY - closestY);
      const strength = Math.max(0, Math.min(1, 1 - distance / 460));
      emit(strength, frame.pointerX / frame.width * 2 - 1, frame.pointerY / frame.height * 2 - 1);
    });
    return () => {
      unsubscribe();
      dispatchEvent(new CustomEvent("lowkyz:contact-attract", { detail: { strength: 0, x: 0, y: 0 } }));
      root.style.removeProperty("--contact-v2-x");
      root.style.removeProperty("--contact-v2-y");
      root.style.removeProperty("--contact-v2-strength");
    };
  }, [motion]);

  useEffect(() => () => {
    if (copyTimer.current !== null) clearTimeout(copyTimer.current);
  }, []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
    if (copyTimer.current !== null) clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopyStatus(null), 3000);
  }

  const heading = contactStory.title[locale];
  const words = locale === "fr" ? ["CONSTRUISONS", "LA SUITE."] : ["LET’S BUILD", "WHAT’S NEXT."];

  return (
    <>
      <section id="contact" ref={section} data-section tabIndex={-1} className="clarity-section section-shell section-space contact-v2" aria-labelledby="contact-title">
        <div className="contact-v2-top"><ChapterIdentity index="08" kind="contact" category={{ fr: "CONTACT", en: "CONTACT" }} title={{ fr: "PROCHAINE ÉTAPE", en: "NEXT STEP" }} /><span className="mono">LOWKYZ / HASSAN HADDANE</span></div>
        <div className="contact-v2-body">
          <div className="contact-v2-intro">
            <span className="mono contact-v2-availability"><i aria-hidden="true" />{locale === "fr" ? "OUVERT AUX ÉCHANGES PROFESSIONNELS" : "OPEN TO PROFESSIONAL CONVERSATIONS"}</span>
            <h2 id="contact-title" className="contact-v2-title reveal" data-reveal="mask" aria-label={heading}>{words.map((word) => <span key={word}>{word}</span>)}</h2>
            <p>{contactStory.introduction[locale]}</p>
          </div>
          <div className="contact-v2-actions" ref={emailAction}>
            <CreativeAction variant="primary" className="contact-v2-primary magnetic" href={`mailto:${profile.email}`} label={locale === "fr" ? "M’envoyer un email" : "Send me an email"} data-cursor="EMAIL" />
            <button className="contact-v2-copy" type="button" onClick={copyEmail} aria-label={locale === "fr" ? `Copier ${profile.email}` : `Copy ${profile.email}`}>
              <span>{profile.email}</span>{copyStatus === "copied" ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
            </button>
            <span className="contact-v2-copy-feedback" role="status" aria-live="polite">{copyStatus === "copied" ? (locale === "fr" ? "Adresse copiée" : "Email copied") : copyStatus === "error" ? (locale === "fr" ? "Copie impossible. Utilisez le lien email." : "Could not copy. Use the email link.") : ""}</span>
          </div>
        </div>
        <div className="contact-v2-bottom">
          <span className="mono">{profile.location[locale].toUpperCase()}</span>
          <nav aria-label={locale === "fr" ? "Liens professionnels" : "Professional links"}>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">GITHUB <ArrowUpRight aria-hidden="true" /></a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LINKEDIN <ArrowUpRight aria-hidden="true" /></a>
            <a href={profile.cv} download="CV-Hassan-Haddane.pdf">{locale === "fr" ? "TÉLÉCHARGER LE CV" : "DOWNLOAD RÉSUMÉ"} <ArrowDownToLine aria-hidden="true" /></a>
          </nav>
        </div>
        <svg className="contact-v2-signal" viewBox="0 0 1440 240" preserveAspectRatio="none" aria-hidden="true"><path d="M0 130 C180 130 180 40 360 130 S540 220 720 130 S900 40 1080 130 S1260 130 1440 130" /><circle cx="360" cy="130" r="4" /><circle cx="720" cy="130" r="4" /><circle cx="1080" cy="130" r="4" /></svg>
      </section>
      <footer className="clarity-footer section-shell"><strong>LOWKYZ / HASSAN HADDANE</strong><span className="mono">© 2026</span><a href="#profil" aria-label={locale === "fr" ? "Retour en haut" : "Back to top"}>{locale === "fr" ? "Retour en haut" : "Back to top"}<ArrowUp aria-hidden="true" /></a></footer>
    </>
  );
}

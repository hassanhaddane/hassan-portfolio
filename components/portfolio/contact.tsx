"use client";

import { ArrowDownToLine, ArrowUp, ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { usePreferences } from "@/components/system/preferences";
import { profile } from "@/lib/portfolio-data";
import { ChapterIdentity } from "./narrative";

export function Contact() {
  const { locale, motion } = usePreferences();
  const sectionRef = useRef<HTMLElement>(null);
  const actionsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const actions = actionsRef.current;
    if (!section || !actions || !motion || !matchMedia("(pointer: fine) and (hover: hover)").matches) return;
    let frame = 0;
    const emit = (strength: number, x = 0, y = 0) => {
      section.style.setProperty("--contact-attraction", strength.toFixed(3));
      section.style.setProperty("--contact-x", `${((x + 1) / 2) * 100}%`);
      section.style.setProperty("--contact-y", `${((y + 1) / 2) * 100}%`);
      window.dispatchEvent(new CustomEvent("lowkyz:contact-attract", { detail: { strength, x, y } }));
    };
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const sectionBounds = section.getBoundingClientRect();
        if (sectionBounds.bottom < 0 || sectionBounds.top > innerHeight) {
          emit(0);
          return;
        }
        const bounds = actions.getBoundingClientRect();
        const closestX = Math.max(bounds.left, Math.min(event.clientX, bounds.right));
        const closestY = Math.max(bounds.top, Math.min(event.clientY, bounds.bottom));
        const distance = Math.hypot(event.clientX - closestX, event.clientY - closestY);
        const strength = Math.max(0, Math.min(1, 1 - distance / 420));
        emit(strength, (event.clientX / innerWidth) * 2 - 1, (event.clientY / innerHeight) * 2 - 1);
      });
    };
    const reset = () => emit(0);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      reset();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", reset);
    };
  }, [motion]);

  return (
    <>
      <section
        id="contact"
        ref={sectionRef}
        data-section
        tabIndex={-1}
        className="clarity-section clarity-contact section-shell section-space"
        aria-labelledby="contact-title"
      >
        <header className="clarity-section-header reveal" data-reveal="mask">
          <ChapterIdentity
            index="07"
            kind="contact"
            category={{ fr: "CONTACT", en: "CONTACT" }}
            title={{ fr: "COORDONNÉES", en: "CONTACT DETAILS" }}
          />
          <div className="clarity-section-heading">
            <span className="mono clarity-availability"><i aria-hidden="true" />{locale === "fr" ? "ÉCHANGEONS" : "LET’S TALK"}</span>
            <h2 id="contact-title">
              {locale === "fr"
                ? "VOUS RECRUTEZ UN DÉVELOPPEUR FULL-STACK OU FRONT-END ?"
                : "ARE YOU HIRING A FULL-STACK OR FRONT-END DEVELOPER?"}
            </h2>
            <p>
              {locale === "fr"
                ? `Basé à ${profile.location.fr}, mobile en ${profile.mobility.fr}. Échangeons sur votre projet.`
                : `Based in ${profile.location.en}, open to opportunities in ${profile.mobility.en}. Let’s discuss your project.`}
            </p>
          </div>
        </header>

        <nav ref={actionsRef} className="clarity-contact-actions reveal" data-reveal="line" aria-label={locale === "fr" ? "Moyens de contact" : "Contact options"}>
          <a href={`mailto:${profile.email}`} data-cursor="OPEN">
            <span className="mono">EMAIL</span>
            <strong>{locale === "fr" ? "M’envoyer un email" : "Send me an email"}</strong>
            <small>{profile.email}</small>
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a href={`tel:${profile.phoneHref}`} data-cursor="CALL">
            <span className="mono">{locale === "fr" ? "TÉLÉPHONE" : "PHONE"}</span>
            <strong>{profile.phone}</strong>
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" data-cursor="OPEN">
            <span className="mono">LINKEDIN</span>
            <strong>/hassanhaddane</strong>
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" data-cursor="OPEN">
            <span className="mono">GITHUB</span>
            <strong>/hassanhaddane</strong>
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a href={profile.cv} download="CV-Hassan-Haddane.pdf" data-cursor="DOWNLOAD">
            <span className="mono">CV</span>
            <strong>{locale === "fr" ? "Télécharger mon CV" : "Download my résumé"}</strong>
            <ArrowDownToLine aria-hidden="true" />
          </a>
        </nav>

        <dl className="clarity-contact-facts">
          <div><dt>{locale === "fr" ? "Localisation" : "Location"}</dt><dd>{profile.location[locale]}</dd></div>
          <div><dt>{locale === "fr" ? "Mobilité" : "Mobility"}</dt><dd>{profile.mobility[locale]}</dd></div>
          <div><dt>{locale === "fr" ? "Permis" : "Driving licence"}</dt><dd>{profile.drivingLicence}</dd></div>
        </dl>
      </section>

      <footer className="clarity-footer section-shell">
        <strong>LOWKYZ / HASSAN HADDANE</strong>
        <span className="mono">© 2026</span>
        <a href="#profil" aria-label={locale === "fr" ? "Retour en haut" : "Back to top"}>
          {locale === "fr" ? "Retour en haut" : "Back to top"}
          <ArrowUp aria-hidden="true" />
        </a>
      </footer>
    </>
  );
}

"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowDownToLine, ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react";
import { copy, profile } from "@/lib/portfolio-data";
import { usePreferences } from "@/components/system/preferences";
import { ChapterIdentity } from "./narrative";

type CopyStatus = "idle" | "copied" | "error";

export function Contact() {
  const { locale, motion, toggleMotion, systemReduced } = usePreferences();
  const [status, setStatus] = useState<CopyStatus>("idle");
  const [easterEgg, setEasterEgg] = useState(false);
  const emailTarget = useRef<HTMLButtonElement>(null);
  const statusTimer = useRef<number | null>(null);
  const attractionFrame = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => () => {
    if (statusTimer.current) window.clearTimeout(statusTimer.current);
    cancelAnimationFrame(attractionFrame.current);
  }, []);

  const emitAttraction = (strength: number) => {
    const target = emailTarget.current;
    if (!target) return;
    const box = target.getBoundingClientRect();
    window.dispatchEvent(new CustomEvent("lowkyz:contact-attract", {
      detail: {
        strength,
        x: ((box.left + box.width / 2) / innerWidth) * 2 - 1,
        y: ((box.top + box.height / 2) / innerHeight) * 2 - 1,
      },
    }));
    document.documentElement.style.setProperty("--contact-force", strength.toFixed(3));
    document.documentElement.style.setProperty(
      "--contact-target-x",
      `${(box.left + box.width / 2 - innerWidth / 2) * strength * 0.34}px`,
    );
    document.documentElement.style.setProperty(
      "--contact-target-y",
      `${(box.top + box.height / 2 - innerHeight / 2) * strength * 0.24}px`,
    );
    document.documentElement.style.setProperty(
      "--contact-scale",
      (0.25 - strength * 0.13).toFixed(3),
    );
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!motion || event.pointerType !== "mouse" || !emailTarget.current) return;
    pointer.current = { x: event.clientX, y: event.clientY };
    if (attractionFrame.current) return;
    attractionFrame.current = requestAnimationFrame(() => {
      attractionFrame.current = 0;
      if (!emailTarget.current) return;
      const box = emailTarget.current.getBoundingClientRect();
      const x = Math.max(box.left, Math.min(pointer.current.x, box.right));
      const y = Math.max(box.top, Math.min(pointer.current.y, box.bottom));
      const distance = Math.hypot(pointer.current.x - x, pointer.current.y - y);
      emitAttraction(Math.max(0, 1 - distance / 440));
    });
  };

  const resetAttraction = () => {
    cancelAnimationFrame(attractionFrame.current);
    attractionFrame.current = 0;
    emitAttraction(0);
  };

  async function copyAddress() {
    if (statusTimer.current) window.clearTimeout(statusTimer.current);
    try {
      await navigator.clipboard.writeText(profile.email);
      setStatus("copied");
      emitAttraction(1);
    } catch {
      setStatus("error");
    }
    statusTimer.current = window.setTimeout(() => {
      setStatus("idle");
      emitAttraction(0);
    }, 2200);
  }

  const facts = [
    [locale === "fr" ? "LOCALISATION" : "LOCATION", "Rennes"],
    [locale === "fr" ? "MOBILITÉ" : "MOBILITY", locale === "fr" ? "Bretagne / Nantes" : "Brittany / Nantes"],
    [locale === "fr" ? "PERMIS" : "LICENCE", "B"],
    ["STATUS", locale === "fr" ? "RECHERCHE CDI" : "OPEN TO PERMANENT ROLES"],
  ];

  return (
    <>
      <section
        id="contact"
        data-section
        tabIndex={-1}
        className="contact-system section-shell section-space"
        aria-labelledby="contact-title"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetAttraction}
      >
        <ChapterIdentity
          index="06"
          kind="contact"
          category={{ fr: "CONTACT", en: "CONTACT" }}
          title={{ fr: "TRAVAILLONS ENSEMBLE", en: "LET’S WORK TOGETHER" }}
        />
        <div className="contact-system-top mono">
          <span>{locale === "fr" ? "DERNIER CHAPITRE" : "FINAL CHAPTER"}</span>
          <span className="availability"><i aria-hidden="true" />{locale === "fr" ? "DISPONIBLE POUR UN CDI" : "OPEN TO A PERMANENT ROLE"}</span>
          <span>RENNES · FRANCE</span>
        </div>

        <div className="contact-candidate-summary" aria-label={locale === "fr" ? "Résumé de candidature" : "Candidate summary"}>
          <strong>HASSAN HADDANE</strong>
          <span>{locale === "fr" ? "RECHERCHE CDI" : "OPEN TO PERMANENT ROLES"}</span>
          <span>FULL-STACK / FRONT-END</span>
          <small>RENNES — {locale === "fr" ? "BRETAGNE" : "BRITTANY"} / NANTES</small>
        </div>

        <h2 id="contact-title" className="contact-system-title reveal" data-reveal="converge">
          {locale === "fr" ? (
            <>CONSTRUISONS<br /><span>QUELQUE CHOSE <br className="contact-mobile-break" />D’UTILE.</span></>
          ) : (
            <>LET’S BUILD<br /><span>SOMETHING <br className="contact-mobile-break" />USEFUL.</span></>
          )}
        </h2>

        <nav className="contact-action-rail" aria-label={locale === "fr" ? "Actions de contact" : "Contact actions"}>
          <a href={`mailto:${profile.email}`} data-cursor="OPEN">
            <span className="mono">EMAIL</span>
            <strong>{locale === "fr" ? "ME CONTACTER" : "CONTACT ME"}</strong>
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" data-cursor="OPEN">
            <span className="mono">LINKEDIN</span>
            <strong>LinkedIn</strong>
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a href={`tel:${profile.phoneHref}`} data-cursor="CALL">
            <span className="mono">TEL</span>
            <strong>{profile.phone}</strong>
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a href={profile.cv} download="CV-Hassan-Haddane.pdf" data-cursor="DOWNLOAD">
            <span className="mono">CV</span>
            <strong>{locale === "fr" ? "TÉLÉCHARGER" : "DOWNLOAD"}</strong>
            <ArrowDownToLine aria-hidden="true" />
          </a>
        </nav>

        <div className="contact-system-grid">
          <div className="contact-primary">
            <p>
              {locale === "fr"
                ? "Un produit à faire avancer, une interface à rendre plus claire ou une équipe à rejoindre ? Échangeons directement."
                : "A product to move forward, an interface to make clearer or a team to join? Let’s talk directly."}
            </p>
            <button
              ref={emailTarget}
              type="button"
              className="contact-email-target magnetic"
              data-cursor="COPY"
              data-status={status}
              onClick={copyAddress}
            >
              <span className="mono">
                {status === "copied"
                  ? locale === "fr" ? "EMAIL COPIÉ" : "EMAIL COPIED"
                  : locale === "fr" ? "ME CONTACTER · COPIER L’EMAIL" : "CONTACT ME · COPY EMAIL"}
              </span>
              <strong>{profile.email}</strong>
              <span className="contact-copy-icon" aria-hidden="true">
                {status === "copied" ? <Check /> : <Copy />}
              </span>
            </button>
            <div className="contact-direct-actions">
              <a data-cursor="OPEN" href={`mailto:${profile.email}`}>
                {locale === "fr" ? "Écrire un email" : "Write an email"}
                <ArrowUpRight aria-hidden="true" />
              </a>
              <a href={`tel:${profile.phoneHref}`}>{profile.phone}</a>
            </div>
          </div>

          <div className="contact-data">
            <dl>
              {facts.map(([label, value], index) => (
                <div key={label}>
                  <dt className="mono"><span>0{index + 1}</span>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <div className="contact-destinations">
              <a data-cursor="OPEN" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn <ArrowUpRight aria-hidden="true" />
              </a>
              <a data-cursor="OPEN" href={profile.github} target="_blank" rel="noopener noreferrer">
                GitHub <ArrowUpRight aria-hidden="true" />
              </a>
              <a className="download-cv" data-cursor="OPEN" href={profile.cv} download="CV-Hassan-Haddane.pdf">
                <span>DOWNLOAD CV</span>
                <small>PDF · {locale === "fr" ? "VERSION ACTUELLE" : "CURRENT VERSION"}</small>
                <ArrowDownToLine aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="copy-toast" data-visible={status !== "idle"} data-status={status} role="status" aria-live="polite" aria-atomic="true">
          <span aria-hidden="true">{status === "copied" ? "✓" : "!"}</span>
          {status === "copied" ? copy.copied[locale] : status === "error" ? copy.copyFailed[locale] : ""}
        </div>
      </section>

      <footer className="site-footer section-shell">
        <button
          className="footer-brand"
          aria-label={locale === "fr" ? "Révéler la signature LOWKYZ" : "Reveal the LOWKYZ signature"}
          onClick={() => setEasterEgg((value) => !value)}
        >
          LOWKYZ <span aria-hidden="true">✳</span>
        </button>
        <span className="footer-credit mono">
          {easterEgg
            ? locale === "fr" ? "LE DÉTAIL, DU CODE AU MIX." : "DETAIL, FROM CODE TO THE MIX."
            : "HASSAN HADDANE © 2026"}
        </span>
        <button className="footer-motion mono" onClick={toggleMotion} disabled={systemReduced}>
          {systemReduced ? copy.motionSystem[locale] : motion ? copy.motionOn[locale] : copy.motionOff[locale]}
          <i className={motion ? "motion-dot on" : "motion-dot"} aria-hidden="true" />
        </button>
        <a className="back-top" href="#profil" aria-label={locale === "fr" ? "Retour en haut" : "Back to top"}>
          <ArrowUp aria-hidden="true" />
        </a>
      </footer>
    </>
  );
}

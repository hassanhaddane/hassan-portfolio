"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownToLine, ArrowUpRight, Check, Copy, Mail, Phone } from "lucide-react";
import { copy, profile } from "@/lib/portfolio-data";
import { usePreferences } from "./preferences";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ProfessionalContactDock() {
  const { locale } = usePreferences();
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  }

  const statusLabel = locale === "fr" ? "RECHERCHE CDI" : "OPEN TO PERMANENT ROLES";

  return (
    <>
      <aside className="desktop-contact-dock" aria-label={locale === "fr" ? "Contact permanent" : "Persistent contact"}>
        <a className="desktop-contact-handle" href="#contact">
          <i aria-hidden="true" />
          <span>HIRE / CONTACT</span>
        </a>
        <div className="desktop-contact-panel">
          <header>
            <span className="mono">{statusLabel}</span>
            <strong>Hassan Haddane</strong>
          </header>
          <button
            type="button"
            data-cursor="COPY"
            aria-label={locale === "fr" ? "Copier l’adresse email" : "Copy email address"}
            onClick={copyEmail}
          >
            {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
            <span>{copied ? copy.copied[locale] : profile.email}</span>
          </button>
          <a data-cursor="CALL" href={`tel:${profile.phoneHref}`}>
            <Phone aria-hidden="true" /> {profile.phone}
          </a>
          <a data-cursor="OPEN" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            <ArrowUpRight aria-hidden="true" /> LinkedIn
          </a>
          <a className="desktop-contact-cv" data-cursor="DOWNLOAD" href={profile.cv} download="CV-Hassan-Haddane.pdf">
            <ArrowDownToLine aria-hidden="true" /> {locale === "fr" ? "Télécharger le CV" : "Download résumé"}
          </a>
        </div>
      </aside>

      <Dialog>
        <DialogTrigger asChild>
          <button className="mobile-contact-trigger" type="button">
            <i aria-hidden="true" />
            CONTACT
          </button>
        </DialogTrigger>
        <DialogContent className="mobile-contact-sheet">
          <DialogHeader>
            <span className="mono">LOWKYZ / DIRECT CHANNELS</span>
            <DialogTitle>{locale === "fr" ? "Me contacter" : "Contact me"}</DialogTitle>
            <DialogDescription>
              {statusLabel} · Rennes · {locale === "fr" ? "Bretagne / Nantes" : "Brittany / Nantes"}
            </DialogDescription>
          </DialogHeader>
          <div className="mobile-contact-actions">
            <a href={`mailto:${profile.email}`}>
              <Mail aria-hidden="true" />
              <span><small>EMAIL</small><strong>{profile.email}</strong></span>
              <ArrowUpRight aria-hidden="true" />
            </a>
            <button type="button" onClick={copyEmail}>
              {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              <span><small>{locale === "fr" ? "COPIER" : "COPY"}</small><strong>{copied ? copy.copied[locale] : profile.email}</strong></span>
            </button>
            <a href={`tel:${profile.phoneHref}`}>
              <Phone aria-hidden="true" />
              <span><small>TEL</small><strong>{profile.phone}</strong></span>
              <ArrowUpRight aria-hidden="true" />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              <ArrowUpRight aria-hidden="true" />
              <span><small>LINKEDIN</small><strong>LinkedIn</strong></span>
              <ArrowUpRight aria-hidden="true" />
            </a>
            <a href={profile.cv} download="CV-Hassan-Haddane.pdf">
              <ArrowDownToLine aria-hidden="true" />
              <span><small>CV</small><strong>{locale === "fr" ? "Télécharger" : "Download"}</strong></span>
              <ArrowDownToLine aria-hidden="true" />
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

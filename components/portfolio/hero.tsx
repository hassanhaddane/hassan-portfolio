import type { Locale } from "@/lib/portfolio-data";
import { ArrowDown, ArrowUpRight, Waves } from "lucide-react";
import { CreativeAction } from "@/components/ui/creative-action";
import { copy, profile } from "@/lib/portfolio-data";
import { SignalArtwork } from "./signal-artwork";

export function Hero({ locale }: { locale: Locale }) {
  return (
    <section
      id="profil"
      data-section
      tabIndex={-1}
      className="hero section-shell"
      aria-labelledby="hero-title"
    >
      <div className="hero-identity">
        <h1
          id="hero-title"
          aria-label={`${profile.alias} — ${profile.name}, ${profile.role[locale]}`}
        >
          <span>LOWKYZ</span>
        </h1>
        <p className="hero-subtitle mono">— THE LIVING SIGNAL</p>
      </div>
      <div className="hero-statement">
        <h2>
          {locale === "fr" ? (
            <>
              La précision du code.
              <br />
              L’instinct du son.
            </>
          ) : (
            <>
              The precision of code.
              <br />
              The instinct of sound.
            </>
          )}
        </h2>
        <p className="hero-description">
          {locale === "fr"
            ? "Je développe des produits solides et des expériences numériques qui ont du rythme."
            : "I build thoughtful software and digital experiences with a sense of rhythm."}
        </p>
        <div className="hero-actions">
          <CreativeAction
            href="#projets"
            label={locale === "fr" ? "Explorer les projets" : "Explore my work"}
            icon={<ArrowDown aria-hidden="true" />}
          />
          <a
            className="text-link"
            href={profile.cv}
            download="CV-Hassan-Haddane.pdf"
          >
            {copy.download[locale]}
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="hero-art">
        <SignalArtwork />
        <button
          className="signal-modulate"
          data-signal-modulate
          disabled
          type="button"
        >
          <span>
            {locale === "fr" ? "Changer de fréquence" : "Change frequency"}
          </span>
          <Waves aria-hidden="true" />
        </button>
        <div className="hero-signature">
          <strong>
            HASSAN HADDANE <span>/</span>
          </strong>
          <span className="mono">{profile.role[locale]}</span>
        </div>
      </div>
      <div className="hero-bottom mono">
        <span>{profile.experience[locale]}</span>
        <span>{profile.location[locale]}</span>
        <a href="#contact" className="text-link">
          {locale === "fr"
            ? "Parlons de votre projet"
            : "Let’s talk about your project"}
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

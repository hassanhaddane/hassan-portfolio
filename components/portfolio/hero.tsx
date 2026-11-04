"use client";

import Image from "next/image";
import { RhythmScore } from "@/components/ui/frequency-score";
import { ArrowDown, ArrowDownToLine, ArrowUpRight } from "lucide-react";
import { usePreferences } from "@/components/system/preferences";
import { CreativeAction } from "@/components/ui/creative-action";
import { experienceCopy as words } from "@/lib/experience-copy";
import { copy, profile } from "@/lib/portfolio-data";

export function Hero() {
  const { locale } = usePreferences();
  return (
    <section
      id="profil"
      data-section
      tabIndex={-1}
      className="hero section-shell"
      aria-labelledby="hero-title"
    >
      <div className="hero-topline mono">
        <span>
          HASSAN HADDANE <span className="text-muted">/ LOWKYZ</span>
        </span>
        <span>CODE × RHYTHM × CRAFT</span>
      </div>
      <div className="hero-composition">
        <div className="hero-main">
          <h1
            id="hero-title"
            aria-label={`${profile.name} — ${profile.role[locale]}. ${words.heroCreative[locale]}`}
          >
            <span className="hero-role hero-arrival">
              {words.heroTitle[locale]}
            </span>
            <span className="hero-title-line">
              <span>
                FULL-STACK<span className="hero-period">.</span>
              </span>
            </span>
            <span className="hero-creative hero-title-line">
              <span>{words.heroCreative[locale]}</span>
            </span>
          </h1>
          <p className="hero-description">{words.heroDescription[locale]}</p>
          <div className="hero-actions">
            <CreativeAction
              className="magnetic"
              href="#projets"
              label={
                locale === "fr" ? "Explorer mes projets" : "Explore my work"
              }
              icon={<ArrowDown aria-hidden="true" />}
            />
            <CreativeAction
              variant="secondary"
              href={profile.cv}
              download="CV-Hassan-Haddane.pdf"
              label={copy.download[locale]}
              icon={<ArrowDownToLine aria-hidden="true" />}
            />
            <a className="text-link hero-contact" href="#contact">
              {locale === "fr" ? "Me contacter" : "Contact me"}
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>
        <aside
          className="hero-aside"
          aria-label={
            locale === "fr" ? "Profil en bref" : "Profile at a glance"
          }
        >
          <div className="hero-art" data-motion-parallax="0.18">
            <div className="score-caption mono">
              <span>COMPOSITION / 001</span>
              <span>H × L</span>
            </div>
            <RhythmScore />
            <div className="score-caption mono">
              <span>PRECISION</span>
              <span>FEELING</span>
            </div>
          </div>
          <div className="hero-profile">
            <Image
              src="/profile/hassan-haddane-cv.png"
              alt="Hassan Haddane"
              width={306}
              height={306}
              priority
              sizes="80px"
            />
            <div>
              <strong>Hassan Haddane</strong>
              <span>{profile.location[locale]}</span>
              <a className="text-link" href="#about">
                {locale === "fr" ? "Derrière le code" : "Behind the code"}
                <ArrowUpRight aria-hidden="true" />
              </a>
            </div>
          </div>
          <p className="hero-specialty">{words.heroSpecialty[locale]}</p>
        </aside>
      </div>
      <div className="hero-bottom">
        <span className="mono">{profile.experience[locale]}</span>
        <span className="hero-mobility">
          {locale === "fr" ? "Mobilité" : "Open to opportunities in"} —{" "}
          {profile.mobility[locale]}
        </span>
        <a className="mono text-link" href="#projets">
          SELECTED WORK <ArrowDown aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

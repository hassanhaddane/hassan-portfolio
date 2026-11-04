"use client";

import Image from "next/image";
import { ArrowDown, ArrowDownToLine, ArrowUpRight } from "lucide-react";
import { usePreferences } from "@/components/system/preferences";
import { CreativeAction } from "@/components/ui/creative-action";
import { experienceCopy as words } from "@/lib/experience-copy";
import { copy, profile } from "@/lib/portfolio-data";

const bars = Array.from({ length: 61 }, (_, i) => {
  const envelope = Math.sin((i / 60) * Math.PI);
  return {
    x: 20 + i * 6,
    height: Math.max(
      6,
      7 +
        Math.pow(envelope, 1.5) *
          (45 + Math.sin(i * 0.63) * 35 + Math.cos(i * 0.27) * 40),
    ),
  };
});

/** A deterministic score, not a playback control or simulated audio visualizer. */
export function RhythmScore({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`rhythm-score ${className}`}
      viewBox="0 0 400 220"
      fill="none"
      aria-hidden="true"
    >
      <path d="M20 110H380M200 15V205" className="score-axis" />
      {[35, 65, 95].map((r) => (
        <ellipse
          key={r}
          cx="200"
          cy="110"
          rx={r * 1.8}
          ry={r}
          className="score-orbit"
        />
      ))}
      <g className="score-bars">
        {bars.map(({ x, height }, i) => (
          <path
            key={i}
            d={`M${x} ${(110 - height / 2).toFixed(2)}v${height.toFixed(2)}`}
          />
        ))}
      </g>
      <path
        d="M20 20v8m0-4h8M380 20v8m-8-4h8M20 192v8m0-4h8M380 192v8m-8-4h8"
        className="score-register"
      />
    </svg>
  );
}

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
            <span className="hero-role">{words.heroTitle[locale]}</span>
            <span>
              FULL-STACK<span className="hero-period">.</span>
            </span>
            <span className="hero-creative">{words.heroCreative[locale]}</span>
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

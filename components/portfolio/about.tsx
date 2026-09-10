"use client";

import { useState, type PointerEvent as ReactPointerEvent } from "react";
import { usePreferences } from "@/components/system/preferences";
import { ChapterIdentity, StoryBridge } from "./narrative";

const profileRegisters = [
  { key: "LOCATION", fr: "Rennes, France", en: "Rennes, France" },
  { key: "LANGUAGES", fr: "FR / AR / EN", en: "FR / AR / EN" },
  { key: "EXPERIENCE", fr: "03+ ANS", en: "03+ YEARS" },
  { key: "ROLE", fr: "FULL-STACK", en: "FULL-STACK" },
  { key: "FOCUS", fr: "PRODUIT / FRONT-END", en: "PRODUCT / FRONT-END" },
  { key: "SIDE SIGNAL", fr: "MUSIQUE / AUDIO", en: "MUSIC / AUDIO" },
] as const;

const focusSignals = [
  { fr: "Interfaces web", en: "Web interfaces" },
  { fr: "Produits", en: "Products" },
  { fr: "Full-Stack", en: "Full-Stack" },
  { fr: "Qualité", en: "Quality" },
  { fr: "DevOps", en: "DevOps" },
  { fr: "IA raisonnée", en: "Considered AI use" },
] as const;

const personalSignals = [
  { fr: "Football", en: "Football", kind: "physical" },
  { fr: "Musculation", en: "Strength training", kind: "physical" },
  { fr: "Histoire", en: "History", kind: "context" },
  { fr: "Géopolitique", en: "Geopolitics", kind: "context" },
  { fr: "Enregistrement", en: "Recording", kind: "audio" },
  { fr: "Mixage", en: "Mixing", kind: "audio" },
  { fr: "Mastering", en: "Mastering", kind: "audio" },
] as const;

type PersonalSignalKind = (typeof personalSignals)[number]["kind"];

const signalMeaning = {
  physical: { fr: "ÉNERGIE · DISCIPLINE", en: "ENERGY · DISCIPLINE" },
  context: { fr: "CONTEXTE · SYSTÈMES", en: "CONTEXT · SYSTEMS" },
  audio: { fr: "ÉCOUTE · PRÉCISION", en: "LISTENING · PRECISION" },
} as const;

function AudioSignal() {
  return (
    <svg viewBox="0 0 900 96" preserveAspectRatio="none" aria-hidden="true">
      <path className="about-audio-axis" d="M0 48H900" />
      <path
        className="about-audio-wave"
        d="M0 48 C45 48 49 23 77 23 S112 71 142 48 S185 11 222 48 S266 76 301 48 S351 28 382 48 S432 91 471 48 S520 14 556 48 S596 66 630 48 S682 31 716 48 S760 81 797 48 S851 36 900 48"
      />
      {[77, 222, 301, 471, 556, 716, 797].map((x, index) => (
        <circle key={x} cx={x} cy={[23, 48, 48, 48, 48, 48, 48][index]} r="2.5" />
      ))}
    </svg>
  );
}

export function About() {
  const { locale } = usePreferences();
  const [activeSignal, setActiveSignal] = useState<PersonalSignalKind | null>(null);

  const activateWithPointer = (
    event: ReactPointerEvent<HTMLButtonElement>,
    kind: PersonalSignalKind,
  ) => {
    if (event.pointerType === "mouse") setActiveSignal(kind);
  };

  return (
    <section
      id="about"
      data-section
      tabIndex={-1}
      className="personal-system section-shell section-space"
      aria-labelledby="about-title"
    >
      <ChapterIdentity
        index="05"
        kind="about"
        category={{ fr: "À PROPOS", en: "ABOUT" }}
        title={{ fr: "AU-DELÀ DU CODE", en: "BEYOND CODE" }}
      />
      <div className="personal-system-top mono">
        <span>PERSONAL SYSTEM PROFILE</span>
        <span>{locale === "fr" ? "DONNÉES HUMAINES · VÉRIFIÉES" : "HUMAN DATA · VERIFIED"}</span>
        <span>48.1173° N · 01.6778° W</span>
      </div>

      <div className="personal-system-identity">
        <div>
          <span className="personal-system-kicker mono">LOWKYZ // HASSAN HADDANE</span>
          <h2 id="about-title" className="reveal" data-reveal="human">
            <span>FULL-STACK</span>
            <span>{locale === "fr" ? "CÔTÉ HUMAIN." : "HUMAN SIDE."}</span>
          </h2>
        </div>
        <div className="personal-system-intro">
          <p>
            {locale === "fr"
              ? "Développeur Web Full-Stack basé à Rennes, avec plus de trois ans d’expérience professionnelle. Je conçois des interfaces et les systèmes qui les rendent utiles, lisibles et fiables."
              : "Full-Stack Web Developer based in Rennes, with more than three years of professional experience. I build interfaces and the systems that make them useful, clear and reliable."}
          </p>
          <p>
            {locale === "fr"
              ? "J’utilise les outils IA pour accélérer l’exploration, le prototypage et le diagnostic. Le typage, les tests, la revue critique et les contrôles fonctionnels valident le résultat."
              : "I use AI tools to accelerate exploration, prototyping and diagnosis. Types, tests, critical review and functional checks validate the result."}
          </p>
        </div>
      </div>

      <div className="personal-registers">
        <dl>
          {profileRegisters.map((register, index) => (
            <div key={register.key}>
              <dt className="mono">
                <span>0{index + 1}</span>
                {register.key}
              </dt>
              <dd>{register[locale]}</dd>
              <i aria-hidden="true" />
            </div>
          ))}
        </dl>
        <div className="personal-focus" aria-label={locale === "fr" ? "Orientations du profil" : "Profile focus"}>
          <span className="mono">{locale === "fr" ? "ORIENTATION" : "ORIENTATION"}</span>
          <div>
            {focusSignals.map((signal, index) => (
              <span key={signal.en}>
                <i className="mono">{String(index + 1).padStart(2, "0")}</i>
                {signal[locale]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="personal-side-signal" data-interest={activeSignal ?? "idle"}>
        <div className="side-signal-heading">
          <span className="mono">SIDE SIGNAL / AUDIO</span>
          <p>
            {locale === "fr"
              ? "Même attention au détail dans une interface et dans un mix."
              : "The same attention to detail in an interface and in a mix."}
          </p>
          <small className="interest-readout mono" aria-live="polite">
            {activeSignal
              ? signalMeaning[activeSignal][locale]
              : locale === "fr"
                ? "SÉLECTIONNEZ UN SIGNAL HUMAIN"
                : "SELECT A HUMAN SIGNAL"}
          </small>
        </div>
        <AudioSignal />
        <ul aria-label={locale === "fr" ? "Centres d’intérêt" : "Interests"}>
          {personalSignals.map((signal, index) => (
            <li key={signal.en} style={{ "--interest-index": index } as React.CSSProperties}>
              <button
                type="button"
                data-signal={signal.kind}
                aria-pressed={activeSignal === signal.kind}
                onPointerEnter={(event) => activateWithPointer(event, signal.kind)}
                onPointerLeave={(event) => {
                  if (event.pointerType === "mouse") setActiveSignal(null);
                }}
                onFocus={() => setActiveSignal(signal.kind)}
                onBlur={() => setActiveSignal(null)}
                onClick={() =>
                  setActiveSignal((current) =>
                    current === signal.kind ? null : signal.kind,
                  )
                }
              >
                {signal[locale]}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <StoryBridge href="#contact" next={{ fr: "TRAVAILLONS ENSEMBLE", en: "LET’S WORK TOGETHER" }}>
        {{
          fr: "Derrière la stack, il y a une manière de travailler et une personne. Il reste à ouvrir la conversation.",
          en: "Behind the stack is a way of working and a person. The next step is to start a conversation.",
        }}
      </StoryBridge>
    </section>
  );
}

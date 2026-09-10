"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  Network,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { usePreferences } from "@/components/system/preferences";
import {
  aiLoop,
  greeCheck,
  professionalWork,
  storySteps,
  type ProfessionalWork,
} from "@/lib/work-data";
import { setWorkSignal, type WorkSignal } from "@/lib/work-signal";
import {
  ChapterIdentity,
  EntityTypeMarker,
  StoryBridge,
} from "./narrative";

const architectureNodes = [
  { id: "user", label: "USER", meta: "SCAN · SEARCH", x: 8, y: 42 },
  { id: "next", label: "NEXT.JS", meta: "APP ROUTER", x: 30, y: 19 },
  { id: "logic", label: "APPLICATION", meta: "LOGIC", x: 49, y: 42 },
  { id: "off", label: "OPEN FOOD FACTS", meta: "PRODUCT DATA", x: 76, y: 17 },
  { id: "map", label: "MAP", meta: "VIEW LAYER", x: 52, y: 72 },
  { id: "osm", label: "OPENSTREETMAP", meta: "MAP DATA", x: 76, y: 72 },
  { id: "local", label: "LOCAL STATE", meta: "ON DEVICE", x: 29, y: 72 },
  { id: "saved", label: "HISTORY · FAV · LISTS", meta: "PERSISTENCE", x: 6, y: 72 },
] as const;

const architectureEdges = [
  ["user", "next"],
  ["next", "logic"],
  ["logic", "off"],
  ["logic", "map"],
  ["map", "osm"],
  ["logic", "local"],
  ["local", "saved"],
] as const;

function ArchitectureView({ locale }: { locale: "fr" | "en" }) {
  const [active, setActive] = useState("logic");
  const connected = new Set<string>(
    architectureEdges
      .filter(([from, to]) => from === active || to === active)
      .flat(),
  );
  connected.add(active);

  return (
    <div className="work-architecture" aria-label={locale === "fr" ? "Architecture de GreeCheck" : "GreeCheck architecture"}>
      <div className="architecture-grid" aria-hidden="true" />
      <svg className="architecture-lines" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
        {architectureEdges.map(([from, to]) => {
          const a = architectureNodes.find((node) => node.id === from)!;
          const b = architectureNodes.find((node) => node.id === to)!;
          const highlighted = from === active || to === active;
          return (
            <line
              key={`${from}-${to}`}
              x1={a.x * 10 + 80}
              y1={a.y * 5.6 + 36}
              x2={b.x * 10 + 80}
              y2={b.y * 5.6 + 36}
              data-active={highlighted}
            />
          );
        })}
      </svg>
      <div className="architecture-nodes">
        {architectureNodes.map((node) => (
          <button
            type="button"
            key={node.id}
            className="architecture-node"
            style={{ "--node-x": `${node.x}%`, "--node-y": `${node.y}%` } as React.CSSProperties}
            data-active={connected.has(node.id)}
            aria-pressed={active === node.id}
            data-cursor="VIEW"
            onPointerEnter={() => setActive(node.id)}
            onFocus={() => setActive(node.id)}
          >
            <span>{node.label}</span>
            <small>{node.meta}</small>
          </button>
        ))}
      </div>
      <span className="architecture-readout mono">
        <span aria-hidden="true">●</span>{" "}
        {locale === "fr" ? "SURVOLEZ OU FOCALISEZ UN NŒUD" : "HOVER OR FOCUS A NODE"}
      </span>
    </div>
  );
}

function ProductStage({
  active,
  systemView,
  setSystemView,
  locale,
  interactive,
}: {
  active: number;
  systemView: boolean;
  setSystemView: (value: boolean) => void;
  locale: "fr" | "en";
  interactive: boolean;
}) {
  const step = storySteps[active];
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerFrame = useRef<number | null>(null);
  const pointerPosition = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => () => {
    if (pointerFrame.current !== null) cancelAnimationFrame(pointerFrame.current);
  }, []);

  const updatePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactive || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerPosition.current = {
      x: Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width)),
      y: Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height)),
    };
    if (pointerFrame.current !== null) return;
    pointerFrame.current = requestAnimationFrame(() => {
      pointerFrame.current = null;
      const node = stageRef.current;
      if (!node) return;
      const { x, y } = pointerPosition.current;
      node.style.setProperty("--product-x", `${(x - 0.5) * 12}px`);
      node.style.setProperty("--product-y", `${(y - 0.5) * 10}px`);
      node.style.setProperty("--product-image-x", `${(0.5 - x) * 3.84}px`);
      node.style.setProperty("--product-image-y", `${(0.5 - y) * 2.6}px`);
      node.style.setProperty("--product-rx", `${(0.5 - y) * 1.2}deg`);
      node.style.setProperty("--product-ry", `${(x - 0.5) * 1.6}deg`);
    });
  };

  const resetPointer = () => {
    const node = stageRef.current;
    if (!node) return;
    node.style.setProperty("--product-x", "0px");
    node.style.setProperty("--product-y", "0px");
    node.style.setProperty("--product-image-x", "0px");
    node.style.setProperty("--product-image-y", "0px");
    node.style.setProperty("--product-rx", "0deg");
    node.style.setProperty("--product-ry", "0deg");
  };

  const flowSteps = ["SEARCH", "SCAN", "PRODUCT", "COMPARE", "MAP"];
  return (
    <div
      ref={stageRef}
      className="product-stage-wrap"
      data-flow-step={active}
      data-interactive={interactive}
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
    >
      <div className="product-stage-toolbar mono">
        <span>
          <i aria-hidden="true" />
          {systemView
            ? locale === "fr"
              ? "ARCHITECTURE ACTIVE"
              : "ARCHITECTURE ACTIVE"
            : locale === "fr"
              ? "CAPTURE PRODUIT PUBLIQUE"
              : "PUBLIC PRODUCT CAPTURE"}
        </span>
        <div className="stage-mode-switch" aria-label={locale === "fr" ? "Vue du projet" : "Project view"}>
          <button type="button" data-cursor="VIEW" aria-pressed={!systemView} onClick={() => setSystemView(false)}>
            UI
          </button>
          <button type="button" data-cursor="VIEW" aria-pressed={systemView} onClick={() => setSystemView(true)}>
            {locale === "fr" ? "SYSTÈME" : "SYSTEM"}
          </button>
        </div>
      </div>
      <div className="product-stage" data-system={systemView}>
        {systemView ? (
          <ArchitectureView locale={locale} />
        ) : (
          <div className="product-captures" aria-live="polite">
            {storySteps.map((item, index) => (
              <figure
                key={item.id}
                className={`product-capture ${item.format === "mobile" ? "is-mobile" : ""}`}
                data-active={index === active}
                aria-hidden={index !== active}
              >
                <div className="capture-browser-bar" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <b>gree-check.vercel.app/fr</b>
                </div>
                <div className="capture-image">
                  <Image
                    src={item.image}
                    alt={item.imageAlt[locale]}
                    fill
                    sizes="(max-width: 780px) 92vw, 54vw"
                  />
                </div>
              </figure>
            ))}
            <div className="capture-scanline" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="stage-caption mono">
        <span key={`number-${active}`} data-stage-value>{String(active + 1).padStart(2, "0")} / 05</span>
        <span key={`label-${step.id}`} data-stage-value>{step.id.toUpperCase()}</span>
        <span>PUBLIC UI · 2026</span>
      </div>
      <div className="product-data-flow mono" aria-hidden="true">
        <span>SIGNAL / DATA FLOW</span>
        <ol>
          {flowSteps.map((label, index) => (
            <li key={label} data-active={index <= active} data-current={index === active}>
              <i />
              <b>{label}</b>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function AIWorkflow({ locale }: { locale: "fr" | "en" }) {
  return (
    <section id="ai-workflow" className="ai-workflow reveal" aria-labelledby="ai-workflow-title">
      <div className="ai-workflow-heading">
        <span className="section-label mono">AI-AUGMENTED DEVELOPMENT</span>
        <h3 id="ai-workflow-title">
          {locale === "fr"
            ? "L’IA accélère la boucle."
            : "AI accelerates the loop."}
          <br />
          <span>
            {locale === "fr"
              ? "L’ingénierie valide le résultat."
              : "Engineering validates the result."}
          </span>
        </h3>
      </div>
      <ol className="ai-loop">
        {aiLoop.map((stage, index) => (
          <li key={stage.en}>
            <span className="mono">{String(index + 1).padStart(2, "0")}</span>
            <b>{stage[locale]}</b>
            {index < aiLoop.length - 1 && <ArrowDown aria-hidden="true" />}
          </li>
        ))}
      </ol>
      <div className="ai-tool-rail">
        <div>
          <span className="mono">{locale === "fr" ? "OUTILS" : "TOOLS"}</span>
          <strong>CODEX</strong>
          <strong>CLAUDE COWORK</strong>
        </div>
        <p>
          {locale === "fr"
            ? "Exploration technique · prototypage · refactorisation · diagnostic d’anomalies."
            : "Technical exploration · prototyping · refactoring · anomaly diagnosis."}
        </p>
        <p>
          <Check aria-hidden="true" />
          {locale === "fr"
            ? "Suggestions relues, typées, testées et contrôlées fonctionnellement."
            : "Suggestions are reviewed, typed, tested and functionally checked."}
        </p>
      </div>
    </section>
  );
}

function ProfessionalSignal({ kind }: { kind: ProfessionalWork["signal"] }) {
  return (
    <svg className="professional-signal" data-kind={kind} viewBox="0 0 720 220" role="img">
      <title>
        {kind === "audio"
          ? "Représentation abstraite d’un signal d’audiométrie"
          : kind === "breath"
            ? "Représentation abstraite d’un rythme respiratoire"
            : "Représentation abstraite de flux IoT"}
      </title>
      <defs>
        <linearGradient id={`signal-${kind}`} x1="0" x2="1">
          <stop offset="0" stopColor="#2267ff" stopOpacity=".1" />
          <stop offset=".55" stopColor="#5b8cff" />
          <stop offset="1" stopColor="#9dff76" stopOpacity=".22" />
        </linearGradient>
      </defs>
      <path className="signal-axis" d="M0 110H720" />
      {kind === "audio" && (
        <>
          <path className="signal-main" stroke={`url(#signal-${kind})`} d="M0 112 C70 110 78 80 125 82 S190 152 235 106 S320 38 370 111 S455 155 505 93 S590 72 720 111" />
          {[82, 140, 235, 370, 505, 620].map((x, i) => <circle key={x} cx={x} cy={[89, 105, 106, 111, 93, 105][i]} r="4" />)}
        </>
      )}
      {kind === "breath" && (
        <>
          <path className="signal-main" stroke={`url(#signal-${kind})`} d="M0 112 C65 112 74 40 145 40 S225 178 300 178 S385 40 460 40 S540 178 615 178 S680 112 720 112" />
          <path className="signal-ghost" d="M0 112 C90 112 95 68 170 68 S255 151 335 151 S425 69 505 69 S590 146 720 112" />
        </>
      )}
      {kind === "iot" && (
        <>
          {[40, 108, 176].map((y, row) => (
            <path key={y} className="signal-stream" style={{ "--delay": `${row * -0.7}s` } as React.CSSProperties} d={`M0 ${y} C150 ${y} 150 ${110 + (row - 1) * 18} 320 ${110 + (row - 1) * 18} S520 ${y} 720 ${y}`} />
          ))}
          {[90, 320, 555, 680].map((x, i) => <circle key={x} cx={x} cy={[40, 110, 176, 40][i]} r="5" />)}
        </>
      )}
    </svg>
  );
}

function ProfessionalEntry({ work, locale }: { work: ProfessionalWork; locale: "fr" | "en" }) {
  const typeIndex = work.id === "biosency" ? "01" : work.id === "sante" ? "02" : "03";

  return (
    <details
      id={work.id}
      className="professional-entry reveal"
      data-entity-kind="experience"
      data-work-signal={work.id}
      open={work.id === "iaudiogram" ? true : undefined}
    >
      <summary data-cursor="OPEN">
        <span className="professional-index mono">E{typeIndex}</span>
        <span className="professional-name">
          <EntityTypeMarker kind="experience" index={typeIndex} compact />
          <strong>{work.company}</strong>
          {work.product && <small>{work.product}</small>}
        </span>
        <span className="professional-role">
          <strong>{work.role[locale]}</strong>
          <small className="engagement-label mono">{work.engagement[locale]}</small>
        </span>
        <time className="mono">{work.period}</time>
        <span className="professional-open" aria-hidden="true">
          <ChevronDown />
        </span>
      </summary>
      <div className="professional-detail">
        <figure>
          <ProfessionalSignal kind={work.signal} />
          <figcaption className="mono">
            {locale === "fr"
              ? "REPRÉSENTATION ABSTRAITE · AUCUNE DONNÉE PRODUIT"
              : "ABSTRACT REPRESENTATION · NO PRODUCT DATA"}
          </figcaption>
        </figure>
        <div className="professional-proof">
          <p>{work.context[locale]}</p>
          <ul>
            {work.contributions.map((item) => (
              <li key={item.en}>
                <span aria-hidden="true">↳</span>
                {item[locale]}
              </li>
            ))}
          </ul>
          <p className="professional-tools mono">{work.tools.join(" / ")}</p>
        </div>
      </div>
    </details>
  );
}

export function ProfessionalExperience() {
  const { locale } = usePreferences();

  return (
    <section className="professional-work" aria-labelledby="professional-title">
      <header>
        <EntityTypeMarker kind="experience" index="01—03" />
        <span className="section-label mono">
          {locale === "fr"
            ? "EXPÉRIENCES PROFESSIONNELLES · DÉTAILS"
            : "PROFESSIONAL EXPERIENCE · DETAILS"}
        </span>
        <h3 id="professional-title" className="reveal">
          {locale === "fr" ? "CONSTRUIT AVEC DES ÉQUIPES." : "BUILT WITH TEAMS."}
        </h3>
        <p>
          {locale === "fr"
            ? "Les visuels suivants sont abstraits pour respecter la confidentialité des produits."
            : "The following visuals are abstract to protect product confidentiality."}
        </p>
      </header>
      <div className="professional-ledger">
        {professionalWork.map((work) => (
          <ProfessionalEntry key={work.id} work={work} locale={locale} />
        ))}
      </div>
    </section>
  );
}

export function Projects() {
  const { locale, mode, motion } = usePreferences();
  const [activeStep, setActiveStep] = useState(0);
  const [systemView, setSystemView] = useState(false);
  const storyRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const chapters = storyRefs.current.filter(Boolean) as HTMLElement[];
    const workSections = [
      ...document.querySelectorAll<HTMLElement>("[data-work-signal]"),
    ];
    const storyObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        setActiveStep(Number((visible.target as HTMLElement).dataset.storyIndex));
      },
      { rootMargin: "-28% 0px -42% 0px", threshold: [0.1, 0.35, 0.6] },
    );
    const signalObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible)
          setWorkSignal(
            (visible.target as HTMLElement).dataset.workSignal as WorkSignal,
          );
      },
      { rootMargin: "-36% 0px -52% 0px" },
    );
    chapters.forEach((chapter) => storyObserver.observe(chapter));
    workSections.forEach((section) => signalObserver.observe(section));
    return () => {
      storyObserver.disconnect();
      signalObserver.disconnect();
    };
  }, []);

  const goToStep = (index: number) => {
    setSystemView(false);
    storyRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const stageKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1;
    const next = (index + direction + storySteps.length) % storySteps.length;
    goToStep(next);
    document.getElementById(`work-step-${next}`)?.focus({ preventScroll: true });
  };

  return (
    <section id="projets" data-section tabIndex={-1} className="work-system" aria-labelledby="projects-title">
      <header className="work-manifesto section-shell" data-work-signal="greecheck">
        <ChapterIdentity
          index="01"
          kind="project"
          category={{ fr: "PROJET", en: "PROJECT" }}
          title={{ fr: "MES PROJETS", en: "WHAT I BUILD" }}
        />
        <div className="work-manifesto-top mono">
          <span>{locale === "fr" ? "CE QUE JE CONSTRUIS" : "WHAT I BUILD"}</span>
          <span>PROOF &gt; SKILL BADGES</span>
          <span>SELECTED OUTPUT · 2021—2026</span>
        </div>
        <h2 id="projects-title" className="reveal" data-reveal="mask">
          <span>{locale === "fr" ? "DES PRODUITS" : "PRODUCTS"}</span>
          <span>{locale === "fr" ? "QUI PRENNENT" : "THAT MAKE"}</span>
          <span>{locale === "fr" ? "DES DÉCISIONS." : "DECISIONS."}</span>
        </h2>
        <p className="work-manifesto-note">
          {locale === "fr"
            ? "Les technologies prennent leur sens dans les parcours qu’elles rendent possibles."
            : "Technologies matter through the journeys they make possible."}
        </p>
      </header>

      <article id="greecheck" tabIndex={-1} className="featured-system" data-entity-kind="project" data-work-signal="greecheck">
        <header className="featured-heading section-shell">
          <div>
            <EntityTypeMarker kind="project" index="01" />
            <span className="featured-primary-label mono">
              {locale === "fr" ? "PROJET PRINCIPAL" : "FEATURED PROJECT"}
            </span>
            <h3>GREECHECK</h3>
          </div>
          <div className="featured-intro">
            <div className="featured-meta mono">
              <span>{greeCheck.period}</span>
              <span>{greeCheck.kind[locale]}</span>
            </div>
            <p>{greeCheck.description[locale]}</p>
            <a className="featured-link magnetic" data-cursor="OPEN" href={greeCheck.url} target="_blank" rel="noopener noreferrer">
              {locale === "fr" ? "Ouvrir le produit" : "Open the product"}
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </header>

        <div className="story-layout section-shell">
          <div className="story-sticky">
            <ProductStage
              active={activeStep}
              systemView={systemView}
              setSystemView={setSystemView}
              locale={locale}
              interactive={mode === "explore" && motion}
            />
            <nav className="story-index" aria-label={locale === "fr" ? "Étapes du produit" : "Product stages"}>
              {storySteps.map((step, index) => (
                <button
                  id={`work-step-${index}`}
                  type="button"
                  key={step.id}
                  aria-current={index === activeStep ? "step" : undefined}
                  aria-label={`${String(index + 1).padStart(2, "0")} — ${step.title[locale]}`}
                  data-cursor="VIEW"
                  onClick={() => goToStep(index)}
                  onKeyDown={(event) => stageKey(event, index)}
                >
                  <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                  <i aria-hidden="true" />
                  <b>{step.id}</b>
                </button>
              ))}
            </nav>
          </div>
          <div className="story-copy">
            {storySteps.map((step, index) => (
              <section
                key={step.id}
                ref={(element) => {
                  storyRefs.current[index] = element;
                }}
                data-story-index={index}
                className="story-chapter"
                aria-labelledby={`story-${step.id}`}
              >
                <span className="mono">{step.eyebrow[locale]}</span>
                <h4 id={`story-${step.id}`}>{step.title[locale]}</h4>
                <figure className={`story-mobile-capture ${step.format === "mobile" || step.mobileImage ? "is-mobile" : ""}`}>
                  <Image
                    src={step.mobileImage ?? step.image}
                    alt={step.imageAlt[locale]}
                    fill
                    sizes="(max-width: 780px) 92vw, 1px"
                  />
                </figure>
                <p>{step.description[locale]}</p>
                {index === 2 && (
                  <button className="inline-system-link" type="button" data-cursor="VIEW" onClick={() => setSystemView(true)}>
                    <Network aria-hidden="true" />
                    {locale === "fr" ? "Voir le système" : "View system"}
                  </button>
                )}
                {index === 4 && (
                  <dl className="local-facts">
                    {greeCheck.facts.map((fact, factIndex) => (
                      <div key={fact.en}>
                        <dt className="mono">0{factIndex + 1}</dt>
                        <dd>{fact[locale]}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </section>
            ))}
          </div>
        </div>

        <div className="system-evidence section-shell">
          <div className="system-evidence-copy">
            <span className="section-label mono">{locale === "fr" ? "SOUS LE PRODUIT" : "BELOW THE PRODUCT"}</span>
            <h3>{locale === "fr" ? "Des choix d’architecture lisibles." : "Architecture choices you can read."}</h3>
            <p>
              {locale === "fr"
                ? "L’interface reste reliée aux sources, à la logique applicative et à l’état local. La cartographie s’appuie sur OpenStreetMap ; les données produit proviennent d’Open Food Facts."
                : "The interface remains connected to sources, application logic and local state. Mapping uses OpenStreetMap; product data comes from Open Food Facts."}
            </p>
          </div>
          <ArchitectureView locale={locale} />
          <div className="stack-marquee" aria-label={locale === "fr" ? "Technologies de GreeCheck" : "GreeCheck technologies"}>
            {greeCheck.stack.map((technology, index) => (
              <span key={technology}>
                <i className="mono">{String(index + 1).padStart(2, "0")}</i>
                {technology}
              </span>
            ))}
          </div>
        </div>
      </article>
      <div className="section-shell">
        <StoryBridge
          href="#experience"
          next={{ fr: "MES EXPÉRIENCES", en: "MY EXPERIENCE" }}
        >
          {{
            fr: "Pour comprendre comment j’en suis arrivé à ce produit, suivez le parcours construit dans la e-santé.",
            en: "To understand how I arrived at this product, follow the journey I built in digital health.",
          }}
        </StoryBridge>
      </div>
    </section>
  );
}

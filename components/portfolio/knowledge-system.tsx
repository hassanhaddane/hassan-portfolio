"use client";

import {
  ArrowDown,
  ArrowUpRight,
  ChevronDown,
  Network,
  Orbit,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { useActiveSection, usePreferences } from "@/components/system/preferences";
import {
  evidenceNodes,
  knowledgeGroups,
  recruiterGroups,
  timelineEntries,
  type EvidenceId,
  type KnowledgeGroup,
  type TimelineId,
} from "@/lib/knowledge-data";
import {
  setFieldSignal,
  technologies as fieldTechnologies,
  type Technology,
} from "@/lib/field-signal";
import { AIWorkflow, ProfessionalExperience } from "./projects";
import {
  ChapterIdentity,
  EntityTypeMarker,
  StoryBridge,
  type EntityKind,
} from "./narrative";

const allKnowledgeItems = knowledgeGroups.flatMap((group) =>
  group.items.map((item) => ({ ...item, groupId: group.id })),
);

const itemById = new Map(allKnowledgeItems.map((item) => [item.id, item]));
const evidenceById = new Map(evidenceNodes.map((node) => [node.id, node]));
const timelineById = new Map(timelineEntries.map((entry) => [entry.id, entry]));
const journeyEntries = timelineEntries.filter(
  (entry) =>
    entry.id === "biosency" ||
    entry.id === "sante" ||
    entry.id === "iaudiogram" ||
    entry.id === "greecheck",
);
const educationEntry = timelineById.get("epsi")!;

const timelineTypes: Record<Exclude<TimelineId, "epsi">, { kind: EntityKind; index: string }> = {
  biosency: { kind: "experience", index: "01" },
  sante: { kind: "experience", index: "02" },
  iaudiogram: { kind: "experience", index: "03" },
  greecheck: { kind: "project", index: "01" },
};

const getTimelineType = (id: TimelineId): { kind: EntityKind; index: string } =>
  id === "epsi" ? { kind: "education", index: "01" } : timelineTypes[id];

const clusterAnchors: Record<KnowledgeGroup["id"], { x: number; y: number }> = {
  front: { x: 31, y: 18 },
  back: { x: 31, y: 52 },
  data: { x: 31, y: 84 },
  devops: { x: 69, y: 18 },
  quality: { x: 69, y: 52 },
  ai: { x: 69, y: 84 },
};

const ambientRelations: Array<[KnowledgeGroup["id"], EvidenceId]> = [
  ["front", "interface-systems"],
  ["back", "api-design"],
  ["data", "data-layer"],
  ["devops", "delivery"],
  ["quality", "quality-loop"],
  ["ai", "ai-workflow"],
];

const entitySignal: Partial<Record<string, Technology>> = {
  react: "React",
  next: "Next.js",
  typescript: "TypeScript",
  python: "Python",
  fastapi: "FastAPI",
  docker: "Docker",
  "ci-cd": "CI/CD",
  greecheck: "Next.js",
  iaudiogram: "React",
  biosency: "React",
};

function getGraphState(activeId: string) {
  const activeItem = itemById.get(activeId);
  const activeEvidence = evidenceById.get(activeId as EvidenceId);
  const connectedEvidence = new Set<EvidenceId>(activeItem?.relations ?? []);
  if (activeEvidence) connectedEvidence.add(activeEvidence.id);
  const connectedItems = new Set<string>();

  if (activeItem) connectedItems.add(activeItem.id);
  if (activeEvidence) {
    for (const item of allKnowledgeItems) {
      if (item.relations.includes(activeEvidence.id)) connectedItems.add(item.id);
    }
  }

  const connectedGroups = new Set<KnowledgeGroup["id"]>();
  for (const item of allKnowledgeItems) {
    if (connectedItems.has(item.id)) connectedGroups.add(item.groupId);
  }
  if (activeItem) connectedGroups.add(activeItem.groupId);

  return {
    activeItem,
    activeEvidence,
    connectedEvidence,
    connectedItems,
    connectedGroups,
  };
}

function RecruiterStack({
  locale,
  expanded,
  onToggle,
}: {
  locale: "fr" | "en";
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="recruiter-stack" aria-label={locale === "fr" ? "Stack essentielle" : "Core stack"}>
      <div className="recruiter-stack-grid">
        {recruiterGroups.map((group, groupIndex) => (
          <div key={group.label} className="recruiter-stack-group">
            <span className="mono">0{groupIndex + 1} / {group.label}</span>
            <p>
              {group.items.map((item) => (
                <b key={item} translate="no">{item}</b>
              ))}
            </p>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="explore-stack-button magnetic"
        aria-expanded={expanded}
        aria-controls="knowledge-explorer"
        onClick={onToggle}
      >
        <Network aria-hidden="true" />
        <span>{expanded
          ? locale === "fr" ? "Réduire le graphe" : "Close graph"
          : locale === "fr" ? "Explorer ma stack" : "Explore my stack"}</span>
        <ArrowDown aria-hidden="true" />
      </button>
    </div>
  );
}

function GraphReadout({ activeId, locale }: { activeId: string; locale: "fr" | "en" }) {
  const state = getGraphState(activeId);
  const label = state.activeItem?.label ?? state.activeEvidence?.label[locale] ?? activeId;
  const type = state.activeItem
    ? state.activeItem.kind === "technology"
      ? locale === "fr" ? "Technologie" : "Technology"
      : locale === "fr" ? "Pratique" : "Practice"
    : state.activeEvidence?.kind[locale] ?? "Signal";
  const targets = state.activeItem
    ? [...state.connectedEvidence].map((id) => evidenceById.get(id)?.label[locale]).filter(Boolean)
    : [...state.connectedItems].map((id) => itemById.get(id)?.label).filter(Boolean);

  return (
    <div className="graph-readout" aria-live="polite" aria-atomic="true">
      <div>
        <span className="mono">ACTIVE SIGNAL</span>
        <strong translate="no">{label}</strong>
        <small className="mono">{type}</small>
      </div>
      <p>
        <span className="mono">{locale === "fr" ? "CONNEXIONS RÉELLES" : "VERIFIED CONNECTIONS"}</span>
        {targets.length > 0
          ? targets.join(" · ")
          : locale === "fr"
            ? "Parcours de formation EPSI"
            : "EPSI education path"}
      </p>
    </div>
  );
}

function KnowledgeGraph({
  activeId,
  locale,
  onSelect,
}: {
  activeId: string;
  locale: "fr" | "en";
  onSelect: (id: string) => void;
}) {
  const state = getGraphState(activeId);
  const activeItemGroup = state.activeItem?.groupId;
  const selectedEdges = useMemo(() => {
    if (state.activeItem) {
      return state.activeItem.relations.map((target) => [state.activeItem!.groupId, target] as const);
    }
    if (state.activeEvidence) {
      return [...state.connectedGroups].map((groupId) => [groupId, state.activeEvidence!.id] as const);
    }
    return [];
  }, [state.activeEvidence, state.activeItem, state.connectedGroups]);

  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    const nodes = [...document.querySelectorAll<HTMLButtonElement>("#knowledge-explorer [data-graph-node]")];
    const index = nodes.findIndex((node) => node.dataset.graphNode === id);
    if (index < 0) return;
    event.preventDefault();
    const next = event.key === "Home"
      ? 0
      : event.key === "End"
        ? nodes.length - 1
        : (index + (event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1) + nodes.length) % nodes.length;
    nodes[next]?.focus();
  };

  return (
    <div id="knowledge-explorer" className="knowledge-explorer" tabIndex={-1}>
      <div className="graph-toolbar mono">
        <span><i aria-hidden="true" /> SYSTEM ONLINE</span>
        <span>{allKnowledgeItems.length} NODES · VERIFIED CONTEXT ONLY</span>
        <span>ARROWS / TAB / ENTER</span>
      </div>
      <div className="knowledge-canvas">
        <svg className="knowledge-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="knowledge-line" x1="0" x2="1">
              <stop offset="0" stopColor="#3267ff" stopOpacity=".2" />
              <stop offset=".5" stopColor="#7c9cff" />
              <stop offset="1" stopColor="#c4f578" stopOpacity=".65" />
            </linearGradient>
          </defs>
          {ambientRelations.map(([groupId, evidenceId]) => {
            const from = clusterAnchors[groupId];
            const to = evidenceById.get(evidenceId)!;
            return <line key={`${groupId}-${evidenceId}`} className="ambient-edge" x1={from.x} y1={from.y} x2={to.x} y2={to.y} />;
          })}
          {selectedEdges.map(([groupId, evidenceId]) => {
            const from = clusterAnchors[groupId];
            const to = evidenceById.get(evidenceId)!;
            return (
              <g key={`active-${groupId}-${evidenceId}`}>
                <line className="active-edge active-edge-glow" x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
                <line className="active-edge" x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
                <circle className="edge-pulse" cx={to.x} cy={to.y} r=".6" />
              </g>
            );
          })}
          {activeItemGroup ? (
            <circle className="cluster-pulse" cx={clusterAnchors[activeItemGroup].x} cy={clusterAnchors[activeItemGroup].y} r=".8" />
          ) : null}
        </svg>

        {knowledgeGroups.map((group) => (
          <section
            key={group.id}
            className={`knowledge-cluster cluster-${group.id}`}
            data-connected={state.connectedGroups.has(group.id)}
            aria-labelledby={`cluster-${group.id}`}
          >
            <header>
              <span className="mono">{group.code}</span>
              <h3 id={`cluster-${group.id}`}>{group.label}</h3>
              <i aria-hidden="true" />
            </header>
            <div>
              {group.items.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  data-graph-node={item.id}
                  data-selected={state.activeItem?.id === item.id}
                  data-connected={state.connectedItems.has(item.id)}
                  aria-pressed={state.activeItem?.id === item.id}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") onSelect(item.id);
                  }}
                  onFocus={() => onSelect(item.id)}
                  onClick={() => onSelect(item.id)}
                  onKeyDown={(event) => moveFocus(event, item.id)}
                >
                  <span aria-hidden="true" />
                  <b translate="no">{item.label}</b>
                </button>
              ))}
            </div>
          </section>
        ))}

        <div className="evidence-field" aria-label={locale === "fr" ? "Projets, expériences et pratiques" : "Projects, experiences and practices"}>
          {evidenceNodes.map((node) => (
            <button
              type="button"
              key={node.id}
              className="evidence-node"
              style={{ "--node-x": `${node.x}%`, "--node-y": `${node.y}%` } as CSSProperties}
              data-graph-node={node.id}
              data-selected={state.activeEvidence?.id === node.id}
              data-connected={state.connectedEvidence.has(node.id)}
              aria-pressed={state.activeEvidence?.id === node.id}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") onSelect(node.id);
              }}
              onFocus={() => onSelect(node.id)}
              onClick={() => onSelect(node.id)}
              onKeyDown={(event) => moveFocus(event, node.id)}
            >
              <span className="mono">{node.kind[locale]}</span>
              <b>{node.label[locale]}</b>
            </button>
          ))}
        </div>
      </div>
      <GraphReadout activeId={activeId} locale={locale} />
    </div>
  );
}

function MobileKnowledgeExplorer({
  activeId,
  locale,
  onSelect,
}: {
  activeId: string;
  locale: "fr" | "en";
  onSelect: (id: string) => void;
}) {
  const state = getGraphState(activeId);
  return (
    <div className="mobile-knowledge-explorer">
      <GraphReadout activeId={activeId} locale={locale} />
      {knowledgeGroups.map((group, index) => (
        <details key={group.id} className="mobile-knowledge-group" open={index === 0 ? true : undefined}>
          <summary>
            <span className="mono">0{index + 1}</span>
            <strong>{group.label}</strong>
            <span className="mono">{group.items.length} NODES</span>
            <ChevronDown aria-hidden="true" />
          </summary>
          <div>
            {group.items.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-pressed={state.activeItem?.id === item.id}
                data-connected={state.connectedItems.has(item.id)}
                onClick={() => onSelect(item.id)}
              >
                <span aria-hidden="true" />
                <b translate="no">{item.label}</b>
                <small className="mono">{item.relations.length.toString().padStart(2, "0")}</small>
              </button>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

function TimelineReadout({ id, locale }: { id: TimelineId; locale: "fr" | "en" }) {
  const entry = timelineById.get(id)!;
  const type = getTimelineType(id);
  return (
    <aside className="timeline-readout" data-entry={entry.id} data-entity-kind={type.kind} aria-live="polite" aria-atomic="true">
      <EntityTypeMarker kind={type.kind} index={type.index} />
      <header>
        <span className="mono">{entry.kind[locale]}</span>
        <time className="mono">{entry.period}</time>
      </header>
      <h3>{entry.title}</h3>
      {entry.subtitle ? <p className="timeline-product">{entry.subtitle}</p> : null}
      <strong className="timeline-role">
        <span>{entry.role[locale]}</span>
        {entry.engagement ? <small className="engagement-label mono">{entry.engagement[locale]}</small> : null}
      </strong>
      <p>{entry.description[locale]}</p>
      <ul>
        {entry.facts.map((fact) => (
          <li key={fact.en}><span aria-hidden="true">↳</span>{fact[locale]}</li>
        ))}
      </ul>
      {entry.technologies.length > 0 ? (
        <div className="timeline-stack" aria-label={locale === "fr" ? "Technologies associées" : "Related technologies"}>
          <small className="mono">{locale === "fr" ? "TECHNOLOGIES ASSOCIÉES" : "RELATED TECHNOLOGIES"}</small>
          {entry.technologies.map((item) => <span key={item} translate="no">{item}</span>)}
        </div>
      ) : null}
      {entry.id === "greecheck" ? (
        <a href="#greecheck">{locale === "fr" ? "Revoir le système" : "Review the system"}<ArrowUpRight aria-hidden="true" /></a>
      ) : null}
    </aside>
  );
}

const timelineStart = 2021;
const timelineSpan = 5;
const timelinePosition = (year: number) =>
  Math.max(0, Math.min(100, ((year - timelineStart) / timelineSpan) * 100));

function ExperienceTimeline({
  locale,
  activeId,
  onSelect,
}: {
  locale: "fr" | "en";
  activeId: TimelineId;
  onSelect: (id: TimelineId) => void;
}) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const manualSelectionUntil = useRef(0);

  const selectManually = (id: TimelineId) => {
    manualSelectionUntil.current = performance.now() + 1200;
    onSelect(id);
  };

  useEffect(() => {
    const root = timelineRef.current;
    if (!root) return;
    const targets = [...root.querySelectorAll<HTMLElement>("[data-timeline-observer]")];
    const observer = new IntersectionObserver(
      (entries) => {
        if (performance.now() < manualSelectionUntil.current) return;
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top - innerHeight * 0.45) - Math.abs(b.boundingClientRect.top - innerHeight * 0.45))[0];
        const id = (visible?.target as HTMLElement | undefined)?.dataset.timelineObserver as TimelineId | undefined;
        if (id) onSelect(id);
      },
      { rootMargin: "-34% 0px -52% 0px", threshold: 0 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [onSelect]);

  const progress = Math.max(
    0.12,
    Math.min(1, timelinePosition(timelineById.get(activeId)!.end) / 100),
  );

  return (
    <div ref={timelineRef} className="timeline-system-grid">
      <div className="timeline-map" style={{ "--timeline-progress": progress } as CSSProperties}>
        <div className="timeline-year-grid" aria-hidden="true">
          {[2021, 2022, 2023, 2024, 2025, 2026].map((year) => (
            <span key={year} style={{ top: `${timelinePosition(year)}%` }}><b className="mono">{year}</b><i /></span>
          ))}
        </div>
        <div className="timeline-spine" aria-hidden="true"><i /></div>
        {journeyEntries.map((entry) => {
          const start = timelinePosition(entry.start);
          const length = Math.max(3.5, timelinePosition(entry.end) - start);
          return (
            <div key={entry.id}>
              <span
                className="timeline-observer-point"
                data-timeline-observer={entry.id}
                style={{ top: `${start}%` }}
                aria-hidden="true"
              />
              <button
                type="button"
                className="timeline-band"
                data-entity-kind={getTimelineType(entry.id).kind}
                data-active={activeId === entry.id}
                data-core={entry.id === "iaudiogram"}
                style={{
                  "--event-start": `${start}%`,
                  "--event-length": `${length}%`,
                  "--event-lane": entry.lane,
                } as CSSProperties}
                aria-pressed={activeId === entry.id}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") onSelect(entry.id);
                }}
                onFocus={() => onSelect(entry.id)}
                onClick={() => selectManually(entry.id)}
              >
                <EntityTypeMarker
                  kind={getTimelineType(entry.id).kind}
                  index={getTimelineType(entry.id).index}
                  compact
                />
                <span className="mono">{entry.period}</span>
                <strong>{entry.title}</strong>
                {entry.subtitle || entry.engagement ? (
                  <small className="timeline-band-context">
                    {entry.subtitle ? <span>{entry.subtitle}</span> : null}
                    {entry.engagement ? <em>{entry.engagement[locale]}</em> : null}
                  </small>
                ) : null}
                {entry.technologies.length > 0 ? (
                  <span className="timeline-band-technologies" aria-hidden="true">
                    {entry.technologies.slice(0, 4).map((technology, index) => (
                      <span
                        key={technology}
                        style={{ "--technology-delay": `${index * 42}ms` } as CSSProperties}
                      >
                        {technology}
                      </span>
                    ))}
                  </span>
                ) : null}
                <i aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="timeline-mobile" aria-label={locale === "fr" ? "Chronologie interactive" : "Interactive timeline"}>
        {journeyEntries.map((entry) => (
          <button
            type="button"
            key={entry.id}
            data-timeline-observer={entry.id}
            data-active={activeId === entry.id}
            data-entity-kind={getTimelineType(entry.id).kind}
            aria-pressed={activeId === entry.id}
            onClick={() => selectManually(entry.id)}
          >
            <EntityTypeMarker
              kind={getTimelineType(entry.id).kind}
              index={getTimelineType(entry.id).index}
              compact
            />
            <time className="mono">{entry.period}</time>
            <strong>{entry.title}</strong>
            <small className="timeline-mobile-role">
              <span>{entry.role[locale]}</span>
              {entry.engagement ? <em>{entry.engagement[locale]}</em> : null}
            </small>
            <i aria-hidden="true" />
          </button>
        ))}
      </div>
      <TimelineReadout key={activeId} id={activeId} locale={locale} />
    </div>
  );
}

const foundationOrigins = [
  [8, 9],
  [21, 2],
  [34, 14],
  [46, 4],
  [57, 12],
  [69, 3],
  [82, 15],
  [94, 7],
] as const;

function FoundationConvergence() {
  return (
    <svg
      className="foundation-convergence"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {foundationOrigins.map(([x, y], index) => (
        <g key={`${x}-${y}`}>
          <path
            pathLength="1"
            style={{ "--foundation-index": index } as CSSProperties}
            d={`M${x} ${y} C${x} 34 ${50 + (x - 50) * 0.12} 50 50 72`}
          />
          <circle cx={x} cy={y} r=".42" />
        </g>
      ))}
      <path className="foundation-base-line" pathLength="1" d="M14 72H86" />
      <circle className="foundation-core-node" cx="50" cy="72" r="1.1" />
      <path className="foundation-output" pathLength="1" d="M50 72V98" />
    </svg>
  );
}

function EducationFoundation({ locale }: { locale: "fr" | "en" }) {
  const degrees = [...educationEntry.facts].reverse();

  return (
    <section
      id="education"
      data-section
      tabIndex={-1}
      className="education-foundation section-shell"
      data-entity-kind="education"
      aria-labelledby="education-title"
    >
      <ChapterIdentity
        index="04"
        kind="education"
        category={{ fr: "FORMATION", en: "EDUCATION" }}
        title={{ fr: "MA FORMATION", en: "MY FOUNDATION" }}
      />
      <FoundationConvergence />
      <header className="education-heading">
        <h2 id="education-title" className="reveal" data-reveal="foundation">
          {locale === "fr" ? "CINQ ANNÉES POUR CONSTRUIRE LA BASE." : "FIVE YEARS TO BUILD THE FOUNDATION."}
        </h2>
        <p>
          {locale === "fr"
            ? "Le parcours professionnel s’appuie sur cinq années continues de formation en développement, architecture et systèmes d’information."
            : "The professional journey is grounded in five continuous years of study in development, architecture and information systems."}
        </p>
      </header>
      <div className="education-axis mono" aria-label={educationEntry.period}>
        <span>2020</span><i aria-hidden="true" /><span>2025</span>
      </div>
      <div id="education-details" className="education-core">
        <div className="education-school">
          <EntityTypeMarker kind="education" index="01" />
          <span className="mono">{educationEntry.period}</span>
          <h3>EPSI</h3>
          <strong className="education-domain">
            {locale === "fr" ? "Ingénierie informatique" : "Computer science engineering"}
          </strong>
          <p>{educationEntry.description[locale]}</p>
        </div>
        <ol className="degree-stream">
          {degrees.map((degree, index) => {
            const [title, level, certification] = degree[locale].split(" · ");
            return (
              <li key={degree.en}>
                <span className="mono">0{index + 1}</span>
                <div>
                  <h4>{title}</h4>
                  <p>{certification}</p>
                </div>
                <strong>{level}</strong>
              </li>
            );
          })}
        </ol>
      </div>
      <StoryBridge href="#about" next={{ fr: "AU-DELÀ DU CODE", en: "BEYOND CODE" }}>
        {{
          fr: "La formation explique la base. La suite montre la personne qui choisit comment l’utiliser.",
          en: "Education explains the foundation. The next chapter shows the person choosing how to use it.",
        }}
      </StoryBridge>
    </section>
  );
}

export function KnowledgeSystem() {
  const { locale, mode } = usePreferences();
  const activeSection = useActiveSection();
  const [graphExpanded, setGraphExpanded] = useState(false);
  const [activeNode, setActiveNode] = useState("react");
  const [activeTimeline, setActiveTimeline] = useState<TimelineId>("iaudiogram");
  const showGraph = mode === "explore" || graphExpanded;

  const selectGraphNode = useCallback((id: string) => {
    setActiveNode(id);
    const timeline = timelineEntries.find((entry) => entry.graphId === id);
    if (timeline && journeyEntries.some((entry) => entry.id === timeline.id))
      setActiveTimeline(timeline.id);
  }, []);

  const selectTimeline = useCallback((id: TimelineId) => {
    setActiveTimeline(id);
    const entry = timelineById.get(id);
    if (entry?.graphId) setActiveNode(entry.graphId);
  }, []);

  useEffect(() => {
    if (activeSection !== "stack" && activeSection !== "experience") {
      setFieldSignal(null);
      return;
    }
    const signal = entitySignal[activeNode];
    setFieldSignal(signal && fieldTechnologies.includes(signal) ? signal : null);
    return () => setFieldSignal(null);
  }, [activeNode, activeSection]);

  const toggleGraph = () => {
    const next = !showGraph;
    setGraphExpanded(next);
    if (next) requestAnimationFrame(() => document.getElementById("knowledge-explorer")?.focus({ preventScroll: true }));
  };

  return (
    <div className="knowledge-system-root">
      <section
        id="experience"
        data-section
        tabIndex={-1}
        className="journey-system section-shell"
        aria-labelledby="experience-title"
      >
        <ChapterIdentity
          index="02"
          kind="experience"
          category={{ fr: "EXPÉRIENCE PROFESSIONNELLE", en: "PROFESSIONAL EXPERIENCE" }}
          title={{ fr: "MES EXPÉRIENCES", en: "MY JOURNEY" }}
        />
        <header className="journey-heading">
          <h2 id="experience-title" className="reveal" data-reveal="focus">
            {locale === "fr" ? "LE PARCOURS DERRIÈRE LE PRODUIT." : "THE JOURNEY BEHIND THE PRODUCT."}
          </h2>
          <p>
            {locale === "fr"
              ? "GreeCheck n’est pas arrivé par hasard. Mon parcours s’est construit dans la e-santé, des premières missions front-end à trois années en équipe R&D."
              : "GreeCheck did not happen by chance. My journey grew through digital health, from early front-end assignments to three years with an R&D team."}
          </p>
        </header>
        <div className="timeline-type-legend" aria-label={locale === "fr" ? "Types d’événements de la chronologie" : "Timeline event types"}>
          <EntityTypeMarker kind="experience" index="01—03" compact />
          <EntityTypeMarker kind="project" index="01" compact />
        </div>
        <ExperienceTimeline locale={locale} activeId={activeTimeline} onSelect={selectTimeline} />
        <ProfessionalExperience />
        <StoryBridge href="#stack" next={{ fr: "MON STACK", en: "HOW I BUILD" }}>
          {{
            fr: "Ces expériences ont façonné un environnement technique orienté produit, qualité et livraison.",
            en: "These experiences shaped a technical environment focused on product, quality and delivery.",
          }}
        </StoryBridge>
      </section>

      <section id="stack" data-section tabIndex={-1} className="knowledge-system section-shell" aria-labelledby="stack-title">
        <ChapterIdentity
          index="03"
          kind="stack"
          category={{ fr: "COMPÉTENCES", en: "SKILLS" }}
          title={{ fr: "MON STACK", en: "HOW I BUILD" }}
        />
        <header className="knowledge-heading">
          <div className="knowledge-kicker mono">
            <span>{locale === "fr" ? "TECHNOLOGIES · PRATIQUES · MÉTHODES" : "TECHNOLOGIES · PRACTICES · METHODS"}</span>
            <span>PROOF-BASED RELATIONS</span>
          </div>
          <h2 id="stack-title" className="reveal" data-reveal="graph">
            <span>THE HASSAN</span>
            <span>KNOWLEDGE GRAPH</span>
          </h2>
          <p>
            {locale === "fr"
              ? "Une cartographie lisible des technologies, produits, expériences et pratiques qui composent mon travail."
              : "A readable map of the technologies, products, experiences and practices that shape my work."}
          </p>
        </header>

        {mode === "recruiter" ? (
          <RecruiterStack locale={locale} expanded={showGraph} onToggle={toggleGraph} />
        ) : (
          <div className="explore-graph-entry mono">
            <Orbit aria-hidden="true" />
            {locale === "fr" ? "MODE EXPLORE · GRAPHE COMPLET ACTIF" : "EXPLORE MODE · FULL GRAPH ACTIVE"}
          </div>
        )}
        {showGraph ? (
          <>
            <KnowledgeGraph activeId={activeNode} locale={locale} onSelect={selectGraphNode} />
            <MobileKnowledgeExplorer activeId={activeNode} locale={locale} onSelect={selectGraphNode} />
          </>
        ) : null}
        <AIWorkflow locale={locale} />
        <StoryBridge href="#education" next={{ fr: "MA FORMATION", en: "MY FOUNDATION" }}>
          {{
            fr: "Cette pratique repose aussi sur une formation construite pendant cinq années continues.",
            en: "This practice is also grounded in five continuous years of education.",
          }}
        </StoryBridge>
      </section>
      <EducationFoundation locale={locale} />
    </div>
  );
}

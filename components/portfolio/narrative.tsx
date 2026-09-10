"use client";

import { ArrowDownRight } from "lucide-react";
import { usePreferences } from "@/components/system/preferences";

type ChapterKind =
  | "now"
  | "project"
  | "experience"
  | "stack"
  | "education"
  | "about"
  | "contact";

type LocalizedCopy = { fr: string; en: string };

export type EntityKind = "project" | "experience" | "education" | "stack";

const entityLabels: Record<EntityKind, LocalizedCopy> = {
  project: { fr: "PROJET PERSONNEL", en: "PERSONAL PROJECT" },
  experience: {
    fr: "EXPÉRIENCE PROFESSIONNELLE",
    en: "PROFESSIONAL EXPERIENCE",
  },
  education: { fr: "FORMATION", en: "EDUCATION" },
  stack: { fr: "COMPÉTENCES", en: "SKILLS & PRACTICES" },
};

const entityCodes: Record<EntityKind, string> = {
  project: "P",
  experience: "E",
  education: "F",
  stack: "S",
};

export function EntityTypeMarker({
  kind,
  index,
  compact = false,
  label,
}: {
  kind: EntityKind;
  index: string;
  compact?: boolean;
  label?: LocalizedCopy;
}) {
  const { locale } = usePreferences();
  const resolvedLabel = (label ?? entityLabels[kind])[locale];

  return (
    <span
      className={`entity-type-marker${compact ? " is-compact" : ""}`}
      data-entity-kind={kind}
      aria-label={`${resolvedLabel} ${index}`}
    >
      <span className="entity-type-glyph" aria-hidden="true">
        <b>{entityCodes[kind]}</b>
        <i />
      </span>
      <span className="entity-type-copy">
        <small className="mono">TYPE</small>
        <strong>{resolvedLabel}</strong>
      </span>
      <span className="entity-type-index mono" aria-hidden="true">
        {index}
      </span>
    </span>
  );
}

export function ChapterIdentity({
  index,
  kind,
  category,
  title,
  compact = false,
}: {
  index: string;
  kind: ChapterKind;
  category: LocalizedCopy;
  title: LocalizedCopy;
  compact?: boolean;
}) {
  const { locale } = usePreferences();

  return (
    <div
      className={`chapter-identity${compact ? " is-compact" : ""}`}
      data-chapter-kind={kind}
    >
      <span className="chapter-identity-index mono">{index}</span>
      <i className="chapter-identity-symbol" aria-hidden="true" />
      <span className="chapter-identity-copy">
        <b>{category[locale]}</b>
        <strong>{title[locale]}</strong>
      </span>
    </div>
  );
}

export function StoryBridge({
  href,
  next,
  children,
}: {
  href: string;
  next: LocalizedCopy;
  children: LocalizedCopy;
}) {
  const { locale } = usePreferences();

  return (
    <aside className="story-bridge" aria-label={locale === "fr" ? "Suite du parcours" : "Next chapter"}>
      <span className="story-bridge-line" aria-hidden="true">
        <i />
      </span>
      <p>{children[locale]}</p>
      <a href={href} data-cursor="VIEW">
        <span className="mono">{locale === "fr" ? "CHAPITRE SUIVANT" : "NEXT CHAPTER"}</span>
        <strong>{next[locale]}</strong>
        <ArrowDownRight aria-hidden="true" />
      </a>
    </aside>
  );
}

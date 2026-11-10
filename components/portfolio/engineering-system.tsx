"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { skillGroups } from "@/lib/knowledge-data";
import { profile, type Locale } from "@/lib/portfolio-data";
import { evidenceTargetName, projects } from "@/lib/work-data";
import { sendStorySignal } from "@/lib/story-signal";

const coordinates = [
  [15, 18],
  [63, 12],
  [88, 47],
  [66, 87],
  [19, 83],
  [6, 50],
];
const shortNames = [
  "INTERFACE",
  "API",
  "DATA",
  "QUALITY",
  "DELIVERY",
  "DESIGN",
];
export function EngineeringSystem({ locale }: { locale: Locale }) {
  const [groupIndex, setGroupIndex] = useState(0);
  const [skillIndex, setSkillIndex] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const group = skillGroups[groupIndex];
  const skill = group.skills[skillIndex];
  const fr = locale === "fr";
  function tune(nextGroup: number, nextSkill = 0) {
    setGroupIndex(nextGroup);
    setSkillIndex(nextSkill);
    const relation = skillGroups[nextGroup].skills[nextSkill].relations.find(
      (id) => projects.some((project) => project.id === id),
    );
    const project = projects.find((item) => item.id === relation);
    if (root.current)
      sendStorySignal(root.current, {
        mode: nextGroup % 3,
        project: project?.slug,
      });
  }
  return (
    <div className="engineering-system" ref={root}>
      <div
        className="engineering-map"
        aria-label={fr ? "Les couches de ma pratique" : "Layers of my practice"}
      >
        <svg
          className="engineering-connections"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          {coordinates.map(([x, y], index) => (
            <path
              key={x}
              data-connected={index === groupIndex}
              d={`M50 50 Q${50 + (x - 50) * 0.4} ${y} ${x} ${y}`}
            />
          ))}
          <circle cx="50" cy="50" r="18" />
          <circle cx="50" cy="50" r="21" />
        </svg>
        <div className="engineering-core" aria-hidden="true">
          <span>FULL</span>
          <span>STACK</span>
          <small className="mono">LOWKYZ</small>
        </div>
        {skillGroups.map((item, index) => (
          <button
            key={item.id}
            className="engineering-node"
            style={{
              left: `${coordinates[index][0]}%`,
              top: `${coordinates[index][1]}%`,
            }}
            aria-pressed={index === groupIndex}
            aria-controls="engineering-inspector"
            onClick={() => tune(index)}
          >
            <span className="mono">0{index + 1}</span>
            {shortNames[index]}
            <span className="sr-only"> — {item.label[locale]}</span>
          </button>
        ))}
      </div>
      <div
        className="engineering-inspector expertise-group"
        id="engineering-inspector"
        aria-live="polite"
      >
        <span className="mono engineering-frequency">
          0{groupIndex + 1} / {fr ? "CONNEXIONS RÉELLES" : "REAL CONNECTIONS"}
        </span>
        <h3>{group.label[locale]}</h3>
        <p>{group.description[locale]}</p>
        <div
          className="engineering-skills"
          aria-label={fr ? "Explorer les technologies" : "Explore technologies"}
        >
          {group.skills.map((item, index) => (
            <button
              key={item.name}
              aria-pressed={skillIndex === index}
              onClick={() => tune(groupIndex, index)}
            >
              {item.label?.[locale] ?? item.name}
            </button>
          ))}
        </div>
        <div className="engineering-evidence">
          <span className="mono">
            {skill.label?.[locale] ?? skill.name} →{" "}
            {fr ? "DANS LA PRATIQUE" : "IN PRACTICE"}
          </span>
          {skill.relations.length ? (
            skill.relations.map((id) => {
              const project = projects.find((item) => item.id === id);
              return (
                <a
                  key={id}
                  href={project ? `/${locale}/work/${project.slug}` : `#${id}`}
                >
                  <span>{evidenceTargetName(id)}</span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              );
            })
          ) : (
            <a href={profile.cv} target="_blank" rel="noopener noreferrer">
              {fr ? "Mentionné dans mon CV" : "Listed in my résumé"}
              <ArrowUpRight aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
      <noscript>
        <div className="engineering-native">
          {skillGroups.map((item) => (
            <div key={item.id}>
              <h3>{item.label[locale]}</h3>
              <p>{item.description[locale]}</p>
              <p>
                {item.skills
                  .map((entry) => entry.label?.[locale] ?? entry.name)
                  .join(" / ")}
              </p>
            </div>
          ))}
        </div>
      </noscript>
    </div>
  );
}

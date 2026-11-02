"use client";

import { useEffect, useRef, useState } from "react";
import { usePreferences } from "@/components/system/preferences";
import { subscribeMotionFrame } from "@/lib/motion-runtime";
import { setFieldSignal } from "@/lib/field-signal";
import { setWorkSignal } from "@/lib/work-signal";
import { certifications, education, skillGroups, type Skill, type SkillGroup } from "@/lib/knowledge-data";
import { evidenceTargetName, professionalWork, projects, type ProfessionalWork } from "@/lib/work-data";
import { ChapterIdentity } from "./narrative";

type GroupId = SkillGroup["id"] | "all";
const work = [...professionalWork].sort((a, b) => b.start.localeCompare(a.start));
const allSkills = skillGroups.flatMap((group) => group.skills);

function relatedHref(id: Skill["relations"][number], locale: "fr" | "en") {
  const project = projects.find((item) => item.id === id);
  return project ? `/${locale}/work/${project.slug}` : `#experience-${id}`;
}

function ExperienceJourney() {
  const { locale, expressiveMotion: motion } = usePreferences();
  const timeline = useRef<HTMLDivElement>(null);
  const [activeWork, setActiveWork] = useState<ProfessionalWork["id"]>(work[0].id);

  useEffect(() => {
    const list = timeline.current;
    if (!list || typeof IntersectionObserver === "undefined") return;
    const entries = [...list.querySelectorAll<HTMLElement>("[data-journey-work]")];
    const observer = new IntersectionObserver(() => {
      const readingLine = innerHeight * 0.48;
      const current = entries.find((entry) => {
        const bounds = entry.getBoundingClientRect();
        return bounds.top <= readingLine && bounds.bottom >= readingLine;
      });
      if (current) {
        const id = current.dataset.journeyWork as ProfessionalWork["id"];
        setActiveWork(id);
        setWorkSignal(id);
      }
    }, { rootMargin: "-18% 0px -18% 0px", threshold: [0, 0.3, 0.7] });
    entries.forEach((entry) => observer.observe(entry));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const list = timeline.current;
    if (!list || !motion) {
      list?.style.removeProperty("--journey-progress");
      return;
    }
    const update = () => {
      const rect = list.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (innerHeight * 0.55 - rect.top) / rect.height));
      list.style.setProperty("--journey-progress", progress.toFixed(4));
    };
    update();
    return subscribeMotionFrame((frame) => {
      if (frame.scrolled || frame.resized) update();
    });
  }, [motion]);

  return (
    <section id="experience" data-section tabIndex={-1} className="clarity-section section-shell section-space journey-section" aria-labelledby="experience-title">
      <header className="clarity-section-header reveal" data-reveal="mask">
        <ChapterIdentity index="03" kind="experience" category={{ fr: "PARCOURS", en: "JOURNEY" }} title={{ fr: "EXPÉRIENCE PROFESSIONNELLE", en: "PROFESSIONAL EXPERIENCE" }} />
        <div className="clarity-section-heading">
          <span className="mono">2021 — 2025 / HEALTH TECH</span>
          <h2 id="experience-title">{locale === "fr" ? "DU WEB AUX LOGICIELS MÉDICAUX." : "FROM WEB TO MEDICAL SOFTWARE."}</h2>
          <p>{locale === "fr" ? "Trois expériences en santé numérique, dont une alternance Full-Stack au sein d’une équipe R&D. Contributions et statut de chaque mission sont détaillés ci-dessous." : "Three roles in digital health, including a Full-Stack apprenticeship in an R&D team. Each role’s contributions and employment type are detailed below."}</p>
        </div>
      </header>
      <div className="journey-list" ref={timeline}>
        {work.map((item, index) => (
          <article id={`experience-${item.id}`} key={item.id} className="journey-entry reveal" data-reveal="line" data-journey-work={item.id} data-active={activeWork === item.id} onPointerEnter={() => { setActiveWork(item.id); setWorkSignal(item.id); }} onFocusCapture={() => { setActiveWork(item.id); setWorkSignal(item.id); }}>
            <div className="journey-index" aria-hidden="true"><span className="mono">{String(index + 1).padStart(2, "0")}</span><i /></div>
            <div className="journey-company">
              <span className="mono journey-date"><time dateTime={item.start}>{item.period[locale]}</time></span>
              <h3>{item.company}</h3>
              {item.product ? <p className="journey-product">{locale === "en" ? item.productEn ?? item.product : item.product}</p> : null}
            </div>
            <div className="journey-story">
              <p className="journey-role"><strong>{item.role[locale]}</strong><span>{item.engagement[locale]}</span></p>
              <p className="journey-context">{item.context[locale]}</p>
              <ul className="journey-contributions">
                {item.contributions.slice(0, 2).map((evidence) => <li key={evidence.statement.en}>{evidence.statement[locale]}</li>)}
              </ul>
              <details className="journey-details">
                <summary>{locale === "fr" ? "Contributions et environnement" : "More contributions and tools"}<span aria-hidden="true">＋</span></summary>
                {item.contributions.length > 2 ? <ul className="journey-contributions journey-contributions--more">{item.contributions.slice(2).map((evidence) => <li key={evidence.statement.en}>{evidence.statement[locale]}</li>)}</ul> : null}
                <p className="mono journey-tools-label">{locale === "fr" ? "ENVIRONNEMENT" : "TOOLS & TECHNOLOGIES"}</p>
                <ul className="journey-tools">{item.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>
              </details>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Expertise() {
  const { locale } = usePreferences();
  const [selectedGroup, setSelectedGroup] = useState<GroupId>("all");
  const [activeSkill, setActiveSkill] = useState("React");
  const selectedSkill = allSkills.find((skill) => skill.name === activeSkill) ?? allSkills[0];
  const visibleGroups = selectedGroup === "all" ? skillGroups : skillGroups.filter((group) => group.id === selectedGroup);
  const chooseSkill = (skill: Skill) => {
    setActiveSkill(skill.name);
    setFieldSignal(skill.signal ?? null);
  };
  const chooseGroup = (groupId: GroupId) => {
    setSelectedGroup(groupId);
    if (groupId === "all") return;
    const firstRelated = skillGroups.find((group) => group.id === groupId)?.skills.find((skill) => skill.relations.length);
    if (firstRelated) chooseSkill(firstRelated);
  };

  useEffect(() => () => setFieldSignal(null), []);

  return (
    <section id="stack" data-section tabIndex={-1} className="clarity-section section-shell section-space expertise-section" aria-labelledby="stack-title">
      <header className="clarity-section-header reveal" data-reveal="mask">
        <ChapterIdentity index="04" kind="stack" category={{ fr: "EXPERTISE", en: "EXPERTISE" }} title={{ fr: "SOUS LE CAPOT", en: "UNDER THE HOOD" }} />
        <div className="clarity-section-heading">
          <span className="mono">FRONT / BACK / DATA / DELIVERY</span>
          <h2 id="stack-title">{locale === "fr" ? "UN OUTILLAGE, DES USAGES CONCRETS." : "TOOLS CONNECTED TO REAL WORK."}</h2>
          <p>{locale === "fr" ? "Les technologies issues de mon CV. Sélectionnez une compétence soulignée pour voir les expériences ou projets qui la documentent." : "Technologies from my résumé. Select an underlined skill to see the work or projects that document its use."}</p>
        </div>
      </header>
      <div className="expertise-filter" role="group" aria-label={locale === "fr" ? "Filtrer les compétences" : "Filter skills"}>
        <button type="button" aria-pressed={selectedGroup === "all"} onClick={() => chooseGroup("all")}>{locale === "fr" ? "Toutes" : "All"}<span className="mono">{String(allSkills.length).padStart(2, "0")}</span></button>
        {skillGroups.map((group) => <button key={group.id} type="button" aria-pressed={selectedGroup === group.id} onClick={() => chooseGroup(group.id)}>{group.label[locale]}<span className="mono">{String(group.skills.length).padStart(2, "0")}</span></button>)}
      </div>
      <div className={`expertise-layout${selectedGroup === "all" ? "" : " is-filtered"}`}>
        <div className="expertise-groups" key={selectedGroup}>
          {visibleGroups.map((group, index) => (
            <section className="expertise-group" key={group.id} aria-labelledby={`expertise-${group.id}`}>
              <div className="expertise-group-head"><span className="mono">{String(skillGroups.indexOf(group) + 1).padStart(2, "0")}</span><h3 id={`expertise-${group.id}`}>{group.label[locale]}</h3></div>
              <ul>{group.skills.map((skill) => <li key={skill.name}>{skill.relations.length ? <button type="button" aria-pressed={activeSkill === skill.name} onClick={() => chooseSkill(skill)} onFocus={() => chooseSkill(skill)} onPointerEnter={() => chooseSkill(skill)}>{skill.label?.[locale] ?? skill.name}<span aria-hidden="true">↗</span></button> : <span>{skill.label?.[locale] ?? skill.name}</span>}</li>)}</ul>
              {index === 0 && selectedGroup !== "all" ? <p className="mono expertise-count">{locale === "fr" ? "COMPÉTENCES DOCUMENTÉES ET OUTILS DU CV" : "DOCUMENTED WORK AND RÉSUMÉ TOOLS"}</p> : null}
            </section>
          ))}
        </div>
        <aside className="expertise-relations" aria-label={locale === "fr" ? "Liens entre compétence et réalisations" : "Skill and work connections"}>
          <div className="expertise-circuit" aria-hidden="true"><span className="expertise-circuit-core" /><span className="expertise-circuit-node node-a" /><span className="expertise-circuit-node node-b" /><span className="expertise-circuit-node node-c" /></div>
          <div className="expertise-readout" aria-live="polite">
            <span className="mono">{locale === "fr" ? "COMPÉTENCE SÉLECTIONNÉE" : "SELECTED SKILL"}</span>
            <h3>{selectedSkill.label?.[locale] ?? selectedSkill.name}</h3>
            <p>{locale === "fr" ? "Documentée dans" : "Documented in"}</p>
            <ul>{selectedSkill.relations.map((target) => <li key={target}><a href={relatedHref(target, locale)}>{evidenceTargetName(target)} <span aria-hidden="true">↗</span></a></li>)}</ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Education() {
  const { locale } = usePreferences();
  return (
    <section id="education" data-section tabIndex={-1} className="clarity-section section-shell section-space education-v2" aria-labelledby="education-title">
      <header className="clarity-section-header reveal" data-reveal="mask">
        <ChapterIdentity index="05" kind="education" category={{ fr: "FORMATION", en: "EDUCATION" }} title={{ fr: "PARCOURS ACADÉMIQUE", en: "ACADEMIC BACKGROUND" }} />
        <div className="clarity-section-heading"><span className="mono">EPSI / MONTPELLIER / 2020—2025</span><h2 id="education-title">{locale === "fr" ? "CINQ ANS POUR CONSTRUIRE LE SOCLE." : "FIVE YEARS BUILDING THE FOUNDATION."}</h2></div>
      </header>
      <div className="education-v2-layout">
        <div className="education-v2-school"><span className="mono">2020 — 2025 / {education.city.toUpperCase()}</span><h3>{education.school}</h3><p>{education.field[locale]}</p></div>
        <div className="education-v2-records">
          {education.degrees.map((degree, index) => <article key={degree.level} className="education-v2-degree"><span className="mono">0{index + 1} / {degree.level.toUpperCase()}</span><div><h4>{degree.title[locale]}</h4><p>RNCP {locale === "fr" ? "niveau" : "level"} {degree.rncpLevel}</p></div></article>)}
          <div className="education-v2-cert"><span className="mono">{locale === "fr" ? "CERTIFICATION / 2026" : "CERTIFICATION / 2026"}</span><strong>{certifications[0].name}</strong></div>
        </div>
      </div>
    </section>
  );
}

export function JourneyExpertiseV2() {
  return <><ExperienceJourney /><Expertise /><Education /></>;
}

import Image from "next/image";
import { CaseNavigation } from "@/components/portfolio/case-navigation";
import { PreferencesProvider } from "@/components/system/preferences";
import { NarrativeEnvironment } from "@/components/system/narrative-environment";
import { SignalArtwork } from "@/components/portfolio/signal-artwork";
import { Wordmark } from "@/components/ui/wordmark";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectMedia } from "@/components/portfolio/project-media";
import { CreativeAction } from "@/components/ui/creative-action";
import { greeCheckStorySteps, projects } from "@/lib/work-data";
import { SITE_ORIGIN } from "@/lib/seo";
import { profile, type Locale } from "@/lib/portfolio-data";
import "@/app/work-showcase.css";

type PageParams = { locale: string; slug: string };
type PageProps = { params: Promise<PageParams> };

const labels = {
  fr: {
    back: "Retour aux projets",
    context: "Contexte",
    goal: "Problème à résoudre",
    decisions: "Décisions",
    role: "Mon rôle",
    approach: "Mise en œuvre",
    features: "Fonctionnalités",
    stack: "Technologies",
    result: "Résultat observable",
    links: "Explorer",
    next: "Projet suivant",
    year: "Année",
    status: "Statut",
  },
  en: {
    back: "Back to work",
    context: "Context",
    goal: "Problem to solve",
    decisions: "Decisions",
    role: "My role",
    approach: "Implementation",
    features: "Features",
    stack: "Technology",
    result: "Observable result",
    links: "Explore",
    next: "Next project",
    year: "Year",
    status: "Status",
  },
} as const;

export function generateStaticParams(): PageParams[] {
  return (["fr", "en"] as const).flatMap((locale) =>
    projects.map((project) => ({ locale, slug: project.slug })),
  );
}

// Known cases stay pre-rendered; unknown slugs reach the explicit notFound guard.
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project || (locale !== "fr" && locale !== "en")) return {};
  const path = `/${locale}/work/${slug}`;
  const title = `${project.name} — ${locale === "fr" ? "étude de cas" : "case study"}`;
  return {
    title,
    description: project.summary[locale],
    alternates: {
      canonical: path,
      languages: {
        "fr-FR": `/fr/work/${slug}`,
        en: `/en/work/${slug}`,
        "x-default": `/fr/work/${slug}`,
      },
    },
    openGraph: {
      title,
      description: project.summary[locale],
      type: "article",
      url: `${SITE_ORIGIN}${path}`,
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      images: [
        {
          url: `${SITE_ORIGIN}${project.media[0].src}`,
          width: project.media[0].width,
          height: project.media[0].height,
          alt: project.media[0].alt[locale],
        },
      ],
    },
    robots: { index: true, follow: true },
  };
}

export default async function WorkCaseStudy({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  if (localeParam !== "fr" && localeParam !== "en") notFound();
  const locale: Locale = localeParam;
  const index = projects.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const words = labels[locale];
  const fr = locale === "fr";

  return (
    <div
      lang={locale}
      data-portfolio-root
      data-experience="case"
      data-project={project.slug}
      className={`case-study case-study--${project.id}`}
    >
      <PreferencesProvider initialLocale={locale} enableCommands={false}>
        <CaseNavigation locale={locale} slug={slug} />
        <NarrativeEnvironment caseStudy />
        <main id="main" tabIndex={-1} className="case-shell">
          <article id="case-content">
            <section
              id="case-intro"
              data-section
              data-scene-section
              className="case-scene case-opening"
              tabIndex={-1}
              aria-labelledby="case-title"
            >
              <header className="case-hero">
                <span className="mono">
                  0{index + 1} / 04 — {project.category[locale]}
                </span>
                <h1 id="case-title">{project.name}</h1>
                <p>{project.summary[locale]}</p>
                <div className="case-signal-dock">
                  <SignalArtwork />
                  <button
                    data-signal-modulate
                    disabled
                    className="signal-modulate"
                  >
                    <span>
                      {fr ? "MODULER LE SIGNAL" : "MODULATE THE SIGNAL"}
                    </span>
                  </button>
                </div>
              </header>
              <dl className="case-intro-facts">
                <div>
                  <dt className="mono">{words.year}</dt>
                  <dd>{project.year}</dd>
                </div>
                <div>
                  <dt className="mono">{words.role}</dt>
                  <dd>{project.role[locale]}</dd>
                </div>
                <div>
                  <dt className="mono">{words.status}</dt>
                  <dd>{project.status[locale]}</dd>
                </div>
              </dl>
              <div className="case-visual">
                <ProjectMedia
                  project={{
                    id: project.id,
                    name: project.name,
                    media: project.media,
                  }}
                  locale={locale}
                  priority
                />
              </div>
              <a className="case-scroll-cue mono" href="#case-context">
                {fr
                  ? "DE L’INTENTION À L’EXPÉRIENCE"
                  : "FROM INTENT TO EXPERIENCE"}
                <span aria-hidden="true">↓</span>
              </a>
            </section>

            <section
              id="case-context"
              data-section
              data-scene-section
              className="case-scene case-intent"
              tabIndex={-1}
            >
              <header className="case-scene-heading">
                <span className="chapter-label mono">
                  01 / {fr ? "INTENTION" : "INTENT"}
                </span>
                <h2>
                  {fr
                    ? "Un point de départ concret."
                    : "A concrete starting point."}
                </h2>
              </header>
              <div className="case-intent-grid">
                <section className="case-chapter" id="context">
                  <span className="mono">01 / {words.context}</span>
                  <h3>{words.context}</h3>
                  <p>{project.caseStudy.context[locale]}</p>
                </section>
                <section className="case-chapter" id="goal">
                  <span className="mono">02 / {words.goal}</span>
                  <h3>{words.goal}</h3>
                  <p>{project.caseStudy.goal[locale]}</p>
                </section>
                <section className="case-chapter case-role" id="role">
                  <span className="mono">03 / {words.role}</span>
                  <h3>{words.role}</h3>
                  <p>{project.role[locale]}</p>
                  {project.id === "bloom" ? (
                    <p>
                      {fr
                        ? "Mon travail web et mon activité associative au studio sont deux contributions distinctes."
                        : "My web work and my association work in the studio are separate contributions."}
                    </p>
                  ) : null}
                </section>
              </div>
            </section>

            <section
              id="case-decisions"
              data-section
              data-scene-section
              className="case-scene case-making"
              tabIndex={-1}
            >
              <header className="case-scene-heading">
                <span className="chapter-label mono">
                  02 / {fr ? "CONSTRUCTION" : "MAKING"}
                </span>
                <h2>
                  {fr
                    ? "Choisir. Relier. Affiner."
                    : "Choose. Connect. Refine."}
                </h2>
              </header>
              <div className="case-making-grid">
                <section className="case-chapter" id="decisions">
                  <span className="mono">04 / {words.decisions}</span>
                  <h3>{words.decisions}</h3>
                  <p>{project.caseStudy.decisions[locale]}</p>
                </section>
                <section className="case-chapter" id="approach">
                  <span className="mono">05 / {words.approach}</span>
                  <h3>{words.approach}</h3>
                  <p>{project.caseStudy.approach[locale]}</p>
                </section>
              </div>
              <div
                className="case-architecture"
                aria-label={
                  fr ? "Technologies du projet" : "Project technologies"
                }
              >
                {project.stack.map((tool, i) => (
                  <span key={tool}>
                    <small className="mono">
                      {String(i + 1).padStart(2, "0")}
                    </small>
                    {tool}
                    <span aria-hidden="true">
                      {i < project.stack.length - 1 ? "→" : "↗"}
                    </span>
                  </span>
                ))}
              </div>
            </section>

            <section
              id="case-features"
              data-section
              data-scene-section
              className="case-scene case-experience"
              tabIndex={-1}
            >
              <header className="case-scene-heading">
                <span className="chapter-label mono">
                  03 / {fr ? "EXPÉRIENCE" : "EXPERIENCE"}
                </span>
                <h2>{fr ? "Ce qui prend forme." : "What takes shape."}</h2>
              </header>
              <div className="case-features-grid">
                <section className="case-chapter" id="features">
                  <span className="mono">06 / {words.features}</span>
                  <h3>{words.features}</h3>
                  <ol>
                    {project.caseStudy.features.map((feature, i) => (
                      <li key={feature.en}>
                        <span className="mono">0{i + 1}</span>
                        {feature[locale]}
                      </li>
                    ))}
                  </ol>
                </section>
                <section className="case-chapter" id="stack">
                  <span className="mono">07 / {words.stack}</span>
                  <h3>{words.stack}</h3>
                  <ul className="clarity-inline-list">
                    {project.stack.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                  <a className="text-link" href={`/${locale}#stack`}>
                    {fr ? "Explorer ma pratique" : "Explore my practice"} ↗
                  </a>
                </section>
              </div>
              {project.id === "greecheck" ? (
                <div className="case-gallery">
                  {greeCheckStorySteps
                    .filter((step) =>
                      ["scan", "product", "compare"].includes(step.id),
                    )
                    .map((step, i) => (
                      <figure key={step.id}>
                        <Image
                          src={step.src}
                          alt={step.alt[locale]}
                          width={1440}
                          height={900}
                          sizes="(max-width: 760px) 90vw, 70vw"
                        />
                        <figcaption>
                          <span className="mono">
                            0{i + 1} / {step.title[locale]}
                          </span>
                          <p>{step.detail[locale]}</p>
                        </figcaption>
                      </figure>
                    ))}
                </div>
              ) : (
                <figure className="case-detail-capture">
                  <Image
                    src={project.media[project.media.length - 1].src}
                    alt={project.media[project.media.length - 1].alt[locale]}
                    width={project.media[project.media.length - 1].width}
                    height={project.media[project.media.length - 1].height}
                    sizes="(max-width:760px) 75vw, 50vw"
                  />
                  <figcaption className="mono">
                    {project.media[project.media.length - 1].alt[locale]}
                  </figcaption>
                </figure>
              )}
            </section>

            <section
              id="case-result"
              data-section
              data-scene-section
              className="case-scene case-outcome"
              tabIndex={-1}
            >
              <header className="case-scene-heading">
                <span className="chapter-label mono">
                  04 / {fr ? "RÉSULTAT" : "RESULT"}
                </span>
                <h2>
                  {fr
                    ? "Le travail, dans les faits."
                    : "The work, in practice."}
                </h2>
              </header>
              <section className="case-chapter" id="result">
                <span className="mono">08 / {words.result}</span>
                <h3>{words.result}</h3>
                <p className="case-result-statement">
                  {project.caseStudy.result[locale]}
                </p>
                <ul className="case-evidence">
                  {project.evidence.map((item) => (
                    <li key={item.statement.en}>{item.statement[locale]}</li>
                  ))}
                </ul>
              </section>
            </section>

            <section
              id="case-links"
              data-section
              data-scene-section
              className="case-scene case-finale"
              tabIndex={-1}
            >
              <section className="case-chapter" id="links">
                <span className="chapter-label mono">05 / {words.links}</span>
                <h2>{fr ? "À vous d’explorer." : "Your turn to explore."}</h2>
                <div className="case-links">
                  {project.links.map((link) => (
                    <CreativeAction
                      key={link.url}
                      variant="secondary"
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      label={link.label[locale]}
                    />
                  ))}
                  {project.repository ? (
                    <CreativeAction
                      variant="text"
                      href={project.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      label={fr ? "Code GitHub" : "GitHub source"}
                    />
                  ) : null}
                </div>
              </section>
              <div className="contact-signature-dock" aria-hidden="true">
                <Wordmark />
                <span className="mono">LOWKYZ / THE LIVING SIGNAL</span>
              </div>
              <nav className="case-next" aria-label={words.next}>
                <span className="mono">
                  {words.next} / {next.category[locale]}
                </span>
                <a href={`/${locale}/work/${next.slug}`}>
                  {next.name}
                  <span aria-hidden="true">↗</span>
                </a>
                <a className="case-return mono" href={`/${locale}#projets`}>
                  {words.back} ↑
                </a>
              </nav>
              <footer className="case-footer">
                <a href={`mailto:${profile.email}`}>{profile.email} ↗</a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub ↗
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn ↗
                </a>
                <a href={profile.cv} download>
                  {fr ? "Mon CV" : "My résumé"} ↓
                </a>
              </footer>
            </section>
          </article>
        </main>
      </PreferencesProvider>
    </div>
  );
}

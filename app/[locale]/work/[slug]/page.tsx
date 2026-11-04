import Image from "next/image";
import { Wordmark } from "@/components/ui/wordmark";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectMedia } from "@/components/portfolio/project-media";
import { CreativeAction } from "@/components/ui/creative-action";
import { greeCheckStorySteps, projects } from "@/lib/work-data";
import { SITE_ORIGIN } from "@/lib/seo";
import type { Locale } from "@/lib/portfolio-data";
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
  const opposite: Locale = locale === "fr" ? "en" : "fr";

  return (
    <main
      id="main"
      lang={locale}
      className={`case-study case-study--${project.id}`}
    >
      <a className="case-skip" href="#case-content">
        {locale === "fr" ? "Aller au contenu" : "Skip to content"}
      </a>
      <div className="case-shell">
        <header className="case-topbar">
          <a
            className="case-brand"
            aria-label="LOWKYZ — Hassan Haddane"
            href={`/${locale}`}
          >
            <Wordmark />
          </a>
          <nav
            aria-label={
              locale === "fr"
                ? "Navigation de l’étude de cas"
                : "Case study navigation"
            }
          >
            <a href={`/${locale}#${project.slug}`}>← {words.back}</a>
            <a
              href={`/${opposite}/work/${slug}`}
              hrefLang={opposite}
              lang={opposite}
            >
              {opposite.toUpperCase()}
            </a>
          </nav>
        </header>

        <article id="case-content">
          <header className="case-hero">
            <span className="mono">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(projects.length).padStart(2, "0")} —{" "}
              {project.category[locale]}
            </span>
            <h1>{project.name}</h1>
            <p>{project.summary[locale]}</p>
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

          <figure className="case-visual">
            <ProjectMedia project={project} locale={locale} priority />
            <figcaption className="sr-only">
              {project.media.map((media) => media.alt[locale]).join(" ; ")}
            </figcaption>
          </figure>

          <div className="case-body">
            <aside
              aria-label={locale === "fr" ? "Sommaire" : "Contents"}
              className="mono"
            >
              {(
                [
                  "context",
                  "goal",
                  "role",
                  "decisions",
                  "approach",
                  "features",
                  "stack",
                  "result",
                  "links",
                ] as const
              ).map((key) => (
                <a key={key} href={`#${key}`}>
                  {words[key]}
                </a>
              ))}
            </aside>
            <div className="case-body-content">
              <section className="case-chapter" id="context">
                <span className="mono">01 / {words.context}</span>
                <div>
                  <h2>{words.context}</h2>
                  <p>{project.caseStudy.context[locale]}</p>
                </div>
              </section>
              <section className="case-chapter" id="goal">
                <span className="mono">02 / {words.goal}</span>
                <div>
                  <h2>{words.goal}</h2>
                  <p>{project.caseStudy.goal[locale]}</p>
                </div>
              </section>
              <section className="case-chapter" id="role">
                <span className="mono">03 / {words.role}</span>
                <div>
                  <h2>{words.role}</h2>
                  <p>{project.role[locale]}</p>
                  {project.id === "bloom" ? (
                    <p>
                      {locale === "fr"
                        ? "Mon travail web et mon activité associative au studio sont deux contributions distinctes."
                        : "My web work and my association work in the studio are separate contributions."}
                    </p>
                  ) : null}
                </div>
              </section>
              <section className="case-chapter" id="decisions">
                <span className="mono">04 / {words.decisions}</span>
                <div>
                  <h2>{words.decisions}</h2>
                  <p>{project.caseStudy.decisions[locale]}</p>
                </div>
              </section>
              <section className="case-chapter" id="approach">
                <span className="mono">05 / {words.approach}</span>
                <div>
                  <h2>{words.approach}</h2>
                  <p>{project.caseStudy.approach[locale]}</p>
                </div>
              </section>
              <section className="case-chapter" id="features">
                <span className="mono">06 / {words.features}</span>
                <div>
                  <h2>{words.features}</h2>
                  <ul>
                    {project.caseStudy.features.map((feature) => (
                      <li key={feature.en}>{feature[locale]}</li>
                    ))}
                  </ul>
                </div>
              </section>
              <section className="case-chapter" id="stack">
                <span className="mono">07 / {words.stack}</span>
                <div>
                  <h2>{words.stack}</h2>
                  <ul className="clarity-inline-list">
                    {project.stack.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>
                </div>
              </section>
              <section className="case-chapter" id="result">
                <span className="mono">08 / {words.result}</span>
                <div>
                  <h2>{words.result}</h2>
                  <p>{project.caseStudy.result[locale]}</p>
                </div>
              </section>
              <section className="case-chapter" id="links">
                <span className="mono">09 / {words.links}</span>
                <div>
                  <h2>{words.links}</h2>
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
                        label={
                          locale === "fr" ? "Code GitHub" : "GitHub source"
                        }
                      />
                    ) : null}
                  </div>
                </div>
              </section>
            </div>
          </div>
          {project.id === "greecheck" ? (
            <div className="case-gallery">
              {greeCheckStorySteps
                .filter((step) =>
                  ["scan", "product", "compare"].includes(step.id),
                )
                .map((step) => (
                  <figure key={step.id}>
                    <Image
                      src={step.src}
                      alt={step.alt[locale]}
                      width={1440}
                      height={900}
                      sizes="(max-width: 760px) 90vw, 30vw"
                    />
                    <figcaption>{step.detail[locale]}</figcaption>
                  </figure>
                ))}
            </div>
          ) : null}
        </article>

        <nav className="case-next" aria-label={words.next}>
          <div>
            <span className="mono">
              {words.next} / {next.category[locale]}
            </span>
            <a href={`/${locale}/work/${next.slug}`}>{next.name} ↗</a>
          </div>
          <a className="mono" href={`/${locale}#projets`}>
            {words.back} ↑
          </a>
        </nav>
      </div>
    </main>
  );
}

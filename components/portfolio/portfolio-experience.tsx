import { PreferencesProvider } from "@/components/system/preferences";
import { Navigation } from "@/components/system/navigation";
import { CommandPalette } from "@/components/system/command-palette";
import { Constellation } from "@/components/system/constellation";
import { MotionSystem } from "@/components/system/motion-system";
import { EasterEggs } from "@/components/system/easter-eggs";
import { Hero } from "@/components/portfolio/hero";
import { Projects } from "@/components/portfolio/projects";
import { KnowledgeSystem } from "@/components/portfolio/knowledge-system";
import { About } from "@/components/portfolio/about";
import { Contact } from "@/components/portfolio/contact";
import { profile, type Locale } from "@/lib/portfolio-data";
import { education } from "@/lib/knowledge-data";
import { greeCheck } from "@/lib/work-data";
import { SITE_ORIGIN } from "@/lib/seo";

export function PortfolioExperience({ locale }: { locale: Locale }) {
  const personId = `${SITE_ORIGIN}/#person`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: profile.name,
        alternateName: profile.alias,
        url: `${SITE_ORIGIN}/${locale}`,
        jobTitle: profile.role[locale],
        email: `mailto:${profile.email}`,
        telephone: profile.phoneHref,
        sameAs: [profile.github, profile.linkedin],
        homeLocation: {
          "@type": "Place",
          name: profile.location[locale],
        },
        knowsLanguage: ["French", "Arabic", "English"],
        knowsAbout: [
          "React",
          "Next.js",
          "TypeScript",
          "Python",
          "FastAPI",
          "Docker",
          "CI/CD",
        ],
        alumniOf: {
          "@type": "EducationalOrganization",
          name: education.school,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_ORIGIN}/#website`,
        url: SITE_ORIGIN,
        name: "LOWKYZ // Hassan Haddane",
        inLanguage: ["fr-FR", "en-GB"],
        author: { "@id": personId },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${greeCheck.url}#application`,
        name: greeCheck.name,
        url: greeCheck.url,
        operatingSystem: "Web",
        description: greeCheck.summary[locale],
        author: { "@id": personId },
      },
    ],
  };

  return (
    <div lang={locale}>
      <PreferencesProvider initialLocale={locale}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        <Constellation />
        <MotionSystem />
        <EasterEggs />
      <Navigation />
        <main id="main" tabIndex={-1}>
          <Hero />
          <Projects />
          <KnowledgeSystem />
          <About />
          <Contact />
        </main>
        <CommandPalette />
      </PreferencesProvider>
    </div>
  );
}

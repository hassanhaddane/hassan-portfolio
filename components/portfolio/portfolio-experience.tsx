import { PreferencesProvider } from "@/components/system/preferences";
import { Navigation } from "@/components/system/navigation";
import { CommandPalette } from "@/components/system/command-palette";
import { NarrativeEnvironment } from "@/components/system/narrative-environment";
import { LivingSignal } from "@/components/system/living-signal";
import { Hero } from "@/components/portfolio/hero";
import { SelectedWork } from "@/components/portfolio/selected-work";
import { EngineeringJourney } from "@/components/portfolio/engineering-journey";
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
    <div lang={locale} data-portfolio-root>
      <PreferencesProvider initialLocale={locale}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <div data-site-content>
          <Navigation />
          <NarrativeEnvironment />
          <LivingSignal />
          <main id="main" tabIndex={-1}>
            <Hero locale={locale} />
            <SelectedWork locale={locale} />
            <EngineeringJourney locale={locale} />
            <About locale={locale} />
            <Contact />
          </main>
          <CommandPalette />
        </div>
      </PreferencesProvider>
    </div>
  );
}

import { PreferencesProvider } from "@/components/system/preferences";
import { Navigation } from "@/components/system/navigation";
import { CommandPalette } from "@/components/system/command-palette";
import { Constellation } from "@/components/system/constellation";
import { MotionSystem } from "@/components/system/motion-system";
import { EasterEggs } from "@/components/system/easter-eggs";
import { Hero } from "@/components/portfolio/hero";
import { ProjectsV2 } from "@/components/portfolio/projects-v2";
import "@/app/work-showcase.css";
import { JourneyExpertiseV2 } from "@/components/portfolio/journey-expertise-v2";
import "@/app/journey-expertise-v2.css";
import { AboutV2 } from "@/components/portfolio/about-v2";
import { CreativeLabV2 } from "@/components/portfolio/creative-lab-v2";
import { ContactV2 } from "@/components/portfolio/contact-v2";
import "@/app/personal-lab-contact-v2.css";
import "@/app/presentation-modes-v2.css";
import { profile, type Locale } from "@/lib/portfolio-data";
import { education } from "@/lib/knowledge-data";
import { greeCheck } from "@/lib/work-data";
import { SITE_ORIGIN } from "@/lib/seo";
import { IntroProvider } from "@/components/intro/intro-context";
import { Intro } from "@/components/intro/intro";

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
      <script dangerouslySetInnerHTML={{ __html: "try{var p=JSON.parse(localStorage.getItem('lowkyz.preferences.v1')||'{}');var m=p.mode==='explore'?'explore':'recruiter';var r=matchMedia('(prefers-reduced-motion: reduce)').matches;var t=p.theme==='light'||p.theme==='dark'?p.theme:matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;document.documentElement.dataset.mode=m;document.documentElement.dataset.motion=p.motion===false||r?'off':'on';document.documentElement.dataset.expressiveMotion=m==='explore'&&p.motion!==false&&!r?'on':'off';if(m==='recruiter')document.documentElement.removeAttribute('data-intro-pending')}catch(e){document.documentElement.dataset.mode='recruiter';document.documentElement.dataset.expressiveMotion='off';document.documentElement.removeAttribute('data-intro-pending')}" }} />
      <PreferencesProvider initialLocale={locale}>
        <IntroProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
          />
          <Constellation />
          <MotionSystem />
          <EasterEggs />
          <Navigation />
          <Intro />
          <main id="main" tabIndex={-1}>
            <Hero />
            <ProjectsV2 />
            <JourneyExpertiseV2 />
            <AboutV2 />
            <CreativeLabV2 />
            <ContactV2 />
          </main>
          <CommandPalette />
        </IntroProvider>
      </PreferencesProvider>
    </div>
  );
}

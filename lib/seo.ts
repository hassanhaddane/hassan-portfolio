import type { Metadata } from "next";
import type { Locale } from "./portfolio-data";

export const SITE_ORIGIN = "https://www.lowkyz.dev";

export const seoContent = {
  fr: {
    title: "Hassan Haddane — Développeur Full-Stack",
    description:
      "Hassan Haddane, développeur Full-Stack Bac+5 à Rennes, avec plus de trois ans d’expérience professionnelle. Applications, API, interfaces et projets audio.",
    ogDescription:
      "Développeur Full-Stack · Rennes · 3+ ans d’expérience · Bac+5",
  },
  en: {
    title: "Hassan Haddane — Full-Stack Developer",
    description:
      "Hassan Haddane, a Full-Stack Developer in Rennes with a master’s level degree and over three years of professional experience. Applications, APIs, interfaces and audio projects.",
    ogDescription:
      "Full-Stack Developer · Rennes · 3+ years of experience · Master’s level degree",
  },
} as const;

export function localeMetadata(locale: Locale): Metadata {
  const content = seoContent[locale];
  const path = `/${locale}`;
  return {
    title: content.title,
    description: content.description,
    keywords: [
      "Hassan Haddane",
      "LOWKYZ",
      "Développeur Full-Stack",
      "Full-Stack Developer",
      "React",
      "Next.js",
      "TypeScript",
      "Python",
      "FastAPI",
      "Rennes",
    ],
    authors: [{ name: "Hassan Haddane", url: SITE_ORIGIN }],
    creator: "Hassan Haddane",
    alternates: {
      canonical: path,
      languages: {
        "fr-FR": "/fr",
        en: "/en",
        "x-default": "/fr",
      },
    },
    openGraph: {
      title: content.title,
      description: content.ogDescription,
      url: path,
      siteName: "LOWKYZ // Hassan Haddane",
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      alternateLocale: locale === "fr" ? ["en_GB"] : ["fr_FR"],
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "LOWKYZ — Hassan Haddane, Full-Stack Developer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.ogDescription,
      images: ["/opengraph-image"],
    },
    robots: { index: true, follow: true },
  };
}

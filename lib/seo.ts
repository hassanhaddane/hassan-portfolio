import type { Metadata } from "next";
import type { Locale } from "./portfolio-data";

export const SITE_ORIGIN = "https://www.lowkyz.xyz";

export const seoContent = {
  fr: {
    title: "Hassan Haddane — Développeur Web Full-Stack | React, Next.js, Python",
    description: "Portfolio de Hassan Haddane, développeur Web Full-Stack à Rennes. React, Next.js, TypeScript, Python, FastAPI, qualité et DevOps.",
    ogDescription: "Développeur Web Full-Stack à Rennes · React · Next.js · TypeScript · Python",
  },
  en: {
    title: "Hassan Haddane — Full-Stack Web Developer | React, Next.js, Python",
    description: "Hassan Haddane’s portfolio. Full-Stack Web Developer in Rennes working with React, Next.js, TypeScript, Python, FastAPI, quality and DevOps.",
    ogDescription: "Full-Stack Web Developer in Rennes · React · Next.js · TypeScript · Python",
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
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "LOWKYZ — Hassan Haddane, Full-Stack Developer" }],
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

import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/seo";
import { projects } from "@/lib/work-data";
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    "fr-FR": `${SITE_ORIGIN}/fr`,
    en: `${SITE_ORIGIN}/en`,
  };
  const home = ["fr", "en"].map((locale) => ({
    url: `${SITE_ORIGIN}/${locale}`,
    changeFrequency: "monthly" as const,
    priority: locale === "fr" ? 1 : 0.9,
    alternates: { languages },
  }));
  const cases = projects.flatMap((project) => (["fr", "en"] as const).map((locale) => ({
    url: `${SITE_ORIGIN}/${locale}/work/${project.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: { languages: {
      "fr-FR": `${SITE_ORIGIN}/fr/work/${project.slug}`,
      en: `${SITE_ORIGIN}/en/work/${project.slug}`,
    } },
  })));
  return [...home, ...cases];
}

import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    "fr-FR": `${SITE_ORIGIN}/fr`,
    en: `${SITE_ORIGIN}/en`,
  };
  return ["fr", "en"].map((locale) => ({
    url: `${SITE_ORIGIN}/${locale}`,
    changeFrequency: "monthly" as const,
    priority: locale === "fr" ? 1 : 0.9,
    alternates: { languages },
  }));
}

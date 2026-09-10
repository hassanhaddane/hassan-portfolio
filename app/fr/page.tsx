import { PortfolioExperience } from "@/components/portfolio/portfolio-experience";
import { localeMetadata } from "@/lib/seo";

export const metadata = localeMetadata("fr");

export default function FrenchPortfolioPage() {
  return <PortfolioExperience locale="fr" />;
}

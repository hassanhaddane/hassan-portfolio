import { PortfolioExperience } from "@/components/portfolio/portfolio-experience";
import { localeMetadata } from "@/lib/seo";

export const metadata = localeMetadata("en");

export default function EnglishPortfolioPage() {
  return <PortfolioExperience locale="en" />;
}

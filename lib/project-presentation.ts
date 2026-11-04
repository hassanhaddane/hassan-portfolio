import { text, type Localized } from "./portfolio-data";
import type { Project } from "./work-data";

export const projectPresentation: Record<
  Project["id"],
  { note: Localized; axis: string }
> = {
  greecheck: {
    note: text("Scan, score et comparaison", "Scan, score and comparison"),
    axis: "01 / PRODUCT LOGIC",
  },
  bloom: {
    note: text(
      "Média, studio et culture hip-hop",
      "Media, studio and hip-hop culture",
    ),
    axis: "02 / CULTURAL FREQUENCY",
  },
  "tech-express": {
    note: text(
      "Catalogue EN/AR et parcours de devis",
      "EN/AR catalogue and quote journey",
    ),
    axis: "03 / INTERFACE SYSTEM",
  },
  ceo19: {
    note: text("Musique, identité et archives", "Music, identity and archives"),
    axis: "04 / ARTIST WORLD",
  },
};

import type { VisualDNA } from "@/lib/types";

/**
 * «Iron & Ash» — визуальное направление тестовой вертикали barber.
 * Выбрано сознательно НАПРОТИВ Botanical Noir у florist: холодный
 * антрацит вместо тёплого битумно-коричневого, жёсткий
 * barber-pole-красный вместо приглушённого бордового, конденсированный
 * индустриальный display-шрифт вместо Didone-засечки, "clip"-motion
 * вместо "drift". Та же форма VisualDNA, что у florist — доказывает, что
 * тип вертикально-нейтрален, а не то, что вертикали похожи внешне.
 */
export const barberVisualDNA: VisualDNA = {
  vertical: "barber",
  mood: ["sharp", "confident", "industrial", "precise"],
  colorPalette: {
    primary: "#B3341F",
    secondary: "#4A4A4F",
    accent: "#C9A227",
    background: "#0E0E10",
    foreground: "#F5F5F0",
  },
  typography: {
    display: "condensed industrial display sans (Bebas Neue / Druk Condensed class)",
    heading: "same condensed family, lighter weight",
    body: "grotesque sans (Neue Haas Grotesk / Suisse Int'l class; Inter fallback)",
  },
  imageryStyle: "high-contrast-barbershop-editorial",
  motionPersonality: "precision-snap",
};

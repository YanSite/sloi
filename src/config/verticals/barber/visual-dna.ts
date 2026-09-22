import type { VisualDNA } from "@/lib/types";

/**
 * "Iron & Ash" — the barber test vertical's visual direction. Chosen
 * deliberately AGAINST florist's Botanical Noir: cool charcoal instead of
 * warm bitumen-brown, a hard barber-pole red instead of a muted burgundy,
 * a condensed industrial display face instead of a Didone serif, "clip"
 * motion instead of "drift". Same VisualDNA shape as florist's — proves
 * the type is vertical-agnostic, not that the two verticals look alike.
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

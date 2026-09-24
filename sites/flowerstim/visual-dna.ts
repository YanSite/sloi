import type { VisualDNA } from "@/lib/types";

/**
 * Visual DNA Flowerstim — снята с утверждённого прототипа
 * (design-reference/flowerstim/DESIGN-HANDOFF.md §1), а не с вертикального
 * «Botanical Noir» из docs/visual-dna.md: у Site Instance собственный
 * утверждённый дизайн, и при конфликте приоритет у него.
 *
 * Палитра → роли прототипа: primary — ink (заголовки, primary CTA),
 * foreground — основной текст, accent — dusty rose `<em>`/hover,
 * secondary — цвет ссылок, background — ivory фон и clear color WebGL.
 */
export const flowerstimVisualDNA: VisualDNA = {
  vertical: "florist",
  mood: ["light", "editorial", "airy", "tactile", "cinematic"],
  colorPalette: {
    primary: "#1F1B18",
    secondary: "#8A5F59",
    accent: "#7A534D",
    background: "#F6F2EA",
    foreground: "#2B2723",
  },
  typography: {
    display: "Cormorant Garamond 500 (+ italic 500)",
    heading: "Cormorant Garamond 500",
    body: "Onest 400/500; labels — IBM Plex Mono 400/500",
  },
  imageryStyle: "light-atelier-daylight",
  motionPersonality: "cinematic-camera",
};

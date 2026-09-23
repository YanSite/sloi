import type { VisualDNA } from "@/lib/types";

/**
 * Утверждённое художественное направление вертикали florist — «Botanical
 * Noir». Значения здесь точно совпадают с
 * /docs/visual-dna.md#mapping-to-the-visualdna-type. Полный творческий
 * бриф (язык освещения, объектива, камеры, WebGL и negative-visual-rules)
 * живёт только в этом документе — этот тип несёт лишь токены, которые
 * напрямую читает компонент или Higgsfield-промпт.
 */
export const floristVisualDNA: VisualDNA = {
  vertical: "florist",
  mood: ["reverent", "unhurried", "tactile", "quietly-dramatic"],
  colorPalette: {
    primary: "#6E2B34",
    secondary: "#4A5240",
    accent: "#B08D57",
    background: "#15110D",
    foreground: "#F3ECDF",
  },
  typography: {
    display: "Didone-register serif (Canela / GT Sectra Display class)",
    heading: "same family, lighter weight",
    body: "humanist sans (Söhne / National 2 class; Inter fallback)",
  },
  imageryStyle: "botanical-noir-still-life",
  motionPersonality: "gravity-drift",
};

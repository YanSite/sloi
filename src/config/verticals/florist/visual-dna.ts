import type { VisualDNA } from "@/lib/types";

/**
 * Approved art direction for the florist vertical — "Botanical Noir".
 * Values here match /docs/visual-dna.md#mapping-to-the-visualdna-type
 * exactly. The full creative brief (lighting, lens, camera, WebGL and
 * negative-visual-rules language) lives only in that document — this
 * type carries just the tokens a component or a Higgsfield prompt reads
 * directly.
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

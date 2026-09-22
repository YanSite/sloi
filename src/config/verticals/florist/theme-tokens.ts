import type { ThemeTokens } from "@/lib/types";

/**
 * Resolves /docs/visual-dna.md's Botanical Noir direction into concrete,
 * CSS-ready values. Where visual-dna.ts's `typography` carries a reference
 * class ("Didone-register serif..."), these are real `font-family` fallback
 * stacks a stylesheet can use as-is.
 */
export const floristThemeTokens: ThemeTokens = {
  vertical: "florist",
  colors: {
    background: "#15110D",
    foreground: "#F3ECDF",
    primary: "#6E2B34",
    secondary: "#4A5240",
    accent: "#B08D57",
  },
  fonts: {
    display: '"Canela", "GT Sectra Display", Georgia, serif',
    heading: '"Canela", "GT Sectra Display", Georgia, serif',
    body: '"Söhne", "National 2", Inter, sans-serif',
  },
};

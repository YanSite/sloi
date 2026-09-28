import type { ThemeTokens } from "@/lib/types";
import { resolveTheme } from "@/lib/theme";
import { estemoVisualDNA } from "./visual-dna";

/** Шрифты — те же локальные woff2 с кириллицей, что в прототипе (`assets/fonts/fonts.css`). */
export const estemoThemeTokens: ThemeTokens = resolveTheme(estemoVisualDNA, {
  display: "'Cormorant Garamond', serif",
  heading: "'Cormorant Garamond', serif",
  body: "'Onest', sans-serif",
});

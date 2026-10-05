import type { ThemeTokens } from "@/lib/types";
import { resolveTheme } from "@/lib/theme";
import { ecpVisualDNA } from "./visual-dna";

/** Geologica 300–600 — локальные woff2 с кириллицей (`assets/fonts/fonts.css`). */
export const ecpThemeTokens: ThemeTokens = resolveTheme(ecpVisualDNA, {
  display: "Geologica, 'Helvetica Neue', Arial, sans-serif",
  heading: "Geologica, 'Helvetica Neue', Arial, sans-serif",
  body: "Geologica, 'Helvetica Neue', Arial, sans-serif",
});

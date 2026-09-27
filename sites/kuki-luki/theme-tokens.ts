import type { ThemeTokens } from "@/lib/types";
import { resolveTheme } from "@/lib/theme";
import { kukiLukiVisualDNA } from "./visual-dna";

/** Geologica 300–600 — локальные woff2 с кириллицей (`assets/fonts/fonts.css`), как в прототипе. */
export const kukiLukiThemeTokens: ThemeTokens = resolveTheme(kukiLukiVisualDNA, {
  display: "'Geologica', system-ui, sans-serif",
  heading: "'Geologica', system-ui, sans-serif",
  body: "'Geologica', system-ui, sans-serif",
});

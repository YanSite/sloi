import type { ThemeTokens } from "@/lib/types";
import { resolveTheme } from "@/lib/theme";
import { kukiLukiVisualDNA } from "./visual-dna";

/**
 * Geologica (Google Fonts, веса 300/400/500/600) — шрифт прототипа.
 * Подключается в app/layout.tsx через next/font/google или <link>, как
 * уже принято в репозитории.
 */
export const kukiLukiThemeTokens: ThemeTokens = resolveTheme(kukiLukiVisualDNA, {
  display: '"Geologica", system-ui, sans-serif',
  heading: '"Geologica", system-ui, sans-serif',
  body: '"Geologica", system-ui, sans-serif',
});

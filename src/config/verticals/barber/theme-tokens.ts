import type { ThemeTokens } from "@/lib/types";
import { resolveTheme } from "@/lib/theme";
import { barberVisualDNA } from "./visual-dna";

/**
 * Резолвит `barberVisualDNA` в конкретные, готовые к CSS значения через
 * тот же `resolveTheme`, которым пользуется вертикаль florist
 * (src/lib/theme/resolve-theme.ts) — цвета берутся напрямую из палитры
 * VisualDNA, поэтому не могут разойтись. Переопределяет `radius` на
 * резкую, индустриальную шкалу вместо общей по умолчанию (та даёт
 * florist-овский pill-образный CTA) — конкретное, проверяемое визуальное
 * отличие от Botanical Noir, которое ничего не стоит движку.
 */
export const barberThemeTokens: ThemeTokens = resolveTheme(
  barberVisualDNA,
  {
    display: '"Bebas Neue", "Druk Condensed", Impact, sans-serif',
    heading: '"Bebas Neue", "Druk Condensed", Impact, sans-serif',
    body: '"Neue Haas Grotesk", "Suisse Int\'l", Inter, sans-serif',
  },
  {
    radius: { none: "0px", sm: "0.125rem", md: "0.25rem", lg: "0.25rem", full: "0.25rem" },
  },
);

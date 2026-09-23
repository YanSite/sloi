import type { ThemeTokens } from "@/lib/types";
import { resolveTheme } from "@/lib/theme";
import { floristVisualDNA } from "./visual-dna";

/**
 * Резолвит `floristVisualDNA` (Botanical Noir, см. /docs/visual-dna.md) в
 * конкретные, готовые к CSS значения через универсальный `resolveTheme` —
 * цвета берутся из палитры VisualDNA, а не дублируются вручную, поэтому
 * не могут разойтись. Там, где `typography` в visual-dna.ts несёт
 * референсный класс ("Didone-register serif..."), эти `fonts` — реальные
 * `font-family` fallback-цепочки, готовые к использованию в стилях; их
 * выбор — решение человека, которое `resolveTheme` намеренно оставляет
 * вызывающей стороне. Шкала spacing/radius/shadow/transition/breakpoint
 * для Botanical Noir — общая по умолчанию (см. /lib/theme/default-scale.ts)
 * — ничто в утверждённых доках не требует отдельной под florist.
 */
export const floristThemeTokens: ThemeTokens = resolveTheme(floristVisualDNA, {
  display: '"Canela", "GT Sectra Display", Georgia, serif',
  heading: '"Canela", "GT Sectra Display", Georgia, serif',
  body: '"Söhne", "National 2", Inter, sans-serif',
});

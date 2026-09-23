import type { ThemeFontTokens, ThemeTokens, VisualDNA } from "@/lib/types";
import { defaultThemeScale, type ThemeScale } from "./default-scale";

/**
 * Единственное место, где `VisualDNA` становится `ThemeTokens` — VisualDNA
 * управляет темой, а не наоборот. Цвета берутся напрямую из
 * `visualDNA.colorPalette`; другого способа получить `ThemeTokens` нет,
 * поэтому вертикаль не может вручную создать тему с цветами, отличными от
 * утверждённой VisualDNA. `fonts` остаётся явным аргументом, а не
 * выводится автоматически: поле typography в VisualDNA — это описательная
 * референсная строка ("Didone-register serif (Canela / GT Sectra Display
 * class)"), а не реальный `font-family` stack — выбор конкретной
 * лицензии/fallback-цепочки это решение человека, а не то, что стоит
 * имитировать автоматикой. `scale` (spacing, radius, shadows, transitions,
 * breakpoints) по умолчанию берётся из общей базы в `default-scale.ts` и
 * может быть переопределён по каждому полю отдельно.
 */
export function resolveTheme(
  visualDNA: VisualDNA,
  fonts: ThemeFontTokens,
  scale: Partial<ThemeScale> = {},
): ThemeTokens {
  return {
    vertical: visualDNA.vertical,
    colors: visualDNA.colorPalette,
    fonts,
    spacing: scale.spacing ?? defaultThemeScale.spacing,
    radius: scale.radius ?? defaultThemeScale.radius,
    shadows: scale.shadows ?? defaultThemeScale.shadows,
    transitions: scale.transitions ?? defaultThemeScale.transitions,
    breakpoints: scale.breakpoints ?? defaultThemeScale.breakpoints,
  };
}

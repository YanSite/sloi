import type { ThemeFontTokens, ThemeTokens, VisualDNA } from "@/lib/types";
import { defaultThemeScale, type ThemeScale } from "./default-scale";

/**
 * The one place a `VisualDNA` becomes a `ThemeTokens` — VisualDNA governs
 * theme, not the other way around. Colors come directly from
 * `visualDNA.colorPalette`; there is no other way to produce a
 * `ThemeTokens`, so a vertical can't hand-author one whose colors drift
 * from its approved VisualDNA. `fonts` stays an explicit argument rather
 * than derived: VisualDNA's typography field is a descriptive reference
 * ("Didone-register serif (Canela / GT Sectra Display class)"), not a
 * real `font-family` stack — picking the actual license/fallback chain is
 * a human decision, not something to fake-automate. `scale` (spacing,
 * radius, shadows, transitions, breakpoints) defaults to the shared
 * baseline in `default-scale.ts` and can be overridden per field.
 */
export function resolveTheme(
  visualDNA: VisualDNA,
  fonts: ThemeFontTokens,
  scale: Partial<ThemeScale> = {}
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

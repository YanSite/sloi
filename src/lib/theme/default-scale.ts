import type {
  ThemeBreakpointTokens,
  ThemeRadiusTokens,
  ThemeShadowTokens,
  ThemeSpacingTokens,
  ThemeTransitionTokens,
} from "@/lib/types";

export interface ThemeScale {
  spacing: ThemeSpacingTokens;
  radius: ThemeRadiusTokens;
  shadows: ThemeShadowTokens;
  transitions: ThemeTransitionTokens;
  breakpoints: ThemeBreakpointTokens;
}

/**
 * Shared baseline for every token category VisualDNA doesn't itself
 * describe — VisualDNA speaks in mood/palette/lighting/type (see
 * /docs/visual-dna.md), not a numeric spacing or shadow scale.
 * `resolveTheme` falls back to this unless a vertical explicitly
 * overrides part of it; most verticals shouldn't need to.
 */
export const defaultThemeScale: ThemeScale = {
  spacing: { xs: "0.5rem", sm: "1rem", md: "1.5rem", lg: "2.5rem", xl: "4rem", "2xl": "6rem" },
  radius: { none: "0px", sm: "0.25rem", md: "0.5rem", lg: "1rem", full: "9999px" },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.4)",
    md: "0 4px 16px rgba(0,0,0,0.45)",
    lg: "0 12px 40px rgba(0,0,0,0.5)",
  },
  transitions: { fast: "150ms ease", base: "300ms ease", slow: "600ms ease" },
  breakpoints: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px" },
};

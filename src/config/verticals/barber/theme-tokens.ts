import type { ThemeTokens } from "@/lib/types";
import { resolveTheme } from "@/lib/theme";
import { barberVisualDNA } from "./visual-dna";

/**
 * Resolves `barberVisualDNA` into concrete, CSS-ready values via the same
 * `resolveTheme` the florist vertical uses (src/lib/theme/resolve-theme.ts)
 * — colors come straight from the VisualDNA palette, so they can't drift.
 * Overrides `radius` to a sharp, industrial scale instead of accepting
 * the shared default (which produces florist's pill-shaped CTA) — a
 * concrete, verifiable visual difference from Botanical Noir that costs
 * nothing in the engine.
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
  }
);

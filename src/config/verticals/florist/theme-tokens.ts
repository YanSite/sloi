import type { ThemeTokens } from "@/lib/types";
import { resolveTheme } from "@/lib/theme";
import { floristVisualDNA } from "./visual-dna";

/**
 * Resolves `floristVisualDNA` (Botanical Noir, see /docs/visual-dna.md)
 * into concrete, CSS-ready values via the generic `resolveTheme` — colors
 * come from the VisualDNA's palette, not hand-duplicated here, so they
 * can't drift out of sync. Where visual-dna.ts's `typography` carries a
 * reference class ("Didone-register serif..."), these `fonts` are real
 * `font-family` fallback stacks a stylesheet can use as-is; picking them
 * is a human decision `resolveTheme` deliberately leaves to the caller.
 * Botanical Noir's spacing/radius/shadow/transition/breakpoint scale is
 * the shared default (see /lib/theme/default-scale.ts) — nothing in the
 * approved docs calls for a florist-specific one.
 */
export const floristThemeTokens: ThemeTokens = resolveTheme(floristVisualDNA, {
  display: '"Canela", "GT Sectra Display", Georgia, serif',
  heading: '"Canela", "GT Sectra Display", Georgia, serif',
  body: '"Söhne", "National 2", Inter, sans-serif',
});

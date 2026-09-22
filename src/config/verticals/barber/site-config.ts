import type { SiteConfig } from "@/lib/types";
import { assertValidSiteConfig } from "@/lib/validation";
import { barberTemplate } from "@/templates/barber.template";
import { barberBusinessProfile } from "./business-profile";
import { barberVisualDNA } from "./visual-dna";
import { barberContent } from "./content";
import { barberAssetManifest } from "./asset-manifest";
import { barberThemeTokens } from "./theme-tokens";

/**
 * Composes the barber test vertical into one SiteConfig — Business
 * Profile, "Iron & Ash" Visual DNA, Experience, Content, Asset Manifest,
 * Theme, Motion. Built with the exact same layers/functions as
 * floristSiteConfig (same `SiteConfig` shape, same `resolveTheme`, same
 * `defineContent`, same `assertValidSiteConfig`) — that reuse, not any
 * visual similarity, is the point of Stage 8's portability test.
 */
export const barberSiteConfig: SiteConfig = assertValidSiteConfig({
  business: barberBusinessProfile,
  visualDNA: barberVisualDNA,
  experience: barberTemplate,
  content: barberContent,
  assets: barberAssetManifest,
  theme: barberThemeTokens,
  motion: { preset: "fade-in", duration: 0.5 },
});

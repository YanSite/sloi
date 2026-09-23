import type { SiteConfig } from "@/lib/types";
import { assertValidSiteConfig } from "@/lib/validation";
import { barberTemplate } from "@/templates/barber.template";
import { barberBusinessProfile } from "./business-profile";
import { barberVisualDNA } from "./visual-dna";
import { barberContent } from "./content";
import { barberAssetManifest } from "./asset-manifest";
import { barberThemeTokens } from "./theme-tokens";

/**
 * Собирает тестовую вертикаль barber в один SiteConfig — Business
 * Profile, «Iron & Ash» Visual DNA, Experience, Content, Asset Manifest,
 * Theme, Motion. Построен на тех же слоях/функциях, что и
 * floristSiteConfig (та же форма `SiteConfig`, тот же `resolveTheme`, тот
 * же `defineContent`, тот же `assertValidSiteConfig`) — именно это
 * переиспользование, а не визуальное сходство, и есть суть
 * portability-теста Stage 8.
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

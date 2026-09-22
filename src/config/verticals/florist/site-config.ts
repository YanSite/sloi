import type { SiteConfig } from "@/lib/types";
import { assertValidSiteConfig } from "@/lib/validation";
import { floristTemplate } from "@/templates/florist.template";
import { floristBusinessProfile } from "./business-profile";
import { floristVisualDNA } from "./visual-dna";
import { floristContent } from "./content";
import { floristAssetManifest } from "./asset-manifest";
import { floristThemeTokens } from "./theme-tokens";

/**
 * Composes every approved florist config layer — Business Profile,
 * Botanical Noir Visual DNA, the 10-scene Experience, Content, Asset
 * Manifest, Theme, Motion — into one SiteConfig (Stage 8's portability
 * test, part 1). Now that `floristContent` carries real (placeholder)
 * copy for every section, this is validated at module load like
 * `demoSiteConfig`/`abstractTestSiteConfig`, and registered in the
 * preview registry as "florist".
 */
export const floristSiteConfig: SiteConfig = assertValidSiteConfig({
  business: floristBusinessProfile,
  visualDNA: floristVisualDNA,
  experience: floristTemplate,
  content: floristContent,
  assets: floristAssetManifest,
  theme: floristThemeTokens,
  motion: { preset: "fade-up", duration: 0.6 },
});

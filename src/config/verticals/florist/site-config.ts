import type { SiteConfig } from "@/lib/types";
import { floristTemplate } from "@/templates/florist.template";
import { floristBusinessProfile } from "./business-profile";
import { floristVisualDNA } from "./visual-dna";
import { floristContent } from "./content";
import { floristAssetManifest } from "./asset-manifest";
import { floristThemeTokens } from "./theme-tokens";

/**
 * Composes every florist config layer into one SiteConfig. This exists to
 * prove the type checks end to end, not to render anything — there is no
 * renderer yet (see /docs/engine-architecture.md's "Rendering (not yet
 * built)" section), and this file must not become one.
 */
export const floristSiteConfig: SiteConfig = {
  business: floristBusinessProfile,
  visualDNA: floristVisualDNA,
  experience: floristTemplate,
  content: floristContent,
  assets: floristAssetManifest,
  theme: floristThemeTokens,
  motion: { preset: "fade-up", duration: 0.6 },
};

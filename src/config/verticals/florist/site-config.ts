import type { SiteConfig } from "@/lib/types";
import { floristTemplate } from "@/templates/florist.template";
import { floristBusinessProfile } from "./business-profile";
import { floristVisualDNA } from "./visual-dna";
import { floristContent } from "./content";
import { floristAssetManifest } from "./asset-manifest";
import { floristThemeTokens } from "./theme-tokens";

/**
 * Composes every florist config layer into one SiteConfig. Deliberately
 * NOT run through `assertValidSiteConfig` (see
 * src/lib/validation/validate-site-config.ts) — `floristContent` is still
 * intentionally empty (no copy approved yet, see demo-content.ts), so
 * this fixture would fail the "required asset exists" check by design,
 * not by mistake. It exists to prove the type layers compile end to end,
 * not to render or to pass full validation — see `demoSiteConfig` and
 * `abstractTestSiteConfig` (both wrapped in `assertValidSiteConfig`) for
 * configs meant to be complete and render-ready.
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

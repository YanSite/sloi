import type { SiteConfig } from "@/lib/types";
import { assertValidSiteConfig } from "@/lib/validation";
import {
  floristBusinessProfile,
  floristVisualDNA,
  floristAssetManifest,
  floristThemeTokens,
} from "@/config/verticals/florist";
import { floristTemplate } from "@/templates/florist.template";
import { demoContent } from "./demo-content";

/**
 * Minimal fixture for verifying the renderer only — not a real site.
 * Reuses the real, approved florist business/visual/theme/asset layers
 * (Stage 1) and pairs them with `demoContent`'s placeholder copy, since
 * the real `floristContent` is still intentionally empty. Proves
 * `resolveSections`/`PageRenderer` can assemble all 10 enabled sections
 * from `floristTemplate.experienceMap`, in order. Validated once at
 * module load via `assertValidSiteConfig` — this fixture is meant to be
 * fully valid and render-ready, unlike `floristSiteConfig`.
 */
export const demoSiteConfig: SiteConfig = assertValidSiteConfig({
  business: floristBusinessProfile,
  visualDNA: floristVisualDNA,
  experience: floristTemplate,
  content: demoContent,
  assets: floristAssetManifest,
  theme: floristThemeTokens,
  motion: { preset: "fade-up", duration: 0.6 },
});

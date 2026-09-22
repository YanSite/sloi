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
 * Renderer proof-of-concept fixture from Stage 2, kept for regression
 * coverage now that `floristSiteConfig` (src/config/verticals/florist)
 * also has real placeholder content (Stage 8) — the two now largely
 * overlap; this one is pinned to its own `demoContent` rather than
 * merged into the vertical, so a future edit to florist's real content
 * can't silently break the original "all 10 sections assemble in order"
 * proof. Validated once at module load via `assertValidSiteConfig`.
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

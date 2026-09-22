import type { BusinessProfile } from "./business-profile";
import type { VisualDNA } from "./visual-dna";
import type { Template } from "./template";
import type { ExperienceContent } from "./content";
import type { AssetManifest } from "./asset-manifest";
import type { ThemeTokens } from "./theme-tokens";
import type { MotionConfig } from "./motion";

/**
 * SITE COMPOSITION layer — the top-level shape a renderer (not built yet,
 * see /docs/engine-architecture.md) will eventually consume:
 *
 *   SiteConfig = Business + VisualDNA + Experience + Content + Assets
 *                + Theme + Motion
 *
 * Every field is a business-specific VALUE of a vertical-agnostic TYPE.
 * Like every other type in this directory, this file must never import
 * from `src/config/verticals/*` or reference a vertical, a business
 * name, or a business-specific concept.
 */
export interface SiteConfig {
  business: BusinessProfile;
  visualDNA: VisualDNA;
  /** Which sections, in what order — see Template/ExperienceMap. */
  experience: Template;
  content: ExperienceContent;
  assets: AssetManifest;
  theme: ThemeTokens;
  /** Sitewide baseline motion; the two Signature WOW builds override this per section once a renderer exists. */
  motion?: MotionConfig;
}

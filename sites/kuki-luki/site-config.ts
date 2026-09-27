import type { SiteConfig } from "@/lib/types";
import { assertValidSiteConfig } from "@/lib/validation";
import { kukiLukiBusinessProfile } from "./business-profile";
import { kukiLukiVisualDNA } from "./visual-dna";
import { kukiLukiThemeTokens } from "./theme-tokens";
import { kukiLukiExperience } from "./experience-map";
import { kukiLukiContent } from "./content";
import { kukiLukiAssetManifest } from "./asset-manifest";
import { KukiLukiStage } from "./stage/KukiLukiStage";

/**
 * SiteConfig Куки Луки — Site Instance поверх Engine: тот же
 * PageRenderer и section registry, а сцена из DOM-слоёв (generic
 * `@/components/wow/stage`) подключается через `sectionVariants`.
 * Обёрнут в assertValidSiteConfig — невалидный конфиг падает при импорте.
 */
export const kukiLukiSiteConfig: SiteConfig = assertValidSiteConfig({
  business: kukiLukiBusinessProfile,
  visualDNA: kukiLukiVisualDNA,
  experience: kukiLukiExperience,
  content: kukiLukiContent,
  assets: kukiLukiAssetManifest,
  theme: kukiLukiThemeTokens,
  sectionVariants: {
    "immersive-stage": { "kuki-luki": KukiLukiStage },
  },
});

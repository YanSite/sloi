import type { SiteConfig } from "@/lib/types";
import { assertValidSiteConfig } from "@/lib/validation";
import { flowerstimBusinessProfile } from "./business-profile";
import { flowerstimVisualDNA } from "./visual-dna";
import { flowerstimThemeTokens } from "./theme-tokens";
import { flowerstimExperience } from "./experience-map";
import { flowerstimContent } from "./content";
import { flowerstimAssetManifest } from "./asset-manifest";
import { FlowerstimStage } from "./stage/FlowerstimStage";

/**
 * Production SiteConfig Flowerstim («Эстетика цветов») — Site Instance
 * поверх Engine: тот же PageRenderer и section registry, а собственная
 * хореография сцены подключается через `sectionVariants`. Обёрнут в
 * assertValidSiteConfig — невалидный конфиг падает при импорте.
 */
export const flowerstimSiteConfig: SiteConfig = assertValidSiteConfig({
  business: flowerstimBusinessProfile,
  visualDNA: flowerstimVisualDNA,
  experience: flowerstimExperience,
  content: flowerstimContent,
  assets: flowerstimAssetManifest,
  theme: flowerstimThemeTokens,
  sectionVariants: {
    "immersive-stage": { flowerstim: FlowerstimStage },
  },
});

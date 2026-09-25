import type { SiteConfig } from "@/lib/types";
import { assertValidSiteConfig } from "@/lib/validation";
import { floristAtelierBusinessProfile } from "./business-profile";
import { floristAtelierVisualDNA } from "./visual-dna";
import { floristAtelierThemeTokens } from "./theme-tokens";
import { floristAtelierExperience } from "./experience-map";
import { floristAtelierContent } from "./content";
import { floristAtelierAssetManifest } from "./asset-manifest";
import { FloristAtelierStage } from "./stage/FloristAtelierStage";

/**
 * SiteConfig прототипа цветочного ателье — Site Instance
 * поверх Engine: тот же PageRenderer и section registry, а собственная
 * хореография сцены подключается через `sectionVariants`. Обёрнут в
 * assertValidSiteConfig — невалидный конфиг падает при импорте.
 */
export const floristAtelierSiteConfig: SiteConfig = assertValidSiteConfig({
  business: floristAtelierBusinessProfile,
  visualDNA: floristAtelierVisualDNA,
  experience: floristAtelierExperience,
  content: floristAtelierContent,
  assets: floristAtelierAssetManifest,
  theme: floristAtelierThemeTokens,
  sectionVariants: {
    "immersive-stage": { atelier: FloristAtelierStage },
  },
});

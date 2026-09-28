import type { SiteConfig } from "@/lib/types";
import { assertValidSiteConfig } from "@/lib/validation";
import { estemoBusinessProfile } from "./business-profile";
import { estemoVisualDNA } from "./visual-dna";
import { estemoThemeTokens } from "./theme-tokens";
import { estemoExperience } from "./experience-map";
import { estemoContent } from "./content";
import { estemoAssetManifest } from "./asset-manifest";
import { EstemoStage } from "./stage/EstemoStage";

/**
 * SiteConfig магазина цветов «Эстэмó» — Site Instance
 * поверх Engine: тот же PageRenderer и section registry, а собственная
 * хореография сцены подключается через `sectionVariants`. Обёрнут в
 * assertValidSiteConfig — невалидный конфиг падает при импорте.
 */
export const estemoSiteConfig: SiteConfig = assertValidSiteConfig({
  business: estemoBusinessProfile,
  visualDNA: estemoVisualDNA,
  experience: estemoExperience,
  content: estemoContent,
  assets: estemoAssetManifest,
  theme: estemoThemeTokens,
  sectionVariants: {
    "immersive-stage": { atelier: EstemoStage },
  },
});

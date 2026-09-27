import type { SiteConfig } from "@/lib/types";
import { assertValidSiteConfig } from "@/lib/validation";
import { kukiLukiTemplate } from "@/templates/kuki-luki.template";
import { kukiLukiBusinessProfile } from "./business-profile";
import { kukiLukiVisualDNA } from "./visual-dna";
import { kukiLukiContent } from "./content";
import { kukiLukiAssetManifest } from "./asset-manifest";
import { kukiLukiThemeTokens } from "./theme-tokens";

/**
 * Куки Луки: один immersive-stage вместо цепочки секций — так устроен
 * утверждённый прототип (13 битов, один жест = один кадр).
 * Ожидаемые warnings валидации: experience/missing-core-section для
 * cinematic-hero и final-cta (их роль выполняют S01 и S06 внутри сцены).
 */
export const kukiLukiSiteConfig: SiteConfig = assertValidSiteConfig({
  business: kukiLukiBusinessProfile,
  visualDNA: kukiLukiVisualDNA,
  experience: kukiLukiTemplate,
  content: kukiLukiContent,
  assets: kukiLukiAssetManifest,
  theme: kukiLukiThemeTokens,
  motion: { preset: "camera-parallax" },
});

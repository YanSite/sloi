import type { SiteConfig } from "@/lib/types";
import { assertValidSiteConfig } from "@/lib/validation";
import { floristTemplate } from "@/templates/florist.template";
import { floristBusinessProfile } from "./business-profile";
import { floristVisualDNA } from "./visual-dna";
import { floristContent } from "./content";
import { floristAssetManifest } from "./asset-manifest";
import { floristThemeTokens } from "./theme-tokens";

/**
 * Собирает все утверждённые слои конфигурации florist — Business
 * Profile, Botanical Noir Visual DNA, 10-сценовый Experience, Content,
 * Asset Manifest, Theme, Motion — в один SiteConfig (часть 1
 * portability-теста Stage 8). Теперь, когда `floristContent` несёт
 * реальный (placeholder) текст для каждой секции, конфиг валидируется
 * при загрузке модуля так же, как `demoSiteConfig`/`abstractTestSiteConfig`,
 * и зарегистрирован в preview registry как "florist".
 */
export const floristSiteConfig: SiteConfig = assertValidSiteConfig({
  business: floristBusinessProfile,
  visualDNA: floristVisualDNA,
  experience: floristTemplate,
  content: floristContent,
  assets: floristAssetManifest,
  theme: floristThemeTokens,
  motion: { preset: "fade-up", duration: 0.6 },
});

import type { SiteConfig } from "@/lib/types";
import { assertValidSiteConfig } from "@/lib/validation";
import { ecpBusinessProfile } from "./business-profile";
import { ecpVisualDNA } from "./visual-dna";
import { ecpThemeTokens } from "./theme-tokens";
import { ecpExperience } from "./experience-map";
import { ecpContent } from "./content";
import { ecpAssetManifest } from "./asset-manifest";
import { EcpStage } from "./stage/EcpStage";

/**
 * SiteConfig «Есть что показать» — Site Instance поверх Engine: тот же
 * PageRenderer и section registry, колода экранов подключается через
 * `sectionVariants`. Обёрнут в assertValidSiteConfig — невалидный
 * конфиг падает при импорте.
 *
 * Мета: заголовок и превью ссылки — имя и слоган (06_CONTENT_RU, «Мета»).
 * og:image ещё не готов (08_OPEN_QUESTIONS, п. 11).
 */
export const ecpSiteConfig: SiteConfig = assertValidSiteConfig({
  business: ecpBusinessProfile,
  visualDNA: ecpVisualDNA,
  experience: ecpExperience,
  content: ecpContent,
  assets: ecpAssetManifest,
  theme: ecpThemeTokens,
  sectionVariants: {
    "immersive-stage": { "est-chto-pokazat": EcpStage },
  },
  meta: {
    title: "Есть что показать — Делаем видимым то, что у вас уже есть",
    description: "Есть что показать — Делаем видимым то, что у вас уже есть",
    locale: "ru_RU",
  },
});

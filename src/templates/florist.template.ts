import type { Template } from "@/lib/types";

/**
 * Структура experience по умолчанию для вертикали florist. Только
 * порядок — без копирайта, стилей или ассетов. Порядок совпадает с
 * утверждённым scroll journey в /docs/experience-map.md §2 (внимание →
 * смысл → желание → широта → глубина → доверие → ясность → валидация →
 * заземление → действие).
 */
export const floristTemplate: Template = {
  vertical: "florist",
  name: "florist-default",
  experienceMap: [
    { section: "cinematic-hero", enabled: true },
    { section: "editorial-statement", enabled: true },
    { section: "product-reveal", enabled: true },
    { section: "editorial-grid", enabled: true },
    { section: "collection-showcase", enabled: true },
    { section: "story-section", enabled: true },
    { section: "service-section", enabled: true },
    { section: "social-proof", enabled: true },
    { section: "location-section", enabled: true },
    { section: "final-cta", enabled: true },
  ],
};

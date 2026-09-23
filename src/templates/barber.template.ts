import type { Template } from "@/lib/types";

/**
 * Структура experience по умолчанию для тестовой вертикали barber (часть
 * 2 портируемость-теста Stage 8). Та же форма, что и у
 * florist.template.ts, с двумя сознательными отличиями, реально
 * задействующими механизмы, которые florist ни разу не затрагивал:
 *
 * - "collection-showcase" отключена — барбершоп продаёт услуги, а не
 *   просматриваемую коллекцию товаров, и это реальная проверка того, что
 *   `enabled: false` корректно убирает секцию для второй вертикали.
 * - "product-reveal" использует вариант "image-parallax",
 *   зарегистрированный в src/lib/render/section-registry.ts с Stage 2, но
 *   ни разу не выбранный ни одним конфигом до этого момента — доказывает
 *   lookup section+variant по-настоящему, а не только структурно.
 */
export const barberTemplate: Template = {
  vertical: "barber",
  name: "barber-default",
  experienceMap: [
    { section: "cinematic-hero", enabled: true },
    { section: "editorial-statement", enabled: true },
    { section: "product-reveal", enabled: true, variant: "image-parallax" },
    { section: "editorial-grid", enabled: true },
    {
      section: "collection-showcase",
      enabled: false,
      notes: "Barber sells services, not a browsable collection.",
    },
    { section: "story-section", enabled: true },
    { section: "service-section", enabled: true },
    { section: "social-proof", enabled: true },
    { section: "location-section", enabled: true },
    { section: "final-cta", enabled: true },
  ],
};

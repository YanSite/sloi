import { defineContent } from "@/lib/render";

/**
 * НЕ утверждённый текст florist — каждая строка bracket-плейсхолдер, та
 * же конвенция, что в /src/config/verticals/florist/business-profile.ts.
 * Существует только для того, чтобы у `demo-site-config.ts` был валидный
 * контент для обязательных полей каждой секции, доказывающий, что
 * PageRenderer собирает все 10. Никакого реального копирайтинг-решения
 * здесь не принято — см. пометку «Out of scope» про текст в
 * /docs/experience-map.md. Обёрнут в `defineContent`, чтобы поля каждой
 * секции проверялись по её реальным пропсам (см. section-content.ts).
 */
export const demoContent = defineContent({
  "cinematic-hero": {
    headline: "[DEMO_HEADLINE]",
    media: { assetId: "hero-atmosphere", alt: "[DEMO_ALT]" },
  },
  "editorial-statement": {
    statement: "[DEMO_STATEMENT]",
  },
  "product-reveal": {
    title: "[DEMO_PRODUCT_TITLE]",
    media: { assetId: "flagship-bouquet", alt: "[DEMO_ALT]" },
  },
  "editorial-grid": {
    items: [
      { media: { assetId: "flagship-bouquet" }, caption: "[DEMO_CAPTION_1]" },
      { media: { assetId: "detail-texture" }, caption: "[DEMO_CAPTION_2]" },
      { media: { assetId: "atmospheric-editorial" }, caption: "[DEMO_CAPTION_3]" },
    ],
  },
  "collection-showcase": {
    title: "[DEMO_COLLECTION_TITLE]",
    items: [
      { id: "demo-1", name: "[DEMO_ITEM_1]", media: { assetId: "flagship-bouquet" } },
      { id: "demo-2", name: "[DEMO_ITEM_2]", media: { assetId: "atmospheric-editorial" } },
    ],
  },
  "story-section": {
    title: "[DEMO_STORY_TITLE]",
    body: "[DEMO_STORY_BODY]",
  },
  "service-section": {
    services: [
      { name: "[DEMO_SERVICE_1]" },
      { name: "[DEMO_SERVICE_2]" },
      { name: "[DEMO_SERVICE_3]" },
    ],
  },
  "social-proof": {
    testimonials: [{ quote: "[DEMO_QUOTE]", author: "[DEMO_AUTHOR]" }],
  },
  // у location-section здесь сознательно нет контента — обязательные
  // `contact`/`hours` подмешиваются из BusinessProfile внутри
  // resolveSections, а не авторятся как текст секции.
  "location-section": {},
  "final-cta": {
    headline: "[DEMO_CLOSING_HEADLINE]",
    cta: { label: "[DEMO_CTA_LABEL]", href: "#" },
  },
});

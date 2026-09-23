import { defineContent } from "@/lib/render";

/**
 * Текст секций для утверждённой конфигурации florist — везде
 * bracket-плейсхолдеры, та же конвенция, что и в business-profile.ts.
 * Никакого реального копирайтинг-решения здесь не принято (см. пометку
 * «Out of scope» в /docs/experience-map.md); файл существует, чтобы
 * доказать, что утверждённый 10-сценовый Experience рендерится целиком с
 * реальными слоями business/visual/asset/theme (portability-тест Stage
 * 8), а не чтобы поставить реальный маркетинговый текст. Обёрнут в
 * `defineContent`, чтобы поля каждой секции проверялись по её реальным
 * пропсам (см. src/lib/render/section-content.ts).
 */
export const floristContent = defineContent({
  "cinematic-hero": {
    eyebrow: "[FLORIST_EYEBROW]",
    headline: "[FLORIST_HERO_HEADLINE]",
    subheadline: "[FLORIST_HERO_SUBHEADLINE]",
    media: { assetId: "hero-atmosphere", alt: "[FLORIST_HERO_ALT]" },
    primaryCta: { label: "[FLORIST_PRIMARY_CTA]", href: "#" },
  },
  "editorial-statement": {
    statement: "[FLORIST_EDITORIAL_STATEMENT]",
  },
  "product-reveal": {
    title: "[FLORIST_PRODUCT_TITLE]",
    description: "[FLORIST_PRODUCT_DESCRIPTION]",
    media: { assetId: "flagship-bouquet", alt: "[FLORIST_PRODUCT_ALT]" },
    cta: { label: "[FLORIST_PRODUCT_CTA]", href: "#" },
  },
  "editorial-grid": {
    title: "[FLORIST_GRID_TITLE]",
    items: [
      { media: { assetId: "flagship-bouquet" }, caption: "[FLORIST_GRID_CAPTION_1]" },
      { media: { assetId: "detail-texture" }, caption: "[FLORIST_GRID_CAPTION_2]" },
      { media: { assetId: "atmospheric-editorial" }, caption: "[FLORIST_GRID_CAPTION_3]" },
    ],
  },
  "collection-showcase": {
    title: "[FLORIST_COLLECTION_TITLE]",
    items: [
      { id: "arrangement-1", name: "[FLORIST_ITEM_1]", media: { assetId: "flagship-bouquet" } },
      {
        id: "arrangement-2",
        name: "[FLORIST_ITEM_2]",
        media: { assetId: "atmospheric-editorial" },
      },
    ],
  },
  "story-section": {
    eyebrow: "[FLORIST_STORY_EYEBROW]",
    title: "[FLORIST_STORY_TITLE]",
    body: "[FLORIST_STORY_BODY]",
    media: { assetId: "workshop-photo", alt: "[FLORIST_STORY_ALT]" },
  },
  "service-section": {
    title: "[FLORIST_SERVICES_TITLE]",
    services: [
      { name: "[FLORIST_SERVICE_1]" },
      { name: "[FLORIST_SERVICE_2]" },
      { name: "[FLORIST_SERVICE_3]" },
    ],
  },
  "social-proof": {
    title: "[FLORIST_SOCIAL_PROOF_TITLE]",
    testimonials: [{ quote: "[FLORIST_TESTIMONIAL_1]", author: "[FLORIST_AUTHOR_1]" }],
  },
  "location-section": {
    title: "[FLORIST_LOCATION_TITLE]",
    mapMedia: { assetId: "storefront-photo", alt: "[FLORIST_LOCATION_ALT]" },
  },
  "final-cta": {
    headline: "[FLORIST_CLOSING_HEADLINE]",
    subheadline: "[FLORIST_CLOSING_SUBHEADLINE]",
    cta: { label: "[FLORIST_FINAL_CTA]", href: "#" },
  },
});

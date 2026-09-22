import { defineContent } from "@/lib/render";

/**
 * Section copy for the approved florist configuration — bracket
 * placeholders throughout, same convention as business-profile.ts. No
 * real copywriting decision is made here (see /docs/experience-map.md's
 * "Out of scope" note); this exists to prove the approved 10-scene
 * Experience renders end to end with real business/visual/asset/theme
 * layers (Stage 8's portability test), not to ship real marketing copy.
 * Wrapped in `defineContent` so every section's fields are checked
 * against its real props (see src/lib/render/section-content.ts).
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
      { id: "arrangement-2", name: "[FLORIST_ITEM_2]", media: { assetId: "atmospheric-editorial" } },
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

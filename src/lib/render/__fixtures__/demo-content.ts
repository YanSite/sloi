import type { ExperienceContent } from "@/lib/types";

/**
 * NOT approved florist copy — every string is a bracket placeholder, same
 * convention as /src/config/verticals/florist/business-profile.ts. Exists
 * only so `demo-site-config.ts` has valid content for every section's
 * required fields, to prove PageRenderer assembles all 10. No real
 * copywriting decision is made here — see /docs/experience-map.md's "Out
 * of scope" note on copy.
 */
export const demoContent: ExperienceContent = {
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
  // location-section intentionally has no content here — its required
  // `contact`/`hours` are merged in from BusinessProfile by
  // resolveSections, not authored as per-section copy.
  "location-section": {},
  "final-cta": {
    headline: "[DEMO_CLOSING_HEADLINE]",
    cta: { label: "[DEMO_CTA_LABEL]", href: "#" },
  },
};

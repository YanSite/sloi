export const SECTION_IDS = [
  "cinematic-hero",
  "editorial-statement",
  "product-reveal",
  "editorial-grid",
  "collection-showcase",
  "story-section",
  "service-section",
  "social-proof",
  "location-section",
  "final-cta",
  "immersive-stage",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

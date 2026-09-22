import { defineContent } from "@/lib/render";

/**
 * Section copy for the barber test vertical — bracket placeholders,
 * same convention as florist's content.ts. Only covers the sections
 * `barberTemplate` actually enables (no "collection-showcase" — see
 * barber.template.ts). Wrapped in `defineContent` so every field is
 * checked against the real, shared section props.
 */
export const barberContent = defineContent({
  "cinematic-hero": {
    eyebrow: "[BARBER_EYEBROW]",
    headline: "[BARBER_HERO_HEADLINE]",
    subheadline: "[BARBER_HERO_SUBHEADLINE]",
    media: { assetId: "barber-hero-atmosphere", alt: "[BARBER_HERO_ALT]" },
    primaryCta: { label: "[BARBER_PRIMARY_CTA]", href: "#" },
  },
  "editorial-statement": {
    statement: "[BARBER_EDITORIAL_STATEMENT]",
  },
  "product-reveal": {
    title: "[BARBER_PRODUCT_TITLE]",
    description: "[BARBER_PRODUCT_DESCRIPTION]",
    media: { assetId: "barber-chair-detail", alt: "[BARBER_PRODUCT_ALT]" },
    cta: { label: "[BARBER_PRODUCT_CTA]", href: "#" },
  },
  "editorial-grid": {
    title: "[BARBER_GRID_TITLE]",
    items: [
      { media: { assetId: "barber-shop-wide" }, caption: "[BARBER_GRID_CAPTION_1]" },
      { media: { assetId: "barber-texture" }, caption: "[BARBER_GRID_CAPTION_2]" },
    ],
  },
  "story-section": {
    eyebrow: "[BARBER_STORY_EYEBROW]",
    title: "[BARBER_STORY_TITLE]",
    body: "[BARBER_STORY_BODY]",
    media: { assetId: "barber-workshop-photo", alt: "[BARBER_STORY_ALT]" },
  },
  "service-section": {
    title: "[BARBER_SERVICES_TITLE]",
    services: [
      { name: "[BARBER_SERVICE_1]" },
      { name: "[BARBER_SERVICE_2]" },
      { name: "[BARBER_SERVICE_3]" },
    ],
  },
  "social-proof": {
    title: "[BARBER_SOCIAL_PROOF_TITLE]",
    testimonials: [{ quote: "[BARBER_TESTIMONIAL_1]", author: "[BARBER_AUTHOR_1]" }],
  },
  "location-section": {
    title: "[BARBER_LOCATION_TITLE]",
    mapMedia: { assetId: "barber-storefront-photo", alt: "[BARBER_LOCATION_ALT]" },
  },
  "final-cta": {
    headline: "[BARBER_CLOSING_HEADLINE]",
    subheadline: "[BARBER_CLOSING_SUBHEADLINE]",
    cta: { label: "[BARBER_FINAL_CTA]", href: "#" },
  },
});

import type { Template } from "@/lib/types";

/**
 * Default experience structure for the barber test vertical (Stage 8's
 * portability test, part 2). Same shape as florist.template.ts, two
 * deliberate differences to actually exercise mechanisms florist never
 * touched:
 *
 * - "collection-showcase" is disabled — a barbershop sells services, not
 *   a browsable product collection, and this is a real test that
 *   `enabled: false` correctly drops a section for a second vertical.
 * - "product-reveal" uses the "image-parallax" variant, registered in
 *   src/lib/render/section-registry.ts since Stage 2 but never selected
 *   by any config until now — proves the section+variant lookup for
 *   real, not just structurally.
 */
export const barberTemplate: Template = {
  vertical: "barber",
  name: "barber-default",
  experienceMap: [
    { section: "cinematic-hero", enabled: true },
    { section: "editorial-statement", enabled: true },
    { section: "product-reveal", enabled: true, variant: "image-parallax" },
    { section: "editorial-grid", enabled: true },
    { section: "collection-showcase", enabled: false, notes: "Barber sells services, not a browsable collection." },
    { section: "story-section", enabled: true },
    { section: "service-section", enabled: true },
    { section: "social-proof", enabled: true },
    { section: "location-section", enabled: true },
    { section: "final-cta", enabled: true },
  ],
};

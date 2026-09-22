import type { Template } from "@/lib/types";

/**
 * Default experience structure for the florist vertical. Ordering only —
 * no copy, styling, or assets. Not the final design.
 */
export const floristTemplate: Template = {
  vertical: "florist",
  name: "florist-default",
  experienceMap: [
    { section: "cinematic-hero", enabled: true },
    { section: "editorial-statement", enabled: true },
    { section: "product-reveal", enabled: true },
    { section: "collection-showcase", enabled: true },
    { section: "story-section", enabled: true },
    { section: "service-section", enabled: true },
    { section: "editorial-grid", enabled: true },
    { section: "social-proof", enabled: true },
    { section: "location-section", enabled: true },
    { section: "final-cta", enabled: true },
  ],
};

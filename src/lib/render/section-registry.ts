import type { ComponentType } from "react";
import type { SectionId } from "@/lib/types";
import {
  CinematicHero,
  EditorialStatement,
  ProductReveal,
  EditorialGrid,
  CollectionShowcase,
  StorySection,
  ServiceSection,
  SocialProof,
  LocationSection,
  FinalCTA,
} from "@/components/wow/sections";
import type {
  CinematicHeroProps,
  EditorialStatementProps,
  ProductRevealProps,
  EditorialGridProps,
  CollectionShowcaseProps,
  StorySectionProps,
  ServiceSectionProps,
  SocialProofProps,
  LocationSectionProps,
  FinalCTAProps,
} from "@/components/wow/sections";

/**
 * SECTION REGISTRY.
 * The `SectionRegistry` in `SiteConfig → PageRenderer → SectionRegistry →
 * Section`. Maps a section id (the closed `SectionId` set — never a
 * vertical-specific name) plus a variant slug to the component that
 * renders it. This is where `section.type + section.variant` lookup
 * lives — e.g. `"product-reveal" + "image-parallax"`.
 *
 * Exactly one real variant per section is registered for now
 * ("default"), plus one extra example on `product-reveal` to prove the
 * variant axis works — this is architecture, not a visual-variant
 * catalog. Every component here is still an "interface only" stub (see
 * each file under `@/components/wow/sections`); the registry doesn't
 * know or care about that, it only wires ids to components.
 */
export interface SectionPropsMap {
  "cinematic-hero": CinematicHeroProps;
  "editorial-statement": EditorialStatementProps;
  "product-reveal": ProductRevealProps;
  "editorial-grid": EditorialGridProps;
  "collection-showcase": CollectionShowcaseProps;
  "story-section": StorySectionProps;
  "service-section": ServiceSectionProps;
  "social-proof": SocialProofProps;
  "location-section": LocationSectionProps;
  "final-cta": FinalCTAProps;
}

export const DEFAULT_VARIANT = "default";

type SectionVariants = {
  [S in SectionId]: Record<string, ComponentType<SectionPropsMap[S]>>;
};

export const sectionRegistry: SectionVariants = {
  "cinematic-hero": { [DEFAULT_VARIANT]: CinematicHero },
  "editorial-statement": { [DEFAULT_VARIANT]: EditorialStatement },
  "product-reveal": {
    [DEFAULT_VARIANT]: ProductReveal,
    // Same stub component as "default" for now — the variant axis is
    // proven structurally; a visually distinct implementation is a later
    // stage, not this one.
    "image-parallax": ProductReveal,
  },
  "editorial-grid": { [DEFAULT_VARIANT]: EditorialGrid },
  "collection-showcase": { [DEFAULT_VARIANT]: CollectionShowcase },
  "story-section": { [DEFAULT_VARIANT]: StorySection },
  "service-section": { [DEFAULT_VARIANT]: ServiceSection },
  "social-proof": { [DEFAULT_VARIANT]: SocialProof },
  "location-section": { [DEFAULT_VARIANT]: LocationSection },
  "final-cta": { [DEFAULT_VARIANT]: FinalCTA },
};

/** Looks up a section's component by id + variant. Throws rather than silently falling back — an unregistered variant is a config mistake to surface, not paper over. */
export function resolveSectionComponent<S extends SectionId>(
  section: S,
  variant: string
): ComponentType<SectionPropsMap[S]> {
  const component = sectionRegistry[section][variant] as
    | ComponentType<SectionPropsMap[S]>
    | undefined;
  if (!component) {
    throw new Error(
      `No component registered for section "${section}" variant "${variant}".`
    );
  }
  return component;
}

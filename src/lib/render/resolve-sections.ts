import type { ComponentType } from "react";
import type { SectionId, SiteConfig } from "@/lib/types";
import { DEFAULT_VARIANT, resolveSectionComponent } from "./section-registry";

export interface ResolvedSection {
  section: SectionId;
  variant: string;
  Component: ComponentType<Record<string, unknown>>;
  /**
   * Heterogeneous by design: each section's real prop type is enforced
   * once, at registration, via `SectionPropsMap` in section-registry.ts.
   * Here — across ten different section shapes in one array — props stay
   * `Record<string, unknown>`, matching `SectionContent`'s existing
   * looseness (see /docs/experience-map.md's `ExperienceContent`, not
   * tightened yet because the sections themselves are still
   * "interface only" stubs).
   */
  props: Record<string, unknown>;
}

/**
 * A few sections need real business facts (address, hours) that live in
 * `BusinessProfile`, not in the loose per-section marketing copy in
 * `ExperienceContent` — business-profile.md is explicit that those are
 * separate layers. This is keyed by `SectionId`, never by vertical: any
 * vertical's location-section needs contact/hours the same way.
 */
function withBusinessFacts(
  section: SectionId,
  content: Record<string, unknown>,
  config: SiteConfig
): Record<string, unknown> {
  if (section === "location-section") {
    return {
      ...content,
      contact: config.business.contact,
      hours: config.business.hours,
    };
  }
  return content;
}

/**
 * `SiteConfig → PageRenderer → SectionRegistry → Section`, minus the
 * React part. Reads order and which sections are enabled from
 * `config.experience.experienceMap` (never hardcoded here), resolves
 * each enabled entry's component via the SectionRegistry, and assembles
 * its props from every SiteConfig layer: section data (id/variant),
 * content, assets, VisualDNA/theme, and motion.
 */
export function resolveSections(config: SiteConfig): ResolvedSection[] {
  return config.experience.experienceMap
    .filter((entry) => entry.enabled)
    .map((entry): ResolvedSection => {
      const variant = entry.variant ?? DEFAULT_VARIANT;
      const Component = resolveSectionComponent(entry.section, variant) as unknown as ComponentType<
        Record<string, unknown>
      >;
      const content = (config.content[entry.section] ?? {}) as Record<string, unknown>;

      const props: Record<string, unknown> = {
        ...withBusinessFacts(entry.section, content, config),
        // Renderer-owned fields always win over any accidental collision
        // with a same-named content key.
        section: entry.section,
        variant,
        assets: config.assets,
        visualDNA: config.visualDNA,
        theme: config.theme,
        motion: entry.motion ?? config.motion,
      };

      return { section: entry.section, variant, Component, props };
    });
}

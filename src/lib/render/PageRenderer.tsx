import type { SiteConfig } from "@/lib/types";
import { resolveSections } from "./resolve-sections";

export interface PageRendererProps {
  config: SiteConfig;
}

/**
 * `SiteConfig → PageRenderer → SectionRegistry → Section`.
 *
 * Builds a full page from nothing but a SiteConfig. Order and which
 * sections appear come entirely from `config.experience.experienceMap`
 * (an `ExperienceTemplate`) — never hardcoded here. No vertical, no
 * business name, no section-specific conditions live in this file; see
 * `resolveSections` for the (also vertical-agnostic) prop-assembly logic
 * and `section-registry.ts` for the id+variant → component lookup.
 */
export function PageRenderer({ config }: PageRendererProps) {
  const sections = resolveSections(config);

  return (
    <>
      {sections.map(({ section, variant, Component, props }) => (
        <Component key={`${section}:${variant}`} {...props} />
      ))}
    </>
  );
}

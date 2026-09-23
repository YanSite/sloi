import type { SiteConfig } from "@/lib/types";
import { resolveSections } from "./resolve-sections";

export interface PageRendererProps {
  config: SiteConfig;
}

/**
 * `SiteConfig → PageRenderer → SectionRegistry → Section`.
 *
 * Собирает полную страницу из одного лишь SiteConfig. Порядок и состав
 * секций целиком берутся из `config.experience.experienceMap`
 * (`ExperienceTemplate`) — никогда не хардкодятся здесь. В этом файле нет
 * ни вертикали, ни названия бизнеса, ни section-специфичных условий — см.
 * `resolveSections` (тоже вертикально-нейтральная сборка пропсов) и
 * `section-registry.ts` (lookup id+variant → компонент).
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

import type { ComponentType } from "react";
import type { SectionId, SiteConfig } from "@/lib/types";
import { DEFAULT_VARIANT, resolveSectionComponent } from "./section-registry";

export interface ResolvedSection {
  section: SectionId;
  variant: string;
  Component: ComponentType<Record<string, unknown>>;
  /**
   * Намеренно неоднородный тип: реальный тип пропсов каждой секции
   * фиксируется один раз, при регистрации, через `SectionPropsMap` в
   * section-registry.ts. Здесь — в едином массиве с десятью разными
   * формами секций — пропсы остаются `Record<string, unknown>`, потому
   * что массив хранит их вместе; строгая проверка по реальным пропсам
   * делается раньше, на этапе авторинга контента (см.
   * `defineContent`/`SectionContentMap` в section-content.ts).
   */
  props: Record<string, unknown>;
}

/**
 * У нескольких секций есть потребность в реальных бизнес-фактах (адрес,
 * часы работы), которые живут в `BusinessProfile`, а не в нестрогом
 * маркетинговом тексте секции в `ExperienceContent` — business-profile.md
 * явно разделяет эти слои. Ключ — `SectionId`, никогда не вертикаль: у
 * любой вертикали location-section нуждается в contact/hours одинаково.
 */
function withBusinessFacts(
  section: SectionId,
  content: Record<string, unknown>,
  config: SiteConfig,
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
 * `SiteConfig → PageRenderer → SectionRegistry → Section`, без React-части.
 * Читает порядок и состав включённых секций из
 * `config.experience.experienceMap` (никогда не хардкодится здесь),
 * резолвит компонент каждой включённой записи через SectionRegistry и
 * собирает её пропсы из всех слоёв SiteConfig: данные секции
 * (id/variant), контент, assets, VisualDNA/theme и motion.
 */
export function resolveSections(config: SiteConfig): ResolvedSection[] {
  // Промпт генерации — авторские метаданные для generation workflow, ни
  // одна секция его не рендерит. Секции часто клиентские, и всё, что им
  // передано, сериализуется в payload страницы, поэтому промпты в
  // браузер не уходят.
  const assets = config.assets.map(({ prompt: _prompt, ...entry }) => entry);

  return config.experience.experienceMap
    .filter((entry) => entry.enabled)
    .map((entry): ResolvedSection => {
      const variant = entry.variant ?? DEFAULT_VARIANT;
      const Component = resolveSectionComponent(
        entry.section,
        variant,
        config.sectionVariants,
      ) as unknown as ComponentType<Record<string, unknown>>;
      const content = (config.content[entry.section] ?? {}) as Record<string, unknown>;

      const props: Record<string, unknown> = {
        ...withBusinessFacts(entry.section, content, config),
        // Поля, принадлежащие рендереру, всегда побеждают при случайном
        // совпадении с одноимённым ключом контента.
        section: entry.section,
        variant,
        assets,
        visualDNA: config.visualDNA,
        theme: config.theme,
        motion: entry.motion ?? config.motion,
      };

      return { section: entry.section, variant, Component, props };
    });
}

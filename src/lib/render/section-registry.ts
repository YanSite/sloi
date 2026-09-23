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
 * `SectionRegistry` в цепочке `SiteConfig → PageRenderer →
 * SectionRegistry → Section`. Сопоставляет id секции (закрытое множество
 * `SectionId` — никогда не вертикально-специфичное имя) и слаг варианта с
 * компонентом, который её рендерит. Именно здесь живёт lookup
 * `section.type + section.variant` — например,
 * `"product-reveal" + "image-parallax"` (реально выбирается вертикалью
 * barber, см. src/templates/barber.template.ts).
 *
 * Большинство секций регистрируют один вариант "default"; `product-reveal`
 * дополнительно регистрирует "image-parallax", указывающий на тот же
 * компонент, что и "default" — variant-механизм требует лишь
 * зарегистрированной записи, а не визуально другой реализации. Семь из
 * десяти компонентов секций пока остаются заглушками-интерфейсами (см.
 * каждый файл в `@/components/wow/sections`); реестр об этом не знает и
 * не заботится — он лишь связывает id с компонентами.
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
    // Зарегистрирован под обоими слагами варианта намеренно —
    // variant-ось требует лишь отдельной ЗАРЕГИСТРИРОВАННОЙ записи, а не
    // визуально другого компонента. Реально выбран вертикалью barber
    // (Stage 8).
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

/** Резолвит компонент секции по id + variant. Бросает ошибку вместо тихого fallback — незарегистрированный variant это ошибка конфигурации, которую нужно показать, а не скрыть. */
export function resolveSectionComponent<S extends SectionId>(
  section: S,
  variant: string,
): ComponentType<SectionPropsMap[S]> {
  const component = sectionRegistry[section][variant] as
    ComponentType<SectionPropsMap[S]> | undefined;
  if (!component) {
    throw new Error(`No component registered for section "${section}" variant "${variant}".`);
  }
  return component;
}

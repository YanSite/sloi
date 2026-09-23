import type { SectionId } from "./section";

/**
 * Слой BUSINESS-SPECIFIC CONTENT.
 * Маркетинговый текст по секциям (заголовки, цитаты, подписи) — отдельно
 * от объективных фактов в BusinessProfile. Тип сознательно остаётся
 * нестрогим (`Record<string, unknown>`) — строгую проверку по реальным
 * полям секции даёт `defineContent`/`SectionContentMap` на уровне
 * авторинга (см. src/lib/render/section-content.ts), не меняя этот контракт.
 */
export type SectionContent = Record<string, unknown>;

export type ExperienceContent = Partial<Record<SectionId, SectionContent>>;

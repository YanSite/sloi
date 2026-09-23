import type { SectionId } from "./section";
import type { MotionConfig } from "./motion";

/**
 * Слой EXPERIENCE STRUCTURE.
 * Какие WOW-секции показываются бизнесу и в каком порядке. Не содержит
 * копирайта и стилей — только композицию.
 */
export interface ExperienceMapEntry {
  section: SectionId;
  enabled: boolean;
  /** Какую зарегистрированную реализацию секции использовать, например "cinematic" vs "default". При отсутствии — "default", см. src/lib/render/section-registry.ts. */
  variant?: string;
  /** Переопределение motion для конкретного экземпляра; при отсутствии берётся значение по умолчанию из SiteConfig. */
  motion?: MotionConfig;
  notes?: string;
}

export type ExperienceMap = ExperienceMapEntry[];

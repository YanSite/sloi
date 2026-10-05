import type { BusinessProfile } from "./business-profile";
import type { VisualDNA } from "./visual-dna";
import type { Template } from "./template";
import type { ExperienceContent } from "./content";
import type { AssetManifest } from "./asset-manifest";
import type { ThemeTokens } from "./theme-tokens";
import type { MotionConfig } from "./motion";
import type { SiteSectionVariants } from "./section-variants";

/**
 * Слой SITE COMPOSITION — верхнеуровневая форма, которую потребляет
 * `PageRenderer` (см. src/lib/render):
 *
 *   SiteConfig = Business + VisualDNA + Experience + Content + Assets
 *                + Theme + Motion
 *
 * Каждое поле — бизнес-специфичное ЗНАЧЕНИЕ вертикально-нейтрального
 * ТИПА. Как и любой другой тип в этой директории, этот файл никогда не
 * импортирует из `src/config/verticals/*` и не ссылается на вертикаль,
 * название бизнеса или бизнес-специфичное понятие.
 */
export interface SiteConfig {
  business: BusinessProfile;
  visualDNA: VisualDNA;
  /** Какие секции и в каком порядке — см. Template/ExperienceMap. */
  experience: Template;
  content: ExperienceContent;
  assets: AssetManifest;
  theme: ThemeTokens;
  /** Базовый motion на весь сайт; per-section override задаётся в ExperienceMapEntry.motion. */
  motion?: MotionConfig;
  /**
   * Реализации вариантов секций, которых нет в core-реестре, —
   * композиция конкретного сайта (см. `SiteSectionVariants`). Core-варианты
   * переопределить нельзя: совпадение слага — ошибка валидации.
   */
  sectionVariants?: SiteSectionVariants;
  /**
   * Мета страницы: `<title>`, описание и превью ссылки в мессенджерах.
   * Без неё страница получает мету корневого layout.
   */
  meta?: SiteMeta;
}

/** Мета страницы сайта и превью ссылки (Open Graph). */
export interface SiteMeta {
  title: string;
  description?: string;
  /** Картинка превью ссылки; без неё превью — только заголовок и описание. */
  ogImage?: { url: string; width: number; height: number; alt: string };
  /** Локаль Open Graph, например "ru_RU". */
  locale?: string;
}

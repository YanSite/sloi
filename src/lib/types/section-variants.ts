import type { ComponentType } from "react";
import type { SectionId } from "./section";

/**
 * SITE-PROVIDED SECTION VARIANTS.
 * Точка расширения section registry со стороны Site Instance: сайт
 * регистрирует собственную реализацию варианта секции (например,
 * хореографию immersive-stage, собранную из generic stage-примитивов),
 * не трогая core-реестр в `src/lib/render/section-registry.ts`.
 *
 * Компонент получает те же пропсы, что и любая секция (контент секции +
 * `assets`/`theme`/`visualDNA`/`motion` от рендерера). `ComponentType<never>`
 * — самый широкий тип компонента, которому присваивается компонент с
 * любыми пропсами; реальную проверку пропсов даёт сам сайт при авторинге.
 */
export type SiteSectionVariants = Partial<Record<SectionId, Record<string, ComponentType<never>>>>;

import type { ExperienceContent, SectionId } from "@/lib/types";
import type { SectionPropsMap } from "./section-registry";

/**
 * То, что вертикаль реально АВТОРИТ по каждой секции — `SectionPropsMap`
 * без полей, которые `resolveSections` подставляет сама (theme, motion,
 * assets, а также contact/hours для location-section из бизнес-данных —
 * см. `withBusinessFacts` в resolve-sections.ts). Отделён от типа
 * `SiteConfig.content` (там остаётся нестрогий `ExperienceContent`, см.
 * /lib/types/content.ts) — именно это позволяет автору конфига получить
 * реальную проверку типов по полям, не заставляя `lib/types`
 * импортировать формы пропсов компонентов, что нарушило бы правило
 * layering из /docs/engine-architecture.md.
 */
type ContentOnly<P> = Omit<P, "theme" | "motion" | "assets" | "contact" | "hours">;

export type SectionContentMap = {
  [S in SectionId]: ContentOnly<SectionPropsMap[S]>;
};

export type TypedExperienceContent = Partial<SectionContentMap>;

/**
 * Единственная сознательная точка ослабления типа — от
 * `TypedExperienceContent` (что пишет автор, проверяется по реальным
 * пропсам секции) до `ExperienceContent` (что принимает
 * `SiteConfig.content`) — по аналогии с единственным документированным
 * приведением типа в resolve-sections.ts. У обычного interface нет
 * индексной сигнатуры, поэтому он структурно не подходит под
 * `Record<string, unknown>` из `SectionContent`; generic-параметр `T`
 * здесь нужен, чтобы *вход* этой функции проверялся полностью, даже если
 * тип на выходе шире.
 */
export function defineContent<T extends TypedExperienceContent>(content: T): ExperienceContent {
  return content as ExperienceContent;
}

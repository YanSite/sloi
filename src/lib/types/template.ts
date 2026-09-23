import type { Vertical } from "./vertical";
import type { ExperienceMap } from "./experience-map";

/**
 * Слой TEMPLATE.
 * Связывает вертикаль с её структурой experience по умолчанию. Шаблон не
 * содержит бизнес-данных, Visual DNA или ассетов — на этапе рендера они
 * приходят из других слоёв.
 */
export interface Template {
  vertical: Vertical;
  name: string;
  experienceMap: ExperienceMap;
}

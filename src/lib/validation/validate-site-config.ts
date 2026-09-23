import type { SiteConfig } from "@/lib/types";
import type { ValidationIssue, ValidationResult } from "./types";
import { validateShape } from "./validate-shape";
import { validateExperience } from "./validate-experience";
import { validateAssets } from "./validate-assets";

/** Запускает все проверки и агрегирует результат — единственная точка входа, нужная автору конфига или build-шагу. */
export function validateSiteConfig(config: SiteConfig): ValidationResult {
  const issues: ValidationIssue[] = [
    ...validateShape(config),
    ...validateExperience(config),
    ...validateAssets(config),
  ];
  return { valid: issues.every((issue) => issue.severity !== "error"), issues };
}

/**
 * Позволяет ошибке конфигурации проявиться сразу, на этапе загрузки
 * модуля — файлы `site-config.ts` в `src/config/verticals/*` и
 * `src/config/__fixtures__` оборачивают свой export этой функцией, так
 * что сломанный конфиг бросает ошибку один раз, при импорте (практически
 * бесплатно: ESM-модуль вычисляется только один раз), а не падает
 * невнятно посреди рендера или вообще незаметно. Повторяет паттерн
 * `resolveSectionComponent`/`resolveAsset` — обе бросают ошибку на
 * нерезолвящуюся ссылку вместо тихой деградации. Warning логируется, но
 * не бросается — он не блокирует в остальном валидный конфиг.
 */
export function assertValidSiteConfig(config: SiteConfig): SiteConfig {
  const result = validateSiteConfig(config);

  for (const issue of result.issues) {
    if (issue.severity === "warning") {
      console.warn(`[SiteConfig] ${issue.code} at ${issue.path}: ${issue.message}`);
    }
  }

  const errors = result.issues.filter((issue) => issue.severity === "error");
  if (errors.length > 0) {
    const summary = errors
      .map((issue) => `  - [${issue.code}] ${issue.path}: ${issue.message}`)
      .join("\n");
    throw new Error(
      `Invalid SiteConfig (${errors.length} error${errors.length === 1 ? "" : "s"}):\n${summary}`,
    );
  }

  return config;
}

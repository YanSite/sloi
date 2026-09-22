import type { SiteConfig } from "@/lib/types";
import type { ValidationIssue, ValidationResult } from "./types";
import { validateShape } from "./validate-shape";
import { validateExperience } from "./validate-experience";
import { validateAssets } from "./validate-assets";

/** Runs every check and aggregates the result — the one entry point a config author or build step needs. */
export function validateSiteConfig(config: SiteConfig): ValidationResult {
  const issues: ValidationIssue[] = [
    ...validateShape(config),
    ...validateExperience(config),
    ...validateAssets(config),
  ];
  return { valid: issues.every((issue) => issue.severity !== "error"), issues };
}

/**
 * Fails fast on config mistakes at module-load time — the `site-config.ts`
 * files under `src/config/verticals/*` and `src/lib/render/__fixtures__`
 * wrap their export with this, so a broken config throws once, at import
 * time (effectively free: ESM modules only evaluate once), rather than
 * failing confusingly mid-render or not at all. Mirrors
 * `resolveSectionComponent`/`resolveAsset` both throwing on an
 * unresolvable reference instead of degrading silently. Warnings are
 * logged, not thrown — they don't block an otherwise-valid config.
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
    const summary = errors.map((issue) => `  - [${issue.code}] ${issue.path}: ${issue.message}`).join("\n");
    throw new Error(`Invalid SiteConfig (${errors.length} error${errors.length === 1 ? "" : "s"}):\n${summary}`);
  }

  return config;
}

import type { SiteConfig } from "@/lib/types";
import type { ValidationIssue } from "./types";

const THEME_TOKEN_KEYS = ["colors", "fonts", "spacing", "radius", "shadows", "transitions", "breakpoints"] as const;
const COLOR_KEYS = ["background", "foreground", "primary"] as const;

/**
 * SiteConfig-level "does the top of the tree have what it needs" checks —
 * required fields present, before anything more specific (experience
 * structure, asset references) can be meaningfully validated at all.
 */
export function validateShape(config: SiteConfig): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!config.business?.name?.trim()) {
    issues.push({
      severity: "error",
      code: "config/missing-business-name",
      message: "business.name is required and must be non-empty.",
      path: "business.name",
    });
  }
  if (!config.business?.contact) {
    issues.push({
      severity: "error",
      code: "config/missing-business-contact",
      message: "business.contact is required (an object — individual fields inside it may be empty).",
      path: "business.contact",
    });
  }

  if (!config.visualDNA?.colorPalette) {
    issues.push({
      severity: "error",
      code: "config/missing-color-palette",
      message: "visualDNA.colorPalette is required.",
      path: "visualDNA.colorPalette",
    });
  } else {
    for (const key of COLOR_KEYS) {
      if (!config.visualDNA.colorPalette[key]) {
        issues.push({
          severity: "error",
          code: "config/missing-color",
          message: `visualDNA.colorPalette.${key} is required.`,
          path: `visualDNA.colorPalette.${key}`,
        });
      }
    }
  }

  for (const key of THEME_TOKEN_KEYS) {
    if (!config.theme?.[key]) {
      issues.push({
        severity: "error",
        code: "config/missing-theme-tokens",
        message: `theme.${key} is required — see src/lib/theme/resolve-theme.ts.`,
        path: `theme.${key}`,
      });
    }
  }

  if (!Array.isArray(config.experience?.experienceMap) || config.experience.experienceMap.length === 0) {
    issues.push({
      severity: "error",
      code: "config/empty-experience-map",
      message: "experience.experienceMap must be a non-empty array.",
      path: "experience.experienceMap",
    });
  }

  if (!Array.isArray(config.assets)) {
    issues.push({
      severity: "error",
      code: "config/invalid-assets",
      message: "assets must be an array (it may be empty).",
      path: "assets",
    });
  }

  if (typeof config.content !== "object" || config.content === null) {
    issues.push({
      severity: "error",
      code: "config/invalid-content",
      message: "content must be an object.",
      path: "content",
    });
  }

  return issues;
}

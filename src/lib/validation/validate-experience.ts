import type { SectionId, SiteConfig } from "@/lib/types";
import { MOTION_PRESETS, SECTION_IDS } from "@/lib/types";
import { DEFAULT_VARIANT, sectionRegistry } from "@/lib/render/section-registry";
import type { ValidationIssue } from "./types";

/**
 * Два обрамляющих Signature WOW Moment (см. /docs/visual-dna.md) —
 * достаточно значимы, чтобы отметить их отсутствие, хотя вертикаль
 * вправе сознательно обойтись без них (поэтому warning, а не error).
 */
const CORE_SECTIONS: SectionId[] = ["cinematic-hero", "final-cta"];

function validateEntries(config: SiteConfig): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenEnabled = new Set<SectionId>();

  config.experience.experienceMap.forEach((entry, index) => {
    const path = `experience.experienceMap[${index}]`;

    if (!SECTION_IDS.includes(entry.section)) {
      issues.push({
        severity: "error",
        code: "experience/invalid-section-id",
        message: `"${entry.section}" is not a valid section id. Must be one of: ${SECTION_IDS.join(", ")}.`,
        path: `${path}.section`,
      });
      return; // дальше проверять нечего — секция неизвестна
    }

    if (entry.enabled) {
      if (seenEnabled.has(entry.section)) {
        issues.push({
          severity: "error",
          code: "experience/duplicate-section",
          message: `Section "${entry.section}" is enabled more than once in experienceMap.`,
          path: `${path}.section`,
        });
      }
      seenEnabled.add(entry.section);
    }

    const variant = entry.variant ?? DEFAULT_VARIANT;
    if (!sectionRegistry[entry.section][variant]) {
      issues.push({
        severity: "error",
        code: "experience/invalid-variant",
        message: `No component registered for section "${entry.section}" variant "${variant}".`,
        path: `${path}.variant`,
      });
    }

    if (entry.motion && !MOTION_PRESETS.includes(entry.motion.preset)) {
      issues.push({
        severity: "error",
        code: "experience/invalid-motion-preset",
        message: `"${entry.motion.preset}" is not a valid motion preset. Must be one of: ${MOTION_PRESETS.join(", ")}.`,
        path: `${path}.motion.preset`,
      });
    }
  });

  return issues;
}

function validateCoreSectionsPresent(config: SiteConfig): ValidationIssue[] {
  const enabled = new Set(
    config.experience.experienceMap.filter((entry) => entry.enabled).map((entry) => entry.section),
  );
  return CORE_SECTIONS.filter((section) => !enabled.has(section)).map((section) => ({
    severity: "warning" as const,
    code: "experience/missing-core-section",
    message: `"${section}" is a Signature WOW Moment (see /docs/visual-dna.md) and isn't enabled anywhere in experienceMap.`,
    path: "experience.experienceMap",
  }));
}

function validateOrder(config: SiteConfig): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const enabled = config.experience.experienceMap.filter((entry) => entry.enabled);
  if (enabled.length === 0) return issues;

  const heroIndex = enabled.findIndex((entry) => entry.section === "cinematic-hero");
  if (heroIndex > 0) {
    issues.push({
      severity: "warning",
      code: "experience/hero-not-first",
      message: `"cinematic-hero" is enabled but isn't the first section — it's the opening Signature WOW Moment (see /docs/experience-map.md §2).`,
      path: "experience.experienceMap",
    });
  }

  const ctaIndex = enabled.findIndex((entry) => entry.section === "final-cta");
  if (ctaIndex !== -1 && ctaIndex !== enabled.length - 1) {
    issues.push({
      severity: "warning",
      code: "experience/cta-not-last",
      message: `"final-cta" is enabled but isn't the last section — it's the closing conversion moment (see /docs/experience-map.md §2).`,
      path: "experience.experienceMap",
    });
  }

  return issues;
}

/** Структурные проверки experience-map: валидные id, отсутствие дублей, зарегистрированные варианты, корректный порядок, невалидные перекрёстные ссылки (motion preset). */
export function validateExperience(config: SiteConfig): ValidationIssue[] {
  return [
    ...validateEntries(config),
    ...validateCoreSectionsPresent(config),
    ...validateOrder(config),
  ];
}

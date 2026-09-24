import type { SectionId, SiteConfig } from "@/lib/types";
import { MOTION_PRESETS, SECTION_IDS } from "@/lib/types";
import {
  DEFAULT_VARIANT,
  lookupSectionComponent,
  sectionRegistry,
} from "@/lib/render/section-registry";
import type { ValidationIssue } from "./types";

/**
 * Два обрамляющих Signature WOW Moment (см. /docs/visual-dna.md) —
 * достаточно значимы, чтобы отметить их отсутствие, хотя вертикаль
 * вправе сознательно обойтись без них (поэтому warning, а не error).
 */
const CORE_SECTIONS: SectionId[] = ["cinematic-hero", "final-cta"];

/**
 * Секции, которые занимают всю страницу сами (фиксированный canvas,
 * собственная навигация вместо нативного скролла). Рядом с ними другой
 * секции физически негде жить, а правила порядка hero/CTA к ним не
 * применимы — hero и финал у такой сцены внутри.
 */
const FULL_PAGE_SECTIONS: SectionId[] = ["immersive-stage"];

function isFullPageExperience(config: SiteConfig): boolean {
  return config.experience.experienceMap.some(
    (entry) => entry.enabled && FULL_PAGE_SECTIONS.includes(entry.section),
  );
}

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
    if (!lookupSectionComponent(entry.section, variant, config.sectionVariants)) {
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

/** Вариант сайта не может подменить core-вариант с тем же слагом — иначе поведение core стало бы зависеть от сайта. */
function validateSiteVariants(config: SiteConfig): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const [section, variants] of Object.entries(config.sectionVariants ?? {})) {
    if (!SECTION_IDS.includes(section as SectionId)) {
      issues.push({
        severity: "error",
        code: "experience/site-variant-invalid-section",
        message: `sectionVariants registers variants for unknown section "${section}".`,
        path: `sectionVariants.${section}`,
      });
      continue;
    }
    for (const variant of Object.keys(variants ?? {})) {
      if (sectionRegistry[section as SectionId][variant]) {
        issues.push({
          severity: "error",
          code: "experience/site-variant-shadows-core",
          message: `Site variant "${variant}" for "${section}" collides with a core variant of the same name — pick a site-specific slug.`,
          path: `sectionVariants.${section}.${variant}`,
        });
      }
    }
  }
  return issues;
}

function validateFullPageSections(config: SiteConfig): ValidationIssue[] {
  const enabled = config.experience.experienceMap.filter((entry) => entry.enabled);
  const fullPage = enabled.filter((entry) => FULL_PAGE_SECTIONS.includes(entry.section));
  if (fullPage.length === 0 || enabled.length === 1) return [];
  return [
    {
      severity: "error",
      code: "experience/full-page-section-not-alone",
      message: `"${fullPage[0].section}" takes over the whole page (fixed canvas, own navigation) and must be the only enabled section.`,
      path: "experience.experienceMap",
    },
  ];
}

function validateCoreSectionsPresent(config: SiteConfig): ValidationIssue[] {
  if (isFullPageExperience(config)) return [];
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
  if (isFullPageExperience(config)) return issues;
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

/** Структурные проверки experience-map: валидные id, отсутствие дублей, зарегистрированные варианты (core или сайта), полноэкранные секции, корректный порядок, невалидные перекрёстные ссылки (motion preset). */
export function validateExperience(config: SiteConfig): ValidationIssue[] {
  return [
    ...validateEntries(config),
    ...validateSiteVariants(config),
    ...validateFullPageSections(config),
    ...validateCoreSectionsPresent(config),
    ...validateOrder(config),
  ];
}

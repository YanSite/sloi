import type { AssetManifest, MediaRef, SectionId, SiteConfig } from "@/lib/types";
import { ASSET_SOURCES, ASSET_STATUSES, ASSET_TYPES, SECTION_IDS } from "@/lib/types";
import type { ValidationIssue } from "./types";

const ASPECT_RATIO_PATTERN = /^\d+:\d+$/;

function validateManifestEntries(manifest: AssetManifest): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenIds = new Set<string>();

  manifest.forEach((entry, index) => {
    const path = `assets[${index}]`;
    const label = entry.asset_id || `#${index}`;

    if (!entry.asset_id?.trim()) {
      issues.push({
        severity: "error",
        code: "asset/missing-id",
        message: "asset_id is required and must be non-empty.",
        path: `${path}.asset_id`,
      });
    } else if (seenIds.has(entry.asset_id)) {
      issues.push({
        severity: "error",
        code: "asset/duplicate-id",
        message: `Duplicate asset_id "${entry.asset_id}".`,
        path: `${path}.asset_id`,
      });
    } else {
      seenIds.add(entry.asset_id);
    }

    if (!entry.purpose?.trim()) {
      issues.push({
        severity: "warning",
        code: "asset/missing-purpose",
        message: `Asset "${label}" has no purpose — undocumented assets are hard to audit later.`,
        path: `${path}.purpose`,
      });
    }
    if (!ASSET_TYPES.includes(entry.type)) {
      issues.push({
        severity: "error",
        code: "asset/unsupported-type",
        message: `Asset "${label}" has unsupported type "${entry.type}". Must be one of: ${ASSET_TYPES.join(", ")}.`,
        path: `${path}.type`,
      });
    }
    if (!ASSET_SOURCES.includes(entry.source)) {
      issues.push({
        severity: "error",
        code: "asset/invalid-source",
        message: `Asset "${label}" has invalid source "${entry.source}". Must be one of: ${ASSET_SOURCES.join(", ")}.`,
        path: `${path}.source`,
      });
    }
    if (!ASSET_STATUSES.includes(entry.status)) {
      issues.push({
        severity: "error",
        code: "asset/invalid-status",
        message: `Asset "${label}" has invalid status "${entry.status}". Must be one of: ${ASSET_STATUSES.join(", ")}.`,
        path: `${path}.status`,
      });
    }
    if (!ASPECT_RATIO_PATTERN.test(entry.aspect_ratio ?? "")) {
      issues.push({
        severity: "error",
        code: "asset/invalid-aspect-ratio",
        message: `Asset "${label}" has invalid aspect_ratio "${entry.aspect_ratio}" — expected "W:H" (e.g. "16:9").`,
        path: `${path}.aspect_ratio`,
      });
    }
    // У higgsfield-ассета со статусом "planned" промпт может быть ещё не
    // написан (см., например, неавторизованный NICE_TO_HAVE-резерв в
    // asset-manifest.md) — это реальная, законная стадия жизненного
    // цикла, а не ошибка. Как только статус продвигается дальше "planned"
    // (approved и далее), промпт уже обязателен.
    if (entry.source === "higgsfield" && entry.status !== "planned" && !entry.prompt?.trim()) {
      issues.push({
        severity: "error",
        code: "asset/missing-prompt",
        message: `Asset "${label}" has source "higgsfield" and status "${entry.status}" but no prompt.`,
        path: `${path}.prompt`,
      });
    }

    const sections = Array.isArray(entry.section) ? entry.section : [entry.section];
    for (const section of sections) {
      if (!SECTION_IDS.includes(section)) {
        issues.push({
          severity: "error",
          code: "asset/invalid-section-reference",
          message: `Asset "${label}" references unknown section "${section}".`,
          path: `${path}.section`,
        });
      }
    }
  });

  return issues;
}

/** Рекурсивно находит каждое значение формы `MediaRef` (`{ assetId: string }`) внутри дерева контента — content нестрого типизирован (`Record<string, unknown>`), поэтому это структурный duck-typed обход, а не типизированный lookup. */
function findMediaRefs(value: unknown): MediaRef[] {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(findMediaRefs);
  const record = value as Record<string, unknown>;
  if (typeof record.assetId === "string") {
    return [{ assetId: record.assetId }];
  }
  return Object.values(record).flatMap(findMediaRefs);
}

function validateAssetReferences(config: SiteConfig): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const knownIds = new Set(config.assets.map((entry) => entry.asset_id));

  for (const [section, content] of Object.entries(config.content)) {
    for (const ref of findMediaRefs(content)) {
      if (!knownIds.has(ref.assetId)) {
        issues.push({
          severity: "error",
          code: "asset/unresolved-reference",
          message: `content["${section}"] references assetId "${ref.assetId}", which doesn't exist in the asset manifest.`,
          path: `content.${section}`,
        });
      }
    }
  }

  return issues;
}

/**
 * Секции, чьи реальные Props компонента требуют хотя бы один `MediaRef`
 * (не опционально) — небольшое, сознательно поддерживаемое вручную
 * зеркало src/components/wow/sections. В рантайме это не вывести из
 * типов TypeScript — они стираются при компиляции; это единственное
 * место, где факт приходится продублировать для рантайм-проверки.
 */
const SECTIONS_REQUIRING_MEDIA: SectionId[] = [
  "cinematic-hero",
  "product-reveal",
  "immersive-stage",
];

function validateRequiredAssets(config: SiteConfig): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const enabledSections = new Set(
    config.experience.experienceMap.filter((entry) => entry.enabled).map((entry) => entry.section),
  );

  for (const section of SECTIONS_REQUIRING_MEDIA) {
    if (!enabledSections.has(section)) continue;
    if (findMediaRefs(config.content[section]).length === 0) {
      issues.push({
        severity: "error",
        code: "asset/missing-required-asset",
        message: `Section "${section}" is enabled and requires a media asset, but content["${section}"] has none.`,
        path: `content.${section}`,
      });
    }
  }

  return issues;
}

/** Проверки asset manifest и ссылок: поддерживаемый тип, базовые метаданные, существование referenced/required ассетов. */
export function validateAssets(config: SiteConfig): ValidationIssue[] {
  return [
    ...validateManifestEntries(config.assets),
    ...validateAssetReferences(config),
    ...validateRequiredAssets(config),
  ];
}

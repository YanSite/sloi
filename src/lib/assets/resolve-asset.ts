import type {
  AssetFile,
  AssetFocalPoint,
  AssetManifest,
  AssetStatus,
  AssetType,
  MediaRef,
  SectionId,
} from "@/lib/types";

export interface ResolvedAsset {
  assetId: string;
  type: AssetType;
  alt: string;
  aspectRatio: string;
  focalPoint: AssetFocalPoint;
  status: AssetStatus;
  /** Все секции, где используется ассет — нормализовано в массив независимо от того, как это объявлено в записи manifest. */
  sections: SectionId[];
  /** Реальные, готовые к рендеру варианты файла — пусто, пока `status` не достигнет "generated". Пока пусто, компоненты используют плейсхолдер. */
  sources: AssetFile[];
}

const DEFAULT_FOCAL_POINT: AssetFocalPoint = { x: 0.5, y: 0.5 };

/**
 * Универсальный asset-резолвер — ASSET REGISTRY, через который
 * `MediaRef.assetId` превращается в реальные данные для рендера.
 * Компонент секции запрашивает ассет по id и никогда не читает запись
 * `AssetManifest` или путь к файлу напрямую. Бросает ошибку на неизвестный
 * id, как и `resolveSectionComponent` в src/lib/render/section-registry.ts
 * — нерезолвящаяся ссылка на ассет это ошибка конфигурации, которую нужно
 * показать, а не тихо деградировать.
 */
export function resolveAsset(ref: MediaRef, manifest: AssetManifest): ResolvedAsset {
  const entry = manifest.find((asset) => asset.asset_id === ref.assetId);
  if (!entry) {
    throw new Error(`No asset registered for id "${ref.assetId}".`);
  }

  return {
    assetId: entry.asset_id,
    type: entry.type,
    alt: ref.alt ?? entry.purpose,
    aspectRatio: entry.aspect_ratio,
    focalPoint: entry.focalPoint ?? DEFAULT_FOCAL_POINT,
    status: entry.status,
    sections: Array.isArray(entry.section) ? entry.section : [entry.section],
    sources: entry.files ?? [],
  };
}

/** Собирает строку, готовую для `srcset`, из резолвленных адаптивных источников. */
export function toSrcSet(sources: AssetFile[]): string | undefined {
  if (sources.length === 0) return undefined;
  return sources.map((file) => `${file.url} ${file.width}w`).join(", ");
}

/** Значение CSS `object-position` из резолвленной focal point. */
export function toObjectPosition(focalPoint: AssetFocalPoint): string {
  return `${focalPoint.x * 100}% ${focalPoint.y * 100}%`;
}

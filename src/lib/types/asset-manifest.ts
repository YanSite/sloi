import type { SectionId } from "./section";

/**
 * Слой ASSETS.
 * Отслеживает каждое изображение/видео, нужное бизнесу, статус его
 * генерации и место применения — но никогда сам файл или generation-credentials.
 */
export const ASSET_TYPES = ["image", "video"] as const;
export type AssetType = (typeof ASSET_TYPES)[number];

export const ASSET_SOURCES = ["higgsfield", "stock", "client-provided", "placeholder"] as const;
export type AssetSource = (typeof ASSET_SOURCES)[number];

export const ASSET_STATUSES = [
  "planned",
  "approved",
  "generating",
  "generated",
  "rejected",
] as const;
export type AssetStatus = (typeof ASSET_STATUSES)[number];

/** Где в кадре находится объект — для CSS-кропов через `object-position`. Обе оси идут от 0 (лево/верх) до 1 (право/низ); при отсутствии — центр. */
export interface AssetFocalPoint {
  x: number;
  y: number;
}

/** Один конкретный, готовый к рендеру файл — вариант одной адаптивной ширины ассета. */
export interface AssetFile {
  url: string;
  width: number;
  height?: number;
}

export interface AssetManifestEntry {
  asset_id: string;
  purpose: string;
  type: AssetType;
  source: AssetSource;
  /** Обязателен при source: "higgsfield" — точный промпт генерации. */
  prompt?: string;
  aspect_ratio: string;
  /**
   * Один сгенерированный/полученный файл часто используется в нескольких
   * секциях (hero-кадр, переграженный для закрывающего CTA, товарный
   * кадр, перекадрированный в тайл грида) — массив фиксирует все секции
   * повторного использования без дублирования записи под каждое размещение.
   */
  section: SectionId | SectionId[];
  status: AssetStatus;
  focalPoint?: AssetFocalPoint;
  /**
   * Реальный файл/файлы — заполняется, когда `status` достигает
   * "generated". Секция резолвит их через `resolveAsset` (см.
   * src/lib/assets), пока список пуст — используется плейсхолдер.
   */
  files?: AssetFile[];
}

export type AssetManifest = AssetManifestEntry[];

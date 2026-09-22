import type { SectionId } from "./section";

/**
 * ASSETS layer.
 * Tracks every image/video a business needs, its generation status, and
 * where it belongs — never the asset binary or generation credentials.
 */
export type AssetType = "image" | "video";

export type AssetSource =
  | "higgsfield"
  | "stock"
  | "client-provided"
  | "placeholder";

export type AssetStatus =
  | "planned"
  | "approved"
  | "generating"
  | "generated"
  | "rejected";

/** Where the subject sits in frame, for CSS `object-position`-driven crops. Both axes run 0 (left/top) to 1 (right/bottom); omitted means center. */
export interface AssetFocalPoint {
  x: number;
  y: number;
}

/** One concrete, renderable file — a single responsive width variant of an asset. */
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
  /** Required when source is "higgsfield"; the exact generation prompt. */
  prompt?: string;
  aspect_ratio: string;
  /**
   * One generated/sourced file commonly backs more than one section (a
   * hero shot re-graded for the closing CTA, a product shot recropped
   * into a grid tile) — an array records every section it's reused in,
   * without duplicating the entry per placement.
   */
  section: SectionId | SectionId[];
  status: AssetStatus;
  focalPoint?: AssetFocalPoint;
  /**
   * The real file variant(s) — populated once `status` reaches
   * "generated". A section resolves this via `resolveAsset` (see
   * src/lib/assets) and falls back to a placeholder while it's empty.
   */
  files?: AssetFile[];
}

export type AssetManifest = AssetManifestEntry[];

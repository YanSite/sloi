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

export interface AssetManifestEntry {
  asset_id: string;
  purpose: string;
  type: AssetType;
  source: AssetSource;
  /** Required when source is "higgsfield"; the exact generation prompt. */
  prompt?: string;
  aspect_ratio: string;
  section: SectionId;
  status: AssetStatus;
}

export type AssetManifest = AssetManifestEntry[];

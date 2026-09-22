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
  /** Every section this asset is placed in, normalized to an array regardless of how the manifest entry declared it. */
  sections: SectionId[];
  /** Real, renderable file variants — empty until `status` reaches "generated". Components fall back to a placeholder when this is empty. */
  sources: AssetFile[];
}

const DEFAULT_FOCAL_POINT: AssetFocalPoint = { x: 0.5, y: 0.5 };

/**
 * Generic asset resolver — the ASSET REGISTRY a `MediaRef.assetId` goes
 * through to become real render data. A section component asks for an
 * asset by id; it never reads an `AssetManifest` entry or a file path
 * directly. Throws on an unknown id, same as `resolveSectionComponent` in
 * src/lib/render/section-registry.ts — an unresolved asset reference is a
 * config mistake to surface, not something to silently degrade.
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

/** Builds a `srcset`-ready string from resolved responsive sources. */
export function toSrcSet(sources: AssetFile[]): string | undefined {
  if (sources.length === 0) return undefined;
  return sources.map((file) => `${file.url} ${file.width}w`).join(", ");
}

/** CSS `object-position` value from a resolved focal point. */
export function toObjectPosition(focalPoint: AssetFocalPoint): string {
  return `${focalPoint.x * 100}% ${focalPoint.y * 100}%`;
}

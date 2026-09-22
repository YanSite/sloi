/**
 * ASSET REFERENCE.
 * Points at an entry in a business's AssetManifest by id — a WOW section
 * prop never takes a raw URL, only this. Re-exported from
 * `@/components/wow/sections` for import-path convenience; this file is
 * the canonical definition.
 */
export interface MediaRef {
  assetId: string;
  alt?: string;
}

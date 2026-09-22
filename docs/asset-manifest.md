# Asset Manifest

The **ASSETS** layer. Tracks every image/video a business's page needs: what
it's for, where it comes from, and its generation status. Never the binary
itself and never generation credentials — this is bookkeeping, not storage.

## Type

Defined at [src/lib/types/asset-manifest.ts](../src/lib/types/asset-manifest.ts):

```ts
interface AssetManifestEntry {
  asset_id: string;     // stable id referenced by section components
  purpose: string;      // human-readable, e.g. "hero background"
  type: "image" | "video";
  source: "higgsfield" | "stock" | "client-provided" | "placeholder";
  prompt?: string;       // required when source is "higgsfield"
  aspect_ratio: string;  // e.g. "16:9", "4:5"
  section: SectionId;    // which WOW section this asset belongs to
  status: "planned" | "approved" | "generating" | "generated" | "rejected";
}

type AssetManifest = AssetManifestEntry[];
```

## Lifecycle

`planned` → `approved` → `generating` → `generated` (or `rejected` at any
point before `generated`). An entry only reaches `generating` after explicit
human approval — see [generation-policy.md](./generation-policy.md) for the
full workflow and the Higgsfield budget that gates this.

## How sections reference assets

WOW section props never take a URL directly. They take a `MediaRef`
(`{ assetId, alt? }`, see
[src/components/wow/sections/types.ts](../src/components/wow/sections/types.ts))
that points at an `asset_id` in the manifest. This keeps sections agnostic
to *where* an asset came from or whether it's even been generated yet.

## Current instance

[src/config/verticals/florist/asset-manifest.ts](../src/config/verticals/florist/asset-manifest.ts)
is an empty array. No assets have been planned, prompted, or generated for
the florist vertical yet.

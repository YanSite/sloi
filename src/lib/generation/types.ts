/**
 * GENERATION WORKFLOW state machine — deliberately separate from
 * `AssetStatus` (src/lib/types/asset-manifest.ts). `AssetStatus` is the
 * coarse, current-state field on a manifest entry; `GenerationState` is
 * the richer per-attempt workflow this module drives (adds an explicit
 * REVIEW gate and a RETRY loop that `AssetStatus` doesn't need to
 * represent). A human applying a finished generation is what would move
 * an `AssetManifestEntry.status` forward — this module never mutates a
 * manifest itself, only reasons about and logs the workflow around it.
 */
export const GENERATION_STATES = [
  "PLANNED",
  "APPROVED",
  "GENERATING",
  "GENERATED",
  "REVIEW",
  "RETRY",
  "REJECTED",
] as const;

export type GenerationState = (typeof GENERATION_STATES)[number];

export const GENERATION_MODES = ["demo", "production"] as const;
export type GenerationMode = (typeof GENERATION_MODES)[number];

/** Minimum fields a generation log entry must carry — see /docs/generation-policy.md's "What showing the asset plan means in practice". */
export interface GenerationLogEntry {
  assetId: string;
  status: GenerationState;
  mode: GenerationMode;
  retryCount: number;
  /** ISO 8601. */
  timestamp: string;
  provider: string;
  model?: string;
  promptVersion: string;
}

export interface GenerationContext {
  provider: string;
  model?: string;
  promptVersion: string;
}

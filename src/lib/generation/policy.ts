import type { GenerationMode } from "./types";

export interface GenerationPolicy {
  maxImageGenerations: number;
  maxVideoGenerations: number;
  maxRetriesPerAsset: number;
  requiresExplicitApproval: boolean;
  allowsBatchGeneration: boolean;
}

/**
 * Demo mode budget. NOTE: /docs/generation-policy.md's "Demo mode limit"
 * currently reads "Maximum 1 video generation" — this module encodes
 * `maxVideoGenerations: 0` instead, per Stage 7's explicit instruction
 * ("0 video generations"). That's a real discrepancy between this code
 * and the current doc text, not an oversight — see the Stage 7 report
 * for the flag; the doc should be reconciled by a human decision, not
 * silently edited here.
 */
export const DEMO_MODE_POLICY: GenerationPolicy = {
  maxImageGenerations: 4,
  maxVideoGenerations: 0,
  maxRetriesPerAsset: 1,
  requiresExplicitApproval: true,
  allowsBatchGeneration: false,
};

/** Production mode budget — taken as-is from /docs/generation-policy.md's "Production mode limit" (6 images / 2 videos / 1 retry). Not active for any vertical in this project yet. */
export const PRODUCTION_MODE_POLICY: GenerationPolicy = {
  maxImageGenerations: 6,
  maxVideoGenerations: 2,
  maxRetriesPerAsset: 1,
  requiresExplicitApproval: true,
  allowsBatchGeneration: false,
};

export function getPolicy(mode: GenerationMode): GenerationPolicy {
  return mode === "demo" ? DEMO_MODE_POLICY : PRODUCTION_MODE_POLICY;
}

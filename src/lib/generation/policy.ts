import type { GenerationMode } from "./types";

export interface GenerationPolicy {
  maxImageGenerations: number;
  maxVideoGenerations: number;
  maxRetriesPerAsset: number;
  requiresExplicitApproval: boolean;
  allowsBatchGeneration: boolean;
}

/**
 * Бюджет demo mode. Согласован с разделом «Demo mode limit» в
 * /docs/generation-policy.md — 4 изображения, 0 видео, 1 retry на ассет.
 */
export const DEMO_MODE_POLICY: GenerationPolicy = {
  maxImageGenerations: 4,
  maxVideoGenerations: 0,
  maxRetriesPerAsset: 1,
  requiresExplicitApproval: true,
  allowsBatchGeneration: false,
};

/** Бюджет production mode — взят как есть из раздела «Production mode limit» /docs/generation-policy.md (6 изображений / 2 видео / 1 retry). Пока не активен ни для одной вертикали проекта. */
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

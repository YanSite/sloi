import type { AssetManifest, AssetManifestEntry } from "@/lib/types";
import { canTransition } from "./transitions";
import { getPolicy } from "./policy";
import type { GenerationContext, GenerationLogEntry, GenerationMode, GenerationState } from "./types";

/** The most recent logged state for an asset, or "PLANNED" if it has no log history yet — every asset starts there implicitly. */
export function latestState(log: GenerationLogEntry[], assetId: string): GenerationState {
  const entries = log.filter((entry) => entry.assetId === assetId);
  return entries.length > 0 ? entries[entries.length - 1].status : "PLANNED";
}

function generatingAttemptsSoFar(log: GenerationLogEntry[], assetId: string): number {
  return log.filter((entry) => entry.assetId === assetId && entry.status === "GENERATING").length;
}

export interface TransitionResult {
  ok: boolean;
  log: GenerationLogEntry[];
  error?: string;
}

/**
 * The one function that advances an asset's generation state — no bulk
 * "generate everything planned" function exists anywhere in this module,
 * which is what enforces /docs/generation-policy.md's "no batch
 * generation without explicit approval" rule at the API surface rather
 * than as a runtime check nothing calls. Rejects the transition (without
 * mutating `log`) when it's not a legal edge in the state graph, or when
 * entering GENERATING would exceed `mode`'s retry budget.
 */
export function transitionAsset(
  log: GenerationLogEntry[],
  assetId: string,
  to: GenerationState,
  mode: GenerationMode,
  context: GenerationContext
): TransitionResult {
  const from = latestState(log, assetId);

  if (!canTransition(from, to)) {
    return { ok: false, log, error: `Cannot transition asset "${assetId}" from ${from} to ${to}.` };
  }

  const policy = getPolicy(mode);
  const priorAttempts = generatingAttemptsSoFar(log, assetId);
  if (to === "GENERATING" && priorAttempts > policy.maxRetriesPerAsset) {
    return {
      ok: false,
      log,
      error: `Asset "${assetId}" has exceeded the max retry budget (${policy.maxRetriesPerAsset}) for ${mode} mode.`,
    };
  }

  const entry: GenerationLogEntry = {
    assetId,
    status: to,
    mode,
    retryCount: to === "GENERATING" ? priorAttempts : Math.max(0, priorAttempts - 1),
    timestamp: new Date().toISOString(),
    provider: context.provider,
    model: context.model,
    promptVersion: context.promptVersion,
  };

  return { ok: true, log: [...log, entry] };
}

export interface GenerationBudgetCheck {
  withinBudget: boolean;
  imagesRequested: number;
  videosRequested: number;
  policy: ReturnType<typeof getPolicy>;
  issues: string[];
}

/** "SHOW MAXIMUM GENERATION BUDGET" from /docs/generation-policy.md's required workflow — checks a manifest's planned Higgsfield entries against the mode's hard caps before anything is approved. */
export function checkGenerationBudget(manifest: AssetManifest, mode: GenerationMode): GenerationBudgetCheck {
  const policy = getPolicy(mode);
  const pending = manifest.filter((entry) => entry.source === "higgsfield" && entry.status !== "rejected");
  const imagesRequested = pending.filter((entry) => entry.type === "image").length;
  const videosRequested = pending.filter((entry) => entry.type === "video").length;

  const issues: string[] = [];
  if (imagesRequested > policy.maxImageGenerations) {
    issues.push(`${imagesRequested} image generations requested, exceeding the ${mode} cap of ${policy.maxImageGenerations}.`);
  }
  if (videosRequested > policy.maxVideoGenerations) {
    issues.push(`${videosRequested} video generations requested, exceeding the ${mode} cap of ${policy.maxVideoGenerations}.`);
  }

  return { withinBudget: issues.length === 0, imagesRequested, videosRequested, policy, issues };
}

export interface GenerationCallEstimate {
  imagesToGenerate: number;
  videosToGenerate: number;
  /** One call per not-yet-generated asset — never a cost or credit figure, only a count (no provider/MCP here reports real pricing, see policy.ts). */
  totalCalls: number;
  /** Worst case if every pending asset needed its full retry allowance. */
  maxPossibleCallsWithRetries: number;
}

/** Call-count estimate for a batch of still-"planned" Higgsfield assets. Deliberately counts calls, never money/credits — see the Stage 7 instruction this satisfies. */
export function estimateGenerationCalls(manifest: AssetManifest, mode: GenerationMode): GenerationCallEstimate {
  const policy = getPolicy(mode);
  const pending = manifest.filter((entry) => entry.source === "higgsfield" && entry.status === "planned");
  const imagesToGenerate = pending.filter((entry) => entry.type === "image").length;
  const videosToGenerate = pending.filter((entry) => entry.type === "video").length;
  const totalCalls = imagesToGenerate + videosToGenerate;

  return {
    imagesToGenerate,
    videosToGenerate,
    totalCalls,
    maxPossibleCallsWithRetries: totalCalls * (1 + policy.maxRetriesPerAsset),
  };
}

export interface AssetPlanLine {
  asset_id: string;
  purpose: string;
  type: AssetManifestEntry["type"];
  prompt?: string;
  aspect_ratio: string;
  section: AssetManifestEntry["section"];
}

export interface AssetPlanSummary {
  lines: AssetPlanLine[];
  budget: GenerationBudgetCheck;
}

/**
 * "SHOW ASSET PLAN" + "SHOW MAXIMUM GENERATION BUDGET" from
 * /docs/generation-policy.md, as one function — exactly the fields that
 * section says must be shown (asset_id, purpose, type, prompt,
 * aspect_ratio, section) plus the running budget total, before anything
 * is approved.
 */
export function buildAssetPlanSummary(manifest: AssetManifest, mode: GenerationMode): AssetPlanSummary {
  const lines: AssetPlanLine[] = manifest
    .filter((entry) => entry.source === "higgsfield" && entry.status === "planned")
    .map((entry) => ({
      asset_id: entry.asset_id,
      purpose: entry.purpose,
      type: entry.type,
      prompt: entry.prompt,
      aspect_ratio: entry.aspect_ratio,
      section: entry.section,
    }));

  return { lines, budget: checkGenerationBudget(manifest, mode) };
}

import type { AssetManifest, AssetManifestEntry } from "@/lib/types";
import { canTransition } from "./transitions";
import { getPolicy } from "./policy";
import type {
  GenerationContext,
  GenerationLogEntry,
  GenerationMode,
  GenerationState,
} from "./types";

/** Последнее залогированное состояние ассета, либо "PLANNED", если истории лога ещё нет — с этого состояния неявно начинается каждый ассет. */
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
 * Единственная функция, продвигающая состояние генерации ассета — нигде
 * в модуле нет массовой функции «сгенерировать всё запланированное»,
 * именно это обеспечивает правило /docs/generation-policy.md «никакой
 * batch-генерации без явного согласования» на уровне API, а не как
 * рантайм-проверку, которую никто не вызывает. Отклоняет переход (не
 * изменяя `log`), если он не является допустимым ребром графа состояний,
 * либо если вход в GENERATING превысил бы retry-бюджет `mode`.
 */
export function transitionAsset(
  log: GenerationLogEntry[],
  assetId: string,
  to: GenerationState,
  mode: GenerationMode,
  context: GenerationContext,
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

/** «SHOW MAXIMUM GENERATION BUDGET» из required workflow в /docs/generation-policy.md — проверяет запланированные Higgsfield-записи manifest против жёстких лимитов режима, прежде чем что-либо будет согласовано. */
export function checkGenerationBudget(
  manifest: AssetManifest,
  mode: GenerationMode,
): GenerationBudgetCheck {
  const policy = getPolicy(mode);
  const pending = manifest.filter(
    (entry) => entry.source === "higgsfield" && entry.status !== "rejected",
  );
  const imagesRequested = pending.filter((entry) => entry.type === "image").length;
  const videosRequested = pending.filter((entry) => entry.type === "video").length;

  const issues: string[] = [];
  if (imagesRequested > policy.maxImageGenerations) {
    issues.push(
      `${imagesRequested} image generations requested, exceeding the ${mode} cap of ${policy.maxImageGenerations}.`,
    );
  }
  if (videosRequested > policy.maxVideoGenerations) {
    issues.push(
      `${videosRequested} video generations requested, exceeding the ${mode} cap of ${policy.maxVideoGenerations}.`,
    );
  }

  return { withinBudget: issues.length === 0, imagesRequested, videosRequested, policy, issues };
}

export interface GenerationCallEstimate {
  imagesToGenerate: number;
  videosToGenerate: number;
  /** Один вызов на ещё не сгенерированный ассет — никогда не цифра стоимости или кредитов, только счётчик (ни один provider/MCP здесь не сообщает реальные цены, см. policy.ts). */
  totalCalls: number;
  /** Худший случай, если бы каждому ожидающему ассету понадобился весь retry-лимит. */
  maxPossibleCallsWithRetries: number;
}

/** Оценка количества вызовов для батча ещё "planned" Higgsfield-ассетов. Намеренно считает вызовы, никогда не деньги/кредиты — см. инструкцию Stage 7, которой это соответствует. */
export function estimateGenerationCalls(
  manifest: AssetManifest,
  mode: GenerationMode,
): GenerationCallEstimate {
  const policy = getPolicy(mode);
  const pending = manifest.filter(
    (entry) => entry.source === "higgsfield" && entry.status === "planned",
  );
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
 * «SHOW ASSET PLAN» + «SHOW MAXIMUM GENERATION BUDGET» из
 * /docs/generation-policy.md в одной функции — ровно те поля, которые
 * требует показывать этот раздел (asset_id, purpose, type, prompt,
 * aspect_ratio, section), плюс текущий итог по бюджету, прежде чем
 * что-либо согласовано.
 */
export function buildAssetPlanSummary(
  manifest: AssetManifest,
  mode: GenerationMode,
): AssetPlanSummary {
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

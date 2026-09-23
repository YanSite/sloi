/**
 * Конечный автомат GENERATION WORKFLOW — сознательно отделён от
 * `AssetStatus` (src/lib/types/asset-manifest.ts). `AssetStatus` —
 * укрупнённое поле текущего состояния записи manifest; `GenerationState`
 * — более детальный workflow одной попытки, которым управляет этот
 * модуль (добавляет явный шлюз REVIEW и цикл RETRY, которые `AssetStatus`
 * представлять не должен). Продвинуть `AssetManifestEntry.status` дальше
 * должен человек, применяющий результат генерации — этот модуль никогда
 * не изменяет сам manifest, только описывает и логирует workflow вокруг него.
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

/** Минимальный набор полей записи generation-лога — см. раздел /docs/generation-policy.md «What showing the asset plan means in practice». */
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

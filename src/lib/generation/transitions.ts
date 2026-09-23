import type { GenerationState } from "./types";

/**
 * ЕДИНСТВЕННАЯ допустимая последовательность по разделу «Required
 * workflow» /docs/generation-policy.md: PLAN → SHOW ASSET PLAN → SHOW
 * BUDGET → WAIT FOR APPROVAL → GENERATE. Кодирование её как графа (а не
 * чек-листа) превращает «обязательное явное согласование» и «нельзя
 * генерировать сразу из planned» в структурные гарантии, а не в
 * соглашения, которые кто-то должен помнить: у PLANNED нет прямого ребра
 * к GENERATING, так что пропустить согласование этот модуль просто не
 * может — такого состояния не существует.
 *
 * APPROVED — один узел, но достижим из двух мест (свежий PLANNED или
 * прошедший проверку REVIEW) — то же целевое состояние, тот же смысл
 * («разрешено генерировать/отдавать»), поэтому один узел — это
 * правильно, а не дублирование.
 */
const TRANSITIONS: Record<GenerationState, readonly GenerationState[]> = {
  PLANNED: ["APPROVED"],
  APPROVED: ["GENERATING"],
  GENERATING: ["GENERATED", "REJECTED"],
  GENERATED: ["REVIEW"],
  REVIEW: ["APPROVED", "RETRY", "REJECTED"],
  RETRY: ["GENERATING"],
  REJECTED: [],
};

export function canTransition(from: GenerationState, to: GenerationState): boolean {
  return TRANSITIONS[from].includes(to);
}

export function allowedNextStates(from: GenerationState): readonly GenerationState[] {
  return TRANSITIONS[from];
}

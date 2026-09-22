import type { GenerationState } from "./types";

/**
 * The ONLY allowed sequence, per /docs/generation-policy.md's "Required
 * workflow" section: PLAN → SHOW ASSET PLAN → SHOW BUDGET → WAIT FOR
 * APPROVAL → GENERATE. Encoding it as a graph (rather than a checklist)
 * is what makes "explicit approval required" and "no generating straight
 * from planned" structural guarantees instead of conventions someone has
 * to remember: PLANNED has no direct edge to GENERATING, so skipping
 * approval isn't a state this module can reach.
 *
 * APPROVED appears once as a node but reachable from two places (fresh
 * PLANNED, or a REVIEW that passed) — same target state, same meaning
 * ("cleared to generate/ship"), so one node is correct, not a
 * duplication.
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

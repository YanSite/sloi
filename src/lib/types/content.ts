import type { SectionId } from "./section";

/**
 * BUSINESS-SPECIFIC CONTENT layer.
 * Marketing copy per section (headlines, quotes, captions) — distinct from
 * BusinessProfile's objective facts. Left loose until each WOW section
 * defines its own strict props in a later phase.
 */
export type SectionContent = Record<string, unknown>;

export type ExperienceContent = Partial<Record<SectionId, SectionContent>>;

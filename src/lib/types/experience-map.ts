import type { SectionId } from "./section";

/**
 * EXPERIENCE STRUCTURE layer.
 * Which WOW sections appear for a business, in what order. Carries no
 * copy and no styling — only composition.
 */
export interface ExperienceMapEntry {
  section: SectionId;
  enabled: boolean;
  notes?: string;
}

export type ExperienceMap = ExperienceMapEntry[];

import type { SectionId } from "./section";
import type { MotionConfig } from "./motion";

/**
 * EXPERIENCE STRUCTURE layer.
 * Which WOW sections appear for a business, in what order. Carries no
 * copy and no styling — only composition.
 */
export interface ExperienceMapEntry {
  section: SectionId;
  enabled: boolean;
  /** Which registered implementation of this section to use, e.g. "cinematic" vs "default". Falls back to "default" when omitted — see src/lib/render/section-registry.ts. */
  variant?: string;
  /** Per-instance motion override; falls back to the SiteConfig-level default when omitted. */
  motion?: MotionConfig;
  notes?: string;
}

export type ExperienceMap = ExperienceMapEntry[];

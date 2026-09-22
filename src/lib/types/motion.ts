/**
 * MOTION layer.
 * Vertical-agnostic animation vocabulary — a `VisualDNA.motionPersonality`
 * slug (e.g. "gravity-drift") selects among these presets, it never
 * defines new ones per business. Re-exported from
 * `@/components/wow/motion` for import-path convenience; this file is the
 * canonical definition.
 */
export type MotionPreset =
  | "fade-up"
  | "fade-in"
  | "stagger-children"
  | "scale-in"
  /** Scroll-linked scale/translate on one or two image layers — the two named Signature WOW builds only, see /docs/visual-dna.md#webgl-language. */
  | "camera-parallax"
  /** Timed opacity/color transition through a scene's background color — the Final CTA bookend, see /docs/visual-dna.md#transition-language. */
  | "cross-fade";

export interface MotionConfig {
  preset: MotionPreset;
  delay?: number;
  duration?: number;
}

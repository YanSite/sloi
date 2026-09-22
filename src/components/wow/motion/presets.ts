import type { MotionPreset } from "./types";

export interface MotionTiming {
  /** Seconds. */
  duration: number;
  /** Seconds. */
  delay: number;
}

/**
 * Default timing for each named `MotionPreset` — the "intent" a section
 * receives via `MotionConfig.preset` (e.g. `"fade-up"`, `"camera-
 * parallax"`) without necessarily specifying `duration`/`delay` itself.
 * This is a lookup table, not a dispatcher: a section still chooses
 * which primitive (`Reveal`, `Parallax`, ...) to compose — this just
 * fills in sensible numbers for a preset name.
 */
export const motionPresetTiming: Record<MotionPreset, MotionTiming> = {
  "fade-up": { duration: 0.7, delay: 0 },
  "fade-in": { duration: 0.6, delay: 0 },
  "stagger-children": { duration: 0.5, delay: 0.1 },
  "scale-in": { duration: 0.6, delay: 0 },
  "camera-parallax": { duration: 1.2, delay: 0 },
  "cross-fade": { duration: 1.2, delay: 0 },
};

const fallbackTiming: MotionTiming = { duration: 0.7, delay: 0 };

export function resolveMotionTiming(
  preset: MotionPreset | undefined,
  overrides?: { duration?: number; delay?: number }
): MotionTiming {
  const base = preset ? motionPresetTiming[preset] : fallbackTiming;
  return {
    duration: overrides?.duration ?? base.duration,
    delay: overrides?.delay ?? base.delay,
  };
}

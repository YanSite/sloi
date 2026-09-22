/**
 * Motion architecture only. No animation library is installed yet — that
 * choice is deferred until a WOW section is actually being built out.
 */
export type MotionPreset = "fade-up" | "fade-in" | "stagger-children" | "scale-in";

export interface MotionConfig {
  preset: MotionPreset;
  delay?: number;
  duration?: number;
}

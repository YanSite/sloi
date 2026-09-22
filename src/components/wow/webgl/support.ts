/**
 * Feature-detects real WebGL availability. SSR-safe (returns false with
 * no `window`) and never throws — a browser that refuses context
 * creation (old GPU, driver blocklist, out of contexts) just reports
 * `false` here rather than crashing the caller.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    return gl !== null;
  } catch {
    return false;
  }
}

/**
 * Canonical definitions moved to `@/lib/types` — SiteConfig needs
 * MotionConfig too, so it can't live only inside a components folder.
 * Re-exported here so existing `motion.types` imports keep working. No
 * animation library is installed yet — that choice is deferred until a
 * WOW section is actually being built out.
 */
export type { MotionPreset, MotionConfig } from "@/lib/types";

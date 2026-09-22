/** Canonical definition moved to `@/lib/types` — a core, cross-cutting type referenced by the asset-manifest layer too. Re-exported here so existing `./types` imports across this folder keep working. */
export type { MediaRef } from "@/lib/types";

/** Shared prop primitive reused across WOW sections. */
export interface CtaLink {
  label: string;
  href: string;
}

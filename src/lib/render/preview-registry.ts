import type { SiteConfig } from "@/lib/types";
import { demoSiteConfig } from "./__fixtures__/demo-site-config";
import { abstractTestSiteConfig } from "./__fixtures__/abstract-test-site-config";

export interface PreviewEntry {
  slug: string;
  label: string;
  config: SiteConfig;
}

/**
 * PREVIEW REGISTRY — the "SiteConfig → Preview" step of the production
 * workflow (Business Profile → Visual DNA → Experience → Content →
 * Assets → SiteConfig → Preview, see Stage 7). Register any SiteConfig
 * here and it's viewable at /preview/<slug> with no component or route
 * changes — that's the entire preview mechanism. Both fixtures are
 * already run through `assertValidSiteConfig` where they're built (see
 * src/lib/render/__fixtures__), so anything reachable from here is
 * known-valid before it's ever rendered.
 */
export const previewRegistry: PreviewEntry[] = [
  { slug: "florist-demo", label: "Florist — Botanical Noir (demo content)", config: demoSiteConfig },
  { slug: "abstract-test", label: "Abstract test theme", config: abstractTestSiteConfig },
];

export function getPreviewEntry(slug: string): PreviewEntry | undefined {
  return previewRegistry.find((entry) => entry.slug === slug);
}

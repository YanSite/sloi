import type { SiteConfig } from "@/lib/types";
import { floristSiteConfig } from "@/config/verticals/florist";
import { barberSiteConfig } from "@/config/verticals/barber";
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
 * changes — that's the entire preview mechanism.
 *
 * Lives under `src/config`, not `src/lib/render` (where Stage 7 first put
 * it) — this file names specific verticals ("florist", "barber") by
 * import, which is exactly what the core engine layers
 * (`lib/render`/`components/wow`/etc.) are never allowed to do. A
 * registry that lists real vertical configs is inherently
 * vertical-*aware*, so it belongs in the same layer as
 * `config/verticals/*`, not inside the reusable core. `./__fixtures__`
 * (demo/abstract-test configs) moved here alongside it for the same
 * reason at the Engine v1 Lock audit — they used to live under
 * `src/lib/render/__fixtures__` and import `@/config/verticals/florist`
 * directly, the same core-purity violation this registry once had.
 */
export const previewRegistry: PreviewEntry[] = [
  { slug: "florist", label: "Florist — Botanical Noir", config: floristSiteConfig },
  { slug: "barber", label: "Barber — Iron & Ash", config: barberSiteConfig },
  { slug: "florist-demo", label: "Florist — Botanical Noir (renderer proof fixture)", config: demoSiteConfig },
  { slug: "abstract-test", label: "Abstract test theme", config: abstractTestSiteConfig },
];

export function getPreviewEntry(slug: string): PreviewEntry | undefined {
  return previewRegistry.find((entry) => entry.slug === slug);
}

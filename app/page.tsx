import { PageRenderer } from "@/lib/render";
import { demoSiteConfig } from "@/lib/render/__fixtures__/demo-site-config";

// Renders via demoSiteConfig (placeholder copy) rather than the real
// floristSiteConfig: floristContent is still intentionally empty — no
// copywriting has been approved (see /docs/experience-map.md's "Out of
// scope"). Now that CinematicHero/ProductReveal/FinalCTA render real
// (if placeholder-visual) markup instead of stubs, they need content to
// render meaningfully. Swap back to floristSiteConfig once real copy
// exists.
export default function Home() {
  return <PageRenderer config={demoSiteConfig} />;
}

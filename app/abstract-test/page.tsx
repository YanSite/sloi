import { PageRenderer } from "@/lib/render";
import { abstractTestSiteConfig } from "@/lib/render/__fixtures__/abstract-test-site-config";

// Stage 5's architecture proof: same PageRenderer, same section
// components as "/", a completely different SiteConfig (see
// abstract-test-site-config.ts) — different vertical, palette,
// typography, spacing/radius/shadow scale, and assets. If this page
// needed different components to render correctly, the architecture —
// not this page — would be the thing to fix.
export default function AbstractTestPage() {
  return <PageRenderer config={abstractTestSiteConfig} />;
}

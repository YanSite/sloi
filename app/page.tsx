import { PageRenderer } from "@/lib/render";
import { floristSiteConfig } from "@/config/verticals/florist";

// The florist vertical's own SiteConfig — real (if placeholder-copy)
// content since Stage 8, no longer the demoSiteConfig stand-in Stage 3
// used while floristContent was still empty. See /preview for every
// registered SiteConfig, including this same one at /preview/florist.
export default function Home() {
  return <PageRenderer config={floristSiteConfig} />;
}

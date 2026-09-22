import { PageRenderer } from "@/lib/render";
import { floristSiteConfig } from "@/config/verticals/florist";

export default function Home() {
  return <PageRenderer config={floristSiteConfig} />;
}

import { notFound } from "next/navigation";
import { PageRenderer } from "@/lib/render";
import { getPreviewEntry, previewRegistry } from "@/config/preview-registry";

export function generateStaticParams() {
  return previewRegistry.map((entry) => ({ slug: entry.slug }));
}

// Renders any registered SiteConfig by slug — the general-purpose
// replacement for one-off routes like the old /abstract-test page (see
// Stage 5): register a config in preview-registry.ts, it's previewable
// here, no route or component changes needed per config.
export default async function PreviewPage({ params }: PageProps<"/preview/[slug]">) {
  const { slug } = await params;
  const entry = getPreviewEntry(slug);
  if (!entry) notFound();
  return <PageRenderer config={entry.config} />;
}

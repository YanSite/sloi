import { notFound } from "next/navigation";
import { PageRenderer } from "@/lib/render";
import { getPreviewEntry, previewRegistry } from "@/config/preview-registry";

export function generateStaticParams() {
  return previewRegistry.map((entry) => ({ slug: entry.slug }));
}

// Рендерит любой зарегистрированный SiteConfig по slug — универсальная
// замена одноразовым роутам вроде старой страницы /abstract-test (см.
// Stage 5): зарегистрируйте конфиг в preview-registry.ts, и его можно
// смотреть здесь — без правок роута или компонентов под каждый конфиг.
export default async function PreviewPage({ params }: PageProps<"/preview/[slug]">) {
  const { slug } = await params;
  const entry = getPreviewEntry(slug);
  if (!entry) notFound();
  return <PageRenderer config={entry.config} />;
}

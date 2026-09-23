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
 * PREVIEW REGISTRY — шаг «SiteConfig → Preview» production workflow
 * (Business Profile → Visual DNA → Experience → Content → Assets →
 * SiteConfig → Preview, см. Stage 7). Зарегистрируйте любой SiteConfig
 * здесь — и он станет доступен на /preview/<slug> без правок компонентов
 * или роутов, это и есть весь preview-механизм.
 *
 * Живёт в `src/config`, а не в `src/lib/render` (куда его изначально
 * поместила Stage 7) — этот файл ссылается на конкретные вертикали
 * ("florist", "barber") через импорт, а именно это core-слоям движка
 * (`lib/render`/`components/wow` и т.д.) делать никогда нельзя. Реестр,
 * перечисляющий реальные конфиги вертикалей, по своей природе
 * вертикально-*осведомлён*, поэтому ему место рядом с
 * `config/verticals/*`, а не внутри переиспользуемого ядра.
 * `./__fixtures__` (demo/abstract-test конфиги) перенесены сюда же по
 * той же причине во время Engine v1 Lock audit — раньше они жили в
 * `src/lib/render/__fixtures__` и импортировали `@/config/verticals/florist`
 * напрямую — то же нарушение чистоты core, что раньше было и у этого реестра.
 */
export const previewRegistry: PreviewEntry[] = [
  { slug: "florist", label: "Florist — Botanical Noir", config: floristSiteConfig },
  { slug: "barber", label: "Barber — Iron & Ash", config: barberSiteConfig },
  {
    slug: "florist-demo",
    label: "Florist — Botanical Noir (renderer proof fixture)",
    config: demoSiteConfig,
  },
  { slug: "abstract-test", label: "Abstract test theme", config: abstractTestSiteConfig },
];

export function getPreviewEntry(slug: string): PreviewEntry | undefined {
  return previewRegistry.find((entry) => entry.slug === slug);
}

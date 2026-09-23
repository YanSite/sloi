import Link from "next/link";
import { previewRegistry } from "@/config/preview-registry";

// Индекс preview — последний шаг production workflow (Business Profile →
// Visual DNA → Experience → Content → Assets → SiteConfig → Preview, см.
// Stage 7). До любого SiteConfig в реестре — одна ссылка; добавление
// нового конфига сюда никогда не затрагивает компонент секции.
export default function PreviewIndexPage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Preview</h1>
      <ul>
        {previewRegistry.map((entry) => (
          <li key={entry.slug}>
            <Link href={`/preview/${entry.slug}`}>{entry.label}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

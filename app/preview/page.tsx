import Link from "next/link";
import { previewRegistry } from "@/config/preview-registry";

// Preview index — the last step of the production workflow (Business
// Profile → Visual DNA → Experience → Content → Assets → SiteConfig →
// Preview, see Stage 7). Every SiteConfig in the registry is one link
// away; adding another config here never touches a section component.
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

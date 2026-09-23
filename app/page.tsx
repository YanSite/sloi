import { PageRenderer } from "@/lib/render";
import { floristSiteConfig } from "@/config/verticals/florist";

// Собственный SiteConfig вертикали florist — реальный (пусть и
// placeholder) контент с Stage 8, больше не заглушка demoSiteConfig,
// которой Stage 3 пользовалась, пока floristContent был пуст. Все
// зарегистрированные SiteConfig — на /preview, включая этот же на
// /preview/florist.
export default function Home() {
  return <PageRenderer config={floristSiteConfig} />;
}

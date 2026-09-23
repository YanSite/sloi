import type { AssetManifest, BusinessProfile, SiteConfig, Template, VisualDNA } from "@/lib/types";
import { resolveTheme } from "@/lib/theme";
import { assertValidSiteConfig } from "@/lib/validation";
import { defineContent } from "@/lib/render";

/**
 * Фикстура #2 «критического теста» Stage 5: сознательно плоский,
 * не-ботанический конфиг — плоская сине-серая палитра, только sans-шрифт,
 * острые углы, без теней — не делит с вертикалью florist НИЧЕГО, кроме
 * компонентов секций и рендерера. Доказывает, что один и тот же
 * `CinematicHero` / `ProductReveal` / `FinalCTA` корректно рендерятся при
 * совершенно другой VisualDNA/theme/content/assets без единой правки
 * компонента. Если бы этой фикстуре потребовалась правка секции, это была
 * бы архитектурная ошибка, которую нужно исправлять, а не частный случай
 * фикстуры — см. инструкцию Stage 5, которой этот файл соответствует.
 */
const abstractVisualDNA: VisualDNA = {
  vertical: "local-services",
  mood: ["plain", "utilitarian"],
  colorPalette: {
    background: "#0B1220",
    foreground: "#E7ECF3",
    primary: "#2F6FED",
    secondary: "#3A4B63",
    accent: "#5FD4C4",
  },
  typography: {
    display: "system sans-serif, bold",
    heading: "system sans-serif, semibold",
    body: "system sans-serif, regular",
  },
};

const abstractTheme = resolveTheme(
  abstractVisualDNA,
  {
    display: "system-ui, sans-serif",
    heading: "system-ui, sans-serif",
    body: "system-ui, sans-serif",
  },
  {
    // Сознательно переопределяет общую шкалу по умолчанию — острые углы,
    // без elevation — чтобы доказать, что токены radius/shadow реально
    // приходят из темы, а не из захардкоженного класса в компоненте секции.
    radius: { none: "0px", sm: "0px", md: "0px", lg: "0px", full: "0px" },
    shadows: { sm: "none", md: "none", lg: "none" },
  },
);

// Крохотное инлайновое placeholder-изображение — не сгенерированная и не
// реальная фотография, лишь настоящий файл, достаточный, чтобы доказать
// реальную отрисовку responsive-source пути `resolveAsset` (ветка `<img>`
// в CinematicHero/ProductReveal), наравне с ещё не резолвящимся fallback-путём.
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='3'%3E%3Crect width='4' height='3' fill='%232F6FED'/%3E%3C/svg%3E";

const abstractAssets: AssetManifest = [
  {
    asset_id: "abstract-hero",
    purpose: "Solid-color placeholder standing in for a real photograph.",
    type: "image",
    source: "placeholder",
    aspect_ratio: "16:9",
    section: "cinematic-hero",
    status: "generated",
    focalPoint: { x: 0.5, y: 0.4 },
    files: [
      { url: PLACEHOLDER_IMAGE, width: 640 },
      { url: PLACEHOLDER_IMAGE, width: 1280 },
    ],
  },
  {
    asset_id: "abstract-product",
    purpose:
      "Second placeholder asset, deliberately left unresolved — proves the gradient fallback still works alongside a resolved asset.",
    type: "image",
    source: "placeholder",
    aspect_ratio: "4:5",
    section: "product-reveal",
    status: "planned",
  },
];

const abstractBusiness: BusinessProfile = {
  vertical: "local-services",
  name: "[ABSTRACT_TEST_BUSINESS]",
  contact: {},
};

const abstractTemplate: Template = {
  vertical: "local-services",
  name: "abstract-test",
  experienceMap: [
    { section: "cinematic-hero", enabled: true },
    { section: "editorial-statement", enabled: true },
    { section: "product-reveal", enabled: true },
    { section: "final-cta", enabled: true },
  ],
};

const abstractContent = defineContent({
  "cinematic-hero": {
    headline: "[ABSTRACT_HEADLINE]",
    media: { assetId: "abstract-hero" },
  },
  "editorial-statement": {
    statement: "[ABSTRACT_STATEMENT]",
  },
  "product-reveal": {
    title: "[ABSTRACT_PRODUCT_TITLE]",
    media: { assetId: "abstract-product" },
  },
  "final-cta": {
    headline: "[ABSTRACT_CLOSING_HEADLINE]",
    cta: { label: "[ABSTRACT_CTA_LABEL]", href: "#" },
  },
});

export const abstractTestSiteConfig: SiteConfig = assertValidSiteConfig({
  business: abstractBusiness,
  visualDNA: abstractVisualDNA,
  experience: abstractTemplate,
  content: abstractContent,
  assets: abstractAssets,
  theme: abstractTheme,
  motion: { preset: "fade-in", duration: 0.4 },
});

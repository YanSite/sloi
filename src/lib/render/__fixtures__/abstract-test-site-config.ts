import type { AssetManifest, BusinessProfile, SiteConfig, Template, VisualDNA } from "@/lib/types";
import { resolveTheme } from "@/lib/theme";
import { assertValidSiteConfig } from "@/lib/validation";
import { defineContent } from "../section-content";

/**
 * Stage 5's "critical test," fixture #2: a deliberately plain,
 * non-botanical config — flat blue/gray palette, sans-only type, sharp
 * corners, no shadows — sharing NOTHING with the florist vertical except
 * the section components and the renderer. It proves the same
 * `CinematicHero` / `ProductReveal` / `FinalCTA` render correctly under a
 * wholly different VisualDNA/theme/content/assets with no component code
 * changed. If this fixture needed a section edit to work, that would be
 * an architecture bug to fix, not a fixture to special-case — see the
 * Stage 5 instruction this file exists to satisfy.
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
    // Deliberately overrides the shared default scale — sharp corners, no
    // elevation — to prove radius/shadow tokens actually flow from theme,
    // not from a hardcoded class in the section component.
    radius: { none: "0px", sm: "0px", md: "0px", lg: "0px", full: "0px" },
    shadows: { sm: "none", md: "none", lg: "none" },
  }
);

// A tiny inline placeholder image — not a generated or real photograph,
// just enough of a real file to prove `resolveAsset`'s responsive-source
// path (the `<img>` branch in CinematicHero/ProductReveal) actually
// renders, alongside the still-unresolved fallback path.
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
    purpose: "Second placeholder asset, deliberately left unresolved — proves the gradient fallback still works alongside a resolved asset.",
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

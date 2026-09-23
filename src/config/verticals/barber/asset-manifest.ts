import type { AssetManifest } from "@/lib/types";

// Крохотные инлайновые placeholder-изображения (не сгенерированы, не
// реальная фотография — просто залитые фирменным цветом barber
// прямоугольники) вместо двух ассетов, помеченных ниже "generated", чтобы
// реальный путь `resolveAsset` -> `<img>` (см.
// src/lib/assets/resolve-asset.ts) рендерился по-настоящему, наравне с
// ещё "planned" ассетами, уходящими на градиентный placeholder — та же
// схема, что уже проверена в abstract-test фикстуре (Stage 5).
const HERO_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='3'%3E%3Crect width='4' height='3' fill='%23B3341F'/%3E%3C/svg%3E";
const CHAIR_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5'%3E%3Crect width='4' height='5' fill='%234A4A4F'/%3E%3C/svg%3E";

/**
 * Плановый production-план для тестовой вертикали barber — та же форма,
 * что у asset-manifest.ts вертикали florist, но сознательно другой
 * контент/промпты. Ни один вызов Higgsfield по этим записям не
 * выполнялся; записи с source "higgsfield" — это только черновики
 * промптов (по правилу /docs/generation-policy.md «никогда не
 * генерировать во время планирования»), а две записи с source
 * "placeholder" — инлайновые подставные файлы, а не сгенерированный
 * результат.
 */
export const barberAssetManifest: AssetManifest = [
  {
    asset_id: "barber-hero-atmosphere",
    purpose: "Full-bleed opening shot — high-contrast B&W barbershop interior",
    type: "image",
    source: "placeholder",
    aspect_ratio: "16:9",
    section: ["cinematic-hero", "final-cta"],
    status: "generated",
    focalPoint: { x: 0.5, y: 0.35 },
    files: [
      { url: HERO_PLACEHOLDER, width: 640 },
      { url: HERO_PLACEHOLDER, width: 1280 },
    ],
  },
  {
    asset_id: "barber-chair-detail",
    purpose: "The flagship chair/station — signature product-reveal moment",
    type: "image",
    source: "placeholder",
    aspect_ratio: "4:5",
    section: "product-reveal",
    status: "generated",
    focalPoint: { x: 0.5, y: 0.4 },
    files: [
      { url: CHAIR_PLACEHOLDER, width: 480 },
      { url: CHAIR_PLACEHOLDER, width: 960 },
    ],
  },
  {
    asset_id: "barber-texture",
    purpose: "Abstract macro accent — steel/leather/blade texture",
    type: "image",
    source: "higgsfield",
    prompt:
      "Extreme macro photograph of brushed steel scissors and a leather strop, high contrast black and white, hard directional light from camera-left, deep shadow falloff. No hands, no faces. Sharp, graphic, editorial realism.",
    aspect_ratio: "1:1",
    section: ["editorial-statement", "service-section"],
    status: "planned",
  },
  {
    asset_id: "barber-shop-wide",
    purpose: "Wide editorial shot of the shop floor",
    type: "image",
    source: "higgsfield",
    prompt:
      "Editorial wide photograph of a barbershop interior, rows of leather chairs and mirrors, single hard key light from a street-facing window, background falling into deep shadow. High contrast black and white, visible grain, no people in frame.",
    aspect_ratio: "4:5",
    section: "editorial-grid",
    status: "planned",
  },
  {
    asset_id: "barber-workshop-photo",
    purpose: "Real evidence of the barber and the craft",
    type: "image",
    source: "client-provided",
    aspect_ratio: "4:5",
    section: "story-section",
    status: "planned",
  },
  {
    asset_id: "barber-storefront-photo",
    purpose: "Real evidence of a physical, visitable place",
    type: "image",
    source: "client-provided",
    aspect_ratio: "4:5",
    section: "location-section",
    status: "planned",
  },
  {
    asset_id: "barber-customer-photos",
    purpose: "Optional warmth alongside testimonial quotes",
    type: "image",
    source: "client-provided",
    aspect_ratio: "4:5",
    section: "social-proof",
    status: "planned",
  },
];

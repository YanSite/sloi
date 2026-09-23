import type { AssetManifest } from "@/lib/types";

/**
 * Утверждённый план продакшна из /docs/asset-manifest.md. Каждая запись
 * — "planned": согласно /docs/generation-policy.md, планирование ассета
 * само по себе никогда не запускает генерацию; продвинуть запись из
 * "planned"/"approved" к "generating" может только явное согласование
 * человеком. Ни один вызов Higgsfield по этим записям не выполнялся.
 */
export const floristAssetManifest: AssetManifest = [
  {
    asset_id: "hero-atmosphere",
    purpose: "Full-bleed cinematic establishing shot — WOW Moment #1",
    type: "image",
    source: "higgsfield",
    prompt:
      "Macro photograph of a single deep-burgundy peony emerging from near-total darkness. One raking source of warm window light at 45° from camera-left; background falls to near-black bitumen brown (#15110D). Shallow depth of field, one sharp focal plane on the nearest petal edge, soft falloff within centimeters. Visible fine film grain, dust motes suspended in the light beam, a muted olive stem faintly visible at lower frame. No props, no text. Medium-format film aesthetic, Dutch still-life lighting reference, photographic realism — not painterly, not a render.",
    aspect_ratio: "16:9",
    section: ["cinematic-hero", "final-cta"],
    status: "planned",
  },
  {
    asset_id: "flagship-bouquet",
    purpose: "The flagship arrangement — WOW Moment #2",
    type: "image",
    source: "higgsfield",
    prompt:
      "Editorial photograph of one composed arrangement in a dark oxidized-brass vessel: deep burgundy garden roses, ink-violet anemones, muted sage eucalyptus. Positioned in the lower-right third of frame on dark oiled wood. Single soft raking key light from upper-left, background falling to near-black void. Shallow depth of field, only the front-most bloom in critical focus, one deliberately imperfect browning outer petal. Warm-white highlight falloff, visible photographic grain, 85mm-equivalent lens wide open, Flemish still-life composition, photographic realism.",
    aspect_ratio: "4:5",
    section: ["product-reveal", "collection-showcase", "editorial-grid"],
    status: "planned",
  },
  {
    asset_id: "detail-texture",
    purpose: "Abstract macro accent — non-narrative filler",
    type: "image",
    source: "higgsfield",
    prompt:
      "Extreme macro photograph of overlapping petals and one stem, abstract, no full bloom recognizable. Dark background falling to near-black, single raking light creating a graduated highlight across the petal surface. Very shallow focus, most of frame softly dissolved, warm sepia-shadow grade, visible grain. No props, no hands. Texture-forward, photographic realism.",
    aspect_ratio: "1:1",
    section: ["editorial-statement", "service-section", "editorial-grid"],
    status: "planned",
  },
  {
    asset_id: "atmospheric-editorial",
    purpose:
      "Wider editorial/environment frame — variety for Editorial Grid and Collection Showcase",
    type: "image",
    source: "higgsfield",
    prompt:
      "Editorial wide photograph of a flower arrangement on a dark oiled-wood surface with a suggestion of a stone windowsill at frame edge, single raking window light from camera-left, background falling into near-total darkness beyond the sill. Wider framing than a product shot — more scene, less object — arrangement still in the lower third of frame. Shallow depth of field on the nearest blooms, soft falloff into the implied room beyond. Visible grain, warm-shadow color character, photographic realism, no people, no visible shop fixtures.",
    aspect_ratio: "4:5",
    section: ["editorial-grid", "collection-showcase"],
    status: "planned",
  },
  {
    asset_id: "closing-visual",
    purpose:
      "Optional dedicated Final CTA closing image — NICE_TO_HAVE reserve, not authorized (would exceed the demo cap alongside the four assets above)",
    type: "image",
    source: "higgsfield",
    aspect_ratio: "16:9",
    section: "final-cta",
    status: "planned",
  },
  {
    asset_id: "workshop-photo",
    purpose: "Real evidence of the maker and the craft",
    type: "image",
    source: "client-provided",
    aspect_ratio: "4:5",
    section: "story-section",
    status: "planned",
  },
  {
    asset_id: "storefront-photo",
    purpose: "Real evidence of a physical, visitable place",
    type: "image",
    source: "client-provided",
    aspect_ratio: "4:5",
    section: "location-section",
    status: "planned",
  },
  {
    asset_id: "customer-photos",
    purpose: "Optional warmth alongside testimonial quotes",
    type: "image",
    source: "client-provided",
    aspect_ratio: "4:5",
    section: "social-proof",
    status: "planned",
  },
  {
    asset_id: "press-logos",
    purpose: "Existing press/partner brand marks, if any exist",
    type: "image",
    source: "client-provided",
    aspect_ratio: "1:1",
    section: "social-proof",
    status: "planned",
  },
];

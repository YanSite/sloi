import type { AssetManifest } from "@/lib/types";

/**
 * Ассеты Куки Луки. Все сгенерированы в Higgsfield (nano_banana_2 для
 * фото, видео — Higgsfield video) и сжаты для веба. Файлы лежат в
 * public/sites/kuki-luki/. Компоненты получают их только через resolveAsset.
 *
 * ВАЖНО: генерация шла по текстовым описаниям, не по фото реальных
 * печений. Перед продом — пересъёмка по фото продукта (HANDOFF.md §9).
 *
 * Видео пока на CDN Higgsfield — скачать в public/ до релиза.
 */
const P = "/sites/kuki-luki";
const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3J2myYE1iqQZp5nkMbRxMy0DiHQ";

export const kukiLukiAssetManifest: AssetManifest = [
  {
    asset_id: "signature-cookie",
    purpose: "S01/S06 — главное печенье на розовой студии (без вырезки, края растушёвываются маской)",
    type: "image",
    source: "higgsfield",
    prompt:
      "Editorial luxury food campaign photograph. One oversized thick chocolate chunk cookie, cracked baked golden-brown surface with visible pores and sugar crystals, glossy dark chocolate chunks half-melted, a few loose crumbs. Three-quarter view 28 degrees above, 100mm macro lens, f/8, hard directional key light from top right, deep soft shadow left, faint pink bounce. Seamless hot pink #FF3E9A studio backdrop. Photorealistic, not CGI. No props, no text, no logos.",
    aspect_ratio: "1:1",
    section: "immersive-stage",
    status: "generated",
    files: [{ url: `${P}/signature-cookie.jpg`, width: 2048, height: 2048 }],
  },
  {
    asset_id: "crack-macro",
    purpose: "S02 — макро трещины, poster/fallback для видео",
    type: "image",
    source: "higgsfield",
    prompt:
      "Extreme macro photograph of a baked cookie surface with one deep jagged crack running diagonally, golden brown crust, sugar crystals, molten dark chocolate deep inside the crack, raking side light at 10 degrees, very shallow depth of field, subtle pink rim reflection. Photorealistic, not CGI. No text.",
    aspect_ratio: "16:9",
    section: "immersive-stage",
    status: "generated",
    files: [{ url: `${P}/crack-macro.jpg`, width: 2200, height: 1228 }],
  },
  {
    asset_id: "crack-macro-video",
    purpose: "S02 — живое макро трещины, петля, muted/playsInline",
    type: "video",
    source: "higgsfield",
    prompt: "Image-to-video из crack-macro. Higgsfield job 16548bc1-9c80-4cfc-ab1c-2360de6f4341.",
    aspect_ratio: "16:9",
    section: "immersive-stage",
    status: "generated",
    files: [{ url: `${CDN}/hf_20260926_113702_16548bc1-9c80-4cfc-ab1c-2360de6f4341.mp4`, width: 1920 }],
  },
  {
    asset_id: "interior-macro",
    purpose: "S02 «Внутри» — разлом: мякиш, тянущийся шоколад, розовый контровой; poster/fallback",
    type: "image",
    source: "higgsfield",
    prompt:
      "Extreme macro inside a freshly broken warm chocolate chunk cookie: soft open golden crumb, thick strands of molten dark chocolate stretching across the gap, hot pink #FF3E9A rim light from behind, deep crimson shadows, very shallow depth of field. Cinematic luxury food commercial, photorealistic. No text.",
    aspect_ratio: "16:9",
    section: "immersive-stage",
    status: "generated",
    files: [{ url: `${P}/interior-macro.jpg`, width: 2200, height: 1228 }],
  },
  {
    asset_id: "interior-macro-video",
    purpose: "S02 «Внутри» — живое макро разлома, петля",
    type: "video",
    source: "higgsfield",
    prompt: "Image-to-video из interior-macro. Higgsfield job 917a607a-0cee-4145-8307-ac482ff938cd.",
    aspect_ratio: "16:9",
    section: "immersive-stage",
    status: "generated",
    files: [{ url: `${CDN}/hf_20260926_113704_917a607a-0cee-4145-8307-ac482ff938cd.mp4`, width: 1920 }],
  },
  ...(
    [
      ["oreo", "Орео", "Oreo-style chocolate sandwich cookie pieces, cream cheese and white chocolate frosting, one whole sandwich cookie on top"],
      ["frambini", "Фрамбини", "milk chocolate chunks, raspberry cream cheese frosting with freeze-dried raspberry, small shortbread biscuit with a chocolate drop"],
      ["kinder", "Киндер", "golden shortbread with pieces of milk chocolate bar with white milky filling, milk chocolate drizzle"],
    ] as const
  ).flatMap(([id, name, desc]) => [
    {
      asset_id: `${id}-portrait`,
      purpose: `S04 «Целиком» — ${name}, вырезка на прозрачном фоне`,
      type: "image" as const,
      source: "higgsfield" as const,
      prompt: `Editorial luxury food campaign photograph of one oversized thick cookie: ${desc}. Three-quarter view 28° above, 100mm, f/8, hard key top right. Background removed (Higgsfield remove_background).`,
      aspect_ratio: "1:1",
      section: "immersive-stage" as const,
      status: "generated" as const,
      files: [{ url: `${P}/${id}-portrait.webp`, width: 1500, height: 1500 }],
    },
    {
      asset_id: `${id}-texture`,
      purpose: `S04 «Текстура» — ${name}, экстремальное макро теста`,
      type: "image" as const,
      source: "higgsfield" as const,
      prompt: `Extreme macro of the surface of the cookie: ${desc}. Raking light from the left, shallow depth of field, calm negative space on the right. Photorealistic, no text, no logos.`,
      aspect_ratio: "16:9",
      section: "immersive-stage" as const,
      status: "generated" as const,
      focalPoint: { x: 0.4, y: 0.5 },
      files: [{ url: `${P}/${id}-texture.jpg`, width: 2200, height: 1228 }],
    },
    {
      asset_id: `${id}-filling`,
      purpose: `S04 «Начинка» — ${name}, макро крема/топпинга; точки подписей в choreography.ts`,
      type: "image" as const,
      source: "higgsfield" as const,
      prompt: `Extreme macro of the topping: ${desc}. Soft specular highlights, subtle moisture, shallow depth of field. Photorealistic, no text, no visible logos.`,
      aspect_ratio: "16:9",
      section: "immersive-stage" as const,
      status: "generated" as const,
      files: [{ url: `${P}/${id}-filling.jpg`, width: 2200, height: 1228 }],
    },
    {
      asset_id: `${id}-packshot`,
      purpose: `S05 «Меню» — ${name}, вид сверху на кремовом фоне`,
      type: "image" as const,
      source: "higgsfield" as const,
      prompt: `Top-down packshot of one oversized cookie: ${desc}. Neutral warm cream #F3EAE2 background, soft even light. Photorealistic, no text.`,
      aspect_ratio: "1:1",
      section: "immersive-stage" as const,
      status: "generated" as const,
      files: [{ url: `${P}/${id}-packshot.jpg`, width: 900, height: 900 }],
    },
  ]),
];

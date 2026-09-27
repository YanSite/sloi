import type { AssetFile, AssetManifest, AssetManifestEntry } from "@/lib/types";
import signatureCookie from "./assets/media/signature-cookie.webp";
import crackMacro from "./assets/media/crack-macro.jpg";
import interiorMacro from "./assets/media/interior-macro.jpg";
import oreoPortrait from "./assets/media/oreo-portrait.webp";
import oreoTexture from "./assets/media/oreo-texture.jpg";
import oreoFilling from "./assets/media/oreo-filling.jpg";
import oreoPackshot from "./assets/media/oreo-packshot.jpg";
import frambiniPortrait from "./assets/media/frambini-portrait.webp";
import frambiniTexture from "./assets/media/frambini-texture.jpg";
import frambiniFilling from "./assets/media/frambini-filling.jpg";
import frambiniPackshot from "./assets/media/frambini-packshot.jpg";
import kinderPortrait from "./assets/media/kinder-portrait.webp";
import kinderTexture from "./assets/media/kinder-texture.jpg";
import kinderFilling from "./assets/media/kinder-filling.jpg";
import kinderPackshot from "./assets/media/kinder-packshot.jpg";

/**
 * Asset manifest Куки Луки. Изображения — копия
 * `design-reference/kuki/public/sites/kuki-luki/` байт-в-байт в
 * `assets/media/`, подключены статическим импортом (хешированный URL и
 * размеры от сборщика). Видео скачаны с CDN Higgsfield в
 * `public/sites/kuki-luki/` (H.264, 1284×716, 5 с, петля). Компоненты
 * получают файлы только через `resolveAsset`.
 *
 * ВАЖНО: генерация шла по текстовым описаниям, а не по фото реальных
 * печений, — перед релизом нужна пересъёмка по фото продукта.
 */

type StaticImage = { src: string; width: number; height: number };
const file = (img: StaticImage): AssetFile[] => [
  { url: img.src, width: img.width, height: img.height },
];
const VIDEO_DIR = "/sites/kuki-luki";

const FLAVORS = [
  {
    id: "oreo",
    name: "Орео",
    desc: "Oreo-style chocolate sandwich cookie pieces, cream cheese and white chocolate frosting, one whole sandwich cookie on top",
    files: {
      portrait: oreoPortrait,
      texture: oreoTexture,
      filling: oreoFilling,
      packshot: oreoPackshot,
    },
  },
  {
    id: "frambini",
    name: "Фрамбини",
    desc: "milk chocolate chunks, raspberry cream cheese frosting with freeze-dried raspberry, small shortbread biscuit with a chocolate drop",
    files: {
      portrait: frambiniPortrait,
      texture: frambiniTexture,
      filling: frambiniFilling,
      packshot: frambiniPackshot,
    },
  },
  {
    id: "kinder",
    name: "Киндер",
    desc: "golden shortbread with pieces of milk chocolate bar with white milky filling, milk chocolate drizzle",
    files: {
      portrait: kinderPortrait,
      texture: kinderTexture,
      filling: kinderFilling,
      packshot: kinderPackshot,
    },
  },
];

const flavorAssets = FLAVORS.flatMap(({ id, name, desc, files }): AssetManifestEntry[] => [
  {
    asset_id: `${id}-portrait`,
    purpose: `S04 «Целиком» — ${name}, вырезка на прозрачном фоне`,
    type: "image",
    source: "higgsfield",
    prompt: `Editorial luxury food campaign photograph of one oversized thick cookie: ${desc}. Three-quarter view 28° above, 100mm, f/8, hard key top right. Background removed (Higgsfield remove_background).`,
    aspect_ratio: "1:1",
    section: "immersive-stage",
    status: "generated",
    files: file(files.portrait),
  },
  {
    asset_id: `${id}-texture`,
    purpose: `S04 «Текстура» — ${name}, экстремальное макро теста`,
    type: "image",
    source: "higgsfield",
    prompt: `Extreme macro of the surface of the cookie: ${desc}. Raking light from the left, shallow depth of field, calm negative space on the right. Photorealistic, no text, no logos.`,
    aspect_ratio: "16:9",
    section: "immersive-stage",
    status: "generated",
    files: file(files.texture),
  },
  {
    asset_id: `${id}-filling`,
    purpose: `S04 «Начинка» — ${name}, макро крема и топпинга; точки подписей — в content.ts`,
    type: "image",
    source: "higgsfield",
    prompt: `Extreme macro of the topping: ${desc}. Soft specular highlights, subtle moisture, shallow depth of field. Photorealistic, no text, no visible logos.`,
    aspect_ratio: "16:9",
    section: "immersive-stage",
    status: "generated",
    files: file(files.filling),
  },
  {
    asset_id: `${id}-packshot`,
    purpose: `S05 «Меню» — ${name}, вид сверху на кремовом фоне`,
    type: "image",
    source: "higgsfield",
    prompt: `Top-down packshot of one oversized cookie: ${desc}. Neutral warm cream #F3EAE2 background, soft even light. Photorealistic, no text.`,
    aspect_ratio: "1:1",
    section: "immersive-stage",
    status: "generated",
    files: file(files.packshot),
  },
]);

export const kukiLukiAssetManifest: AssetManifest = [
  {
    asset_id: "signature-cookie",
    purpose:
      "S01 / S06 — главное печенье на розовой студии. Производная от сгенерированного JPG: растушёвка краёв и тень прототипа запечены в альфа-канал WebP (CSS-маска на крупном масштабе давала артефакты растеризации)",
    type: "image",
    source: "higgsfield",
    prompt:
      "Editorial luxury food campaign photograph. One oversized thick chocolate chunk cookie, cracked baked golden-brown surface with visible pores and sugar crystals, glossy dark chocolate chunks half-melted, a few loose crumbs. Three-quarter view 28 degrees above, 100mm macro lens, f/8, hard directional key light from top right, deep soft shadow left, faint pink bounce. Seamless hot pink #FF3E9A studio backdrop. Photorealistic, not CGI. No props, no text, no logos.",
    aspect_ratio: "1:1",
    section: "immersive-stage",
    status: "generated",
    files: file(signatureCookie),
  },
  {
    asset_id: "crack-macro",
    purpose: "S02 — макро трещины; poster и fallback видео",
    type: "image",
    source: "higgsfield",
    prompt:
      "Extreme macro photograph of a baked cookie surface with one deep jagged crack running diagonally, golden brown crust, sugar crystals, molten dark chocolate deep inside the crack, raking side light at 10 degrees, very shallow depth of field, subtle pink rim reflection. Photorealistic, not CGI. No text.",
    aspect_ratio: "16:9",
    section: "immersive-stage",
    status: "generated",
    files: file(crackMacro),
  },
  {
    asset_id: "crack-macro-video",
    purpose: "S02 — живое макро трещины, петля, muted / playsInline",
    type: "video",
    source: "higgsfield",
    prompt: "Image-to-video из crack-macro. Higgsfield job 16548bc1-9c80-4cfc-ab1c-2360de6f4341.",
    aspect_ratio: "16:9",
    section: "immersive-stage",
    status: "generated",
    files: [{ url: `${VIDEO_DIR}/crack-macro.mp4`, width: 1284, height: 716 }],
  },
  {
    asset_id: "interior-macro",
    purpose:
      "S02 «Внутри» — разлом: мякиш, тянущийся шоколад, розовый контровой; poster и fallback",
    type: "image",
    source: "higgsfield",
    prompt:
      "Extreme macro inside a freshly broken warm chocolate chunk cookie: soft open golden crumb, thick strands of molten dark chocolate stretching across the gap, hot pink #FF3E9A rim light from behind, deep crimson shadows, very shallow depth of field. Cinematic luxury food commercial, photorealistic. No text.",
    aspect_ratio: "16:9",
    section: "immersive-stage",
    status: "generated",
    files: file(interiorMacro),
  },
  {
    asset_id: "interior-macro-video",
    purpose: "S02 «Внутри» — живое макро разлома, петля",
    type: "video",
    source: "higgsfield",
    prompt:
      "Image-to-video из interior-macro. Higgsfield job 917a607a-0cee-4145-8307-ac482ff938cd.",
    aspect_ratio: "16:9",
    section: "immersive-stage",
    status: "generated",
    files: [{ url: `${VIDEO_DIR}/interior-macro.mp4`, width: 1284, height: 716 }],
  },
  ...flavorAssets,
];

import type { AssetFile, AssetManifest, AssetManifestEntry } from "@/lib/types";
import streetHero from "./assets/media/street-hero.jpg";
import streetPoster from "./assets/media/street-poster.jpg";
import phoneV from "./assets/media/phone-v.jpg";
import phoneH from "./assets/media/phone-h.jpg";
import flMacro from "./assets/media/fl-macro.jpg";
import flBouquet from "./assets/media/fl-bouquet.jpg";
import worldFlower from "./assets/media/world-flower.jpg";
import flG1 from "./assets/media/fl-g1.jpg";
import flG2 from "./assets/media/fl-g2.jpg";
import flG3 from "./assets/media/fl-g3.jpg";
import flG4 from "./assets/media/fl-g4.jpg";
import flG5 from "./assets/media/fl-g5.jpg";
import flG6 from "./assets/media/fl-g6.jpg";
import flG7 from "./assets/media/fl-g7.jpg";
import flG8 from "./assets/media/fl-g8.jpg";
import flG9 from "./assets/media/fl-g9.jpg";
import ckMacro from "./assets/media/ck-macro.jpg";
import ckCookie from "./assets/media/ck-cookie.webp";
import ckDessert from "./assets/media/ck-dessert.jpg";
import ckG1 from "./assets/media/ck-g1.jpg";
import ckG2 from "./assets/media/ck-g2.jpg";
import ckG3 from "./assets/media/ck-g3.jpg";
import ckG4 from "./assets/media/ck-g4.jpg";
import ckG5 from "./assets/media/ck-g5.jpg";
import ckG6 from "./assets/media/ck-g6.jpg";
import ckG7 from "./assets/media/ck-g7.jpg";
import ckG8 from "./assets/media/ck-g8.jpg";
import ckG9 from "./assets/media/ck-g9.jpg";
import ckG10 from "./assets/media/ck-g10.jpg";
import ckG11 from "./assets/media/ck-g11.jpg";
import ckG12 from "./assets/media/ck-g12.jpg";

/**
 * Asset manifest «Есть что показать». Все файлы — копия
 * `design-reference/est-chto-pokazat-site/reference/prototype/media/`
 * байт-в-байт в `assets/media/`, подключены статическим импортом
 * (хешированный URL и размеры от сборщика). Компоненты получают файлы
 * только через `resolveAsset`. Новых генераций не было.
 *
 * Отличия от пакета (см. DECISIONS.md):
 * - `ck-oreo.jpg` переименован в `ck-dessert.jpg` — в имени файла был
 *   чужой товарный знак; само изображение не менялось.
 * - `world-cookie.jpg` не перенесён — в прототипе не используется
 *   (фон пекарни — градиент), пакет разрешает удалить.
 *
 * Происхождение (docs/05_ASSETS.md): улица, рука с телефоном и
 * заведение сгенерированы для сайта в Higgsfield — исходные промпты в
 * пакет не переданы, поле `prompt` помечено заглушкой. Материалы
 * кейсов — из концептов агентства, обезличены (логотипы, адреса,
 * рейтинги убраны); источник — владелец сайта (`client-provided`).
 */

type StaticImage = { src: string; width: number; height: number };
const file = (img: StaticImage): AssetFile[] => [
  { url: img.src, width: img.width, height: img.height },
];

const PROMPT_NOT_IN_HANDOFF =
  "[нет в пакете: исходный промпт генерации Higgsfield не передан в handoff — запросить у владельца]";

const generated = (
  asset_id: string,
  purpose: string,
  img: StaticImage,
  aspect_ratio: string,
): AssetManifestEntry => ({
  asset_id,
  purpose,
  type: "image",
  source: "higgsfield",
  prompt: PROMPT_NOT_IN_HANDOFF,
  aspect_ratio,
  section: "immersive-stage",
  status: "generated",
  files: file(img),
});

const concept = (
  asset_id: string,
  purpose: string,
  img: StaticImage,
  aspect_ratio: string,
): AssetManifestEntry => ({
  asset_id,
  purpose,
  type: "image",
  source: "client-provided",
  aspect_ratio,
  section: "immersive-stage",
  status: "generated",
  files: file(img),
});

const FLOWER_SLIDES = [flG1, flG2, flG3, flG4, flG5, flG6, flG7, flG8, flG9];
const BAKERY_SLIDES = [ckG1, ckG2, ckG3, ckG4, ckG5, ckG6, ckG7, ckG8, ckG9, ckG10, ckG11, ckG12];

export const ecpAssetManifest: AssetManifest = [
  generated(
    "street-hero",
    "Вечерняя улица с живыми окнами: фон 01, раскрытие поворота в режиме чертежа, размытый фон 06, резкий фон 07; вырезки — сайт заведения в телефоне на 04. Окна для огней и чертежа — координаты WROI в сцене",
    streetHero,
    "16:9",
  ),
  generated(
    "street-poster",
    "Фото «вашего места» в карточке: 01 в ч/б в ленте телефона, 02 в поле карточек, 03 цветное",
    streetPoster,
    "16:9",
  ),
  generated(
    "phone-portrait",
    "Рука с телефоном, мобильный. Экран телефона в пикселях фото: x 253–509, y 414–951",
    phoneV,
    "9:16",
  ),
  generated(
    "phone-landscape",
    "Рука с телефоном, десктоп. Экран телефона в пикселях фото: x 781–1018, y 116–610",
    phoneH,
    "16:9",
  ),

  concept("flowers-macro", "Проект 01, вступление: макро розы с каплей", flMacro, "16:9"),
  concept("flowers-bouquet", "Проект 01: фото букета на экране сайта в телефоне", flBouquet, "4:5"),
  concept("flowers-world", "Проект 01: размытый фон экрана", worldFlower, "1:1"),
  ...FLOWER_SLIDES.map((img, i) =>
    concept(
      `flowers-slide-${i + 1}`,
      `Проект 01: слайд ${i + 1} из 9 лендинга-концепта на стенах коридора`,
      img,
      "16:9",
    ),
  ),

  concept("bakery-macro", "Проект 02, вступление: разлом печенья с шоколадом", ckMacro, "16:9"),
  concept(
    "bakery-cookie",
    "Проект 02: печенье с розовым ореолом на прозрачном фоне — кадры «Тёплое печенье» в телефоне",
    ckCookie,
    "1:1",
  ),
  concept(
    "bakery-dessert",
    "Проект 02: десерт «Шоколад и крем» на чёрном — второй кадр в телефоне",
    ckDessert,
    "1:1",
  ),
  ...BAKERY_SLIDES.map((img, i) =>
    concept(
      `bakery-slide-${i + 1}`,
      `Проект 02: кадр ${i + 1} из 12 сайта-концепта на стенах коридора`,
      img,
      "16:9",
    ),
  ),
];

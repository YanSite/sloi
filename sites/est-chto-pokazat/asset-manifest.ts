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
 * только через `resolveAsset`; манифест в клиент не уходит (серверная
 * обёртка `EcpStage`). Новых генераций не было.
 *
 * Происхождение — docs/10_ASSET_PROVENANCE.md пакета: всё сгенерировано
 * агентством в Higgsfield, это не фото компаний. В `prompt` — промпт
 * генерации дословно, модель и ID в аккаунте Higgsfield (по нему —
 * оригинал в полном разрешении). Слайды коридоров — скомпонованные
 * экраны сайтов-концептов (логотипы и адреса стёрты): у них вместо
 * промпта — состав генераций, из которых собран слайд.
 *
 * `world-cookie.jpg` не перенесён — в прототипе не используется, пакет
 * разрешает удалить.
 */

type StaticImage = { src: string; width: number; height: number };
const file = (img: StaticImage): AssetFile[] => [
  { url: img.src, width: img.width, height: img.height },
];

const image = (
  asset_id: string,
  purpose: string,
  img: StaticImage,
  aspect_ratio: string,
  prompt: string,
): AssetManifestEntry => ({
  asset_id,
  purpose,
  type: "image",
  source: "higgsfield",
  prompt,
  aspect_ratio,
  section: "immersive-stage",
  status: "generated",
  files: file(img),
});

const FLOWER_SLIDES = [flG1, flG2, flG3, flG4, flG5, flG6, flG7, flG8, flG9];
const FLOWER_SLIDES_SOURCE =
  "[композиция, не одна генерация] Скомпонованный экран лендинга-концепта, логотип стёрт. Фото — генерации 2026-09-24: ниша и постамент 75c53c19, букет на вырез 170e504b, ателье f245bffd, флэтлей c539a834, розы в стеклянном цилиндре eb3b25f9, лепестки на переднем плане ae6e1378, макро розы 9b023598, букет 96449e47, стол с композицией 72759aa4.";
const BAKERY_SLIDES = [ckG1, ckG2, ckG3, ckG4, ckG5, ckG6, ckG7, ckG8, ckG9, ckG10, ckG11, ckG12];
const BAKERY_SLIDES_SOURCE =
  "[композиция, не одна генерация] Скомпонованный кадр сайта-концепта, логотип и адрес убраны. Фото — генерации 2026-09-26/28: классика 8bd10b53, разлом acef68fa, шоколад и крем 02dfc29a, малина и шоколад 807ac7f8, молочный шоколад 46bf2d92, макро 11972af8, 28bbc90e, c87d3590, 463ff00e, e8a01f04, 04edcb98, 8d34f8e4; фоны вырезаны image_background_remover. Печенье-сэндвич и капля шоколада обезличены отдельными правками.";

export const ecpAssetManifest: AssetManifest = [
  image(
    "street-hero",
    "Вечерняя улица с живыми окнами: фон 01, раскрытие поворота в режиме чертежа, размытый фон 06, резкий фон 07; вырезки — сайт заведения в телефоне на 04. Окна для огней и чертежа — координаты WROI в сцене",
    streetHero,
    "16:9",
    "Higgsfield gpt_image_2_5, ID 46588a1a-5462-4922-8381-90b581a5c8b4, 16:9, quality low, 2026-10-03. Photorealistic wide documentary photograph of a quiet city street at blue-hour dusk, a row of small independent shopfronts side by side: a flower shop, a coffee bar, a barbershop, a small restaurant. Each large shop window glows with warm interior light and shows people and life inside in soft focus. Cool blue sky and damp pavement reflecting warm window light, a few passers-by as dark silhouettes from behind. Natural colors, authentic European-style street, cinematic but real, not stock. Shop signs blank or unreadable, no visible text, letters or logos anywhere.",
  ),
  image(
    "street-poster",
    "Фото «вашего места» в карточке: 01 в ч/б в ленте телефона, 02 в поле карточек, 03 цветное. Кадр из видео по стартовому кадру street-hero",
    streetPoster,
    "16:9",
    "Кадр из видео Higgsfield kling3_0 std, ID e73d6026-0797-4a13-b876-60219a1316c1, 5 с, 1280×720, стартовый кадр street-hero (46588a1a). Slow, smooth lateral camera glide along the row of glowing shopfronts at blue-hour dusk. Inside the warm windows people move naturally: a florist arranges flowers, a barista serves coffee, a barber works, diners chat. Passers-by walk past as dark silhouettes, reflections ripple on the damp pavement, warm light flickers gently. Calm, alive, documentary realism, natural motion. No readable text, signs or logos, no faces toward the camera.",
  ),
  image(
    "phone-portrait",
    "Рука с телефоном, мобильный; экран пустой, контент вставляется кодом. Экран телефона в пикселях фото: x 253–509, y 414–951",
    phoneV,
    "9:16",
    "Higgsfield gpt_image_2_5, ID cc6e3d01-3f01-4781-a4ec-1dff616025af, 9:16, 752×1344, quality low. Photorealistic documentary photograph at blue-hour dusk on a city street: a person's hand holding a modern smartphone upright, the phone facing the viewer straight-on and filling the lower middle of the frame, the phone screen completely black and blank. Behind, out of focus, a row of warm glowing shopfront windows and wet pavement reflections, cool blue evening light mixed with warm window light on the hand. Natural skin, realistic fingers, shallow depth of field. No face visible, no text, logos or brand marks on the phone or anywhere.",
  ),
  image(
    "phone-landscape",
    "Рука с телефоном, десктоп; экран пустой. Экран телефона в пикселях фото: x 781–1018, y 116–610",
    phoneH,
    "16:9",
    "Higgsfield gpt_image_2_5, ID c32b0e77-63d6-423f-a38f-47d9c370c22a, 16:9, 1344×752, quality low. Photorealistic documentary photograph at blue-hour dusk on a city street: a person's hand holding a modern smartphone upright on the right side of the frame, the phone facing the viewer straight-on, the screen completely black and blank. Behind, out of focus, a row of warm glowing shopfront windows and wet pavement reflections, cool blue evening light mixed with warm window light on the hand. Natural skin, realistic fingers, shallow depth of field. No face visible, no text, logos or brand marks on the phone or anywhere.",
  ),

  image(
    "flowers-macro",
    "Проект 01, вступление: макро розы с каплей",
    flMacro,
    "16:9",
    "Higgsfield nano_banana_flash, ID 9b023598-0d65-4cd1-948e-3c11cf20696e, 16:9, 5504×3072, 2026-09-24. Extreme macro photograph of the heart of a single pale blush garden rose, petals spiraling toward the center and filling the entire frame edge to edge, no background visible. One clear water droplet on an inner petal edge, visible fine petal veins, soft translucent backlight from upper right making the petals glow, creamy champagne highlights. Focal plane on the droplet and inner petal edge, everything else dissolving into soft blush. 100mm macro lens at f/2.8, 1:1 magnification. Light luxury editorial photography, muted blush, fine film grain, photographic realism. No glitter, no excessive dew, no dark tones, no saturated pink.",
  ),
  image(
    "flowers-bouquet",
    "Проект 01: фото букета на экране сайта в телефоне",
    flBouquet,
    "4:5",
    "Higgsfield nano_banana_flash, ID 96449e47-d269-4406-9772-fd2032294566, 4:5, 3712×4608. One sculptural hand-tied bouquet presented as an art object: cream and blush garden roses, dusty-rose lisianthus, pale peach ranunculus, white astilbe plumes and silvery sage eucalyptus, loose asymmetric silhouette with one long arching stem reaching up-left. Stems wrapped in raw undyed linen tied with a narrow champagne silk ribbon, standing in a slim matte ivory ceramic cylinder vase on a pale travertine block. Seamless warm ivory background with a gentle gradient to champagne at the bottom, soft shadow falling right. Large diffused key light from camera-left at 45 degrees, subtle rim light from behind right catching petal edges. Deep focus, crisp petal texture, one naturally imperfect outer petal. Subject slightly left of center, 70% of frame height. 100mm lens at f/8. Light luxury European flower atelier, editorial fashion photography, fine film grain, photographic realism, medium format. No dark background, no gold, no saturated pink, no glossy commercial look, no text, no cellophane.",
  ),
  image(
    "flowers-world",
    "Проект 01: размытый фон экрана",
    worldFlower,
    "1:1",
    "Higgsfield nano_banana_flash, ID 72759aa4-7141-4001-9c7d-57102b8ca38a, 16:9, 5504×3072 (в пакете — кроп 1254×1238). Wide editorial photograph of a generous low table arrangement of blush garden roses, cream sweet peas and sage olive branches in a low ivory stone bowl on a long pale oak table, centered in the lower third of the frame; in the exact center of the arrangement one large fully open pale blush garden rose facing the camera straight-on. Behind: a soft bright flower atelier, warm ivory lime-plaster wall, diffused morning window light from the left, 40% calm negative space above. Frontal, eye level just above the table, 50mm lens at f/4. Light luxury European flower atelier, editorial fashion photography, ivory, milk and champagne palette, muted blush, soft sage, fine film grain, photographic realism, medium format. No dark background, no gold, no text, no people.",
  ),
  ...FLOWER_SLIDES.map((img, i) =>
    image(
      `flowers-slide-${i + 1}`,
      `Проект 01: слайд ${i + 1} из 9 лендинга-концепта на стенах коридора`,
      img,
      "16:9",
      FLOWER_SLIDES_SOURCE,
    ),
  ),

  image(
    "bakery-macro",
    "Проект 02, вступление: разлом печенья с шоколадом",
    ckMacro,
    "16:9",
    "Higgsfield nano_banana_2, ID acef68fa-0529-4ee2-9faf-1f09dc3d77e1, 16:9, 2752×1536, 2026-09-26. Extreme macro inside a freshly broken warm chocolate chunk cookie, camera looking into the break: soft open golden crumb structure with air pockets, thick strands of molten dark chocolate slowly stretching across the gap, glossy chocolate pools, a few loose crumbs, hot pink #FF3E9A rim light glowing from behind through the break, deep crimson and chocolate shadows, very shallow depth of field, faint warm steam. Cinematic luxury food commercial, photorealistic, not CGI. No text.",
  ),
  image(
    "bakery-cookie",
    "Проект 02: печенье с розовым ореолом на прозрачном фоне — кадры «Тёплое печенье» в телефоне",
    ckCookie,
    "1:1",
    "Higgsfield nano_banana_2, ID 8bd10b53-2d96-4fa2-9efd-1867c839372a, 1:1, 2048×2048; вырезано с розовым ореолом. Editorial luxury food campaign photograph. One oversized thick chocolate chunk cookie, about 12 cm wide and 3 cm tall, cracked baked golden-brown surface with visible pores and sugar crystals, glossy dark chocolate chunks half-melted on top and bursting from the edges, a few loose crumbs, slightly irregular hand-formed edge. Three-quarter view 28 degrees above, 100mm macro lens, f/8, hard directional key light from top right creating crisp specular highlights on the chocolate, deep soft shadow on the left side, faint pink bounce light. Isolated on a seamless hot pink #FF3E9A studio backdrop, soft contact shadow. Photorealistic, medium format, natural imperfections, not CGI, not plastic. No props, no plate, no hands, no text, no logos.",
  ),
  image(
    "bakery-dessert",
    "Проект 02: десерт «Шоколад и крем» на чёрном — второй кадр в телефоне. Печенье-сэндвич обезличено отдельной правкой (надписи и эмблема заменены нейтральным узором)",
    ckDessert,
    "1:1",
    "Две генерации Higgsfield. 1) nano_banana_2, ID 4adf9ae8-913a-49ee-b14d-510616044743, 1:1, 2048×2048: Editorial luxury food campaign photograph. One oversized thick dark chocolate cookie mixed with white chocolate chunks and crushed Oreo-style chocolate sandwich cookie pieces, topped with a generous swirl of cream cheese and white chocolate frosting and one whole chocolate sandwich cookie pressed into the frosting at an angle, a few dark cookie crumbs. Three-quarter view 28 degrees above, 100mm macro lens, f/8, hard directional key light from top right, crisp highlights on the frosting, deep soft shadow on the left, faint pink bounce light. Isolated on a seamless hot pink #FF3E9A studio backdrop, soft contact shadow. Photorealistic, natural imperfections, realistic frosting texture with subtle moisture, not CGI. No props, no hands, no text, no visible logos. 2) Правка gpt_image_2_5, ID 02dfc29a-a283-47a1-ae75-f52f4e8b1630, 2048×2048, прозрачный фон, 2026-09-28 (в пакете — эта версия на чёрном): Edit this exact photo. Keep everything identical: the same cookie, same composition, framing, camera angle, lighting, colors, frosting swirl, white chocolate chunks, crumbs and transparent background. Only change the two dark chocolate sandwich wafer cookies: remove ALL lettering, words, logos and oval brand emblem from their embossed surface and replace it with a plain generic embossed pattern of small radial petals and dots, with no text of any kind. The wafers must not resemble any branded cookie. Photorealistic, no text anywhere.",
  ),
  ...BAKERY_SLIDES.map((img, i) =>
    image(
      `bakery-slide-${i + 1}`,
      `Проект 02: кадр ${i + 1} из 12 сайта-концепта на стенах коридора`,
      img,
      "16:9",
      BAKERY_SLIDES_SOURCE,
    ),
  ),
];

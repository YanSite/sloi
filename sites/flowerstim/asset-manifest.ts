import type { AssetFile, AssetManifest } from "@/lib/types";
import a01Bg from "./assets/media/A01-BG-src.jpg";
import a01Bouquet from "./assets/media/A01-BQ-4k.webp";
import a01Foreground from "./assets/media/A01-FG.webp";
import a02Macro from "./assets/media/A02.jpg";
import a03Bouquet from "./assets/media/A03-src.jpg";
import a03Depth from "./assets/media/A03-depth.png";
import g1 from "./assets/media/G1.jpg";
import g2 from "./assets/media/G2.jpg";
import v01End from "./assets/media/V01-END.jpg";
import v02Still from "./assets/media/V02-STILL.jpg";

/**
 * Asset manifest Flowerstim — стабильные ID из
 * design-reference/flowerstim/ASSET-MANIFEST.md. Файлы лежат в
 * `sites/flowerstim/assets/media/` (копия `design-reference/flowerstim/media/`
 * байт-в-байт) и подключаются статическим импортом: сборщик выдаёт
 * хешированный URL и размеры, компоненты получают их только через
 * `resolveAsset`. Полное сопоставление ID → файл → Higgsfield job —
 * docs/flowerstim-integration.md §4.
 *
 * Новых генераций для production не было: все файловые ассеты — те же,
 * что в утверждённом прототипе.
 */

type StaticImage = { src: string; width: number; height: number };
const file = (img: StaticImage): AssetFile[] => [
  { url: img.src, width: img.width, height: img.height },
];

/** Общий стиль, дописанный в конец каждого промпта (media/PROMPTS-S01-S04.md). */
const STYLE =
  " Light luxury European flower atelier, editorial fashion photography, soft natural daylight, ivory, milk and champagne palette, muted blush, dusty rose, soft sage, natural stone, linen, glass, ceramic, subtle soft shadows, fine film grain, photographic realism, medium format. No black or dark background, no gold, no saturated pink, no glossy commercial look, no text, no people, no cellophane.";

const PROMPT = {
  A01_BG:
    "Empty bright limestone atelier wall, warm ivory lime plaster with a shallow arched niche slightly right of center, a pale travertine plinth standing empty in front of the niche in the lower third, a soft rectangle of late-morning sun falling diagonally across the wall from the upper right. Nothing on the plinth. Frontal, eye level slightly above plinth height, 80mm lens at f/5.6, soft window light from camera-left, lifted warm shadows, large calm negative space in the upper-left third." +
    STYLE,
  A01_BQ:
    "A loose, airy luxury bouquet in a matte hand-thrown ivory ceramic vessel, photographed alone against a seamless plain warm ivory background for clean cut-out. Blush garden roses, dusty-rose ranunculus, cream sweet peas and muted sage olive branches. One large fully open blush garden rose at the exact center of the arrangement, facing the camera straight-on, spiral of petals sharply detailed with fine veins and one small water droplet — this rose is the hero and must hold extreme close-up. Same light as the atelier: soft window light from camera-left, gentle warm bounce. 80mm lens at f/8, deep focus across the bouquet." +
    STYLE,
  A01_FG:
    "Two large out-of-focus blush rose petals and one soft sage olive leaf very close to the lens, placed at frame-left and top-right edges, heavily defocused creamy bokeh, isolated against a plain flat light grey background for easy masking, soft daylight from the left. Nothing else in frame." +
    STYLE,
  A02:
    "Extreme macro of the heart of a single pale blush garden rose, petals spiraling toward the center and filling the entire frame edge to edge, no background visible. One clear water droplet on an inner petal edge, visible fine veins, soft translucent backlight from upper right making petals glow, creamy champagne highlights. Focal plane on the droplet and inner petal edge. 100mm macro lens at f/2.8, 1:1 magnification." +
    STYLE,
  V01:
    "Starting on this extreme macro of the rose heart, the camera slowly and continuously dollies straight back along the lens axis, revealing the whole rose, then a generous low table arrangement of blush roses, cream sweet peas and sage branches in a low ivory stone bowl on a long pale oak table, then the soft bright atelier around it: lime-plaster wall, diffused window light from the left. Constant slow speed, no rotation, no cuts, no handheld shake. Petals stir very slightly. Lighting stays constant." +
    STYLE,
  G1:
    "Three tall stems of pale peach garden roses and one arching sage olive branch in a clear hand-blown glass cylinder with water, on a pale travertine ledge against a warm ivory plaster wall; a crisp diagonal architectural shadow of a window mullion crosses the wall and the vase. Soft sun, refractions in water. Subject in left third, large negative space right. 85mm f/5.6." +
    STYLE,
  G2:
    "Overhead flat lay: a single dusty-rose ranunculus and two cut sweet pea stems resting on folded raw undyed linen on pale oak, a few loose petals, brass florist scissors partially entering the lower edge. Soft north window light. Top-down, 50mm f/4." +
    STYLE,
  V02:
    "Locked-off static camera in a bright calm flower atelier with lime-plaster walls and a tall window with a sheer linen curtain on the right; a long pale oak worktable with loose stems. Only the light moves: the curtain slowly breathes in a light breeze, a soft sun patch drifts a few centimeters across the wall, stems sway almost imperceptibly. No camera movement, no people." +
    STYLE,
  A03:
    "One sculptural hand-tied bouquet presented as an art object: cream and blush garden roses, dusty-rose lisianthus, pale peach ranunculus, white astilbe plumes and silvery sage eucalyptus, loose asymmetric silhouette with one long arching stem reaching up-left. Stems wrapped in raw undyed linen tied with a narrow champagne silk ribbon, standing in a slim matte ivory cylinder vase on a pale travertine block. Seamless warm ivory background with gentle gradient to champagne at the bottom, soft shadow falling right. Large diffused key light from camera-left at 45 degrees, subtle rim light behind right catching petal edges. Deep focus, crisp petal texture, one naturally imperfect outer petal. Subject slightly left of center, 70% of frame height. 100mm lens at f/8." +
    STYLE,
};

export const flowerstimAssetManifest: AssetManifest = [
  {
    asset_id: "S01_BG",
    purpose: "Стена из извести с аркой и пустым травертиновым постаментом — фон сцены S01",
    type: "image",
    source: "higgsfield",
    prompt: PROMPT.A01_BG,
    aspect_ratio: "16:9",
    section: "immersive-stage",
    status: "generated",
    files: file(a01Bg),
  },
  {
    asset_id: "S01_BOUQUET",
    purpose: "Букет в керамике, вырезан из фона; центральная роза — цель въезда камеры",
    type: "image",
    source: "higgsfield",
    prompt: PROMPT.A01_BQ,
    aspect_ratio: "1:1",
    section: "immersive-stage",
    status: "generated",
    files: file(a01Bouquet),
  },
  {
    asset_id: "S01_FOREGROUND",
    purpose: "Лепестки и лист у объектива, сильное размытие — передний план S01",
    type: "image",
    source: "higgsfield",
    prompt: PROMPT.A01_FG,
    aspect_ratio: "16:9",
    section: "immersive-stage",
    status: "generated",
    files: file(a01Foreground),
  },
  {
    asset_id: "S02_MACRO",
    purpose: "Макро сердцевины розы с каплей — первый кадр S02 и точка стыка с S01",
    type: "image",
    source: "higgsfield",
    prompt: PROMPT.A02,
    aspect_ratio: "16:9",
    section: "immersive-stage",
    status: "generated",
    files: file(a02Macro),
  },
  {
    asset_id: "S02_END",
    purpose: "Финальный кадр V01: столовая композиция в ателье (стоп-кадр вместо видео)",
    type: "image",
    source: "higgsfield",
    prompt: PROMPT.V01,
    aspect_ratio: "16:9",
    section: "immersive-stage",
    status: "generated",
    files: file(v01End),
  },
  {
    // ASSET GAP: видео не сгенерировано (тариф Higgsfield), прототип
    // использует камеру по стоп-кадрам S02_MACRO → S02_END. См. G-02.
    asset_id: "S02_VIDEO",
    purpose: "V01 — отъезд камеры от макро розы к композиции в ателье, scroll-scrub",
    type: "video",
    source: "higgsfield",
    prompt: PROMPT.V01,
    aspect_ratio: "16:9",
    section: "immersive-stage",
    status: "planned",
  },
  {
    asset_id: "S03_FRAME_01",
    purpose: "Рама № 01 · Сборные букеты (reuse S02_END)",
    type: "image",
    source: "higgsfield",
    prompt: PROMPT.V01,
    aspect_ratio: "16:9",
    section: "immersive-stage",
    status: "generated",
    files: file(v01End),
  },
  {
    asset_id: "S03_FRAME_02",
    purpose: "Рама № 02 · Розы — стебли в стекле",
    type: "image",
    source: "higgsfield",
    prompt: PROMPT.G1,
    aspect_ratio: "4:5",
    section: "immersive-stage",
    status: "generated",
    files: file(g1),
  },
  {
    asset_id: "S03_FRAME_03",
    purpose: "Рама № 03 · Монобукеты — квадратный кроп макро (reuse S02_MACRO)",
    type: "image",
    source: "higgsfield",
    prompt: PROMPT.A02,
    aspect_ratio: "16:9",
    section: "immersive-stage",
    status: "generated",
    files: file(a02Macro),
  },
  {
    asset_id: "S03_FRAME_04",
    purpose: "Рама № 04 · Ранункулюсы — лён и ранункулюс, flat lay",
    type: "image",
    source: "higgsfield",
    prompt: PROMPT.G2,
    aspect_ratio: "4:5",
    section: "immersive-stage",
    status: "generated",
    files: file(g2),
  },
  {
    asset_id: "S03_FRAME_05",
    purpose: "Рама № 05 · Авторские — свет в ателье (стоп-кадр V02)",
    type: "image",
    source: "higgsfield",
    prompt: PROMPT.V02,
    aspect_ratio: "16:9",
    section: "immersive-stage",
    status: "generated",
    files: file(v02Still),
  },
  {
    // ASSET GAP (NICE): loop-видео для рамы 05 не сгенерировано, в раме
    // стоп-кадр S03_FRAME_05. См. G-02.
    asset_id: "S02_VIDEO_V02",
    purpose: "V02 — свет, скользящий по стене ателье, loop в раме 05",
    type: "video",
    source: "higgsfield",
    prompt: PROMPT.V02,
    aspect_ratio: "16:9",
    section: "immersive-stage",
    status: "planned",
  },
  {
    asset_id: "S03_FRAME_06",
    purpose: "Рама № 06 · Премиум — signature-букет, мост в S04 (reuse S04_BOUQUET)",
    type: "image",
    source: "higgsfield",
    prompt: PROMPT.A03,
    aspect_ratio: "4:5",
    section: "immersive-stage",
    status: "generated",
    files: file(a03Bouquet),
  },
  {
    asset_id: "S04_BOUQUET",
    purpose: "Signature-букет как объект — меш с displacement по S04_DEPTH",
    type: "image",
    source: "higgsfield",
    prompt: PROMPT.A03,
    aspect_ratio: "4:5",
    section: "immersive-stage",
    status: "generated",
    files: file(a03Bouquet),
  },
  {
    // Производная от S04_BOUQUET (маска силуэта с размытием), не
    // настоящая depth-модель — G-04. Поэтому source "placeholder".
    asset_id: "S04_DEPTH",
    purpose: "Карта глубины для смещения вершин S04_BOUQUET (R/255 × 0.38)",
    type: "image",
    source: "placeholder",
    aspect_ratio: "4:5",
    section: "immersive-stage",
    status: "generated",
    files: file(a03Depth),
  },
];

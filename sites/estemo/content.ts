import { defineContent } from "@/lib/render";
import type { EstemoStageContent } from "./stage/content-types";

/**
 * Контент прототипа для магазина цветов «Эстэмó» (Москва, Новодмитровская
 * ул., 2, корп. 1). Структура и смысл строк — как в
 * design-reference/florist-atelier/prototype.html; название, адрес,
 * телефон и ссылки — данные магазина (Яндекс Карты, taplink).
 * Промокод, часы работы и цена доставки — пока заглушки до подтверждения
 * магазином (согласованно с business-profile.ts).
 */

/**
 * Каталога с разделами у магазина нет — все ссылки ведут на его taplink,
 * различаясь только UTM-меткой места клика.
 */
const SITE = "https://taplink.cc/estemore";
const UTM = "utm_source=immersive_site&utm_medium=referral";
const utm = (content: string) => `${SITE}?${UTM}&utm_content=${content}`;

const FRAMES: [string, string][] = [
  ["№ 01 · Сборные букеты →", "sbornye-bukety"],
  ["№ 02 · Розы →", "rozy"],
  ["№ 03 · Монобукеты →", "monobukety"],
  ["№ 04 · Ранункулюсы →", "ranunkulusy"],
  ["№ 05 · Авторские →", "avtorskie-bukety"],
  ["№ 06 · Премиум →", "premium-bukety"],
];

const stage: EstemoStageContent = {
  assets: {
    s01Background: { assetId: "S01_BG" },
    s01Bouquet: { assetId: "S01_BOUQUET" },
    s01Foreground: { assetId: "S01_FOREGROUND" },
    s02Macro: { assetId: "S02_MACRO" },
    s02End: { assetId: "S02_END" },
    s03Frames: [
      { assetId: "S03_FRAME_01" },
      { assetId: "S03_FRAME_02" },
      { assetId: "S03_FRAME_03" },
      { assetId: "S03_FRAME_04" },
      { assetId: "S03_FRAME_05" },
      { assetId: "S03_FRAME_06" },
    ],
    s04Bouquet: { assetId: "S04_BOUQUET" },
    s04Depth: { assetId: "S04_DEPTH" },
  },
  srTitle: "Эстэмó — магазин цветов в Москве",
  header: {
    kicker: "Магазин цветов · Москва",
    brand: "Эстэмó",
    hours: "Открыто до 22:00",
    cta: { label: "Выбрать букет →", href: utm("header") },
  },
  hero: {
    line: { lead: "Авторские букеты с доставкой ", accent: "в день заказа" },
    facts: ["Свежие поставки каждый день", "Фото букета перед отправкой"],
  },
  promo: {
    code: "ЭСТЭМО10",
    heroLabel: "−10% по промокоду ЭСТЭМО10",
    heroCopied: "ЭСТЭМО10 скопирован",
    heroTitle: "Скопировать промокод",
    finalBadge: "−10% · ЭСТЭМО10",
    finalLabel: "Скопировать",
    finalCopied: "Скопировано",
  },
  scrollHint: "Листайте",
  title3d: [{ t: "Эстэмó" }, { t: "цветы", italic: true }],
  blockAssortment: {
    label: "01 · Широкий ассортимент",
    heading: {
      lead: "Любой наш букет — отдельная работа,",
      accent: "собранная бережно и с точностью до мелочей.",
    },
    body: "Работаем только с отборными цветами и везём их напрямую от поставщиков, которым доверяем.",
    link: { label: "Розы в каталоге", href: utm("b02_rozy") },
  },
  blockPersonal: {
    label: "02 · Индивидуальный подход",
    heading: {
      lead: "Флорист соберёт композицию,",
      accent: "в которой прозвучит именно ваше чувство.",
    },
    body: "Выслушаем каждое пожелание и подскажем, какие цветы лучше всего подойдут к вашему поводу.",
    link: { label: "Авторские букеты", href: utm("b03_avtorskie") },
  },
  exhibition: {
    hint: "Нажмите на кадр — откроется раздел каталога",
    phrases: [
      [{ t: "Свет — первый" }, { t: "материал.", italic: true }],
      [{ t: "Остальное —" }, { t: "руками.", italic: true, color: "#8A5F59" }],
    ],
    frames: FRAMES.map(([caption, slug]) => ({ caption, href: utm(`s03_${slug}`) })),
  },
  signature: {
    label: "№ 06 · Signature",
    heading: { lead: "Композиция", accent: "Эстэмó" },
    body: "Роза, лизиантус, ранункулюс, астильба, эвкалипт. Лён и шёлк.",
    link: { label: "Премиум-букеты", href: utm("b07_premium") },
    hint: "Нажмите и удерживайте, чтобы рассмотреть",
    callouts: [
      "Лён, необработанный",
      "Шёлковая лента, шампань",
      "Керамика, матовая",
      "Кромка лепестка",
    ],
  },
  delivery: {
    label: "03 · Быстрая доставка",
    heading: {
      lead: "Букет приедет лично к вам в руки,",
      accent: "в какой бы точке Москвы вы ни были.",
    },
    body: "Доставляем быстро, и цветы приезжают свежими, без единого изъяна. Возим по всей Москве каждый день, а перед отправкой присылаем фото букета.",
    rows: [
      ["Самовывоз", "бесплатно"],
      ["По Москве", "от 500 ₽"],
    ],
    link: { label: "Доставка и оплата", href: utm("b08_delivery") },
  },
  care: {
    label: "Уход за цветами · Flowers care",
    items: [
      "Подрезайте стебли раз в 2–3 дня",
      "Срежьте лишнюю листву",
      "Регулярно меняйте воду в вазе",
      "Берегите букет от прямого солнца",
    ],
    link: {
      label: "Подробнее об уходе",
      href: utm("b09_care"),
    },
  },
  final: {
    label: "Наш магазин · Our store",
    heading: { lead: "Эстэмó ", accent: "цветы" },
    cta: { label: "Выбрать букет в каталоге →", href: utm("b10_final") },
    contacts: [
      { label: "Время работы", text: "Ежедневно с 09:00 до 22:00" },
      { label: "Адрес", text: "Москва, Новодмитровская ул., 2, корп. 1" },
      { label: "Телефон", links: [{ label: "+7 (919) 725-66-56", href: "tel:+79197256656" }] },
      {
        label: "Мессенджеры",
        links: [
          { label: "Telegram", href: "https://t.me/estemore", external: true },
          { label: "WhatsApp", href: "https://wa.me/message/SRK4MMU2Y3FLB1", external: true },
        ],
      },
    ],
  },
  hud: {
    enabled: true,
    scenes: ["S01 · Aperture", "S02 · Pull-back", "S03 · Exhibition", "S04 · The Object"],
  },
};

export const estemoContent = defineContent({ "immersive-stage": { stage } });

import { defineContent } from "@/lib/render";
import type { FloristAtelierStageContent } from "./stage/content-types";

/**
 * Демо-контент прототипа — строки совпадают с
 * design-reference/florist-atelier/prototype.html. Название, контакты,
 * часы, цены, промокод и адрес каталога — заглушки: для конкретного
 * магазина они заменяются его проверенными данными (согласованно с
 * business-profile.ts).
 */

/** Адрес каталога магазина; ссылки ведут на его разделы с UTM-метками. */
const SITE = "https://example.com";
const UTM = "utm_source=immersive_site&utm_medium=referral";
const utm = (path: string, content: string) => `${SITE}${path}?${UTM}&utm_content=${content}`;

const FRAMES: [string, string][] = [
  ["№ 01 · Сборные букеты →", "sbornye-bukety"],
  ["№ 02 · Розы →", "rozy"],
  ["№ 03 · Монобукеты →", "monobukety"],
  ["№ 04 · Ранункулюсы →", "ranunkulusy"],
  ["№ 05 · Авторские →", "avtorskie-bukety"],
  ["№ 06 · Премиум →", "premium-bukety"],
];

const stage: FloristAtelierStageContent = {
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
  srTitle: "Ателье цветов",
  header: {
    kicker: "Магазин цветов · Город",
    brand: "Ателье цветов",
    hours: "Открыто до 22:00",
    cta: { label: "Выбрать букет →", href: utm("/", "header") },
  },
  hero: {
    line: { lead: "Авторские букеты с доставкой ", accent: "в день заказа" },
    facts: ["Свежие поставки каждый день", "Фото букета перед отправкой"],
  },
  promo: {
    code: "ЦВЕТЫ10",
    heroLabel: "−10% по промокоду ЦВЕТЫ10",
    heroCopied: "ЦВЕТЫ10 скопирован",
    heroTitle: "Скопировать промокод",
    finalBadge: "−10% · ЦВЕТЫ10",
    finalLabel: "Скопировать",
    finalCopied: "Скопировано",
  },
  scrollHint: "Листайте",
  title3d: [{ t: "Ателье" }, { t: "цветов", italic: true }],
  blockAssortment: {
    label: "01 · Широкий ассортимент",
    heading: {
      lead: "Любой наш букет — отдельная работа,",
      accent: "собранная бережно и с точностью до мелочей.",
    },
    body: "Работаем только с отборными цветами и везём их напрямую от поставщиков, которым доверяем.",
    link: { label: "Розы в каталоге", href: utm("/rozy", "b02_rozy") },
  },
  blockPersonal: {
    label: "02 · Индивидуальный подход",
    heading: {
      lead: "Флорист соберёт композицию,",
      accent: "в которой прозвучит именно ваше чувство.",
    },
    body: "Выслушаем каждое пожелание и подскажем, какие цветы лучше всего подойдут к вашему поводу.",
    link: { label: "Авторские букеты", href: utm("/avtorskie-bukety", "b03_avtorskie") },
  },
  exhibition: {
    hint: "Нажмите на кадр — откроется раздел каталога",
    phrases: [
      [{ t: "Свет — первый" }, { t: "материал.", italic: true }],
      [{ t: "Остальное —" }, { t: "руками.", italic: true, color: "#8A5F59" }],
    ],
    frames: FRAMES.map(([caption, slug]) => ({ caption, href: utm(`/${slug}`, `s03_${slug}`) })),
  },
  signature: {
    label: "№ 06 · Signature",
    heading: { lead: "Композиция", accent: "ателье" },
    body: "Роза, лизиантус, ранункулюс, астильба, эвкалипт. Лён и шёлк.",
    link: { label: "Премиум-букеты", href: utm("/premium-bukety", "b07_premium") },
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
      accent: "в какой бы точке города вы ни были.",
    },
    body: "Доставляем быстро, и цветы приезжают свежими, без единого изъяна. Возим по всему городу каждый день, а перед отправкой присылаем фото букета.",
    rows: [
      ["Самовывоз", "бесплатно"],
      ["По городу", "от 500 ₽"],
    ],
    link: { label: "Доставка и оплата", href: utm("/delivery", "b08_delivery") },
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
      href: utm("/care", "b09_care"),
    },
  },
  final: {
    label: "Наш магазин · Our store",
    heading: { lead: "Ателье ", accent: "цветов" },
    cta: { label: "Выбрать букет в каталоге →", href: utm("/", "b10_final") },
    contacts: [
      { label: "Время работы", text: "Ежедневно с 09:00 до 22:00" },
      { label: "Адрес", text: "г. Город, ул. Цветочная, 1" },
      { label: "Телефон", links: [{ label: "+7 (000) 000-00-00", href: "tel:+70000000000" }] },
      {
        label: "Мессенджеры",
        links: [
          { label: "Telegram", href: "https://t.me/", external: true },
          { label: "WhatsApp", href: "https://wa.me/", external: true },
        ],
      },
    ],
  },
  hud: {
    enabled: true,
    scenes: ["S01 · Aperture", "S02 · Pull-back", "S03 · Exhibition", "S04 · The Object"],
  },
};

export const floristAtelierContent = defineContent({ "immersive-stage": { stage } });

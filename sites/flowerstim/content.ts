import { defineContent } from "@/lib/render";
import type { FlowerstimStageContent } from "./stage/content-types";

/**
 * Контент Flowerstim — все строки перенесены 1:1 из утверждённого
 * прототипа (design-reference/flowerstim/prototype.html). Факты сверены
 * с business-profile.ts (источник: flowerstim.ru). Рейтинг «5,0 · 192» и
 * промокод ОСЕНЬ26 взяты прототипом из карточки магазина, присланной
 * владельцем, — CONTENT GAP G-09: проверить актуальность перед запуском.
 */

const SITE = "https://flowerstim.ru";
const UTM = "utm_source=aesthetic_experience&utm_medium=referral&utm_campaign=osen26";
const utm = (path: string, content: string) => `${SITE}${path}?${UTM}&utm_content=${content}`;

const FRAMES: [string, string][] = [
  ["№ 01 · Сборные букеты →", "sbornye-bukety"],
  ["№ 02 · Розы →", "rozy"],
  ["№ 03 · Монобукеты →", "monobukety"],
  ["№ 04 · Ранункулюсы →", "ranunkulusy"],
  ["№ 05 · Авторские →", "avtorskie-bukety"],
  ["№ 06 · Премиум →", "premium-bukety"],
];

const stage: FlowerstimStageContent = {
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
  srTitle: "Эстетика цветов",
  header: {
    kicker: "Магазин цветов · Москва",
    brand: "Эстетика цветов",
    hours: "Открыто до 00:00",
    cta: { label: "Выбрать букет →", href: utm("/", "header") },
  },
  hero: {
    line: { lead: "Авторские букеты с круглосуточной доставкой ", accent: "по Москве" },
    facts: ["★ 5,0 · 192 оценки", "Фото букета перед отправкой"],
  },
  promo: {
    code: "ОСЕНЬ26",
    heroLabel: "−10% по промокоду ОСЕНЬ26",
    heroCopied: "ОСЕНЬ26 скопирован",
    heroTitle: "Скопировать промокод",
    finalBadge: "−10% · ОСЕНЬ26",
    finalLabel: "Скопировать",
    finalCopied: "Скопировано",
  },
  scrollHint: "Листайте",
  title3d: [{ t: "Эстетика" }, { t: "цветов", italic: true }],
  blockAssortment: {
    label: "01 · Широкий ассортимент",
    heading: {
      lead: "Каждый букет — это произведение искусства,",
      accent: "выполненное с любовью и вниманием к деталям.",
    },
    body: "Мы предлагаем только лучшие цветы, которые привозим напрямую от проверенных поставщиков.",
    link: { label: "Розы в каталоге", href: utm("/rozy", "b02_rozy") },
  },
  blockPersonal: {
    label: "02 · Индивидуальный подход",
    heading: {
      lead: "Наши флористы создадут композицию,",
      accent: "которая точно передаст ваши эмоции.",
    },
    body: "Мы учитываем все ваши пожелания и помогаем подобрать идеальные цветы для любого события.",
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
      lead: "Мы привезем ваш букет прямо в руки,",
      accent: "где бы вы ни находились.",
    },
    body: "Мы гарантируем доставку цветов в кратчайшие сроки и в идеальном состоянии. Круглосуточная доставка цветов по Москве. Фото букета перед отправкой.",
    rows: [
      ["Самовывоз", "бесплатно"],
      ["В пределах МКАД", "750 ₽"],
    ],
    link: { label: "Доставка и оплата", href: utm("/delivery-and-payment", "b08_delivery") },
  },
  care: {
    label: "Уход за цветами · Flowers care",
    items: [
      "Обновляйте срез каждые 2-3 дня",
      "Удалите все лишние листья",
      "Наполняйте вазу свежей водой",
      "Не держите цветы под прямыми лучами",
    ],
    link: {
      label: "Подробнее об уходе",
      href: utm("/tpost/mv4h2zbdt1-kak-uhazhivat-za-tsvetami-posle-pokupki", "b09_care"),
    },
  },
  final: {
    label: "Наш магазин · Our store",
    heading: { lead: "Эстетика ", accent: "цветов" },
    cta: { label: "Выбрать букет на flowerstim.ru →", href: utm("/", "b10_final") },
    contacts: [
      { label: "Время работы", text: "Ежедневно с 08:00 до 00:00" },
      { label: "Адрес", text: "г. Москва, Дмитровский пр., 1" },
      { label: "Телефон", links: [{ label: "+ 7 (926) 025 45 44", href: "tel:+79260254544" }] },
      {
        label: "Мессенджеры",
        links: [
          { label: "Telegram", href: "https://t.me/Aestheticsof_flowers", external: true },
          { label: "WhatsApp", href: "https://wa.me/message/HH7BH4JVMLY6B1", external: true },
        ],
      },
    ],
  },
  hud: {
    enabled: true,
    scenes: [
      ["S01 · Aperture", "Higgsfield · A01-BG + A01-BQ + A01-FG"],
      ["S02 · Pull-back", "Higgsfield · A02 → V01-END (видео V01 ждёт тарифа)"],
      ["S03 · Exhibition", "Higgsfield · V01-END · G1 · A02 · G2 · V02-STILL · A03"],
      ["S04 · The Object", "Higgsfield · A03 + depth"],
    ],
  },
};

export const flowerstimContent = defineContent({ "immersive-stage": { stage } });

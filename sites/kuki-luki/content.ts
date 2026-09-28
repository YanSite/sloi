import { defineContent } from "@/lib/render";
import { kukiLukiBusinessProfile } from "./business-profile";
import type { KukiLukiStageContent } from "./stage/content-types";

/**
 * Копирайт Куки Луки — дословно из утверждённого прототипа. Телефон
 * берётся из business-profile.ts, чтобы номер жил в одном месте.
 *
 * Чужие товарные знаки (OREO — Mondelez, KINDER — Ferrero) на сайте не
 * используются ни в названиях, ни в составе: вкусы названы по-своему
 * («Куки-н-Крим» — от общепринятого cookies'n'cream, «Бамбини» — «дети»
 * по-итальянски, в пару к «Фрамбини»), ингредиенты описаны без брендов.
 *
 * Цены не показываются: 390 ₽ подтверждены, но из дизайна убраны по
 * решению заказчика.
 *
 * MENU_URL — ссылка на Яндекс Карты из прототипа. Клиентом НЕ
 * подтверждена: заменить на реальный адрес меню перед релизом.
 */
const PHONE = kukiLukiBusinessProfile.contact.phone ?? "";
const PHONE_HREF = `tel:+${PHONE.replace(/\D/g, "")}`;
const MENU_URL = "https://yandex.ru/maps/org/kuki_luki/";

const stage: KukiLukiStageContent = {
  media: {
    signatureCookie: { assetId: "signature-cookie", alt: "Печенье Куки Луки" },
    crack: { assetId: "crack-macro", alt: "" },
    crackVideo: { assetId: "crack-macro-video" },
    interior: { assetId: "interior-macro", alt: "" },
    interiorVideo: { assetId: "interior-macro-video" },
  },
  title: { lines: ["КУКИ", "ЛУКИ"], sub: "КУКИ-Н-КРИМ · ФРАМБИНИ · БАМБИНИ" },
  meta: ["МОСКВА · БУТЫРСКАЯ, 84", "ЕЖЕДНЕВНО 08:00–00:00"],
  tagline: ["БОЛЬШИЕ.", "НАСТОЯЩИЕ.", "ОЧЕНЬ ВКУСНЫЕ."],
  hint: "ЛИСТАЙТЕ",
  brand: "КУКИ ЛУКИ",
  order: { label: "ЗАКАЗАТЬ", href: PHONE_HREF },
  interlude: { eyebrow: "ВНУТРИ", headline: "Шоколад в каждом из трёх главных вкусов" },
  flavors: [
    {
      title: "Куки-н-Крим",
      description:
        "Шоколадное печенье, замешанное с белым шоколадом и дроблёным шоколадным сэндвич-печеньем, украшено кремом из творожного сыра с белым шоколадом и целым сэндвич-печеньем.",
      whole: { assetId: "cream-portrait", alt: "Куки-н-Крим" },
      texture: { assetId: "cream-texture", alt: "" },
      filling: { assetId: "cream-filling", alt: "" },
      packshot: { assetId: "cream-packshot", alt: "Печенье Куки-н-Крим" },
      textureNote: { label: "Шоколадное тесто с дроблёным сэндвич-печеньем", x: 58, y: 42 },
      fillingNotes: [
        { label: "Крем из творожного сыра с белым шоколадом", x: 40, y: 42 },
        { label: "Шоколадное сэндвич-печенье", x: 62, y: 30 },
        { label: "Белый шоколад", x: 34, y: 64 },
      ],
    },
    {
      title: "Фрамбини",
      description:
        "Шоколадное печенье с кусочками молочного шоколада внутри, малиновый крем-чиз с сублимированной малиной и фрамбини с каплей шоколада посередине.",
      whole: { assetId: "frambini-portrait", alt: "Фрамбини" },
      texture: { assetId: "frambini-texture", alt: "" },
      filling: { assetId: "frambini-filling", alt: "" },
      packshot: { assetId: "frambini-packshot", alt: "Печенье Фрамбини" },
      textureNote: { label: "Шоколадное тесто, кусочки молочного шоколада", x: 56, y: 44 },
      fillingNotes: [
        { label: "Малиновый крем-чиз", x: 40, y: 40 },
        { label: "Сублимированная малина", x: 64, y: 32 },
        { label: "Фрамбини с каплей шоколада", x: 56, y: 62 },
      ],
    },
    {
      title: "Бамбини",
      description: "Песочное печенье, замешанное с молочным шоколадом с молочной начинкой.",
      whole: { assetId: "bambini-portrait", alt: "Бамбини" },
      texture: { assetId: "bambini-texture", alt: "" },
      filling: { assetId: "bambini-filling", alt: "" },
      packshot: { assetId: "bambini-packshot", alt: "Печенье Бамбини" },
      textureNote: { label: "Песочное тесто с молочным шоколадом", x: 56, y: 44 },
      fillingNotes: [
        { label: "Шоколад с молочной начинкой", x: 42, y: 38 },
        { label: "Молочный шоколад", x: 64, y: 54 },
        { label: "Белый шоколад", x: 34, y: 64 },
      ],
    },
  ],
  states: ["Целиком", "Текстура", "Начинка"],
  menu: {
    eyebrow: "Меню",
    headline: "Три главных вкуса",
    cta: { label: "ПОСМОТРЕТЬ ВСЁ МЕНЮ", href: MENU_URL, external: true },
  },
  visit: {
    fields: [
      { label: "Адрес", value: "Бутырская ул., 84" },
      { label: "Часы", value: "08:00–00:00" },
      { label: "Телефон", value: PHONE, href: PHONE_HREF },
    ],
    primary: { label: "ЗАКАЗАТЬ", href: PHONE_HREF },
    secondary: { label: "МЕНЮ", href: MENU_URL, external: true },
  },
};

export const kukiLukiContent = defineContent({ "immersive-stage": { stage } });

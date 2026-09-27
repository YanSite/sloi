import { defineContent } from "@/lib/render";
import { kukiLukiChoreography } from "./choreography";

/**
 * Копирайт Куки Луки — дословно из утверждённого прототипа.
 * Цены в сцене и меню не показываются: так решено на этапе дизайна
 * (390 ₽ подтверждены, но из прототипа убраны по решению заказчика).
 *
 * menuUrl — ссылка на Яндекс Карты, поставленная в прототипе как
 * заглушка. НЕ подтверждена клиентом — заменить на реальный адрес меню.
 */
const PHONE_HREF = "tel:+79771021855";
const MENU_URL = "https://yandex.ru/maps/org/kuki_luki/";

export const kukiLukiContent = defineContent({
  "immersive-stage": {
    choreography: kukiLukiChoreography,
    variants: [
      {
        code: "OREO",
        title: "Орео",
        description:
          "Шоколадное печенье, замешанное с белым шоколадом, дробленым печеньем орео внутри, украшено кремом из творожного сыра с белым шоколадом и оригинальным печеньем орео.",
        packshot: { assetId: "oreo-packshot", alt: "Печенье Орео" },
      },
      {
        code: "ФРАМБИНИ",
        title: "Фрамбини",
        description:
          "Шоколадное печенье с кусочками молочного шоколада внутри, малиновый крем-чиз с сублимированной малиной и фрамбини с каплей шоколада посередине.",
        packshot: { assetId: "frambini-packshot", alt: "Печенье Фрамбини" },
      },
      {
        code: "KINDER",
        title: "Киндер",
        description: "Песочное печенье, замешанное с шоколадом Киндер.",
        packshot: { assetId: "kinder-packshot", alt: "Печенье Киндер" },
      },
    ],
    copy: {
      title: { lines: ["КУКИ", "ЛУКИ"], sub: "OREO · ФРАМБИНИ · KINDER" },
      meta: ["МОСКВА · БУТЫРСКАЯ, 84", "ЕЖЕДНЕВНО 08:00–00:00"],
      tagline: ["БОЛЬШИЕ.", "НАСТОЯЩИЕ.", "ОЧЕНЬ ВКУСНЫЕ."],
      hint: "ЛИСТАЙТЕ",
      hud: { brand: "КУКИ ЛУКИ", order: { label: "ЗАКАЗАТЬ", href: PHONE_HREF } },
      interlude: { eyebrow: "ВНУТРИ", headline: "Шоколад в каждом из трёх главных вкусов" },
      states: ["Целиком", "Текстура", "Начинка"],
      menu: {
        eyebrow: "Меню",
        headline: "Три главных вкуса",
        cta: { label: "ПОСМОТРЕТЬ ВСЁ МЕНЮ ↗", href: MENU_URL, external: true },
      },
      visit: {
        fields: [
          { label: "Адрес", value: "Бутырская ул., 84" },
          { label: "Часы", value: "08:00–00:00" },
          { label: "Телефон", value: "+7 (977) 102-18-55", href: PHONE_HREF },
        ],
        primary: { label: "ЗАКАЗАТЬ →", href: PHONE_HREF },
        secondary: { label: "МЕНЮ", href: MENU_URL, external: true },
      },
    },
  },
});

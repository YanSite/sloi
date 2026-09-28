import type { BusinessProfile } from "@/lib/types";

/**
 * Профиль магазина цветов «Эстэмó» (Москва). Название, адрес, телефон,
 * услуги и ссылки — из карточки магазина в Яндекс Картах и его taplink.
 * Часы работы и email — заглушки до подтверждения магазином. Отзывов,
 * рейтингов и наград сюда не выносим — только проверяемые факты.
 */
export const estemoBusinessProfile: BusinessProfile = {
  vertical: "florist",
  name: "Эстэмó",
  tagline: "Магазин цветов с доставкой по Москве",
  description:
    "Отборные цветы напрямую от поставщиков, которым мы доверяем, — и каждый букет как отдельная авторская работа.",
  contact: {
    phone: "+7 (919) 725-66-56",
    email: "hello@example.com",
    address: "Москва, Новодмитровская ул., 2, корп. 1",
  },
  hours: [
    { day: "mon", open: "09:00", close: "22:00" },
    { day: "tue", open: "09:00", close: "22:00" },
    { day: "wed", open: "09:00", close: "22:00" },
    { day: "thu", open: "09:00", close: "22:00" },
    { day: "fri", open: "09:00", close: "22:00" },
    { day: "sat", open: "09:00", close: "22:00" },
    { day: "sun", open: "09:00", close: "22:00" },
  ],
  services: [
    "Составление букетов",
    "Доставка по Москве",
    "Самовывоз",
    "Подарочная упаковка",
    "Открытки к букетам",
    "Свадебная флористика",
  ],
  products: [
    "Авторские букеты",
    "Сборные букеты",
    "Монобукеты",
    "Букеты в коробке",
    "Премиум букеты",
    "Розы",
    "Пионы",
    "Ранункулюсы",
  ],
  serviceArea: "Москва",
  socialLinks: {
    website: "https://taplink.cc/estemore",
    instagram: "https://instagram.com/e.stemore",
    telegram: "https://t.me/estemore",
  },
};

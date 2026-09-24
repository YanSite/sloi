import type { BusinessProfile } from "@/lib/types";

/**
 * Реальные факты бизнеса — источник: https://flowerstim.ru/ (главная,
 * /about-us, /contacts, /delivery-and-payment, /premium-bukety),
 * зафиксировано 2026-09-23. Никаких отзывов, рейтингов, наград, лет на
 * рынке или цен — ни один из этих фактов не подтверждён на сайте-источнике,
 * поэтому они здесь не появляются (см. BusinessProfile — сюда не входит ни
 * один непроверенный claim).
 */
export const flowerstimBusinessProfile: BusinessProfile = {
  vertical: "florist",
  name: "Эстетика цветов",
  tagline: "Доставка цветов по Москве с гарантией свежести",
  description:
    "Только лучшие цветы, которые привозим напрямую от проверенных поставщиков — каждый букет становится произведением искусства.",
  contact: {
    phone: "+7 (926) 025-45-44",
    email: "flowerstim@mail.ru",
    address: "г. Москва, Дмитровский пр., 1",
  },
  hours: [
    { day: "mon", open: "08:00", close: "00:00" },
    { day: "tue", open: "08:00", close: "00:00" },
    { day: "wed", open: "08:00", close: "00:00" },
    { day: "thu", open: "08:00", close: "00:00" },
    { day: "fri", open: "08:00", close: "00:00" },
    { day: "sat", open: "08:00", close: "00:00" },
    { day: "sun", open: "08:00", close: "00:00" },
  ],
  services: [
    "Доставка по Москве в пределах МКАД",
    "Бесплатный самовывоз",
    "Экспресс-доставка",
    "Анонимная доставка",
    "Композиции для свадеб и корпоративных мероприятий",
  ],
  products: [
    "Авторские букеты",
    "Сборные букеты",
    "Монобукеты",
    "Букеты в коробке",
    "Букеты в корзине",
    "Букеты в сумке",
    "Премиум букеты",
    "Пионы",
    "Розы",
    "Гортензии",
    "Ранункулюсы",
    "Кустовые розы",
  ],
  serviceArea: "Москва в пределах МКАД; за МКАД — по согласованию",
  // foundedYear намеренно отсутствует — год основания на сайте-источнике не указан.
  socialLinks: {
    website: "https://flowerstim.ru/",
    telegram: "https://t.me/Aestheticsof_flowers",
    whatsapp: "https://wa.me/message/HH7BH4JVMLY6B1",
    max: "https://max.ru/u/f9LHodD0cOKyjVJ0o282vhGuy2CEnzFWO5Y6MJZwKQdkVEtDhw8NaA4wwjI",
  },
};

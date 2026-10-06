import { defineContent } from "@/lib/render";
import type { EcpStageContent } from "./stage/content-types";

/**
 * Тексты «Есть что показать» — дословно из
 * `design-reference/est-chto-pokazat-site/docs/06_CONTENT_RU.md`;
 * неразрывные пробелы (`NB`) и подписи интерфейса, которых нет в
 * docs (aria, подсказка жеста), — из прототипа v31.
 *
 * ЧЕРНОВИКИ (помечены в пакете, не финал): 02, 03, кейсы, тезисы
 * финала — `draft: true`. Квадратные скобки — заглушки по открытым
 * вопросам (08_OPEN_QUESTIONS): не заменять без решения владельца.
 */
const NB = "\u00A0";

const stage: EcpStageContent = {
  brand: {
    lines: ["Есть", "что", "показать"],
    tagline: "Делаем видимым то, что у вас уже есть",
    homeAria: "Есть что показать — в начало",
  },
  nav: {
    label: "Основная навигация",
    links: [
      { label: "Проекты", idx: "05", screen: 4 },
      { label: "Как мы работаем", idx: "06", screen: 6 },
      { label: "Обсудить", idx: "07", screen: 7 },
    ],
    menuAria: { open: "Открыть меню", close: "Закрыть меню" },
    ticksLabel: "Экраны",
    tickAria: "Экран {n}",
  },
  foot: {
    swipe: "Листайте",
    next: "Дальше",
    nextTo: {
      3: "Дальше · проекты",
      4: "Дальше · кафе-пекарня",
      5: "Дальше · как мы работаем",
      6: "Дальше · обсудить",
    },
    total: "— 07",
  },
  swipeHint: { touch: "Листайте вверх", wheel: "Прокрутите" },
  s01: {
    title: [`Вам есть что `, { mark: "показать." }],
    sub: "Онлайн этого пока не видно.",
  },
  s02: {
    draft: true,
    title: "Так часто бывает с сильными бизнесами",
    signs: [
      { first: ["Гости хвалят атмосферу."], second: "На экране её не видно." },
      { first: ["Ваш продукт узнают с первого раза."], second: "Онлайн вы выглядите как многие." },
      { first: ["Вас советуют друзьям."], second: "А друзья сначала ищут вас в интернете." },
      {
        first: ["Приходится объяснять: ", { mark: `«в${NB}жизни у${NB}нас лучше».` }],
        second: "И это правда.",
      },
    ],
  },
  s03: {
    draft: true,
    title: [`Онлайн ваш бизнес может выглядеть и${NB}ощущаться на${NB}`, { mark: "своём уровне." }],
    sub: "Без преувеличений. Таким, какой он есть.",
  },
  s04: {
    title: "Нам есть что показать вам.",
    after: [
      `Делаем видимым то, что у${NB}вас уже есть.`,
      `Чаще всего это сайт — но${NB}начинаем мы не${NB}с${NB}сайта, а${NB}с${NB}вашего бизнеса.`,
    ],
    // Внутри телефона — вымышленное заведение, временно (08_OPEN_QUESTIONS, п. 1).
    demo: {
      name: "Кофейня на углу",
      hours: "каждый день · 8:00–23:00",
      title: `Вечер, в${NB}который хочется вернуться`,
      cta: "Забронировать стол",
      gallery: "Атмосфера",
      todayCap: "Сегодня",
      today: ["Тыквенный раф", "Сырники с ягодами", "Тёплый круассан"],
      domain: "kofeynya-na-uglu.ru",
    },
  },
  cases: {
    capTitle: "Проекты",
    skip: "Коснитесь, чтобы пропустить",
    screens: [
      {
        draft: true,
        heading: "Разные бизнесы. Разные миры.",
        label: "Проект 01",
        tag: "Концепт",
        title: "Цветочный магазин",
        story: [
          { cap: "Было сильным", text: "Авторские букеты, доставка круглые сутки." },
          { cap: "Не было видно", text: `Каталог как у${NB}всех${NB}— выбор по${NB}цене.` },
          { cap: "Проявили", text: `Сайт-выставка: в${NB}каталог приходят уже с${NB}выбором.` },
        ],
        site: {
          kind: "flowers",
          brand: "Магазин цветов",
          cta: `Выбрать букет${NB}→`,
          title: ["Искусство", "цветов"],
          lead: `Авторские букеты с${NB}круглосуточной доставкой`,
          note: "Фото букета перед отправкой",
        },
      },
      {
        draft: true,
        label: "Проект 02",
        tag: "Концепт",
        title: "Кафе-пекарня",
        story: [
          { cap: "Было сильным", text: `Большое печенье с${NB}начинкой, яркий характер.` },
          {
            cap: "Не было видно",
            text: `Вкус и${NB}текстуру${NB}— а${NB}печенье выбирают глазами.`,
          },
          { cap: "Проявили", text: `12 кадров: пролёт сквозь печенье, заказ в${NB}боте.` },
        ],
        site: {
          kind: "bakery",
          warm: ["Тёплое", "печенье"],
          dessertIndex: "01",
          dessert: ["Шоколад", `и${NB}крем`],
          hours: "08:00–00:00",
          order: `Заказать в${NB}боте →`,
          route: "Маршрут",
        },
      },
    ],
  },
  s06: {
    cap: "Как мы работаем",
    title: "Сначала увидите. Потом решите.",
    steps: [
      {
        cap: "Шаг 01",
        title: "Концепт",
        text: "Разбираемся в вашем бизнесе и показываем, каким он может быть онлайн — до разработки.",
      },
      {
        cap: "Шаг 02",
        title: "Воплощение",
        text: "Делаем и запускаем то, что вы увидели в Концепте.",
      },
      {
        cap: "Шаг 03",
        title: "Развитие",
        text: "Открытие, сезон, новый продукт — проявляем новое, когда оно появляется.",
      },
    ],
    credit: {
      big: "100%",
      text: "стоимости Концепта засчитывается в Воплощение, если вы решите продолжить в течение 30 дней.",
    },
    cta: "Обсудить ваш бизнес",
  },
  s07: {
    lines: ["Вам есть что показать.", "Нам есть что показать вам."],
    sureDraft: true,
    sure: [
      `Сначала Концепт${NB}— увидите свой бизнес онлайн до${NB}разработки.`,
      `100% стоимости Концепта засчитываем в${NB}Воплощение.`,
      `Разговор ни${NB}к${NB}чему не${NB}обязывает.`,
    ],
    invite: "Расскажите о своём бизнесе. С этого начинается разговор.",
    cta: "Рассказать о бизнесе",
    contacts: "[контакты: Telegram, почта]",
    // Страницы политики пока нет (08_OPEN_QUESTIONS, п. 4) — ссылка-заглушка.
    privacy: { label: "Политика конфиденциальности", href: "#privacy" },
  },
  // Форма — 06_CONTENT_RU, «Форма»; плейсхолдеры контакта — из прототипа.
  form: {
    closeAria: "Закрыть форму",
    title: "Расскажите о своём бизнесе",
    sub: "Это ни к чему не обязывает.",
    name: { label: "Как к вам обращаться", error: "Напишите, как к вам обращаться." },
    business: {
      label: "Ваш бизнес и ссылка",
      placeholder: "Название, сайт или соцсети",
      error: "Напишите название или ссылку — так мы сможем посмотреть на ваш бизнес.",
    },
    question: {
      label: "Что хотите обсудить",
      optional: "— необязательно",
      hint: "Например: открытие, переезд, новый продукт.",
    },
    channel: {
      legend: "Где удобнее ответить",
      options: [
        {
          value: "tg",
          label: "Telegram",
          field: "Ваш Telegram",
          placeholder: "@username",
          type: "text",
        },
        {
          value: "mail",
          label: "Почта",
          field: "Ваша почта",
          placeholder: "name@example.ru",
          type: "email",
        },
        {
          value: "phone",
          label: "Телефон",
          field: "Ваш телефон",
          placeholder: "+7 …",
          type: "tel",
        },
      ],
      error: "Оставьте контакт, чтобы мы могли ответить.",
    },
    consent: {
      before: "Соглашаюсь на обработку персональных данных и с ",
      link: "политикой конфиденциальности",
      after: "",
    },
    submit: "Отправить",
    // Что обещаем после отправки — не решено (08_OPEN_QUESTIONS, п. 2).
    done: {
      title: "Получили.",
      text: "[текст подтверждения — что обещаем после формы, ещё не решено]",
    },
  },
  media: {
    street: { assetId: "street-hero", alt: "" },
    poster: { assetId: "street-poster", alt: "" },
    phonePortrait: { assetId: "phone-portrait", alt: "" },
    phoneLandscape: { assetId: "phone-landscape", alt: "" },
    flowersMacro: { assetId: "flowers-macro", alt: "" },
    flowersBouquet: { assetId: "flowers-bouquet", alt: "" },
    flowersWorld: { assetId: "flowers-world", alt: "" },
    flowersSlides: [
      { assetId: "flowers-slide-1", alt: "" },
      { assetId: "flowers-slide-2", alt: "" },
      { assetId: "flowers-slide-3", alt: "" },
      { assetId: "flowers-slide-4", alt: "" },
      { assetId: "flowers-slide-5", alt: "" },
      { assetId: "flowers-slide-6", alt: "" },
      { assetId: "flowers-slide-7", alt: "" },
      { assetId: "flowers-slide-8", alt: "" },
      { assetId: "flowers-slide-9", alt: "" },
    ],
    bakeryMacro: { assetId: "bakery-macro", alt: "" },
    bakeryCookie: { assetId: "bakery-cookie", alt: "" },
    bakeryDessert: { assetId: "bakery-dessert", alt: "" },
    bakerySlides: [
      { assetId: "bakery-slide-1", alt: "" },
      { assetId: "bakery-slide-2", alt: "" },
      { assetId: "bakery-slide-3", alt: "" },
      { assetId: "bakery-slide-4", alt: "" },
      { assetId: "bakery-slide-5", alt: "" },
      { assetId: "bakery-slide-6", alt: "" },
      { assetId: "bakery-slide-7", alt: "" },
      { assetId: "bakery-slide-8", alt: "" },
      { assetId: "bakery-slide-9", alt: "" },
      { assetId: "bakery-slide-10", alt: "" },
      { assetId: "bakery-slide-11", alt: "" },
      { assetId: "bakery-slide-12", alt: "" },
    ],
  },
};

export const ecpContent = defineContent({
  "immersive-stage": { stage },
});

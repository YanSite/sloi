import type { MediaRef } from "@/lib/types";

/**
 * Форма контента immersive-stage «Есть что показать» (`stage` в
 * `ImmersiveStageProps`). Объявлены через `type`, а не `interface`:
 * только type-alias структурно совместим с `Record<string, unknown>`,
 * который ожидает контракт секции.
 *
 * Все строки — из handoff-пакета (`docs/06_CONTENT_RU.md`, недостающие
 * подписи интерфейса — из прототипа). `draft: true` — формулировка
 * помечена в пакете как черновая: на сайте выглядит так же, но не финал.
 */

/** Фрагмент текста; `{ mark }` — слово с подчёркиванием акцентом. */
export type RichText = (string | { mark: string })[];

/** Экраны колоды по порядку: 0 — 01, 3 — поворот, 4 и 5 — оба проекта (блок 05). */
export type ScreenIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** `idx` — номер блока в меню (оба проекта — 05). */
export type NavLink = { label: string; idx: string; screen: ScreenIndex };

export type Sign = { first: RichText; second: string };

export type StoryRow = { cap: string; text: string };

/** Экран сайта-концепта в телефоне: цветочный магазин — страница с букетом. */
export type FlowerSite = {
  kind: "flowers";
  brand: string;
  cta: string;
  title: [string, string];
  lead: string;
  note: string;
};

/** Кафе-пекарня — три кадра сайта, сменяются «пролётом сквозь печенье». */
export type BakerySite = {
  kind: "bakery";
  warm: string[];
  dessertIndex: string;
  dessert: string[];
  hours: string;
  order: string;
  route: string;
};

export type CaseScreen = {
  /** Подпись над блоком и заголовок — только у первого проекта. */
  heading?: string;
  label: string;
  tag: string;
  title: string;
  story: StoryRow[];
  site: FlowerSite | BakerySite;
  draft: true;
};

/**
 * Сайт вымышленного заведения в телефоне на повороте — временное решение
 * (08_OPEN_QUESTIONS, п. 1, решение №23 стратегии), заменяемый модуль.
 */
export type TurnDemo = {
  name: string;
  hours: string;
  title: string;
  cta: string;
  gallery: string;
  todayCap: string;
  today: string[];
  domain: string;
};

export type Step = { cap: string; title: string; text: string };

/**
 * Файл медиа, уже разрешённый на сервере: только то, что нужно разметке.
 * `set` — версии оптимизатора изображений (WebP) по ширинам, от меньшей
 * к большей; `srcSet` — то же строкой для `<img>`.
 */
export type MediaFile = {
  src: string;
  width: number;
  height: number;
  alt: string;
  set: { w: number; url: string }[];
  srcSet: string;
};

export type EcpStageContent = {
  brand: {
    /** Логотип: три строки рядом с линией-знаком. */
    lines: string[];
    tagline: string;
    homeAria: string;
  };
  nav: {
    label: string;
    links: NavLink[];
    menuAria: { open: string; close: string };
    ticksLabel: string;
    /** Подпись точки справа на десктопе; `{n}` — номер экрана. */
    tickAria: string;
  };
  foot: {
    swipe: string;
    next: string;
    /** «Дальше · …» по экрану, с которого уходим. */
    nextTo: Partial<Record<ScreenIndex, string>>;
    total: string;
  };
  /** Подсказка жеста на 01 до первого свайпа (десктоп): колесо / свайп. */
  swipeHint: { touch: string; wheel: string };
  s01: { title: RichText; sub: string };
  s02: { title: string; signs: Sign[]; draft: true };
  s03: { title: RichText; sub: string; draft: true };
  s04: { title: string; after: string[]; demo: TurnDemo };
  cases: { capTitle: string; skip: string; screens: [CaseScreen, CaseScreen] };
  s06: {
    cap: string;
    title: string;
    steps: Step[];
    credit: { big: string; text: string };
    cta: string;
  };
  s07: {
    lines: [string, string];
    sure: string[];
    sureDraft: true;
    invite: string;
    cta: string;
    /** Заглушка: контакты не предоставлены (08_OPEN_QUESTIONS, п. 3). */
    contacts: string;
    privacy: { label: string; href: string };
  };
  media: {
    street: MediaRef;
    poster: MediaRef;
    phonePortrait: MediaRef;
    phoneLandscape: MediaRef;
    flowersMacro: MediaRef;
    flowersBouquet: MediaRef;
    flowersWorld: MediaRef;
    flowersSlides: MediaRef[];
    bakeryMacro: MediaRef;
    bakeryCookie: MediaRef;
    bakeryDessert: MediaRef;
    bakerySlides: MediaRef[];
  };
};

/** Медиа сцены по ключам `EcpStageContent.media` (списки — списками). */
export type ResolvedMedia = {
  [K in keyof EcpStageContent["media"]]: EcpStageContent["media"][K] extends MediaRef[]
    ? MediaFile[]
    : MediaFile;
};

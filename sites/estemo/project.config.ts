/**
 * Метаданные Site Instance — то, чего нет в SiteConfig и что не читает
 * ни один модуль core: дизайн-референс, preview-slug. Прототип наполнен
 * данными магазина цветов «Эстэмó» (Москва); источник — карточка в
 * Яндекс Картах и taplink.cc/estemore.
 */
export const estemoProject = {
  siteId: "estemo",
  businessName: "Эстэмó",
  designSource: "design-reference/florist-atelier/prototype.html",
  previewSlug: "estemo",
  rootRoute: false,
} as const;

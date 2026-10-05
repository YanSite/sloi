/**
 * Метаданные Site Instance — то, чего нет в SiteConfig и что не читает
 * ни один модуль core: дизайн-референс, preview-slug. Сайт агентства
 * «Есть что показать»; источник — handoff-пакет (прототип v31).
 */
export const ecpProject = {
  siteId: "est-chto-pokazat",
  businessName: "Есть что показать",
  designSource: "design-reference/est-chto-pokazat-site/reference/prototype/index.html",
  previewSlug: "est-chto-pokazat",
  rootRoute: false,
} as const;

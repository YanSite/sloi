/**
 * Метаданные Site Instance — то, чего нет в SiteConfig и что не читает
 * ни один модуль core: источник истины, дизайн-референс, preview-slug.
 */
export const flowerstimProject = {
  siteId: "flowerstim",
  businessName: "Эстетика цветов",
  sourceOfTruthUrl: "https://flowerstim.ru/",
  designSource: "design-reference/flowerstim/prototype.html",
  previewSlug: "flowerstim",
  rootRoute: false,
} as const;

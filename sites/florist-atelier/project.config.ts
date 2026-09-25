/**
 * Метаданные Site Instance — то, чего нет в SiteConfig и что не читает
 * ни один модуль core: дизайн-референс, preview-slug. Прототип не привязан
 * к конкретному магазину, поэтому источника истины о бизнесе у него нет.
 */
export const floristAtelierProject = {
  siteId: "florist-atelier",
  businessName: "Ателье цветов",
  designSource: "design-reference/florist-atelier/prototype.html",
  previewSlug: "florist-atelier",
  rootRoute: false,
} as const;

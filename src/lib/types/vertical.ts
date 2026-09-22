export const VERTICALS = [
  "florist",
  "restaurant",
  "barber",
  "beauty",
  "dental",
  "fitness",
  "automotive",
  "local-services",
] as const;

export type Vertical = (typeof VERTICALS)[number];

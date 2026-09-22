import type { MediaRef } from "./types";

export interface EditorialGridItem {
  media: MediaRef;
  caption?: string;
}

export interface EditorialGridProps {
  title?: string;
  items: EditorialGridItem[];
}

/** Asymmetric editorial image grid. Interface only. */
export function EditorialGrid(_props: EditorialGridProps) {
  return null;
}

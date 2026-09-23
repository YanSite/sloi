import type { MediaRef } from "./types";

export interface EditorialGridItem {
  media: MediaRef;
  caption?: string;
}

export interface EditorialGridProps {
  title?: string;
  items: EditorialGridItem[];
}

/** Асимметричный editorial-грид изображений. Пока только интерфейс. */
export function EditorialGrid(_props: EditorialGridProps) {
  return null;
}

import type { MediaRef } from "./types";

export interface CollectionShowcaseItem {
  id: string;
  name: string;
  media: MediaRef;
  href?: string;
}

export interface CollectionShowcaseProps {
  title: string;
  items: CollectionShowcaseItem[];
}

/** Грид товаров/услуг/коллекций для просмотра. Пока только интерфейс. */
export function CollectionShowcase(_props: CollectionShowcaseProps) {
  return null;
}

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

/** Browsable grid of products/services/collections. Interface only. */
export function CollectionShowcase(_props: CollectionShowcaseProps) {
  return null;
}

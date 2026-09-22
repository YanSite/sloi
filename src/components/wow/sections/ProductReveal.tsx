import type { CtaLink, MediaRef } from "./types";

export interface ProductRevealProps {
  title: string;
  description?: string;
  media: MediaRef;
  cta?: CtaLink;
}

/** Single hero product/offering moment. Interface only. */
export function ProductReveal(_props: ProductRevealProps) {
  return null;
}

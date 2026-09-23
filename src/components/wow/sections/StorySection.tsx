import type { MediaRef } from "./types";

export interface StorySectionProps {
  eyebrow?: string;
  title: string;
  body: string;
  media?: MediaRef;
}

/** Момент повествования о бренде/основателе. Пока только интерфейс. */
export function StorySection(_props: StorySectionProps) {
  return null;
}

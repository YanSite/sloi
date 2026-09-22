import type { MediaRef } from "./types";

export interface StorySectionProps {
  eyebrow?: string;
  title: string;
  body: string;
  media?: MediaRef;
}

/** Brand/founder narrative moment. Interface only. */
export function StorySection(_props: StorySectionProps) {
  return null;
}

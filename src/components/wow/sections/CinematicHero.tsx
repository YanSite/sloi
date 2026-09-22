import type { CtaLink, MediaRef } from "./types";

export interface CinematicHeroProps {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  media: MediaRef;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
}

/** Full-bleed opening statement. Interface only — visual design pending. */
export function CinematicHero(_props: CinematicHeroProps) {
  return null;
}

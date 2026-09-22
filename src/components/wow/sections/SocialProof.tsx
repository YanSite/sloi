export interface Testimonial {
  quote: string;
  author: string;
  source?: string;
}

export interface SocialProofProps {
  title?: string;
  testimonials: Testimonial[];
}

/** Reviews/testimonials/trust signals. Interface only. */
export function SocialProof(_props: SocialProofProps) {
  return null;
}

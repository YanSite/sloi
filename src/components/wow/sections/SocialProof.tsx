export interface Testimonial {
  quote: string;
  author: string;
  source?: string;
}

export interface SocialProofProps {
  title?: string;
  testimonials: Testimonial[];
}

/** Отзывы/testimonials/сигналы доверия. Пока только интерфейс. */
export function SocialProof(_props: SocialProofProps) {
  return null;
}

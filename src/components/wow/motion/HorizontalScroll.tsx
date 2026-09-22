import type { ReactNode } from "react";

export interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

/**
 * `horizontal scroll` primitive. Pure CSS scroll-snap — no JS, works
 * natively with touch, trackpad, and keyboard. Reduced-motion visitors
 * keep the snap (it's navigational, not decorative) but lose the smooth
 * scroll-behavior animation.
 */
export function HorizontalScroll({ children, className = "" }: HorizontalScrollProps) {
  return (
    <div
      className={`flex snap-x snap-mandatory overflow-x-auto scroll-smooth motion-reduce:scroll-auto ${className}`}
    >
      {children}
    </div>
  );
}

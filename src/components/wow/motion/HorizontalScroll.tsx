import type { ReactNode } from "react";

export interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

/**
 * Примитив `horizontal scroll`. Чистый CSS scroll-snap — без JS, нативно
 * работает с touch, трекпадом и клавиатурой. У посетителей с
 * reduced-motion snap сохраняется (это навигация, а не украшение), но
 * пропадает плавная анимация scroll-behavior.
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

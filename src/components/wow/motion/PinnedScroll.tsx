import type { CSSProperties, ReactNode } from "react";

export interface PinnedScrollProps {
  children: ReactNode;
  /** Дополнительная дистанция скролла для пина, как кратное высоты вьюпорта. 1.5–2.5 типично для одного момента вроде Product Reveal. */
  scrollLengthVh?: number;
  className?: string;
}

/**
 * Примитив `pinned scroll`. Чистый CSS `position: sticky` — не нужен
 * scroll-listener просто чтобы удержать контент на месте, поэтому сам
 * пин работает даже с отключённым JS. Сочетайте с `Parallax` и
 * `scaleRange` внутри для ощущения «camera dolly» во время пина
 * (Signature WOW Moment #2).
 */
export function PinnedScroll({
  children,
  scrollLengthVh = 200,
  className = "",
}: PinnedScrollProps) {
  const trackStyle: CSSProperties = { height: `${scrollLengthVh}vh` };
  return (
    <div style={trackStyle} className="relative">
      <div className={`sticky top-0 h-screen overflow-hidden relative ${className}`}>
        {children}
      </div>
    </div>
  );
}

import type { CSSProperties, ReactNode } from "react";

export interface PinnedScrollProps {
  children: ReactNode;
  /** Extra scroll distance given to the pin, as a multiple of viewport height. 1.5–2.5 is typical for a single beat like Product Reveal. */
  scrollLengthVh?: number;
  className?: string;
}

/**
 * `pinned scroll` primitive. Pure CSS `position: sticky` — no scroll
 * listener needed just to hold content in place, so pinning itself works
 * even with JS disabled. Pair a `Parallax` with `scaleRange` inside for
 * the "camera dolly" feel while pinned (Signature WOW Moment #2).
 */
export function PinnedScroll({ children, scrollLengthVh = 200, className = "" }: PinnedScrollProps) {
  const trackStyle: CSSProperties = { height: `${scrollLengthVh}vh` };
  return (
    <div style={trackStyle} className="relative">
      <div className={`sticky top-0 h-screen overflow-hidden relative ${className}`}>{children}</div>
    </div>
  );
}

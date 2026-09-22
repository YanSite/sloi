"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionCapability } from "./capability";

export interface ParallaxProps {
  children: ReactNode;
  /** Scroll-speed multiplier: 0 = fixed to viewport, 1 = moves at page speed. Lower feels "further back." Typical 0.1–0.4. */
  speed?: number;
  /**
   * Optional camera-like zoom — interpolates scale across this range as
   * the element crosses the viewport. This is what turns plain parallax
   * into the "camera dolly" feel behind Signature WOW Moment #2, without
   * a separate primitive: it's still one scroll-linked transform.
   */
  scaleRange?: [number, number];
  className?: string;
}

/**
 * `parallax` and `camera-like movement` in one primitive. Passive
 * scroll listener + rAF-throttled update, writing directly to a CSS
 * custom property on the node (not React state) so scrolling never
 * triggers a re-render. Skips attaching any listener at all when motion
 * is disabled or the device is coarse-pointer/mobile (requirement 6) —
 * the element just renders static via `motion-reduce:transform-none`.
 */
export function Parallax({ children, speed = 0.3, scaleRange, className = "" }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { enabled, simplify } = useMotionCapability();

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled || simplify) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = node.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const distanceFromCenter = rect.top + rect.height / 2 - viewportCenter;
      node.style.setProperty("--parallax-offset", `${distanceFromCenter * speed * -1}px`);
      if (scaleRange) {
        const [min, max] = scaleRange;
        const span = window.innerHeight / 2 + rect.height / 2;
        const progress = Math.min(1, Math.max(0, 1 - Math.abs(distanceFromCenter) / span));
        node.style.setProperty("--parallax-scale", (min + (max - min) * progress).toFixed(4));
      }
    };
    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [enabled, simplify, speed, scaleRange]);

  return (
    <div
      ref={ref}
      className={`will-change-transform motion-reduce:!transform-none ${className}`}
      style={{
        transform: "translateY(var(--parallax-offset, 0px)) scale(var(--parallax-scale, 1))",
      }}
    >
      {children}
    </div>
  );
}

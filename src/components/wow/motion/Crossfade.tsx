"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useMotionCapability } from "./capability";

export interface CrossfadeProps {
  children: ReactNode;
  /** Background color the fade transitions FROM. Defaults to transparent. */
  from?: string;
  /** Background color the fade transitions TO — typically the page's `ThemeTokens.colors.background`. */
  to: string;
  /** Seconds. */
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * `crossfade` primitive — the "emerge from black" bookend transition
 * behind Signature WOW Moment #3 (Final CTA). Cross-fades a wrapping
 * element's background color the first time it scrolls into view; no
 * WebGL, just a timed `background-color` transition.
 *
 * Reduced-motion / disabled: renders directly at `to`, transition-free —
 * there is no scroll-triggered intersection state to reach in the first
 * place, so there's nothing to skip past.
 */
export function Crossfade({ children, from = "transparent", to, duration = 1.2, className = "", style }: CrossfadeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const { enabled } = useMotionCapability();

  useEffect(() => {
    if (!enabled) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);

  const backgroundColor = !enabled ? to : active ? to : from;

  return (
    <div
      ref={ref}
      style={{
        ...style,
        backgroundColor,
        transitionProperty: "background-color",
        transitionDuration: `${duration}s`,
      }}
      className={className}
    >
      {children}
    </div>
  );
}

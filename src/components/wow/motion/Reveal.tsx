"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type RevealStyle = "fade" | "fade-up" | "scale-in";

export interface RevealProps {
  children: ReactNode;
  revealStyle?: RevealStyle;
  /** Seconds. */
  duration?: number;
  /** Seconds. */
  delay?: number;
  /**
   * "mount": animate immediately on mount, via a pure CSS `@keyframes`
   * animation — no JS dependency, safe for above-the-fold content (Hero).
   * "scroll" (default): animate the first time the element enters the
   * viewport, via IntersectionObserver.
   */
  trigger?: "mount" | "scroll";
  className?: string;
}

const animateClass: Record<RevealStyle, string> = {
  fade: "animate-reveal-fade",
  "fade-up": "animate-reveal-fade-up",
  "scale-in": "animate-reveal-scale-in",
};

const hiddenClass: Record<RevealStyle, string> = {
  fade: "opacity-0",
  "fade-up": "opacity-0 translate-y-6",
  "scale-in": "opacity-0 scale-95",
};

const revealedClass: Record<RevealStyle, string> = {
  fade: "data-[revealed=true]:opacity-100",
  "fade-up": "data-[revealed=true]:opacity-100 data-[revealed=true]:translate-y-0",
  "scale-in": "data-[revealed=true]:opacity-100 data-[revealed=true]:scale-100",
};

/**
 * `reveal` / `fade` / `scale` primitives in one component — three
 * closely related enter-transitions, not three separate primitives with
 * duplicated trigger logic. Full reduced-motion fallback: every
 * rendered path always carries `motion-reduce:opacity-100
 * motion-reduce:translate-y-0 motion-reduce:scale-100
 * motion-reduce:animate-none`, a pure CSS media query that wins
 * regardless of whether this component's JS has run yet.
 */
export function Reveal({
  children,
  revealStyle = "fade-up",
  duration = 0.7,
  delay = 0,
  trigger = "scroll",
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (trigger === "mount") return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [trigger]);

  const timing = { animationDuration: `${duration}s`, animationDelay: `${delay}s` };

  if (trigger === "mount") {
    return (
      <div
        ref={ref}
        style={timing}
        className={`${animateClass[revealStyle]} motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100 ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-revealed={revealed ? "true" : undefined}
      style={{ transitionDuration: `${duration}s`, transitionDelay: `${delay}s` }}
      className={`transition-[opacity,transform] ease-out ${hiddenClass[revealStyle]} ${revealedClass[revealStyle]} motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:transition-none ${className}`}
    >
      {children}
    </div>
  );
}

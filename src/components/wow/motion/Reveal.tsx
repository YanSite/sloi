"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type RevealStyle = "fade" | "fade-up" | "scale-in";

export interface RevealProps {
  children: ReactNode;
  revealStyle?: RevealStyle;
  /** Секунды. */
  duration?: number;
  /** Секунды. */
  delay?: number;
  /**
   * "mount": анимируется сразу при монтировании через чистую CSS
   * `@keyframes` анимацию — без зависимости от JS, безопасно для контента
   * над сгибом (Hero). "scroll" (по умолчанию): анимируется при первом
   * появлении элемента во вьюпорте, через IntersectionObserver.
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
 * `reveal` / `fade` / `scale` в одном компоненте — три близких
 * enter-перехода, а не три отдельных примитива с дублированной логикой
 * триггера. Полный fallback на reduced-motion: любой из путей рендера
 * всегда несёт `motion-reduce:opacity-100 motion-reduce:translate-y-0
 * motion-reduce:scale-100 motion-reduce:animate-none` — чистый CSS
 * media query, который побеждает независимо от того, успел ли
 * отработать JS этого компонента.
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
      { threshold: 0.2 },
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

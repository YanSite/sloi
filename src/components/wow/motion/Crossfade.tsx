"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useMotionCapability } from "./capability";

export interface CrossfadeProps {
  children: ReactNode;
  /** Цвет фона, ИЗ которого идёт переход. По умолчанию — прозрачный. */
  from?: string;
  /** Цвет фона, К которому идёт переход — обычно `ThemeTokens.colors.background` страницы. */
  to: string;
  /** Секунды. */
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Примитив `crossfade` — bookend-переход «проявление из темноты» за
 * Signature WOW Moment #3 (Final CTA). Меняет цвет фона обёртки при
 * первом появлении в вьюпорте; без WebGL, просто таймированный переход
 * `background-color`.
 *
 * Reduced-motion / отключённый motion: рендерится сразу в `to`, без
 * перехода — состояния scroll-triggered intersection в принципе не
 * возникает, поэтому и пропускать нечего.
 */
export function Crossfade({
  children,
  from = "transparent",
  to,
  duration = 1.2,
  className = "",
  style,
}: CrossfadeProps) {
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
      { threshold: 0.15 },
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

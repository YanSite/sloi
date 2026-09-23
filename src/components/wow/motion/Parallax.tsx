"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionCapability } from "./capability";

export interface ParallaxProps {
  children: ReactNode;
  /** Множитель скорости скролла: 0 = зафиксирован относительно вьюпорта, 1 = движется со скоростью страницы. Меньше значение — эффект «дальше». Обычно 0.1–0.4. */
  speed?: number;
  /**
   * Опциональный zoom в духе движения камеры — интерполирует scale по
   * этому диапазону, пока элемент пересекает вьюпорт. Именно это
   * превращает обычный parallax в ощущение «camera dolly» за Signature
   * WOW Moment #2, без отдельного примитива: это по-прежнему один
   * scroll-linked transform.
   */
  scaleRange?: [number, number];
  className?: string;
}

/**
 * `parallax` и «движение камеры» в одном примитиве. Пассивный scroll-
 * listener + rAF-throttled обновление, пишущее напрямую в CSS custom
 * property на узле (а не в React state), чтобы скролл никогда не вызывал
 * ре-рендер. Вообще не навешивает listener, если motion отключён или
 * устройство с coarse-pointer/мобильное — элемент просто рендерится
 * статично через `motion-reduce:transform-none`.
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

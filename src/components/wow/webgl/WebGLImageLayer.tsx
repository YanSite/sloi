"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import * as THREE from "three";
import { useMotionCapability } from "@/components/wow/motion";
import { isWebGLAvailable } from "./support";
import { createGradientTexture } from "./gradient-texture";
import { ImageLayerScene, type ImageLayerConfig } from "./scene";

export interface WebGLImageLayerProps {
  /** Плейсхолдерные цвета градиента — вместо реальной фотографии из MediaRef. */
  from: string;
  to: string;
  depth?: number;
  scaleRange?: ImageLayerConfig["scaleRange"];
  className?: string;
  /** Рендерится вместо canvas всегда, когда WebGL не используется — не поддерживается, reduced-motion, упрощённый режим/мобильный, либо runtime-сбой. Это CSS/image-реализация, а не спиннер загрузки. */
  fallback: ReactNode;
}

/**
 * WebGL как ENHANCEMENT: первая отрисовка, серверная или клиентская,
 * всегда fallback (`useWebGL` может стать true только после того, как
 * `hasMounted` переключится после гидратации), поэтому медленный или
 * отсутствующий WebGL-слой никогда не блокирует и не задерживает
 * реальный контент. Canvas монтируется, а Three.js инициализируется,
 * только в эффекте ниже, когда уже выполнены все условия — ленивая
 * инициализация по конструкции, а не через отдельный флаг.
 *
 * Разрешён только для Cinematic Hero и Product Reveal согласно
 * /docs/visual-dna.md — Final CTA этот компонент не использует.
 */
export function WebGLImageLayer({
  from,
  to,
  depth = 0.2,
  scaleRange,
  className = "",
  fallback,
}: WebGLImageLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { enabled, simplify } = useMotionCapability();

  // "Mounted" как подписка со снэпшотом, который отличается только между
  // сервером (false) и клиентом (true) — идиоматичный способ включить
  // client-only feature detection без hydration mismatch и без вывода
  // состояния через setState-in-effect.
  const hasMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Прежде чем canvas вообще отрендерится, должны выполниться все условия
  // (смонтирован, motion включён на сайте/в ОС, не упрощённое
  // coarse-pointer устройство, реальный WebGL-контекст доступен).
  // Вычисляется во время рендера, а не через effect + setState —
  // isWebGLAvailable() сама по себе безопасна для SSR (возвращает false
  // без `window`), поэтому её можно звать безусловно, как только
  // `hasMounted` подтвердит, что гидратация прошла.
  const [webGLFailed, setWebGLFailed] = useState(false);
  const useWebGL = hasMounted && enabled && !simplify && !webGLFailed && isWebGLAvailable();

  useEffect(() => {
    if (!useWebGL) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let scene: ImageLayerScene | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const texture = createGradientTexture(from, to);
      scene = new ImageLayerScene(renderer, texture, { depth, scaleRange });
      scene.resize(container.clientWidth, container.clientHeight);
    } catch {
      // Создание контекста или настройка упали по какой-то
      // environment-специфичной причине (проблема драйвера, контексты
      // исчерпаны, ...) — уходим на CSS fallback вместо того, чтобы
      // оставить сломанный canvas на экране. Если renderer успел
      // создаться до сбоя, освобождаем его.
      renderer?.dispose();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- реакция на синхронный сбой императивного вызова стороннего кода (`new THREE.WebGLRenderer`), узнать о котором можно только через try/catch; это не вывод состояния из пропсов.
      setWebGLFailed(true);
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      scene?.resize(width, height);
    });
    resizeObserver.observe(container);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const rect = container.getBoundingClientRect();
        const progress = 1 - Math.min(1, Math.max(0, rect.top / window.innerHeight));
        scene?.update(progress);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onContextLost = (event: Event) => {
      event.preventDefault();
      setWebGLFailed(true); // GPU-контекст потерян посреди сессии — уходим на fallback, а не рендерим пустоту.
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    return () => {
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      resizeObserver.disconnect();
      scene?.dispose();
    };
  }, [useWebGL, from, to, depth, scaleRange]);

  return (
    <div ref={containerRef} className={className}>
      {useWebGL ? <canvas ref={canvasRef} className="h-full w-full" /> : fallback}
    </div>
  );
}

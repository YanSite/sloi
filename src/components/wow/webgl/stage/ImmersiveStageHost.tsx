"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useMotionCapability } from "@/components/wow/motion";
import { isWebGLAvailable } from "../support";
import type { ThreeModule } from "./types";

export interface StageProgramContext {
  T: ThreeModule;
  canvas: HTMLCanvasElement;
  /** prefers-reduced-motion или kill switch сайта: без твинов, intro, курсор-камеры и дыхания. */
  reducedMotion: boolean;
  /** Coarse pointer (touch): ниже потолок DPR, другие размеры интерактива. */
  coarsePointer: boolean;
  /** Подписка на событие с автоматической отпиской при dispose программы. */
  on<K extends keyof WindowEventMap>(
    type: K,
    handler: (e: WindowEventMap[K]) => void,
    options?: AddEventListenerOptions,
  ): void;
  /** Регистрирует произвольный cleanup (например, отписку beat-контроллера). */
  onDispose(fn: () => void): void;
  /** true, как только host начал dispose — для асинхронных загрузок. */
  isDisposed(): boolean;
}

export interface StageProgram {
  /** Вызывается host'ом на каждом кадре с timestamp из requestAnimationFrame. */
  frame(now: number): void;
  /** Вызывается при resize окна и один раз сразу после создания. */
  resize(): void;
  /** Освобождает GPU-ресурсы; подписки из `ctx.on` host снимает сам. */
  dispose(): void;
}

export type StageProgramFactory = (ctx: StageProgramContext) => Promise<StageProgram>;

export interface ImmersiveStageHostProps {
  program: StageProgramFactory;
  /** Статичная реализация на случай, если WebGL недоступен или контекст потерян. */
  fallback: ReactNode;
  /** DOM-слой сцены (тексты, CTA, выноски) — рендерится на сервере, программа управляет им через refs. */
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  canvasLayerStyle?: CSSProperties;
}

/**
 * IMMERSIVE STAGE HOST — жизненный цикл полноэкранной WebGL-сцены,
 * управляемой одной «программой» (хореографией конкретного сайта).
 * Host не знает, что именно рендерится: он
 *
 * - рендерит DOM-слой на сервере (контент доступен без JS и индексируется);
 * - после гидратации проверяет WebGL и только тогда динамически грузит
 *   three.js и запускает программу — ленивая инициализация;
 * - ведёт requestAnimationFrame и resize, снимает все подписки при unmount;
 * - при отсутствии WebGL, сбое создания или потере контекста переключается
 *   на `fallback`.
 *
 * В отличие от `WebGLImageLayer` (enhancement поверх готовой секции),
 * здесь WebGL — сама сцена: reduced-motion не выключает её, а передаётся
 * программе, которая убирает движение, сохраняя композицию.
 */
export function ImmersiveStageHost({
  program,
  fallback,
  children,
  className,
  style,
  canvasLayerStyle,
}: ImmersiveStageHostProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { enabled, simplify } = useMotionCapability();
  const hasMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [failed, setFailed] = useState(false);
  const unsupported = hasMounted && !isWebGLAvailable();
  const showFallback = failed || unsupported;

  useEffect(() => {
    if (!hasMounted || showFallback) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let raf = 0;
    let instance: StageProgram | null = null;
    const cleanups: (() => void)[] = [];

    const ctxBase = {
      canvas,
      reducedMotion: !enabled,
      coarsePointer: simplify,
      on<K extends keyof WindowEventMap>(
        type: K,
        handler: (e: WindowEventMap[K]) => void,
        options?: AddEventListenerOptions,
      ) {
        window.addEventListener(type, handler, options);
        cleanups.push(() => window.removeEventListener(type, handler, options));
      },
      onDispose(fn: () => void) {
        cleanups.push(fn);
      },
      isDisposed: () => disposed,
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    (async () => {
      try {
        const T = await import("three");
        if (disposed) return;
        const created = await program({ ...ctxBase, T });
        if (disposed) {
          created.dispose();
          return;
        }
        instance = created;
        created.resize();
        const onResize = () => created.resize();
        window.addEventListener("resize", onResize);
        cleanups.push(() => window.removeEventListener("resize", onResize));
        const loop = (now: number) => {
          raf = requestAnimationFrame(loop);
          created.frame(now);
        };
        raf = requestAnimationFrame(loop);
      } catch (error) {
        // Сбой создания контекста/сцены (драйвер, лимит контекстов) — уходим
        // на статичную реализацию вместо пустого canvas.
        console.error("[ImmersiveStage] WebGL stage failed, using fallback.", error);
        if (!disposed) setFailed(true);
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      cleanups.forEach((fn) => fn());
      instance?.dispose();
    };
  }, [hasMounted, showFallback, enabled, simplify, program]);

  if (showFallback) return <>{fallback}</>;

  return (
    <div className={className} style={style}>
      <div style={{ position: "fixed", inset: 0, zIndex: 0, ...canvasLayerStyle }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
      </div>
      {children}
    </div>
  );
}

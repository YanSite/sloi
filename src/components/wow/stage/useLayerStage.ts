"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { StageChoreography } from "@/lib/types";
import { StageNavigator, useMotionCapability } from "@/components/wow/motion";
import { LayerStage, type LayerStageFrame } from "./layer-stage";

export interface UseLayerStageOptions {
  /** Вызывается при смене варианта — чтобы React перерисовал контент варианта. */
  onVariantChange?: (variant: number) => void;
  /** Покадровый хук сайта (HUD, подписи) — после того, как слои записаны. */
  onFrame?: (frame: LayerStageFrame, root: HTMLElement) => void;
  /** Множитель курсорного параллакса. */
  parallax?: number;
}

/** Мобильные браузеры иногда не стартуют autoplay сразу — видео сцены периодически «подталкиваются». */
const VIDEO_KICK_MS = 1500;

/**
 * Жизненный цикл layer-stage: навигатор битов, rAF-цикл, resize, курсор,
 * автозапуск muted-видео и предекодирование изображений сцены. Сцена
 * рендерится сайтом (разметка на сервере), хук только оживляет её через
 * `rootRef`. Снимает все подписки и возвращает прокрутку документа при
 * unmount.
 */
export function useLayerStage(
  rootRef: RefObject<HTMLElement | null>,
  choreography: StageChoreography,
  options: UseLayerStageOptions = {},
): void {
  const { enabled } = useMotionCapability();
  const reducedMotion = !enabled;
  // Колбэки читаются через ref: цикл не перезапускается при каждом рендере сайта.
  const optsRef = useRef(options);
  useEffect(() => {
    optsRef.current = options;
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scrollable = choreography.scrollable;
    const navigator = new StageNavigator({
      beats: choreography.beats,
      transitions: choreography.transitions,
      baseDurationMs: choreography.baseDurationMs,
      input: choreography.input,
      scrollable: scrollable && {
        element: () => root.querySelector<HTMLElement>(`[data-l="${scrollable.id}"]`),
        atBeatP: scrollable.atBeatP,
      },
      onVariantChange: (v) => optsRef.current.onVariantChange?.(v),
    });
    const stage = new LayerStage(root, choreography, navigator, {
      reducedMotion,
      parallax: optsRef.current.parallax,
    });

    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const frame = stage.frame(now);
      optsRef.current.onFrame?.(frame, root);
    };
    raf = requestAnimationFrame(loop);

    const onPointer = (e: PointerEvent) => stage.pointerMove(e.clientX, e.clientY);
    const onResize = () => stage.build();
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", onResize);
    const detach = navigator.attach();

    const kickVideos = () =>
      root.querySelectorAll("video").forEach((v) => {
        v.muted = true;
        v.defaultMuted = true;
        v.playsInline = true;
        if (v.paused) v.play().catch(() => {});
      });
    kickVideos();
    const videoTimer = window.setInterval(kickVideos, VIDEO_KICK_MS);
    root.querySelectorAll("img").forEach((img) => {
      img.decode().catch(() => {});
    });

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(videoTimer);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      detach();
    };
  }, [rootRef, choreography, reducedMotion]);
}

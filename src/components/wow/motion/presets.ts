import type { MotionPreset } from "./types";

export interface MotionTiming {
  /** Секунды. */
  duration: number;
  /** Секунды. */
  delay: number;
}

/**
 * Тайминг по умолчанию для каждого именованного `MotionPreset` —
 * «намерение», которое секция получает через `MotionConfig.preset`
 * (например `"fade-up"`, `"camera-parallax"`), не обязательно указывая
 * `duration`/`delay` сама. Это lookup-таблица, а не диспетчер: секция
 * по-прежнему сама выбирает, какой примитив (`Reveal`, `Parallax`, ...)
 * использовать — здесь лишь подставляются разумные числа под имя preset.
 */
export const motionPresetTiming: Record<MotionPreset, MotionTiming> = {
  "fade-up": { duration: 0.7, delay: 0 },
  "fade-in": { duration: 0.6, delay: 0 },
  "stagger-children": { duration: 0.5, delay: 0.1 },
  "scale-in": { duration: 0.6, delay: 0 },
  "camera-parallax": { duration: 1.2, delay: 0 },
  "cross-fade": { duration: 1.2, delay: 0 },
};

const fallbackTiming: MotionTiming = { duration: 0.7, delay: 0 };

export function resolveMotionTiming(
  preset: MotionPreset | undefined,
  overrides?: { duration?: number; delay?: number },
): MotionTiming {
  const base = preset ? motionPresetTiming[preset] : fallbackTiming;
  return {
    duration: overrides?.duration ?? base.duration,
    delay: overrides?.delay ?? base.delay,
  };
}

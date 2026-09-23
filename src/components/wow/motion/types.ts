/**
 * Канонические определения перенесены в `@/lib/types` — MotionConfig
 * нужен и SiteConfig, поэтому он не может жить только внутри папки
 * компонентов. Реэкспортируется здесь, чтобы существующие импорты
 * `motion.types` продолжали работать. Отдельная библиотека анимаций не
 * подключена и не нужна — motion строится на Tailwind CSS
 * transitions/animations и нативных браузерных API (IntersectionObserver,
 * matchMedia, requestAnimationFrame), см. примитивы в этой директории.
 */
export type { MotionPreset, MotionConfig } from "@/lib/types";

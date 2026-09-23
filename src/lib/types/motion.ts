/**
 * Слой MOTION.
 * Вертикально-нейтральный словарь анимаций — слаг
 * `VisualDNA.motionPersonality` (например "gravity-drift") выбирает
 * среди этих presets, а не определяет новые под конкретный бизнес.
 * Реэкспортируется из `@/components/wow/motion` для удобства импорта;
 * канонически определён здесь.
 */
export const MOTION_PRESETS = [
  "fade-up",
  "fade-in",
  "stagger-children",
  "scale-in",
  "camera-parallax",
  "cross-fade",
] as const;

/**
 * - "camera-parallax": scroll-linked scale/translate одного-двух image-слоёв
 *   — только для двух именованных Signature WOW builds, см.
 *   /docs/visual-dna.md#webgl-language.
 * - "cross-fade": таймированный переход opacity/цвета фона сцены —
 *   bookend Final CTA, см. /docs/visual-dna.md#transition-language.
 */
export type MotionPreset = (typeof MOTION_PRESETS)[number];

export interface MotionConfig {
  preset: MotionPreset;
  delay?: number;
  duration?: number;
}

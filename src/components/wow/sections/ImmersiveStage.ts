import type { AssetManifest, MotionConfig, ThemeTokens, VisualDNA } from "@/lib/types";

/**
 * Контракт секции `immersive-stage` — полноэкранной WebGL-сцены, которая
 * занимает всю страницу: несколько 3D-сцен, сведённых одним
 * композитором, навигация beat'ами вместо нативного скролла, DOM-слой
 * поверх canvas (см. `ImmersiveStageHost` и примитивы в
 * `@/components/wow/webgl/stage`).
 *
 * У этой секции нет core-реализации: хореография камеры и сцен у каждого
 * сайта своя, поэтому реализацию регистрирует Site Instance через
 * `SiteConfig.sectionVariants`, собирая её из generic stage-примитивов.
 * Core фиксирует только форму пропсов.
 *
 * `stage` — весь авторский контент сцены (тексты, ссылки, `MediaRef` на
 * ассеты); его форму определяет реализация сайта через параметр `C`.
 * `MediaRef` внутри `stage` проверяются валидацией так же, как в любой
 * другой секции.
 */
export interface ImmersiveStageProps<C extends Record<string, unknown> = Record<string, unknown>> {
  stage: C;
  assets: AssetManifest;
  theme: ThemeTokens;
  visualDNA?: VisualDNA;
  motion?: MotionConfig;
}

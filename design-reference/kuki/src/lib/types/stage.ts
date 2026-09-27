import type { MediaRef } from "./media-ref";

/**
 * NEW ENGINE CAPABILITY — слой IMMERSIVE STAGE.
 *
 * Вертикально-нейтральное описание одной непрерывной «съёмочной
 * площадки»: набор слоёв, управляемых одним прогрессом `p ∈ [0, 1]`,
 * и список «битов» — остановок камеры, между которыми пользователь
 * переходит ровно одним жестом (свайп / колесо / тачпад / клавиша).
 *
 * Никаких имён бизнеса или вертикали здесь нет: конкретная хореография
 * живёт в `src/config/verticals/<slug>/choreography.ts`.
 *
 * Единицы: x — vw, y — vh (смещение центра слоя от центра вьюпорта),
 * s — scale, o — opacity 0..1, b — blur в px (движок клампит до 8),
 * h — «дымка» 0..1 (contrast(1 − 0.32h) brightness(1 − 0.12h)).
 */
export interface StageTransform {
  x?: number;
  y?: number;
  s?: number;
  o?: number;
  b?: number;
  h?: number;
}

/** [p, значения]. Незаданные поля наследуются от предыдущего ключа (carry-forward). Интерполяция внутри сегмента — smoothstep. */
export type StageKeyframe = [p: number, value: StageTransform];

/** Только opacity: [p, o]. Интерполяция — smoothstep. */
export type StageOpacityTrack = [p: number, o: number][];

export type StageLayerKind = "media" | "fill" | "text" | "dom";

export interface StageLayer {
  id: string;
  kind: StageLayerKind;
  /** Фото (poster). Для kind "media". */
  media?: MediaRef;
  /** Видео поверх `media`; `media` служит poster/fallback. */
  video?: MediaRef;
  /** CSS background для kind "fill" (градиенты студии). */
  fill?: string;
  /** Сила курсорного параллакса: x += ptr.x·depth (px на 1vw), y += ptr.y·depth·0.6. */
  depth?: number;
  /** Амплитуда «дыхания»: y += sin(t·0.6 + variant·2)·0.35vh·breathe. Отключается при reduced motion. */
  breathe?: number;
  keyframes?: StageKeyframe[];
  /** Отдельная хореография для портретного вьюпорта (w/h < 0.8). */
  keyframesPortrait?: StageKeyframe[];
  opacity?: StageOpacityTrack;
  /** Слой виден только когда активен этот вариант (продукт). */
  variant?: number;
  /** Слой-потомок: рендерится только пока видим родитель. */
  nestedIn?: string;
  /** Принимает клики, когда o > 0.5. */
  interactive?: boolean;
  /** Размер слоя: CSS width/height (по умолчанию 100vw × 100vh). */
  size?: { width: string; height: string };
  /** Статичный CSS слоя (mask-image, clip-path, drop-shadow, фон-подложка). Не анимируется. */
  style?: Record<string, string>;
  /** Перекрашиваемые фоны по варианту (crossfade 0.5s). */
  variantFills?: string[];
}

/** Остановка камеры. `variant` — какой продукт активен на этом бите. */
export interface StageBeat {
  p: number;
  variant?: number;
  scene: string;
  label: string;
}

/**
 * Правила переходов между битами. Проверяются по порядку, первое
 * совпавшее побеждает; иначе — "tween".
 *
 * - tween: p анимируется from → to, easeInOutCubic,
 *   длительность = base·(1 + min(0.6, |Δp|·1.5)).
 * - dip: вуаль цвета `veil` smoothstep 0→1 за первую половину, в середине
 *   p прыгает на цель (и меняется variant), затем вуаль 1→0. Длительность base·factor.
 * - slide: все слои уезжают вбок: shift = ∓dir·a·shiftVw·(1 + depth/60),
 *   a = cubic in (первая половина) / cubic out (вторая), в середине —
 *   прыжок p и смена variant. Длительность base·factor.
 */
export type StageTransitionRule =
  | { kind: "dip"; between: [number, number]; veil: string; factor: number }
  | { kind: "slide"; when: "variant-change"; shiftVw: number; factor: number };

/** Подпись, привязанная к точке кадра (в % вьюпорта). */
export interface StageAnnotation {
  label: string;
  x: number;
  y: number;
  variant: number;
  /** Окно видимости: smoothstep(in[0], in[1]) · (1 − smoothstep(out[0], out[1])). */
  in: [number, number];
  out: [number, number];
}

/** Перекраска HUD (верхняя/нижняя панели) в тёмный цвет на светлых кадрах. */
export interface StageInkRule {
  from: number;
  to: number;
  variant?: number;
  ink: string;
}

export interface StagePost {
  /** Плёночное зерно: opacity, mix-blend overlay, джиттер ±30px каждый кадр. */
  grain: number;
  vignette: string;
}

export interface StageInput {
  /** Порог свайпа по тачу, px. */
  touchThresholdPx: number;
  /** Накопленный deltaY колеса/тачпада для одного шага. */
  wheelThreshold: number;
  /** Пауза между событиями колеса, после которой жест считается новым, ms (обычные / вариантные биты). */
  gestureGapMs: [number, number];
  /** Id слоя со своим внутренним скроллом (жест сначала прокручивает его). */
  scrollableLayer?: string;
}

export interface StageChoreography {
  /** Базовая длительность перехода, ms. */
  baseDurationMs: number;
  /** Сглаживание слоёв к целевому значению: 1 − exp(−dt·k). */
  followDamping: number;
  /** Сглаживание курсора: 1 − exp(−dt·k). */
  pointerDamping: number;
  beats: StageBeat[];
  transitions: StageTransitionRule[];
  layers: StageLayer[];
  annotations: StageAnnotation[];
  ink: { default: string; rules: StageInkRule[] };
  post: StagePost;
  input: StageInput;
}

/**
 * Копирайт сцены. Каждое поле привязано к DOM-слою хореографии по id
 * (в скобках). Сцена не знает бизнеса — только эти generic-слоты.
 */
export interface StageLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface StageVariant {
  /** Латиницей/капсом для HUD и индекса, например "OREO". */
  code: string;
  title: string;
  description: string;
  /** Ассет пэкшота для меню. */
  packshot: { assetId: string; alt?: string };
}

export interface StageCopy {
  /** (title) строки крупного заголовка + строка-подпись под ним. */
  title: { lines: string[]; sub?: string };
  /** (s01-meta) правый верхний угол первого кадра. */
  meta?: string[];
  /** (tagline) */
  tagline?: string[];
  /** (hint) */
  hint?: string;
  /** (hud-brand, hud-order) */
  hud: { brand: string; order: StageLink };
  /** (inside-text) */
  interlude?: { eyebrow: string; headline: string };
  /** (states-rail) подписи трёх состояний варианта. */
  states: string[];
  /** (menu) */
  menu: { eyebrow: string; headline: string; cta: StageLink };
  /** (visit) */
  visit: { fields: { label: string; value: string; href?: string }[]; primary: StageLink; secondary: StageLink };
}


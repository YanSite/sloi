/**
 * Слой LAYER STAGE — вертикально-нейтральное описание полноэкранной
 * сцены из DOM-слоёв, которыми управляет один прогресс `p ∈ [0, 1]`.
 * Навигация идёт по «битам» — остановкам камеры, между которыми
 * пользователь переходит ровно одним жестом (колесо / трекпад / свайп /
 * клавиша). Реализация — `@/components/wow/stage`.
 *
 * Здесь нет ни имён бизнеса, ни вертикали: конкретная хореография живёт
 * в Site Instance (`sites/<slug>/choreography.ts`).
 *
 * Единицы: x — vw, y — vh (смещение центра слоя от центра вьюпорта),
 * s — scale, o — opacity 0..1, b — blur в px (рантайм клампит до 8),
 * h — «дымка» 0..1: contrast(1 − 0.32h) brightness(1 − 0.12h).
 */
export interface StageTransform {
  x?: number;
  y?: number;
  s?: number;
  o?: number;
  b?: number;
  h?: number;
}

/** [p, значения]. Незаданные поля наследуются от предыдущего ключа; внутри сегмента — smoothstep. */
export type StageKeyframe = [p: number, value: StageTransform];

/** Только opacity: [p, o], smoothstep между ключами. */
export type StageOpacityTrack = [p: number, o: number][];

/**
 * Один DOM-слой сцены. Сам элемент рендерит сайт и помечает атрибутом
 * `data-l="<id>"`; рантайм находит его и каждый кадр пишет transform,
 * filter, opacity и visibility. Слой с `keyframes` центрируется через
 * `translate(-50%, -50%)` — элементу нужны `left: 50%; top: 50%`.
 */
export interface StageLayerSpec {
  id: string;
  keyframes?: StageKeyframe[];
  /** Хореография для портретного вьюпорта (w/h < `portraitMaxAspect`). */
  keyframesPortrait?: StageKeyframe[];
  /** Слой без движения — только opacity. Игнорируется, если есть `keyframes`. */
  opacity?: StageOpacityTrack;
  /** Курсорный параллакс: x += ptr.x·depth px, y += ptr.y·depth·0.6 px; также усиливает slide-сдвиг. */
  depth?: number;
  /** «Дыхание»: y += sin(t·0.6 + breathePhase)·0.35vh·breathe. Выключается при reduced motion. */
  breathe?: number;
  breathePhase?: number;
  /** Слой виден только пока активен этот вариант (продукт). */
  variant?: number;
  /** Вложенный слой: своей opacity нет, transform пишется, только пока виден родитель. */
  nestedIn?: string;
  /** Принимает клики, только когда o > 0.5. */
  interactive?: boolean;
}

/** Остановка камеры; `variant` — какой продукт активен на этом бите. */
export interface StageBeat {
  p: number;
  variant?: number;
}

/**
 * Правила переходов между битами; иначе — "tween" (p анимируется
 * easeInOutCubic за base·(1 + min(0.6, |Δp|·1.5))).
 *
 * - dip: между битами с прогрессом `between` (в любую сторону). Вуаль
 *   smoothstep 0 → 1 → 0, в середине p прыгает на цель. Длительность base·factor.
 * - slide: при смене варианта. Слои уезжают вбок: shift = ∓dir·a·shiftVw·(1 + depth/60),
 *   a = cubic in / cubic out по половинам, в середине — прыжок p и смена варианта.
 */
export type StageTransitionRule =
  | { kind: "dip"; between: [number, number]; factor: number }
  | { kind: "slide"; shiftVw: number; factor: number };

/** Пороги ввода. Незаданные берутся из значений по умолчанию навигатора. */
export interface StageInputTuning {
  /** Накопленная дельта колеса для одного шага. */
  wheelThreshold?: number;
  /** Пауза между событиями колеса, после которой жест новый, ms: [обычные биты, биты варианта]. */
  gestureGapMs?: [number, number];
  /** Вертикальный свайп для шага, px. */
  touchThresholdPx?: number;
  /** Доля tween, после которой новый шаг принимается сразу, а не в очередь. */
  lateAcceptFraction?: number;
}

/** Слой со своим внутренним скроллом: на бите `atBeatP` жест сначала прокручивает его. */
export interface StageScrollableLayer {
  id: string;
  atBeatP: number;
}

export interface StageChoreography {
  /** Базовая длительность перехода, ms. */
  baseDurationMs: number;
  /** Сглаживание слоёв к цели: 1 − e^(−k·dt). */
  followDamping: number;
  /** Сглаживание курсора: 1 − e^(−k·dt). */
  pointerDamping: number;
  /** Вьюпорт уже этого соотношения w/h — портретная хореография. */
  portraitMaxAspect: number;
  beats: StageBeat[];
  transitions: StageTransitionRule[];
  layers: StageLayerSpec[];
  scrollable?: StageScrollableLayer;
  input?: StageInputTuning;
}

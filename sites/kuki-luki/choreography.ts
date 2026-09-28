import type { StageChoreography, StageKeyframe, StageLayerSpec } from "@/lib/types";

/**
 * Хореография Куки Луки — все значения сняты 1:1 с утверждённого
 * прототипа (design-reference/kuki/reference/kuki-luki-prototype.dc.html,
 * метод build() и BEATS). Id слоёв совпадают с `data-l` прототипа.
 * Если значение нужно поменять — сначала в прототипе.
 *
 * Варианты: 0 — Орео, 1 — Фрамбини, 2 — Киндер.
 *
 * Сцена S03 «три печенья вместе» убрана заказчиком и не восстанавливается:
 * биты её пропускают (dip 0.33 → 0.57), а вырезки вкусов начинают жить с
 * p 0.535 — до этого они скрыты.
 */

const FLAVORS = [0, 1, 2] as const;

/** Параллакс-глубина вырезок: Орео ближе всех, Киндер дальше. */
const FLAVOR_DEPTH = [26, 14, 6];

/** «Целиком»: вырезка справа от подписи, лёгкий наезд, затем пролёт в текстуру. */
const WHOLE_TAIL: StageKeyframe[] = [
  [0.545, { x: 14, y: 3, s: 1.08, b: 0, o: 1, h: 0 }],
  [0.59, { x: 14, y: 3, s: 1.13 }],
  [0.62, { x: 8, y: 0, s: 3.2, b: 10, o: 0 }],
];
const WHOLE_TAIL_PORTRAIT: StageKeyframe[] = [
  [0.545, { x: 0, y: 14, s: 1.0, b: 0, o: 1, h: 0 }],
  [0.59, { y: 14, s: 1.05 }],
  [0.62, { y: 6, s: 2.8, b: 10, o: 0 }],
];
const hiddenUntil = (tail: StageKeyframe[]): StageKeyframe[] => [
  [0.535, { ...tail[0][1], o: 0 }],
  ...tail,
];

const TEXTURE: StageKeyframe[] = [
  [0.6, { s: 0.9, o: 0, b: 14 }],
  [0.625, { s: 1, o: 1, b: 0 }],
  [0.675, { s: 1.12 }],
  [0.7, { s: 1.18, o: 0, b: 6 }],
];
const FILLING: StageKeyframe[] = [
  [0.675, { s: 1.25, o: 0, b: 16 }],
  [0.705, { s: 1.1, o: 1, b: 0 }],
  [0.755, { s: 1.0 }],
  [0.79, { s: 0.97, o: 0 }],
];

const flavorLayers: StageLayerSpec[] = FLAVORS.flatMap((v) => [
  {
    id: `p${v}`,
    variant: v,
    depth: FLAVOR_DEPTH[v],
    breathe: 0.4,
    breathePhase: v * 2,
    keyframes: hiddenUntil(WHOLE_TAIL),
    keyframesPortrait: hiddenUntil(WHOLE_TAIL_PORTRAIT),
  },
]);
const macroLayers: StageLayerSpec[] = FLAVORS.flatMap((v) => [
  { id: `tx${v}`, variant: v, depth: 10, keyframes: TEXTURE },
  { id: `fl${v}`, variant: v, depth: 10, keyframes: FILLING },
]);

export const kukiLukiChoreography: StageChoreography = {
  baseDurationMs: 750,
  followDamping: 10,
  pointerDamping: 4,
  portraitMaxAspect: 0.8,

  // 13 битов = 13 жестов; счётчик «01 / 13» в HUD.
  beats: [
    { p: 0 },
    { p: 0.33 },
    ...FLAVORS.flatMap((variant) => [
      { p: 0.57, variant },
      { p: 0.65, variant },
      { p: 0.735, variant },
    ]),
    { p: 0.83 },
    { p: 0.96 },
  ],

  transitions: [
    { kind: "slide", shiftVw: 105, factor: 1.25 },
    { kind: "dip", between: [0.33, 0.57], factor: 1.1 },
  ],

  layers: [
    // S01 / S06 — розовая студия, заголовок, печенье
    {
      id: "bgPink",
      opacity: [
        [0, 1],
        [0.16, 1],
        [0.2, 0],
        [0.87, 0],
        [0.9, 1],
      ],
    },
    {
      id: "s01meta",
      opacity: [
        [0, 1],
        [0.07, 1],
        [0.11, 0],
      ],
    },
    {
      id: "bgDark",
      opacity: [
        [0.3, 0],
        [0.36, 1],
        [0.76, 1],
        [0.8, 0],
      ],
    },
    {
      id: "title",
      depth: 8,
      keyframes: [
        [0, { x: -27, y: -4, s: 1, o: 1 }],
        [0.08, { x: -28, y: -5, s: 1.03 }],
        [0.13, { x: -31, s: 1.08, o: 0 }],
        [0.87, { x: -27, y: -10, s: 0.96, o: 0 }],
        [0.92, { x: -27, y: -10, s: 1, o: 1 }],
        [1, { s: 1.01 }],
      ],
      keyframesPortrait: [
        [0, { x: -8, y: -28, s: 1, o: 1 }],
        [0.08, { y: -29, s: 1.03 }],
        [0.13, { s: 1.08, o: 0 }],
        [0.87, { x: -8, y: -28, s: 0.96, o: 0 }],
        [0.92, { y: -28, s: 1, o: 1 }],
      ],
    },
    {
      id: "hero",
      depth: 18,
      breathe: 1,
      keyframes: [
        [0, { x: 21, y: 4, s: 0.9, o: 1 }],
        [0.1, { x: 18, y: 4, s: 1.2 }],
        [0.155, { x: -8, y: -12, s: 3.6, b: 0 }],
        [0.185, { x: -20, y: -24, s: 5, o: 0, b: 6 }],
        [0.86, { x: 21, y: 30, s: 0.72, o: 0, b: 0 }],
        [0.915, { x: 21, y: -4, s: 0.78, o: 1 }],
        [1, { y: -5, s: 0.8 }],
      ],
      keyframesPortrait: [
        [0, { x: 6, y: 16, s: 1, o: 1 }],
        [0.1, { x: 5, y: 13, s: 1.3 }],
        [0.155, { x: -10, y: -6, s: 3.4, b: 0 }],
        [0.185, { x: -20, y: -14, s: 5, o: 0, b: 6 }],
        [0.86, { x: 0, y: 30, s: 0.6, o: 0, b: 0 }],
        [0.915, { x: 0, y: 6, s: 0.6, o: 1 }],
        [1, { y: 5, s: 0.62 }],
      ],
    },
    {
      id: "tagline",
      opacity: [
        [0, 1],
        [0.06, 1],
        [0.08, 0],
      ],
    },
    {
      id: "hint",
      opacity: [
        [0, 1],
        [0.04, 1],
        [0.06, 0],
      ],
    },
    {
      id: "brand",
      opacity: [
        [0.06, 0],
        [0.09, 1],
        [0.87, 1],
        [0.9, 0],
      ],
    },
    {
      id: "order",
      opacity: [
        [0.06, 0],
        [0.09, 1],
        [0.88, 1],
        [0.91, 0],
      ],
    },

    // S02 — трещина → внутри
    {
      id: "crack",
      depth: 10,
      keyframes: [
        [0.14, { s: 0.85, o: 0, b: 14 }],
        [0.19, { s: 1, o: 1, b: 0 }],
        [0.235, { s: 1.7, b: 1 }],
        [0.265, { s: 3.2, b: 12, o: 0 }],
      ],
    },
    {
      id: "crackRim",
      opacity: [
        [0.215, 0],
        [0.25, 0.92],
        [0.285, 0],
      ],
    },
    {
      id: "interior",
      opacity: [
        [0.245, 0],
        [0.275, 1],
        [0.35, 1],
        [0.375, 0],
      ],
    },
    {
      id: "interiorImg",
      depth: 10,
      nestedIn: "interior",
      keyframes: [
        [0.245, { s: 1.45, b: 18 }],
        [0.29, { s: 1.12, b: 3 }],
        [0.33, { s: 1.0, b: 0 }],
        [0.375, { s: 1.9, b: 14 }],
      ],
    },
    {
      id: "haze",
      opacity: [
        [0.26, 0],
        [0.32, 0.55],
        [0.37, 0],
      ],
    },
    {
      id: "insideText",
      opacity: [
        [0.3, 0],
        [0.325, 1],
        [0.345, 1],
        [0.365, 0],
      ],
    },

    // S04 — три вкуса × целиком / текстура / начинка
    ...flavorLayers,
    {
      id: "whole",
      depth: 4,
      keyframes: [
        [0.545, { x: -28, y: 0, o: 0 }],
        [0.565, { o: 1 }],
        [0.6, { o: 1 }],
        [0.615, { o: 0 }],
      ],
      keyframesPortrait: [
        [0.545, { x: 0, y: -24, o: 0 }],
        [0.565, { o: 1 }],
        [0.6, { o: 1 }],
        [0.615, { o: 0 }],
      ],
    },
    ...macroLayers,
    {
      id: "states",
      opacity: [
        [0.535, 0],
        [0.555, 1],
        [0.76, 1],
        [0.775, 0],
      ],
    },

    // S05 / S06 — меню и визит
    {
      id: "menu",
      interactive: true,
      keyframes: [
        [0.765, { y: 100, o: 1 }],
        [0.8, { y: 0 }],
        [0.87, { y: 0 }],
        [0.9, { y: -100 }],
      ],
    },
    {
      id: "s06",
      interactive: true,
      opacity: [
        [0.9, 0],
        [0.93, 1],
      ],
    },
  ],

  // Меню скроллится внутри: на бите 0.83 жест сначала прокручивает лист.
  scrollable: { id: "menu", atBeatP: 0.83 },
  input: {
    wheelThreshold: 12,
    gestureGapMs: [160, 110],
    touchThresholdPx: 40,
    lateAcceptFraction: 0.45,
  },
};

/**
 * HUD и подписи — сайт-специфичная часть кадра, которую сцена считает в
 * `onFrame`. Тоже 1:1 из прототипа (updateHud).
 */
export const kukiLukiHud = {
  ink: {
    light: "#FFF6F9",
    dark: "#16050A",
    /** Тёмный текст на кремовом меню. */
    darkRange: [0.775, 0.885] as const,
    /** …и на молочной студии Киндера, пока виден кадр «Целиком». */
    darkVariant: { variant: 2, range: [0.53, 0.62] as const },
  },
  /** Правый рельс: «Целиком» до 0.61, «Текстура» до 0.69, дальше «Начинка». */
  statesBreaks: [0.61, 0.69] as const,
  statesDimOpacity: 0.35,
  annotations: {
    texture: { in: [0.635, 0.65] as const, out: [0.67, 0.685] as const },
    filling: { in: [0.715, 0.73] as const, out: [0.752, 0.766] as const, stagger: 0.008 },
    /** Подпись правее этой точки (% ширины) разворачивается влево. */
    flipX: 55,
  },
};

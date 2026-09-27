import type { StageChoreography, StageKeyframe, StageLayer } from "@/lib/types";

/**
 * Хореография Куки Луки — все значения сняты 1:1 с утверждённого
 * прототипа (reference/kuki-luki-prototype.dc.html, метод build()).
 * Ничего не придумано: если значение нужно поменять — сначала в прототипе.
 *
 * Варианты: 0 — Орео, 1 — Фрамбини, 2 — Киндер.
 */

const VARIANTS = [0, 1, 2] as const;
const PRODUCT_DEPTH = [26, 14, 6];
const MACRO_SIZE = { width: "115vw", height: "115vh" };
const PORTRAIT_SIZE = { width: "max(60vmin, min(80vw, 40vh))", height: "max(60vmin, min(80vw, 40vh))" };

const productWhole: StageKeyframe[] = [
  [0.545, { x: 14, y: 3, s: 1.08, b: 0, o: 1, h: 0 }],
  [0.59, { x: 14, y: 3, s: 1.13 }],
  [0.62, { x: 8, y: 0, s: 3.2, b: 10, o: 0 }],
];
const productWholePortrait: StageKeyframe[] = [
  [0.545, { x: 0, y: 14, s: 1.0, b: 0, o: 1, h: 0 }],
  [0.59, { y: 14, s: 1.05 }],
  [0.62, { y: 6, s: 2.8, b: 10, o: 0 }],
];
const texture: StageKeyframe[] = [
  [0.6, { s: 0.9, o: 0, b: 14 }],
  [0.625, { s: 1, o: 1, b: 0 }],
  [0.675, { s: 1.12 }],
  [0.7, { s: 1.18, o: 0, b: 6 }],
];
const filling: StageKeyframe[] = [
  [0.675, { s: 1.25, o: 0, b: 16 }],
  [0.705, { s: 1.1, o: 1, b: 0 }],
  [0.755, { s: 1.0 }],
  [0.79, { s: 0.97, o: 0 }],
];
const PRODUCT_IDS = ["oreo", "frambini", "kinder"] as const;
const PRODUCT_SHADOW = [
  "drop-shadow(0 3vmin 4vmin rgba(0,0,0,0.55))",
  "drop-shadow(0 3vmin 4vmin rgba(20,4,8,0.45))",
  "drop-shadow(0 3vmin 4vmin rgba(20,4,8,0.35))",
];
const MACRO_UNDERLAY = {
  texture: ["#241009", "#241009", "#3A220F"],
  filling: ["#2A1A16", "#3A0F1C", "#2E1609"],
};

const productLayers: StageLayer[] = VARIANTS.flatMap((v) => [
  {
    id: `${PRODUCT_IDS[v]}-whole`,
    kind: "media" as const,
    media: { assetId: `${PRODUCT_IDS[v]}-portrait` },
    variant: v,
    depth: PRODUCT_DEPTH[v],
    breathe: 0.4,
    keyframes: productWhole,
    keyframesPortrait: productWholePortrait,
    size: PORTRAIT_SIZE,
    // Киндер: верхние 20% кадра обрезаны (в вырезке остался край второго печенья). Тень — на обёртке, не на обрезанном img.
    style: v === 2 ? { filter: PRODUCT_SHADOW[v], "--img-clip": "inset(20% 0 0 0)" } : { filter: PRODUCT_SHADOW[v] },
  },
  {
    id: `${PRODUCT_IDS[v]}-texture`,
    kind: "media" as const,
    media: { assetId: `${PRODUCT_IDS[v]}-texture` },
    variant: v,
    depth: 10,
    keyframes: texture,
    size: MACRO_SIZE,
    style: { background: MACRO_UNDERLAY.texture[v] },
  },
  {
    id: `${PRODUCT_IDS[v]}-filling`,
    kind: "media" as const,
    media: { assetId: `${PRODUCT_IDS[v]}-filling` },
    variant: v,
    depth: 10,
    keyframes: filling,
    size: MACRO_SIZE,
    style: { background: MACRO_UNDERLAY.filling[v] },
  },
]);

export const kukiLukiChoreography: StageChoreography = {
  baseDurationMs: 750,
  followDamping: 10,
  pointerDamping: 4,

  // 13 битов = 13 жестов. Счётчик «01 / 13» в HUD.
  beats: [
    { p: 0, scene: "S01", label: "Crave" },
    { p: 0.33, scene: "S02", label: "Внутри" },
    ...VARIANTS.flatMap((v) => [
      { p: 0.57, variant: v, scene: "S04", label: "Целиком" },
      { p: 0.65, variant: v, scene: "S04", label: "Текстура" },
      { p: 0.735, variant: v, scene: "S04", label: "Начинка" },
    ]),
    { p: 0.83, scene: "S05", label: "Меню" },
    { p: 0.96, scene: "S06", label: "Visit / Order" },
  ],

  transitions: [
    { kind: "slide", when: "variant-change", shiftVw: 105, factor: 1.25 },
    { kind: "dip", between: [0.33, 0.57], veil: "#16050A", factor: 1.1 },
  ],

  layers: [
    // ── Студии
    {
      id: "studio-pink",
      kind: "fill",
      fill: "radial-gradient(ellipse 80% 70% at 62% 40%, #FF69B0 0%, #FF3E9A 38%, #E0288A 70%, #A8145F 100%)",
      opacity: [[0, 1], [0.16, 1], [0.2, 0], [0.87, 0], [0.9, 1]],
    },
    {
      id: "studio-flavor",
      kind: "fill",
      fill: "radial-gradient(ellipse 55% 50% at 55% 38%, #5C0B28 0%, #2A0610 50%, #0F0305 100%)",
      variantFills: [
        "radial-gradient(ellipse 60% 55% at 58% 42%, #2E2A2B 0%, #151213 55%, #070606 100%)",
        "radial-gradient(ellipse 60% 55% at 58% 42%, #B01F55 0%, #6E0C31 52%, #2E0413 100%)",
        "radial-gradient(ellipse 60% 55% at 58% 42%, #FBF4EA 0%, #EEDFCB 55%, #CDB696 100%)",
      ],
      opacity: [[0.3, 0], [0.36, 1], [0.76, 1], [0.8, 0]],
    },

    // ── S01 / S06
    {
      id: "title",
      kind: "text",
      depth: 8,
      keyframes: [
        [0, { x: -27, y: -4, s: 1, o: 1 }], [0.08, { x: -28, y: -5, s: 1.03 }], [0.13, { x: -31, s: 1.08, o: 0 }],
        [0.87, { x: -27, y: -10, s: 0.96, o: 0 }], [0.92, { x: -27, y: -10, s: 1, o: 1 }], [1, { s: 1.01 }],
      ],
      keyframesPortrait: [
        [0, { x: -8, y: -28, s: 1, o: 1 }], [0.08, { y: -29, s: 1.03 }], [0.13, { s: 1.08, o: 0 }],
        [0.87, { x: -8, y: -28, s: 0.96, o: 0 }], [0.92, { y: -28, s: 1, o: 1 }],
      ],
    },
    {
      id: "signature-cookie",
      kind: "media",
      media: { assetId: "signature-cookie" },
      depth: 18,
      breathe: 1,
      style: {
        "mask-image": "radial-gradient(closest-side, #000 62%, rgba(0,0,0,0) 100%)",
        "-webkit-mask-image": "radial-gradient(closest-side, #000 62%, rgba(0,0,0,0) 100%)",
      },
      keyframes: [
        [0, { x: 21, y: 4, s: 0.9, o: 1 }], [0.1, { x: 18, y: 4, s: 1.2 }], [0.155, { x: -8, y: -12, s: 3.6, b: 0 }],
        [0.185, { x: -20, y: -24, s: 5, o: 0, b: 6 }], [0.86, { x: 21, y: 30, s: 0.72, o: 0, b: 0 }],
        [0.915, { x: 21, y: -4, s: 0.78, o: 1 }], [1, { y: -5, s: 0.8 }],
      ],
      keyframesPortrait: [
        [0, { x: 6, y: 16, s: 1, o: 1 }], [0.1, { x: 5, y: 13, s: 1.3 }], [0.155, { x: -10, y: -6, s: 3.4, b: 0 }],
        [0.185, { x: -20, y: -14, s: 5, o: 0, b: 6 }], [0.86, { x: 0, y: 30, s: 0.6, o: 0, b: 0 }],
        [0.915, { x: 0, y: 6, s: 0.6, o: 1 }], [1, { y: 5, s: 0.62 }],
      ],
    },
    { id: "s01-meta", kind: "dom", opacity: [[0, 1], [0.07, 1], [0.11, 0]] },
    { id: "tagline", kind: "dom", opacity: [[0, 1], [0.06, 1], [0.08, 0]] },
    { id: "hint", kind: "dom", opacity: [[0, 1], [0.04, 1], [0.06, 0]] },
    { id: "hud-brand", kind: "dom", opacity: [[0.06, 0], [0.09, 1], [0.87, 1], [0.9, 0]] },
    { id: "hud-order", kind: "dom", interactive: true, opacity: [[0.06, 0], [0.09, 1], [0.88, 1], [0.91, 0]] },

    // ── S02: трещина → внутри
    {
      id: "crack",
      kind: "media",
      media: { assetId: "crack-macro" },
      video: { assetId: "crack-macro-video" },
      depth: 10,
      size: MACRO_SIZE,
      style: { background: "#3A1A10" },
      keyframes: [[0.14, { s: 0.85, o: 0, b: 14 }], [0.19, { s: 1, o: 1, b: 0 }], [0.235, { s: 1.7, b: 1 }], [0.265, { s: 3.2, b: 12, o: 0 }]],
    },
    {
      id: "crack-rim",
      kind: "fill",
      fill: "radial-gradient(ellipse 70% 60% at 50% 50%, #1A0508 0%, #0A0203 70%)",
      opacity: [[0.215, 0], [0.25, 0.92], [0.285, 0]],
    },
    { id: "interior", kind: "fill", fill: "transparent", opacity: [[0.245, 0], [0.275, 1], [0.35, 1], [0.375, 0]] },
    {
      id: "interior-media",
      kind: "media",
      nestedIn: "interior",
      media: { assetId: "interior-macro" },
      video: { assetId: "interior-macro-video" },
      depth: 10,
      size: MACRO_SIZE,
      style: { background: "#2A0E08" },
      keyframes: [[0.245, { s: 1.45, b: 18 }], [0.29, { s: 1.12, b: 3 }], [0.33, { s: 1.0, b: 0 }], [0.375, { s: 1.9, b: 14 }]],
    },
    {
      id: "haze",
      kind: "fill",
      fill: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,40,130,0.55), rgba(255,40,130,0) 70%)",
      style: { "mix-blend-mode": "screen" },
      opacity: [[0.26, 0], [0.32, 0.55], [0.37, 0]],
    },
    { id: "inside-text", kind: "dom", opacity: [[0.3, 0], [0.325, 1], [0.345, 1], [0.365, 0]] },

    // ── S04: три вкуса × целиком / текстура / начинка
    ...productLayers,
    {
      id: "whole-caption",
      kind: "dom",
      depth: 4,
      keyframes: [[0.545, { x: -28, y: 0, o: 0 }], [0.565, { o: 1 }], [0.6, { o: 1 }], [0.615, { o: 0 }]],
      keyframesPortrait: [[0.545, { x: 0, y: -24, o: 0 }], [0.565, { o: 1 }], [0.6, { o: 1 }], [0.615, { o: 0 }]],
    },
    { id: "states-rail", kind: "dom", opacity: [[0.535, 0], [0.555, 1], [0.76, 1], [0.775, 0]] },

    // ── S05 / S06
    {
      id: "menu",
      kind: "dom",
      interactive: true,
      style: { background: "#F3EAE2", color: "#16050A", overflow: "auto" },
      keyframes: [[0.765, { y: 100, o: 1 }], [0.8, { y: 0 }], [0.87, { y: 0 }], [0.9, { y: -100 }]],
    },
    { id: "visit", kind: "dom", interactive: true, opacity: [[0.9, 0], [0.93, 1]] },
  ],

  annotations: [
    // Текстура: одна подпись, окно 0.635–0.685
    ...(
      [
        [0, "Шоколадное тесто с дробленым печеньем Орео", 58, 42],
        [1, "Шоколадное тесто, кусочки молочного шоколада", 56, 44],
        [2, "Песочное тесто с шоколадом Киндер", 56, 44],
      ] as const
    ).map(([variant, label, x, y]) => ({ variant, label, x, y, in: [0.635, 0.65] as [number, number], out: [0.67, 0.685] as [number, number] })),
    // Начинка: три подписи со сдвигом 0.008 на каждую (k = 0, 1, 2)
    ...(
      [
        [0, [["Крем из творожного сыра с белым шоколадом", 40, 42], ["Оригинальное печенье Орео", 62, 30], ["Белый шоколад", 34, 64]]],
        [1, [["Малиновый крем-чиз", 40, 40], ["Сублимированная малина", 64, 32], ["Фрамбини с каплей шоколада", 56, 62]]],
        [2, [["Шоколад Киндер", 42, 38], ["Молочный шоколад", 64, 54], ["Белый шоколад", 34, 64]]],
      ] as const
    ).flatMap(([variant, points]) =>
      points.map(([label, x, y], k) => ({
        variant,
        label,
        x,
        y,
        in: [0.715 + k * 0.008, 0.73 + k * 0.008] as [number, number],
        out: [0.752, 0.766] as [number, number],
      })),
    ),
  ],

  ink: {
    default: "#FFF6F9",
    rules: [
      { from: 0.775, to: 0.885, ink: "#16050A" },
      { from: 0.53, to: 0.62, variant: 2, ink: "#16050A" },
    ],
  },

  post: {
    grain: 0.13,
    vignette: "radial-gradient(130% 100% at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,0,8,0.38) 100%)",
  },

  input: {
    touchThresholdPx: 40,
    wheelThreshold: 12,
    gestureGapMs: [160, 110],
    scrollableLayer: "menu",
  },
};

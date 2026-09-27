import type { StageChoreography, StageLayerSpec, StageTransform } from "@/lib/types";
import {
  prepareKeyframes,
  sampleKeyframes,
  sampleTrack,
  type ResolvedKeyframe,
} from "@/components/wow/motion/keyframes";
import type { StageNavigator } from "@/components/wow/motion/stage-navigator";

/**
 * LAYER STAGE — покадровый рантайм сцены из DOM-слоёв. Берёт прогресс у
 * `StageNavigator`, сэмплирует хореографию каждого слоя и пишет в элемент
 * `[data-l="<id>"]` transform / filter / opacity / visibility. Всё это
 * композитит GPU (translate3d, scale, blur, mask-image, video), поэтому
 * WebGL-контекст не нужен и fallback для него тоже.
 *
 * Поверх ключей: сглаживание к цели (слой догоняет значение), курсорный
 * параллакс по глубине, «дыхание», боковой сдвиг slide-перехода, вуаль
 * dip-перехода (`[data-veil]`) и джиттер плёночного зерна (`[data-grain]`).
 * Рантайм не знает, что изображено в слоях, — только их id.
 */

export interface LayerStageOptions {
  /** prefers-reduced-motion: без параллакса и дыхания. Переходы между битами остаются. */
  reducedMotion: boolean;
  /** Множитель параллакса, 1 — как в хореографии. */
  parallax?: number;
}

/** Сглаженные значения слоя на текущем кадре (у opacity-слоя — только `o`). */
export type LayerValues = StageTransform & { o: number };

export interface LayerStageFrame {
  p: number;
  variant: number;
  beat: number;
  beatCount: number;
  values: Record<string, LayerValues>;
}

interface PreparedLayer {
  spec: StageLayerSpec;
  keyframes?: ResolvedKeyframe[];
  el: HTMLElement;
  visible: boolean;
}

const BREATHE_VH = 0.35;
const MAX_BLUR_PX = 8;
const FIELDS = ["x", "y", "s", "o", "b", "h"] as const;

declare global {
  interface Window {
    /** Отладка: число в [0, 1] фиксирует прогресс сцены (scrub из консоли). */
    __stageP?: number;
  }
}

export class LayerStage {
  private readonly root: HTMLElement;
  private readonly choreo: StageChoreography;
  private readonly nav: StageNavigator;
  private readonly opts: LayerStageOptions;
  private layers: PreparedLayer[] = [];
  private cur: Record<string, LayerValues> = {};
  private grain: HTMLElement | null;
  private veil: HTMLElement | null;
  private veilValue = -1;
  private ptr = { x: 0, y: 0 };
  private ptrS = { x: 0, y: 0 };
  private last = 0;
  private t = 0;

  constructor(
    root: HTMLElement,
    choreography: StageChoreography,
    navigator: StageNavigator,
    options: LayerStageOptions,
  ) {
    this.root = root;
    this.choreo = choreography;
    this.nav = navigator;
    this.opts = options;
    this.grain = root.querySelector("[data-grain]");
    this.veil = root.querySelector("[data-veil]");
    this.build();
  }

  /** Пересобирает слои под текущий вьюпорт (портрет/альбом); вызывать на resize. */
  build(): void {
    const portrait = window.innerWidth / window.innerHeight < this.choreo.portraitMaxAspect;
    const els = new Map<string, HTMLElement>();
    this.root.querySelectorAll<HTMLElement>("[data-l]").forEach((el) => {
      if (el.dataset.l) els.set(el.dataset.l, el);
    });
    this.layers = this.choreo.layers.flatMap((spec) => {
      const el = els.get(spec.id);
      if (!el) return [];
      const kf = (portrait && spec.keyframesPortrait) || spec.keyframes;
      return [{ spec, el, visible: false, keyframes: kf ? prepareKeyframes(kf) : undefined }];
    });
  }

  pointerMove(clientX: number, clientY: number): void {
    this.ptr.x = (clientX / window.innerWidth) * 2 - 1;
    this.ptr.y = (clientY / window.innerHeight) * 2 - 1;
  }

  frame(now: number): LayerStageFrame {
    const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 0;
    this.last = now;
    this.t += dt;

    const nav = this.nav.update(now);
    const debugP = typeof window.__stageP === "number" ? window.__stageP : null;
    const p = debugP ?? nav.p;
    if (nav.snapped) this.cur = {};

    const { reducedMotion } = this.opts;
    const parallax = reducedMotion ? 0 : (this.opts.parallax ?? 1);
    const kp = 1 - Math.exp(-dt * this.choreo.pointerDamping);
    this.ptrS.x += (this.ptr.x - this.ptrS.x) * kp;
    this.ptrS.y += (this.ptr.y - this.ptrS.y) * kp;
    const dk = debugP != null ? 1 : 1 - Math.exp(-dt * this.choreo.followDamping);
    const W = window.innerWidth / 100;
    const H = window.innerHeight / 100;
    const visibleById = new Map<string, boolean>();

    for (const layer of this.layers) {
      const { spec, el } = layer;
      let v: LayerValues;
      if (layer.keyframes) v = sampleKeyframes(layer.keyframes, p);
      else if (spec.opacity) v = { o: sampleTrack(spec.opacity, p) };
      else continue;
      if (spec.variant != null && spec.variant !== nav.variant) v.o = 0;

      const c = this.cur[spec.id] ?? (this.cur[spec.id] = { ...v });
      for (const k of FIELDS) {
        const target = v[k];
        if (target == null) continue;
        const prev = c[k];
        c[k] = prev == null ? target : prev + (target - prev) * dk;
      }

      if (spec.nestedIn) {
        if (!visibleById.get(spec.nestedIn)) continue;
      } else {
        const visible = c.o > 0.004;
        visibleById.set(spec.id, visible);
        if (visible !== layer.visible) {
          layer.visible = visible;
          el.style.visibility = visible ? "visible" : "hidden";
        }
        if (!visible) continue;
        el.style.opacity = c.o.toFixed(3);
      }

      if (layer.keyframes) {
        const depth = spec.depth ?? 0;
        let x = ((c.x ?? 0) + nav.shiftVw * (depth ? 1 + depth / 60 : 1)) * W;
        let y = (c.y ?? 0) * H;
        if (depth) {
          x += this.ptrS.x * depth * parallax;
          y += this.ptrS.y * depth * 0.6 * parallax;
        }
        if (spec.breathe && !reducedMotion) {
          y += Math.sin(this.t * 0.6 + (spec.breathePhase ?? 0)) * BREATHE_VH * H * spec.breathe;
        }
        el.style.transform = `translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) scale(${(c.s ?? 1).toFixed(4)})`;
        const blur = Math.min(MAX_BLUR_PX, Math.round(c.b ?? 0));
        const haze = c.h ?? 0;
        const filter =
          (blur >= 1 ? `blur(${blur}px) ` : "") +
          (haze > 0.01
            ? `contrast(${(1 - haze * 0.32).toFixed(3)}) brightness(${(1 - haze * 0.12).toFixed(3)})`
            : "");
        const fv = filter.trim() || "none";
        if (el.style.filter !== fv) el.style.filter = fv;
      }

      if (spec.interactive) {
        const pe = c.o > 0.5 ? "auto" : "none";
        if (el.style.pointerEvents !== pe) el.style.pointerEvents = pe;
      }
    }

    if (this.veil && nav.veil !== this.veilValue) {
      this.veilValue = nav.veil;
      this.veil.style.opacity = nav.veil.toFixed(3);
    }
    if (this.grain) {
      const gx = (Math.random() * 60 - 30).toFixed(0);
      const gy = (Math.random() * 60 - 30).toFixed(0);
      this.grain.style.transform = `translate(${gx}px,${gy}px)`;
    }

    return {
      p,
      variant: nav.variant,
      beat: nav.beat,
      beatCount: this.nav.beatCount,
      values: this.cur,
    };
  }
}

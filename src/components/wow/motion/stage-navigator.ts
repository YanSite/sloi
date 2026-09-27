import type { StageBeat, StageInputTuning, StageTransitionRule } from "@/lib/types";
import { easeInOutCubic, smoothstep } from "./timeline";

/**
 * STAGE NAVIGATOR — навигация «один жест = один бит» с тремя видами
 * перехода: tween (прогресс едет к цели), dip (затемнение вуалью и прыжок
 * в середине) и slide (боковой пролёт камеры со сменой варианта).
 *
 * В отличие от `BeatController` (один твин прогресса и блокировка ввода
 * по таймеру), навигатор распознаёт границы жеста трекпада по паузе и
 * по «подъёму» дельты после затухания инерции, а жест, пришедший во
 * время перехода, не теряет — ставит в очередь (один) и исполняет по
 * завершении. Все пороги — параметры; значения по умолчанию подобраны
 * под трекпад с инерцией и мобильный свайп.
 */

const DEFAULT_INPUT: Required<StageInputTuning> = {
  wheelThreshold: 12,
  gestureGapMs: [160, 110],
  touchThresholdPx: 40,
  lateAcceptFraction: 0.45,
};

/**
 * «Подъём» дельты — начало нового жеста посреди инерционного хвоста:
 * после `decays` затуханий подряд дельта выросла больше чем в `factor`
 * раз (+ `add`), но не меньше `min`; не чаще раза в `cooldownMs`.
 * Индекс 0 — обычные биты, 1 — биты варианта (там жесты короче и чаще).
 */
const RISE = [
  { decays: 4, factor: 2.5, add: 0, min: 24, cooldownMs: 350 },
  { decays: 2, factor: 1.6, add: 4, min: 10, cooldownMs: 200 },
] as const;

const FORWARD_KEYS = ["ArrowDown", "PageDown", " "];
const BACKWARD_KEYS = ["ArrowUp", "PageUp"];

export interface StageNavigatorOptions {
  beats: StageBeat[];
  transitions: StageTransitionRule[];
  /** Базовая длительность перехода, ms. */
  baseDurationMs: number;
  input?: StageInputTuning;
  /**
   * Слой со своим скроллом: пока активен бит `atBeatP` и слой может
   * прокручиваться в сторону жеста, жест отдаётся ему.
   */
  scrollable?: { element: () => HTMLElement | null; atBeatP: number };
  /** Вызывается при смене активного варианта (для перерисовки контента). */
  onVariantChange?: (variant: number) => void;
}

/** Состояние кадра, которое навигатор отдаёт рантайму сцены. */
export interface StageNavigatorFrame {
  p: number;
  variant: number;
  beat: number;
  /** Горизонтальный сдвиг slide-перехода, vw (без учёта глубины слоя). */
  shiftVw: number;
  /** Непрозрачность вуали dip-перехода, 0..1. */
  veil: number;
  /** Кадр прыжка dip/slide: сглаживание слоёв нужно сбросить. */
  snapped: boolean;
}

interface Tween {
  from: number;
  to: number;
  t0: number;
  dur: number;
}
interface Jump {
  t0: number;
  dur: number;
  target: StageBeat;
  dir: number;
  shiftVw: number;
  swapped: boolean;
}

export class StageNavigator {
  beat = 0;
  p: number;
  variant = 0;

  private readonly opts: StageNavigatorOptions;
  private readonly input: Required<StageInputTuning>;
  private tween: Tween | null = null;
  private dip: Jump | null = null;
  private slide: Jump | null = null;
  private queued = 0;
  private shiftVw = 0;
  private veil = 0;
  // Состояние распознавания жеста колеса/трекпада.
  private lastWheel = 0;
  private lastAbs = 0;
  private decay = 0;
  private armed = true;
  private acc = 0;
  private lastStepT = 0;
  private touch: { x: number; y: number } | null = null;

  constructor(options: StageNavigatorOptions) {
    this.opts = options;
    this.input = { ...DEFAULT_INPUT, ...options.input };
    this.p = options.beats[0]?.p ?? 0;
    this.variant = options.beats[0]?.variant ?? 0;
  }

  get beatCount(): number {
    return this.opts.beats.length;
  }

  /** Шаг на один бит вперёд (1) или назад (−1); во время dip/slide — в очередь. */
  step(dir: number): void {
    if (this.dip || this.slide) {
      this.queued = dir;
      return;
    }
    this.go(Math.max(0, Math.min(this.opts.beats.length - 1, this.beat + dir)));
  }

  /** Переход к биту по индексу с подходящим видом перехода. */
  go(index: number): void {
    if ((index === this.beat && !this.tween) || this.dip || this.slide) return;
    const beats = this.opts.beats;
    const target = beats[index];
    const current = beats[this.beat];
    const dir = Math.sign(index - this.beat) || 1;
    const base = this.opts.baseDurationMs;
    const now = performance.now();
    this.beat = index;

    for (const rule of this.opts.transitions) {
      if (
        rule.kind === "slide" &&
        target.variant != null &&
        current.variant != null &&
        target.variant !== current.variant
      ) {
        this.tween = null;
        this.slide = {
          t0: now,
          dur: base * rule.factor,
          target,
          dir,
          shiftVw: rule.shiftVw,
          swapped: false,
        };
        return;
      }
      if (rule.kind === "dip") {
        const [a, b] = rule.between;
        if ((current.p === a && target.p === b) || (current.p === b && target.p === a)) {
          this.tween = null;
          this.dip = { t0: now, dur: base * rule.factor, target, dir, shiftVw: 0, swapped: false };
          return;
        }
      }
    }

    if (target.variant != null) this.setVariant(target.variant);
    const from = this.p;
    this.tween = {
      from,
      to: target.p,
      t0: now,
      dur: base * (1 + Math.min(0.6, Math.abs(target.p - from) * 1.5)),
    };
  }

  /** Продвигает текущий переход; вызывать раз в кадр с timestamp из rAF. */
  update(now: number): StageNavigatorFrame {
    let snapped = false;
    if (this.slide) {
      const d = this.slide;
      const t = Math.min(1, (now - d.t0) / d.dur);
      if (t >= 0.5 && !d.swapped) snapped = this.land(d);
      const a = t < 0.5 ? Math.pow(t / 0.5, 3) : Math.pow(1 - (t - 0.5) / 0.5, 3);
      this.shiftVw = (t < 0.5 ? -1 : 1) * d.dir * a * d.shiftVw;
      if (t >= 1) {
        this.slide = null;
        this.shiftVw = 0;
        this.flushQueue();
      }
    } else if (this.dip) {
      const d = this.dip;
      const t = Math.min(1, (now - d.t0) / d.dur);
      if (t >= 0.5 && !d.swapped) snapped = this.land(d);
      this.veil = t < 0.5 ? smoothstep(0, 0.5, t) : 1 - smoothstep(0.5, 1, t);
      if (t >= 1) {
        this.dip = null;
        this.veil = 0;
        this.flushQueue();
      }
    } else if (this.tween) {
      const a = this.tween;
      const t = Math.min(1, (now - a.t0) / a.dur);
      this.p = a.from + (a.to - a.from) * easeInOutCubic(t);
      if (t >= 1) {
        this.tween = null;
        this.flushQueue();
      }
    }
    return {
      p: this.p,
      variant: this.variant,
      beat: this.beat,
      shiftVw: this.shiftVw,
      veil: this.veil,
      snapped,
    };
  }

  /**
   * Перехватывает wheel / touch / клавиши на `window` и отключает
   * нативную прокрутку документа. Возвращает функцию, снимающую всё это.
   */
  attach(): () => void {
    const inp = this.input;
    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      const gap = now - this.lastWheel;
      this.lastWheel = now;
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      const dy = (Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * unit;
      if (this.scrollsInside(e.target, Math.sign(dy))) return;
      e.preventDefault();

      const ad = Math.abs(dy);
      const la = this.lastAbs;
      this.lastAbs = ad;
      if (ad < la) this.decay++;
      const onVariant = this.opts.beats[this.beat].variant != null;
      const r = RISE[onVariant ? 1 : 0];
      const rise =
        this.decay >= r.decays &&
        ad > Math.max(la * r.factor + r.add, r.min) &&
        now - this.lastStepT > r.cooldownMs;
      if (gap > inp.gestureGapMs[onVariant ? 1 : 0] || rise) {
        this.armed = true;
        this.acc = 0;
        this.decay = 0;
      }
      if (!this.armed) return;

      const late = this.tween && now - this.tween.t0 > this.tween.dur * inp.lateAcceptFraction;
      if (this.dip || this.slide || (this.tween && !late)) {
        if (now - this.lastStepT > r.cooldownMs) this.queued = Math.sign(dy);
        this.disarm(now);
        return;
      }
      this.acc += dy;
      if (Math.abs(this.acc) > inp.wheelThreshold) {
        this.disarm(now);
        this.step(Math.sign(dy));
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      this.touch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      const dy = (this.touch?.y ?? 0) - e.touches[0].clientY;
      if (!this.scrollsInside(e.target, Math.sign(dy))) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!this.touch) return;
      const t = e.changedTouches[0];
      const dy = this.touch.y - t.clientY;
      const dx = this.touch.x - t.clientX;
      this.touch = null;
      if (this.scrollsInside(e.target, Math.sign(dy))) return;
      if (Math.abs(dy) > inp.touchThresholdPx && Math.abs(dy) > Math.abs(dx))
        this.step(Math.sign(dy));
    };
    const onKey = (e: KeyboardEvent) => {
      if (FORWARD_KEYS.includes(e.key)) {
        e.preventDefault();
        this.step(1);
      } else if (BACKWARD_KEYS.includes(e.key)) {
        e.preventDefault();
        this.step(-1);
      } else if (e.key === "Home") this.go(0);
      else if (e.key === "End") this.go(this.opts.beats.length - 1);
    };

    const html = document.documentElement;
    const body = document.body;
    const prev = [html.style.overflow, body.style.overflow];
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      [html.style.overflow, body.style.overflow] = prev;
    };
  }

  /** Середина dip/slide: прыжок прогресса на цель и смена варианта. */
  private land(d: Jump): true {
    d.swapped = true;
    if (d.target.variant != null) this.setVariant(d.target.variant);
    this.p = d.target.p;
    return true;
  }

  private setVariant(variant: number): void {
    if (variant === this.variant) return;
    this.variant = variant;
    this.opts.onVariantChange?.(variant);
  }

  private flushQueue(): void {
    if (!this.queued) return;
    const q = this.queued;
    this.queued = 0;
    this.step(q);
  }

  private disarm(now: number): void {
    this.armed = false;
    this.acc = 0;
    this.decay = 0;
    this.lastStepT = now;
  }

  private scrollsInside(target: EventTarget | null, dir: number): boolean {
    const s = this.opts.scrollable;
    const el = s?.element();
    if (!s || !el || !(target instanceof Node) || !el.contains(target)) return false;
    if (this.opts.beats[this.beat].p !== s.atBeatP) return false;
    return dir > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 2 : el.scrollTop > 0;
  }
}

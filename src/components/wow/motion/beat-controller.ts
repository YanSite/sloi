import { clamp, easeInOutCubic, lerp } from "./timeline";

/**
 * BEAT CONTROLLER — навигация «один жест = один выстроенный кадр» для
 * полноэкранной immersive-сцены. В отличие от scroll-linked примитивов
 * (`Parallax`, `PinnedScroll`), здесь нативная прокрутка отключена:
 * wheel/trackpad, свайп и клавиши двигают прогресс `value` между
 * заранее заданными точками `beats`, а переход между ними — твин с
 * easeInOutCubic.
 *
 * Все пороги — параметры, а не константы; значения по умолчанию
 * рассчитаны на трекпад с инерцией и мобильный свайп. Контроллер не
 * знает ни о какой конкретной сцене.
 */
export interface BeatControllerOptions {
  /** Значения прогресса, в которых останавливается навигация, по возрастанию. */
  beats: number[];
  /** Без твина: прогресс переходит мгновенно (prefers-reduced-motion). */
  reducedMotion?: boolean;
  /** Накопленная дельта wheel, после которой делается один шаг. */
  wheelThreshold?: number;
  /** Вес горизонтальной дельты трекпада относительно вертикальной. */
  wheelDeltaXWeight?: number;
  /** Пауза между событиями wheel, после которой накопитель сбрасывается. */
  wheelGapMs?: number;
  /** Минимальное время блокировки ввода после шага (гасит инерцию трекпада). */
  lockMinMs?: number;
  /** Блокировка снимается в любом случае через это время. */
  lockMaxMs?: number;
  /** Вертикальный свайп, после которого делается один шаг, px. */
  swipeThreshold?: number;
  /** Длительность твина в мс по модулю дельты прогресса. */
  tweenDuration?: (delta: number) => number;
  /** Доля текущего твина, после которой принимается следующий шаг. */
  acceptAfter?: number;
}

const DEFAULTS = {
  wheelThreshold: 28,
  wheelDeltaXWeight: 0.3,
  wheelGapMs: 180,
  lockMinMs: 450,
  lockMaxMs: 1700,
  swipeThreshold: 42,
  tweenDuration: (delta: number) => Math.min(3000, 1500 + Math.abs(delta) * 7),
  acceptAfter: 0.7,
};

const FORWARD_KEYS = ["ArrowDown", "PageDown", " "];
const BACKWARD_KEYS = ["ArrowUp", "PageUp"];

export class BeatController {
  /** Текущий (анимированный) прогресс — читается каждый кадр. */
  value = 0;
  /** Прогресс, к которому идёт твин. */
  target = 0;

  private readonly beats: number[];
  private readonly opts: typeof DEFAULTS;
  private readonly reducedMotion: boolean;
  private index = 0;
  private locked = false;
  private lockT = 0;
  private lastWheel = 0;
  private acc = 0;
  private touchY: number | null = null;
  private twFrom = 0;
  private twTo = 0;
  private twT0 = 0;
  private twD = 1;

  constructor(options: BeatControllerOptions) {
    this.beats = options.beats;
    this.reducedMotion = options.reducedMotion ?? false;
    this.opts = {
      wheelThreshold: options.wheelThreshold ?? DEFAULTS.wheelThreshold,
      wheelDeltaXWeight: options.wheelDeltaXWeight ?? DEFAULTS.wheelDeltaXWeight,
      wheelGapMs: options.wheelGapMs ?? DEFAULTS.wheelGapMs,
      lockMinMs: options.lockMinMs ?? DEFAULTS.lockMinMs,
      lockMaxMs: options.lockMaxMs ?? DEFAULTS.lockMaxMs,
      swipeThreshold: options.swipeThreshold ?? DEFAULTS.swipeThreshold,
      tweenDuration: options.tweenDuration ?? DEFAULTS.tweenDuration,
      acceptAfter: options.acceptAfter ?? DEFAULTS.acceptAfter,
    };
    this.target = this.value = this.twFrom = this.twTo = this.beats[0] ?? 0;
  }

  /** Шаг на `delta` beat'ов; игнорируется, пока текущий твин не прошёл `acceptAfter`. */
  step(delta: number): void {
    if (performance.now() - this.twT0 < this.twD * this.opts.acceptAfter) return;
    const next = Math.max(0, Math.min(this.beats.length - 1, this.index + delta));
    if (next === this.index) return;
    this.index = next;
    this.target = this.beats[next];
    this.locked = true;
    this.lockT = performance.now();
    this.acc = 0;
  }

  /** Прямой переход к beat'у без проверки твина — для отладки и deep-link. */
  goTo(index: number): void {
    this.index = Math.max(0, Math.min(this.beats.length - 1, index));
    this.target = this.beats[this.index];
  }

  /** Продвигает твин к `target`; вызывать раз в кадр с timestamp из rAF. */
  update(now: number): number {
    if (this.reducedMotion) {
      this.value = this.target;
      return this.value;
    }
    if (this.target !== this.twTo) {
      this.twFrom = this.value;
      this.twTo = this.target;
      this.twT0 = now;
      this.twD = this.opts.tweenDuration(this.target - this.value);
    }
    const t = clamp((now - this.twT0) / this.twD);
    this.value = lerp(this.twFrom, this.twTo, easeInOutCubic(t));
    return this.value;
  }

  /**
   * Перехватывает wheel/touch/keys на `window` и отключает нативную
   * прокрутку документа. Возвращает функцию, снимающую всё это.
   */
  attach(): () => void {
    const o = this.opts;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = performance.now();
      const gap = now - this.lastWheel;
      this.lastWheel = now;
      if (this.locked) {
        if (
          (gap > o.wheelGapMs && now - this.lockT > o.lockMinMs) ||
          now - this.lockT > o.lockMaxMs
        )
          this.locked = false;
        else return;
      }
      if (gap > o.wheelGapMs) this.acc = 0;
      this.acc += e.deltaY + e.deltaX * o.wheelDeltaXWeight;
      if (Math.abs(this.acc) > o.wheelThreshold) this.step(this.acc > 0 ? 1 : -1);
    };
    const onTouchStart = (e: TouchEvent) => {
      this.touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (this.touchY == null) return;
      const dy = this.touchY - e.changedTouches[0].clientY;
      this.touchY = null;
      if (Math.abs(dy) > o.swipeThreshold) this.step(dy > 0 ? 1 : -1);
    };
    const onKey = (e: KeyboardEvent) => {
      if (FORWARD_KEYS.includes(e.key)) {
        e.preventDefault();
        this.step(1);
      } else if (BACKWARD_KEYS.includes(e.key)) {
        e.preventDefault();
        this.step(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        this.step(-this.index);
      } else if (e.key === "End") {
        e.preventDefault();
        this.step(this.beats.length - 1 - this.index);
      }
    };

    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    window.scrollTo(0, 0);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      root.style.overflow = prevOverflow;
    };
  }
}

import type { FilmDriver, FilmState } from "../deck";

/**
 * ПОВОРОТ (04) — «Нам есть что показать вам». Порт `setFilm('open')`
 * прототипа v31, таймлайн — docs/03_MOTION:
 *
 *   0      клип от прямоугольника фото карточки (03) до полного экрана,
 *          1500 мс; внутри улица в режиме чертежа
 *   300+60k линии чертежа рисуются (1300 мс каждая)
 *   2100   в телефоне каркас, чертёж гаснет
 *   3000   каркас заполняется сайтом; прокрутка сайта через 1.6 с
 *   3200   текст после поворота (CSS `.turned .turn-after`)
 *   3800   рука проявляется + наезд камеры на продукт, улица в тень
 *   4200   `.ready` (колода)
 *
 * Сайт в телефоне и рука — один наезд (`--zoom`) с общей точкой опоры
 * (50% ширины, 70% высоты); пока рука скрыта, она без анимации встаёт в
 * финальную позицию (turn.css). Модуль заменяемый: колода знает о нём
 * только как о `FilmDriver`.
 *
 * Меньше движения: всё сразу в финальное состояние, переходы 200 мс.
 * Облегчённая версия (`lite`): без раскрытия и чертежа — кроссфейд сразу
 * в готовый сайт в руке, тот же смысл.
 */

const AT_WIRE = 2100;
const AT_FILL = 3000;
const AT_DONE = 3800;

/** Окна и витрины на фото улицы (доли кадра 1344×752): [x, y, w, h]. */
const WROI: [number, number, number, number][] = [
  [0.005, 0.3, 0.235, 0.44],
  [0.305, 0.37, 0.205, 0.33],
  [0.59, 0.37, 0.15, 0.26],
  [0.76, 0.41, 0.22, 0.26],
];
/** Вывески, карнизы, фонари — прямоугольники чертежа поверх окон. */
const BP_RECTS: [number, number, number, number][] = [
  [0.345, 0.02, 0.07, 0.14],
  [0.475, 0.03, 0.05, 0.13],
  [0.82, 0.08, 0.035, 0.12],
  [0.965, 0.13, 0.025, 0.1],
  [0.03, 0.0, 0.12, 0.11],
];
/** Линии карнизов, тротуара и простенков: [x1, y1, x2, y2]. */
const BP_LINES: [number, number, number, number][] = [
  [0, 0.29, 1, 0.29],
  [0, 0.72, 1, 0.72],
  [0, 0.765, 1, 0.75],
  [0.28, 0.0, 0.28, 0.72],
  [0.565, 0.2, 0.565, 0.72],
  [0.755, 0.22, 0.755, 0.72],
  [0.932, 0.08, 0.932, 0.7],
  [0.57, 0.2, 0.74, 0.2],
  [0.755, 0.27, 0.96, 0.27],
];
const STREET_W = 1344;
const STREET_H = 752;

export class TurnScene implements FilmDriver {
  private readonly root: HTMLElement;
  private readonly reveal: HTMLElement;
  private readonly product: HTMLElement;
  private readonly bp: SVGSVGElement;
  private timers: number[] = [];
  private reduced = false;
  private lite: boolean;

  constructor(root: HTMLElement, options: { lite: boolean }) {
    const q = <T extends Element>(sel: string) => {
      const el = root.querySelector<T>(sel);
      if (!el) throw new Error(`Поворот: нет элемента ${sel}`);
      return el;
    };
    this.root = root;
    this.reveal = q<HTMLElement>(".reveal");
    this.product = q<HTMLElement>(".product");
    this.bp = q<SVGSVGElement>(".reveal .bp");
    this.lite = options.lite;
  }

  setLite(lite: boolean): void {
    this.lite = lite;
  }

  /** Состояние киноплана от колоды; поворот — только на `open`. */
  set(state: FilmState, ctx: { reduced: boolean }): void {
    this.reduced = ctx.reduced;
    this.clear();
    this.root.dataset.film = state;
    if (state === "open") {
      this.layout();
      if (this.root.classList.contains("built") || this.lite) this.setFinal();
      else this.play();
    } else {
      this.reset(state !== "calm");
    }
  }

  /** Полный поворот с первого кадра. */
  play(): void {
    const { reveal, product } = this;
    reveal.classList.remove("bp-on", "bp-out");
    product.classList.remove("wire", "fill");
    const photo = this.root.querySelector("[data-card-photo]");
    const r = photo?.getBoundingClientRect();
    reveal.classList.add("instant", "bp-on");
    reveal.style.opacity = "1";
    if (r) reveal.style.clipPath = this.insetFor(r);
    this.drawBlueprint();
    void reveal.offsetWidth;
    reveal.classList.remove("instant");
    requestAnimationFrame(() => {
      reveal.style.clipPath = "inset(0px 0px 0px 0px round 0px)";
    });
    this.later(() => {
      product.classList.add("wire");
      reveal.classList.add("bp-out");
    }, AT_WIRE);
    this.later(() => product.classList.add("fill"), AT_FILL);
    this.later(() => this.finish(), AT_DONE);
  }

  /** Сразу финальное состояние: сайт в руке, улица в тени. */
  setFinal(): void {
    this.product.classList.add("wire", "fill");
    this.reveal.style.opacity = "0";
    this.finish();
  }

  /** Сброс в исходное (уход с поворота). `forget` — следующий приход сыграет поворот заново. */
  reset(forget = true): void {
    this.clear();
    this.reveal.style.opacity = "0";
    this.reveal.classList.remove("bp-on", "bp-out");
    this.reveal.style.clipPath = "inset(50% 50% 50% 50%)";
    this.product.classList.remove("wire", "fill");
    if (forget) this.root.classList.remove("built");
  }

  /** Вырезки из фото улицы для сайта в телефоне — под текущий размер экрана телефона. */
  layout(): void {
    const w = this.product.offsetWidth;
    const h = this.product.offsetHeight;
    if (!w || !h) return;
    const crop = (key: string, roi: (typeof WROI)[number], bw: number, bh: number, zoom = 1) => {
      const el = this.product.querySelector<HTMLElement>(`[data-crop="${key}"]`);
      if (!el) return;
      const rw = roi[2] * STREET_W;
      const rh = roi[3] * STREET_H;
      const k = Math.max(bw / (rw * 0.9), bh / (rh * 0.95)) * zoom;
      el.style.backgroundSize = `${STREET_W * k}px ${STREET_H * k}px`;
      el.style.backgroundPosition = `${bw / 2 - (roi[0] * STREET_W + rw / 2) * k}px ${bh / 2 - (roi[1] * STREET_H + rh / 2) * k}px`;
    };
    crop("hero", WROI[1], w, h * 0.58, 1.05);
    const pw = (w * 0.86 - w / 28) / 2;
    crop("ph1", WROI[2], pw, pw * 1.25);
    crop("ph2", WROI[0], pw, pw * 1.25, 1.2);
  }

  dispose(): void {
    this.clear();
  }

  private finish(): void {
    this.root.dataset.film = "done";
    this.reveal.style.opacity = "0";
    this.root.classList.add("built");
  }

  /** Линии чертежа по окнам, вывескам и карнизам — в координатах фото улицы на экране. */
  private drawBlueprint(): void {
    const still = this.reveal.querySelector(".still");
    if (!still) return;
    const r = still.getBoundingClientRect();
    const P = (x: number, y: number) =>
      `${(r.left + x * r.width).toFixed(1)} ${(r.top + y * r.height).toFixed(1)}`;
    const paths: string[] = [];
    for (const [x, y, w, h] of [...WROI, ...BP_RECTS])
      paths.push(`M${P(x, y)} L${P(x + w, y)} L${P(x + w, y + h)} L${P(x, y + h)} Z`);
    for (const [x, y, w, h] of WROI) paths.push(`M${P(x + w / 2, y)} L${P(x + w / 2, y + h)}`);
    for (const [x1, y1, x2, y2] of BP_LINES) paths.push(`M${P(x1, y1)} L${P(x2, y2)}`);
    this.bp.innerHTML = paths
      .map((d, k) => `<path pathLength="1" style="--k:${k}" d="${d}"/>`)
      .join("");
  }

  private insetFor(r: DOMRect): string {
    const W = window.innerWidth;
    const H = window.innerHeight;
    return `inset(${r.top}px ${W - r.right}px ${H - r.bottom}px ${r.left}px round 6px)`;
  }

  private later(fn: () => void, ms: number): void {
    this.timers.push(window.setTimeout(fn, this.reduced ? 0 : ms));
  }

  private clear(): void {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }
}

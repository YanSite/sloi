import { StageNavigator } from "@/components/wow/motion";
import type { EcpStageContent, ScreenIndex } from "./content-types";
import { bindLeadForm, focusFirstField } from "./form/form";

/**
 * КОНТРОЛЛЕР КОЛОДЫ — порт сценария прототипа v31: один жест — один
 * экран, первый свайп на 01 меняет кадр, а не экран; блокировка после
 * перехода; «Дальше», меню, точки; сигнал «можно дальше» (`.ready`).
 *
 * Жесты (колесо / трекпад / свайп / клавиши) распознаёт `StageNavigator`
 * ядра в режиме колоды (`discrete`): он отдаёт шаг в `intercept`, где
 * колода решает, поглотить ли его (блокировка, шаг внутри экрана), и
 * сообщает о смене экрана в `onBeatChange`. Всё состояние — классы и
 * атрибуты на корне `.ecp`, как прототип держал их на `<html>`.
 */

/** Состояния киноплана (`data-film`): 01 hand → 02 scroll → 03 glow → 04 open/done; дальше calm; 07 street. */
export type FilmState = "street" | "hand" | "scroll" | "glow" | "open" | "done" | "calm";

/** Экран поворота. */
export const TURN = 3;
/** Через сколько экран «договорил» и стрелка «Дальше» оживает, ms (02_SCREENS). */
const READY = [2400, 3600, 2200, 4200, 3000, 3000, 3400, 2600];
/** Сигнал после первого свайпа на 01 (03_MOTION). */
const READY_S1 = 1700;
const LOCK_MS = 1000;
/** Поворот при первом проходе: блокировка дольше, чтобы его не пролистнули. */
const LOCK_TURN_MS = 2000;
const LOCK_REDUCED_MS = 300;
/** Блокировка после шага внутри 01. */
const LOCK_S1_MS = 1100;
const LOCK_SKIP_MS = 500;
/** Уходящий экран держит `.leaving` на время `aOut`. */
const LEAVE_MS = 440;
const LEAVE_REDUCED_MS = 220;
const SIGNS_AT = 1100;
const SIGNS_STEP = 650;
const STEPS_AT = 900;
const STEPS_STEP = 800;
/** Вступление проекта (03_MOTION): пролёт через 1150 мс, макро гаснет к 1100 мс после, `.ready` — к 1800. */
const MAC_THRU_AT = 1150;
const MAC_CLEAR_AFTER = 1100;
const MAC_READY_AFTER = 1800;
/** Проекты — экраны 4 и 5; у второго фон темнеет синхронно с чёрным кадром в телефоне (`.ckrun`). */
const CASES = [4, 5];
const BAKERY = 5;

/** Ввод по docs/02_SCREENS: колесо — накопление > 40, сброс через 220 мс тишины; свайп > 44px. */
const INPUT = {
  wheelThreshold: 40,
  touchThresholdPx: 44,
  gestureGapMs: [220, 220] as [number, number],
};

/** Сцена, которой колода передаёт смену состояний киноплана (подключается шагами 1–2). */
export interface FilmDriver {
  set(state: FilmState, ctx: { reduced: boolean }): void;
  /** Пересчёт геометрии на resize. */
  layout?(): void;
}

/** Проекты (05): кадр вступления и догрузка медиа витрин. */
export interface CasesDriver {
  /** URL макро-кадра вступления по ключу медиа из `data-mac`. */
  macroUrl(key: string): string;
  /** Подставить медиа витрин, если фоновая догрузка ещё не успела. */
  ensureMedia(): void;
}

export interface DeckOptions {
  reduced: boolean;
  /** Облегчённая версия: проекты без вступления (статичные стены — CSS `.lite`). */
  lite?: boolean;
  film?: FilmDriver;
  cases?: CasesDriver;
}

export class DeckController {
  private readonly root: HTMLElement;
  private readonly deck: HTMLElement;
  private readonly screens: HTMLElement[];
  private readonly foot: EcpStageContent["foot"];
  private readonly nav: StageNavigator;
  private readonly film?: FilmDriver;
  private readonly cases?: CasesDriver;
  private readonly mac: HTMLElement | null;
  private reduced: boolean;
  private lite: boolean;

  private cur = 0;
  private s1done = false;
  private turned = false;
  private lockUntil = 0;
  private menuOpen = false;
  private sheetOpen = false;
  /** Кто открыл форму — туда возвращается фокус. */
  private sheetFrom: HTMLElement | null = null;
  /** Пропуск вступления проекта: пока задан, шаг вперёд пропускает вступление (шаг 3). */
  private skipIntro: (() => void) | null = null;
  private timers: number[] = [];
  /** Таймеры вступления проекта — живут дольше `sceneFor` (пролёт не сбрасывается сменой `.ready`). */
  private flyTimers: number[] = [];
  private cleanups: (() => void)[] = [];

  constructor(root: HTMLElement, foot: EcpStageContent["foot"], options: DeckOptions) {
    this.root = root;
    const deck = root.querySelector<HTMLElement>(".deck");
    if (!deck) throw new Error("Колода: нет элемента .deck");
    this.deck = deck;
    this.screens = Array.from(this.deck.querySelectorAll<HTMLElement>(".screen"));
    this.foot = foot;
    this.film = options.film;
    this.cases = options.cases;
    this.mac = root.querySelector<HTMLElement>(".mac");
    this.reduced = options.reduced;
    this.lite = options.lite ?? false;
    this.nav = new StageNavigator({
      beats: this.screens.map((_, i) => ({ p: i })),
      transitions: [],
      baseDurationMs: 0,
      discrete: true,
      input: INPUT,
      intercept: (dir) => this.intercept(dir),
      paused: () => this.menuOpen || this.sheetOpen,
      onBeatChange: (i, dir) => this.goTo(i, dir),
    });
  }

  attach(): () => void {
    this.root.classList.toggle("rm", this.reduced);
    this.cleanups.push(this.nav.attach());

    this.on(this.root, "click", (e) => {
      const t = e.target instanceof Element ? e.target : null;
      const go = t?.closest<HTMLElement>("[data-go]");
      if (go) {
        e.preventDefault();
        const i = Number(go.dataset.go);
        if (this.menuOpen) this.setMenu(false);
        if (i > TURN) this.turned = true;
        this.nav.go(i);
        return;
      }
      if (t?.closest("[data-next]")) {
        this.lockUntil = 0;
        this.nav.step(1);
        return;
      }
      const sheetBtn = t?.closest<HTMLElement>("[data-sheet]");
      if (sheetBtn) {
        this.setSheet(true, sheetBtn);
        return;
      }
      if (t?.closest("[data-close]")) {
        this.setSheet(false);
        return;
      }
      if (t?.closest(".mac") && this.skipIntro) {
        this.skipIntro();
        return;
      }
      const menu = t?.closest<HTMLElement>("[data-menu]");
      if (menu) this.setMenu(menu.dataset.menu === "open");
    });
    this.on(window, "keydown", (e) => {
      if ((e as KeyboardEvent).key !== "Escape") return;
      if (this.sheetOpen) this.setSheet(false);
      else if (this.menuOpen) this.setMenu(false);
    });
    this.on(window, "resize", () => {
      this.film?.layout?.();
      this.sceneFor(this.cur);
    });

    const form = this.root.querySelector<HTMLFormElement>(".sheet form");
    if (form) this.cleanups.push(bindLeadForm(form));

    this.film?.layout?.();
    this.sceneFor(0);
    this.updateChrome();
    return () => {
      this.clearTimers();
      this.clearFly();
      this.cleanups.forEach((fn) => fn());
      this.cleanups = [];
    };
  }

  setLite(lite: boolean): void {
    this.lite = lite;
  }

  setReduced(reduced: boolean): void {
    if (reduced === this.reduced) return;
    this.reduced = reduced;
    this.root.classList.toggle("rm", reduced);
    this.sceneFor(this.cur);
  }

  /** Шаг от пользователя до навигации: true — поглощён. */
  private intercept(dir: number): boolean {
    if (this.skipIntro && dir > 0) {
      this.skipIntro();
      this.lock(LOCK_SKIP_MS);
      return true;
    }
    if (performance.now() < this.lockUntil) return true;
    if (this.cur === 0 && dir > 0 && !this.s1done) {
      this.setPulled(true);
      this.root.classList.remove("ready");
      this.later(() => this.root.classList.add("ready"), READY_S1);
      return true;
    }
    if (this.cur === 0 && dir < 0 && this.s1done) {
      this.setPulled(false);
      return true;
    }
    return false;
  }

  /** 01: первый свайп — «онлайн»: свет гаснет, цвет уходит; свайп назад возвращает. */
  private setPulled(on: boolean): void {
    this.s1done = on;
    this.screens[0].classList.toggle("pulled", on);
    this.root.classList.toggle("s1p", on);
    this.lock(this.reduced ? LOCK_REDUCED_MS : LOCK_S1_MS);
    this.updateChrome();
  }

  private goTo(i: number, dirNum: number): void {
    const dir = dirNum > 0 ? "next" : "prev";
    const from = this.screens[this.cur];
    const to = this.screens[i];
    this.deck.dataset.dir = dir;
    from.classList.remove("active");
    from.classList.add("leaving");
    window.setTimeout(
      () => from.classList.remove("leaving"),
      this.reduced ? LEAVE_REDUCED_MS : LEAVE_MS,
    );
    this.cur = i;
    if (i === TURN) {
      this.turned = true;
      to.classList.add("turned");
    }
    if (i === 0) this.s1done = dir === "prev";
    to.classList.add("active");
    this.sceneFor(i);
    const firstTurn = i === TURN && !this.root.classList.contains("built");
    this.lock(this.reduced ? LOCK_REDUCED_MS : firstTurn ? LOCK_TURN_MS : LOCK_MS);
    this.updateChrome();
  }

  /** Сценарий экрана: состояние киноплана, фон второго акта, поочерёдные появления, `.ready`. */
  private sceneFor(i: number): void {
    this.clearTimers();
    const root = this.root;
    if (i !== 0) root.classList.remove("s1p");
    root.classList.remove("ready");
    this.later(() => root.classList.add("ready"), READY[i] ?? 2500);
    if (!CASES.includes(i)) {
      this.clearFly();
      if (this.mac) this.mac.className = "mac";
      this.skipIntro = null;
      root.classList.remove("ckrun");
    }

    const s1 = this.screens[0];
    if (i === 0) {
      s1.classList.toggle("pulled", this.s1done);
      root.classList.toggle("s1p", this.s1done);
      this.setFilm("hand");
    } else if (i === 1) {
      const signs = this.screens[1].querySelectorAll(".signs li");
      signs.forEach((li) => li.classList.remove("on"));
      this.setFilm("scroll");
      signs.forEach((li, n) => this.later(() => li.classList.add("on"), SIGNS_AT + n * SIGNS_STEP));
    } else if (i === 2) {
      this.setFilm("glow");
    } else if (i === TURN) {
      this.setFilm(this.turned ? "open" : "glow");
    } else if (CASES.includes(i)) {
      this.setFilm("calm");
      this.caseIn(this.screens[i], i);
    } else if (i === 6) {
      this.setFilm("calm");
      this.screens[6].querySelectorAll(".steps li").forEach((li, n) => {
        li.classList.remove("on");
        this.later(() => li.classList.add("on"), STEPS_AT + n * STEPS_STEP);
      });
    } else {
      this.setFilm("street");
    }
    const act = this.screens[i].dataset.act;
    if (act) root.dataset.act = act;
    else delete root.dataset.act;
  }

  /**
   * Проект: вступление «макро → пролёт насквозь» (только вперёд, не при
   * «меньше движения» и не в облегчённой версии), затем витрина. Касание
   * или свайп во время вступления — сразу пролёт.
   */
  private caseIn(sc: HTMLElement, i: number): void {
    this.clearFly();
    this.screens.forEach((x) => x.classList.remove("run", "arrive", "pre"));
    this.root.classList.remove("ckrun");
    this.cases?.ensureMedia();
    const mac = this.mac;
    const forward = this.deck.dataset.dir !== "prev";
    const start = () => {
      this.skipIntro = null;
      sc.classList.remove("pre");
      sc.classList.add("run");
      if (i === BAKERY) this.root.classList.add("ckrun");
    };
    if (!mac || this.reduced || this.lite || !forward) {
      if (mac) mac.className = "mac";
      start();
      return;
    }
    sc.classList.add("pre");
    const img = mac.querySelector<HTMLElement>(".mac-i");
    const pos = sc.dataset.macPos ?? "50% 50%";
    if (img) {
      img.style.backgroundImage = `url("${this.cases?.macroUrl(sc.dataset.mac ?? "") ?? ""}")`;
      img.style.backgroundPosition = pos;
      img.style.transformOrigin = pos;
    }
    const cap = mac.querySelector(".mac-t .cap");
    const title = mac.querySelector(".mac-t b");
    if (cap) cap.textContent = sc.dataset.macCap ?? "";
    if (title) title.textContent = sc.dataset.macTitle ?? "";
    let went = false;
    const go = () => {
      if (went) return;
      went = true;
      this.clearFly();
      mac.classList.add("thru");
      sc.classList.add("arrive");
      start();
      this.flyTimers.push(window.setTimeout(() => (mac.className = "mac"), MAC_CLEAR_AFTER));
      this.flyTimers.push(
        window.setTimeout(() => {
          sc.classList.remove("arrive");
          this.root.classList.add("ready");
        }, MAC_READY_AFTER),
      );
    };
    this.skipIntro = go;
    mac.className = "mac";
    void mac.offsetWidth;
    mac.classList.add("on");
    this.flyTimers.push(window.setTimeout(go, MAC_THRU_AT));
  }

  private setFilm(state: FilmState): void {
    if (this.film) this.film.set(state, { reduced: this.reduced });
    else this.root.dataset.film = state;
  }

  private updateChrome(): void {
    const sc = this.screens[this.cur];
    const block = sc.dataset.block ?? "";
    const curEl = this.root.querySelector<HTMLElement>("[data-cur]");
    if (curEl && curEl.textContent !== block) {
      curEl.textContent = block;
      curEl.classList.remove("roll");
      void curEl.offsetWidth;
      if (!this.reduced) curEl.classList.add("roll");
    }
    this.root.classList.toggle(
      "revealed-on",
      (this.cur === TURN && this.turned) || sc.dataset.world === "revealed",
    );
    const next = this.root.querySelector<HTMLElement>("[data-next]");
    if (next) next.hidden = this.cur === this.screens.length - 1;
    const hint0 = this.cur === 0 && !this.s1done;
    const label = this.root.querySelector<HTMLElement>("[data-next-label]");
    const text = hint0
      ? this.foot.swipe
      : (this.foot.nextTo[this.cur as ScreenIndex] ?? this.foot.next);
    // Только при изменении: перезапись того же текста — новый кандидат LCP.
    if (label && label.textContent !== text) label.textContent = text;
    this.root.classList.toggle("hint-on", hint0);
    this.root
      .querySelectorAll<HTMLElement>(".ticks [data-go], .navlinks [data-go]")
      .forEach((b) => {
        b.setAttribute("aria-current", Number(b.dataset.go) === this.cur ? "true" : "false");
      });
    this.screens.forEach((s, i) => {
      const on = i === this.cur;
      s.setAttribute("aria-hidden", on ? "false" : "true");
      s.inert = !on;
    });
  }

  private setMenu(open: boolean): void {
    this.menuOpen = open;
    const menu = this.root.querySelector<HTMLElement>(".menu");
    const openBtn = this.root.querySelector<HTMLElement>('[data-menu="open"]');
    if (!menu || !openBtn) return;
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");
    menu.inert = !open;
    openBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) menu.querySelector<HTMLElement>('[data-menu="close"]')?.focus();
    else openBtn.focus();
  }

  /**
   * Форма в нижней шторке. Пока открыта — колода, шапка и нижняя строка
   * `inert` (фокус не уходит за шторку), жесты не листают экраны.
   */
  private setSheet(open: boolean, from?: HTMLElement): void {
    const sheet = this.root.querySelector<HTMLElement>(".sheet");
    if (!sheet) return;
    this.sheetOpen = open;
    sheet.classList.toggle("open", open);
    sheet.setAttribute("aria-hidden", open ? "false" : "true");
    sheet.inert = !open;
    this.root.querySelectorAll<HTMLElement>(".deck, .head, .foot, .ticks").forEach((el) => {
      el.inert = open;
    });
    const form = sheet.querySelector<HTMLFormElement>("form");
    if (open) {
      this.sheetFrom = from ?? null;
      if (form) this.timers.push(focusFirstField(form));
    } else {
      this.sheetFrom?.focus();
      this.sheetFrom = null;
    }
  }

  private lock(ms: number): void {
    this.lockUntil = performance.now() + ms;
  }

  private later(fn: () => void, ms: number): void {
    this.timers.push(window.setTimeout(fn, this.reduced ? 0 : ms));
  }

  private clearFly(): void {
    this.flyTimers.forEach(clearTimeout);
    this.flyTimers = [];
  }

  private clearTimers(): void {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }

  private on<K extends keyof WindowEventMap>(
    target: Window | HTMLElement,
    type: K,
    handler: (e: Event) => void,
  ): void {
    target.addEventListener(type, handler);
    this.cleanups.push(() => target.removeEventListener(type, handler));
  }
}

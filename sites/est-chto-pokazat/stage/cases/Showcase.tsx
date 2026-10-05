import type { BakerySite, CaseScreen, FlowerSite } from "../content-types";
import { StatusBar } from "../Film";

/**
 * ВИТРИНА ПРОЕКТА (05): по бокам телефона — коридор-выставка из слайдов
 * концепта (две стены rotateY ±74°, слайды плывут навстречу, дальний край
 * растворяется маской), в центре — CSS-телефон iPhone 15 Pro, экран
 * которого собран кодом, а не скриншотом.
 *
 * Тяжёлые картинки не грузятся с первым экраном: у элементов только
 * `data-media="<ключ>[.<индекс>]"`, файл подставляет фоновая догрузка
 * (`heavy.ts`), пока посетитель на 01–03.
 */

type Kind = "flowers" | "bakery";

/** Слайды повторяются дважды подряд — бесшовный цикл `translateX(∓50%)`. */
function Wall({ side, kind, count }: { side: "wl" | "wr"; kind: Kind; count: number }) {
  const key = kind === "flowers" ? "flowersSlides" : "bakerySlides";
  return (
    <div className={`wall ${side}`}>
      <div className="strip">
        {[0, 1].flatMap((round) =>
          Array.from({ length: count }, (_, i) => (
            <i key={`${round}-${i}`} data-media={`${key}.${i}`} />
          )),
        )}
      </div>
    </div>
  );
}

function FlowerScreen({ s }: { s: FlowerSite }) {
  return (
    <div className="scr fl">
      <div className="fl-app">
        <div className="fl-hero">
          {/* eslint-disable-next-line @next/next/no-img-element -- кадр сцены; файл подставляет фоновая догрузка */}
          <img data-media="flowersBouquet" alt="" decoding="async" draggable={false} />
        </div>
        <div className="fl-hd">
          <span>{s.brand}</span>
          <b>{s.cta}</b>
        </div>
        <div className="fl-txt">
          <div className="fl-title">
            <span>{s.title[0]}</span>
            <i>{s.title[1]}</i>
          </div>
          <p>{s.lead}</p>
          <small>{s.note}</small>
        </div>
      </div>
      <StatusBar />
      <i className="hbar" />
    </div>
  );
}

function Lines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((l, i) => (
        <span key={l}>
          {i > 0 && <br />}
          {l}
        </span>
      ))}
    </>
  );
}

function BakeryScreen({ s }: { s: BakerySite }) {
  return (
    <div className="scr ck">
      <div className="ckf ck-a">
        <div className="ck-glow" />
        <h6>
          <Lines lines={s.warm} />
        </h6>
        {/* eslint-disable-next-line @next/next/no-img-element -- кадр сцены; файл подставляет фоновая догрузка */}
        <img className="ck-c" data-media="bakeryCookie" alt="" decoding="async" draggable={false} />
      </div>
      <div className="ckf ck-b">
        <span className="ck-n">{s.dessertIndex}</span>
        <h6>
          <Lines lines={s.dessert} />
        </h6>
        {/* eslint-disable-next-line @next/next/no-img-element -- кадр сцены; файл подставляет фоновая догрузка */}
        <img
          className="ck-o"
          data-media="bakeryDessert"
          alt=""
          decoding="async"
          draggable={false}
        />
      </div>
      <div className="ckf ck-c3">
        <h6>
          <Lines lines={s.warm} />
        </h6>
        {/* eslint-disable-next-line @next/next/no-img-element -- кадр сцены; файл подставляет фоновая догрузка */}
        <img className="ck-c" data-media="bakeryCookie" alt="" decoding="async" draggable={false} />
        <div className="ck-cta">
          <span className="ck-h">{s.hours}</span>
          <b>{s.order}</b>
          <u>{s.route}</u>
        </div>
      </div>
      <StatusBar />
      <i className="hbar" />
    </div>
  );
}

export function Showcase({ project }: { project: CaseScreen }) {
  const site = project.site;
  const kind: Kind = site.kind;
  const count = kind === "flowers" ? 9 : 12;
  return (
    <div className="dev">
      <div
        className={kind === "flowers" ? "stage back st-fl" : "stage back st-fl st-ckc"}
        aria-hidden="true"
      >
        {kind === "bakery" && <i className="orb" />}
        <div className="corr">
          <Wall side="wl" kind={kind} count={count} />
          <Wall side="wr" kind={kind} count={count} />
        </div>
      </div>
      <div className="phone" aria-hidden="true">
        {site.kind === "flowers" ? <FlowerScreen s={site} /> : <BakeryScreen s={site} />}
      </div>
    </div>
  );
}

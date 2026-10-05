import type { CSSProperties } from "react";
import type { MediaFile, ResolvedMedia } from "./content-types";

/**
 * КИНОПЛАН — общий фоновый слой первой половины (`data-film` на корне):
 * улица с живыми окнами, рука с телефоном и лентой серых карточек
 * (01), 3D-поле одинаковых карточек (02), карточка «вашего места»,
 * поднимающаяся из поля со светом (03). Всё — CSS по состоянию; геометрия
 * руки и экрана телефона — CSS-переменные корня (`film.css`), поэтому
 * первый кадр верен до гидратации.
 */

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/** Поле 7×14 карточек; «ваше место» — 4-я в 7-м ряду, как в прототипе. */
const PLANE_COLS = 7;
const PLANE_ROWS = 14;
const PLANE_ME = PLANE_COLS * 6 + 3;
/** Лента в телефоне: 10 карточек, «ваше место» — четвёртая. */
const FEED = 10;
const FEED_OURS = 3;

/** Самая крупная версия файла (WebP): фото, которые на экране шире оригинала. */
const largest = (m: MediaFile) => m.set[m.set.length - 1]?.url ?? m.src;

function Img({
  m,
  className,
  priority,
  sizes,
}: {
  m: MediaFile;
  className?: string;
  priority?: boolean;
  /** Есть `sizes` — браузер выбирает версию сам; иначе самая крупная. */
  sizes?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- слой сцены: размеры и кадр задаёт CSS сцены, обёртка next/image мешает
    <img
      className={className}
      src={sizes ? m.src : largest(m)}
      srcSet={sizes ? m.srcSet : undefined}
      sizes={sizes}
      width={m.width}
      height={m.height}
      alt={m.alt}
      decoding="async"
      draggable={false}
      fetchPriority={priority ? "high" : undefined}
    />
  );
}

/** Вечерняя улица с огнями в окнах и бликами на асфальте. `id` — для раскрытия поворота. */
export function Still({ m, id, priority }: { m: MediaFile; id?: string; priority?: boolean }) {
  return (
    <div className="still" data-still={id}>
      <Img m={m} priority={priority} />
      <i className="glow g1" />
      <i className="glow g2" />
      <i className="glow g3" />
      <i className="glow g4" />
      <i className="wet" />
    </div>
  );
}

export function StatusBar() {
  return (
    <>
      <div className="sbar" aria-hidden="true">
        <span className="sb-t">9:41</span>
        <i className="sb-isl" />
        <span className="sb-ic">
          <svg viewBox="0 0 18 12">
            <rect x="0" y="8" width="3" height="4" rx=".7" />
            <rect x="5" y="5.5" width="3" height="6.5" rx=".7" />
            <rect x="10" y="3" width="3" height="9" rx=".7" />
            <rect x="15" y="0" width="3" height="12" rx=".7" />
          </svg>
          <svg viewBox="0 0 16 12">
            <path d="M8 11.6 5.6 9.1a3.4 3.4 0 0 1 4.8 0z" />
            <path d="M3.4 6.9a6.5 6.5 0 0 1 9.2 0l-1.3 1.3a4.7 4.7 0 0 0-6.6 0z" />
            <path d="M1.2 4.7a9.6 9.6 0 0 1 13.6 0l-1.3 1.3a7.8 7.8 0 0 0-11 0z" />
          </svg>
          <span className="sb-bat">
            <i />
          </span>
        </span>
      </div>
    </>
  );
}

function Lines({ tag = "i", n = 3 }: { tag?: "i"; n?: number }) {
  const T = tag;
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <T key={i} />
      ))}
    </>
  );
}

export function Film({ media }: { media: ResolvedMedia }) {
  const poster = media.poster;
  return (
    <div className="film" aria-hidden="true">
      <div className="bgv">
        <Still m={media.street} priority />
      </div>
      <div className="fscrim" />
      <div className="hand">
        <picture>
          <source media="(min-width: 900px)" srcSet={largest(media.phoneLandscape)} />
          <Img m={media.phonePortrait} className="hand-img" priority />
        </picture>
        <div className="hscrim" />
        <div className="pscr">
          <StatusBar />
          <i className="hbar" aria-hidden="true" />
          <div className="feed">
            {Array.from({ length: FEED }, (_, k) => (
              <div key={k} className={k === FEED_OURS ? "card ours" : "card"}>
                <div className="th">{k === FEED_OURS && <Img m={poster} sizes="40vw" />}</div>
                <div className="ln">
                  <Lines />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="c3d">
        <div className="plane">
          {Array.from({ length: PLANE_COLS * PLANE_ROWS }, (_, k) => (
            <div key={k} className={k === PLANE_ME ? "card3 me" : "card3"}>
              <div className="t">{k === PLANE_ME && <Img m={poster} sizes="80px" />}</div>
              <div className="l">
                <Lines />
              </div>
            </div>
          ))}
        </div>
        <div className="c3d-scrim" />
        <div className="hlight" aria-hidden="true">
          <i className="hl-glow" />
          <i className="hl-rays" />
        </div>
        <div className="hcard">
          <i className="hc-glare" />
          <div className="hc-th" data-card-photo>
            <Img m={poster} sizes="(min-width: 900px) 420px, 82vw" />
          </div>
          <div className="hc-ln">
            <b />
            <i />
            <i className="s" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Фоны из CSS: размытая копия фото руки под ним (моб.), фото улицы для вырезок сайта в телефоне (04). */
export const filmVars = (media: ResolvedMedia) =>
  v({
    "--phone-v": `url(${largest(media.phonePortrait)})`,
    "--street": `url(${largest(media.street)})`,
  });

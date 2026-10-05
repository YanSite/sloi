import type { EcpStageContent } from "./content-types";

/**
 * Постоянные элементы поверх колоды: шапка (логотип, ссылки, «+»),
 * меню на мобильном, нижняя строка «Дальше» + счётчик, точки справа на
 * десктопе, подсказка жеста. Поведение — контроллер колоды по
 * `data-go` / `data-menu` / id элементов.
 */

const SCREEN_COUNT = 8;

function Logo({ c }: { c: EcpStageContent }) {
  return (
    <a className="logo" href="#" data-go="0" aria-label={c.brand.homeAria}>
      <span className="logo__rule" />
      <span className="logo__word">
        {c.brand.lines.map((line, i) => (
          <span key={line}>
            {i > 0 && <br />}
            {line}
            {/* Пробел для доступного имени: «Есть что показать», а не «Естьчтопоказать». */}
            {i < c.brand.lines.length - 1 && " "}
          </span>
        ))}
      </span>
    </a>
  );
}

function Plus({ rotate }: { rotate?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
      style={rotate ? { transform: "rotate(45deg)" } : undefined}
    >
      <line x1="0" y1="9" x2="18" y2="9" />
      <line x1="9" y1="0" x2="9" y2="18" />
    </svg>
  );
}

export function Header({ c }: { c: EcpStageContent }) {
  return (
    <header className="head">
      <div className="wrap">
        <Logo c={c} />
        <nav className="navlinks" aria-label={c.nav.label}>
          {c.nav.links.map((l) => (
            <a key={l.label} href="#" data-go={l.screen} aria-current="false">
              {l.label}
            </a>
          ))}
        </nav>
        <button
          className="toggle"
          type="button"
          data-menu="open"
          aria-expanded="false"
          aria-controls="ecp-menu"
          aria-label={c.nav.menuAria.open}
        >
          <Plus />
        </button>
      </div>
    </header>
  );
}

export function Menu({ c }: { c: EcpStageContent }) {
  return (
    <div className="menu" id="ecp-menu" aria-hidden="true" inert>
      <div className="wrap top">
        <Logo c={c} />
        <button
          className="toggle"
          type="button"
          data-menu="close"
          aria-label={c.nav.menuAria.close}
        >
          <Plus rotate />
        </button>
      </div>
      <div className="wrap">
        <ul>
          {c.nav.links.map((l) => (
            <li key={l.label}>
              <button type="button" data-go={l.screen}>
                <span className="idx">{l.idx}</span>
                <span>{l.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="wrap tag">{c.brand.tagline}</div>
    </div>
  );
}

export function Foot({ c }: { c: EcpStageContent }) {
  return (
    <>
      <div className="swipehint" aria-hidden="true">
        <div className="track" />
        <span className="t">{c.swipeHint.touch}</span>
        <span className="m">{c.swipeHint.wheel}</span>
      </div>
      <div className="foot">
        <div className="wrap">
          <div className="row">
            <button className="next" type="button" data-next>
              <span data-next-label>{c.foot.swipe}</span>
              <i />
            </button>
            <span className="counter" aria-live="polite">
              <span className="cur">
                <span data-cur>01</span>
              </span>
              <span>{c.foot.total}</span>
            </span>
          </div>
        </div>
      </div>
      <nav className="ticks" aria-label={c.nav.ticksLabel}>
        {Array.from({ length: SCREEN_COUNT }, (_, i) => (
          <button
            key={i}
            type="button"
            data-go={i}
            aria-label={c.nav.tickAria.replace("{n}", String(i + 1))}
            aria-current={i === 0 ? "true" : "false"}
          >
            <span />
          </button>
        ))}
      </nav>
    </>
  );
}

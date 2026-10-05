import type { TurnDemo } from "../content-types";

/**
 * «Кофейня на углу» — сайт вымышленного заведения внутри телефона на
 * повороте. ВРЕМЕННОЕ решение (08_OPEN_QUESTIONS, п. 1: отступление от
 * решения №23 стратегии) — модуль заменяемый: сцена поворота знает о нём
 * только `.pv` (страница, медленно прокручивается) и `[data-crop]`
 * (вырезки из фото улицы, раскладываются сценой под размер экрана).
 */
export function CornerCafe({ d }: { d: TurnDemo }) {
  return (
    <div className="pv">
      <div className="p-hero">
        <div className="p-img" data-crop="hero" />
        <div className="p-shade" />
        <div className="p-top">
          <span className="p-logo">{d.name}</span>
          <span className="p-burger">
            <i />
            <i />
          </span>
        </div>
        <div className="p-cap">
          <span className="p-kick">{d.hours}</span>
          <h4>{d.title}</h4>
          <span className="p-btn">{d.cta}</span>
        </div>
      </div>
      <div className="p-sec">
        <span className="p-kick d">{d.gallery}</span>
        <div className="p-row">
          <i className="p-ph" data-crop="ph1" />
          <i className="p-ph" data-crop="ph2" />
        </div>
      </div>
      <div className="p-sec">
        <span className="p-kick d">{d.todayCap}</span>
        <ul className="p-list">
          {d.today.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

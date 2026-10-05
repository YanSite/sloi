import type { MediaFile, TurnDemo } from "../content-types";
import { Still, StatusBar } from "../Film";
import { CornerCafe } from "./CornerCafe";

/**
 * Слои поворота (04): раскрытие улицы в режиме чертежа и продукт — сайт в
 * экране телефона. Хореография — `turn-scene.ts`; геометрия продукта —
 * прямоугольник экрана телефона из `film.css`.
 */
export function Turn({ street, demo }: { street: MediaFile; demo: TurnDemo }) {
  return (
    <>
      <div className="reveal" aria-hidden="true">
        <div className="v1">
          <Still m={street} id="reveal" />
        </div>
        <svg className="bp" />
      </div>
      <div className="product" aria-hidden="true">
        <StatusBar />
        <div className="p-page">
          <CornerCafe d={demo} />
          <div className="p-wire">
            <i className="w1" />
            <i className="w2" />
            <i className="w3" />
            <i className="w4" />
            <i className="w5" />
            <i className="w6" />
          </div>
        </div>
        <div className="p-url">
          <span className="u-a">аА</span>
          <span className="u-d">
            <svg viewBox="0 0 10 12">
              <rect x="1" y="5" width="8" height="7" rx="1.2" />
              <path d="M3 5V3.4a2 2 0 0 1 4 0V5" fill="none" strokeWidth="1.3" />
            </svg>
            {demo.domain}
          </span>
          <span className="u-r">
            <svg viewBox="0 0 12 12">
              <path d="M10 6a4 4 0 1 1-1.2-2.9" fill="none" strokeWidth="1.2" />
              <path d="M9.6 1v2.6H7" fill="none" strokeWidth="1.2" />
            </svg>
          </span>
        </div>
        <i className="hbar" aria-hidden="true" />
      </div>
    </>
  );
}

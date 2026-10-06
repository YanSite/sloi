import type { LeadForm } from "../content-types";
import { Arrow } from "../screens";

/**
 * ФОРМА в нижней шторке — единственное целевое действие сайта; открывается
 * кнопками `[data-sheet]` с экранов 06 и 07. Поля и тексты — 06_CONTENT_RU.
 * Поведение (канал связи, валидация, согласие, отправка) — `form.ts`.
 * Согласие на обработку ПДн (152-ФЗ) обязательно; ссылка на политику —
 * заглушка, пока страницы нет (08_OPEN_QUESTIONS, п. 4).
 */
export function Sheet({ f, privacyHref }: { f: LeadForm; privacyHref: string }) {
  const first = f.channel.options[0];
  return (
    <div className="sheet" aria-hidden="true" inert>
      <div className="scrim2" data-close />
      <div className="panel" role="dialog" aria-modal="true" aria-labelledby="ecp-sheet-title">
        <div className="wrap">
          <div className="bar">
            {/* Заголовок прижат к верху шторки, в строку с крестиком (решение владельца, 2026-10-06). */}
            <h3 className="h3" id="ecp-sheet-title">
              {f.title}
            </h3>
            <button className="close" type="button" data-close aria-label={f.closeAria}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                aria-hidden="true"
                style={{ transform: "rotate(45deg)" }}
              >
                <line x1="0" y1="9" x2="18" y2="9" />
                <line x1="9" y1="0" x2="9" y2="18" />
              </svg>
            </button>
          </div>
          <form className="form" noValidate>
            <div className="intro">
              <p>{f.sub}</p>
            </div>
            <div className="field" data-field="name">
              <label htmlFor="ecp-f-name">{f.name.label}</label>
              <input
                id="ecp-f-name"
                name="name"
                type="text"
                autoComplete="name"
                aria-describedby="ecp-e-name"
              />
              <span className="err" id="ecp-e-name">
                {f.name.error}
              </span>
            </div>
            <div className="field" data-field="business">
              <label htmlFor="ecp-f-biz">{f.business.label}</label>
              <input
                id="ecp-f-biz"
                name="business"
                type="text"
                placeholder={f.business.placeholder}
                aria-describedby="ecp-e-biz"
              />
              <span className="err" id="ecp-e-biz">
                {f.business.error}
              </span>
            </div>
            <div className="field">
              <label htmlFor="ecp-f-q">
                {f.question.label} <span className="opt">{f.question.optional}</span>
              </label>
              <textarea id="ecp-f-q" name="question" aria-describedby="ecp-h-q" />
              <span className="fhint" id="ecp-h-q">
                {f.question.hint}
              </span>
            </div>
            <fieldset className="field">
              <legend>{f.channel.legend}</legend>
              <div className="choice">
                {f.channel.options.map((o, i) => (
                  <label key={o.value}>
                    <input
                      type="radio"
                      name="channel"
                      value={o.value}
                      defaultChecked={i === 0}
                      data-label={o.field}
                      data-placeholder={o.placeholder}
                      data-mode={o.type}
                    />
                    {o.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="field" data-field="contact">
              <label htmlFor="ecp-f-contact" data-contact-label>
                {first.field}
              </label>
              <input
                id="ecp-f-contact"
                name="contact"
                type="text"
                inputMode={first.type === "text" ? "text" : first.type}
                placeholder={first.placeholder}
                aria-describedby="ecp-e-contact"
              />
              <span className="err" id="ecp-e-contact">
                {f.channel.error}
              </span>
            </div>
            <label className="check">
              <input type="checkbox" name="consent" required />
              <span>
                {f.consent.before}
                <a href={privacyHref}>{f.consent.link}</a>
                {f.consent.after}
              </span>
            </label>
            <button className="btn primary" type="submit" disabled>
              <span>{f.submit}</span>
              <Arrow />
            </button>
            <div className="done" hidden role="status" tabIndex={-1}>
              <span className="h3">{f.done.title}</span>
              <p>{f.done.text}</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

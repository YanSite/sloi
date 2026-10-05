import type { CSSProperties } from "react";
import type { CaseScreen, EcpStageContent } from "./content-types";
import { Rich, splitWords } from "./text";

/**
 * Экраны колоды 01–07 (8 штук: оба проекта — блок 05). Разметка и
 * классы — прототип v31; анимации появления — CSS по `.screen.active`,
 * состояние (первый свайп, шаги, «договорил») — контроллер колоды.
 * Фоны и сцены (киноплан, поворот, витрины проектов) — отдельные слои.
 */

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

export function Arrow() {
  return (
    <svg
      width="18"
      height="12"
      viewBox="0 0 18 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <line x1="0" y1="6" x2="16" y2="6" />
      <polyline points="11,1 16,6 11,11" />
    </svg>
  );
}

export function Screens({ c }: { c: EcpStageContent }) {
  const [flowers, bakery] = c.cases.screens;
  return (
    <>
      <section className="screen s1 active" data-block="01">
        <div className="wrap">
          <div className="topline">
            <span className="idx">01</span>
          </div>
          <div className="body">
            <h1 className="statement" data-split style={v({ "--d": "400ms" })}>
              {splitWords(c.s01.title, v({ "--md": "1250ms" }))}
            </h1>
            <p className="statement dim later">{c.s01.sub}</p>
          </div>
        </div>
      </section>

      <section className="screen s2" data-block="02">
        <div className="wrap">
          <div className="topline">
            <span className="idx">02</span>
          </div>
          <div className="content">
            <h2 className="h2 ind" data-split style={v({ "--d": "200ms" })}>
              {splitWords([c.s02.title])}
            </h2>
            <ul className="signs">
              {c.s02.signs.map((s, i) => (
                <li key={i} className="a" style={v({ "--i": 4 + i * 2 })}>
                  <span className="idx">{i + 1}</span>
                  <p>
                    <Rich text={s.first} markClass="m4" />{" "}
                    <span className="second">{s.second}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="screen s3" data-block="03">
        <div className="wrap">
          <div className="topline">
            <span className="idx">03</span>
          </div>
          <div className="body">
            <p className="statement" data-split style={v({ "--d": "240ms" })}>
              {splitWords(c.s03.title, v({ "--md": "1500ms" }))}
            </p>
            <p className="statement dim" data-split style={v({ "--d": "1000ms" })}>
              {splitWords([c.s03.sub])}
            </p>
          </div>
        </div>
      </section>

      <section className="screen s4" data-block="04">
        <div className="wrap">
          <div className="turn-text">
            <span className="idx turn-idx a" style={v({ "--i": 0 })}>
              04
            </span>
            <h2 className="turn-line" data-split style={v({ "--d": "260ms" })}>
              {splitWords([c.s04.title])}
            </h2>
            <div className="turn-after">
              {c.s04.after.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CaseSection cls="s5" act="flow" project={flowers} capTitle={c.cases.capTitle} index="05" />
      <CaseSection cls="s6" act="cook" project={bakery} capTitle={c.cases.capTitle} index="05" />

      <section className="screen s7 warm" data-block="06" data-act="city">
        <div className="wrap">
          <div className="topline">
            <span className="cap">{c.s06.cap}</span>
            <span className="idx">06</span>
          </div>
          <div className="g12" style={{ marginTop: "clamp(16px, 3vh, 32px)" }}>
            <div className="left">
              <h2 className="h2 ind" data-split style={v({ "--d": "200ms" })}>
                {splitWords([c.s06.title])}
              </h2>
            </div>
            <div className="right">
              <ol className="steps">
                {c.s06.steps.map((s, i) => (
                  <li key={s.cap} className="a" style={v({ "--i": 4 + i * 2 })}>
                    <span className="cap">{s.cap}</span>
                    <div className="t">
                      <span className="h3">{s.title}</span>
                      <span>{s.text}</span>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="credit a" style={v({ "--i": 10 })}>
                <b>{c.s06.credit.big}</b>
                <span>{c.s06.credit.text}</span>
              </div>
              <button className="btn primary a" style={v({ "--i": 12 })} type="button" data-sheet>
                <span>{c.s06.cta}</span>
                <Arrow />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="screen s8 warm" data-block="07" data-act="end">
        <div className="wrap">
          <div className="topline">
            <span className="idx">07</span>
          </div>
          <div className="g12">
            <div className="final">
              <p className="statement" data-split style={v({ "--d": "220ms" })}>
                {splitWords([c.s07.lines[0]])}
              </p>
              <p className="statement second" data-split style={v({ "--d": "700ms" })}>
                {splitWords([c.s07.lines[1]])}
              </p>
            </div>
            <div className="cta">
              <ul className="sure">
                {c.s07.sure.map((s, i) => (
                  <li key={s} className="a" style={v({ "--i": 8 + i })}>
                    <i />
                    {s}
                  </li>
                ))}
              </ul>
              <p className="a" style={v({ "--i": 11 })}>
                {c.s07.invite}
              </p>
              <button
                className="btn primary a go"
                style={v({ "--i": 12 })}
                type="button"
                data-sheet
              >
                <span>{c.s07.cta}</span>
                <Arrow />
              </button>
            </div>
          </div>
          <div className="legal a" style={v({ "--i": 13 })}>
            <span>{c.s07.contacts}</span>
            <a href={c.s07.privacy.href}>{c.s07.privacy.label}</a>
          </div>
        </div>
      </section>
    </>
  );
}

function CaseSection({
  cls,
  act,
  project,
  capTitle,
  index,
}: {
  cls: string;
  act: string;
  project: CaseScreen;
  capTitle: string;
  index: string;
}) {
  return (
    <section
      className={`screen ${cls} case warm`}
      data-block={index}
      data-world="revealed"
      data-act={act}
    >
      <div className="wrap">
        <div className="topline">
          <span className="cap">{capTitle}</span>
          <span className="idx">{index}</span>
        </div>
        {project.heading && (
          <h2
            className="h2 ind"
            data-split
            style={v({ "--d": "160ms", marginTop: "clamp(12px, 2vh, 22px)" })}
          >
            {splitWords([project.heading])}
          </h2>
        )}
        <div className="cs">
          {/* Витрина проекта (коридор слайдов и телефон) — слой проектов, шаг 3. */}
          <div className="dev" />
          <div className="ctext">
            <div className="meta a" style={v({ "--i": 6 })}>
              <span className="cap">{project.label}</span>
              <span className="tag">{project.tag}</span>
            </div>
            <h3 className="ctitle a" style={v({ "--i": 7 })}>
              {project.title}
            </h3>
            <ol className="story2">
              {project.story.map((row, k) => (
                <li key={row.cap} style={v({ "--k": k })}>
                  <span className="cap">{row.cap}</span>
                  <p>{row.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

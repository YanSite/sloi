/**
 * ФОНЫ ВТОРОГО АКТА (`data-act` на корне): тёплый город после поворота.
 * flow — размытый букет (проект 01), cook — тёмно-розовое свечение
 * (проект 02), city — тот же город, сильно размыт (06), end — резкая улица
 * первого экрана под затемнением (07, улицу даёт киноплан).
 */
export function Acts() {
  return (
    <div className="acts" aria-hidden="true">
      <div className="bk flow">
        <div className="bki" data-media="flowersWorld" />
      </div>
      <div className="bk cook">
        <div className="bki" />
      </div>
      <div className="bk city">
        <div className="bki" />
      </div>
      <div className="ashade" />
    </div>
  );
}

/**
 * Вступление проекта «макро → пролёт насквозь»: макро на весь экран,
 * подпись и название; касание или свайп — пропуск (не листает).
 * Кадр, подписи и название подставляет колода из `data-mac-*` экрана.
 */
export function Macro({ skip }: { skip: string }) {
  return (
    <div className="mac" aria-hidden="true">
      <div className="mac-i" />
      <div className="mac-sh" />
      <div className="mac-t">
        <div className="wrap">
          <span className="cap" />
          <b />
        </div>
      </div>
      <span className="mac-skip">{skip}</span>
    </div>
  );
}

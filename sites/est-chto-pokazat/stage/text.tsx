import type { CSSProperties, ReactNode } from "react";
import type { RichText } from "./content-types";

/**
 * Текст с отметкой: `{ mark }` — слово с подчёркиванием акцентом
 * (`.mark`, появление по `--md`). Без разбивки по словам.
 */
export function Rich({ text, markClass, markStyle }: RichProps) {
  return (
    <>
      {text.map((part, i) =>
        typeof part === "string" ? (
          part
        ) : (
          <span key={i} className={markClass ? `mark ${markClass}` : "mark"} style={markStyle}>
            {part.mark}
          </span>
        ),
      )}
    </>
  );
}

type RichProps = { text: RichText; markClass?: string; markStyle?: CSSProperties };

/**
 * Заголовок «по словам» (`data-split` прототипа): каждое слово — в
 * `.w > span` со сквозным индексом `--w` (задержка 42 мс на слово),
 * пробелы остаются текстом — перенос строк как у обычного текста.
 * Разбивка делается при рендере, а не обходом DOM: разметка приходит с
 * сервера уже готовой, анимация стартует до гидратации.
 */
export function splitWords(text: RichText, markStyle?: CSSProperties): ReactNode[] {
  let n = 0;
  const words = (s: string, key: string) =>
    s.split(/(\s+)/).map((p, i) => {
      if (!p) return null;
      if (/^\s+$/.test(p)) return p;
      return (
        <span key={`${key}-${i}`} className="w" style={{ "--w": n++ } as CSSProperties}>
          <span>{p}</span>
        </span>
      );
    });
  return text.map((part, i) =>
    typeof part === "string" ? (
      words(part, String(i))
    ) : (
      <span key={i} className="mark" style={markStyle}>
        {words(part.mark, `m${i}`)}
      </span>
    ),
  );
}

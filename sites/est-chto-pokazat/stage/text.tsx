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
    tokens(s).map((p, i) =>
      /^\s+$/.test(p) ? (
        p
      ) : (
        <span key={`${key}-${i}`} className="w" style={{ "--w": n++ } as CSSProperties}>
          <span>{p}</span>
        </span>
      ),
    );
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

/**
 * Слова и пробелы между ними. Неразрывный пробел остаётся в конце
 * предыдущего слова: отдельным текстом он при переносе строки становится
 * видимым отступом в начале следующей.
 */
function tokens(s: string): string[] {
  const out: string[] = [];
  for (const p of s.split(/(\u00A0+|\s+)/)) {
    if (!p) continue;
    if (/^\u00A0+$/.test(p) && out.length && !/^\s+$/.test(out[out.length - 1]))
      out[out.length - 1] += p;
    else out.push(p);
  }
  return out;
}

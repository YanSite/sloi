import type { MediaFile } from "./content-types";

/**
 * Выбор версии файла под размер на экране: наименьшая ширина из `set`,
 * которая покрывает `cssPx` × плотность экрана, иначе самая большая.
 * Для фонов (CSS `background-image`), где `srcset` недоступен.
 */
export function pickUrl(m: MediaFile, cssPx: number): string {
  if (!m.set.length) return m.src;
  const need = cssPx * Math.min(window.devicePixelRatio || 1, 2);
  return (m.set.find((x) => x.w >= need) ?? m.set[m.set.length - 1]).url;
}

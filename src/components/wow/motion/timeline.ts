/**
 * TIMELINE MATH — чистые функции для choreography, управляемой одним
 * числовым прогрессом (скролл, beat-контроллер, время). Без DOM и без
 * зависимостей: одни и те же функции считают камеру WebGL-сцены и
 * opacity DOM-слоя, поэтому кривые у них гарантированно совпадают.
 */

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

/** Эрмитова кривая 0→1 на отрезке [edge0, edge1] — как `smoothstep` в GLSL. */
export function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Применяет вычисленную видимость к DOM-слою: opacity плюс
 * `visibility: hidden` почти на нуле, чтобы невидимый слой не
 * перехватывал клики и не читался скринридером поверх активного.
 */
export function setLayerOpacity(el: HTMLElement | null, value: number): void {
  if (!el) return;
  el.style.opacity = value.toFixed(3);
  el.style.visibility = value < 0.02 ? "hidden" : "visible";
}

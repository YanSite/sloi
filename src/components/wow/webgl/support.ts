/**
 * Определяет реальную доступность WebGL. Безопасен для SSR (возвращает
 * false при отсутствии `window`) и никогда не бросает исключение —
 * браузер, отказавший в создании контекста (старый GPU, driver
 * blocklist, контексты исчерпаны), просто вернёт здесь `false`, а не
 * уронит вызывающий код.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    return gl !== null;
  } catch {
    return false;
  }
}

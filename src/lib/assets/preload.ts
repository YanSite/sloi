/**
 * ФОНОВАЯ ДОГРУЗКА — тяжёлые ассеты сцены, которые не нужны первому
 * экрану: начинаем грузить, когда страница загрузилась и браузер простаивает,
 * чтобы они не конкурировали с первой отрисовкой. Только браузер.
 */

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Вызывает `fn` после события `load` и первого простоя браузера (не позже
 * `timeoutMs` после `load`). Возвращает отмену.
 */
export function whenIdle(fn: () => void, timeoutMs = 2000): () => void {
  const w = window as IdleWindow;
  let cancelled = false;
  let idle = 0;
  let timer = 0;
  const run = () => {
    if (cancelled) return;
    if (w.requestIdleCallback)
      idle = w.requestIdleCallback(() => !cancelled && fn(), { timeout: timeoutMs });
    else timer = window.setTimeout(() => !cancelled && fn(), 200);
  };
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("load", run);
    if (idle) w.cancelIdleCallback?.(idle);
    if (timer) clearTimeout(timer);
  };
}

/**
 * Загружает и декодирует изображения не больше `concurrency` одновременно
 * — к моменту показа кадр уже в кеше и декодирован. Ошибки не прерывают
 * очередь: недоступный файл просто не прогрет.
 */
export async function preloadImages(urls: string[], concurrency = 4): Promise<void> {
  const queue = [...new Set(urls)];
  const worker = async () => {
    for (let url = queue.shift(); url; url = queue.shift()) {
      const img = new Image();
      img.decoding = "async";
      img.src = url;
      await img.decode().catch(() => undefined);
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, worker));
}

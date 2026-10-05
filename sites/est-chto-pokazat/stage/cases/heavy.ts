import { preloadImages, whenIdle } from "@/lib/assets";
import type { MediaFile, ResolvedMedia } from "../content-types";
import { pickUrl } from "../media";

/**
 * ФОНОВАЯ ДОГРУЗКА второй половины: фото и слайды проектов (≈2 МБ) грузятся,
 * когда первая половина загрузилась и браузер простаивает, — пока
 * посетитель читает 01–03. Элементы помечены `data-media="<ключ>[.<i>]"`:
 * фоном (`background-image`) или `<img>`; версия файла — под размер элемента. Если посетитель
 * перескочил к проектам раньше (меню, точки), `ensure()` подставляет файлы
 * сразу.
 */
export class HeavyMedia {
  private readonly root: HTMLElement;
  private readonly media: ResolvedMedia;
  private applied = false;
  private cancel: (() => void) | null = null;

  constructor(root: HTMLElement, media: ResolvedMedia) {
    this.root = root;
    this.media = media;
  }

  /** Начать фоновую догрузку после первой отрисовки. */
  schedule(): void {
    this.cancel = whenIdle(() => {
      const urls = this.targets().map(({ el, file }) => this.urlFor(el, file));
      void preloadImages(urls).then(() => this.ensure());
    });
  }

  /** Подставить файлы во все помеченные элементы (идемпотентно). */
  ensure(): void {
    if (this.applied) return;
    this.applied = true;
    for (const { el, file } of this.targets()) {
      // У <img> — ровно та версия, что прогрета (srcset дал бы другую на экранах 3×).
      if (el instanceof HTMLImageElement) {
        el.src = this.urlFor(el, file);
      } else {
        el.style.backgroundImage = `url("${this.urlFor(el, file)}")`;
      }
    }
  }

  dispose(): void {
    this.cancel?.();
  }

  /** Версия файла под размер элемента на экране. */
  private urlFor(el: HTMLElement, file: MediaFile): string {
    if (el instanceof HTMLImageElement) {
      return pickUrl(file, el.parentElement?.clientWidth || 400);
    }
    const r = el.getBoundingClientRect();
    return pickUrl(file, Math.max(el.offsetWidth, r.width, 320));
  }

  private targets(): { el: HTMLElement; file: MediaFile }[] {
    return Array.from(this.root.querySelectorAll<HTMLElement>("[data-media]")).flatMap((el) => {
      const [key, index] = (el.dataset.media ?? "").split(".");
      const entry = this.media[key as keyof ResolvedMedia];
      const file = Array.isArray(entry) ? entry[Number(index)] : entry;
      return file ? [{ el, file }] : [];
    });
  }
}

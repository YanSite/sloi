import type * as THREE from "three";
import type { Disposable, ThreeModule } from "./types";

/**
 * Процедурные текстуры для stage-сцен: canvas-типографика как 3D-объект,
 * мягкие пятна, маски. Каждая функция регистрирует созданную текстуру в
 * `bag`, чтобы сцена освободила всё одним проходом при dispose.
 */

export interface TextureBag {
  T: ThreeModule;
  disposables: Disposable[];
  /** Анизотропная фильтрация для всех текстур сцены. */
  anisotropy: number;
}

export function canvasTexture(
  bag: TextureBag,
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) draw(ctx, width, height);
  const texture = new bag.T.CanvasTexture(canvas);
  texture.anisotropy = bag.anisotropy;
  bag.disposables.push(texture);
  return texture;
}

/** Фото-текстура; `crop` — UV-кадрирование (repeat/offset) внутри той же картинки. */
export function imageTexture(
  bag: TextureBag,
  loader: THREE.TextureLoader,
  url: string,
  crop?: { repeat: [number, number]; offset: [number, number] },
): THREE.Texture {
  const texture = loader.load(url);
  texture.anisotropy = bag.anisotropy;
  if (crop) {
    texture.repeat.set(crop.repeat[0], crop.repeat[1]);
    texture.offset.set(crop.offset[0], crop.offset[1]);
  }
  bag.disposables.push(texture);
  return texture;
}

/** Радиальное пятно цвета с мягким краем — тени, halo, дымка. */
export function radialBlobTexture(
  bag: TextureBag,
  color: string,
  alpha = 0.95,
): THREE.CanvasTexture {
  return canvasTexture(bag, 512, 512, (ctx) => {
    const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    const c = new bag.T.Color(color);
    const rgb = `${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)}`;
    g.addColorStop(0, `rgba(${rgb},${alpha})`);
    g.addColorStop(0.45, `rgba(${rgb},${alpha * 0.85})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
  });
}

/** Круглая alpha-маска: белое до `inner` радиуса, к краю в ноль. */
export function radialAlphaMask(bag: TextureBag, inner = 0.72): THREE.CanvasTexture {
  return canvasTexture(bag, 512, 512, (ctx) => {
    const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    g.addColorStop(0, "#fff");
    g.addColorStop(inner, "#fff");
    g.addColorStop(1, "#000");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
  });
}

/** Прямоугольная маска с мягким краем шириной `edge` (доля ширины). */
export function edgeFadeMask(
  bag: TextureBag,
  width: number,
  height: number,
  edge: number,
): THREE.CanvasTexture {
  return canvasTexture(bag, width, height, (ctx, w, h) => {
    const img = ctx.createImageData(w, h);
    for (let j = 0; j < h; j++)
      for (let i = 0; i < w; i++) {
        const e = Math.min(i, w - 1 - i, j, h - 1 - j) / (w * edge);
        const a = Math.max(0, Math.min(1, e));
        const v = Math.round(a * a * (3 - 2 * a) * 255);
        const k = (j * w + i) * 4;
        img.data[k] = img.data[k + 1] = img.data[k + 2] = v;
        img.data[k + 3] = 255;
      }
    ctx.putImageData(img, 0, 0);
  });
}

/** Вертикальный линейный градиент по стопам `[offset, color]`. */
export function verticalGradientTexture(
  bag: TextureBag,
  stops: [number, string][],
): THREE.CanvasTexture {
  return canvasTexture(bag, 512, 512, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    for (const [offset, color] of stops) g.addColorStop(offset, color);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
}

export interface TextLine {
  t: string;
  italic?: boolean;
  color?: string;
}

export interface TextTextureOptions {
  /** CSS-семейство (как в `font-family`) и начертание. */
  family: string;
  weight: number | string;
  /** Ширина canvas, px. */
  width?: number;
  align?: "left" | "center";
  color?: string;
  /** Светлое свечение под буквами: цвет заливки, цвет тени, радиусы blur в долях кегля. */
  glow?: { fill: string; shadow: string; blurs: number[] };
}

export interface TextTexture extends THREE.CanvasTexture {
  userData: { aspect: number };
}

/**
 * Многострочная серифная типографика как текстура — для 3D-заголовков,
 * которые живут в глубине сцены (под туманом, за/перед слоями). Шрифт
 * должен быть загружен до вызова (`document.fonts.load`).
 */
export function textTexture(
  bag: TextureBag,
  lines: TextLine[],
  size: number,
  opts: TextTextureOptions,
): TextTexture {
  const w = opts.width ?? 2048;
  const lh = size * 1.02;
  const h = Math.ceil(lh * lines.length + size * 0.5);
  const texture = canvasTexture(bag, w, h, (ctx) => {
    ctx.fillStyle = opts.color ?? "#2B2723";
    ctx.textAlign = opts.align ?? "center";
    ctx.textBaseline = "alphabetic";
    lines.forEach((ln, i) => {
      ctx.font = `${ln.italic ? "italic " : ""}${opts.weight} ${size}px ${opts.family}`;
      const tx = opts.align === "left" ? 20 : w / 2;
      const ty = size * 0.95 + i * lh;
      if (opts.glow) {
        ctx.save();
        ctx.fillStyle = opts.glow.fill;
        ctx.shadowColor = opts.glow.shadow;
        for (const b of opts.glow.blurs) {
          ctx.shadowBlur = size * b;
          ctx.fillText(ln.t, tx, ty);
        }
        ctx.restore();
      }
      ctx.fillStyle = ln.color ?? opts.color ?? "#1F1B18";
      ctx.fillText(ln.t, tx, ty);
    });
  }) as TextTexture;
  texture.userData = { aspect: w / h };
  return texture;
}

/** Одна строка моноширинного лейбла (подписи к объектам в сцене). */
export function labelTexture(
  bag: TextureBag,
  text: string,
  opts: { font: string; color: string; width?: number; height?: number; x?: number; y?: number },
): THREE.CanvasTexture {
  return canvasTexture(bag, opts.width ?? 1024, opts.height ?? 64, (ctx) => {
    ctx.font = opts.font;
    ctx.fillStyle = opts.color;
    ctx.fillText(text, opts.x ?? 4, opts.y ?? 42);
  });
}

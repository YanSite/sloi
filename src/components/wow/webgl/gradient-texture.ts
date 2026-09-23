import * as THREE from "three";

/**
 * Плейсхолдерная текстура вместо реального фотографического ассета (см.
 * /docs/asset-manifest.md — пока ничего не сгенерировано, ни один вызов
 * Higgsfield этим модулем не сделан). Рисует на offscreen canvas тот же
 * радиальный градиент, что использует CSS fallback, чтобы пути WebGL и
 * CSS визуально совпадали. Это image-плоскость с подставным изображением,
 * а не процедурная геометрия — замена на реальную фотографию потом это
 * правка в одну строку в месте вызова, а не изменение архитектуры.
 */
export function createGradientTexture(from: string, to: string): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(
      size / 2,
      size * 0.6,
      0,
      size / 2,
      size * 0.6,
      size * 0.7,
    );
    gradient.addColorStop(0, from);
    gradient.addColorStop(1, to);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

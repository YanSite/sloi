import * as THREE from "three";

/**
 * Placeholder texture standing in for a real photographic asset (see
 * /docs/asset-manifest.md — nothing generated yet, no Higgsfield call
 * made anywhere in this module). Draws the same radial gradient the CSS
 * fallback uses onto an offscreen canvas, so the WebGL and CSS paths are
 * visually consistent. This is an image plane fed a stand-in image, not
 * procedural geometry — swapping in a real photograph later is a
 * one-line change at the call site, not an architecture change.
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
      size * 0.7
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

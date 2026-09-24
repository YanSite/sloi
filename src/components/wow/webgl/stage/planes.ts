import type * as THREE from "three";
import type { Disposable, ThreeModule } from "./types";

export interface PlaneOptions {
  /** Непрозрачная плоскость пишет depth; прозрачная — нет. */
  opaque?: boolean;
  /** Плоскость реагирует на `scene.fog`. */
  fog?: boolean;
  rotationX?: number;
  rotationZ?: number;
}

/**
 * Текстурированная плоскость в 3D-сцене — основной строительный блок
 * «фото в пространстве»: слои глубины, рамы галереи, 3D-типографика.
 * `renderOrder` выводится из z (дальше — раньше), чтобы прозрачные слои
 * смешивались в порядке глубины; при необходимости сцена
 * переопределяет его вручную.
 */
export function addPlane(
  T: ThreeModule,
  disposables: Disposable[],
  scene: THREE.Object3D,
  map: THREE.Texture,
  width: number,
  height: number,
  position: [number, number, number],
  opts: PlaneOptions = {},
): THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> {
  const material = new T.MeshBasicMaterial({
    map,
    transparent: !opts.opaque,
    depthWrite: !!opts.opaque,
    fog: !!opts.fog,
    side: T.DoubleSide,
  });
  const geometry = new T.PlaneGeometry(width, height);
  const mesh = new T.Mesh(geometry, material);
  mesh.position.set(position[0], position[1], position[2]);
  if (opts.rotationZ) mesh.rotation.z = opts.rotationZ;
  if (opts.rotationX) mesh.rotation.x = opts.rotationX;
  mesh.renderOrder = Math.round((position[2] + 60) * 100);
  scene.add(mesh);
  disposables.push(material, geometry);
  return mesh;
}

/**
 * Смещает вершины плоскости по Z по depth map (красный канал × amplitude)
 * — фото превращается в рельефный объект, который читается при орбите
 * камеры. Асинхронно: пока карта грузится, плоскость остаётся плоской.
 * `isCancelled` не даёт писать в геометрию, освобождённую до загрузки.
 */
export function applyDepthMap(
  geometry: THREE.PlaneGeometry,
  url: string,
  amplitude: number,
  isCancelled: () => boolean,
): void {
  const img = new Image();
  img.onload = () => {
    if (isCancelled()) return;
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const pos = geometry.attributes.position;
    const uv = geometry.attributes.uv;
    for (let n = 0; n < pos.count; n++) {
      const px = Math.round(uv.getX(n) * (canvas.width - 1));
      const py = Math.round((1 - uv.getY(n)) * (canvas.height - 1));
      pos.setZ(n, (data[(py * canvas.width + px) * 4] / 255) * amplitude);
    }
    pos.needsUpdate = true;
  };
  img.src = url;
}

/** Проекция мировой точки в координаты вьюпорта (CSS px) — для DOM-выносок, привязанных к 3D. */
export function projectToViewport(
  point: THREE.Vector3,
  camera: THREE.Camera,
  width: number,
  height: number,
  scratch: THREE.Vector3,
): { x: number; y: number } {
  scratch.copy(point).project(camera);
  return { x: ((scratch.x + 1) / 2) * width, y: ((1 - scratch.y) / 2) * height };
}

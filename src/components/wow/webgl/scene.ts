import * as THREE from "three";

export interface ImageLayerConfig {
  /** 0 = зафиксирован относительно вьюпорта («далеко»), больше — сильнее двигается на пиксель скролла. Обычно 0.1–0.3. */
  depth: number;
  /** Опциональный camera-dolly zoom, интерполируется по прогрессу скролла 0→1 — «движение камеры» за Signature WOW Moment #2. */
  scaleRange?: [number, number];
}

/**
 * SCENE LIFECYCLE для одной текстурированной image-плоскости: одна
 * камера, одна плоскость, одна текстура. Никакой геометрии кроме плоской
 * плоскости, никаких процедурных форм, никакой симуляции — здесь всегда
 * только показ фотографической (пока — плейсхолдерной) текстуры с
 * depth/parallax, управляемым камерой.
 *
 * Renderer передаётся снаружи, а не создаётся здесь, намеренно: это
 * единственная часть, которой нужен настоящий WebGL-контекст, и вынос её
 * наружу позволяет проверять всё остальное в этом классе (настройку
 * плоскости/материала/текстуры, математику resize, scroll-progress →
 * transform, порядок dispose) обычным Node-скриптом с фейковым
 * renderer'ом — так это и было проверено при разработке (Stage 4).
 */
export class ImageLayerScene {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  private readonly geometry = new THREE.PlaneGeometry(1, 1);
  private readonly material: THREE.MeshBasicMaterial;
  private readonly plane: THREE.Mesh;
  private baseWidth = 1;
  private baseHeight = 1;
  private progress = 0.5;
  private disposed = false;

  constructor(
    private readonly renderer: Pick<
      THREE.WebGLRenderer,
      "setSize" | "setPixelRatio" | "render" | "dispose"
    >,
    private readonly texture: THREE.Texture,
    private readonly config: ImageLayerConfig,
  ) {
    this.camera.position.z = 5;
    this.material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  /** Подгоняет плоскость под вьюпорт на дистанции камеры и обновляет renderer/камеру под новый размер. Безопасно вызывать на каждый тик ResizeObserver. */
  resize(width: number, height: number): void {
    if (this.disposed || width <= 0 || height <= 0) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    const verticalFov = (this.camera.fov * Math.PI) / 180;
    this.baseHeight = 2 * Math.tan(verticalFov / 2) * this.camera.position.z;
    this.baseWidth = this.baseHeight * this.camera.aspect;
    this.applyTransform();
    this.render();
  }

  /** progress: 0–1, привязан к скроллу. Управляет depth-смещением и, если задан, camera-dolly zoom. */
  update(progress: number): void {
    if (this.disposed) return;
    this.progress = Math.min(1, Math.max(0, progress));
    this.applyTransform();
    this.render();
  }

  private applyTransform(): void {
    const offset = (this.progress - 0.5) * this.config.depth * this.baseHeight;
    this.plane.position.y = offset;

    let zoom = 1;
    if (this.config.scaleRange) {
      const [min, max] = this.config.scaleRange;
      zoom = min + (max - min) * this.progress;
    }
    this.plane.scale.set(this.baseWidth * zoom, this.baseHeight * zoom, 1);
  }

  render(): void {
    if (this.disposed) return;
    this.renderer.render(this.scene, this.camera);
  }

  /** Идемпотентен — безопасно вызывать больше одного раза (cleanup React-эффекта может выполняться в необычном порядке в dev/StrictMode). */
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.geometry.dispose();
    this.material.dispose();
    this.texture.dispose();
    this.renderer.dispose();
  }

  get isDisposed(): boolean {
    return this.disposed;
  }
}

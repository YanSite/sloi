import * as THREE from "three";

export interface ImageLayerConfig {
  /** 0 = fixed to viewport ("far back"), higher = moves more per scroll pixel. Typical 0.1–0.3. */
  depth: number;
  /** Optional camera-dolly zoom, interpolated across scroll progress 0→1 — the "camera-like movement" behind Signature WOW Moment #2. */
  scaleRange?: [number, number];
}

/**
 * SCENE LIFECYCLE for a single textured image plane: one camera, one
 * plane, one texture. No geometry beyond a flat plane, no procedural
 * shapes, no simulation — this only ever displays a photographic (today:
 * placeholder) texture with camera-driven depth/parallax.
 *
 * The renderer is passed in rather than constructed here, on purpose:
 * it's the one piece that needs a real WebGL context, and keeping it
 * external lets everything else in this class (plane/material/texture
 * setup, resize math, scroll-progress → transform, dispose sequencing)
 * be exercised in a plain Node test with a fake renderer — see
 * webgl.cleanup.test.ts.
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
    private readonly renderer: Pick<THREE.WebGLRenderer, "setSize" | "setPixelRatio" | "render" | "dispose">,
    private readonly texture: THREE.Texture,
    private readonly config: ImageLayerConfig
  ) {
    this.camera.position.z = 5;
    this.material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  /** Fits the plane to cover the viewport at the camera's distance, and updates the renderer/camera for the new size. Safe to call on every ResizeObserver tick. */
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

  /** progress: 0–1, scroll-linked. Drives depth offset and, if configured, the camera-dolly zoom. */
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

  /** Idempotent — safe to call more than once (React effect cleanup can run in unusual orders in dev/StrictMode). */
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

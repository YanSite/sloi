import type * as THREE from "three";

/**
 * Модуль three.js, переданный в рантайме. Stage-примитивы никогда не
 * импортируют three статически: host грузит его динамически, только
 * когда сцена реально монтируется, — тяжёлый бандл не попадает в
 * первичный JS роута и не грузится вовсе, если WebGL недоступен.
 */
export type ThreeModule = typeof THREE;

/** Одна сцена и камера, которые композитор рендерит в свою текстуру. */
export interface StagePass {
  scene: THREE.Scene;
  camera: THREE.Camera;
}

/** Всё, что можно освободить через `dispose()` — текстуры, материалы, геометрии, render targets. */
export interface Disposable {
  dispose(): void;
}

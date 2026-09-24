import type * as THREE from "three";
import type { StagePass, ThreeModule } from "./types";

/**
 * STAGE COMPOSITOR — многосценовый рендер через render-to-texture и один
 * полноэкранный post-шейдер. Каждый кадр рендерит сцену A (и, во время
 * перехода, сцену B) в собственные render targets, затем сводит их:
 *
 * - органическая маска перехода: фронт идёт от центра по fbm-«прожилкам»,
 *   с радиальным смещением UV (`disp`) — сцены сменяются как непрерывное
 *   движение камеры, а не как page transition;
 * - blur по золотому углу (32 сэмпла, радиус в px) — focus pull и
 *   смягчение перехода;
 * - exposure (`exp2`), vignette, film grain;
 * - лупа: отдельный рендер узкой камерой в свой target, вставленный кругом
 *   с кольцом поверх итогового кадра.
 *
 * Все значения параметров приходят от вызывающей сцены — композитор о
 * сцене не знает.
 */

const VERTEX = "varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }";

const FRAGMENT = `
  precision highp float; varying vec2 vUv;
  uniform sampler2D tA, tB, tL; uniform float mixv, disp, blur, expo, grain, time, lR, lA; uniform vec2 res, lP;
  uniform vec3 ringColor; uniform float vignette;
  float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
  float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<4;i++){ v+=a*n(p); p*=2.03; a*=.5; } return v; }
  vec3 sb(sampler2D t, vec2 uv, float b){
    if(b<0.05) return texture2D(t, uv).rgb;
    vec3 c=texture2D(t, uv).rgb; float w=1.;
    float rot=h(uv*res)*6.2831;
    for(int i=1;i<32;i++){
      float fi=float(i); float rr=sqrt(fi/31.)*b; float a=fi*2.39996+rot;
      c+=texture2D(t, uv+vec2(cos(a),sin(a))*rr/res).rgb; w+=1.;
    }
    return c/w;
  }
  void main(){
    vec2 uv=vUv; vec2 c=uv-.5; c.x*=res.x/res.y; float r=length(c);
    float ang=atan(c.y,c.x);
    float veins=fbm(vec2(ang*2.2+r*3., r*9.));
    float f=1.-r*1.25+(veins-.5)*.5;
    float th=1.35-mixv*2.1;
    float e=smoothstep(th-.12, th+.12, f);
    vec2 dir=normalize(c+1e-5)*vec2(res.y/res.x,1.);
    vec3 col;
    if(e<=0.001) col=sb(tA, uv+dir*disp*mixv*(.4+veins), blur);
    else if(e>=.999) col=sb(tB, uv-dir*disp*(1.-mixv)*(.4+veins), blur);
    else col=mix(sb(tA, uv+dir*disp*mixv*(.4+veins), blur), sb(tB, uv-dir*disp*(1.-mixv)*(.4+veins), blur), e);
    if(lA>0.001){
      vec2 px=uv*res; float d=length(px-lP); float R=lR*lA;
      vec2 luv=(px-lP)/(lR*2.)+.5;
      vec3 lc=texture2D(tL, luv).rgb;
      col=mix(col, lc, 1.-smoothstep(R-1.5, R, d));
      col=mix(col, ringColor, (1.-smoothstep(0., 2.5, abs(d-R)))*lA);
    }
    col*=exp2(expo);
    col*=mix(1., vignette, smoothstep(.3, 1.1, r));
    col+=(h(uv*res+fract(time)*91.7)-.5)*grain;
    gl_FragColor=vec4(col,1.);
  }`;

export interface StageRendererOptions {
  /** Потолок devicePixelRatio (обычно ниже на coarse-pointer устройствах). */
  maxPixelRatio: number;
  clearColor: number;
}

/**
 * Renderer в режиме «текстуры как есть»: color management выключен,
 * выход — linear sRGB, т. е. пиксели фотографий попадают на экран без
 * конвертации. `ColorManagement` — глобальное состояние модуля three,
 * поэтому возвращаемый `restore` обязательно вызывается при dispose —
 * иначе другой WebGL-слой на следующем роуте унаследует этот режим.
 */
export function createStageRenderer(
  T: ThreeModule,
  canvas: HTMLCanvasElement,
  { maxPixelRatio, clearColor }: StageRendererOptions,
): { renderer: THREE.WebGLRenderer; dpr: number; restore: () => void } {
  const prevColorManagement = T.ColorManagement.enabled;
  T.ColorManagement.enabled = false;
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.outputColorSpace = T.LinearSRGBColorSpace;
  const dpr = Math.min(window.devicePixelRatio || 1, maxPixelRatio);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(clearColor, 1);
  return {
    renderer,
    dpr,
    restore: () => {
      renderer.dispose();
      T.ColorManagement.enabled = prevColorManagement;
    },
  };
}

export interface CompositeParams {
  a: StagePass;
  /** Вторая сцена — только во время перехода. */
  b?: StagePass | null;
  /** Прогресс перехода A → B, 0…1. */
  mix: number;
  /** Сила радиального смещения UV во время перехода. */
  disp: number;
  /** Радиус blur в CSS px (умножается на dpr внутри). */
  blur: number;
  /** Экспозиция в стопах. */
  expo: number;
  /** Амплитуда зерна (0 — выключено). */
  grain: number;
  /** Секунды — зерно меняется каждый кадр. */
  time: number;
  /** Сила лупы 0…1; 0 — лупа не рисуется. */
  loupe: number;
}

export interface StageCompositorOptions {
  /** Сторона квадратного render target лупы. */
  loupeTargetSize?: number;
  /** Цвет кольца лупы (linear-значения 0…1). */
  loupeRingColor?: [number, number, number];
  /** Яркость на краях кадра (1 — без виньетки). */
  vignette?: number;
}

export class StageCompositor {
  private readonly rtA: THREE.WebGLRenderTarget;
  private readonly rtB: THREE.WebGLRenderTarget;
  private readonly rtL: THREE.WebGLRenderTarget;
  private readonly post: THREE.ShaderMaterial;
  private readonly quad: THREE.Mesh;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.OrthographicCamera;
  private readonly loupeCamera: THREE.PerspectiveCamera;
  private readonly ray: THREE.Raycaster;
  private readonly ndc: THREE.Vector2;
  private readonly tmp: THREE.Vector3;
  private dpr = 1;
  private cssH = 1;

  constructor(
    T: ThreeModule,
    private readonly renderer: THREE.WebGLRenderer,
    options: StageCompositorOptions = {},
  ) {
    const rtOpts = { depthBuffer: true };
    const loupeSize = options.loupeTargetSize ?? 512;
    this.rtA = new T.WebGLRenderTarget(2, 2, rtOpts);
    this.rtB = new T.WebGLRenderTarget(2, 2, rtOpts);
    this.rtL = new T.WebGLRenderTarget(loupeSize, loupeSize, rtOpts);
    const ring = options.loupeRingColor ?? [0.984, 0.973, 0.949];
    this.post = new T.ShaderMaterial({
      uniforms: {
        tA: { value: this.rtA.texture },
        tB: { value: this.rtB.texture },
        tL: { value: this.rtL.texture },
        mixv: { value: 0 },
        disp: { value: 0 },
        blur: { value: 0 },
        expo: { value: 0 },
        grain: { value: 0 },
        time: { value: 0 },
        res: { value: new T.Vector2(1, 1) },
        lP: { value: new T.Vector2() },
        lR: { value: 110 },
        lA: { value: 0 },
        ringColor: { value: new T.Vector3(...ring) },
        vignette: { value: options.vignette ?? 0.965 },
      },
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      depthTest: false,
      depthWrite: false,
    });
    this.quad = new T.Mesh(new T.PlaneGeometry(2, 2), this.post);
    this.scene = new T.Scene();
    this.scene.add(this.quad);
    this.camera = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.loupeCamera = new T.PerspectiveCamera(10, 1, 0.02, 100);
    this.ray = new T.Raycaster();
    this.ndc = new T.Vector2();
    this.tmp = new T.Vector3();
  }

  /** Размер вьюпорта в CSS px; радиус лупы — тоже в CSS px. */
  resize(width: number, height: number, dpr: number, loupeRadius: number): void {
    this.dpr = dpr;
    this.cssH = height;
    this.renderer.setSize(width, height, false);
    this.rtA.setSize(Math.round(width * dpr), Math.round(height * dpr));
    this.rtB.setSize(Math.round(width * dpr), Math.round(height * dpr));
    this.post.uniforms.res.value.set(width * dpr, height * dpr);
    this.post.uniforms.lR.value = loupeRadius * dpr;
  }

  /**
   * Рендерит сцену узкой камерой из позиции `base` в направлении точки
   * экрана (x, y в CSS px) — содержимое лупы. `zoom` — во сколько раз
   * поле зрения лупы уже, чем у круга того же размера в основном кадре.
   */
  renderLoupe(
    scene: THREE.Scene,
    base: THREE.PerspectiveCamera,
    x: number,
    y: number,
    viewportW: number,
    zoom: number,
  ): void {
    this.ndc.set((x / viewportW) * 2 - 1, -(y / this.cssH) * 2 + 1);
    this.ray.setFromCamera(this.ndc, base);
    const cam = this.loupeCamera;
    cam.position.copy(base.position);
    cam.lookAt(this.tmp.copy(base.position).add(this.ray.ray.direction));
    cam.fov = (base.fov * ((this.post.uniforms.lR.value * 2) / (this.cssH * this.dpr))) / zoom;
    cam.aspect = 1;
    cam.updateProjectionMatrix();
    this.renderer.setRenderTarget(this.rtL);
    this.renderer.render(scene, cam);
    this.post.uniforms.lP.value.set(x * this.dpr, (this.cssH - y) * this.dpr);
  }

  /** Рендерит A (и B) в текстуры. Вызывается до `renderLoupe`, как в прототипе. */
  renderScenes(a: StagePass, b?: StagePass | null): void {
    this.renderer.setRenderTarget(this.rtA);
    this.renderer.render(a.scene, a.camera);
    if (b) {
      this.renderer.setRenderTarget(this.rtB);
      this.renderer.render(b.scene, b.camera);
    }
  }

  /** Сводит отрендеренные текстуры в итоговый кадр на экран. */
  composite(p: Omit<CompositeParams, "a">): void {
    const u = this.post.uniforms;
    u.mixv.value = p.b ? p.mix : 0;
    u.tB.value = p.b ? this.rtB.texture : this.rtA.texture;
    u.disp.value = p.disp;
    u.blur.value = p.blur * this.dpr;
    u.expo.value = p.expo;
    u.time.value = p.time;
    u.lA.value = p.loupe;
    u.grain.value = p.grain;
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.rtA.dispose();
    this.rtB.dispose();
    this.rtL.dispose();
    this.post.dispose();
    this.quad.geometry.dispose();
  }
}

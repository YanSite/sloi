import type * as THREE from "three";
import type { RefObject } from "react";
import { BeatController, clamp, lerp, setLayerOpacity, smoothstep } from "@/components/wow/motion";
import {
  StageCompositor,
  addPlane,
  applyDepthMap,
  createStageRenderer,
  edgeFadeMask,
  imageTexture,
  labelTexture,
  projectToViewport,
  radialAlphaMask,
  radialBlobTexture,
  textTexture,
  verticalGradientTexture,
  type Disposable,
  type PlaneOptions,
  type StageProgram,
  type StageProgramFactory,
  type TextureBag,
} from "@/components/wow/webgl/stage";
import type { FloristAtelierStageContent } from "./content-types";

/**
 * Хореография ателье S01–S04 + финал — порт `init()` утверждённого
 * прототипа (design-reference/florist-atelier/prototype.html) на generic
 * stage-примитивы Engine. Каждое число, кривая и тайминг перенесены без
 * изменений; расхождения с прототипом — только технические (модульный
 * three вместо UMD, ассеты через resolveAsset), визуально ничего.
 *
 * Сцены: A · Aperture, B · Pull-back, C · Exhibition, D · The Object.
 * Прогресс `g` (0…1010) идёт от beat-контроллера; одна сцена в кадре,
 * в переходе — две, сведённые композитором.
 */

export interface FloristAtelierUrls {
  background: string;
  bouquet: string;
  foreground: string;
  macro: string;
  end: string;
  frames: string[];
  signature: string;
  depth: string;
}

type El = RefObject<HTMLElement | null>;

export interface FloristAtelierDom {
  kick: El;
  brand: El;
  cta: El;
  hero: El;
  hint1: El;
  hint3: El;
  veil: El;
  blockAssortment: El;
  blockPersonal: El;
  signature: El;
  hint4: El;
  delivery: El;
  care: El;
  callouts: El[];
  final: El;
  hudScene: El;
  hudBar: El;
}

export interface FloristAtelierProgramInput {
  urls: FloristAtelierUrls;
  content: FloristAtelierStageContent;
  dom: FloristAtelierDom;
  /** Цвет фона сцен, clear color и тумана S03. */
  background: string;
  grain: boolean;
}

const SERIF = '"Cormorant Garamond", serif';
const SERIF_WEIGHT = 500;
const GLOW = {
  fill: "rgba(250,246,239,0.9)",
  shadow: "rgba(250,246,239,0.95)",
  blurs: [0.45, 0.22, 0.08],
};

/** Рамы S03: соотношение, ширина, позиция, поворот Y. */
const FRAME_LAYOUT: [number, number, [number, number, number], number][] = [
  [16 / 9, 3.2, [0, 0, 0], 0],
  [0.8, 1.7, [-2.6, 0.35, -5], 0.28],
  [1, 1.8, [2.4, -0.35, -9], -0.22],
  [0.8, 1.7, [-1.8, 0.5, -13], 0.2],
  [16 / 9, 3.0, [2.2, 0.1, -17], -0.18],
  [0.8, 1.9, [0, 0.05, -23], 0],
];

const CAMERA_PATH_S03: [number, number, number][] = [
  [0, 0, 2.3],
  [0.6, 0.1, -1.8],
  [-0.4, 0, -6.4],
  [0.5, 0.2, -11],
  [-0.3, 0.05, -15.6],
  [0, -0.12, -19.6],
];

/**
 * Узкий экран (≤460px, портрет телефона) — поправки, согласованные с
 * владельцем дизайна поверх прототипа: камеры прототипа рассчитаны на
 * горизонтальный кадр, и F-фактора не хватало, чтобы букет и галерея
 * помещались. Desktop и планшеты идут по прототипу без изменений.
 */
const NARROW_MAX_WIDTH = 460;
/** Коэффициент отъезда камеры до общего плана букета (S01 старт, S04 стоп 1). */
const NARROW_OBJECT_K = 2.3;
/** S01: стартовый кадр центрируется на букете (к этой же x камера приходит при въезде в розу). */
const NARROW_HERO_START_X = 0.45;
/** S01: стартовый кадр опущен — букет выше на экране, заголовок не перекрывает вазу. */
const NARROW_HERO_START_Y = 0.7 - 1.95;
/** S01: низ заголовка, px от низа экрана — блок заголовка и оффера поднят ближе к уровню глаз. */
const NARROW_TITLE_BOTTOM = 320;
/** S03: рамы крупнее, подписи под ними — ещё крупнее, чтобы читались. */
const NARROW_FRAME_SCALE = 1.35;
const NARROW_CAPTION_SCALE = 1.8;
/**
 * Потолок плотности рендера на телефоне. Прототип ограничивал touch-экраны
 * 1.5× — на экранах 3× сцена рендерилась в половину разрешения и тонкий
 * 3D-текст S03 выглядел смазанным. Полные 3× слишком тяжелы для blur в
 * переходах на средних телефонах; 2.5× визуально почти не отличаются.
 */
const NARROW_MAX_PIXEL_RATIO = 2.5;
/** S03: шире угол — фразы и рамы вписываются по ширине; траектория и сдвиг камеры как в прототипе. */
const NARROW_GALLERY_FOV = 66;

type Frame = {
  m: THREE.Mesh;
  cap: THREE.Mesh;
  w: number;
  h: number;
  base: THREE.Vector3;
  lift: number;
  url: string;
};

export function createFloristAtelierProgram(
  input: FloristAtelierProgramInput,
): StageProgramFactory {
  return async (ctx): Promise<StageProgram> => {
    const { T, canvas, reducedMotion: reduce, coarsePointer: coarse } = ctx;
    const { urls, content, dom } = input;

    // Canvas-текстуры 3D-заголовков требуют загруженных шрифтов.
    await Promise.all([
      document.fonts.load(`${SERIF_WEIGHT} 160px "Cormorant Garamond"`, "Ателье"),
      document.fonts.load(`italic ${SERIF_WEIGHT} 120px "Cormorant Garamond"`, "цветов"),
      document.fonts.load('500 24px "IBM Plex Mono"', "Ш"),
    ]).catch(() => {});
    if (ctx.isDisposed()) return { frame() {}, resize() {}, dispose() {} };

    const IV = input.background;
    const { renderer, dpr, restore } = createStageRenderer(T, canvas, {
      maxPixelRatio:
        window.innerWidth <= NARROW_MAX_WIDTH ? NARROW_MAX_PIXEL_RATIO : coarse ? 1.5 : 2,
      clearColor: parseInt(IV.slice(1), 16),
    });
    const disposables: Disposable[] = [];
    const bag: TextureBag = { T, disposables, anisotropy: 8 };
    const loader = new T.TextureLoader();
    const img = (url: string, crop?: Parameters<typeof imageTexture>[3]) =>
      imageTexture(bag, loader, url, crop);
    const plane = (
      scene: THREE.Object3D,
      tex: THREE.Texture,
      w: number,
      h: number,
      x: number,
      y: number,
      z: number,
      o?: PlaneOptions,
    ) => addPlane(T, disposables, scene, tex, w, h, [x, y, z], o);
    const serifText = (
      lines: FloristAtelierStageContent["title3d"],
      size: number,
      width: number,
      align?: "left",
    ) =>
      textTexture(bag, lines, size, {
        family: SERIF,
        weight: SERIF_WEIGHT,
        width,
        align,
        glow: GLOW,
      });

    // ---------- Scene A · Aperture ----------
    const sA = new T.Scene();
    sA.background = new T.Color(IV);
    const camA = new T.PerspectiveCamera(38, 1, 0.02, 100);
    plane(sA, img(urls.background), 24.2, 13.5, -3.29, -0.25, -6, { opaque: true });
    plane(sA, radialBlobTexture(bag, "#CDBFA8", 0.45), 1.9, 0.32, 0.43, -1.02, -2.97);
    plane(sA, img(urls.bouquet), 5.0, 5.0, 0.4, 1.15, -2.95);
    const hero = new T.Vector3(0.35, 1.05, -2.95);
    const tLeft = serifText(content.title3d, 300, 1700, "left");
    // Геометрия 1×1, реальный размер задаёт scale в resize() — тот же итог, что у прототипа.
    const titleA = plane(sA, tLeft, 1, 1, 0, 0.62, -2.0);
    const fgA = [plane(sA, img(urls.foreground), 8.8, 4.95, 0, 0.7, -0.6)];
    fgA.forEach((m) => {
      m.renderOrder = 99999;
    });
    titleA.renderOrder = 100001;
    const haloA = plane(sA, radialBlobTexture(bag, "#FAF6EF", 0.6), 1, 1, 0, 0.62, -2.03);
    haloA.renderOrder = 100000;

    // ---------- Scene B · Pull-back (макро → стоп-кадр V01; видео V01 — ASSET GAP) ----------
    const sB = new T.Scene();
    sB.background = new T.Color(IV);
    const camB = new T.PerspectiveCamera(26, 1, 0.02, 100);
    plane(sB, img(urls.end), 16, 8.93, 0, 0, 0, { opaque: true });
    const macro = plane(sB, img(urls.macro), 2.6, 1.452, 0.08, -0.98, 0.02);
    macro.material.alphaMap = radialAlphaMask(bag, 0.72);
    macro.material.needsUpdate = true;
    const roseB = new T.Vector3(0.08, -0.98, 0);

    // ---------- Scene C · Exhibition ----------
    const sC = new T.Scene();
    sC.background = new T.Color(IV);
    sC.fog = new T.Fog(IV, 3, 21);
    const camC = new T.PerspectiveCamera(45, 1, 0.05, 100);
    const frames: Frame[] = FRAME_LAYOUT.map(([ar, w, p, ry], i) => {
      const h = w / ar;
      const tex =
        i === 2
          ? img(urls.frames[i], { repeat: [0.558, 1], offset: [0.221, 0] })
          : img(urls.frames[i]);
      const m = plane(sC, tex, w, h, p[0], p[1], p[2], { opaque: true, fog: true });
      m.rotation.y = ry;
      const caption = labelTexture(bag, content.exhibition.frames[i].caption.toUpperCase(), {
        font: '500 30px "IBM Plex Mono", monospace',
        color: "#4A443E",
      });
      const capM = plane(sC, caption, 1.6, 0.1, 0, 0, 0, { fog: true });
      capM.position.set(-w / 2 + 0.8, -h / 2 - 0.14, 0.001);
      m.add(capM);
      return {
        m,
        cap: capM,
        w,
        h,
        base: new T.Vector3(...p),
        lift: 0,
        url: content.exhibition.frames[i].href,
      };
    });
    const [phrase1, phrase2] = content.exhibition.phrases;
    const ph1 = serifText(phrase1, 220, 1700);
    const ph2 = serifText(phrase2, 220, 1500);
    plane(sC, ph1, 2.6, 2.6 / ph1.userData.aspect, 0.7, 0.8, -7, { fog: true });
    plane(sC, ph2, 2.3, 2.3 / ph2.userData.aspect, -0.5, -0.75, -15.2, { fog: true });
    const pathC = new T.CatmullRomCurve3(CAMERA_PATH_S03.map((a) => new T.Vector3(...a)));

    // ---------- Scene D · The Object ----------
    const sD = new T.Scene();
    sD.background = new T.Color(IV);
    const camD = new T.PerspectiveCamera(35, 1, 0.02, 100);
    const backdrop = verticalGradientTexture(bag, [
      [0, "#F5EEE6"],
      [0.62, "#F2E7DB"],
      [1, "#EAD8C3"],
    ]);
    plane(sD, backdrop, 18, 16, 0, 0.3, -3);
    const a3geo = new T.PlaneGeometry(3.22, 4.0, 160, 200);
    const a3mat = new T.MeshBasicMaterial({
      map: img(urls.signature),
      alphaMap: edgeFadeMask(bag, 128, 160, 0.12),
      transparent: true,
      depthWrite: false,
    });
    const a3 = new T.Mesh(a3geo, a3mat);
    a3.position.set(0, 0.3, 0);
    a3.renderOrder = 7000;
    sD.add(a3);
    disposables.push(a3geo, a3mat);
    applyDepthMap(a3geo, urls.depth, 0.38, ctx.isDisposed);
    const anchors = [
      new T.Vector3(0.11, -0.34, 0.36),
      new T.Vector3(0.32, -0.5, 0.36),
      new T.Vector3(0.19, -0.98, 0.36),
      new T.Vector3(0.0, 0.34, 0.37),
    ];
    const stops = [
      { t: new T.Vector3(0, 0.3, 0.1), d: 5.4 },
      { t: new T.Vector3(0.16, 0.62, 0.3), d: 3.0 },
      { t: new T.Vector3(0.1, 0.22, 0.36), d: 1.35 },
    ];

    // ---------- Post ----------
    const compositor = new StageCompositor(T, renderer, { loupeTargetSize: 512 });

    const st = {
      W: 1,
      H: 1,
      aspect: 1,
      f: 1,
      fObj: 1,
      narrow: false,
      gx: 0,
      gy: 0,
      tgx: 0,
      tgy: 0,
      mx: -1,
      my: -1,
      hold: false,
      touch: false,
      lA: 0,
      hover: -1,
      dX: 0,
      dY: 0,
      dT: 0,
      t0: performance.now(),
    };

    const resize = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      st.W = W;
      st.H = H;
      st.aspect = W / H;
      st.f = st.aspect < 1 ? 1 + (1 - st.aspect) * 1.1 : 1;
      st.narrow = W <= NARROW_MAX_WIDTH;
      st.fObj = st.narrow ? 1 + (1 - st.aspect) * NARROW_OBJECT_K : st.f;
      camC.fov = st.narrow ? NARROW_GALLERY_FOV : 45;
      const fs = st.narrow ? NARROW_FRAME_SCALE : 1;
      const cs = st.narrow ? NARROW_CAPTION_SCALE : 1;
      frames.forEach((fr) => {
        fr.m.scale.set(fs, fs, 1);
        // Подпись растёт от левого края рамы и опускается на прирост своей высоты.
        fr.cap.scale.set(cs, cs, 1);
        fr.cap.position.set(-fr.w / 2 + 0.8 * cs, -fr.h / 2 - 0.14 - (cs - 1) * 0.05, 0.001);
      });
      // Передний план растёт вместе с отъездом камеры, чтобы его края не попадали в кадр.
      const fgScale = (5 * st.fObj + 0.6) / (5 * st.f + 0.6);
      fgA.forEach((m) => m.scale.set(fgScale, fgScale, 1));
      compositor.resize(W, H, dpr, coarse ? 90 : 120);
      [camA, camB, camC, camD].forEach((c) => {
        c.aspect = st.aspect;
        c.updateProjectionMatrix();
      });
      // Заголовок S01 ставится от фрустума стартовой камеры на своей глубине.
      const narrow = st.aspect < 0.9;
      const halfH = (5 * st.fObj + 2) * Math.tan((19 * Math.PI) / 180);
      const halfW = halfH * st.aspect;
      const k = (2 * halfW) / W;
      const mPx = Math.min(64, Math.max(18, W * 0.04));
      const tw = narrow ? (2 * halfW - 2 * mPx * k) * 0.9 : Math.min(3.3, halfW * 0.78);
      const th = tw / tLeft.userData.aspect;
      const bPx = st.narrow ? NARROW_TITLE_BOTTOM : narrow ? 262 : Math.max(H * 0.11, 100);
      const tx = (st.narrow ? NARROW_HERO_START_X : 0) - halfW + mPx * k + tw / 2;
      const ty = (st.narrow ? NARROW_HERO_START_Y : 0.7) - halfH + bPx * k + th / 2 - th * 0.1;
      titleA.position.set(tx, ty, -2.0);
      titleA.scale.set(tw, th, 1);
      haloA.position.set(tx, ty, -2.03);
      haloA.scale.set(tw * 1.5, th * 1.8, 1);
    };

    // Beat-навигация: один свайп / щелчок / клавиша = один выстроенный кадр.
    const cz: number[] = [];
    for (let i = 0; i <= 400; i++) cz.push(pathC.getPoint(i / 400).z);
    const pcAt = (z: number) => {
      let b = 0;
      for (let i = 0; i <= 400; i++) if (Math.abs(cz[i] - z) < Math.abs(cz[b] - z)) b = i;
      return b / 400;
    };
    const beats = [
      0,
      215,
      377,
      400 + 320 * pcAt(-3.4),
      400 + 320 * pcAt(-9.6),
      690,
      770,
      842,
      936,
      1010,
    ];
    const nav = new BeatController({ beats, reducedMotion: reduce });
    ctx.onDispose(nav.attach());
    // Тот же отладочный хук, что у прототипа: window.__stageGo(i) — прыжок к beat'у.
    const win = window as unknown as { __stageGo?: (i: number) => void };
    win.__stageGo = (i) => nav.goTo(i);
    ctx.onDispose(() => {
      delete win.__stageGo;
    });

    const ray = new T.Raycaster();
    const ndc = new T.Vector2();
    const tmp = new T.Vector3();
    const frameMeshes = frames.map((fr) => fr.m);

    const onMove = (e: PointerEvent) => {
      st.mx = e.clientX;
      st.my = e.clientY;
      st.tgx = (e.clientX / st.W - 0.5) * 2;
      st.tgy = (e.clientY / st.H - 0.5) * 2;
      st.touch = e.pointerType === "touch";
    };
    const onDown = (e: PointerEvent) => {
      onMove(e);
      st.hold = true;
      st.dX = e.clientX;
      st.dY = e.clientY;
      st.dT = performance.now();
    };
    const onUp = (e: PointerEvent) => {
      st.hold = false;
      if (e.target instanceof Element && e.target.closest("a,button")) return;
      const g = nav.value;
      if (
        !(g > 418 && g < 700) ||
        Math.hypot(e.clientX - st.dX, e.clientY - st.dY) > 10 ||
        performance.now() - st.dT > 500
      )
        return;
      ndc.set((e.clientX / st.W) * 2 - 1, -(e.clientY / st.H) * 2 + 1);
      ray.setFromCamera(ndc, camC);
      const hit = ray.intersectObjects(frameMeshes, false)[0];
      if (hit) {
        const fr = frames.find((f) => f.m === hit.object);
        if (fr) window.open(fr.url, "_blank", "noopener");
      }
    };
    ctx.on("pointermove", onMove, { passive: true });
    ctx.on("pointerdown", onDown);
    ctx.on("pointerup", onUp);
    ctx.on("pointercancel", onUp);

    const body = document.body.style;
    const prevOverscroll = body.overscrollBehavior;
    body.overscrollBehavior = "none";

    const hudScenes = content.hud.scenes;
    let lastHud = -1;
    const $ = (ref: El) => ref.current;
    const setO = (ref: El, v: number) => setLayerOpacity($(ref), v);

    const frame = (now: number) => {
      const time = (now - st.t0) / 1000;
      const g = nav.update(now);
      const gk = reduce ? 0 : 0.06;
      st.gx += (st.tgx * (reduce ? 0 : 1) - st.gx) * (gk || 1);
      st.gy += (st.tgy * (reduce ? 0 : 1) - st.gy) * (gk || 1);
      const gx = st.gx;
      const gy = st.gy;
      const F = st.f;
      const p2 = clamp((g - 180) / 220);
      const p1 = clamp(g / 180);
      const p3 = clamp((g - 400) / 320);
      const p4 = clamp((g - 720) / 240);
      const breath = reduce ? 0 : Math.sin((time * Math.PI * 2) / 14) * 0.004;

      // A
      const dol = smoothstep(0.04, 1, p1);
      const intro = reduce ? 1 : smoothstep(0, 2.6, time);
      const gazeA = 1 - dol * 0.92;
      const startX = st.narrow ? NARROW_HERO_START_X : 0;
      const startY = st.narrow ? NARROW_HERO_START_Y : 0.7;
      camA.position.set(
        lerp(startX, hero.x, dol) + gx * 0.4 * gazeA,
        lerp(startY, hero.y, dol) - gy * 0.24 * gazeA,
        lerp(5 * st.fObj + (1 - intro) * 0.5, hero.z + 1.05, Math.pow(dol, 0.85)),
      );
      camA.fov = lerp(38, 26, dol) * (1 + breath);
      camA.updateProjectionMatrix();
      camA.lookAt(lerp(startX, hero.x, dol), lerp(startY, hero.y, dol), -3);
      [titleA, haloA, ...fgA].forEach((m) => {
        m.material.opacity = clamp((camA.position.z - m.position.z - 0.15) / 0.9);
      });
      // B
      const pe = smoothstep(0, 0.9, p2);
      const pp = Math.pow(pe, 1.7);
      camB.position.set(
        lerp(roseB.x, 0, pe) + gx * 0.3 * pe,
        lerp(roseB.y, 0.2, pe) - gy * 0.15 * pe,
        lerp(2.2, 11.6 * F, pp),
      );
      camB.fov = lerp(26, 40, pe) * (1 + breath);
      camB.updateProjectionMatrix();
      camB.lookAt(lerp(roseB.x, 0, pe), lerp(roseB.y, 0, pe), 0);
      macro.material.opacity = 1 - smoothstep(0.12, 0.5, pe);
      // C
      const pc = smoothstep(0, 1, p3);
      pathC.getPoint(pc, camC.position);
      camC.position.z += st.aspect < 1 ? 1.2 : 0;
      pathC.getPoint(Math.min(1, pc + 0.08), tmp);
      tmp.lerp(frames[5].base, smoothstep(0.8, 1, pc));
      if (pc < 0.03) tmp.set(0, 0, -1);
      camC.lookAt(tmp);
      camC.rotateY(-gx * 0.07);
      camC.rotateX(-gy * 0.04);
      const f3 = frames[3];
      const side = smoothstep(2.5, 8, camC.position.z - f3.base.z);
      f3.m.rotation.y = lerp(0.2, 1.0, side);
      f3.m.position.x = lerp(f3.base.x, -4.6, side);
      if (st.mx >= 0 && g > 400 && g < 720 && !st.touch) {
        ndc.set((st.mx / st.W) * 2 - 1, -(st.my / st.H) * 2 + 1);
        ray.setFromCamera(ndc, camC);
        const hit = ray.intersectObjects(frameMeshes, false)[0];
        st.hover = hit ? frames.findIndex((fr) => fr.m === hit.object) : -1;
      } else st.hover = -1;
      frames.forEach((fr, i) => {
        fr.lift += ((st.hover === i ? 0.35 : 0) - fr.lift) * 0.1;
        fr.m.position.z = fr.base.z + fr.lift;
      });
      // D
      const q = p4;
      let s0: number, s1: number, k: number;
      if (q < 0.22) [s0, s1, k] = [0, 0, 0];
      else if (q < 0.42) [s0, s1, k] = [0, 1, smoothstep(0.22, 0.42, q)];
      else if (q < 0.6) [s0, s1, k] = [1, 1, 0];
      else if (q < 0.8) [s0, s1, k] = [1, 2, smoothstep(0.6, 0.8, q)];
      else [s0, s1, k] = [2, 2, 0];
      const tgt = stops[s0].t.clone().lerp(stops[s1].t, k);
      // Общий план (стоп 1) на узком экране — с бо́льшим отъездом, детали (стопы 2–3) — как в прототипе.
      const stopF = (i: number) => (i === 0 ? st.fObj : F);
      const dist = lerp(stops[s0].d * stopF(s0), stops[s1].d * stopF(s1), k);
      const yaw = gx * 0.105;
      const pit = -gy * 0.07;
      camD.position.set(
        tgt.x + Math.sin(yaw) * Math.cos(pit) * dist,
        tgt.y + Math.sin(pit) * dist,
        tgt.z + Math.cos(yaw) * Math.cos(pit) * dist,
      );
      camD.fov = 35 * (1 + breath);
      camD.updateProjectionMatrix();
      camD.lookAt(tgt);

      // Пары сцен и параметры переходов
      let A: THREE.Scene = sA;
      let cA: THREE.Camera = camA;
      let B: THREE.Scene | null = null;
      let cB: THREE.Camera | null = null;
      let m = 0;
      let disp = 0;
      let blur = 0;
      let expo = 0;
      let sceneIx = 0;
      if (g < 160) sceneIx = 0;
      else if (g < 205) {
        B = sB;
        cB = camB;
        m = smoothstep(160, 205, g);
        disp = 0.1;
        blur = Math.sin(Math.PI * m) * 3.2;
        expo = Math.sin(Math.PI * m) * 0.12;
        sceneIx = m < 0.5 ? 0 : 1;
      } else if (g < 385) {
        A = sB;
        cA = camB;
        sceneIx = 1;
      } else if (g < 418) {
        A = sB;
        cA = camB;
        B = sC;
        cB = camC;
        m = smoothstep(385, 418, g);
        disp = 0.035;
        blur = Math.sin(Math.PI * m) * 1.6;
        sceneIx = m < 0.5 ? 1 : 2;
      } else if (g < 700) {
        A = sC;
        cA = camC;
        sceneIx = 2;
      } else if (g < 738) {
        A = sC;
        cA = camC;
        B = sD;
        cB = camD;
        m = smoothstep(700, 738, g);
        disp = 0.03;
        blur = Math.sin(Math.PI * m) * 2.2;
        sceneIx = m < 0.5 ? 2 : 3;
      } else {
        A = sD;
        cA = camD;
        sceneIx = 3;
      }
      blur += (1 - intro) * 9;

      const passB = B && cB ? { scene: B, camera: cB } : null;
      compositor.renderScenes({ scene: A, camera: cA }, passB);
      // Лупа на телефоне отключена (решение владельца).
      const loupeOn = !st.narrow && A === sD && !B && st.hold && st.mx >= 0 && g < 960;
      st.lA += ((loupeOn ? 1 : 0) - st.lA) * (reduce ? 1 : 0.16);
      if (st.lA > 0.01) {
        const ly = st.touch ? st.my - 110 : st.my;
        compositor.renderLoupe(sD, camD, st.mx, ly, st.W, 3.2);
      }
      compositor.composite({
        b: passB,
        mix: m,
        disp,
        blur,
        expo,
        time,
        loupe: st.lA,
        grain: input.grain ? 0.035 : 0,
      });

      // DOM
      setO(dom.brand, smoothstep(150, 190, g));
      setO(dom.cta, reduce ? 1 : smoothstep(2.4, 3.6, time));
      const heroV = (reduce ? 1 : smoothstep(2.8, 4.2, time)) * (1 - smoothstep(4, 36, g));
      setO(dom.hero, heroV);
      setO(dom.kick, (reduce ? 1 : smoothstep(2.4, 3.6, time)) * (1 - smoothstep(60, 140, g)));
      setO(
        dom.hint3,
        smoothstep(425, 450, g) * (1 - smoothstep(680, 700, g)) * (st.touch ? 1 : 0.95),
      );
      setO(dom.hint1, (reduce ? 1 : smoothstep(4.2, 5.4, time)) * (1 - smoothstep(2, 14, g)));
      const vRose = smoothstep(198, 222, g) * (1 - smoothstep(240, 285, g));
      const vL2 = smoothstep(0.78, 0.9, p2) * (1 - smoothstep(380, 398, g));
      setO(dom.blockAssortment, vRose);
      setO(dom.blockPersonal, vL2);
      const s4v =
        smoothstep(740, 765, g) * (1 - smoothstep(0.22, 0.3, p4)) * (1 - smoothstep(955, 975, g));
      setO(dom.signature, s4v);
      const vB = smoothstep(0.44, 0.52, p4) * (1 - smoothstep(0.58, 0.66, p4));
      const vC = smoothstep(0.82, 0.88, p4) * (1 - smoothstep(955, 975, g));
      setO(dom.delivery, vB);
      setO(dom.care, vC);
      setO(dom.veil, Math.max(vRose, vL2, s4v, vB, vC));
      setO(
        dom.hint4,
        smoothstep(745, 780, g) *
          (1 - smoothstep(0.2, 0.26, p4)) *
          (st.lA > 0.2 || st.narrow ? 0 : 1),
      );
      setO(dom.final, smoothstep(975, 1010, g));
      const out = 1 - smoothstep(0.2, 0.26, p4);
      const vis = [
        // «Лён, необработанный» на телефоне скрыта — сталкивалась с интро-блоком.
        smoothstep(0.02, 0.1, p4) * out * (st.narrow ? 0 : 1),
        smoothstep(0.02, 0.1, p4) * out,
        smoothstep(0.04, 0.12, p4) * out,
        smoothstep(0.82, 0.9, p4) * 0, // «Кромка лепестка» в прототипе всегда скрыта
      ];
      anchors.forEach((a, i) => {
        const el = $(dom.callouts[i]);
        if (!el) return;
        const v = g > 738 && g < 970 ? vis[i] * (1 - st.lA) : 0;
        el.style.opacity = v.toFixed(3);
        if (v > 0) {
          const p = projectToViewport(a, camD, st.W, st.H, tmp);
          // Подпись не помещается справа — разворачиваем выноску влево от точки.
          const w = el.offsetWidth;
          const flip = p.x + w > st.W - 8;
          el.style.flexDirection = flip ? "row-reverse" : "row";
          const x = flip ? Math.max(8, p.x - w + 7) : p.x;
          el.style.transform = `translate3d(${x.toFixed(1)}px, ${(p.y - 10).toFixed(1)}px, 0)`;
        }
      });
      if (sceneIx !== lastHud) {
        lastHud = sceneIx;
        const scene = $(dom.hudScene);
        if (scene) scene.textContent = hudScenes[sceneIx];
      }
      const bar = $(dom.hudBar);
      if (bar) bar.style.width = (clamp(g / 960) * 100).toFixed(2) + "%";
      body.cursor = st.hover >= 0 ? "pointer" : A === sD && !B && !st.narrow ? "zoom-in" : "";
    };

    return {
      frame,
      resize,
      dispose() {
        disposables.forEach((d) => d.dispose());
        compositor.dispose();
        restore();
        body.cursor = "";
        body.overscrollBehavior = prevOverscroll;
      },
    };
  };
}

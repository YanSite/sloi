"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { resolveAsset, toObjectPosition } from "@/lib/assets";
import type { AssetManifest, MediaRef } from "@/lib/types";
import type { ImmersiveStageProps } from "@/components/wow/sections";
import { smoothstep } from "@/components/wow/motion";
import { useLayerStage, type LayerStageFrame } from "@/components/wow/stage";
import { kukiLukiChoreography, kukiLukiHud } from "../choreography";
import type { KukiLukiStageContent, Link } from "./content-types";
import styles from "./stage.module.css";
import "../assets/fonts/fonts.css";

/**
 * Immersive-stage Куки Луки — реализация варианта "kuki-luki" секции
 * `immersive-stage`, зарегистрированная через `SiteConfig.sectionVariants`.
 * Разметка ниже — прототип 1:1 (порядок слоёв, inline-стили); каждый
 * `data-l` оживляет generic-рантайм `useLayerStage` по хореографии из
 * choreography.ts, а HUD и подписи сцена обновляет сама в `onFrame`.
 */

export type KukiLukiStageProps = ImmersiveStageProps<KukiLukiStageContent>;

const CREAM = "#FFF6F9";
const INK_DARK = "#16050A";
const SHEET = "#F3EAE2";
const BG = "#120407";
const EDGE = "clamp(20px,3.2vw,48px)";
const MACRO_FRAME: CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "50%",
  width: "115vw",
  height: "115vh",
  color: CREAM,
};
const MACRO: CSSProperties = {
  ...MACRO_FRAME,
  opacity: 0,
  visibility: "hidden",
  willChange: "transform,opacity,filter",
};
const PORTRAIT: CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "50%",
  width: "max(60vmin,min(80vw,40vh))",
  height: "max(60vmin,min(80vw,40vh))",
  color: CREAM,
  opacity: 0,
  visibility: "hidden",
  willChange: "transform,opacity,filter",
};
const FILL: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
};
const HIDDEN: CSSProperties = { opacity: 0, visibility: "hidden" };
const LABEL: CSSProperties = {
  fontWeight: 400,
  fontSize: 10,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
};
const VALUE: CSSProperties = {
  fontWeight: 400,
  fontSize: "clamp(15px,1.25vw,19px)",
  letterSpacing: "0.02em",
};
const PILL: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  minHeight: 44,
  boxSizing: "border-box",
  borderRadius: 999,
  fontWeight: 400,
  fontSize: 12,
};
/** Студии вкусов: Орео почти чёрная, Фрамбини малиновая, Киндер молочная. */
const FLAVOR_STUDIOS = [
  "radial-gradient(ellipse 60% 55% at 58% 42%, #2E2A2B 0%, #151213 55%, #070606 100%)",
  "radial-gradient(ellipse 60% 55% at 58% 42%, #B01F55 0%, #6E0C31 52%, #2E0413 100%)",
  "radial-gradient(ellipse 60% 55% at 58% 42%, #FBF4EA 0%, #EEDFCB 55%, #CDB696 100%)",
];
/** Подложки макро-кадров вкусов на время загрузки: [текстура, начинка]. */
const MACRO_UNDERLAY = [
  ["#241009", "#2A1A16"],
  ["#241009", "#3A0F1C"],
  ["#3A220F", "#2E1609"],
];
/** Тени вырезок — на обёртке: у Киндера сам img обрезан сверху, и тень должна идти по обрезанному силуэту. */
const FLAVOR_SHADOW = [
  "drop-shadow(0 3vmin 4vmin rgba(0,0,0,0.55))",
  "drop-shadow(0 3vmin 4vmin rgba(20,4,8,0.45))",
  "drop-shadow(0 3vmin 4vmin rgba(20,4,8,0.35))",
];
/** Вырезка Киндера: верхние 20% кадра обрезаны (там край второго печенья). */
const FLAVOR_CLIP = [undefined, undefined, "inset(20% 0 0 0)"];
const GRAIN_SVG =
  "url(\"data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const pad2 = (n: number) => String(n).padStart(2, "0");

function Media({
  media,
  assets,
  fit = "cover",
  clip,
}: {
  media: MediaRef;
  assets: AssetManifest;
  fit?: "cover" | "contain";
  clip?: string;
}) {
  const a = resolveAsset(media, assets);
  const src = a.sources[0]?.url;
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- кадр сцены трансформируется покадрово; next/image с его обёрткой и lazy-загрузкой тут только мешает
    <img
      src={src}
      alt={media.alt ?? ""}
      draggable={false}
      decoding="async"
      style={{
        ...FILL,
        objectFit: fit,
        objectPosition: toObjectPosition(a.focalPoint),
        clipPath: clip,
      }}
    />
  );
}

function Video({
  video,
  poster,
  assets,
}: {
  video: MediaRef;
  poster: MediaRef;
  assets: AssetManifest;
}) {
  const src = resolveAsset(video, assets).sources[0]?.url;
  if (!src) return null;
  return (
    <video
      src={src}
      poster={resolveAsset(poster, assets).sources[0]?.url}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden
      style={{ ...FILL, objectFit: "cover" }}
    />
  );
}

function A({ link, className, style }: { link: Link; className?: string; style?: CSSProperties }) {
  return (
    <a
      href={link.href}
      className={className}
      style={style}
      {...(link.external ? { target: "_blank", rel: "noopener" } : {})}
    >
      {link.label}
    </a>
  );
}

export function KukiLukiStage({ stage: c, assets }: KukiLukiStageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState(0);
  const flavor = c.flavors[variant];
  const notes = [flavor.textureNote, ...flavor.fillingNotes];

  const progRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const stateRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const noteRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hud = useRef({ ink: "", beat: -1, state: -1 });

  const onFrame = useCallback(
    ({ p, variant: v, beat, beatCount }: LayerStageFrame, root: HTMLElement) => {
      const { ink, statesBreaks, statesDimOpacity, annotations: an } = kukiLukiHud;
      const h = hud.current;
      const dark =
        (p > ink.darkRange[0] && p < ink.darkRange[1]) ||
        (v === ink.darkVariant.variant &&
          p > ink.darkVariant.range[0] &&
          p < ink.darkVariant.range[1]);
      const color = dark ? ink.dark : ink.light;
      if (color !== h.ink) {
        h.ink = color;
        root.style.setProperty("--ink", color);
      }
      if (progRef.current) progRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      if (beat !== h.beat && countRef.current) {
        h.beat = beat;
        countRef.current.textContent = `${pad2(beat + 1)} / ${pad2(beatCount)}`;
      }
      const st = p < statesBreaks[0] ? 0 : p < statesBreaks[1] ? 1 : 2;
      if (st !== h.state) {
        h.state = st;
        stateRefs.current.forEach((el, i) => {
          if (el) el.style.opacity = i === st ? "1" : String(statesDimOpacity);
        });
      }
      noteRefs.current.forEach((el, i) => {
        if (!el) return;
        const f = an.filling;
        const k = i - 1;
        const o =
          i === 0
            ? smoothstep(an.texture.in[0], an.texture.in[1], p) *
              (1 - smoothstep(an.texture.out[0], an.texture.out[1], p))
            : smoothstep(f.in[0] + k * f.stagger, f.in[1] + k * f.stagger, p) *
              (1 - smoothstep(f.out[0], f.out[1], p));
        el.style.opacity = o.toFixed(3);
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
      });
    },
    [],
  );

  useLayerStage(rootRef, kukiLukiChoreography, { onVariantChange: setVariant, onFrame });

  // Фон документа прототипа: под сценой и при overscroll — тот же тёмный.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = [html.style.background, body.style.background, html.style.overscrollBehavior];
    html.style.background = BG;
    body.style.background = BG;
    html.style.overscrollBehavior = "none";
    return () => {
      [html.style.background, body.style.background, html.style.overscrollBehavior] = prev;
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={styles.root}
      style={{ position: "relative", width: "100%", color: CREAM, "--ink": CREAM } as CSSProperties}
    >
      <h1 className={styles.srOnly}>{c.brand}</h1>
      <div style={{ height: "100vh", pointerEvents: "none" }} />

      <div
        style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          background: BG,
          pointerEvents: "none",
        }}
      >
        <div
          data-l="bgPink"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 70% at 62% 40%, #FF69B0 0%, #FF3E9A 38%, #E0288A 70%, #A8145F 100%)",
          }}
        />

        <div
          data-l="title"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "max-content",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            fontWeight: 500,
            fontSize: "min(30vw,24vh)",
            lineHeight: 0.84,
            letterSpacing: "-0.055em",
            color: CREAM,
            willChange: "transform,opacity",
            ...HIDDEN,
          }}
        >
          {c.title.lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginTop: "clamp(18px,3vh,32px)",
              fontWeight: 400,
              fontSize: "clamp(10px,0.8vw,12px)",
              lineHeight: 1,
              letterSpacing: "0.22em",
            }}
          >
            <span style={{ width: 32, height: 1, background: "currentColor" }} />
            {c.title.sub}
          </span>
        </div>
        <div
          data-l="s01meta"
          style={{
            position: "absolute",
            top: "clamp(22px,4.4vh,44px)",
            right: EDGE,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 8,
            color: CREAM,
            fontWeight: 400,
            fontSize: 10,
            letterSpacing: "0.22em",
            lineHeight: 1.4,
            textAlign: "right",
            ...HIDDEN,
          }}
        >
          {c.meta.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>

        {/*
          Растушёвка краёв (radial-gradient closest-side 62% → 100%) и тень
          прототипа запечены в альфа-канал signature-cookie.webp: CSS-маска
          и размытая тень внутри слоя заставляли Chrome перерастеризовывать
          его на каждом масштабе (×0.9…×5), и печенье рисовалось кусками.
        */}
        <div
          data-l="hero"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "max(100vmin,min(130vw,62vh))",
            height: "max(100vmin,min(130vw,62vh))",
            color: CREAM,
            willChange: "transform,opacity,filter",
            ...HIDDEN,
          }}
        >
          <Media media={c.media.signatureCookie} assets={assets} fit="contain" />
        </div>

        <div
          data-l="tagline"
          style={{
            position: "absolute",
            left: EDGE,
            bottom: "clamp(24px,5vh,56px)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontWeight: 400,
            fontSize: "clamp(12px,0.95vw,14px)",
            letterSpacing: "0.2em",
            lineHeight: 1.5,
            color: CREAM,
            ...HIDDEN,
          }}
        >
          {c.tagline.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>

        <div
          data-l="bgDark"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 55% 50% at 55% 38%, #5C0B28 0%, #2A0610 50%, #0F0305 100%)",
            ...HIDDEN,
          }}
        >
          {FLAVOR_STUDIOS.map((bg, i) => (
            <div
              key={bg}
              style={{
                position: "absolute",
                inset: 0,
                background: bg,
                opacity: variant === i ? 1 : 0,
                transition: "opacity 0.5s ease",
              }}
            />
          ))}
        </div>

        <div data-l="crack" style={{ ...MACRO, background: "#3A1A10" }}>
          <Media media={c.media.crack} assets={assets} />
          <Video video={c.media.crackVideo} poster={c.media.crack} assets={assets} />
        </div>
        <div
          data-l="crackRim"
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 70% 60% at 50% 50%, #1A0508 0%, #0A0203 70%)",
            ...HIDDEN,
          }}
        />
        <div
          data-l="interior"
          style={{ position: "absolute", inset: 0, overflow: "hidden", ...HIDDEN }}
        >
          <div
            data-l="interiorImg"
            style={{ ...MACRO_FRAME, background: "#2A0E08", willChange: "transform,filter" }}
          >
            <Media media={c.media.interior} assets={assets} />
            <Video video={c.media.interiorVideo} poster={c.media.interior} assets={assets} />
          </div>
        </div>
        <div
          data-l="haze"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,40,130,0.55), rgba(255,40,130,0) 70%)",
            mixBlendMode: "screen",
            ...HIDDEN,
          }}
        />
        <div
          data-l="insideText"
          style={{
            position: "absolute",
            left: "clamp(20px,5vw,72px)",
            bottom: "clamp(96px,14vh,140px)",
            maxWidth: "min(88vw,760px)",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            color: CREAM,
            pointerEvents: "none",
            textShadow: "0 2px 24px rgba(10,2,3,0.55)",
            ...HIDDEN,
          }}
        >
          <span style={{ fontWeight: 400, fontSize: 11, letterSpacing: "0.22em" }}>
            {c.interlude.eyebrow}
          </span>
          <span
            style={{
              fontWeight: 500,
              fontSize: "clamp(40px,6.4vw,104px)",
              lineHeight: 0.9,
              letterSpacing: "-0.05em",
              textWrap: "balance",
            }}
          >
            {c.interlude.headline}
          </span>
        </div>

        {/* Вырезки вкусов в порядке прототипа: Киндер снизу, Орео сверху. */}
        {[2, 1, 0].map((i) => (
          <div key={i} data-l={`p${i}`} style={PORTRAIT}>
            <div style={{ position: "absolute", inset: 0, filter: FLAVOR_SHADOW[i] }}>
              <Media
                media={c.flavors[i].whole}
                assets={assets}
                fit="contain"
                clip={FLAVOR_CLIP[i]}
              />
            </div>
          </div>
        ))}

        <div
          data-l="whole"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "max(min(86vw,300px),min(34vw,440px))",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            color: "var(--ink)",
            transition: "color 0.4s",
            ...HIDDEN,
          }}
        >
          <span
            style={{
              fontWeight: 400,
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.7,
            }}
          >
            {pad2(variant + 1)} / {pad2(c.flavors.length)}
          </span>
          <span
            style={{
              fontWeight: 500,
              fontSize: "clamp(44px,5.6vw,84px)",
              lineHeight: 0.88,
              letterSpacing: "-0.05em",
              // Название вкуса не переносится по дефису.
              whiteSpace: "nowrap",
            }}
          >
            {flavor.title}
          </span>
          <span
            style={{
              fontWeight: 300,
              fontSize: "clamp(14px,1.05vw,16px)",
              lineHeight: 1.55,
              textWrap: "pretty",
            }}
          >
            {flavor.description}
          </span>
        </div>

        {c.flavors.map((f, i) => (
          <div
            key={`tx${i}`}
            data-l={`tx${i}`}
            style={{ ...MACRO, background: MACRO_UNDERLAY[i][0] }}
          >
            <Media media={f.texture} assets={assets} />
          </div>
        ))}
        {c.flavors.map((f, i) => (
          <div
            key={`fl${i}`}
            data-l={`fl${i}`}
            style={{ ...MACRO, background: MACRO_UNDERLAY[i][1] }}
          >
            <Media media={f.filling} assets={assets} />
          </div>
        ))}

        {notes.map((n, i) => {
          const flip = n.x > kukiLukiHud.annotations.flipX;
          return (
            <div
              key={i}
              ref={(el) => {
                noteRefs.current[i] = el;
              }}
              style={{ position: "absolute", left: `${n.x}%`, top: `${n.y}%`, ...HIDDEN }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -3,
                  top: -3,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: CREAM,
                  boxShadow: "0 0 0 6px rgba(244,234,226,0.14)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: 72,
                  height: 1,
                  background: "rgba(244,234,226,0.75)",
                  transformOrigin: "0 50%",
                  transform: flip ? "rotate(-152deg)" : "rotate(-28deg)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  ...(flip
                    ? { left: "auto", right: 66, textAlign: "right" }
                    : { left: 66, right: "auto", textAlign: "left" }),
                  top: -52,
                  width: "max-content",
                  maxWidth: "min(230px,44vw)",
                  padding: "9px 12px",
                  background: "rgba(14,3,5,0.55)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  color: CREAM,
                  fontWeight: 400,
                  fontSize: 11,
                  lineHeight: 1.4,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  textWrap: "balance",
                }}
              >
                {n.label}
              </div>
            </div>
          );
        })}

        <div
          data-l="states"
          style={{
            position: "absolute",
            right: "clamp(18px,3.2vw,48px)",
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 14,
            color: "var(--ink)",
            transition: "color 0.4s",
            ...LABEL,
            ...HIDDEN,
          }}
        >
          {c.states.map((label, i) => (
            <span
              key={label}
              ref={(el) => {
                stateRefs.current[i] = el;
              }}
              style={{ display: "flex", gap: 10, alignItems: "center", transition: "opacity 0.3s" }}
            >
              {label} <span style={{ width: 18, height: 1, background: "currentColor" }} />{" "}
              {pad2(i + 1)}
            </span>
          ))}
        </div>

        <div
          data-veil=""
          style={{
            position: "absolute",
            inset: 0,
            background: INK_DARK,
            opacity: 0,
            pointerEvents: "none",
          }}
        />

        <div
          data-l="menu"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "100vw",
            height: "100vh",
            overflow: "auto",
            background: SHEET,
            color: INK_DARK,
            ...HIDDEN,
          }}
        >
          <div
            style={{
              boxSizing: "border-box",
              minHeight: "100%",
              padding: "clamp(72px,11vh,110px) clamp(20px,5vw,80px) clamp(28px,5vh,56px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))",
              gap: "clamp(28px,5vw,96px)",
              alignContent: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <span
                style={{
                  fontWeight: 400,
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                {c.menu.eyebrow}
              </span>
              <h2
                style={{
                  margin: 0,
                  fontWeight: 500,
                  fontSize: "clamp(48px,7vw,112px)",
                  lineHeight: 0.86,
                  letterSpacing: "-0.055em",
                }}
              >
                {c.menu.headline}
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingTop: 14 }}>
                <a
                  href={c.menu.cta.href}
                  target="_blank"
                  rel="noopener"
                  className={styles.hoverMenuCta}
                  style={{
                    ...PILL,
                    padding: "18px 26px",
                    background: INK_DARK,
                    color: SHEET,
                    letterSpacing: "0.2em",
                  }}
                >
                  {c.menu.cta.label} <span style={{ letterSpacing: 0 }}>↗</span>
                </a>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {c.flavors.map((f) => (
                <div
                  key={f.title}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "clamp(64px,7vw,104px) minmax(0,1fr) auto",
                    gap: "clamp(14px,1.6vw,24px)",
                    alignItems: "center",
                    padding: "clamp(14px,2.2vh,22px) 0",
                    borderTop: "1px solid rgba(22,5,10,0.9)",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "clamp(64px,7vw,104px)",
                      height: "clamp(64px,7vw,104px)",
                      color: INK_DARK,
                    }}
                  >
                    <Media media={f.packshot} assets={assets} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
                    <span
                      style={{
                        fontWeight: 500,
                        fontSize: "clamp(22px,2.2vw,34px)",
                        lineHeight: 0.95,
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {f.title}
                    </span>
                    <span
                      style={{
                        fontWeight: 300,
                        fontSize: 13,
                        lineHeight: 1.45,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {f.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          data-l="s06"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: `${EDGE} ${EDGE} clamp(44px,5vw,64px)`,
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(16px,2vw,32px)",
            alignItems: "flex-end",
            color: CREAM,
            ...HIDDEN,
          }}
        >
          <div
            style={{
              flex: "1 1 420px",
              minWidth: 0,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,150px),1fr))",
              gap: "clamp(16px,2vw,32px)",
              alignItems: "end",
            }}
          >
            {c.visit.fields.map((f) => (
              <div key={f.label} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={LABEL}>{f.label}</span>
                {f.href ? (
                  <a href={f.href} style={VALUE}>
                    {f.value}
                  </a>
                ) : (
                  <span style={VALUE}>{f.value}</span>
                )}
              </div>
            ))}
          </div>
          <div style={{ flex: "none", display: "flex", flexWrap: "nowrap", gap: 8 }}>
            <a
              href={c.visit.primary.href}
              className={styles.hoverPrimary}
              style={{
                ...PILL,
                justifyContent: "center",
                padding: "18px 30px",
                background: CREAM,
                color: INK_DARK,
                letterSpacing: "0.22em",
              }}
            >
              {c.visit.primary.label} <span style={{ letterSpacing: 0 }}>→</span>
            </a>
            <A
              link={c.visit.secondary}
              className={styles.hoverSecondary}
              style={{
                ...PILL,
                padding: "18px 22px",
                border: `1px solid ${CREAM}`,
                letterSpacing: "0.22em",
              }}
            />
          </div>
        </div>

        <div
          data-grain=""
          style={{
            position: "absolute",
            inset: -60,
            opacity: 0.13,
            mixBlendMode: "overlay",
            backgroundImage: GRAIN_SVG,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(130% 100% at 50% 45%, rgba(0,0,0,0) 55%, rgba(20,0,8,0.38) 100%)",
          }}
        />
      </div>

      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          top: 0,
          padding: `clamp(18px,2.6vw,36px) ${EDGE}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          pointerEvents: "none",
          color: "var(--ink)",
          transition: "color 0.4s",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span
            data-l="brand"
            style={{ fontWeight: 500, fontSize: 12, letterSpacing: "0.24em", ...HIDDEN }}
          >
            {c.brand}
          </span>
        </div>
        <a
          data-l="order"
          href={c.order.href}
          style={{
            fontWeight: 400,
            fontSize: 11,
            letterSpacing: "0.22em",
            padding: "12px 0",
            pointerEvents: "auto",
            ...HIDDEN,
          }}
        >
          {c.order.label}
        </a>
      </div>

      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          padding: `clamp(18px,2.6vw,36px) ${EDGE}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 16,
          pointerEvents: "none",
          color: "var(--ink)",
          transition: "color 0.4s",
        }}
      >
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 20,
            paddingBottom: 10,
          }}
        >
          <div
            data-l="hint"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontWeight: 400,
              fontSize: 10,
              letterSpacing: "0.22em",
              ...HIDDEN,
            }}
          >
            {c.hint} <span style={{ width: 40, height: 1, background: "currentColor" }} />
          </div>
          <span ref={countRef} style={{ fontWeight: 400, fontSize: 10, letterSpacing: "0.22em" }}>
            01 / {pad2(kukiLukiChoreography.beats.length)}
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            right: EDGE,
            bottom: "clamp(12px,1.6vw,22px)",
            width: 120,
            height: 1,
          }}
        >
          <div
            style={{ position: "absolute", inset: 0, background: "currentColor", opacity: 0.25 }}
          />
          <div
            ref={progRef}
            style={{
              position: "absolute",
              inset: 0,
              background: "currentColor",
              transformOrigin: "0 50%",
              transform: "scaleX(0)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

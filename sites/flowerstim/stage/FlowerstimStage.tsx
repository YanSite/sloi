"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { resolveAsset } from "@/lib/assets";
import type { AssetManifest, MediaRef } from "@/lib/types";
import type { ImmersiveStageProps } from "@/components/wow/sections";
import { ImmersiveStageHost, type StageProgramFactory } from "@/components/wow/webgl/stage";
import type { FlowerstimStageContent, SplitHeading, TextBlock } from "./content-types";
import { createFlowerstimProgram, type FlowerstimDom } from "./program";
import { FlowerstimFallback } from "./FlowerstimFallback";
import styles from "./stage.module.css";
import "../assets/fonts/fonts.css";

/**
 * Flowerstim immersive-stage — реализация варианта "flowerstim" секции
 * `immersive-stage`, зарегистрированная через `SiteConfig.sectionVariants`.
 * DOM-слой ниже — прототип 1:1 (разметка, inline-стили, порядок слоёв);
 * видимостью слоёв и выносками управляет программа сцены через refs.
 */

export type FlowerstimStageProps = ImmersiveStageProps<FlowerstimStageContent>;

const MONO = "'IBM Plex Mono',monospace";
const SERIF = "var(--fs-serif)";
const SERIF_W = "var(--fs-serif-w)";
const INK = "var(--fs-ink)";
const TEXT = "var(--fs-text)";
const ACCENT = "var(--fs-accent)";
const SURFACE = "#FBF8F2";
const MUTED = "#4A443E";
const HAIRLINE = "rgba(43,39,35,.28)";
const GLOW_16 = "0 0 6px rgba(250,246,239,.95),0 0 16px rgba(250,246,239,.85)";
const GLOW_14 = "0 0 6px rgba(250,246,239,.95),0 0 14px rgba(250,246,239,.85)";
const EXTERNAL = { target: "_blank", rel: "noopener" } as const;

const monoLabel: CSSProperties = {
  fontFamily: MONO,
  fontSize: 11,
  letterSpacing: ".1em",
  textTransform: "uppercase",
  color: TEXT,
};
const blockStyle: CSSProperties = {
  position: "absolute",
  left: "clamp(20px,6vw,96px)",
  top: "17vh",
  maxWidth: "min(520px,84vw)",
  display: "flex",
  flexDirection: "column",
  gap: 18,
  textShadow: GLOW_16,
  opacity: 0,
};
const blockHeading: CSSProperties = {
  fontFamily: SERIF,
  fontWeight: SERIF_W,
  fontSize: "clamp(32px,3.9vw,54px)",
  lineHeight: 1.02,
  letterSpacing: "-.015em",
  color: INK,
  textWrap: "pretty",
};
const blockBody: CSSProperties = {
  fontSize: 15,
  lineHeight: 1.6,
  color: TEXT,
  maxWidth: "36ch",
  textWrap: "pretty",
};
const underlineLink: CSSProperties = {
  pointerEvents: "auto",
  alignSelf: "flex-start",
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  fontFamily: MONO,
  fontSize: 11,
  letterSpacing: ".1em",
  textTransform: "uppercase",
  color: INK,
  textDecoration: "none",
  borderBottom: `1px solid ${INK}`,
  padding: "6px 0 5px",
  textShadow: "none",
};
const hintStyle: CSSProperties = {
  position: "absolute",
  left: "50%",
  bottom: "11vh",
  transform: "translateX(-50%)",
  color: TEXT,
  background: SURFACE,
  padding: "5px 9px",
  ...monoLabel,
  whiteSpace: "nowrap",
  opacity: 0,
};

function Heading({ h }: { h: SplitHeading }) {
  return (
    <span style={blockHeading}>
      {h.lead}
      <br />
      <em style={{ color: ACCENT }}>{h.accent}</em>
    </span>
  );
}

function UnderlineLink({ link }: { link: { label: string; href: string } }) {
  return (
    <a href={link.href} {...EXTERNAL} className={styles.hoverAccent} style={underlineLink}>
      {link.label} <span>→</span>
    </a>
  );
}

function Block({
  block,
  refEl,
  children,
}: {
  block: TextBlock;
  refEl: RefObject<HTMLDivElement | null>;
  children?: ReactNode;
}) {
  return (
    <div ref={refEl} style={blockStyle}>
      <span style={monoLabel}>{block.label}</span>
      <Heading h={block.heading} />
      <span style={blockBody}>{block.body}</span>
      {children}
      <UnderlineLink link={block.link} />
    </div>
  );
}

function Callout({ label, refEl }: { label: string; refEl: RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={refEl}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        display: "flex",
        alignItems: "center",
        gap: 8,
        opacity: 0,
        willChange: "transform",
      }}
    >
      <span
        style={{ width: 7, height: 7, borderRadius: "50%", background: TEXT, marginLeft: -3.5 }}
      />
      <span style={{ width: 44, height: 1, background: TEXT }} />
      <span
        style={{
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: ".06em",
          textTransform: "uppercase",
          background: SURFACE,
          padding: "4px 7px",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
}

const url = (ref: MediaRef, manifest: AssetManifest) => {
  const src = resolveAsset(ref, manifest).sources[0]?.url;
  if (!src) throw new Error(`Asset "${ref.assetId}" has no file — ASSET GAP.`);
  return src;
};

/** Секции-распорки прототипа: высоты сцен в режиме обычного скролла (в beat-режиме скролл выключен). */
const SPACERS: [string, string][] = [
  ["S01 Aperture", "180vh"],
  ["S02 Pull-back", "220vh"],
  ["S03 Exhibition", "320vh"],
  ["S04 The Object", "240vh"],
  ["End", "100vh"],
];

export function FlowerstimStage({ stage: c, assets, theme }: FlowerstimStageProps) {
  // Refs DOM-слоя: видимостью и позицией слоёв управляет программа сцены.
  const kickRef = useRef<HTMLSpanElement>(null);
  const brandRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const hint1Ref = useRef<HTMLDivElement>(null);
  const hint3Ref = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const blockAssortmentRef = useRef<HTMLDivElement>(null);
  const blockPersonalRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  const hint4Ref = useRef<HTMLDivElement>(null);
  const deliveryRef = useRef<HTMLDivElement>(null);
  const careRef = useRef<HTMLDivElement>(null);
  const co0Ref = useRef<HTMLDivElement>(null);
  const co1Ref = useRef<HTMLDivElement>(null);
  const co2Ref = useRef<HTMLDivElement>(null);
  const co3Ref = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const hudSceneRef = useRef<HTMLSpanElement>(null);
  const hudBarRef = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  const copyPromo = () => {
    try {
      void navigator.clipboard.writeText(c.promo.code).catch(() => {});
    } catch (_e) {
      // Clipboard API недоступен (не-secure context) — подпись всё равно меняется, как в прототипе.
    }
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 2200);
  };

  const background = theme.colors.background;
  // Программа создаётся лениво — фабрику вызывает host из эффекта, не во время рендера.
  const program = useMemo<StageProgramFactory>(() => {
    const urls = {
      background: url(c.assets.s01Background, assets),
      bouquet: url(c.assets.s01Bouquet, assets),
      foreground: url(c.assets.s01Foreground, assets),
      macro: url(c.assets.s02Macro, assets),
      end: url(c.assets.s02End, assets),
      frames: c.assets.s03Frames.map((ref) => url(ref, assets)),
      signature: url(c.assets.s04Bouquet, assets),
      depth: url(c.assets.s04Depth, assets),
    };
    return (ctx) => {
      const dom: FlowerstimDom = {
        kick: kickRef,
        brand: brandRef,
        cta: ctaRef,
        hero: heroRef,
        hint1: hint1Ref,
        hint3: hint3Ref,
        veil: veilRef,
        blockAssortment: blockAssortmentRef,
        blockPersonal: blockPersonalRef,
        signature: signatureRef,
        hint4: hint4Ref,
        delivery: deliveryRef,
        care: careRef,
        callouts: [co0Ref, co1Ref, co2Ref, co3Ref],
        final: finalRef,
        hudScene: hudSceneRef,
        hudBar: hudBarRef,
      };
      return createFlowerstimProgram({ content: c, dom, background, grain: true, urls })(ctx);
    };
  }, [c, assets, background]);

  const rootStyle = {
    position: "relative",
    background,
    "--fs-serif": "'Cormorant Garamond', serif",
    "--fs-serif-w": "500",
    "--fs-sans": "'Onest', sans-serif",
    "--fs-ink": theme.colors.primary,
    "--fs-text": theme.colors.foreground,
    "--fs-accent": theme.colors.accent ?? "#7A534D",
    "--fs-link": theme.colors.secondary ?? "#8A5F59",
  } as CSSProperties;

  return (
    <ImmersiveStageHost
      program={program}
      className={styles.root}
      style={rootStyle}
      fallback={<FlowerstimFallback content={c} assets={assets} style={rootStyle} />}
    >
      <div style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 3,
            padding: "22px clamp(18px,3vw,40px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 16,
          }}
        >
          <span
            ref={kickRef}
            style={{
              position: "absolute",
              left: "clamp(18px,3vw,40px)",
              top: 28,
              ...monoLabel,
              opacity: 0,
            }}
          >
            {c.header.kicker}
          </span>
          <span
            ref={brandRef}
            style={{
              fontFamily: SERIF,
              fontWeight: SERIF_W,
              fontSize: 22,
              letterSpacing: "-.01em",
              color: INK,
              textShadow: GLOW_14,
              opacity: 0,
            }}
          >
            {c.header.brand}
          </span>
          <div ref={ctaRef} style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0 }}>
            <span
              className={styles.hideNarrow}
              style={{
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: ".08em",
                textTransform: "uppercase",
                color: TEXT,
                background: SURFACE,
                padding: "4px 8px",
                whiteSpace: "nowrap",
              }}
            >
              {c.header.hours}
            </span>
            <a
              href={c.header.cta.href}
              {...EXTERNAL}
              className={styles.hoverFill}
              style={{
                pointerEvents: "auto",
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: SURFACE,
                background: INK,
                padding: "9px 14px",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              {c.header.cta.label}
            </a>
          </div>
        </div>

        <div
          ref={heroRef}
          className={styles.heroNarrow}
          style={{
            position: "absolute",
            right: "calc(clamp(18px,4vw,64px) - 44px)",
            bottom: "calc(max(11vh,100px) - 44px)",
            width: "calc(min(272px,100vw - 2 * clamp(18px,4vw,64px)) + 88px)",
            padding: 44,
            background:
              "radial-gradient(ellipse 50% 50% at 50% 55%,rgba(250,246,239,.88) 0%,rgba(250,246,239,.62) 58%,rgba(250,246,239,0) 100%)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            textShadow: GLOW_16,
            opacity: 0,
          }}
        >
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: SERIF_W,
              fontSize: "clamp(18px,1.5vw,22px)",
              lineHeight: 1.18,
              letterSpacing: "-.005em",
              color: INK,
              textWrap: "pretty",
            }}
          >
            {c.hero.line.lead}
            <em style={{ color: ACCENT }}>{c.hero.line.accent}</em>
          </span>
          <span style={{ height: 1, background: "rgba(43,39,35,.3)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 5, ...monoLabel }}>
            {c.hero.facts.map((fact) => (
              <span key={fact}>{fact}</span>
            ))}
          </div>
          <button
            type="button"
            onClick={copyPromo}
            title={c.promo.heroTitle}
            className={styles.hoverAccent}
            style={{
              pointerEvents: "auto",
              alignSelf: "flex-start",
              ...monoLabel,
              color: INK,
              background: "none",
              border: "none",
              borderBottom: `1px dashed ${INK}`,
              padding: "2px 0",
              cursor: "pointer",
              textShadow: GLOW_16,
            }}
          >
            {copied ? c.promo.heroCopied : c.promo.heroLabel}
          </button>
        </div>
        <div
          ref={hint1Ref}
          style={{
            position: "absolute",
            left: "50%",
            bottom: 58,
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            fontFamily: MONO,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            fontSize: 10,
            color: MUTED,
            whiteSpace: "nowrap",
            opacity: 0,
          }}
        >
          <span>{c.scrollHint}</span>
          <span style={{ width: 1, height: 18, background: "rgba(43,39,35,.4)" }} />
        </div>

        <div ref={hint3Ref} style={hintStyle}>
          {c.exhibition.hint}
        </div>
        <div
          ref={veilRef}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg,rgba(250,246,239,.9) 0%,rgba(250,246,239,.72) 34%,rgba(250,246,239,0) 62%)",
            opacity: 0,
          }}
        />
        <Block block={c.blockAssortment} refEl={blockAssortmentRef} />
        <Block block={c.blockPersonal} refEl={blockPersonalRef} />

        <div
          ref={signatureRef}
          style={{
            position: "absolute",
            left: "clamp(20px,5vw,72px)",
            top: "18vh",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            maxWidth: "min(26ch,34vw)",
            opacity: 0,
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            {c.signature.label}
          </span>
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: SERIF_W,
              fontSize: "clamp(40px,4.6vw,64px)",
              lineHeight: 0.95,
              letterSpacing: "-.015em",
            }}
          >
            {c.signature.heading.lead}
            <br />
            <em>{c.signature.heading.accent}</em>
          </span>
          <span style={{ fontSize: 15, lineHeight: 1.55, color: TEXT, textShadow: GLOW_14 }}>
            {c.signature.body}
          </span>
          <UnderlineLink link={c.signature.link} />
        </div>
        <div ref={hint4Ref} style={hintStyle}>
          {c.signature.hint}
        </div>
        <Block block={c.delivery} refEl={deliveryRef}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "6px 18px",
              fontSize: 14,
              color: INK,
              borderTop: `1px solid ${HAIRLINE}`,
              paddingTop: 14,
            }}
          >
            {c.delivery.rows.flat().map((cell, i) => (
              <span key={i}>{cell}</span>
            ))}
          </div>
        </Block>
        <div ref={careRef} style={blockStyle}>
          <span style={monoLabel}>{c.care.label}</span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              borderTop: `1px solid ${HAIRLINE}`,
            }}
          >
            {c.care.items.map((item, i) => (
              <div
                key={item}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px 1fr",
                  alignItems: "baseline",
                  gap: 8,
                  padding: "14px 0",
                  borderBottom: `1px solid ${HAIRLINE}`,
                }}
              >
                <span
                  style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".08em", color: MUTED }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: SERIF,
                    fontWeight: SERIF_W,
                    fontSize: "clamp(22px,2.2vw,30px)",
                    lineHeight: 1.15,
                    color: INK,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
          <UnderlineLink link={c.care.link} />
        </div>

        <Callout refEl={co0Ref} label={c.signature.callouts[0]} />
        <Callout refEl={co1Ref} label={c.signature.callouts[1]} />
        <Callout refEl={co2Ref} label={c.signature.callouts[2]} />
        <Callout refEl={co3Ref} label={c.signature.callouts[3]} />

        <div
          ref={finalRef}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 55% at 50% 50%,rgba(250,246,239,.94) 0%,rgba(250,246,239,.82) 55%,rgba(250,246,239,.55) 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
            textAlign: "center",
            padding: 24,
            opacity: 0,
          }}
        >
          <span style={monoLabel}>{c.final.label}</span>
          <span
            style={{
              fontFamily: SERIF,
              fontWeight: SERIF_W,
              fontSize: "clamp(48px,7vw,104px)",
              lineHeight: 0.95,
              letterSpacing: "-.02em",
              color: INK,
            }}
          >
            {c.final.heading.lead}
            <em>{c.final.heading.accent}</em>
          </span>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              pointerEvents: "auto",
            }}
          >
            <a
              href={c.final.cta.href}
              {...EXTERNAL}
              className={styles.hoverFill}
              style={{
                fontFamily: MONO,
                fontSize: 12,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: SURFACE,
                background: INK,
                padding: "18px 30px",
                textDecoration: "none",
              }}
            >
              {c.final.cta.label}
            </a>
            <button
              type="button"
              onClick={copyPromo}
              className={styles.hoverSolid}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: MONO,
                fontSize: 12,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: INK,
                background: SURFACE,
                border: `1px dashed ${INK}`,
                padding: "16px 20px",
                cursor: "pointer",
              }}
            >
              <span>{c.promo.finalBadge}</span>
              <span style={{ color: ACCENT }}>
                {copied ? c.promo.finalCopied : c.promo.finalLabel}
              </span>
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: "24px 40px",
              maxWidth: 760,
              width: "100%",
              textAlign: "left",
              pointerEvents: "auto",
            }}
          >
            {c.final.contacts.map((item) => (
              <div
                key={item.label}
                style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}
              >
                <span style={{ ...monoLabel, color: MUTED }}>{item.label}</span>
                <span style={{ fontSize: 16, lineHeight: 1.45, color: INK }}>
                  {item.text}
                  {item.links?.map((link, i) => (
                    <span key={link.href}>
                      {i > 0 ? " / " : null}
                      <a
                        href={link.href}
                        {...(link.external ? EXTERNAL : {})}
                        style={{
                          color: INK,
                          textDecoration: "underline",
                          textUnderlineOffset: 4,
                        }}
                      >
                        {link.label}
                      </a>
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>

        {c.hud.enabled ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              padding: "0 clamp(18px,3vw,40px) 16px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
                fontFamily: MONO,
                fontSize: 10.5,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              <span ref={hudSceneRef}>{c.hud.scenes[0]}</span>
            </div>
            <div style={{ height: 1, background: "#D9CFC0", position: "relative" }}>
              <div
                ref={hudBarRef}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 0,
                  background: TEXT,
                }}
              />
            </div>
          </div>
        ) : null}
      </div>

      <div style={{ position: "relative", zIndex: 1, pointerEvents: "none" }}>
        {SPACERS.map(([label, height], i) => (
          <section key={label} data-screen-label={label} style={{ height }}>
            {i === 0 ? <h1 className={styles.srOnly}>{c.srTitle}</h1> : null}
          </section>
        ))}
      </div>
    </ImmersiveStageHost>
  );
}

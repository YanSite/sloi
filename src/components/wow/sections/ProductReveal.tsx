"use client";

import type { CtaLink, MediaRef } from "./types";
import type { AssetManifest, ThemeTokens, MotionConfig } from "@/lib/types";
import { resolveAsset, toObjectPosition, toSrcSet } from "@/lib/assets";
import { PinnedScroll, Parallax, Reveal } from "@/components/wow/motion";
import { WebGLImageLayer } from "@/components/wow/webgl";

export interface ProductRevealProps {
  title: string;
  description?: string;
  media: MediaRef;
  cta?: CtaLink;
  assets: AssetManifest;
  theme?: ThemeTokens;
  motion?: MotionConfig;
}

/**
 * Single hero product/offering moment — Signature WOW Moment #2. Camera
 * language (scroll-linked zoom, via `WebGLImageLayer`'s `scaleRange`
 * when WebGL is available, or CSS-only `Parallax` otherwise), not a
 * transformation sequence — see /docs/experience-map.md Scene 3. The CSS
 * fallback renders `media`'s real, resolved photograph once one exists
 * (via `resolveAsset`), falling back further to a graded color block
 * while it's still "planned".
 */
export function ProductReveal({ title, description, media, cta, assets, theme, motion }: ProductRevealProps) {
  const background = theme?.colors.background ?? "#15110D";
  const foreground = theme?.colors.foreground ?? "#F3ECDF";
  const accent = theme?.colors.secondary ?? "#4A5240";
  const resolvedMedia = resolveAsset(media, assets);
  const hasRealSource = resolvedMedia.sources.length > 0;

  return (
    <section style={{ backgroundColor: background, color: foreground }}>
      <PinnedScroll scrollLengthVh={220}>
        <WebGLImageLayer
          from={accent}
          to={background}
          depth={0.15}
          scaleRange={[0.92, 1.08]}
          className="flex h-full items-center justify-center"
          fallback={
            <Parallax
              speed={0.15}
              scaleRange={[0.92, 1.08]}
              className="flex h-full items-center justify-center"
            >
              {hasRealSource ? (
                <img
                  src={resolvedMedia.sources[0].url}
                  srcSet={toSrcSet(resolvedMedia.sources)}
                  alt={resolvedMedia.alt}
                  className="aspect-[4/5] w-[min(70vw,28rem)] object-cover"
                  style={{ objectPosition: toObjectPosition(resolvedMedia.focalPoint) }}
                />
              ) : (
                <div
                  aria-hidden
                  data-placeholder-for={resolvedMedia.assetId}
                  className="aspect-[4/5] w-[min(70vw,28rem)]"
                  style={{ background: `linear-gradient(160deg, ${accent}, ${background})` }}
                />
              )}
            </Parallax>
          }
        />

        <Reveal
          trigger="scroll"
          revealStyle="fade-up"
          duration={motion?.duration ?? 0.8}
          delay={motion?.delay ?? 0}
          className="absolute inset-x-0 bottom-16 mx-auto max-w-md px-6 text-center"
        >
          <h2 className="text-3xl font-semibold" style={{ fontFamily: theme?.fonts.heading }}>
            {title}
          </h2>
          {description ? (
            <p className="mt-3 opacity-80" style={{ fontFamily: theme?.fonts.body }}>
              {description}
            </p>
          ) : null}
          {cta ? (
            <a
              href={cta.href}
              className="mt-6 inline-block underline underline-offset-4 transition-opacity hover:opacity-70"
              style={{ transitionDuration: theme?.transitions.base }}
            >
              {cta.label}
            </a>
          ) : null}
        </Reveal>
      </PinnedScroll>
    </section>
  );
}

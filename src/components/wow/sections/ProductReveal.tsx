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
 * Единственный момент показа товара/услуги — Signature WOW Moment #2.
 * Язык камеры (scroll-linked zoom через `scaleRange` `WebGLImageLayer`,
 * когда WebGL доступен, иначе — CSS-only `Parallax`), а не
 * transformation-последовательность — см. /docs/experience-map.md Scene
 * 3. CSS-fallback рендерит реальную, резолвленную фотографию `media`,
 * как только она появляется (через `resolveAsset`), иначе — градиентный
 * цветовой блок, пока статус "planned".
 */
export function ProductReveal({
  title,
  description,
  media,
  cta,
  assets,
  theme,
  motion,
}: ProductRevealProps) {
  const background = theme?.colors.background ?? "#15110D";
  const foreground = theme?.colors.foreground ?? "#F3ECDF";
  const accent = theme?.colors.secondary ?? "#4A5240";
  const resolvedMedia = resolveAsset(media, assets);
  const hasRealSource = resolvedMedia.sources.length > 0;

  return (
    <section
      aria-labelledby="product-reveal-title"
      style={{ backgroundColor: background, color: foreground }}
    >
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
                // eslint-disable-next-line @next/next/no-img-element -- источник может быть data-URI плейсхолдер (см. resolve-asset.ts); next/image не годится без реального хостинга изображений, см. известные риски в Engine v1 Lock Audit.
                <img
                  src={resolvedMedia.sources[0].url}
                  srcSet={toSrcSet(resolvedMedia.sources)}
                  sizes="(min-width: 640px) 28rem, 70vw"
                  alt={resolvedMedia.alt}
                  // Ниже сгиба — загрузка откладывается до приближения
                  // вьюпорта, в отличие от eager-загрузки в Hero.
                  loading="lazy"
                  decoding="async"
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
          <h2
            id="product-reveal-title"
            className="text-2xl font-semibold sm:text-3xl"
            style={{ fontFamily: theme?.fonts.heading }}
          >
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
              className="mt-6 inline-block underline underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{
                transitionDuration: theme?.transitions.base,
                outlineColor: theme?.colors.accent ?? "#B08D57",
              }}
            >
              {cta.label}
            </a>
          ) : null}
        </Reveal>
      </PinnedScroll>
    </section>
  );
}

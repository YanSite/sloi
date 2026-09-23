"use client";

import type { CtaLink, MediaRef } from "./types";
import type { AssetManifest, ThemeTokens, MotionConfig } from "@/lib/types";
import { resolveAsset, toObjectPosition, toSrcSet } from "@/lib/assets";
import { Reveal, Parallax } from "@/components/wow/motion";
import { WebGLImageLayer } from "@/components/wow/webgl";

export interface CinematicHeroProps {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  media: MediaRef;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  assets: AssetManifest;
  theme?: ThemeTokens;
  motion?: MotionConfig;
}

/**
 * Полноэкранное открывающее заявление — Signature WOW Moment #1 (см.
 * /docs/visual-dna.md). `WebGLImageLayer` управляет слоистым дрейфом,
 * когда WebGL доступен, иначе — CSS-only `Parallax`. CSS-fallback
 * рендерит реальную, резолвленную фотографию `media` (через
 * `resolveAsset`), как только она появляется; пока её нет (для florist
 * все ассеты пока "planned", см. /docs/asset-manifest.md) — используется
 * градиентный цветовой блок. Заголовок появляется через `Reveal` при
 * монтировании, независимо от того, какой визуальный слой рендерится.
 */
export function CinematicHero({
  eyebrow,
  headline,
  subheadline,
  media,
  primaryCta,
  secondaryCta,
  assets,
  theme,
  motion,
}: CinematicHeroProps) {
  const background = theme?.colors.background ?? "#15110D";
  const foreground = theme?.colors.foreground ?? "#F3ECDF";
  const accent = theme?.colors.primary ?? "#6E2B34";
  // `theme.colors.accent`, а не `primary` — focus ring должен чётко
  // читаться на тёмном фоне, а `accent` (по замыслу более светлый
  // акцентный цвет) справляется с этим надёжнее, чем брендовый `primary`.
  const focusRingColor = theme?.colors.accent ?? "#B08D57";
  const resolvedMedia = resolveAsset(media, assets);
  const hasRealSource = resolvedMedia.sources.length > 0;

  return (
    <section
      aria-labelledby="cinematic-hero-headline"
      className="relative flex h-screen items-center justify-center overflow-hidden"
      style={{ backgroundColor: background, color: foreground }}
    >
      <WebGLImageLayer
        from={`${accent}55`}
        to={background}
        depth={0.25}
        className="absolute inset-0"
        fallback={
          <Parallax speed={0.25} className="h-full w-full">
            {hasRealSource ? (
              // eslint-disable-next-line @next/next/no-img-element -- источник может быть data-URI плейсхолдер (см. resolve-asset.ts); next/image не годится без реального хостинга изображений, см. известные риски в Engine v1 Lock Audit.
              <img
                src={resolvedMedia.sources[0].url}
                srcSet={toSrcSet(resolvedMedia.sources)}
                sizes="100vw"
                alt={resolvedMedia.alt}
                // Над сгибом, во весь экран — LCP-кандидат страницы,
                // поэтому грузится eagerly и с высоким приоритетом, а не
                // откладывается, как изображение ниже сгиба.
                loading="eager"
                fetchPriority="high"
                className="h-full w-full object-cover"
                style={{ objectPosition: toObjectPosition(resolvedMedia.focalPoint) }}
              />
            ) : (
              <div
                aria-hidden
                data-placeholder-for={resolvedMedia.assetId}
                className="h-full w-full"
                style={{
                  background: `radial-gradient(circle at 50% 60%, ${accent}55, ${background} 70%)`,
                }}
              />
            )}
          </Parallax>
        }
      />

      <Reveal
        trigger="mount"
        revealStyle="fade-up"
        duration={motion?.duration ?? 1}
        delay={motion?.delay ?? 0}
        className="relative z-10 max-w-2xl px-6 text-center"
      >
        {eyebrow ? (
          <p
            className="mb-4 text-sm tracking-[0.3em] uppercase opacity-80"
            style={{ fontFamily: theme?.fonts.body }}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1
          id="cinematic-hero-headline"
          className="text-4xl font-semibold sm:text-6xl"
          style={{ fontFamily: theme?.fonts.display }}
        >
          {headline}
        </h1>
        {subheadline ? (
          <p className="mt-4 text-lg opacity-80" style={{ fontFamily: theme?.fonts.body }}>
            {subheadline}
          </p>
        ) : null}
        {primaryCta || secondaryCta ? (
          <div
            className="mt-8 flex flex-col items-center justify-center sm:flex-row"
            style={{ gap: theme?.spacing.lg }}
          >
            {primaryCta ? (
              <a
                href={primaryCta.href}
                className="underline underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{
                  transitionDuration: theme?.transitions.base,
                  outlineColor: focusRingColor,
                }}
              >
                {primaryCta.label}
              </a>
            ) : null}
            {secondaryCta ? (
              <a
                href={secondaryCta.href}
                className="opacity-70 underline underline-offset-4 transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{
                  transitionDuration: theme?.transitions.base,
                  outlineColor: focusRingColor,
                }}
              >
                {secondaryCta.label}
              </a>
            ) : null}
          </div>
        ) : null}
      </Reveal>
    </section>
  );
}

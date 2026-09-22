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
 * Full-bleed opening statement — Signature WOW Moment #1 (see
 * /docs/visual-dna.md). WebGL proof of concept: `WebGLImageLayer` drives
 * the layered drift when available, falling back to CSS-only `Parallax`.
 * The CSS fallback renders `media`'s real, resolved photograph (via
 * `resolveAsset`) once one exists; until then (every asset here is still
 * "planned", see /docs/asset-manifest.md) it falls back further to a
 * graded color block. Headline enters via `Reveal` on mount, independent
 * of which visual layer renders.
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
  // `theme.colors.accent`, not `primary` — the focus ring needs to read
  // clearly against a dark background, which `accent` (a lighter pop
  // color by design) does more reliably than the brand `primary`.
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
              <img
                src={resolvedMedia.sources[0].url}
                srcSet={toSrcSet(resolvedMedia.sources)}
                sizes="100vw"
                alt={resolvedMedia.alt}
                // Above-the-fold, full-bleed — the page's LCP candidate,
                // so it loads eagerly and at high priority rather than
                // deferring like a below-the-fold image would.
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
                style={{ transitionDuration: theme?.transitions.base, outlineColor: focusRingColor }}
              >
                {primaryCta.label}
              </a>
            ) : null}
            {secondaryCta ? (
              <a
                href={secondaryCta.href}
                className="opacity-70 underline underline-offset-4 transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{ transitionDuration: theme?.transitions.base, outlineColor: focusRingColor }}
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

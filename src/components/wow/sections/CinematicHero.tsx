"use client";

import type { CtaLink, MediaRef } from "./types";
import type { ThemeTokens, MotionConfig } from "@/lib/types";
import { Reveal, Parallax } from "@/components/wow/motion";

export interface CinematicHeroProps {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  media: MediaRef;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
  theme?: ThemeTokens;
  motion?: MotionConfig;
}

/**
 * Full-bleed opening statement — Signature WOW Moment #1 (see
 * /docs/visual-dna.md). Motion proof of concept only: a graded color
 * block stands in for `media`'s real photograph (nothing generated yet,
 * see /docs/asset-manifest.md), wrapped in `Parallax` for the layered
 * drift, with the headline entering via `Reveal` on mount.
 */
export function CinematicHero({
  eyebrow,
  headline,
  subheadline,
  media,
  primaryCta,
  secondaryCta,
  theme,
  motion,
}: CinematicHeroProps) {
  const background = theme?.colors.background ?? "#15110D";
  const foreground = theme?.colors.foreground ?? "#F3ECDF";
  const accent = theme?.colors.primary ?? "#6E2B34";

  return (
    <section
      className="relative flex h-screen items-center justify-center overflow-hidden"
      style={{ backgroundColor: background, color: foreground }}
    >
      {media ? (
        <Parallax speed={0.25} className="absolute inset-0">
          <div
            aria-hidden
            data-placeholder-for={media.assetId}
            className="h-full w-full"
            style={{ background: `radial-gradient(circle at 50% 60%, ${accent}55, ${background} 70%)` }}
          />
        </Parallax>
      ) : null}

      <Reveal
        trigger="mount"
        revealStyle="fade-up"
        duration={motion?.duration ?? 1}
        delay={motion?.delay ?? 0}
        className="relative z-10 max-w-2xl px-6 text-center"
      >
        {eyebrow ? (
          <p className="mb-4 text-sm tracking-[0.3em] uppercase opacity-80">{eyebrow}</p>
        ) : null}
        <h1 className="text-4xl font-semibold sm:text-6xl">{headline}</h1>
        {subheadline ? <p className="mt-4 text-lg opacity-80">{subheadline}</p> : null}
        {primaryCta || secondaryCta ? (
          <div className="mt-8 flex items-center justify-center gap-6">
            {primaryCta ? (
              <a href={primaryCta.href} className="underline underline-offset-4">
                {primaryCta.label}
              </a>
            ) : null}
            {secondaryCta ? (
              <a href={secondaryCta.href} className="opacity-70 underline underline-offset-4">
                {secondaryCta.label}
              </a>
            ) : null}
          </div>
        ) : null}
      </Reveal>
    </section>
  );
}

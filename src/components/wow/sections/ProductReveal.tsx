"use client";

import type { CtaLink, MediaRef } from "./types";
import type { ThemeTokens, MotionConfig } from "@/lib/types";
import { PinnedScroll, Parallax, Reveal } from "@/components/wow/motion";

export interface ProductRevealProps {
  title: string;
  description?: string;
  media: MediaRef;
  cta?: CtaLink;
  theme?: ThemeTokens;
  motion?: MotionConfig;
}

/**
 * Single hero product/offering moment — Signature WOW Moment #2. Camera
 * language (scroll-linked zoom via `Parallax`'s `scaleRange`), not a
 * transformation sequence — see /docs/experience-map.md Scene 3. Motion
 * proof of concept only: a graded color block stands in for `media`.
 */
export function ProductReveal({ title, description, media, cta, theme, motion }: ProductRevealProps) {
  const background = theme?.colors.background ?? "#15110D";
  const foreground = theme?.colors.foreground ?? "#F3ECDF";
  const accent = theme?.colors.secondary ?? "#4A5240";

  return (
    <section style={{ backgroundColor: background, color: foreground }}>
      <PinnedScroll scrollLengthVh={220}>
        {media ? (
          <Parallax
            speed={0.15}
            scaleRange={[0.92, 1.08]}
            className="flex h-full items-center justify-center"
          >
            <div
              aria-hidden
              data-placeholder-for={media.assetId}
              className="aspect-[4/5] w-[min(70vw,28rem)]"
              style={{ background: `linear-gradient(160deg, ${accent}, ${background})` }}
            />
          </Parallax>
        ) : null}

        <Reveal
          trigger="scroll"
          revealStyle="fade-up"
          duration={motion?.duration ?? 0.8}
          delay={motion?.delay ?? 0}
          className="absolute inset-x-0 bottom-16 mx-auto max-w-md px-6 text-center"
        >
          <h2 className="text-3xl font-semibold">{title}</h2>
          {description ? <p className="mt-3 opacity-80">{description}</p> : null}
          {cta ? (
            <a href={cta.href} className="mt-6 inline-block underline underline-offset-4">
              {cta.label}
            </a>
          ) : null}
        </Reveal>
      </PinnedScroll>
    </section>
  );
}

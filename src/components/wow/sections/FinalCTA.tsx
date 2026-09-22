"use client";

import type { CtaLink } from "./types";
import type { ThemeTokens, MotionConfig } from "@/lib/types";
import { Crossfade, Reveal } from "@/components/wow/motion";

export interface FinalCTAProps {
  headline: string;
  subheadline?: string;
  cta: CtaLink;
  theme?: ThemeTokens;
  motion?: MotionConfig;
}

/**
 * Closing conversion moment — Signature WOW Moment #3. Bookends
 * Cinematic Hero via `Crossfade` (background transitions to the same
 * color the page opened on), not WebGL — see /docs/visual-dna.md's
 * transition language.
 */
export function FinalCTA({ headline, subheadline, cta, theme, motion }: FinalCTAProps) {
  const background = theme?.colors.background ?? "#15110D";
  const foreground = theme?.colors.foreground ?? "#F3ECDF";
  const accent = theme?.colors.accent ?? "#B08D57";

  return (
    <section aria-labelledby="final-cta-headline">
      <Crossfade
        to={background}
        duration={motion?.duration ?? 1.2}
        style={{ color: foreground }}
        className="flex min-h-screen items-center justify-center px-6"
      >
        <Reveal
          trigger="scroll"
          revealStyle="scale-in"
          duration={0.8}
          className="max-w-xl text-center"
        >
          <h2
            id="final-cta-headline"
            className="text-3xl font-semibold sm:text-4xl"
            style={{ fontFamily: theme?.fonts.display }}
          >
            {headline}
          </h2>
          {subheadline ? (
            <p className="mt-4 opacity-80" style={{ fontFamily: theme?.fonts.body }}>
              {subheadline}
            </p>
          ) : null}
          {cta ? (
            <a
              href={cta.href}
              className="mt-8 inline-block px-8 py-3 font-medium transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
              style={{
                backgroundColor: accent,
                color: background,
                borderRadius: theme?.radius.full ?? "9999px",
                boxShadow: theme?.shadows.md,
                transitionDuration: theme?.transitions.base,
                outlineColor: accent,
              }}
            >
              {cta.label}
            </a>
          ) : null}
        </Reveal>
      </Crossfade>
    </section>
  );
}

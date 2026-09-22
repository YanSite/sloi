# Visual DNA

The **VISUAL DNA** layer. The look of a business: mood, color palette,
typography, imagery direction, motion personality. No copy, no business
facts, no layout — only design tokens that sections and templates read.

## Why it's separate

Two florists can share the exact same `ExperienceMap` (hero, product reveal,
story, CTA...) while looking completely different — one warm and rustic, one
stark and editorial. Visual DNA is what varies; structure is what's reused.

## Type

Defined at [src/lib/types/visual-dna.ts](../src/lib/types/visual-dna.ts):

```ts
interface VisualDNA {
  vertical: Vertical;
  mood: string[];              // e.g. ["romantic", "editorial", "organic"]
  colorPalette: ColorPalette;  // primary, secondary?, accent?, background, foreground
  typography: TypographyScale; // display, heading, body
  imageryStyle?: string;
  motionPersonality?: string;
}
```

## Current instance

[src/config/verticals/florist/visual-dna.ts](../src/config/verticals/florist/visual-dna.ts)
holds a placeholder with every value set to `"TBD"` or empty. No design
decisions have been made for the florist vertical yet — that's deliberate.
This phase only proves the type exists and compiles.

## What reads this layer

Eventually: the WOW section components (for color/type tokens) and the
motion primitives in
[src/components/wow/motion](../src/components/wow/motion) (for motion
personality → preset mapping). Neither is wired up yet.

import type { Vertical } from "./vertical";

/**
 * VISUAL DNA layer.
 * The look, palette, type, and imagery direction for a business. Holds no
 * copy and no business facts — see BusinessProfile and ExperienceContent.
 */
export interface ColorPalette {
  primary: string;
  secondary?: string;
  accent?: string;
  background: string;
  foreground: string;
}

export interface TypographyScale {
  display: string;
  heading: string;
  body: string;
}

export interface VisualDNA {
  vertical: Vertical;
  /** Descriptive mood keywords, e.g. ["romantic", "editorial", "organic"]. */
  mood: string[];
  colorPalette: ColorPalette;
  typography: TypographyScale;
  imageryStyle?: string;
  motionPersonality?: string;
}

import type { Vertical } from "./vertical";

/**
 * Слой VISUAL DNA.
 * Внешний вид, палитра, типографика и стиль изображений для бизнеса. Не
 * содержит копирайта и бизнес-фактов — см. BusinessProfile и ExperienceContent.
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
  /** Описательные ключевые слова настроения, например ["romantic", "editorial", "organic"]. */
  mood: string[];
  colorPalette: ColorPalette;
  typography: TypographyScale;
  imageryStyle?: string;
  motionPersonality?: string;
}

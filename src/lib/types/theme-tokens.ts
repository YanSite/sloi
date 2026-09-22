import type { Vertical } from "./vertical";

/**
 * THEME layer.
 * Concrete, CSS-ready design tokens — resolved FROM a business's
 * VisualDNA. VisualDNA stays descriptive and creative on purpose (mood
 * words, reference classes like "Didone-register serif (Canela / GT
 * Sectra Display class)"); ThemeTokens is what a component or a
 * stylesheet actually consumes (real hex colors, a real `font-family`
 * fallback stack). No copy, no business facts, no layout.
 */
export interface ThemeColorTokens {
  background: string;
  foreground: string;
  primary: string;
  secondary?: string;
  accent?: string;
}

export interface ThemeFontTokens {
  display: string;
  heading: string;
  body: string;
}

export interface ThemeTokens {
  vertical: Vertical;
  colors: ThemeColorTokens;
  fonts: ThemeFontTokens;
}

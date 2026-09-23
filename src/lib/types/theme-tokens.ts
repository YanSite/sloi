import type { Vertical } from "./vertical";

/**
 * Слой THEME.
 * Конкретные, готовые к CSS design-токены — резолвятся ИЗ VisualDNA
 * бизнеса. VisualDNA сознательно остаётся описательной и творческой
 * (слова настроения, референсные классы вроде "Didone-register serif
 * (Canela / GT Sectra Display class)"); ThemeTokens — то, что реально
 * потребляет компонент или стиль (настоящие hex-цвета, настоящий
 * `font-family` fallback stack). Не содержит копирайта, бизнес-фактов, layout.
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

export interface ThemeSpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
}

export interface ThemeRadiusTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  full: string;
}

export interface ThemeShadowTokens {
  sm: string;
  md: string;
  lg: string;
}

export interface ThemeTransitionTokens {
  fast: string;
  base: string;
  slow: string;
}

export interface ThemeBreakpointTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeTokens {
  vertical: Vertical;
  colors: ThemeColorTokens;
  fonts: ThemeFontTokens;
  spacing: ThemeSpacingTokens;
  radius: ThemeRadiusTokens;
  shadows: ThemeShadowTokens;
  transitions: ThemeTransitionTokens;
  breakpoints: ThemeBreakpointTokens;
}

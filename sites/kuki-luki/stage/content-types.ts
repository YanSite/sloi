import type { MediaRef } from "@/lib/types";

/**
 * Форма контента immersive-stage Куки Луки (`stage` в
 * `ImmersiveStageProps`). Объявлены через `type`, а не `interface`:
 * только type-alias структурно совместим с `Record<string, unknown>`,
 * который ожидает контракт секции.
 */

export type Link = { label: string; href: string; external?: boolean };

/** Подпись, привязанная к точке кадра; x / y — в % вьюпорта. */
export type Annotation = { label: string; x: number; y: number };

export type Flavor = {
  /** Название в HUD и в меню. */
  title: string;
  description: string;
  whole: MediaRef;
  texture: MediaRef;
  filling: MediaRef;
  packshot: MediaRef;
  textureNote: Annotation;
  fillingNotes: Annotation[];
};

export type KukiLukiStageContent = {
  media: {
    signatureCookie: MediaRef;
    crack: MediaRef;
    crackVideo: MediaRef;
    interior: MediaRef;
    interiorVideo: MediaRef;
  };
  title: { lines: string[]; sub: string };
  meta: string[];
  tagline: string[];
  hint: string;
  brand: string;
  order: Link;
  interlude: { eyebrow: string; headline: string };
  flavors: Flavor[];
  /** Подписи правого рельса: целиком / текстура / начинка. */
  states: string[];
  menu: { eyebrow: string; headline: string; cta: Link };
  visit: {
    fields: { label: string; value: string; href?: string }[];
    primary: Link;
    secondary: Link;
  };
};

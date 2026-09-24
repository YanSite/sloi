import type { MediaRef } from "@/lib/types";

/**
 * Форма контента immersive-stage Flowerstim (`stage` в
 * `ImmersiveStageProps`). Объявлены через `type`, а не `interface`:
 * только type-alias структурно совместим с `Record<string, unknown>`,
 * который ожидает контракт секции.
 */

export type Link = { label: string; href: string };

/** Серифный заголовок из двух частей: обычная + акцентная italic (после `<br>` или в той же строке). */
export type SplitHeading = { lead: string; accent: string };

export type TextBlock = {
  label: string;
  heading: SplitHeading;
  body: string;
  link: Link;
};

export type StageLine = { t: string; italic?: boolean; color?: string };

export type ContactItem = {
  label: string;
  text?: string;
  links?: { label: string; href: string; external?: boolean }[];
};

export type FlowerstimStageContent = {
  assets: {
    s01Background: MediaRef;
    s01Bouquet: MediaRef;
    s01Foreground: MediaRef;
    s02Macro: MediaRef;
    s02End: MediaRef;
    s03Frames: [MediaRef, MediaRef, MediaRef, MediaRef, MediaRef, MediaRef];
    s04Bouquet: MediaRef;
    s04Depth: MediaRef;
  };
  srTitle: string;
  header: { kicker: string; brand: string; hours: string; cta: Link };
  hero: { line: SplitHeading; facts: string[] };
  promo: {
    code: string;
    heroLabel: string;
    heroCopied: string;
    heroTitle: string;
    finalBadge: string;
    finalLabel: string;
    finalCopied: string;
  };
  scrollHint: string;
  /** 3D-заголовок S01. */
  title3d: StageLine[];
  blockAssortment: TextBlock;
  blockPersonal: TextBlock;
  exhibition: {
    hint: string;
    phrases: [StageLine[], StageLine[]];
    frames: { caption: string; href: string }[];
  };
  signature: {
    label: string;
    heading: SplitHeading;
    body: string;
    link: Link;
    hint: string;
    callouts: [string, string, string, string];
  };
  delivery: TextBlock & { rows: [string, string][] };
  care: { label: string; items: string[]; link: Link };
  final: {
    label: string;
    heading: SplitHeading;
    cta: Link;
    contacts: ContactItem[];
  };
  /** Служебная полоса прототипа (сцена, источник ассетов, прогресс) — открытый вопрос к владельцу дизайна. */
  hud: { enabled: boolean; scenes: [string, string][] };
};

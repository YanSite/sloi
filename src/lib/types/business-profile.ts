import type { Vertical } from "./vertical";

/**
 * Слой BUSINESS DATA.
 * Объективные факты о конкретном бизнесе. Визуальным, motion- и
 * копирайтинг-решениям здесь не место — см. VisualDNA и ExperienceContent.
 */
export interface BusinessHours {
  day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  open?: string;
  close?: string;
  closed?: boolean;
}

export interface BusinessContact {
  phone?: string;
  email?: string;
  address?: string;
}

export interface BusinessProfile {
  vertical: Vertical;
  name: string;
  tagline?: string;
  description?: string;
  contact: BusinessContact;
  hours?: BusinessHours[];
  services?: string[];
  products?: string[];
  serviceArea?: string;
  foundedYear?: number;
  socialLinks?: Record<string, string>;
}

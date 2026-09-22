import type { Vertical } from "./vertical";

/**
 * BUSINESS DATA layer.
 * Objective facts about a specific business. No visual, motion, or copy
 * decisions belong here — see VisualDNA and ExperienceContent for those.
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

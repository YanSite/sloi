import type { ExperienceContent, SectionId } from "@/lib/types";
import type { SectionPropsMap } from "./section-registry";

/**
 * What a vertical actually AUTHORS per section — `SectionPropsMap` minus
 * the fields `resolveSections` always supplies itself (theme, motion,
 * assets, and location-section's business-sourced contact/hours; see
 * resolve-sections.ts's `withBusinessFacts`). Kept separate from
 * `SiteConfig.content`'s type, which stays the loose `ExperienceContent`
 * (see /lib/types/content.ts) — that's what lets a config author get real
 * field-level type-checking without `lib/types` importing component prop
 * shapes, which would break the layering rule in
 * /docs/engine-architecture.md.
 */
type ContentOnly<P> = Omit<P, "theme" | "motion" | "assets" | "contact" | "hours">;

export type SectionContentMap = {
  [S in SectionId]: ContentOnly<SectionPropsMap[S]>;
};

export type TypedExperienceContent = Partial<SectionContentMap>;

/**
 * The one deliberate relaxation point from `TypedExperienceContent` (what
 * an author writes, checked against real section props) down to
 * `ExperienceContent` (what `SiteConfig.content` accepts) — mirrors the
 * single documented cast in resolve-sections.ts. A plain interface has no
 * index signature, so it isn't structurally assignable to
 * `SectionContent`'s `Record<string, unknown>`; being generic over `T` is
 * what keeps this function's *input* fully checked even though its output
 * type is the wider one.
 */
export function defineContent<T extends TypedExperienceContent>(content: T): ExperienceContent {
  return content as ExperienceContent;
}

import type { Vertical } from "./vertical";
import type { ExperienceMap } from "./experience-map";

/**
 * TEMPLATE layer.
 * Binds a vertical to its default experience structure. A template holds
 * no business data, visual DNA, or assets — those are supplied at
 * render time from the other layers.
 */
export interface Template {
  vertical: Vertical;
  name: string;
  experienceMap: ExperienceMap;
}

import type { Vertical, Template } from "@/lib/types";
import { floristTemplate } from "./florist.template";
import { barberTemplate } from "./barber.template";

/** Registry of vertical -> default template. Add new verticals here only. */
export const templateRegistry: Partial<Record<Vertical, Template>> = {
  florist: floristTemplate,
  barber: barberTemplate,
};

export { floristTemplate, barberTemplate };

import type { MediaRef } from "./types";
import type { BusinessContact, BusinessHours } from "@/lib/types";

export interface LocationSectionProps {
  title?: string;
  contact: BusinessContact;
  hours?: BusinessHours[];
  mapMedia?: MediaRef;
}

/** Address, hours, and map moment. Interface only. */
export function LocationSection(_props: LocationSectionProps) {
  return null;
}

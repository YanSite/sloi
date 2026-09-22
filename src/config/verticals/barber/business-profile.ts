import type { BusinessProfile } from "@/lib/types";

/**
 * Placeholder business data for the barber test vertical (Stage 8's
 * portability test, part 2) — every value is a stand-in, same convention
 * as the florist vertical's business-profile.ts.
 */
export const barberBusinessProfile: BusinessProfile = {
  vertical: "barber",
  name: "[BARBER_BUSINESS_NAME]",
  tagline: "[BARBER_TAGLINE_PLACEHOLDER]",
  description: "[BARBER_SHORT_DESCRIPTION_PLACEHOLDER]",
  contact: {
    phone: "[BARBER_PHONE_PLACEHOLDER]",
    email: "[BARBER_EMAIL_PLACEHOLDER]",
    address: "[BARBER_ADDRESS_PLACEHOLDER]",
  },
  hours: [
    { day: "mon", open: "09:00", close: "19:00" },
    { day: "sat", open: "10:00", close: "16:00" },
    { day: "sun", closed: true },
  ],
  services: ["[BARBER_SERVICE_1]", "[BARBER_SERVICE_2]"],
  products: [],
};

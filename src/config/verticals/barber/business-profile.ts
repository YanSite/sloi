import type { BusinessProfile } from "@/lib/types";

/**
 * Плейсхолдерные бизнес-данные для тестовой вертикали barber (часть 2
 * portability-теста Stage 8) — каждое значение заглушка, та же
 * конвенция, что и в business-profile.ts вертикали florist.
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

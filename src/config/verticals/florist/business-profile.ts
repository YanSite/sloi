import type { BusinessProfile } from "@/lib/types";

/**
 * Плейсхолдерные бизнес-данные для демо-вертикали florist. Каждое
 * значение здесь — заглушка, замените на реальные данные клиента, прежде
 * чем это выйдет за рамки архитектурной фазы.
 */
export const floristBusinessProfile: BusinessProfile = {
  vertical: "florist",
  name: "[FLORIST_BUSINESS_NAME]",
  tagline: "[TAGLINE_PLACEHOLDER]",
  description: "[SHORT_DESCRIPTION_PLACEHOLDER]",
  contact: {
    phone: "[PHONE_PLACEHOLDER]",
    email: "[EMAIL_PLACEHOLDER]",
    address: "[ADDRESS_PLACEHOLDER]",
  },
  services: [],
  products: [],
};

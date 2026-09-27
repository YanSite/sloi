import type { BusinessProfile } from "@/lib/types";

/**
 * Подтверждённые факты о Куки Луки. Ничего сверх брифа: без отзывов,
 * рейтингов, истории, года основания, условий доставки.
 *
 * `vertical: "restaurant"` — ближайшая существующая вертикаль в
 * VERTICALS; добавление "bakery" потребует правки core (см. HANDOFF.md §3).
 */
export const kukiLukiBusinessProfile: BusinessProfile = {
  vertical: "restaurant",
  name: "Куки Луки",
  contact: {
    phone: "+7 (977) 102-18-55",
    address: "Бутырская ул., 84, Москва",
  },
  hours: (["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const).map((day) => ({
    day,
    open: "08:00",
    close: "00:00",
  })),
  products: ["Орео", "Фрамбини", "Киндер"],
};

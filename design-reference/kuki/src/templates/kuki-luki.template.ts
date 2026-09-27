import type { Template } from "@/lib/types";

/**
 * Куки Луки — одна непрерывная сцена. Порядок кадров внутри сцены
 * задаёт choreography.beats, а не experienceMap.
 */
export const kukiLukiTemplate: Template = {
  vertical: "restaurant",
  name: "kuki-luki-immersive",
  experienceMap: [
    {
      section: "immersive-stage",
      enabled: true,
      notes: "S01 Crave → S02 Внутри → S04 Орео/Фрамбини/Киндер × 3 кадра → S05 Меню → S06 Visit/Order",
    },
  ],
};

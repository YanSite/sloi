import type { Template } from "@/lib/types";

/**
 * Experience Куки Луки — одна непрерывная сцена: 13 битов, один жест —
 * один кадр. Порядок кадров задают биты хореографии, а не experienceMap,
 * поэтому весь сайт — секция `immersive-stage` с вариантом, который
 * регистрирует этот Site Instance (см. site-config.ts).
 */
export const kukiLukiExperience: Template = {
  vertical: "restaurant",
  name: "kuki-luki-immersive",
  experienceMap: [
    {
      section: "immersive-stage",
      enabled: true,
      variant: "kuki-luki",
      notes:
        "S01 Crave → S02 Внутри → S04 Куки-н-Крим / Фрамбини / Бамбини × 3 кадра → S05 Меню → S06 Visit / Order",
    },
  ],
};

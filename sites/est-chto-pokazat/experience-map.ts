import type { Template } from "@/lib/types";

/**
 * Experience «Есть что показать» — колода из 8 экранов, один жест —
 * один экран. Порядок экранов задаёт колода сцены, а не experienceMap,
 * поэтому весь сайт — секция `immersive-stage` с вариантом, который
 * регистрирует этот Site Instance (см. site-config.ts).
 */
export const ecpExperience: Template = {
  vertical: "local-services",
  name: "est-chto-pokazat-deck",
  experienceMap: [
    {
      section: "immersive-stage",
      enabled: true,
      variant: "est-chto-pokazat",
      notes:
        "01 Первый экран → 02 Разрыв → 03 Возможность → 04 Поворот → 05 Цветочный магазин → 05 Кафе-пекарня → 06 Как мы работаем → 07 Финал + форма",
    },
  ],
};

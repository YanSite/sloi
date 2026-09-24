import type { Template } from "@/lib/types";

/**
 * Experience Flowerstim — одна полноэкранная immersive-сцена S01–S04 +
 * финал. Сцены прототипа связаны непрерывной камерой и общими
 * шейдерными переходами, поэтому они не делятся на независимые секции:
 * весь сайт — секция `immersive-stage` с вариантом, который
 * регистрирует этот Site Instance (см. site-config.ts).
 */
export const flowerstimExperience: Template = {
  vertical: "florist",
  name: "flowerstim-immersive",
  experienceMap: [
    {
      section: "immersive-stage",
      enabled: true,
      variant: "flowerstim",
      notes: "S01 Aperture → S02 Pull-back → S03 Exhibition → S04 The Object → Финал",
    },
  ],
};

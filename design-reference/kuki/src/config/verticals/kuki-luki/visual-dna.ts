import type { VisualDNA } from "@/lib/types";

/**
 * Утверждённое направление Куки Луки — «печенье как люксовый объект».
 * Значения сняты с прототипа Claude Design (reference/kuki-luki-prototype.dc.html).
 *
 * primary     #FF3E9A — фирменный горячий розовый (студия S01/S06, акценты)
 * secondary   #FF69B0 — светлый центр розовой студии
 * accent      #16050A — почти-чёрный: текст на светлом, кнопки меню, вуаль
 * background  #120407 — фон сцены между студиями
 * foreground  #FFF6F9 — кремово-белый текст на розовом и тёмном
 */
export const kukiLukiVisualDNA: VisualDNA = {
  vertical: "restaurant",
  mood: ["sensual", "editorial", "cinematic", "tactile", "restrained"],
  colorPalette: {
    primary: "#FF3E9A",
    secondary: "#FF69B0",
    accent: "#16050A",
    background: "#120407",
    foreground: "#FFF6F9",
  },
  typography: {
    display: "contemporary editorial grotesk (Geologica 500), very large, tight tracking",
    heading: "same family, 500",
    body: "same family, 300–400; UI labels 10–12px, uppercase, tracking 0.2–0.24em",
  },
  imageryStyle: "luxury-food-campaign-macro",
  motionPersonality: "one-gesture-one-shot",
};

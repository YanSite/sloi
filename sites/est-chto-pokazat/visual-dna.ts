import type { VisualDNA } from "@/lib/types";

/**
 * Дизайн-система «Точность» с тёплым вторым актом
 * (design-reference/est-chto-pokazat-site/design-system/tokens.css).
 *
 * primary     #F2C27D — тёплый свет второго акта (--r-accent)
 * secondary   #4F7BFF — акцент тихого мира; синий чертежа — только на повороте
 * accent      #F4F5F7 — кнопка основная (--inverse-bg)
 * background  #111214 — графит тихого мира (--bg)
 * foreground  #F4F5F7 — текст (--ink)
 */
export const ecpVisualDNA: VisualDNA = {
  vertical: "local-services",
  mood: ["quiet", "precise", "warm", "cinematic", "restrained"],
  colorPalette: {
    primary: "#F2C27D",
    secondary: "#4F7BFF",
    accent: "#F4F5F7",
    background: "#111214",
    foreground: "#F4F5F7",
  },
  typography: {
    display:
      "Geologica 300, statement clamp(30px, 5.1vh, 44px) → clamp(48px, 7.4vh, 72px), tracking −0.03em",
    heading: "Geologica 300–400",
    body: "Geologica 400, 15/22; капитель-метки 11px 500 uppercase 0.12em; Cormorant Garamond — только в макетах в телефоне",
  },
  imageryStyle: "evening-city-warm-light",
  motionPersonality: "one-gesture-one-screen",
};

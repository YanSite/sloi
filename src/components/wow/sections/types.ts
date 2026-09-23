/** Каноническое определение перенесено в `@/lib/types` — это сквозной тип, на который ссылается и слой asset-manifest. Реэкспортируется здесь, чтобы существующие импорты `./types` по этой папке продолжали работать. */
export type { MediaRef } from "@/lib/types";

/** Общий примитив пропса, переиспользуемый во всех WOW-секциях. */
export interface CtaLink {
  label: string;
  href: string;
}

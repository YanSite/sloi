import type { Vertical, Template } from "@/lib/types";
import { floristTemplate } from "./florist.template";
import { barberTemplate } from "./barber.template";

/** Реестр «вертикаль → шаблон по умолчанию». Новые вертикали добавляются только сюда. */
export const templateRegistry: Partial<Record<Vertical, Template>> = {
  florist: floristTemplate,
  barber: barberTemplate,
};

export { floristTemplate, barberTemplate };

import type { BusinessProfile } from "@/lib/types";

/**
 * Факты об агентстве «Есть что показать» — только подтверждённые
 * пакетом. Имя рабочее (проверка товарного знака не завершена,
 * 08_OPEN_QUESTIONS, п. 8). Контактов нет (п. 3) — поля пустые,
 * на сайте стоит помеченная заглушка.
 *
 * `vertical: "local-services"` — ближайшая из VERTICALS: агентство не
 * локальный бизнес, своя вертикаль потребовала бы правки core.
 */
export const ecpBusinessProfile: BusinessProfile = {
  vertical: "local-services",
  name: "Есть что показать",
  tagline: "Делаем видимым то, что у вас уже есть",
  contact: {},
};

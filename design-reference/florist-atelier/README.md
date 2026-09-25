# Florist Atelier — design handoff

Прототип immersive-сайта для цветочных магазинов. Не привязан к конкретному бизнесу: название «Ателье цветов», контакты, цены, промокод и ссылки на каталог — демо-заглушки.

## DESIGN SOURCE OF TRUTH

`design/florist-atelier/`

В частности: **`design/florist-atelier/prototype.html`** — утверждённый прототип S01–S04 + финальный кадр.

- Production implementation воспроизводит **этот prototype**, а не наоборот.
- При конфликте Engine ↔ prototype **приоритет у prototype**. Engine адаптируется под дизайн.
- Любое расхождение, которое Engine не может закрыть, фиксируется как `IMPLEMENTATION GAP` (см. `DESIGN-HANDOFF.md §9`), дизайн при этом не упрощается.

## Состав

| Путь | Что это |
|---|---|
| `prototype.html` | Утверждённый прототип. Открывается напрямую в браузере (нужен локальный HTTP-сервер из-за загрузки текстур: `npx serve design/florist-atelier`). |
| `support.js` | Runtime прототипа (рендер шаблона + класс логики). Не является частью Engine. |
| `vendor/three.min.js` | three.js **r160** (UMD, `window.THREE`) — та же версия, что в прототипе. |
| `fonts/` | Cormorant Garamond, Onest, IBM Plex Mono (утверждённая пара) + альтернативы Playfair Display, Noto Serif Display, IBM Plex Sans; woff2 + `fonts.css`, включая кириллицу. |
| `media/` | Все изображения и depth map, которые загружает прототип (Higgsfield). `PROMPTS-S01-S04.md` — промпты генерации. |
| `DESIGN-HANDOFF.md` | Описание существующего дизайна: visual system, сцены, interactions, тайминги, mobile, gaps. |
| `ASSET-MANIFEST.md` | Реестр ассетов со стабильными ID. |

## Что изменено относительно рабочего файла прототипа

Переносимость и формулировки текстов, визуально ничего:

1. `https://fonts.googleapis.com/...` → `fonts/fonts.css` (те же семейства, начертания и unicode-range сабсеты).
2. `https://unpkg.com/three@0.160.0/build/three.min.js` → `vendor/three.min.js` (тот же файл).

3. Все упоминания конкретного магазина (название, город, контакты, рейтинг, промокод, ссылки на его сайт) заменены нейтральными демо-заглушками. Контент Site Instance (`sites/florist-atelier/content.ts`) совпадает с этими формулировками.

Всё остальное совпадает с исходным рабочим файлом прототипа. Пути к медиа относительные (`media/...`).

## Граница интеграции

На этом этапе prototype **не** интегрирован в Engine. Не затронуты `src/lib/*`, `src/components/wow/*`, `src/templates/*`, vertical configs, generation policy, validation. Новый renderer / route не создавались. Новые Higgsfield-генерации не запускались.

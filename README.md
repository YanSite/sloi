# Local WOW Engine v1

Переиспользуемая production-система для создания премиальных WOW-лендингов
для локального бизнеса. Не одноразовый сайт, а движок: один набор
компонентов и шаблонов обслуживает много вертикалей.

Первая вертикаль в разработке — **florist** (цветочный магазин).

## Статус

Сейчас реализован только архитектурный фундамент: типы, интерфейсы
компонентов, структура каталогов и документация. Финальный дизайн,
копирайтинг и генерация изображений/видео ещё не выполнялись — подробности
в [docs/engine-architecture.md](docs/engine-architecture.md).

## Архитектура

Бизнес в движке представлен как:

```
business = BusinessProfile + VisualDNA + Template + AssetManifest (+ ExperienceContent)
```

Эти слои строго разделены и не пересекаются:

| Слой | За что отвечает | Где живёт |
|---|---|---|
| Бизнес-данные | Факты о бизнесе (имя, контакты, часы работы) | `src/config/verticals/<vertical>/business-profile.ts` |
| Visual DNA | Внешний вид: палитра, типографика, настроение | `src/config/verticals/<vertical>/visual-dna.ts` |
| Структура опыта | Какие секции и в каком порядке | `src/templates/<vertical>.template.ts` |
| Ассеты | Манифест изображений/видео и их статус генерации | `src/config/verticals/<vertical>/asset-manifest.ts` |
| Контент | Тексты внутри секций | `src/config/verticals/<vertical>/content.ts` |
| Motion | Анимационные пресеты (общие для всех вертикалей) | `src/components/wow/motion` |
| WOW-секции | Переиспользуемые компоненты (Hero, CTA и т.д.) | `src/components/wow/sections` |

Полное описание — в [docs/engine-architecture.md](docs/engine-architecture.md).
Остальные документы по каждому слою — в [docs/](docs).

Добавление новой вертикали (restaurant, barber, beauty, dental, fitness,
automotive, local-services) не требует изменений в переиспользуемых
компонентах — только новый набор конфигов и шаблон.

## Higgsfield и генерация ассетов

Higgsfield — платный и лимитированный ресурс. Любая генерация проходит
только по схеме:

```
PLAN → ПОКАЗАТЬ ПЛАН АССЕТОВ → ПОКАЗАТЬ БЮДЖЕТ → ЖДАТЬ ОДОБРЕНИЯ → GENERATE
```

Лимиты demo-режима и полная политика — в
[docs/generation-policy.md](docs/generation-policy.md).

## Разработка

```bash
npm install
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000).

Стек: Next.js (App Router, каталог `app/` в корне), React, TypeScript,
Tailwind CSS.

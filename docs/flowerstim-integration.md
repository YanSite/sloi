# Flowerstim — production integration

Production-сайт Flowerstim («Эстетика цветов») — **Site Instance** поверх
Engine, а не вертикаль внутри него. Visual source of truth —
[design-reference/flowerstim/prototype.html](../design-reference/flowerstim/prototype.html)
(см. там же `DESIGN-HANDOFF.md` и `ASSET-MANIFEST.md`). Дизайн не менялся:
всё, что Engine не умел, закрыто расширением Engine, а не упрощением
дизайна.

Preview: `/preview/flowerstim`. Корневой `/` не переключён.

## 1. Архитектура

```text
Engine core (generic)
  src/lib/types            SectionId "immersive-stage", SiteSectionVariants
  src/lib/render           section registry + site variants, PageRenderer (без изменений в логике)
  src/lib/validation       site variants, full-page секции
  src/components/wow/motion        timeline math, BeatController
  src/components/wow/webgl/stage   StageCompositor, текстуры, плоскости, depth map, ImmersiveStageHost
        ↓
sites/flowerstim/          Site Instance
  site-config.ts           SiteConfig + sectionVariants["immersive-stage"].flowerstim
  stage/program.ts         хореография S01–S04 (порт init() прототипа)
  stage/FlowerstimStage.tsx DOM-слой 1:1 + host
  asset-manifest.ts        стабильные ID → файлы через статический импорт
        ↓
app/preview/[slug]         тот же PageRenderer через preview-registry
```

Рендер идёт обычным путём `SiteConfig → PageRenderer → SectionRegistry →
Section`: единственная секция `immersive-stage` резолвится в вариант
`flowerstim`, который сайт регистрирует через `SiteConfig.sectionVariants`.
Второго renderer'а, motion- или WebGL-фреймворка нет.

## 2. Почему не последовательность секций (ENGINE GAP → решение)

Прототип — одна непрерывная WebGL-сцена: четыре three.js-сцены рендерятся
в текстуры и сводятся одним post-шейдером; переход W2 «через лепесток»
требует обе сцены в одном кадре; навигация — beat'ы, а не нативный скролл.
Независимые секции с scroll-linked примитивами этого выразить не могут.
Решение — generic-расширения (§3), хореография — код сайта.

## 3. Prototype → Engine mapping

| Элемент прототипа                                                                                                       | Было в Engine                                    | Решение                                                                                                                       | Где                                         |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Multi-scene compositor, render-to-texture A/B                                                                           | нет                                              | **generic**: `StageCompositor`                                                                                                | `webgl/stage/compositor.ts`                 |
| Post-шейдер: fbm-маска перехода, displacement, golden-angle blur, exposure, vignette, grain                             | нет                                              | **generic**, шейдер перенесён без изменений; параметры — от сцены                                                             | `compositor.ts`                             |
| Лупа (второй рендер узкой камерой в круг)                                                                               | нет                                              | **generic**: `renderLoupe`                                                                                                    | `compositor.ts`                             |
| Renderer без color management, linear sRGB выход                                                                        | нет                                              | **generic**: `createStageRenderer` (восстанавливает глобальный `ColorManagement` при dispose)                                 | `compositor.ts`                             |
| Beat-навигация (wheel/touch/keys, easeInOutCubic, защита от инерции) — G-07                                             | нет (только scroll-linked)                       | **generic**: `BeatController`, пороги — параметры                                                                             | `motion/beat-controller.ts`                 |
| smoothstep/lerp/clamp, opacity + visibility слоя                                                                        | нет                                              | **generic**: timeline math                                                                                                    | `motion/timeline.ts`                        |
| Canvas-типографика как 3D-объект, пятна, маски, градиенты                                                               | нет                                              | **generic**: `textTexture`, `radialBlobTexture`, `radialAlphaMask`, `edgeFadeMask`, `verticalGradientTexture`, `labelTexture` | `webgl/stage/textures.ts`                   |
| Фото-плоскости с renderOrder по глубине                                                                                 | частично (`ImageLayerScene`, одна плоскость)     | **generic**: `addPlane`                                                                                                       | `webgl/stage/planes.ts`                     |
| Depth-меш (displacement по depth map)                                                                                   | нет                                              | **generic**: `applyDepthMap`                                                                                                  | `planes.ts`                                 |
| DOM-выноски из 3D-якорей                                                                                                | нет                                              | **generic**: `projectToViewport`                                                                                              | `planes.ts`                                 |
| Ленивая загрузка three, WebGL detect, context loss → fallback, rAF/resize                                               | частично (`WebGLImageLayer`, `isWebGLAvailable`) | **generic**: `ImmersiveStageHost` (переиспользует `isWebGLAvailable`, `useMotionCapability`)                                  | `webgl/stage/ImmersiveStageHost.tsx`        |
| Полноэкранная секция + реализация от сайта                                                                              | нет                                              | **generic**: `SectionId "immersive-stage"`, `SiteConfig.sectionVariants`, валидация                                           | `lib/types`, `lib/render`, `lib/validation` |
| Камеры S01–S04, пары сцен и тайминги переходов, beats, DOM-тайминги, рама 04 уходит в сторону, hover-lift, клик по раме | —                                                | **Flowerstim-specific**                                                                                                       | `sites/flowerstim/stage/program.ts`         |
| DOM-слой (шапка, hero, блоки 01–03, уход, S04, финал, HUD)                                                              | —                                                | **Flowerstim-specific**, разметка и inline-стили 1:1                                                                          | `stage/FlowerstimStage.tsx`                 |
| Hover-стили (`style-hover` → `:hover {… !important}`)                                                                   | —                                                | CSS-модуль с теми же `!important`                                                                                             | `stage/stage.module.css`                    |
| Шрифты Cormorant Garamond / Onest / IBM Plex Mono (кириллица)                                                           | —                                                | локальные woff2, `fonts.css` без изменений                                                                                    | `assets/fonts/`                             |

Технические отличия от прототипа, визуально нейтральные:

- three.js — модульный `three@0.186` (уже зависимость проекта) вместо UMD
  r160 (G-06 закрыт); грузится динамически только на этом роуте.
- 3D-заголовок S01 строится сразу из двухстрочной текстуры, без
  промежуточной однострочной (`tWide`) — итоговая геометрия та же.
- `preserveDrawingBuffer` выключен (в прототипе включён; на картинку не
  влияет, только на производительность).
- Цвета ролей (ink/text/accent/link/background) приходят из
  `ThemeTokens`, значения те же.

## 4. Ассеты

`design-reference/flowerstim/media/` → `sites/flowerstim/assets/media/`
(байт-в-байт) → статический импорт в `asset-manifest.ts` (хешированный URL

- размеры) → `resolveAsset` в `FlowerstimStage`. Путей к файлам в
  компонентах нет; программа сцены получает готовые URL.

| ID               | Файл                                | Статус                             | Higgsfield job                         |
| ---------------- | ----------------------------------- | ---------------------------------- | -------------------------------------- |
| `S01_BG`         | `A01-BG-src.jpg`                    | generated                          | `75c53c19-9f7d-4957-84ad-5dddc6ad4640` |
| `S01_BOUQUET`    | `A01-BQ-4k.webp`                    | generated (вырезка — G-03)         | `170e504b-b72a-43f1-9f5a-4bd32e1c2bf5` |
| `S01_FOREGROUND` | `A01-FG.webp`                       | generated                          | `ae6e1378-0719-4e19-a14d-b3737267cbda` |
| `S02_MACRO`      | `A02.jpg`                           | generated                          | `9b023598-0d65-4cd1-948e-3c11cf20696e` |
| `S02_END`        | `V01-END.jpg`                       | generated (стоп-кадр вместо видео) | `72759aa4-7141-4001-9c7d-57102b8ca38a` |
| `S03_FRAME_01`   | `V01-END.jpg`                       | reuse `S02_END`                    | —                                      |
| `S03_FRAME_02`   | `G1.jpg`                            | generated                          | `eb3b25f9-e643-44f7-8598-259db868ca17` |
| `S03_FRAME_03`   | `A02.jpg` (UV-кроп 1:1 в программе) | reuse `S02_MACRO`                  | —                                      |
| `S03_FRAME_04`   | `G2.jpg`                            | generated                          | `c539a834-acbe-48cd-9255-5c62f28d559e` |
| `S03_FRAME_05`   | `V02-STILL.jpg`                     | generated                          | `f245bffd-e108-4983-b687-2a96ca6e1916` |
| `S03_FRAME_06`   | `A03-src.jpg`                       | reuse `S04_BOUQUET`                | —                                      |
| `S04_BOUQUET`    | `A03-src.jpg`                       | generated                          | `96449e47-d269-4406-9772-fd2032294566` |
| `S04_DEPTH`      | `A03-depth.png`                     | source `placeholder` (G-04)        | производная                            |
| `S02_VIDEO`      | —                                   | **planned — ASSET GAP**            | не сгенерировано                       |
| `S02_VIDEO_V02`  | —                                   | **planned — ASSET GAP (NICE)**     | не сгенерировано                       |

Процедурные ассеты (`S01_TITLE_*`, `S01_SHADOW`, `S02_MACRO_MASK`,
`S03_PHRASE_*`, `S03_CAPTIONS`, `S04_BACKDROP`, `S04_EDGE_MASK`,
`POST_GRAIN`) строятся в `program.ts` через generic-текстуры с теми же
параметрами.

Новых генераций Higgsfield не было. Промпты исходных генераций перенесены
в manifest (валидация требует их для `generated`); рендерер не передаёт их
в клиентский payload.

## 5. Контент

Все строки — из прототипа 1:1 (`content.ts`). Факты сверены с
`business-profile.ts` (flowerstim.ru, 2026-09-23): адрес, телефон, часы,
Telegram/WhatsApp, доставка 750 ₽ в МКАД, бесплатный самовывоз.
Телефон в финале показан в формате прототипа («+ 7 (926) 025 45 44»),
канонический формат — в `BusinessProfile`.

**CONTENT GAP (G-09):** рейтинг «★ 5,0 · 192 оценки» и промокод ОСЕНЬ26
(−10%) взяты прототипом из карточки магазина от владельца; на
flowerstim.ru не подтверждены. Проверить перед запуском.

## 6. Verification (2026-09-25)

Сравнение прототипа и production в Chromium (SwiftShader WebGL), вьюпорты
1440×900 и 390×844 (touch), попиксельно: средняя разница в 10 устойчивых
кадрах 0.9–4.8 из 255 — уровень случайного film grain. Детерминированные
замеры с фейковыми часами (`page.clock`): W2 petal-through, S02→S03,
S03→S04, стопы S04, финал, hover рамы, лупа, курсор-камера — совпадают;
твин совпадает с точностью до одного кадра (16 мс).

Runtime: reduced motion (DOM сразу видим, без твина), fallback без WebGL,
wheel/клавиатура, клик по раме (`window.open` + UTM), копирование
промокода, очистка `overflow`/cursor/`__fsGo` при уходе со страницы, SSR и
гидрация (dev) без ошибок.

**UNVERIFIED:** реальные устройства (iOS Safari, Android Chrome), реальный
GPU, touch long-press лупы на железе, производительность на слабых
телефонах, 120 Гц дисплеи. Проверено только в эмуляции.

## 6a. Согласованные отклонения от прототипа (решения владельца, 2026-09-25)

- **Свайп** срабатывает, как только палец прошёл порог 42px, — не
  дожидаясь `touchend` (`BeatController`, generic для всех сайтов).
- **HUD:** подпись источника ассетов («Higgsfield · A01…») убрана;
  название сцены и полоса прогресса остались.
- **Шапка ≤520px:** плашка «Открыто до 00:00» скрыта — в строку не
  помещались кикер, плашка и CTA (часы есть в финале).
- **Экраны ≤460px** (`NARROW_*` в `stage/program.ts`), desktop и планшеты
  без изменений:
  - S01: общий план с бо́льшим отъездом (`K = 2.3`), кадр центрирован на
    букете и опущен — букет целиком, заголовок под вазой; передний план
    масштабируется вместе с отъездом; заголовок и колонка оффера подняты
    ближе к уровню глаз (низ заголовка 320px) и выровнены по левому краю
    (`.heroNarrow` в `stage.module.css`);
  - S03: угол обзора 66° вместо 45° — фразы и рамы вписываются по ширине,
    траектория камеры прежняя; рамы ×1.35, подписи рам ещё ×1.8 для
    читаемости;
  - S04: стоп 1 с тем же отъездом, что S01 (букет целиком); стопы 2–3 —
    как в прототипе; выноски разворачиваются влево, если не помещаются
    справа, и не выходят за левый край.

## 7. Gaps

| ID   | Тип                   | Суть                                                                                                                                                                                                                                                                 |
| ---- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G-02 | ASSET GAP             | Видео V01 (scroll-scrub S02) и V02 (loop в раме 05) не сгенерированы. Production повторяет прототип: камера по стоп-кадрам. Для генерации: 2 вызова Higgsfield image-to-video (V01 10 с 1080p от `S02_MACRO`, V02 10 с loop), требуется тариф Plus+. Не запускалось. |
| G-03 | ASSET                 | Вырезка `S01_BOUQUET`/`S01_FOREGROUND` по цвету фона — возможен светлый ореол на крупном плане (как в прототипе).                                                                                                                                                    |
| G-04 | ASSET                 | `S04_DEPTH` — размытая маска силуэта, а не depth (как в прототипе).                                                                                                                                                                                                  |
| G-05 | ASSET                 | Нет отдельного hi-res слоя центральной розы (как в прототипе).                                                                                                                                                                                                       |
| G-09 | CONTENT GAP           | Рейтинг и промокод — см. §5.                                                                                                                                                                                                                                         |
| F-01 | DESIGN GAP (fallback) | Без WebGL показывается статичная версия: тот же контент и фото, вертикальный скролл, без 3D, переходов, лупы и beat'ов. В прототипе fallback'а нет.                                                                                                                  |
| F-02 | ENGINE                | three r186 требует WebGL2; устройства только с WebGL1 (прототип r160 их поддерживал) получат fallback F-01.                                                                                                                                                          |
| F-03 | OPEN QUESTION         | Подпись источника ассетов в HUD убрана (§6a); нужны ли название сцены и прогресс — `content.hud.enabled`.                                                                                                                                                            |
| F-04 | OPEN QUESTION         | Root layout задаёт `<html lang="en">` и заголовок «Create Next App» для всех роутов; для promotion на `/` нужны `lang="ru"` и metadata Flowerstim.                                                                                                                   |

Особенности прототипа, сохранённые 1:1 (решение за дизайнером, не
исправлялись): на узком портрете «Магазин цветов · Москва» наезжает на
плашку «Открыто до 00:00», а выноски S04 уходят за правый край; raycast
клика в S03 попадает и в раму, ещё скрытую туманом; сам
`design-reference/flowerstim/prototype.html` грузит React 18 с unpkg (не
полностью офлайн).

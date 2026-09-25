# Florist Atelier · Production media S01–S04 (Higgsfield)

Бюджет Core: 6 изображений + 2 видео, 1 retry на ассет. Ниже 6 изображений (A01-BG, A01-BQ, A01-FG, A02, G1, A03), 2 видео (V01, V02) и опциональный G2 (сверх лимита, только по одобрению).
Как работать: вставьте блок PROMPT в чат Claude с подключённым Higgsfield, максимальное разрешение, затем upscale 2×.
Файлы кладите сюда в `media/` с точным именем из поля FILE.

Общий стиль (добавлять в конец каждого промпта):
> Light luxury European flower atelier, editorial fashion photography, soft natural daylight, ivory, milk and champagne palette, muted blush, dusty rose, soft sage, natural stone, linen, glass, ceramic, subtle soft shadows, fine film grain, photographic realism, medium format. No black or dark background, no gold, no saturated pink, no glossy commercial look, no text, no people, no cellophane.

---

## S01 · Hero: три согласованных кадра вместо одного

Почему три: из одной фотографии нельзя чисто вырезать передний план и получить фон «за букетом». Генерируем фон, букет и передний план отдельно, с одной камерой и одним светом, и собираем по глубине в WebGL.

### A01-BG · Layer 01 · background environment
FILE: `media/A01-BG.jpg` · 16:9 · focal 0.55/0.45
PROMPT:
Empty bright limestone atelier wall, warm ivory lime plaster with a shallow arched niche slightly right of center, a pale travertine plinth standing empty in front of the niche in the lower third, a soft rectangle of late-morning sun falling diagonally across the wall from the upper right. Nothing on the plinth. Frontal, eye level slightly above plinth height, 80mm lens at f/5.6, soft window light from camera-left, lifted warm shadows, large calm negative space in the upper-left third.
DEPTH: 2 плана (стена, постамент). Фактура штукатурки нужна, чтобы был читаемый parallax.
MOBILE CROP: 9:16 по центру 0.55.

### A01-BQ · Layer 02 + Layer 04 · bouquet + hero flower
FILE: `media/A01-BQ.png` · 1:1, максимальное разрешение, upscale до 4096+ · focal 0.52/0.42 (сердцевина hero-розы)
PROMPT:
A loose, airy luxury bouquet in a matte hand-thrown ivory ceramic vessel, photographed alone against a seamless plain warm ivory background for clean cut-out. Blush garden roses, dusty-rose ranunculus, cream sweet peas and muted sage olive branches. One large fully open blush garden rose at the exact center of the arrangement, facing the camera straight-on, spiral of petals sharply detailed with fine veins and one small water droplet — this rose is the hero and must hold extreme close-up. Same light as the atelier: soft window light from camera-left, gentle warm bounce. 80mm lens at f/8, deep focus across the bouquet.
DEPTH: чистый силуэт на однотонном фоне (под сегментацию). Hero-роза фронтально и в резкости.
КОНТРОЛЬ: в 100% crop сердцевина читается как лепестки, без «AI-каши». Иначе retry.

### A01-FG · Layer 03 · foreground petals / leaves
FILE: `media/A01-FG.png` · 16:9
PROMPT:
Two large out-of-focus blush rose petals and one soft sage olive leaf very close to the lens, placed at frame-left and top-right edges, heavily defocused creamy bokeh, isolated against a plain flat light grey background for easy masking, soft daylight from the left. Nothing else in frame.
DEPTH: только передний план. Фон ровный, из него сделаем alpha-маску.

---

## S02 · Pull-back

### A02 · macro · стартовый кадр V01 и конечная текстура W2
FILE: `media/A02.jpg` · 16:9 · focal 0.50/0.50
PROMPT:
Extreme macro of the heart of a single pale blush garden rose, petals spiraling toward the center and filling the entire frame edge to edge, no background visible. One clear water droplet on an inner petal edge, visible fine veins, soft translucent backlight from upper right making petals glow, creamy champagne highlights. Focal plane on the droplet and inner petal edge. 100mm macro lens at f/2.8, 1:1 magnification.
КОНТРОЛЬ: тон и форма лепестков как у hero-розы из A01-BQ (переход W2).

### V01 · pull-back video · 10 s · non-loop · scroll-scrub
FILE: `media/V01.mp4` · 16:9 · image-to-video, start frame = A02
PROMPT:
Starting on this extreme macro of the rose heart, the camera slowly and continuously dollies straight back along the lens axis, revealing the whole rose, then a generous low table arrangement of blush roses, cream sweet peas and sage branches in a low ivory stone bowl on a long pale oak table, then the soft bright atelier around it: lime-plaster wall, diffused window light from the left. Constant slow speed, no rotation, no cuts, no handheld shake. Petals stir very slightly. Lighting stays constant.
END FRAME: композиция по центру в нижней трети, сверху 40% пустого пространства.
ПОСЛЕ: перекодирую в all-intra для scrub.

---

## S03 · Exhibition

### G1 · стебли в стекле
FILE: `media/G1.jpg` · 4:5
PROMPT:
Three tall stems of pale peach garden roses and one arching sage olive branch in a clear hand-blown glass cylinder with water, on a pale travertine ledge against a warm ivory plaster wall; a crisp diagonal architectural shadow of a window mullion crosses the wall and the vase. Soft sun, refractions in water. Subject in left third, large negative space right. 85mm f/5.6.

### G2 · лён и ранункулюс (опционально, сверх Core)
FILE: `media/G2.jpg` · 4:5
PROMPT:
Overhead flat lay: a single dusty-rose ranunculus and two cut sweet pea stems resting on folded raw undyed linen on pale oak, a few loose petals, brass florist scissors partially entering the lower edge. Soft north window light. Top-down, 50mm f/4.
Без одобрения: вместо G2 кроп A02 1:1.

### V02 · atelier light (стоп-кадр для S03, loop для S05)
FILE: `media/V02.mp4` · 16:9 · 10 s · loop
PROMPT:
Locked-off static camera in a bright calm flower atelier with lime-plaster walls and a tall window with a sheer linen curtain on the right; a long pale oak worktable with loose stems. Only the light moves: the curtain slowly breathes in a light breeze, a soft sun patch drifts a few centimeters across the wall, stems sway almost imperceptibly. No camera movement, no people.
В S03 используется стоп-кадр. Полное видео пригодится в S05.

S03 ещё берёт: последний кадр V01, кроп A02, A03. Отдельной генерации для них не нужно.

---

## S04 · The Object

### A03 · signature bouquet
FILE: `media/A03.png` · 4:5, upscale до 8K (тайлы для лупы) · focal 0.46/0.44
PROMPT:
One sculptural hand-tied bouquet presented as an art object: cream and blush garden roses, dusty-rose lisianthus, pale peach ranunculus, white astilbe plumes and silvery sage eucalyptus, loose asymmetric silhouette with one long arching stem reaching up-left. Stems wrapped in raw undyed linen tied with a narrow champagne silk ribbon, standing in a slim matte ivory cylinder vase on a pale travertine block. Seamless warm ivory background with gentle gradient to champagne at the bottom, soft shadow falling right. Large diffused key light from camera-left at 45 degrees, subtle rim light behind right catching petal edges. Deep focus, crisp petal texture, one naturally imperfect outer petal. Subject slightly left of center, 70% of frame height. 100mm lens at f/8.
ТОЧКИ ВЫНОСОК: лён на стеблях, шёлковая лента, кромка лепестка (верх-лево), керамика. Все четыре должны быть в кадре и в резкости.

---

## Что я делаю после загрузки
1. Сегментация A01-BQ, A01-FG, A03 → PNG с alpha.
2. Depth maps (A01-BG, A01-BQ, A02, A03) → смещение и DOF в шейдере.
3. Замена плейсхолдеров в прототипе по именам файлов. Камеры, переходы и взаимодействия остаются прежними.
4. Проверка приближения к hero-розе и шва W2. Если нужно, подстройка кадрирования.

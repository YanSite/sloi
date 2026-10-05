# 10 — Происхождение медиа: промпты генерации

Внутренний документ (на сайте не упоминается). Все изображения ниже сгенерированы агентством, это не фото компаний. Модели: `gpt_image_2_5` (Higgsfield «flare»), `nano_banana_2`, `nano_banana_flash`, видео — `kling3_0` (std, 720p). ID — идентификаторы генераций в аккаунте Higgsfield, по ним можно найти оригинал в полном разрешении.

## Первая половина и поворот

### `street-hero.jpg` — улица с витринами (фон 01, чертёж поворота, 06, 07)
- ID `46588a1a-5462-4922-8381-90b581a5c8b4` · gpt_image_2_5 · 16:9 · 1344×752 · quality low · 2026-10-03
> Photorealistic wide documentary photograph of a quiet city street at blue-hour dusk, a row of small independent shopfronts side by side: a flower shop, a coffee bar, a barbershop, a small restaurant. Each large shop window glows with warm interior light and shows people and life inside in soft focus. Cool blue sky and damp pavement reflecting warm window light, a few passers-by as dark silhouettes from behind. Natural colors, authentic European-style street, cinematic but real, not stock. Shop signs blank or unreadable, no visible text, letters or logos anywhere.

### `street-poster.jpg` — «ваше место» в карточке (01–03)
Кадр из видео, снятого по стартовому кадру `street-hero` (`46588a1a`).
- Видео ID `e73d6026-0797-4a13-b876-60219a1316c1` · kling3_0 std · 5 с · 1280×720 · без звука
> Slow, smooth lateral camera glide along the row of glowing shopfronts at blue-hour dusk. Inside the warm windows people move naturally: a florist arranges flowers, a barista serves coffee, a barber works, diners chat. Passers-by walk past as dark silhouettes, reflections ripple on the damp pavement, warm light flickers gently. Calm, alive, documentary realism, natural motion. No readable text, signs or logos, no faces toward the camera.

### `phone-v.jpg` — рука с телефоном, мобильный (экран телефона пустой, контент вставляется кодом)
- ID `cc6e3d01-3f01-4781-a4ec-1dff616025af` · gpt_image_2_5 · 9:16 · 752×1344 · low
> Photorealistic documentary photograph at blue-hour dusk on a city street: a person's hand holding a modern smartphone upright, the phone facing the viewer straight-on and filling the lower middle of the frame, the phone screen completely black and blank. Behind, out of focus, a row of warm glowing shopfront windows and wet pavement reflections, cool blue evening light mixed with warm window light on the hand. Natural skin, realistic fingers, shallow depth of field. No face visible, no text, logos or brand marks on the phone or anywhere.

### `phone-h.jpg` — рука с телефоном, десктоп
- ID `c32b0e77-63d6-423f-a38f-47d9c370c22a` · gpt_image_2_5 · 16:9 · 1344×752 · low
> Photorealistic documentary photograph at blue-hour dusk on a city street: a person's hand holding a modern smartphone upright on the right side of the frame, the phone facing the viewer straight-on, the screen completely black and blank. Behind, out of focus, a row of warm glowing shopfront windows and wet pavement reflections, cool blue evening light mixed with warm window light on the hand. Natural skin, realistic fingers, shallow depth of field. No face visible, no text, logos or brand marks on the phone or anywhere.

Сайт «Кофейня на углу» в телефоне на повороте — HTML; фото в нём — вырезки из `street-hero.jpg` (отдельной генерации «фото заведения» нет).

### Сгенерировано, в прототипе не используется (можно задействовать при переносе на движок)
- `5f67a653-…` — та же улица «в лучшем виде» (2688×1520, правка по `46588a1a`).
- `ee21d531-…` — та же улица как архитектурный чертёж (синие линии); в прототипе чертёж рисуется кодом.
- Видео `9ee05908-…` (улица → чертёж) и `17adef6d-…` (чертёж → проявленная улица), kling3_0, 5 с.
- `cc6e…`/`c32b…` с включённым экраном: `2bbce53f-…` (9:16), `8e4b8144-…` (16:9).
- Ремёсла: флорист `d6e155a9-…` (+ видео `b2f20aab-…`), барбер `7aa0999c-…`, бариста `542ed13c-…`, шеф `18e74805-…`; интерьеры ресторана/кафе `94c04713-…`, `fa647ef8-…`, `5117447e-…`.
Полные промпты — в истории генераций Higgsfield по ID.

## Кейс «Цветочный магазин» (концепт)

### `fl-macro.jpg` — макро розы с каплей (вступление кейса)
- ID `9b023598-0d65-4cd1-948e-3c11cf20696e` · nano_banana_flash · 16:9 · 5504×3072 · 2026-09-24
> Extreme macro photograph of the heart of a single pale blush garden rose, petals spiraling toward the center and filling the entire frame edge to edge, no background visible. One clear water droplet on an inner petal edge, visible fine petal veins, soft translucent backlight from upper right making the petals glow, creamy champagne highlights. Focal plane on the droplet and inner petal edge, everything else dissolving into soft blush. 100mm macro lens at f/2.8, 1:1 magnification. Light luxury editorial photography, muted blush, fine film grain, photographic realism. No glitter, no excessive dew, no dark tones, no saturated pink.

### `fl-bouquet.jpg` — букет на экране сайта в телефоне
- ID `96449e47-d269-4406-9772-fd2032294566` · nano_banana_flash · 4:5 · 3712×4608
> One sculptural hand-tied bouquet presented as an art object: cream and blush garden roses, dusty-rose lisianthus, pale peach ranunculus, white astilbe plumes and silvery sage eucalyptus, loose asymmetric silhouette with one long arching stem reaching up-left. Stems wrapped in raw undyed linen tied with a narrow champagne silk ribbon, standing in a slim matte ivory ceramic cylinder vase on a pale travertine block. Seamless warm ivory background with a gentle gradient to champagne at the bottom, soft shadow falling right. Large diffused key light from camera-left at 45 degrees, subtle rim light from behind right catching petal edges. Deep focus, crisp petal texture, one naturally imperfect outer petal. Subject slightly left of center, 70% of frame height. 100mm lens at f/8. Light luxury European flower atelier, editorial fashion photography, fine film grain, photographic realism, medium format. No dark background, no gold, no saturated pink, no glossy commercial look, no text, no cellophane.

### `world-flower.jpg` — размытый фон экрана
- ID `72759aa4-7141-4001-9c7d-57102b8ca38a` · nano_banana_flash · 16:9 · 5504×3072
> Wide editorial photograph of a generous low table arrangement of blush garden roses, cream sweet peas and sage olive branches in a low ivory stone bowl on a long pale oak table, centered in the lower third of the frame; in the exact center of the arrangement one large fully open pale blush garden rose facing the camera straight-on. Behind: a soft bright flower atelier, warm ivory lime-plaster wall, diffused morning window light from the left, 40% calm negative space above. Frontal, eye level just above the table, 50mm lens at f/4. Light luxury European flower atelier, editorial fashion photography, ivory, milk and champagne palette, muted blush, soft sage, fine film grain, photographic realism, medium format. No dark background, no gold, no text, no people.

### `fl-g1…g9.jpg` — 9 слайдов лендинга-концепта на стенах
Скомпонованные экраны сайта (вёрстка концепта, логотип стёрт). Фото на них — генерации того же дня: ниша и постамент `75c53c19-…`, букет на вырез `170e504b-…`, ателье `f245bffd-…`, флэтлей `c539a834-…`, розы в стеклянном цилиндре `eb3b25f9-…`, лепестки на переднем плане `ae6e1378-…`, плюс `9b023598`, `96449e47`, `72759aa4`.

## Кейс «Кафе-пекарня» (концепт)

### `ck-macro.jpg` — разлом печенья с шоколадом (вступление кейса)
- ID `acef68fa-0529-4ee2-9faf-1f09dc3d77e1` · nano_banana_2 · 16:9 · 2752×1536 · 2026-09-26
> Extreme macro inside a freshly broken warm chocolate chunk cookie, camera looking into the break: soft open golden crumb structure with air pockets, thick strands of molten dark chocolate slowly stretching across the gap, glossy chocolate pools, a few loose crumbs, hot pink #FF3E9A rim light glowing from behind through the break, deep crimson and chocolate shadows, very shallow depth of field, faint warm steam. Cinematic luxury food commercial, photorealistic, not CGI. No text.

### `ck-cookie.webp` — печенье с шоколадом (кадры «Тёплое печенье»)
- ID `8bd10b53-2d96-4fa2-9efd-1867c839372a` · nano_banana_2 · 1:1 · 2048×2048 (вырезано с розовым ореолом)
> Editorial luxury food campaign photograph. One oversized thick chocolate chunk cookie, about 12 cm wide and 3 cm tall, cracked baked golden-brown surface with visible pores and sugar crystals, glossy dark chocolate chunks half-melted on top and bursting from the edges, a few loose crumbs, slightly irregular hand-formed edge. Three-quarter view 28 degrees above, 100mm macro lens, f/8, hard directional key light from top right creating crisp specular highlights on the chocolate, deep soft shadow on the left side, faint pink bounce light. Isolated on a seamless hot pink #FF3E9A studio backdrop, soft contact shadow. Photorealistic, medium format, natural imperfections, not CGI, not plastic. No props, no plate, no hands, no text, no logos.

### `ck-dessert.jpg` (в пакете был `ck-oreo.jpg`) — десерт «Шоколад и крем»
Двухшаговая генерация: исходник, затем **отдельная правка, убравшая надписи и эмблему** с печенья-сэндвича.
1. ID `4adf9ae8-913a-49ee-b14d-510616044743` · nano_banana_2 · 1:1 · 2048×2048
> Editorial luxury food campaign photograph. One oversized thick dark chocolate cookie mixed with white chocolate chunks and crushed Oreo-style chocolate sandwich cookie pieces, topped with a generous swirl of cream cheese and white chocolate frosting and one whole chocolate sandwich cookie pressed into the frosting at an angle, a few dark cookie crumbs. Three-quarter view 28 degrees above, 100mm macro lens, f/8, hard directional key light from top right, crisp highlights on the frosting, deep soft shadow on the left, faint pink bounce light. Isolated on a seamless hot pink #FF3E9A studio backdrop, soft contact shadow. Photorealistic, natural imperfections, realistic frosting texture with subtle moisture, not CGI. No props, no hands, no text, no visible logos.
2. Правка ID `02dfc29a-a283-47a1-ae75-f52f4e8b1630` · gpt_image_2_5 · 2048×2048 · прозрачный фон · 2026-09-28 (в пакете — эта версия на чёрном)
> Edit this exact photo. Keep everything identical: the same cookie, same composition, framing, camera angle, lighting, colors, frosting swirl, white chocolate chunks, crumbs and transparent background. Only change the two dark chocolate sandwich wafer cookies: remove ALL lettering, words, logos and oval brand emblem from their embossed surface and replace it with a plain generic embossed pattern of small radial petals and dots, with no text of any kind. The wafers must not resemble any branded cookie. Photorealistic, no text anywhere.

Так же обезличены макро для слайдов: `28bbc90e-…` (крем + печенье-сэндвич), `0ff427ed-…` (вид сверху), `463ff00e-…` (малиновый крем, капля шоколада без «пика»).

### `ck-g1…g12.jpg` — 12 кадров сайта-концепта на стенах
Скомпонованные кадры сайта (логотип и адрес убраны). Фото на них — генерации 2026-09-26/28: `8bd10b53` (классика), `acef68fa` (разлом), `02dfc29a` (шоколад и крем), `807ac7f8-…` (малина и шоколад), `46bf2d92-…` (молочный шоколад), макро `11972af8-…`, `28bbc90e-…`, `c87d3590-…`, `463ff00e-…`, `e8a01f04-…`, `04edcb98-…`, `8d34f8e4-…`; фоны вырезаны `image_background_remover`.

### `world-cookie.jpg`
Не используется (фон пекарни — градиент). Можно удалить.

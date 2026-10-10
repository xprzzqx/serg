# Промпты для Higgsfield — сайт «Хвоя»

Каждый блок ниже — один кадр для сайта. Копируйте промпт целиком, генерируйте 3–4 варианта, берите лучший и сохраняйте под указанным именем файла. Готовые файлы присылайте в чат или загружайте в папку `img/` репозитория (на GitHub: Add file → Upload files, ветка `claude/portfolio-site-mockup-tb5bcs`). Дальше я сам сожму их, встрою в сайт и в макет Claude Design.

## Общие правила

**Модель для картинок:** любая фотореалистичная (Higgsfield Soul, Seedream, Flux, GPT Image). Пробуйте две и сравнивайте.
**Модель для видео:** Kling, Veo или Seedance в режиме **image-to-video**: загружаете уже готовую картинку первого экрана и добавляете промпт движения.

**Хвост стиля** — добавляйте в конец КАЖДОГО промпта, чтобы все кадры выглядели как одна фотосессия:

```
muted green and warm amber palette, soft natural light, gentle film grain, editorial travel photography, shot on 35mm, realistic, no text, no logos, no watermark
```

**Если в поле есть negative prompt:**

```
text, letters, logo, watermark, people facing camera, cars, power lines, modern glass buildings, oversaturated colors, HDR look, cartoon, illustration, blurry, distorted architecture
```

---

## 1. Первый экран — главная картинка

**Файл:** `hero.jpg` · **Формат:** 16:9, максимальное разрешение

```
Wide landscape of the Ukrainian Carpathian mountains at golden hour, several layered rounded ridges fading into haze, dense spruce forest on the slopes, thick soft fog lying in the valley, a small dark wooden A-frame cabin with one warm glowing window standing on a green mountain meadow in the lower right third, thin smoke rising from its chimney, tall spruces framing the left and right edges, low sun glowing behind the far ridge, large calm empty sky in the upper half for a headline, quiet and peaceful mood
```

Важно: верхняя половина кадра должна быть пустым небом, на ней будет заголовок.

**Мобильная версия того же кадра** · **Файл:** `hero-mobile.jpg` · **Формат:** 9:16

```
Vertical view of the Ukrainian Carpathian mountains at golden hour, layered misty ridges, spruce forest, fog in the valley, a small wooden A-frame cabin with a warm glowing window on a meadow in the lower third, thin chimney smoke, tall spruce on one side, wide calm empty sky in the upper half
```

## 2. Видео на первый экран

**Файл:** `hero.mp4` · **Режим:** image-to-video из `hero.jpg` · **Длина:** 6–8 секунд · **Формат:** 16:9

```
Very slow cinematic dolly-in toward the cabin, fog gently drifting through the valley from left to right, chimney smoke slowly rising and curling, spruce tops barely swaying in light wind, warm window light flickering softly, sun haze shimmering, calm and meditative, no camera shake, seamless loop
```

Если видео не зацикливается гладко, ничего страшного: я сделаю плавный переход в коде.

## 3. Будиночки — три карточки

Формат для всех трёх: **4:3**.

### «Чорниця» — A-frame для двох

**Файл:** `cabin-chornytsia.jpg`

```
Small dark wooden A-frame cabin for two people on a misty Carpathian mountain slope in early morning, large triangular panoramic window with warm light inside, small wooden terrace with two chairs and a blanket, spruce forest around, thick fog over the valley behind, dew on the grass, cozy and quiet
```

### «Брусниця» — будинок з терасою

**Файл:** `cabin-brusnytsia.jpg`

```
Wooden mountain house with a gable roof and a wide covered wooden terrace built above a small rocky mountain stream, Carpathian spruce forest, warm sunset light, two glowing windows, string lights on the terrace, low sun behind soft hills, summer evening, Hutsul-style carved wooden details
```

### «Смерекова хата» — великий будинок з чаном

**Файл:** `cabin-smerekova.jpg`

```
Larger dark wooden chalet in the Ukrainian Carpathians at night in winter, deep snow, three warm glowing windows, snow on the roof, a round wooden hot tub (chan) beside the house with steam rising into the cold air, snow-covered spruces, clear night sky with stars and a crescent moon, cozy blue hour mood
```

## 4. Чан і сауна

**Файл:** `chan.jpg` · **Формат:** 4:5

```
Close-up of a traditional Carpathian wood-fired hot tub (chan) outdoors in the evening, hot water with floating herbs, thyme, mint and juniper sprigs, thick steam rising, warm string lights and a lantern, snow-covered spruce trees in the background, wooden steps and a towel on the edge, cozy and inviting
```

## 5. Інтер'єр (за бажанням)

**Файл:** `interior.jpg` · **Формат:** 3:2

```
Interior of a small wooden A-frame cabin, huge triangular panoramic window looking at misty Carpathian mountains, simple bed with linen bedding and a wool blanket, small black wood-burning fireplace, warm morning light, a cup of coffee on a wooden table, minimal Scandinavian-Hutsul interior, calm
```

## 6. «Чим зайнятися» — шість моментів дня (за бажанням)

Формат для всех: **3:4**. Сейчас в этом блоке цветные карточки. Если сгенерируете эти кадры, я поставлю их в фон карточек.

| Файл | Промпт |
|---|---|
| `day-0730.jpg` | `Morning fog filling a Carpathian valley seen from a wooden cabin terrace, a mug of coffee steaming on the railing, spruce forest, pale soft dawn light` |
| `day-0930.jpg` | `Rustic Hutsul breakfast on a wooden table outdoors: banosh cornmeal porridge with brynza cheese and mushrooms, honey jar, bread, herbal tea, morning sun, mountains blurred in the background` |
| `day-1200.jpg` | `Probiy waterfall in Yaremche, Carpathians, water rushing over dark rocks, spruce trees, summer midday light, no people` |
| `day-1600.jpg` | `Wooden suspension footbridge over the Prut river in the Carpathians, clear mountain water over stones, afternoon light, green forested banks` |
| `day-1930.jpg` | `Wood-fired outdoor hot tub at sunset with steam, warm string lights, Carpathian ridges glowing orange in the background` |
| `day-2230.jpg` | `Starry night sky over silhouettes of spruce trees in the Carpathians, Milky Way, a small wooden cabin with one warm window, no light pollution` |

## 7. Превью для соцсетей

**Файл:** `og-image.jpg` · **Формат:** 1200×630 (или 16:9 с последующей обрезкой)

```
Carpathian mountains with layered misty ridges at golden hour, small wooden A-frame cabin with warm window on a meadow, spruce forest, calm, large empty space on the left side
```

Эта картинка показывается, когда ссылкой на сайт делятся в Telegram или Instagram.

---

## Минимальный набор

Если хочется быстро, достаточно шести файлов: `hero.jpg`, `hero.mp4`, три `cabin-*.jpg` и `chan.jpg`. Всё остальное — бонус.

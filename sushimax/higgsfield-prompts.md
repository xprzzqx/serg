# Промпты для Higgsfield — сайт SushiMax

Нужно 4 кадра. Стиль сайта: премиум, чёрный с красным, глубокие тени, мало света, как в дорогом ресторане. Ваши фото блюд сняты на тёмном фоне, и новые кадры должны выглядеть как продолжение той же съёмки.

Генерируйте по 3–4 варианта, берите лучший и сохраняйте под указанным именем. Готовые файлы присылайте в чат или загружайте в папку `sushimax/img/` (на GitHub: Add file → Upload files, ветка `claude/sharp-gates-9ufwsx`). Сжимаю и встраиваю сам.

## Общие правила

**Модель:** любая фотореалистичная (Higgsfield Soul, Seedream, Flux, GPT Image).

**Хвост стиля.** Добавляйте его в конец каждого промпта, тогда кадры выглядят как одна съёмка:

```
dark luxury restaurant mood, deep black background, low-key lighting with a single soft warm key light, subtle deep red accents, rich glossy textures, high-end food editorial photography, shot on 85mm, shallow depth of field, realistic, appetizing, no text, no logos, no watermark
```

**Negative prompt**, если есть такое поле:

```
text, letters, logo, watermark, brand names, faces looking at camera, bright background, white background, daylight, plastic-looking food, oversaturated, HDR, neon, cartoon, illustration, extra fingers, deformed hands, deformed chopsticks
```

Логотип в генерацию не добавляйте: нейросеть его исказит. Логотип на сайте ставлю сам.

---

## 1. Первый экран

**Файл:** `hero.jpg` · **Формат:** 16:9, максимальное разрешение

```
Wide cinematic shot of an assorted premium sushi set arranged on a matte black slate board on a dark table: rows of uramaki with salmon, rolls in orange tobiko, torched salmon rolls glazed with sauce, salmon and tuna nigiri, a small black dish of soy sauce, pickled ginger, black chopsticks resting on a stand, the board placed in the right half of the frame, the left half fading into deep black empty space for a headline
```

Важно: левая половина кадра должна быть тёмной и пустой, на ней будет заголовок.

**Мобильная версия:** `hero-mobile.jpg` · **Формат:** 4:5, тот же промпт, но в конце замените «the left half fading into deep black empty space for a headline» на «the bottom half fading into deep black empty space».

## 2. Кухня: «свежее каждый день»

**Файл:** `kitchen.jpg` · **Формат:** 4:3

```
Close-up of a sushi chef's hands in a black chef jacket slicing a fresh raw salmon fillet with a long yanagiba knife on a dark wooden board, glistening salmon texture, a few drops of water, dark kitchen background, focused calm craftsmanship
```

## 3. Доставка

**Файл:** `delivery.jpg` · **Формат:** 4:3

```
A courier in a plain black jacket handing a black paper takeaway bag with a deep red ribbon tie to a person at an apartment door at night, warm light from the hallway, view from inside the apartment, faces not visible, only hands, bag and doorway in focus, elegant and calm
```

## 4. Подача на стол

**Файл:** `table.jpg` · **Формат:** 1:1

```
Top-down view of a dinner table at night with an opened black takeaway box holding a large assorted sushi set, two pairs of hands with black chopsticks, soy sauce dish, ginger, two glasses of red wine, dark linen, candle light, intimate evening at home
```

---

## Что делать с готовыми файлами

1. `hero.jpg` встанет на первый экран вместо фото с лодкой.
2. `kitchen.jpg` и `delivery.jpg` пойдут в блок «Tři kroky k večeři».
3. `table.jpg` станет картинкой для превью ссылки в соцсетях.

Пока файлов нет, на сайте стоят ваши настоящие фото с sushimax.cz.

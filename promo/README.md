# Промо-ролики «Терикон»

- `terikon-promo-16x9.mp4` — 1920×1080, 43 с: для Behance, YouTube, сайта-портфоліо.
- `terikon-promo-9x16.mp4` — 1080×1920, 23 с: для Reels, TikTok, Stories.

Ролики без звуку: музику краще додати в Instagram/TikTok/CapCut з їхньої бібліотеки, там вона ліцензована.

## Як перезаписати (наприклад, змінити контакт у фіналі)

1. Покласти `card.html` і `phone.html` в одну папку з посиланням `terikon` на папку сайту та запустити там `python3 -m http.server 8765`.
2. `node rec.js frames-h h '{"url":"t.me/ваш_нік","sub":"Дизайн і розробка сайтів під ключ"}'` (або `v` для вертикалі).
3. `ffmpeg -framerate 30 -i frames-h/%05d.jpg -c:v libx264 -crf 20 -pix_fmt yuv420p promo.mp4`

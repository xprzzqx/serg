// Запис промо-ролика сайту «Терикон» кадр за кадром (30 fps).
const { chromium } = require(process.env.NODE_PATH_PW);
const fs = require('fs');
const BASE = 'http://localhost:8765/';
const FPS = 30;
const OUT = process.argv[2];           // папка кадрів
const MODE = process.argv[3] || 'h';   // h = 16:9, v = 9:16
const OUTRO = JSON.parse(process.argv[4] || '{}');
const W = MODE === 'v' ? 1080 : 1920, H = MODE === 'v' ? 1920 : 1080;

let n = 0;
const ease = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const sec = (s) => Math.round(s * FPS);

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Animation.enable');

  const shot = async () => { await page.screenshot({ path: `${OUT}/${String(n++).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92 }); };
  const hold = async (s) => { for (let i = 0; i < sec(s); i++) await shot(); };

  // Сповільнюємо CSS-анімації так, щоб 1 с анімації = 1 с відео
  let rate = 1;
  async function calibrate() {
    const t0 = Date.now(); for (let i = 0; i < 10; i++) await page.screenshot({ type: 'jpeg', quality: 92 });
    const per = (Date.now() - t0) / 10; rate = Math.min(1, (1000 / FPS) / per);
    await cdp.send('Animation.setPlaybackRate', { playbackRate: rate });
  }

  async function overlay(frameSel) {
    await page.addStyleTag({ content: `
      html { scroll-behavior: auto !important; }
      .rec-cursor, .rec-cap { position: fixed; margin: 0; padding: 0; border: 0; background: transparent; overflow: visible; inset: auto; z-index: 2147483647; pointer-events: none; }
      .rec-cursor { left: 0; top: 0; width: 34px; height: 34px; }
      .rec-cursor svg { width: 34px; height: 34px; filter: drop-shadow(0 3px 6px rgba(0,0,0,.45)); }
      .rec-ring { position: absolute; left: -22px; top: -22px; width: 44px; height: 44px; border-radius: 50%; border: 3px solid #ff8a1e; opacity: 0; }
      .rec-cap { left: 48px; bottom: 48px; display: flex; align-items: center; gap: 16px; padding: 18px 26px; background: #17181b; color: #ece9e3; font: 600 28px 'IBM Plex Sans', sans-serif; box-shadow: 0 20px 40px -20px rgba(0,0,0,.6); opacity: 0; }
      .rec-cap b { font: 500 18px 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: #17181b; background: #ff8a1e; padding: 6px 10px; }
    `});
    await page.evaluate(() => {
      const c = document.createElement('div'); c.className = 'rec-cursor'; c.setAttribute('popover', 'manual');
      c.innerHTML = '<div class="rec-ring"></div><svg viewBox="0 0 24 24"><path d="M3 2l17 9.5-7.6 1.9L9 21z" fill="#fff" stroke="#17181b" stroke-width="1.6" stroke-linejoin="round"/></svg>';
      const k = document.createElement('div'); k.className = 'rec-cap'; k.setAttribute('popover', 'manual'); k.innerHTML = '<b></b><span></span>';
      document.body.append(c, k); c.showPopover(); k.showPopover();
      window.__cur = { x: innerWidth * .62, y: innerHeight * .7 };
      window.__setCur = (x, y, ring) => { c.style.transform = `translate(${x}px,${y}px)`; const r = c.querySelector('.rec-ring'); r.style.opacity = ring ? (1 - ring) : 0; r.style.transform = `scale(${0.4 + ring * 1.4})`; window.__cur = { x, y }; };
      window.__cap = (tag, text, k2) => { k.querySelector('b').textContent = tag; k.querySelector('span').textContent = text; k.style.opacity = k2; k.style.transform = `translateY(${(1 - k2) * 24}px)`; };
      window.__top = () => { c.hidePopover(); c.showPopover(); k.hidePopover(); k.showPopover(); };
      window.__setCur(window.__cur.x, window.__cur.y, 0);
    });
  }
  const cap = async (tag, text, s = 0.4) => { for (let i = 1; i <= sec(s); i++) { await page.evaluate(([a, b, k]) => __cap(a, b, k), [tag, text, ease(i / sec(s))]); await shot(); } };
  const capOff = async (s = 0.3) => { for (let i = sec(s); i >= 0; i--) { await page.evaluate((k) => __cap(document.querySelector('.rec-cap b').textContent, document.querySelector('.rec-cap span').textContent, k), ease(i / sec(s))); await shot(); } };
  async function moveTo(sel, s = 0.8, dx = 0.5, dy = 0.5) {
    const box = await page.locator(sel).first().boundingBox();
    const tx = box.x + box.width * dx, ty = box.y + box.height * dy;
    const from = await page.evaluate(() => window.__cur);
    for (let i = 1; i <= sec(s); i++) { const k = ease(i / sec(s)); await page.evaluate(([x, y]) => __setCur(x, y, 0), [from.x + (tx - from.x) * k, from.y + (ty - from.y) * k]); await shot(); }
  }
  async function click(sel, after = 0.5) {
    await page.locator(sel).first().click({ force: true });
    const c = await page.evaluate(() => window.__cur);
    for (let i = 1; i <= sec(after); i++) { await page.evaluate(([x, y, r]) => __setCur(x, y, r), [c.x, c.y, Math.min(1, i / sec(0.35))]); await shot(); }
  }
  async function scrollTo(y, s) {
    const from = await page.evaluate(() => scrollY);
    for (let i = 1; i <= sec(s); i++) { await page.evaluate((v) => window.scrollTo(0, v), from + (y - from) * ease(i / sec(s))); await shot(); }
  }
  const yOf = (sel, off = 0) => page.evaluate(([s, o]) => document.querySelector(s).getBoundingClientRect().top + scrollY + o, [sel, off]);

  async function card(q, dur) {
    await page.goto(BASE + 'card.html?' + q + '&dur=' + dur); await page.waitForTimeout(1200);
    for (let i = 0; i < sec(dur); i++) { await page.evaluate((t) => setT(t), i / FPS); await shot(); }
  }

  // ---------- 1. Заставка ----------
  await card('m=intro' + (MODE === 'v' ? '&v=1' : ''), 3);

  if (MODE === 'h') {
    // ---------- 2. Головна ----------
    await page.goto(BASE + 'terikon/index.html'); await page.waitForTimeout(1500);
    await overlay(); await calibrate();
    for (let i = 0; i < sec(2.2); i++) { await page.evaluate((s) => { document.querySelector('.hero__scene').style.transform = `scale(${s})`; }, 1.06 - 0.06 * ease(i / sec(2.2))); if (i === sec(0.6)) {} await shot(); }
    await cap('Головна', 'Колекція з таймером продажу', 0.4);
    await hold(0.8);
    await capOff();
    await scrollTo(await yOf('#drop', -40), 2.2);
    await hold(0.6);
    await moveTo('.card >> nth=1', 0.7, 0.5, 0.35);
    await hold(0.8);
    await scrollTo(await yOf('#lookbook', -20), 2);
    await cap('Лукбук', 'Як журнальний розворот', 0.4);
    await hold(1.2);
    await capOff();

    // ---------- 3. Каталог ----------
    await page.goto(BASE + 'terikon/catalog.html'); await page.waitForTimeout(1200);
    await overlay(); await cdp.send('Animation.setPlaybackRate', { playbackRate: rate });
    await page.evaluate(() => window.scrollTo(0, document.querySelector('.catalog').getBoundingClientRect().top + scrollY - 30));
    await cap('Каталог', 'Фільтри працюють наживо', 0.4);
    await moveTo('input[value="jacket"]', 0.8);
    await click('input[value="jacket"]', 0.9);
    await moveTo('input[value="pants"]', 0.5);
    await click('input[value="pants"]', 0.9);
    await moveTo('[data-size-filter] >> text=XL', 0.6);
    await click('[data-size-filter] >> text=XL', 1.0);
    await moveTo('.filters__actions [data-filter-reset]', 0.7);
    await click('.filters__actions [data-filter-reset]', 0.9);
    await capOff();

    // ---------- 4. Товар ----------
    await page.goto(BASE + 'terikon/product.html'); await page.waitForTimeout(1200);
    await overlay(); await cdp.send('Animation.setPlaybackRate', { playbackRate: rate });
    await page.evaluate(() => window.scrollTo(0, 90));
    await cap('Товар', 'Залишки по кожному розміру', 0.4);
    await moveTo('.gallery__thumbs button >> nth=1', 0.7);
    await click('.gallery__thumbs button >> nth=1', 0.6);
    await moveTo('.gallery__thumbs button >> nth=2', 0.4);
    await click('.gallery__thumbs button >> nth=2', 0.6);
    await capOff(0.2);
    await cap('Підбір', 'Розмір за зростом і вагою', 0.3);
    await moveTo('[data-open-fit]', 0.7);
    await click('[data-open-fit]', 0.3);
    await page.evaluate(() => __top());
    await moveTo('#fit-h', 0.5);
    for (const v of ['1', '18', '188']) { await page.evaluate((x) => { const e = document.getElementById('fit-h'); e.value = x; e.dispatchEvent(new Event('input', { bubbles: true })); }, v); await hold(0.15); }
    await moveTo('#fit-w', 0.4);
    for (const v of ['8', '80']) { await page.evaluate((x) => { const e = document.getElementById('fit-w'); e.value = x; e.dispatchEvent(new Event('input', { bubbles: true })); }, v); await hold(0.15); }
    await hold(0.6);
    await moveTo('[data-fit-apply]', 0.6);
    await click('[data-fit-apply]', 0.6);
    await capOff(0.2);
    await cap('Кошик', 'Шторка без перезавантаження', 0.3);
    await moveTo('[data-add-to-cart]', 0.7);
    await click('[data-add-to-cart]', 0.1);
    await page.evaluate(() => __top());
    await hold(1.8);
    await capOff();

    // ---------- 5. Телефон ----------
    await page.goto(BASE + 'phone.html'); await page.waitForTimeout(2000);
    const f = page.frameLocator('#f'); const fr = page.frames().find((x) => x.url().includes('terikon/index.html'));
    await fr.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    await hold(0.8);
    const hy = await fr.evaluate(() => document.querySelector('#drop').getBoundingClientRect().top + scrollY - 70);
    for (let i = 1; i <= sec(2.4); i++) { await fr.evaluate((v) => window.scrollTo(0, v), hy * ease(i / sec(2.4))); await shot(); }
    await hold(0.5);
    for (let i = 1; i <= sec(0.5); i++) { await fr.evaluate((v) => window.scrollTo(0, v), hy - 40 * ease(i / sec(0.5))); await shot(); }
    await fr.click('.burger'); await hold(1.6);
    await fr.click('.drawer.is-open [data-close]'); await hold(0.6);
  } else {
    // ---------- Вертикаль: все в телефоні ----------
    await page.goto(BASE + 'phone.html?v=1'); await page.waitForTimeout(2000);
    let fr = page.frames().find((x) => x.url().includes('terikon/'));
    const prep = async () => { fr = page.frames().find((x) => x.url().includes('terikon/')); await fr.addStyleTag({ content: 'html{scroll-behavior:auto!important}' }); };
    const fscroll = async (y, s) => { const from = await fr.evaluate(() => scrollY); for (let i = 1; i <= sec(s); i++) { await fr.evaluate((v) => window.scrollTo(0, v), from + (y - from) * ease(i / sec(s))); await shot(); } };
    await page.evaluate(() => { document.querySelector('h1').innerHTML = 'Магазин<br>стрітвіру'; document.querySelector('.label').textContent = 'Головна'; document.querySelector('.copy p').textContent = 'Колекція, таймер продажу й залишки по розмірах.'; });
    await prep(); await hold(1.2);
    await fscroll(await fr.evaluate(() => document.querySelector('#drop').getBoundingClientRect().top + scrollY - 70), 2.4);
    await hold(0.6);
    await fscroll(await fr.evaluate(() => document.querySelector('#lookbook').getBoundingClientRect().top + scrollY - 10), 2);
    await hold(1);
    await page.evaluate(() => { document.getElementById('f').src = 'terikon/catalog.html'; document.querySelector('h1').innerHTML = 'Фільтри<br>наживо'; document.querySelector('.label').textContent = 'Каталог'; document.querySelector('.copy p').textContent = 'Категорія, розмір, колір — картки змінюються одразу.'; });
    await page.waitForTimeout(1500); await prep();
    await fscroll(await fr.evaluate(() => document.querySelector('.filters').getBoundingClientRect().top + scrollY - 70), 0.8);
    for (const v of ['hoodie', 'pants']) { await fr.evaluate((x) => document.querySelector(`input[value="${x}"]`).click(), v); await hold(0.7); }
    await fscroll(await fr.evaluate(() => document.querySelector('.toolbar').getBoundingClientRect().top + scrollY - 70), 1.2);
    await hold(1.2);
    await page.evaluate(() => { document.getElementById('f').src = 'terikon/product.html'; document.querySelector('h1').innerHTML = 'Кошик<br>у шторці'; document.querySelector('.label').textContent = 'Товар'; document.querySelector('.copy p').textContent = 'Обрали розмір, додали в кошик — без перезавантаження.'; });
    await page.waitForTimeout(1500); await prep();
    await hold(0.8);
    await fscroll(await fr.evaluate(() => document.querySelector('#sizes').getBoundingClientRect().top + scrollY - 160), 1.4);
    await fr.evaluate(() => document.querySelector('[data-size="XL"]').click()); await hold(0.6);
    await fr.evaluate(() => document.querySelector('[data-add-to-cart]').click()); await hold(2);
  }

  // ---------- 6. Фінал ----------
  const q = new URLSearchParams({ m: 'outro', ...OUTRO }); if (MODE === 'v') q.set('v', '1');
  await card(q.toString(), 3.5);

  console.log('frames', n, 'rate', rate.toFixed(2));
  await browser.close();
})();

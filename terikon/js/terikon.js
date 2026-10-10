// ТЕРИКОН: дрібна інтерактивність макета. Справжніх замовлень і оплати немає.
(function () {
  // Таймер до старту дропу
  var box = document.querySelector('[data-countdown]');
  if (box) {
    // "next-sunday": найближча неділя 23:59, щоб у макеті таймер ніколи не стояв на нулях
    var attr = box.getAttribute('data-countdown');
    var target;
    if (attr === 'next-sunday') {
      var d = new Date();
      d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7));
      d.setHours(23, 59, 59, 0);
      target = d.getTime();
    } else {
      target = new Date(attr).getTime();
    }
    var cells = {
      d: box.querySelector('[data-unit="d"]'),
      h: box.querySelector('[data-unit="h"]'),
      m: box.querySelector('[data-unit="m"]'),
      s: box.querySelector('[data-unit="s"]')
    };
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var tick = function () {
      var left = Math.max(0, target - Date.now());
      var sec = Math.floor(left / 1000);
      cells.d.textContent = pad(Math.floor(sec / 86400));
      cells.h.textContent = pad(Math.floor(sec % 86400 / 3600));
      cells.m.textContent = pad(Math.floor(sec % 3600 / 60));
      cells.s.textContent = pad(sec % 60);
    };
    tick();
    setInterval(tick, 1000);
  }

  // Кнопки-перемикачі в межах групи: розміри, кольори, мініатюри
  document.querySelectorAll('[data-group]').forEach(function (group) {
    var single = group.hasAttribute('data-single');
    group.addEventListener('click', function (e) {
      var btn = e.target.closest('button[aria-pressed]');
      if (!btn || btn.disabled || !group.contains(btn)) return;
      if (single) {
        group.querySelectorAll('button[aria-pressed]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.setAttribute('aria-pressed', btn.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      }
      group.dispatchEvent(new CustomEvent('pick', { detail: btn }));
    });
  });

  // Розмір на сторінці товару: підпис залишку і підсвітка рядка в таблиці
  var sizes = document.querySelector('[data-sizes]');
  if (sizes) {
    var note = document.querySelector('[data-size-note]');
    sizes.addEventListener('pick', function (e) {
      var b = e.detail;
      var left = Number(b.getAttribute('data-left'));
      note.textContent = b.dataset.size + ' — ' + (left <= 5 ? 'залишилось ' + left + ' шт, поспішайте' : 'в наявності ' + left + ' шт');
      document.querySelectorAll('.size-table tr[data-row]').forEach(function (tr) {
        tr.classList.toggle('on', tr.getAttribute('data-row') === b.dataset.size);
      });
    });
  }

  // Галерея: мініатюри міняють головне фото
  var main = document.querySelector('[data-gallery-main]');
  var thumbs = document.querySelector('[data-thumbs]');
  if (main && thumbs) {
    thumbs.addEventListener('pick', function (e) {
      var img = e.detail.querySelector('img');
      main.src = img.src;
      main.alt = img.alt;
    });
  }

  // Кількість у кошику
  document.querySelectorAll('.qty').forEach(function (q) {
    var out = q.querySelector('output');
    q.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var n = Number(out.textContent) + (b.dataset.step === '+' ? 1 : -1);
      out.textContent = Math.min(3, Math.max(1, n));
    });
  });

  // Форми макета нікуди не відправляються
  document.querySelectorAll('form').forEach(function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); });
  });
})();

// ---------- Магазин: меню, кошик-шторка, фільтри, підбір розміру, оформлення ----------
(function () {
  var fmt = function (n) { return n.toLocaleString('uk-UA').replace(/ |,/g, ' ') + ' ₴'; };
  var body = document.body;

  function makeDrawer(cls, html) {
    var d = document.createElement('div');
    d.className = 'drawer ' + cls;
    d.innerHTML = '<button class="drawer__scrim" type="button" tabindex="-1" aria-label="Закрити"></button>' +
      '<div class="drawer__panel" role="dialog" aria-modal="true">' + html + '</div>';
    body.appendChild(d);
    var lastFocus = null;
    d.open = function () {
      lastFocus = document.activeElement;
      d.classList.add('is-open'); body.classList.add('no-scroll');
      var f = d.querySelector('[data-close]'); if (f) f.focus();
    };
    d.close = function () {
      d.classList.remove('is-open'); body.classList.remove('no-scroll');
      if (lastFocus) lastFocus.focus();
    };
    d.addEventListener('click', function (e) {
      if (e.target.closest('.drawer__scrim, [data-close]')) d.close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && d.classList.contains('is-open')) d.close();
    });
    return d;
  }
  var closeIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';

  // Мобільне меню
  var menu = makeDrawer('drawer--left',
    '<div class="drawer__head"><span class="logo">Терикон</span><button class="icon-btn" type="button" data-close aria-label="Закрити меню">' + closeIcon + '</button></div>' +
    '<div class="drawer__body"><nav aria-label="Меню"><ul class="mobile-nav">' +
    '<li><a href="index.html#drop">Новинки</a></li><li><a href="catalog.html">Каталог</a></li>' +
    '<li><a href="product.html#sizes">Розміри</a></li><li><a href="cart.html">Доставка</a></li>' +
    '<li><a href="index.html#how">Що таке дроп</a></li></ul></nav>' +
    '<div class="mobile-contacts"><span>Telegram @terykon_store</span><span>Instagram @terykon.ua</span><span>Шоурум у Кривому Розі, за записом</span></div></div>');
  menu.querySelector('.drawer__panel').setAttribute('aria-label', 'Меню');
  document.querySelectorAll('.burger').forEach(function (b) { b.addEventListener('click', menu.open); });
  menu.querySelectorAll('.mobile-nav a').forEach(function (a) { a.addEventListener('click', menu.close); });

  // Кошик-шторка
  var items = [
    { name: 'Худі оверсайз', meta: 'Чорне · M', price: 2400, img: 'img/p-hoodie-front.webp' },
    { name: 'Штани карго', meta: 'Чорні · L', price: 2900, img: 'img/p-cargo.webp' }
  ];
  var cart = makeDrawer('',
    '<div class="drawer__head"><h2 class="display">Кошик</h2><button class="icon-btn" type="button" data-close aria-label="Закрити кошик">' + closeIcon + '</button></div>' +
    '<div class="drawer__body"><p class="drawer__note"><i></i><span data-cart-msg>Додано в кошик</span></p><div class="mini-items" data-cart-items></div></div>' +
    '<div class="drawer__foot"><div class="drawer__sum"><span>Разом, без доставки</span><b data-cart-total></b></div>' +
    '<a class="btn btn--block" href="cart.html">Оформити замовлення</a>' +
    '<button class="btn btn--ghost btn--block" type="button" data-close>Продовжити покупки</button></div>');
  cart.querySelector('.drawer__panel').setAttribute('aria-label', 'Кошик');
  function renderCart(newIndex) {
    var list = cart.querySelector('[data-cart-items]');
    list.innerHTML = '';
    items.forEach(function (it, i) {
      var row = document.createElement('div');
      row.className = 'mini-item' + (i === newIndex ? ' is-new' : '');
      row.innerHTML = '<img alt=""><span><b></b><small></small></span><em></em>';
      row.querySelector('img').src = it.img;
      row.querySelector('b').textContent = it.name;
      row.querySelector('small').textContent = it.meta;
      row.querySelector('em').textContent = fmt(it.price);
      list.appendChild(row);
    });
    cart.querySelector('[data-cart-total]').textContent = fmt(items.reduce(function (s, it) { return s + it.price; }, 0));
    document.querySelectorAll('.header .badge').forEach(function (b) {
      b.textContent = items.length;
      b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
      var link = b.closest('a'); if (link) link.setAttribute('aria-label', 'Кошик, ' + items.length + ' речі');
    });
  }
  document.querySelectorAll('[data-add-to-cart]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var size = document.querySelector('[data-sizes] [aria-pressed="true"]');
      var color = document.querySelector('.swatches [aria-pressed="true"]');
      var colorName = color ? color.getAttribute('aria-label') : btn.dataset.color;
      if (/^Худі/.test(btn.dataset.name)) colorName = colorName.replace(/ий$/, 'е');
      var meta = colorName + ' · ' + (size ? size.dataset.size : 'M');
      items.push({ name: btn.dataset.name, meta: meta, price: Number(btn.dataset.price), img: btn.dataset.img });
      cart.querySelector('[data-cart-msg]').textContent = btn.dataset.name + ', ' + (size ? size.dataset.size : 'M') + ' — у кошику';
      renderCart(items.length - 1);
      cart.open();
    });
  });

  // Фільтри каталогу
  var filters = document.querySelector('[data-filters]');
  var catalog = document.querySelector('[data-catalog]');
  if (filters && catalog) {
    var cards = Array.prototype.slice.call(catalog.querySelectorAll('.card'));
    var countEl = document.querySelector('[data-filter-count]');
    var emptyEl = document.querySelector('[data-filter-empty]');
    var values = function (name) {
      return Array.prototype.map.call(filters.querySelectorAll('input[name="' + name + '"]:checked'), function (i) { return i.value; });
    };
    var apply = function () {
      var cats = values('cat'), colors = values('color');
      var sizes = Array.prototype.map.call(filters.querySelectorAll('[data-size-filter] [aria-pressed="true"]'), function (b) { return b.textContent.trim(); });
      var onlyStock = filters.querySelector('input[name="instock"]').checked;
      var shown = 0;
      cards.forEach(function (c) {
        var have = (c.dataset.sizes || '').split(' ').filter(Boolean);
        var ok = (!cats.length || cats.indexOf(c.dataset.cat) > -1) &&
          (!colors.length || colors.indexOf(c.dataset.color) > -1) &&
          (!sizes.length || sizes.some(function (s) { return have.indexOf(s) > -1; })) &&
          (!onlyStock || c.dataset.instock === '1');
        c.hidden = !ok;
        if (ok) shown++;
      });
      countEl.textContent = 'Показано ' + shown + ' з ' + cards.length;
      emptyEl.hidden = shown > 0;
      catalog.hidden = shown === 0;
    };
    filters.addEventListener('change', apply);
    filters.querySelector('[data-size-filter]').addEventListener('pick', apply);
    document.querySelectorAll('[data-filter-reset]').forEach(function (b) {
      b.addEventListener('click', function () {
        filters.querySelectorAll('input').forEach(function (i) { i.checked = false; });
        filters.querySelectorAll('[data-size-filter] [aria-pressed]').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        apply();
      });
    });
  }

  // Підбір розміру
  var fit = document.getElementById('fit');
  if (fit) {
    var order = ['S', 'M', 'L', 'XL', 'XXL'];
    var notes = { '-1': 'Сидітиме ближче до тіла, без зайвого об’єму.', '0': 'Сидить вільно, як на моделі на фото.', '1': 'Максимальний оверсайз: довші рукави, ширше плече.' };
    var hEl = fit.querySelector('#fit-h'), wEl = fit.querySelector('#fit-w');
    var sizeEl = fit.querySelector('[data-fit-size]'), noteEl = fit.querySelector('[data-fit-note]'), applyBtn = fit.querySelector('[data-fit-apply]');
    var pick = function () {
      var h = Number(hEl.value) || 178, w = Number(wEl.value) || 72;
      var i = h < 172 ? 0 : h < 179 ? 1 : h < 185 ? 2 : h < 191 ? 3 : 4;
      var bmi = w / Math.pow(h / 100, 2);
      if (bmi > 27) i++;
      var pref = fit.querySelector('[data-fit-pref] [aria-pressed="true"]');
      i += Number(pref ? pref.dataset.pref : 0);
      i = Math.max(0, Math.min(order.length - 1, i));
      var s = order[i];
      var btn = document.querySelector('[data-sizes] [data-size="' + s + '"]');
      sizeEl.textContent = s;
      var p = pref ? pref.dataset.pref : '0';
      if (btn && btn.disabled) {
        noteEl.textContent = notes[p] + ' Зараз ' + s + ' немає, можемо повідомити, коли з’явиться.';
        applyBtn.textContent = 'Повідомити, коли з’явиться ' + s;
      } else {
        noteEl.textContent = notes[p];
        applyBtn.textContent = 'Обрати ' + s;
      }
      return { s: s, btn: btn };
    };
    document.querySelectorAll('[data-open-fit]').forEach(function (b) {
      b.addEventListener('click', function () { pick(); fit.showModal(); });
    });
    [hEl, wEl].forEach(function (el) { el.addEventListener('input', pick); });
    fit.querySelector('[data-fit-pref]').addEventListener('pick', pick);
    applyBtn.addEventListener('click', function () {
      var r = pick();
      if (r.btn && !r.btn.disabled) r.btn.click();
      fit.close();
    });
    fit.addEventListener('click', function (e) { if (e.target === fit) fit.close(); });
  }

  // Оформлення: показуємо сторінку подяки
  var checkout = document.querySelector('[data-checkout]');
  if (checkout) checkout.addEventListener('submit', function () { location.href = 'thanks.html'; });
})();

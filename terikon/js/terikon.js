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

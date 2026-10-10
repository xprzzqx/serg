/* SushiMax — redesign concept. No build step, no dependencies. */
(() => {
  'use strict';

  // ---------- Config ----------
  const CITIES = {
    kolin: {
      name: 'Kolín', street: 'Karlovo náměstí 72', zip: '280 02 Kolín',
      phone: '+420721479332', phoneTxt: '721 479 332',
      ig: 'https://www.instagram.com/sushimax_Kolin.cz/',
      fb: 'https://www.facebook.com/profile.php?id=100064335685391',
      map: 'https://www.google.com/maps/search/?api=1&query=Karlovo+n%C3%A1m%C4%9Bst%C3%AD+72+Kol%C3%ADn',
      open: 10, close: 22,
      upsell: ['Unagi omáčka', 'Sriracha Chilli omáčka', 'Sweet chilli omáčka', 'Japonská majonéza', 'Ořechová omáčka'],
    },
    jihlava: {
      name: 'Jihlava', street: 'Úzká 635/1', zip: '586 01 Jihlava',
      phone: '+420777499970', phoneTxt: '777 499 970', email: 'sushi.max.cz@gmail.com',
      ig: 'https://www.instagram.com/sushimax_jihlava.cz/',
      fb: 'https://www.facebook.com/p/SushiMax-Jihlava-61571150205641/',
      map: 'https://www.google.com/maps/search/?api=1&query=%C3%9Azk%C3%A1+635%2F1+Jihlava',
      open: 10, close: 22,
      upsell: ['Zázvor', 'Spicy omáčka', 'Ořechová omáčka', 'Coca Cola 0,33', 'Voda limon 0.25l', 'Red bull'],
    },
  };
  // Sets shown in the "Sety" row (those missing in a city are skipped) and the hero card.
  const FEATURED = ['Set Takajama', 'Set Sakura', 'Blossom set', 'Philadelphia Set', 'VIP Set', 'Banzai', 'Set Mini', 'Vega Set', 'Futomaki 1+1', 'Maxx Set'];
  const SEAL = 'Set Takajama';
  // DEMO: real best-sellers must come from the owner (Poster sales report).
  const HITS = ['Set Sakura', 'Set Takajama', 'Philadelphia light', 'Fudžijama', 'Dark Tai', 'Maki s lososem'];

  const GROUPS = [
    ['sushi', ['sety', 'vip', 'philadelphia', 'kalifornia', 'rolky', 'futomaki', 'maki', 'teple', 'sushi']],
    ['kitchen', ['snidane', 'obed', 'hlavni', 'grill', 'bowl', 'testoviny', 'fastfood', 'polevky', 'salaty', 'predkrmy', 'prilohy']],
    ['sweet', ['dezerty', 'napoje-teple', 'napoje', 'koktejly', 'pivo']],
  ];
  const DRINKS = new Set(['napoje-teple', 'napoje', 'koktejly', 'pivo']);

  // ---------- Texts ----------
  const T = {
    cs: {
      skip: 'Přeskočit na menu', navSets: 'Sety', navMenu: 'Menu', navDelivery: 'Doprava', navContact: 'Kontakt',
      heroTitle: 'Umění sushi <em>doručené až domů</em>',
      heroLead: 'Ryba je čerstvá každý den, nikdy mražená. Rolky připravujeme až po objednávce a po městě je vozíme zdarma.',
      heroCta: 'Objednat', fact1: 'minut k vám', fact2: 'doprava po městě', fact3: 'každý den',
      openTill: 'Otevřeno do {t}', closedTill: 'Zavřeno · otevíráme {d} v {t}', today: 'dnes', tomorrow: 'zítra',
      setsLabel: 'Sety', setsTitle: 'Sety pro dva <em>i pro celou oslavu</em>',
      setsLead: 'U každého setu vidíte počet kousků, váhu a cenu za kus. Sety se tak dají rovnou porovnat.',
      sealLabel: 'Set týdne',
      lunchLabel: 'Obědy', lunchTitle: 'Polední menu <em>od 150&nbsp;Kč</em>', lunchLead: 'Teplé jídlo na oběd s dovozem do kanceláře i domů.',
      menuLabel: 'Menu', menuTitle: 'Menu', searchPh: 'Hledat: losos, úhoř, avokádo…', empty: 'Nic jsme nenašli. Zkuste jiné slovo.',
      gSushi: 'Sushi', gKitchen: 'Kuchyně', gSweet: 'Dezerty a nápoje',
      howLabel: 'Doprava', howTitle: 'Tři kroky <em>k večeři</em>', howLead: 'Po městě vozíme zdarma. Platit můžete kartou Visa nebo Mastercard.',
      how1t: 'Vyberte pobočku', how1: 'Kolín nebo Jihlava. Každá kuchyně má vlastní menu a ceny.',
      how2t: 'Složte objednávku', how2: 'Bez registrace. Stačí jméno, telefon a adresa.',
      how3t: 'Kurýr je u vás', how3: 'Do 45 minut. Když máme zavřeno, objednávku přijmeme na další den.',
      placesLabel: 'Kontakt', placesTitle: 'Dvě kuchyně, <em>jeden rukopis</em>', yourCity: 'Vaše pobočka',
      hours: 'Po–Ne {o}:00–{c}:00', route: 'Navigovat',
      allergTitle: 'Seznam alergenů · nařízení EU 1169/2011', allergNote: 'Alergeny v konkrétním jídle vám řekneme po telefonu.',
      footNote: 'Koncept redesignu SushiMax. Neoficiální web: objednávky se nikam neodesílají. Menu, ceny a fotografie ze sushimax.cz, říjen 2026.',
      footRazbor: 'Rozbor současného webu', toCart: 'Košík',
      cityTitle: 'Kam vám <em>sushi přivezeme?</em>', cityLead: 'Menu a ceny se liší podle pobočky. Město můžete kdykoli změnit nahoře.',
      cart: 'Košík', emptyCart: 'Košík je prázdný', emptyCartLead: 'Začněte setem, ať se máte o co dělit.', openMenu: 'Otevřít menu',
      add: 'Přidat', added: 'Přidáno: {n}', pcs: 'ks', perPc: '{p} za kus', rolls: '{n} druhů rolí',
      hit: 'Hit', new: 'Novinka',
      upsell: 'K sushi se hodí', subtotal: 'Mezisoučet', delivery: 'Doprava', free: 'zdarma po městě', total: 'Celkem',
      checkout: 'Doručení', name: 'Jméno', phone: 'Telefon', address: 'Ulice a číslo domu, město', note: 'Poznámka pro kurýra',
      when: 'Kdy doručit', asap: 'Co nejdřív · do 45 min', atTime: 'Na čas', slot: 'Čas doručení',
      closedNotice: 'Teď máme zavřeno. Objednávku přijmeme a doručíme {d} v čase, který vyberete.',
      pay: 'Platba kartou Visa nebo Mastercard kurýrovi.', order: 'Objednat za {s}', preorder: 'Předobjednat na {d} {t}',
      doneTitle: 'Děkujeme!', doneAsap: 'Kurýr dorazí do 45 minut.', doneAt: 'Doručíme {d} v {t}.',
      doneDemo: 'Tohle je koncept webu, objednávka se nikam neodeslala.', backToMenu: 'Zpět do menu',
      lastOrder: 'Minulá objednávka', repeat: 'Zopakovat', repeated: 'Minulá objednávka je v košíku',
      items: ['položka', 'položky', 'položek'], close: 'Zavřít',
      allergens: ['Obiloviny s lepkem', 'Korýši', 'Vejce', 'Ryby', 'Arašídy', 'Sója', 'Mléko', 'Skořápkové plody', 'Celer', 'Hořčice', 'Sezam', 'Oxid siřičitý a siřičitany', 'Vlčí bob (lupina)', 'Měkkýši'],
      cats: { sety: 'Sety', vip: 'VIP rolky', philadelphia: 'Philadelphia', kalifornia: 'Kalifornia', rolky: 'Klasické rolky', futomaki: 'Futomaki', maki: 'Maki', teple: 'Teplé rolky', sushi: 'Sushi a gunkany', snidane: 'Snídaně', obed: 'Obědy', hlavni: 'Hlavní jídla', grill: 'Gril a omáčky', bowl: 'Bowly a nudle', testoviny: 'Těstoviny a palačinky', fastfood: 'Fast food', polevky: 'Polévky', salaty: 'Saláty', predkrmy: 'Předkrmy a omáčky', prilohy: 'Přílohy', dezerty: 'Dezerty', 'napoje-teple': 'Teplé nápoje', napoje: 'Studené nápoje', koktejly: 'Koktejly', pivo: 'Pivo a snacky' },
    },
    uk: {
      skip: 'Перейти до меню', navSets: 'Сети', navMenu: 'Меню', navDelivery: 'Доставка', navContact: 'Контакти',
      heroTitle: 'Мистецтво суші <em>з доставкою додому</em>',
      heroLead: 'Риба свіжа щодня, ніколи не заморожена. Роли готуємо лише після замовлення, по місту доставляємо безкоштовно.',
      heroCta: 'Замовити', fact1: 'хвилин до вас', fact2: 'доставка по місту', fact3: 'щодня',
      openTill: 'Відчинено до {t}', closedTill: 'Зачинено · відчиняємось {d} о {t}', today: 'сьогодні', tomorrow: 'завтра',
      setsLabel: 'Сети', setsTitle: 'Сети на двох <em>і на цілу вечірку</em>',
      setsLead: 'Біля кожного сету видно кількість шматочків, вагу та ціну за шматочок. Їх легко порівняти.',
      sealLabel: 'Сет тижня',
      lunchLabel: 'Обіди', lunchTitle: 'Обіднє меню <em>від 150&nbsp;Kč</em>', lunchLead: 'Гаряча їжа на обід з доставкою в офіс чи додому.',
      menuLabel: 'Меню', menuTitle: 'Меню', searchPh: 'Пошук: лосось, вугор, авокадо…', empty: 'Нічого не знайшли. Спробуйте інше слово.',
      gSushi: 'Суші', gKitchen: 'Кухня', gSweet: 'Десерти та напої',
      howLabel: 'Доставка', howTitle: 'Три кроки <em>до вечері</em>', howLead: 'По місту доставляємо безкоштовно. Оплата карткою Visa або Mastercard.',
      how1t: 'Оберіть філію', how1: 'Колін або Їглава. У кожної кухні своє меню та ціни.',
      how2t: 'Зберіть замовлення', how2: 'Без реєстрації. Потрібні лише ім’я, телефон і адреса.',
      how3t: 'Кур’єр у вас', how3: 'До 45 хвилин. Коли ми зачинені, приймемо замовлення на наступний день.',
      placesLabel: 'Контакти', placesTitle: 'Дві кухні, <em>один почерк</em>', yourCity: 'Ваша філія',
      hours: 'Пн–Нд {o}:00–{c}:00', route: 'Маршрут',
      allergTitle: 'Список алергенів · регламент ЄС 1169/2011', allergNote: 'Алергени в конкретній страві підкажемо телефоном.',
      footNote: 'Концепт редизайну SushiMax. Неофіційний сайт: замовлення нікуди не надсилаються. Меню, ціни та фото з sushimax.cz, жовтень 2026.',
      footRazbor: 'Розбір поточного сайту', toCart: 'Кошик',
      cityTitle: 'Куди привезти <em>ваші суші?</em>', cityLead: 'Меню та ціни залежать від філії. Місто можна змінити будь-коли вгорі.',
      cart: 'Кошик', emptyCart: 'Кошик порожній', emptyCartLead: 'Почніть із сету, щоб було чим поділитися.', openMenu: 'Відкрити меню',
      add: 'Додати', added: 'Додано: {n}', pcs: 'шт', perPc: '{p} за шт', rolls: '{n} видів ролів',
      hit: 'Хіт', new: 'Новинка',
      upsell: 'До суші пасує', subtotal: 'Проміжна сума', delivery: 'Доставка', free: 'безкоштовно по місту', total: 'Разом',
      checkout: 'Доставка', name: 'Ім’я', phone: 'Телефон', address: 'Вулиця, будинок, місто', note: 'Коментар для кур’єра',
      when: 'Коли доставити', asap: 'Якнайшвидше · до 45 хв', atTime: 'На час', slot: 'Час доставки',
      closedNotice: 'Зараз ми зачинені. Приймемо замовлення й доставимо {d} в обраний час.',
      pay: 'Оплата карткою Visa або Mastercard кур’єру.', order: 'Замовити за {s}', preorder: 'Передзамовити на {d} {t}',
      doneTitle: 'Дякуємо!', doneAsap: 'Кур’єр приїде до 45 хвилин.', doneAt: 'Доставимо {d} о {t}.',
      doneDemo: 'Це концепт сайту, замовлення нікуди не надіслано.', backToMenu: 'Назад до меню',
      lastOrder: 'Минуле замовлення', repeat: 'Повторити', repeated: 'Минуле замовлення вже в кошику',
      items: ['позиція', 'позиції', 'позицій'], close: 'Закрити',
      allergens: ['Злаки з глютеном', 'Ракоподібні', 'Яйця', 'Риба', 'Арахіс', 'Соя', 'Молоко', 'Горіхи', 'Селера', 'Гірчиця', 'Кунжут', 'Діоксид сірки та сульфіти', 'Люпин', 'Молюски'],
      cats: { sety: 'Сети', vip: 'VIP роли', philadelphia: 'Філадельфія', kalifornia: 'Каліфорнія', rolky: 'Класичні роли', futomaki: 'Футомакі', maki: 'Макі', teple: 'Теплі роли', sushi: 'Суші та гункани', snidane: 'Сніданки', obed: 'Обіди', hlavni: 'Основні страви', grill: 'Гриль і соуси', bowl: 'Боули та локшина', testoviny: 'Паста та млинці', fastfood: 'Фастфуд', polevky: 'Супи', salaty: 'Салати', predkrmy: 'Закуски та соуси', prilohy: 'Гарніри', dezerty: 'Десерти', 'napoje-teple': 'Гарячі напої', napoje: 'Холодні напої', koktejly: 'Коктейлі', pivo: 'Пиво та снеки' },
    },
    en: {
      skip: 'Skip to menu', navSets: 'Sets', navMenu: 'Menu', navDelivery: 'Delivery', navContact: 'Contact',
      heroTitle: 'The art of sushi, <em>delivered home</em>',
      heroLead: 'Fish is fresh every day, never frozen. We roll after you order and deliver free anywhere in town.',
      heroCta: 'Order now', fact1: 'minutes to you', fact2: 'delivery in town', fact3: 'every day',
      openTill: 'Open until {t}', closedTill: 'Closed · we open {d} at {t}', today: 'today', tomorrow: 'tomorrow',
      setsLabel: 'Sets', setsTitle: 'Sets for two <em>or the whole party</em>',
      setsLead: 'Every set shows the piece count, weight and price per piece, so they are easy to compare.',
      sealLabel: 'Set of the week',
      lunchLabel: 'Lunch', lunchTitle: 'Lunch menu <em>from 150&nbsp;CZK</em>', lunchLead: 'A hot lunch delivered to your office or home.',
      menuLabel: 'Menu', menuTitle: 'Menu', searchPh: 'Search: salmon, eel, avocado…', empty: 'Nothing found. Try another word.',
      gSushi: 'Sushi', gKitchen: 'Kitchen', gSweet: 'Desserts & drinks',
      howLabel: 'Delivery', howTitle: 'Three steps <em>to dinner</em>', howLead: 'Free delivery in town. Pay by Visa or Mastercard.',
      how1t: 'Pick a kitchen', how1: 'Kolín or Jihlava. Each has its own menu and prices.',
      how2t: 'Build your order', how2: 'No sign-up. Just a name, phone and address.',
      how3t: 'The courier arrives', how3: 'Within 45 minutes. When we are closed, we take orders for the next day.',
      placesLabel: 'Contact', placesTitle: 'Two kitchens, <em>one signature</em>', yourCity: 'Your kitchen',
      hours: 'Mon–Sun {o}:00–{c}:00', route: 'Directions',
      allergTitle: 'Allergen list · EU regulation 1169/2011', allergNote: 'Ask us by phone about allergens in a specific dish.',
      footNote: 'SushiMax redesign concept. Unofficial site: no orders are sent anywhere. Menu, prices and photos from sushimax.cz, October 2026.',
      footRazbor: 'Review of the current site', toCart: 'Cart',
      cityTitle: 'Where should we <em>bring your sushi?</em>', cityLead: 'Menu and prices depend on the kitchen. You can switch city at the top any time.',
      cart: 'Cart', emptyCart: 'Your cart is empty', emptyCartLead: 'Start with a set, there is always someone to share with.', openMenu: 'Open the menu',
      add: 'Add', added: 'Added: {n}', pcs: 'pcs', perPc: '{p} per piece', rolls: '{n} kinds of rolls',
      hit: 'Best seller', new: 'New',
      upsell: 'Goes well with sushi', subtotal: 'Subtotal', delivery: 'Delivery', free: 'free in town', total: 'Total',
      checkout: 'Delivery', name: 'Name', phone: 'Phone', address: 'Street, house number, town', note: 'Note for the courier',
      when: 'When', asap: 'As soon as possible · 45 min', atTime: 'At a set time', slot: 'Delivery time',
      closedNotice: 'We are closed right now. We will take your order and deliver it {d} at the time you choose.',
      pay: 'Pay the courier by Visa or Mastercard.', order: 'Order for {s}', preorder: 'Pre-order for {d} {t}',
      doneTitle: 'Thank you!', doneAsap: 'The courier will arrive within 45 minutes.', doneAt: 'We will deliver {d} at {t}.',
      doneDemo: 'This is a website concept, the order was not sent anywhere.', backToMenu: 'Back to menu',
      lastOrder: 'Last order', repeat: 'Repeat', repeated: 'Your last order is in the cart',
      items: ['item', 'items', 'items'], close: 'Close',
      allergens: ['Cereals with gluten', 'Crustaceans', 'Eggs', 'Fish', 'Peanuts', 'Soy', 'Milk', 'Tree nuts', 'Celery', 'Mustard', 'Sesame', 'Sulphur dioxide and sulphites', 'Lupin', 'Molluscs'],
      cats: { sety: 'Sets', vip: 'VIP rolls', philadelphia: 'Philadelphia', kalifornia: 'California', rolky: 'Classic rolls', futomaki: 'Futomaki', maki: 'Maki', teple: 'Baked & warm rolls', sushi: 'Nigiri & gunkan', snidane: 'Breakfast', obed: 'Lunch', hlavni: 'Mains', grill: 'Grill & sauces', bowl: 'Bowls & noodles', testoviny: 'Pasta & pancakes', fastfood: 'Fast food', polevky: 'Soups', salaty: 'Salads', predkrmy: 'Starters & sauces', prilohy: 'Sides', dezerty: 'Desserts', 'napoje-teple': 'Hot drinks', napoje: 'Soft drinks', koktejly: 'Cocktails', pivo: 'Beer & snacks' },
    },
  };

  // ---------- Storage (may be unavailable) ----------
  const store = {
    get(k, def) { try { const v = localStorage.getItem('sm.' + k); return v ? JSON.parse(v) : def; } catch { return def; } },
    set(k, v) { try { localStorage.setItem('sm.' + k, JSON.stringify(v)); } catch { /* private mode */ } },
  };

  // ---------- State ----------
  const S = {
    lang: store.get('lang', (navigator.language || '').startsWith('uk') ? 'uk' : 'cs'),
    city: store.get('city', null),
    carts: store.get('carts', { kolin: {}, jihlava: {} }),
    last: store.get('last', {}),
    query: '',
    view: 'cart', // cart | done
    done: null,
  };
  if (!T[S.lang]) S.lang = 'cs';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const t = (k, vars) => {
    let s = T[S.lang][k] ?? T.cs[k] ?? k;
    if (vars) for (const [a, b] of Object.entries(vars)) s = s.replace('{' + a + '}', b);
    return s;
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const kc = (n) => n.toLocaleString('cs-CZ') + ' Kč';
  const plural = (n) => { const f = t('items'); if (S.lang === 'en') return n === 1 ? f[0] : f[1]; const m10 = n % 10, m100 = n % 100; if (S.lang === 'uk') return m10 === 1 && m100 !== 11 ? f[0] : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? f[1] : f[2]; return n === 1 ? f[0] : n >= 2 && n <= 4 ? f[1] : f[2]; };
  const fold = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const icon = (id) => `<svg><use href="#${id}"/></svg>`;
  const src = (img) => (/^https?:/.test(img) ? img : window.SM_IMG + img);

  // ---------- Data ----------
  const menu = () => window.SM_MENU[S.city] || [];
  const byId = () => { const m = new Map(); for (const i of menu()) m.set(i.id, i); return m; };
  let ITEMS = new Map();
  const findByName = (n) => menu().find((i) => i.n.toLowerCase() === n.toLowerCase());
  const isHit = (i) => HITS.some((h) => h.toLowerCase() === i.n.toLowerCase());
  const cart = () => (S.carts[S.city] ||= {});
  const cartCount = () => Object.values(cart()).reduce((a, b) => a + b, 0);
  const cartSum = () => Object.entries(cart()).reduce((a, [id, q]) => a + (ITEMS.get(+id)?.p || 0) * q, 0);
  const meta = (i, withPpk) => {
    const parts = [];
    if (i.k) parts.push(i.k + ' ' + t('pcs'));
    if (i.w) parts.push(i.w + (DRINKS.has(i.c) ? ' ml' : ' g'));
    if (withPpk && i.k > 1) parts.push(t('perPc', { p: kc(Math.round(i.p / i.k)) }));
    return parts.join(' · ');
  };
  const tags = (i) => {
    const out = [];
    if (isHit(i)) out.push(`<span class="tag tag--hit">${t('hit')}</span>`);
    if (i.nw) out.push(`<span class="tag tag--new">${t('new')}</span>`);
    return out.length ? `<span class="tags">${out.join('')}</span>` : '';
  };
  const buy = (i) => {
    const q = cart()[i.id] || 0;
    if (!q) return `<button class="add" type="button" data-add="${i.id}" aria-label="${esc(t('add'))}: ${esc(i.n)}">${icon('i-plus')}</button>`;
    return `<span class="step"><button type="button" data-dec="${i.id}" aria-label="−">${icon('i-minus')}</button><b>${q}</b><button type="button" data-add="${i.id}" aria-label="+">${icon('i-plus')}</button></span>`;
  };

  // ---------- Time (Europe/Prague) ----------
  function pragueNow() {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Prague', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    return { h: +p.hour, m: +p.minute };
  }
  function openState() {
    const c = CITIES[S.city]; const { h, m } = pragueNow(); const mins = h * 60 + m;
    const open = mins >= c.open * 60 && mins < c.close * 60;
    return { open, nextDay: mins >= c.close * 60 ? 'tomorrow' : 'today' };
  }
  function slots() {
    const c = CITIES[S.city]; const st = openState(); const { h, m } = pragueNow();
    const out = []; const from = st.open ? h * 60 + m + 60 : c.open * 60 + 30;
    for (let x = Math.ceil(from / 30) * 30; x <= (c.close * 60) - 30; x += 30) out.push(`${Math.floor(x / 60)}:${String(x % 60).padStart(2, '0')}`);
    return { day: st.open ? 'today' : st.nextDay, list: out };
  }

  // ---------- Rendering: static texts ----------
  function applyTexts() {
    document.documentElement.lang = S.lang;
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === S.lang)));
    $$('[data-close]').forEach((b) => b.setAttribute('aria-label', t('close')));
    $('#allergens').innerHTML = t('allergens').map((a) => `<li><b>${esc(a)}</b></li>`).join('');
  }

  function renderStatus() {
    const c = CITIES[S.city]; const st = openState(); const el = $('#status');
    el.classList.toggle('is-closed', !st.open);
    $('span', el).textContent = st.open ? t('openTill', { t: c.close + ':00' }) : t('closedTill', { d: t(st.nextDay), t: c.open + ':00' });
  }

  function renderCity() {
    const c = CITIES[S.city];
    $('#cityBtnName').textContent = c.name;
    $('#menuCity').textContent = c.name;
    $('#cartCity').textContent = c.name;
    const call = $('#heroCall'); call.href = 'tel:' + c.phone; $('span', call).textContent = c.phoneTxt;
    $('#obedy').hidden = !menu().some((i) => i.c === 'obed');
    renderStatus();
  }

  function renderSeal() {
    const i = findByName(SEAL); const el = $('#heroSeal');
    if (!i) { el.hidden = true; return; }
    el.hidden = false;
    el.innerHTML = `<img src="${src(i.img)}" alt="" width="68" height="68"><span><small>${t('sealLabel')}</small><b>${esc(i.n)}</b><i>${i.k ? i.k + ' ' + t('pcs') + ' · ' : ''}${kc(i.p)}</i></span>`;
    el.onclick = (e) => { e.preventDefault(); openProduct(i.id); };
  }

  function renderSets() {
    const sets = FEATURED.map(findByName).filter(Boolean);
    $('#setsRow').innerHTML = sets.map((i) => `
      <article class="set">
        <button class="set__pic" type="button" data-open="${i.id}" aria-label="${esc(i.n)}">
          <img src="${src(i.img)}" alt="" loading="lazy" width="800" height="600">${tags(i)}
        </button>
        <div class="set__body">
          <h3>${esc(i.n)}</h3>
          <div class="set__meta">${meta(i)}${i.r ? ' · ' + t('rolls', { n: i.r.length }) : ''}</div>
          ${i.k > 1 ? `<div class="ppk">${t('perPc', { p: `<b>${kc(Math.round(i.p / i.k))}</b>` })}</div>` : ''}
          <div class="set__foot"><span class="price">${kc(i.p)}</span><span data-buy="${i.id}">${buy(i)}</span></div>
        </div>
      </article>`).join('');
  }

  function renderLunch() {
    const items = menu().filter((i) => i.c === 'obed');
    $('#lunchList').innerHTML = items.map((i) => `
      <div class="mini">
        <img src="${src(i.img)}" alt="" loading="lazy" width="70" height="70">
        <div><div class="mini__name">${esc(i.n)}</div>
        <div class="mini__row"><span class="price">${kc(i.p)}</span><span data-buy="${i.id}">${buy(i)}</span></div></div>
      </div>`).join('');
  }

  function itemCard(i, q) {
    const hl = (s) => (q ? esc(s).replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'), '<mark>$1</mark>') : esc(s));
    const desc = i.d || (i.r ? i.r.join(', ') : '');
    return `<article class="item">
      <button class="item__pic" type="button" data-open="${i.id}" aria-label="${esc(i.n)}"><img src="${src(i.img)}" alt="" loading="lazy" width="800" height="600">${tags(i)}</button>
      <div class="item__txt">
        <button class="item__name" type="button" data-open="${i.id}">${hl(i.n)}</button>
        ${desc ? `<p class="item__desc">${hl(desc)}</p>` : ''}
        <div class="item__foot"><span class="price">${kc(i.p)}${meta(i) ? `<span class="item__meta">${meta(i)}</span>` : ''}</span><span data-buy="${i.id}">${buy(i)}</span></div>
      </div>
    </article>`;
  }

  function renderMenu() {
    const q = S.query.trim(); const fq = fold(q);
    const items = q ? menu().filter((i) => fold(i.n + ' ' + (i.d || '') + ' ' + (i.r || []).join(' ')).includes(fq)) : menu();
    const byCat = new Map();
    for (const i of items) { if (!byCat.has(i.c)) byCat.set(i.c, []); byCat.get(i.c).push(i); }
    let html = ''; let tabs = '';
    GROUPS.forEach(([g, cats], gi) => {
      const present = cats.filter((c) => byCat.has(c));
      if (!present.length) return;
      if (tabs) tabs += '<span class="tab-sep" aria-hidden="true"></span>';
      html += `<div class="group-title"><span class="label">${t(g === 'sushi' ? 'gSushi' : g === 'kitchen' ? 'gKitchen' : 'gSweet')}</span></div>`;
      for (const c of present) {
        const list = byCat.get(c);
        tabs += `<a class="tab" href="#c-${c}" data-tab="${c}">${t('cats')[c]}</a>`;
        html += `<section class="cat" id="c-${c}"><div class="cat__head"><h3>${t('cats')[c]}</h3><span>${list.length}</span></div><div class="grid">${list.map((i) => itemCard(i, q)).join('')}</div></section>`;
      }
      void gi;
    });
    $('#menuBody').innerHTML = html;
    $('#tabsIn').innerHTML = tabs;
    $('#menuEmpty').hidden = items.length > 0;
    spy();
  }

  // Highlight the tab of the category currently on screen.
  let observer;
  function spy() {
    observer?.disconnect();
    const tabs = new Map($$('#tabsIn .tab').map((a) => [a.dataset.tab, a]));
    const visible = new Set();
    observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)));
      const first = $$('#menuBody .cat').find((s) => visible.has(s.id));
      if (!first) return;
      tabs.forEach((a, c) => a.setAttribute('aria-current', String('c-' + c === first.id)));
      const a = tabs.get(first.id.slice(2));
      if (a) { const box = $('#tabsIn'); box.scrollTo({ left: a.offsetLeft - box.clientWidth / 2 + a.clientWidth / 2, behavior: 'smooth' }); }
    }, { rootMargin: '-140px 0px -55% 0px' });
    $$('#menuBody .cat').forEach((s) => observer.observe(s));
  }

  function renderPlaces() {
    $('#places').innerHTML = Object.entries(CITIES).map(([id, c]) => `
      <article class="place${id === S.city ? ' is-current' : ''}">
        ${id === S.city ? `<span class="place__flag tag tag--hit">${t('yourCity')}</span>` : ''}
        <span class="label">SushiMax</span>
        <h3>${c.name}</h3>
        <dl>
          <dt>${icon('i-pin')}</dt><dd>${c.street}<br>${c.zip}</dd>
          <dt>${icon('i-phone')}</dt><dd><a class="place__phone" href="tel:${c.phone}">${c.phoneTxt}</a>${c.email ? `<br><a href="mailto:${c.email}">${c.email}</a>` : ''}</dd>
          <dt>${icon('i-clock')}</dt><dd>${t('hours', { o: c.open, c: c.close })}</dd>
        </dl>
        <div class="place__links">
          <a class="chip" href="${c.map}" target="_blank" rel="noopener">${icon('i-arrow')}${t('route')}</a>
          <a class="chip" href="${c.ig}" target="_blank" rel="noopener">${icon('i-ig')}Instagram</a>
          <a class="chip" href="${c.fb}" target="_blank" rel="noopener">${icon('i-fb')}Facebook</a>
        </div>
      </article>`).join('');
  }

  function repeatBlock() {
    const l = S.last[S.city];
    if (!l) return '';
    const n = Object.values(l.items).reduce((a, b) => a + b, 0);
    const date = new Date(l.at).toLocaleDateString(S.lang === 'uk' ? 'uk-UA' : S.lang === 'en' ? 'en-GB' : 'cs-CZ', { day: 'numeric', month: 'numeric' });
    return `<div class="repeat"><p>${t('lastOrder')} · ${date}<br><b>${n} ${plural(n)} · ${kc(l.total)}</b></p><button type="button" data-repeat>${t('repeat')}</button></div>`;
  }

  // ---------- Cart ----------
  function renderCartButton() {
    const n = cartCount(); const s = cartSum();
    $('#cartBtnSum').textContent = kc(s);
    $('#cartBtnN').hidden = !n; $('#cartBtnN').textContent = n;
    $('#cartBar').hidden = !n;
    $('#cartBarN').textContent = `${n} ${plural(n)}`;
    $('#cartBarSum').textContent = kc(s);
  }

  function renderCart() {
    const body = $('#cartBody');
    if (S.view === 'done') {
      const d = S.done;
      body.innerHTML = `<div class="done"><img class="logo" src="img/logo@2x.webp" alt="">
        <h3>${t('doneTitle')}</h3>
        <p>${d.slot ? t('doneAt', { d: t(d.day), t: d.slot }) : t('doneAsap')}</p>
        <p>${t('doneDemo')}</p>
        <button class="btn btn--ghost" type="button" data-close-drawer>${t('backToMenu')}</button></div>`;
      return;
    }
    const lines = Object.entries(cart()).map(([id, q]) => [ITEMS.get(+id), q]).filter(([i]) => i);
    if (!lines.length) {
      body.innerHTML = `<div class="drawer__empty"><img class="logo" src="img/logo@2x.webp" alt="">
        <h3>${t('emptyCart')}</h3><p>${t('emptyCartLead')}</p>
        <a class="btn btn--primary" href="#menu" data-close-drawer>${t('openMenu')}</a>${repeatBlock()}</div>`;
      return;
    }
    const st = openState(); const sl = slots(); const sum = cartSum();
    const ups = CITIES[S.city].upsell.map(findByName).filter((i) => i && !cart()[i.id]);
    const prevWhen = $('#cartBody input[name=when]:checked')?.value;
    const when = !st.open ? 'time' : prevWhen || 'asap';
    body.innerHTML = `
      ${lines.map(([i, q]) => `<div class="line"><img src="${src(i.img)}" alt="" width="60" height="60">
        <div><div class="line__name">${esc(i.n)}</div><div class="line__price">${kc(i.p)}${q > 1 ? ' × ' + q : ''}</div></div>
        <span data-buy="${i.id}">${buy(i)}</span></div>`).join('')}
      ${ups.length ? `<div class="upsell"><span class="label">${t('upsell')}</span><div class="upsell__row">${ups.map((i) => `<button class="ups" type="button" data-add="${i.id}">${esc(i.n)} <i>${kc(i.p)}</i><b>${icon('i-plus')}</b></button>`).join('')}</div></div>` : ''}
      <div class="sum">
        <div><span>${t('subtotal')}</span><span>${kc(sum)}</span></div>
        <div><span>${t('delivery')}</span><span class="free">${t('free')}</span></div>
        <div class="sum__total"><span>${t('total')}</span><span>${kc(sum)}</span></div>
      </div>
      <form class="checkout" id="checkout" novalidate>
        <h3>${t('checkout')}</h3>
        ${!st.open ? `<p class="notice">${t('closedNotice', { d: t(sl.day) })}</p>` : ''}
        <label class="field">${t('name')}<input name="name" required autocomplete="name"></label>
        <label class="field">${t('phone')}<input name="phone" type="tel" required autocomplete="tel" placeholder="+420"></label>
        <label class="field">${t('address')}<input name="address" required autocomplete="street-address"></label>
        <label class="field">${t('note')}<textarea name="note" rows="2"></textarea></label>
        <span class="field">${t('when')}</span>
        <div class="when">
          ${st.open ? `<label><input type="radio" name="when" value="asap" ${when === 'asap' ? 'checked' : ''}>${t('asap')}</label>` : ''}
          <label><input type="radio" name="when" value="time" ${when === 'time' ? 'checked' : ''}>${t('atTime')}</label>
        </div>
        <label class="field" id="slotField" ${when === 'time' ? '' : 'hidden'}>${t('slot')}
          <select name="slot">${sl.list.map((s) => `<option>${s}</option>`).join('')}</select></label>
        <p class="pay-note">${t('pay')}</p>
        <button class="btn btn--primary btn--block drawer__cta" type="submit">${st.open ? t('order', { s: kc(sum) }) : t('preorder', { d: t(sl.day), t: sl.list[0] || '' })}</button>
      </form>`;
    const f = $('#checkout');
    f.addEventListener('change', (e) => {
      if (e.target.name === 'when') $('#slotField').hidden = e.target.value !== 'time';
      if (e.target.name === 'slot' && !st.open) $('.drawer__cta', f).textContent = t('preorder', { d: t(sl.day), t: e.target.value });
    });
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const bad = $$('input[required]', f).find((i) => !i.value.trim());
      if (bad) { bad.focus(); bad.reportValidity?.(); return; }
      const atTime = new FormData(f).get('when') === 'time';
      S.done = { slot: atTime ? f.slot.value : null, day: sl.day };
      S.last[S.city] = { items: { ...cart() }, total: sum, at: Date.now() };
      S.carts[S.city] = {};
      store.set('last', S.last); save();
      S.view = 'done'; renderCart(); refreshBuy(); renderRepeat();
      $('#cartBody').scrollTop = 0;
    });
  }

  function renderRepeat() { $('#repeatHero').innerHTML = repeatBlock(); }

  function save() { store.set('carts', S.carts); renderCartButton(); }

  // Update every buy control for one item without re-rendering the whole menu.
  function refreshBuy(id) {
    $$(id ? `[data-buy="${id}"]` : '[data-buy]').forEach((el) => { const i = ITEMS.get(+el.dataset.buy); if (i) el.innerHTML = buy(i); });
  }

  let toastTimer;
  function toast(msg) {
    const el = $('#toast'); el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
  }

  function change(id, d) {
    const c = cart(); const q = (c[id] || 0) + d;
    if (q <= 0) delete c[id]; else c[id] = q;
    if (d > 0) {
      const b = $('#cartBtn'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
      if (!$('#cartDrawer').open) toast(t('added', { n: ITEMS.get(id).n }));
    }
    save(); refreshBuy(id);
    if ($('#cartDrawer').open) renderCart();
  }

  function openCart() { if (S.view === 'done' && cartCount()) S.view = 'cart'; renderCart(); const d = $('#cartDrawer'); if (!d.open) d.showModal(); }

  function openProduct(id) {
    const i = ITEMS.get(id); if (!i) return;
    $('#productBody').innerHTML = `
      <img src="${src(i.img)}" alt="${esc(i.n)}" width="800" height="600">
      <div class="product__txt">
        ${tags(i)}
        <h2>${esc(i.n)}</h2>
        ${meta(i, true) ? `<div class="product__meta">${meta(i, true)}</div>` : ''}
        ${i.d ? `<p class="product__desc">${esc(i.d)}</p>` : ''}
        ${i.r ? `<ul class="product__rolls">${i.r.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}
        <div class="product__foot"><span class="price">${kc(i.p)}</span><span data-buy="${i.id}">${buy(i)}</span></div>
      </div>`;
    const m = $('#productModal'); if (!m.open) m.showModal();
  }

  // ---------- City ----------
  function setCity(c, remember = true) {
    S.city = c; if (remember) store.set('city', c); ITEMS = byId();
    if (S.view === 'done') S.view = 'cart';
    renderCity(); renderSeal(); renderSets(); renderLunch(); renderMenu(); renderPlaces(); renderRepeat(); renderCartButton();
  }

  function setLang(l) {
    S.lang = l; store.set('lang', l);
    applyTexts(); renderCity(); renderSeal(); renderSets(); renderLunch(); renderMenu(); renderPlaces(); renderRepeat(); renderCartButton();
    if ($('#cartDrawer').open) renderCart();
  }

  // ---------- Events ----------
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-add],[data-dec],[data-open],[data-repeat],[data-close],[data-close-drawer],[data-lang]');
    if (!el) return;
    if (el.dataset.add) change(+el.dataset.add, 1);
    else if (el.dataset.dec) change(+el.dataset.dec, -1);
    else if (el.dataset.open) openProduct(+el.dataset.open);
    else if (el.hasAttribute('data-repeat')) {
      const l = S.last[S.city]; const c = cart();
      for (const [id, q] of Object.entries(l.items)) if (ITEMS.has(+id)) c[id] = (c[id] || 0) + q;
      save(); refreshBuy(); S.view = 'cart'; openCart(); toast(t('repeated'));
    } else if (el.hasAttribute('data-close')) el.closest('dialog').close();
    else if (el.hasAttribute('data-close-drawer')) { $('#cartDrawer').close(); if (S.view === 'done') S.view = 'cart'; }
    else if (el.dataset.lang) setLang(el.dataset.lang);
  });
  // Close dialogs on backdrop click
  $$('dialog').forEach((d) => d.addEventListener('click', (e) => { if (e.target === d && d.id !== 'cityModal') d.close(); }));
  $('#cartDrawer').addEventListener('close', () => { if (S.view === 'done') S.view = 'cart'; });

  $('#cartBtn').addEventListener('click', openCart);
  $('#cartBar').addEventListener('click', (e) => { e.preventDefault(); openCart(); });
  $('#cityBtn').addEventListener('click', () => $('#cityModal').showModal());
  $('#cityModal').addEventListener('close', () => { const v = $('#cityModal').returnValue; if (v && CITIES[v]) setCity(v); });

  let searchTimer;
  $('#search').addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { S.query = e.target.value; renderMenu(); }, 120);
  });

  setInterval(() => { renderStatus(); }, 60000);

  // ---------- Start ----------
  applyTexts();
  if (S.city && CITIES[S.city]) setCity(S.city);
  else { setCity('kolin', false); $('#cityModal').showModal(); }
})();

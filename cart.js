/* TEAlogy – koszyk (stan w localStorage, ceny liczone w groszach) */
(function () {
  'use strict';

  var KEY = 'tealogy_cart_v1';
  var MAX_QTY = 20;
  var FREE_FROM = 25000; // darmowa dostawa od 250 zł
  var SHIPPING = { kurier: 1499, paczkomat: 1199, odbior: 0 };
  var SHIPPING_NAME = { kurier: 'Kurier', paczkomat: 'Paczkomat', odbior: 'Odbiór osobisty' };

  var IMG = {
    sencha: 'https://images.unsplash.com/photo-1628153792464-21bffac488d4?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    oolong: 'https://images.unsplash.com/photo-1652780080440-9067470afc94?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    wieczorny: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?q=80&w=800&auto=format&fit=crop',
    gaiwan: 'https://images.unsplash.com/photo-1649868592193-f1474cb13be9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    tetsubin: 'https://images.unsplash.com/photo-1772473852938-02d047e9a174?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    matcha: 'https://plus.unsplash.com/premium_photo-1694825173868-ed003c071068?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    assam: 'https://images.unsplash.com/photo-1788963704657-ed5bf1064976?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    czarka: 'https://plus.unsplash.com/premium_photo-1714841438361-2c51403be8af?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    zaparzacz: 'https://images.unsplash.com/photo-1610643625267-aee6dae3ca22?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D'
  };

  var CATALOG = {
    'sencha-50':  { name: 'Sencha Premium, 50 g',  cat: 'Herbata zielona', price: 3900,  img: IMG.sencha },
    'sencha-100': { name: 'Sencha Premium, 100 g', cat: 'Herbata zielona', price: 7200,  img: IMG.sencha },
    'sencha-250': { name: 'Sencha Premium, 250 g', cat: 'Herbata zielona', price: 16500, img: IMG.sencha },
    'oolong':     { name: 'Oolong Tie Guan Yin, 50 g', cat: 'Oolong', price: 5400, img: IMG.oolong },
    'wieczorny':  { name: 'Mieszanka ziołowa „Wieczorny spokój”, 80 g', cat: 'Zioła i mieszanki', price: 2900, img: IMG.wieczorny },
    'gaiwan':     { name: 'Gaiwan porcelanowy, 120 ml', cat: 'Akcesoria', price: 12900, img: IMG.gaiwan },
    'tetsubin':   { name: 'Czajnik żeliwny Tetsubin, 0,8 l', cat: 'Akcesoria', price: 28900, img: IMG.tetsubin },
    'matcha':     { name: 'Zestaw do matchy (czasza, miotełka, łyżeczka)', cat: 'Akcesoria', price: 16900, img: IMG.matcha },
    'assam':      { name: 'Assam TGFOP, 100 g', cat: 'Herbata czarna', price: 3400, img: IMG.assam },
    'czarka':     { name: 'Czarka ceramiczna ręcznie robiona, 150 ml', cat: 'Akcesoria', price: 5900, img: IMG.czarka },
    'zaparzacz':  { name: 'Zaparzacz stalowy do kubka', cat: 'Akcesoria', price: 2400, img: IMG.zaparzacz }
  };
  var PRODUCT_URL = 'produkt.html';

  var memory = []; // zapas, gdy localStorage jest niedostępny

  function isValid(line) {
    return line && CATALOG[line.id] && parseInt(line.qty, 10) >= 1;
  }

  function read() {
    try {
      var raw = window.localStorage.getItem(KEY);
      var data = raw ? JSON.parse(raw) : [];
      if (Array.isArray(data)) { return data.filter(isValid); }
      return [];
    } catch (e) {
      return memory.filter(isValid);
    }
  }

  function notify() {
    window.dispatchEvent(new CustomEvent('tealogy:cart'));
  }

  function write(items) {
    memory = items;
    try { window.localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* tryb pamięci */ }
    notify();
  }

  function clampQty(v) {
    var n = parseInt(v, 10);
    if (isNaN(n) || n < 1) { n = 1; }
    if (n > MAX_QTY) { n = MAX_QTY; }
    return n;
  }

  function money(cents) {
    return (Math.round(cents) / 100).toFixed(2).replace('.', ',') + ' zł';
  }

  function getItems() {
    return read().map(function (l) {
      var p = CATALOG[l.id];
      var qty = clampQty(l.qty);
      return { id: l.id, qty: qty, p: p, total: p.price * qty };
    });
  }

  function add(id, qty) {
    if (!CATALOG[id]) { return; }
    qty = clampQty(qty || 1);
    var items = read();
    var found = null;
    items.forEach(function (l) { if (l.id === id) { found = l; } });
    if (found) { found.qty = Math.min(MAX_QTY, clampQty(found.qty) + qty); }
    else { items.push({ id: id, qty: qty }); }
    write(items);
  }

  function setQty(id, qty) {
    var items = read();
    items.forEach(function (l) { if (l.id === id) { l.qty = clampQty(qty); } });
    write(items);
  }

  function remove(id) {
    write(read().filter(function (l) { return l.id !== id; }));
  }

  function clear() { write([]); }

  function count() {
    return getItems().reduce(function (s, i) { return s + i.qty; }, 0);
  }

  function subtotal() {
    return getItems().reduce(function (s, i) { return s + i.total; }, 0);
  }

  function shipping(sub, method) {
    if (sub <= 0 || method === 'odbior') { return 0; }
    if (sub >= FREE_FROM) { return 0; }
    return SHIPPING[method] !== undefined ? SHIPPING[method] : SHIPPING.kurier;
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) { el.textContent = text; }
  }

  /* ---------- Komunikat po dodaniu ---------- */
  var toastTimer;
  function toast(msg) {
    var el = document.getElementById('cart-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'cart-toast';
      el.className = 'cart-toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.innerHTML = '<span></span><a href="koszyk.html">Zobacz koszyk</a>';
    el.firstChild.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 4500);
  }

  /* ---------- Przyciski „Do koszyka” (sklep, strona główna, polecane) ---------- */
  function initAddButtons() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.add-to-cart') : null;
      if (!btn) { return; }
      var id = btn.getAttribute('data-id');
      if (!CATALOG[id]) { return; }
      add(id, 1);
      toast('Dodano do koszyka: ' + CATALOG[id].name);
    });
  }

  /* ---------- Strona produktu: cena zależna od gramatury i ilości ---------- */
  function initProductPage() {
    var form = document.getElementById('buy-form');
    if (!form) { return; }
    var sel = document.getElementById('wariant');
    var qtyIn = document.getElementById('ilosc');
    var priceEl = document.getElementById('product-price');
    var totalEl = document.getElementById('line-total');

    function current() {
      return { id: 'sencha-' + sel.value, qty: clampQty(qtyIn.value) };
    }
    function refresh() {
      var c = current();
      var price = CATALOG[c.id].price;
      if (priceEl) { priceEl.textContent = money(price); }
      if (totalEl) { totalEl.textContent = money(price * c.qty); }
    }
    sel.addEventListener('change', refresh);
    qtyIn.addEventListener('input', refresh);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var c = current();
      qtyIn.value = c.qty;
      add(c.id, c.qty);
      refresh();
      toast('Dodano do koszyka: ' + c.qty + ' × ' + CATALOG[c.id].name);
    });
    refresh();
  }

  /* ---------- Strona koszyka ---------- */
  function initCartPage() {
    var body = document.getElementById('cart-body');
    if (!body) { return; }
    var empty = document.getElementById('cart-empty');
    var content = document.getElementById('cart-content');

    function row(it) {
      return '<tr data-id="' + it.id + '">' +
        '<td><div class="cart-product">' +
        '<img src="' + it.p.img + '" class="cart-thumb" alt="" width="200" height="200" loading="lazy">' +
        '<div><a href="' + PRODUCT_URL + '" class="fw-bold text-decoration-none">' + it.p.name + '</a><br>' +
        '<small class="text-muted-brand">' + it.p.cat + '</small></div></div></td>' +
        '<td>' + money(it.p.price) + '</td>' +
        '<td><label class="visually-hidden" for="ilosc-' + it.id + '">Ilość: ' + it.p.name + '</label>' +
        '<input type="number" class="form-control cart-qty" id="ilosc-' + it.id + '" data-id="' + it.id +
        '" value="' + it.qty + '" min="1" max="' + MAX_QTY + '"></td>' +
        '<td class="fw-bold" data-line-total>' + money(it.total) + '</td>' +
        '<td><button type="button" class="cart-remove" data-remove="' + it.id + '" aria-label="Usuń z koszyka: ' +
        it.p.name + '"><i class="bi bi-trash" aria-hidden="true"></i></button></td></tr>';
    }

    function summary() {
      var sub = subtotal();
      var ship = shipping(sub, 'kurier');
      setText('sum-subtotal', money(sub));
      setText('sum-shipping', money(ship));
      setText('sum-total', money(sub + ship));
      setText('shipping-note-text', sub >= FREE_FROM
        ? 'Masz darmową dostawę kurierską.'
        : 'Darmowa dostawa od 250 zł. Do darmowej dostawy brakuje Ci jeszcze ' + money(FREE_FROM - sub) + '.');
    }

    function render() {
      var items = getItems();
      empty.hidden = items.length > 0;
      content.hidden = items.length === 0;
      body.innerHTML = items.map(row).join('');
      summary();
    }

    function updateRow(input, qty) {
      var tr = input.closest('tr');
      var cell = tr ? tr.querySelector('[data-line-total]') : null;
      if (cell) { cell.textContent = money(CATALOG[input.getAttribute('data-id')].price * qty); }
      summary();
    }

    body.addEventListener('input', function (e) {
      if (!e.target.classList.contains('cart-qty')) { return; }
      var n = parseInt(e.target.value, 10);
      if (isNaN(n) || n < 1 || n > MAX_QTY) { return; }
      setQty(e.target.getAttribute('data-id'), n);
      updateRow(e.target, n);
    });
    body.addEventListener('change', function (e) {
      if (!e.target.classList.contains('cart-qty')) { return; }
      var n = clampQty(e.target.value);
      e.target.value = n;
      setQty(e.target.getAttribute('data-id'), n);
      updateRow(e.target, n);
    });
    body.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-remove]') : null;
      if (!btn) { return; }
      remove(btn.getAttribute('data-remove'));
      render();
      var h1 = document.querySelector('h1');
      if (h1) { h1.focus(); }
    });
    window.addEventListener('storage', render);
    render();
  }

  /* ---------- Strona zamówienia ---------- */
  function initCheckout() {
    var form = document.getElementById('checkout-form');
    var box = document.getElementById('order-items');
    if (!form || !box) { return; }
    var submit = document.getElementById('submit-order');
    var emptyMsg = document.getElementById('order-empty');

    function method() {
      var r = form.querySelector('input[name="dostawa"]:checked');
      return r ? r.value : 'kurier';
    }

    function render() {
      var items = getItems();
      var sub = subtotal();
      var m = method();
      var ship = shipping(sub, m);
      box.innerHTML = items.map(function (it) {
        return '<div class="summary-item">' +
          '<img src="' + it.p.img + '" class="summary-thumb" alt="" width="200" height="200" loading="lazy">' +
          '<div class="summary-item-name">' + it.p.name + '<br><small class="text-muted-brand">' +
          it.qty + ' × ' + money(it.p.price) + '</small></div>' +
          '<span class="fw-bold">' + money(it.total) + '</span></div>';
      }).join('');
      emptyMsg.hidden = items.length > 0;
      submit.disabled = items.length === 0;
      setText('sum-subtotal', money(sub));
      setText('sum-shipping-label', 'Dostawa (' + SHIPPING_NAME[m] + ')');
      setText('sum-shipping', money(ship));
      setText('sum-total', money(sub + ship));
      ['kurier', 'paczkomat', 'odbior'].forEach(function (k) {
        var meta = form.querySelector('label[for="' + k + '"] .option-meta');
        if (!meta) { return; }
        var free = k !== 'odbior' && sub >= FREE_FROM;
        meta.textContent = free ? '0,00 zł (darmowa dostawa)' : money(SHIPPING[k]);
      });
    }

    form.addEventListener('change', function (e) {
      if (e.target.name === 'dostawa') { render(); }
    });
    form.addEventListener('submit', function (e) {
      if (!getItems().length) { e.preventDefault(); return; }
      clear(); // zamówienie złożone – opróżniamy koszyk
    });
    window.addEventListener('storage', render);
    render();
  }

  window.TEAcart = {
    add: add, setQty: setQty, remove: remove, clear: clear,
    count: count, subtotal: subtotal, shipping: shipping, money: money,
    items: getItems, catalog: CATALOG, freeFrom: FREE_FROM
  };

  initAddButtons();
  initProductPage();
  initCartPage();
  initCheckout();
})();

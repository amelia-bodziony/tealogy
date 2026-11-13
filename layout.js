/* TEAlogy – wspólny nagłówek (menu) i stopka dla wszystkich podstron */
(function () {
  'use strict';

  var path = location.pathname.split('/').pop() || 'index.html';
  try { path = decodeURIComponent(path); } catch (e) { /* zostaw jak jest */ }
  path = path.toLowerCase();

  var isIndex = path === 'index.html';
  var home = isIndex ? '#hero' : 'index.html';
  var base = isIndex ? '' : 'index.html';

  function active(pages) { return pages.indexOf(path) > -1 ? ' active' : ''; }
  function current(exact) { return path === exact ? ' aria-current="page"' : ''; }

  function cartLabel(n) {
    if (!n) { return 'Koszyk, pusty'; }
    var word = 'produktów';
    if (n === 1) { word = 'produkt'; }
    else if (n % 10 >= 2 && n % 10 <= 4 && !(n % 100 >= 12 && n % 100 <= 14)) { word = 'produkty'; }
    return 'Koszyk, ' + n + ' ' + word;
  }

  var count = window.TEAcart ? window.TEAcart.count() : 0;

  var headerHtml =
    '<nav class="navbar navbar-expand-lg navbar-dark fixed-top site-nav" aria-label="Nawigacja główna">' +
    '<div class="container">' +
    '<a class="navbar-brand brand-logo" href="' + home + '">TEA<span>logy</span></a>' +
    '<div class="nav-actions d-flex align-items-center ms-auto ms-lg-2 me-2 me-lg-0 order-lg-last">' +
    '<a class="nav-icon-link' + active(['konto.html']) + '" href="konto.html" aria-label="Moje konto"' + current('konto.html') + '>' +
    '<i class="bi bi-person" aria-hidden="true"></i></a>' +
    '<a class="nav-icon-link' + active(['koszyk.html', 'zamowienie.html']) + '" id="cart-link" href="koszyk.html" aria-label="' + cartLabel(count) + '"' + current('koszyk.html') + '>' +
    '<i class="bi bi-bag" aria-hidden="true"></i>' +
    '<span class="badge rounded-pill cart-badge" id="cart-badge" aria-hidden="true"' + (count ? '' : ' hidden') + '>' + count + '</span></a>' +
    '</div>' +
    '<button class="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Przełącz nawigację">' +
    '<span class="navbar-toggler-icon"></span></button>' +
    '<div class="navbar-collapse collapse" id="mainNav">' +
    '<ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">' +
    '<li class="nav-item"><a class="nav-link" href="' + base + '#o-nas">O nas</a></li>' +
    '<li class="nav-item"><a class="nav-link' + active(['sklep.html', 'produkt.html']) + '" href="sklep.html"' + current('sklep.html') + '>Sklep</a></li>' +
    '<li class="nav-item"><a class="nav-link' + active(['blog.html', 'single.html']) + '" href="blog.html"' + current('blog.html') + '>Blog</a></li>' +
    '<li class="nav-item"><a class="nav-link" href="' + base + '#kontakt">Kontakt</a></li>' +
    '</ul></div></div></nav>';

  var footerHtml =
    '<div class="container"><div class="row g-4 align-items-center">' +
    '<div class="col-md-6 text-center text-md-start">' +
    '<a class="brand-logo footer-logo" href="' + home + '">TEA<span>logy</span></a>' +
    '<p class="mb-0 mt-2 footer-meta">TEAlogy sp. z o.o. · ul. Spokojna 12, 00-950 Warszawa<br>' +
    'NIP: 525-000-00-00 · REGON: 000000000</p></div>' +
    '<div class="col-md-6 text-center text-md-end">' +
    '<p class="mb-0 footer-meta">© ' + new Date().getFullYear() + ' TEAlogy. Wszelkie prawa zastrzeżone.</p></div>' +
    '</div></div>';

  var header = document.getElementById('site-header');
  var footer = document.getElementById('site-footer');
  if (header) { header.innerHTML = headerHtml; }
  if (footer) { footer.innerHTML = footerHtml; }

  /* zwijanie menu na telefonie po kliknięciu w link */
  if (header) {
    header.querySelectorAll('#mainNav a').forEach(function (link) {
      link.addEventListener('click', function () {
        var menu = document.getElementById('mainNav');
        if (menu && menu.classList.contains('show') && window.bootstrap) {
          window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
        }
      });
    });
  }

  /* licznik koszyka w menu */
  function updateBadge() {
    var n = window.TEAcart ? window.TEAcart.count() : 0;
    var badge = document.getElementById('cart-badge');
    var link = document.getElementById('cart-link');
    if (badge) { badge.textContent = n; badge.hidden = !n; }
    if (link) { link.setAttribute('aria-label', cartLabel(n)); }
  }
  window.addEventListener('tealogy:cart', updateBadge);
  window.addEventListener('storage', updateBadge);
})();

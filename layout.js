/* TEAlogy – wspólny nagłówek (menu) i rozbudowana stopka dla wszystkich podstron */
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

  /* ---------- Nagłówek ---------- */
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
    '<li class="nav-item"><a class="nav-link' + active(['kontakt.html']) + '" href="kontakt.html"' + current('kontakt.html') + '>Kontakt</a></li>' +
    '</ul></div></div></nav>';

  /* ---------- Stopka ---------- */
  function social(icon, label, url) {
    return '<li><a class="footer-social-link" href="' + url + '" target="_blank" rel="noopener noreferrer" aria-label="' + label + ' (otwiera się w nowej karcie)">' +
      '<i class="bi bi-' + icon + '" aria-hidden="true"></i></a></li>';
  }
  function link(href, label) { return '<li><a href="' + href + '">' + label + '</a></li>'; }

  var footerHtml = [
    '<div class="container footer-main">',
    '<div class="row g-4 g-lg-5">',

    '<div class="col-md-6 col-lg-3">',
    '<a class="brand-logo footer-logo" href="' + home + '">TEA<span>logy</span></a>',
    '<p class="footer-about mt-3">Wierzymy, że dobra herbata zasługuje na czas. Wybieramy pełne liście od małych plantacji, tworzymy autorskie mieszanki i pomagamy zamienić codzienną filiżankę w rytuał uważności.</p>',
    '<ul class="footer-social list-unstyled d-flex flex-wrap gap-2 mb-0">',
    social('facebook', 'Facebook', 'https://www.facebook.com/'),
    social('instagram', 'Instagram', 'https://www.instagram.com/'),
    social('pinterest', 'Pinterest', 'https://www.pinterest.com/'),
    social('youtube', 'YouTube', 'https://www.youtube.com/'),
    '</ul>',
    '</div>',

    '<div class="col-md-6 col-lg-3">',
    '<h2 class="footer-title">Szybka nawigacja</h2>',
    '<ul class="footer-links list-unstyled mb-0">',
    link(home, 'Strona główna'),
    link(base + '#o-nas', 'O nas'),
    link(base + '#oferta', 'Oferta'),
    link('blog.html', 'Blog'),
    link('kontakt.html', 'Kontakt'),
    '</ul>',
    '</div>',

    '<div class="col-md-6 col-lg-3">',
    '<h2 class="footer-title">Strefa klienta</h2>',
    '<ul class="footer-links list-unstyled mb-0">',
    link('sklep.html', 'Sklep'),
    link('koszyk.html', 'Koszyk'),
    link('konto.html', 'Moje konto'),
    link('polityka-prywatnosci.html', 'Polityka prywatności'),
    '</ul>',
    '</div>',

    '<div class="col-md-6 col-lg-3">',
    '<h2 class="footer-title">Newsletter i kontakt</h2>',
    '<form class="footer-newsletter" action="kontakt.html" method="post" data-demo-form="Dziękujemy za zapis do newslettera!">',
    '<label for="newsletter-email" class="visually-hidden">Adres e-mail do newslettera</label>',
    '<div class="input-group">',
    '<input type="email" class="form-control" id="newsletter-email" name="email" placeholder="Twój e-mail" autocomplete="email" required>',
    '<button type="submit" class="btn btn-accent px-3">Zapisz się</button>',
    '</div>',
    '<p class="form-status small mb-0 mt-2" role="status"></p>',
    '</form>',
    '<ul class="footer-contact list-unstyled mt-3 mb-0">',
    '<li><i class="bi bi-envelope" aria-hidden="true"></i><a href="mailto:kontakt@tealogy.pl">kontakt@tealogy.pl</a></li>',
    '<li><i class="bi bi-telephone" aria-hidden="true"></i><span>Infolinia: <a href="tel:+48500600700">+48 500 600 700</a></span></li>',
    '</ul>',
    '</div>',

    '</div>',
    '</div>',

    '<div class="footer-bottom">',
    '<div class="container">',
    '<div class="row g-2 align-items-center">',
    '<div class="col-md-8 text-center text-md-start">',
    '<p class="mb-1 footer-meta">© ' + new Date().getFullYear() + ' TEAlogy sp. z o.o. Wszelkie prawa zastrzeżone. · NIP: 525-000-00-00 · REGON: 000000000</p>',
    '<p class="mb-0 footer-meta">Projekt i wykonanie strony: zespół TEAlogy (projekt zaliczeniowy z Responsive Web Design).</p>',
    '</div>',
    '<div class="col-md-4 d-flex flex-wrap justify-content-center justify-content-md-end column-gap-3">',
    '<a class="footer-legal-link" href="polityka-prywatnosci.html">Polityka prywatności</a>',
    '<a class="footer-legal-link" href="404.html">Strona 404</a>',
    '</div>',
    '</div>',
    '</div>',
    '</div>'
  ].join('');

  var header = document.getElementById('site-header');
  var footer = document.getElementById('site-footer');
  if (header) { header.innerHTML = headerHtml; }
  if (footer) { footer.innerHTML = footerHtml; }

  /* zwijanie menu na telefonie po kliknięciu w link */
  if (header) {
    header.querySelectorAll('#mainNav a').forEach(function (a) {
      a.addEventListener('click', function () {
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
    var cartLink = document.getElementById('cart-link');
    if (badge) { badge.textContent = n; badge.hidden = !n; }
    if (cartLink) { cartLink.setAttribute('aria-label', cartLabel(n)); }
  }
  window.addEventListener('tealogy:cart', updateBadge);
  window.addEventListener('storage', updateBadge);

  /* formularze demonstracyjne (newsletter, kontakt): komunikat zamiast przeładowania */
  document.addEventListener('submit', function (e) {
    var form = e.target;
    var msg = form.getAttribute ? form.getAttribute('data-demo-form') : null;
    if (!msg) { return; }
    e.preventDefault();
    var status = form.querySelector('.form-status');
    form.reset();
    if (status) { status.textContent = msg; }
  });
})();

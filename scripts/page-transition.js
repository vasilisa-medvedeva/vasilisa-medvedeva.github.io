(function () {
  // Gentle stagger for the component-block load animation.
  // This is purely additive — the reveal itself is CSS-driven, so blocks
  // are never left invisible even if this script doesn't run.
  var blocks = document.querySelectorAll('.component-block');
  if (!blocks.length) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (var i = 0; i < blocks.length; i++) {
    blocks[i].style.animationDelay = (Math.min(i, 10) * 0.06 + 0.05) + 's';
  }
})();

/* ── Mobile header: CV button + burger + slide-down panel ─────────────
   Built entirely from the markup already in .site-header, so no page's
   HTML has to change. On phones the contact links hide (CSS) and this
   cluster takes their place; the panel gathers the section menus and the
   contacts behind one tap. */
(function () {
  var inner = document.querySelector('.site-header__inner');
  if (!inner) return;
  var links = inner.querySelector('.site-header__links');
  if (!links) return;                                   // page has no contacts row
  if (inner.querySelector('.site-header__mobile')) return;  // already built

  var contactLinks = Array.prototype.slice.call(links.querySelectorAll('.site-header__link'));
  // CV = the PDF link (fallback: first link). Everything else is a contact.
  var cvLink = contactLinks.filter(function (a) { return /\.pdf($|\?)/i.test(a.getAttribute('href') || ''); })[0] || contactLinks[0];

  // ── Cluster in the header: CV pill + burger ──
  var cluster = document.createElement('div');
  cluster.className = 'site-header__mobile';

  if (cvLink) {
    var cv = cvLink.cloneNode(true);
    cv.className = 'site-header__cv';
    cluster.appendChild(cv);
  }

  var burger = document.createElement('button');
  burger.className = 'site-header__burger';
  burger.type = 'button';
  burger.setAttribute('aria-label', 'Menu');
  burger.setAttribute('aria-expanded', 'false');
  burger.innerHTML = '<span></span>';
  cluster.appendChild(burger);
  inner.appendChild(cluster);

  // ── Slide-down panel ──
  var scrim = document.createElement('div');
  scrim.className = 'mobile-nav__scrim';

  var panel = document.createElement('nav');
  panel.className = 'mobile-nav';
  panel.setAttribute('aria-label', 'Mobile navigation');

  function addLabel(text) {
    var l = document.createElement('div');
    l.className = 'mobile-nav__label';
    l.textContent = text;
    panel.appendChild(l);
  }
  function addLink(href, text, sub) {
    var a = document.createElement('a');
    a.className = 'mobile-nav__link' + (sub ? ' mobile-nav__link--sub' : '');
    a.href = href;
    if (/^https?:|^mailto:/i.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
    a.textContent = text;
    panel.appendChild(a);
  }

  // Sections (About me / My projects and their dropdown items)
  var menu = inner.querySelector('.site-header__menu');
  if (menu) {
    var items = menu.querySelectorAll('.menu-item');
    for (var i = 0; i < items.length; i++) {
      var trigger = items[i].querySelector('.menu-item__trigger');
      if (trigger) addLink(trigger.getAttribute('href'), trigger.textContent.trim(), false);
      var subs = items[i].querySelectorAll('.menu-item__dropdown .menu-item__link');
      for (var j = 0; j < subs.length; j++) {
        addLink(subs[j].getAttribute('href'), subs[j].textContent.trim(), true);
      }
    }
  }

  // Contacts (Telegram / LinkedIn / Email — CV stays the pill above)
  var contacts = contactLinks.filter(function (a) { return a !== cvLink; });
  if (contacts.length) {
    addLabel('Contacts');
    contacts.forEach(function (a) { addLink(a.getAttribute('href'), a.textContent.trim(), false); });
  }

  document.body.appendChild(scrim);
  document.body.appendChild(panel);

  function setOpen(open) {
    document.body.classList.toggle('mobile-nav-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  burger.addEventListener('click', function () {
    setOpen(!document.body.classList.contains('mobile-nav-open'));
  });
  scrim.addEventListener('click', function () { setOpen(false); });
  panel.addEventListener('click', function (e) {
    if (e.target.closest('.mobile-nav__link')) setOpen(false);   // close on navigate
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
})();

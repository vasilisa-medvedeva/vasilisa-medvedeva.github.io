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
    // Mobile panel surfaces projects first — reverse the desktop nav order (About me, My projects)
    var items = Array.prototype.slice.call(menu.querySelectorAll('.menu-item')).reverse();
    for (var i = 0; i < items.length; i++) {
      var trigger = items[i].querySelector('.menu-item__trigger');
      if (trigger) addLink(trigger.getAttribute('href'), trigger.textContent.trim(), false);
      var subs = items[i].querySelectorAll('.menu-item__dropdown .menu-item__link');
      for (var j = 0; j < subs.length; j++) {
        addLink(subs[j].getAttribute('href'), subs[j].textContent.trim(), true);
      }
    }
  }

  /* Contacts — every way to reach her, the CV included: inside a menu the CV
     is one more way to get in touch, not a pill of its own. No heading above
     them; the gap says "different kind of thing", and one fewer label is one
     fewer line to read. */
  var contacts = contactLinks.slice();
  contacts.forEach(function (a, i) {
    addLink(a.getAttribute('href'), a.textContent.trim(), false);
    if (i === 0) { panel.lastChild.classList.add('mobile-nav__link--group'); }
  });

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

/* ── Dropdown highlight: one block that travels ───────────────────────
   The rows used to paint their own background, so moving between them read
   as one highlight blinking out and another blinking in. Here a single
   element slides between rows instead, which is the whole gesture: the
   highlight is a thing that moves, not a state each row switches on.

   Built from the existing markup — nothing in any page's HTML changes. The
   rows keep their own :hover colour for the label; only the fill moves. */
(function () {
  var dropdowns = document.querySelectorAll('.menu-item__dropdown');
  if (!dropdowns.length) return;

  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  Array.prototype.forEach.call(dropdowns, function (menu) {
    var links = menu.querySelectorAll('.menu-item__link');
    if (!links.length) return;

    var marker = document.createElement('span');
    marker.className = 'menu-item__marker';
    marker.setAttribute('aria-hidden', 'true');
    menu.insertBefore(marker, menu.firstChild);
    menu.classList.add('has-marker');   // tells the CSS to stop painting rows itself

    /* The panel is hidden until its parent is hovered, so offsets read as 0
       on a cold page. Measuring on first entry — when it is laid out — costs
       nothing and avoids a marker that lands in the wrong place once. */
    /* The lit row is marked here rather than left to :hover. The panel carries
       8px of padding above the first row and below the last, and rows sit flush
       against each other — so the cursor can be inside the panel, with the
       marker parked on a row, while :hover on that row has already ended. The
       fill stayed and the label snapped back to ink. Driving both from one
       place means they cannot disagree. */
    function moveTo (link) {
      marker.style.height = link.offsetHeight + 'px';
      marker.style.transform = 'translateY(' + link.offsetTop + 'px)';
      marker.classList.add('is-on');
      for (var i = 0; i < links.length; i++) { links[i].classList.remove('is-marked'); }
      link.classList.add('is-marked');
    }

    Array.prototype.forEach.call(links, function (link) {
      link.addEventListener('pointerenter', function () {
        /* First landing must not slide in from the top edge: place it with the
           transition off, then let every later move animate. */
        if (!marker.classList.contains('is-on') && !still) {
          marker.style.transition = 'none';
          moveTo(link);
          void marker.offsetWidth;          // flush, so the next frame animates
          marker.style.transition = '';
          return;
        }
        moveTo(link);
      });
      link.addEventListener('focus', function () { moveTo(link); });
    });

    function clear () {
      marker.classList.remove('is-on');
      for (var i = 0; i < links.length; i++) { links[i].classList.remove('is-marked'); }
    }
    menu.addEventListener('pointerleave', clear);
    var host = menu.closest('.menu-item');
    if (host) host.addEventListener('pointerleave', clear);
  });
})();

/* ── Phone screenshots: drop the skeleton once the pixels land ─────────
   The shimmer itself is pure CSS (styles/shot-skeleton.css) and is painted as
   the image's own background, so it is correct before this script runs and
   stays correct if the script never runs at all — a shot that fails keeps
   shimmering rather than collapsing, which is the behaviour we want anyway.

   All this does is stop the animation once it has nothing left to cover: an
   opaque image is sitting on top of it by then, and leaving a sweep running
   behind every screenshot on the page is wasted work. */
(function () {
  var shots = document.querySelectorAll(
    '.scan-phone__screen img, .scan-phone__screen video, ' +
    '.pdd-phone__screen img, .pay-phone__screen img'
  );
  if (!shots.length) return;

  function done (el) { el.classList.add('is-shot-loaded'); }

  Array.prototype.forEach.call(shots, function (el) {
    if (el.tagName === 'VIDEO') {
      if (el.readyState >= 2) { done(el); return; }
      el.addEventListener('loadeddata', function () { done(el); }, { once: true });
      return;
    }
    /* complete alone is not enough: it is also true for a failed image, and a
       broken shot must keep its skeleton rather than reveal an empty frame. */
    if (el.complete && el.naturalWidth > 0) { done(el); return; }
    el.addEventListener('load', function () { done(el); }, { once: true });
  });
})();

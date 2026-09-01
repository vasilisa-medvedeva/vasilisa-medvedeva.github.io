/* ── Language switch: English ⇄ Russian ─────────────────────────────────
   The English copy stays in the HTML, where it is the page's real content —
   crawlers, previews and a reader with JS off all still get a finished site.
   The Russian sits beside it in data-ru, and the switch swaps the two.

   Marking a page up:
     <p data-ru="Привет">Hi</p>              text (may contain HTML)
     <img data-ru-alt="Схема" alt="Diagram"> attributes: -alt, -aria, -title
     <title data-ru="…">…</title>            the tab, too

   The English is captured into data-en the first time an element is
   translated, so switching back needs no second copy in the markup.

   Linking to one language: ?lang=ru or ?lang=en opens the page in that
   language whatever the reader chose last, so a link sent to a Russian
   recruiter lands in Russian and one sent abroad lands in English. The
   switch keeps that parameter in the address bar, so whatever is on screen
   is what gets shared when the URL is copied. */
(function () {
  var KEY  = 'lang';
  var ATTR = { alt: 'alt', aria: 'aria-label', title: 'title', placeholder: 'placeholder' };

  /* The header is the same on every page, so its Russian lives here rather than
     being copy-pasted into each file — one place to fix, no drift between pages.
     Anything page-specific still travels in the markup as data-ru. */
  var CHROME = {
    '.site-header__name':                        'Василиса Медведева',
    '.menu-item__trigger[href$="#about"]':       'Обо мне',
    '.menu-item__trigger[href$="#projects"]':    'Мои проекты',
    '.menu-item__link[href$="#experience"]':     'Опыт работы',
    '.menu-item__link[href$="#education"]':      'Образование',
    '.menu-item__link[href$="#tools"]':          'Инструменты',
    '.menu-item__link[href$="#about"]':          'Немного о себе',
    '.menu-item__link[href$="nomerogram.html"]': 'Номерограм',
    '.menu-item__link[href$="dromfines.html"]':  'Дром Штрафы',
    '.menu-item__link[href$="drompdd.html"]':    'Дром ПДД',
    '.site-header__link[href$=".pdf"]':          'Резюме',
    '.site-header__link[href^="mailto:"]':       'Почта'
  };
  /* the phone panel writes these two itself (scripts/page-transition.js) */
  var CHROME_MOBILE = { '.mobile-nav__label': 'Контакты' };
  /* case scaffolding repeats on every case page and inside every case */
  var LABELS = { 'Problem': 'Проблема', 'Solution': 'Решение', 'Outcome': 'Результат' };

  var CHROME_ARIA = {
    '.site-header__menu':   'Разделы сайта',
    '.site-header__links':  'Резюме и контакты',
    '.site-header__burger': 'Меню',
    '.mobile-nav':          'Меню'
  };

  /* Archivo, the display face, has no Cyrillic — Onest carries the Russian
     (the note in text-tokens.css has the reasoning). It is fetched the moment
     Russian is first chosen, so an English reader never pays for the file. */
  var FACE_RU = 'https://fonts.googleapis.com/css2?family=Onest:wght@300;500;700;900&display=swap';
  function loadFace() {
    if (document.querySelector('link[data-face="ru"]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FACE_RU;
    link.setAttribute('data-face', 'ru');
    document.head.appendChild(link);
  }

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function remember(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  /* ?lang=ru / ?lang=en — a link that opens in a named language. It outranks
     the remembered choice: the sender decided what this reader should see. */
  function fromUrl() {
    var m = /[?&]lang=(ru|en)\b/i.exec(window.location.search);
    return m ? m[1].toLowerCase() : null;
  }

  /* Keep the address bar honest, so copying it shares what is on screen. */
  function writeUrl(lang) {
    if (!window.history || !history.replaceState) { return; }
    var url = new URL(window.location.href);
    url.searchParams.set(KEY, lang);
    try { history.replaceState(null, '', url.toString()); } catch (e) {}
  }

  function apply(lang) {
    var ru = lang === 'ru';
    if (ru) loadFace();

    /* fold the shared header into the same data-ru mechanism, once */
    Object.keys(CHROME).concat(Object.keys(CHROME_MOBILE)).forEach(function (sel) {
      var el = document.querySelector(sel);
      var ru = CHROME[sel] || CHROME_MOBILE[sel];
      if (el && el.dataset.ru === undefined) el.dataset.ru = ru;
    });
    Object.keys(CHROME_ARIA).forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el && !el.hasAttribute('data-ru-aria')) el.setAttribute('data-ru-aria', CHROME_ARIA[sel]);
    });

    /* The phone panel and the CV pill are clones of header links, taken by
       page-transition.js before any of this ran, so they carry no data-ru of
       their own — and a clone made from English text would stay English for
       good. Copy it across by href, now that the header's own copy is filled
       in above. Names that are the same in both languages (Telegram, the
       product names in Latin) have no data-ru and are left alone. */
    document.querySelectorAll('.mobile-nav__link, .site-header__cv').forEach(function (el) {
      if (el.dataset.ru !== undefined) { return; }
      var href = el.getAttribute('href'), en = el.textContent.trim();
      if (!href) { return; }
      var sources = document.querySelectorAll('.site-header__inner [href][data-ru]');
      for (var i = 0; i < sources.length; i++) {
        var src = sources[i];
        if (src.getAttribute('href') !== href) { continue; }
        /* index.html#about is both a section and an item inside it, so the href
           alone can't tell them apart — the English text can. */
        var srcEn = (src.dataset.en !== undefined ? src.dataset.en : src.innerHTML).trim();
        if (srcEn === en) { el.dataset.ru = src.dataset.ru; return; }
      }
    });

    document.querySelectorAll('.case__label').forEach(function (el) {
      var ru = LABELS[el.textContent.trim()];
      if (ru && el.dataset.ru === undefined) el.dataset.ru = ru;
    });
    document.querySelectorAll('.case__index').forEach(function (el) {
      var m = /^Case\s+(\d+)$/.exec(el.textContent.trim());
      if (m && el.dataset.ru === undefined) el.dataset.ru = 'Кейс ' + m[1];
    });

    document.querySelectorAll('[data-ru]').forEach(function (el) {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      el.innerHTML = ru ? el.dataset.ru : el.dataset.en;
    });

    Object.keys(ATTR).forEach(function (suffix) {
      var data = 'data-ru-' + suffix, name = ATTR[suffix];
      document.querySelectorAll('[' + data + ']').forEach(function (el) {
        var keep = 'en' + suffix.charAt(0).toUpperCase() + suffix.slice(1);
        if (el.dataset[keep] === undefined) el.dataset[keep] = el.getAttribute(name) || '';
        el.setAttribute(name, ru ? el.getAttribute(data) : el.dataset[keep]);
      });
    });

    document.documentElement.lang = ru ? 'ru' : 'en';
    document.querySelectorAll('.lang-switch__btn').forEach(function (btn) {
      btn.setAttribute('aria-current', String(btn.dataset.lang === lang));
    });

    /* copy that a script writes at runtime can't sit in data-ru; those scripts
       read window.lang() and redraw on this event */
    window.lang = function () { return lang; };
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
  }

  function mount(lang) {
    if (document.querySelector('.lang-switch')) return;
    var box = document.createElement('div');
    box.className = 'lang-switch';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Language / Язык');
    /* Each button carries the same hand-drawn ring as the circled word in the
       hero; CSS shows it only around the live language and draws it in. */
    var RING = '<svg class="lang-switch__ring" viewBox="0 0 104 52" fill="none" aria-hidden="true">' +
      '<path d="M20 8.5C38 2.5 76 1.5 91 9.5C101.5 15 103 29.5 91.5 38.5C74 50.5 28 51.5 13.5 41C3.5 33.5 5 18.5 24 10.5C28.5 8.6 33.5 7.2 38.5 6.4" ' +
      'stroke="var(--color-accent-orange)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    box.innerHTML =
      '<button class="lang-switch__btn" type="button" data-lang="en" lang="en">EN' + RING + '</button>' +
      '<button class="lang-switch__btn" type="button" data-lang="ru" lang="ru">RU' + RING + '</button>';
    /* The swap breathes: the page softens out for a beat, the words change
       while nothing is quite readable, and it fades back in — where the ring
       then draws itself around the new language. Instant when the reader
       prefers reduced motion, and clicks during the beat are ignored. */
    var swapping = false;
    function applyAnimated(next) {
      var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced || swapping) { if (!swapping) apply(next); return; }
      swapping = true;
      document.documentElement.classList.add('lang-swapping');
      setTimeout(function () {
        apply(next);
        /* one more beat so the swapped words paint while still faded out
           (a timer, not rAF — rAF stalls in background tabs) */
        setTimeout(function () {
          document.documentElement.classList.remove('lang-swapping');
          swapping = false;
        }, 40);
      }, 180);
    }
    box.addEventListener('click', function (e) {
      var btn = e.target.closest('.lang-switch__btn');
      if (!btn) return;
      var next = btn.dataset.lang;
      if (btn.getAttribute('aria-current') === 'true') return;   /* already live */
      remember(next);
      writeUrl(next);
      applyAnimated(next);
      /* the deck reports which language its readers actually pick */
      if (typeof window.track === 'function') window.track('lang_switch', { lang: next });
    });
    /* The header is where a reader looks for a language, and it is sticky —
       the switch stays reachable the whole way down the page. It goes last in
       the row, after the contacts, but ahead of the phone-sized cluster so
       the burger keeps the corner. A page with no header keeps the old
       floating pill in the bottom-right. */
    var inner = document.querySelector('.site-header__inner');
    if (inner) {
      inner.insertBefore(box, inner.querySelector('.site-header__mobile'));
    } else {
      box.classList.add('lang-switch--floating');
      document.body.appendChild(box);
    }
    apply(lang);
  }

  /* the link's language, else the one this reader chose last, else English */
  var lang = fromUrl() || (stored() === 'ru' ? 'ru' : 'en');
  if (fromUrl()) { remember(lang); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { mount(lang); });
  } else {
    mount(lang);
  }
})();

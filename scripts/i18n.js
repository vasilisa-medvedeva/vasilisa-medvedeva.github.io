/* ── Language switch: English ⇄ Russian ─────────────────────────────────
   The English copy stays in the HTML, where it is the page's real content —
   crawlers, previews and a reader with JS off all still get a finished site.
   The Russian sits beside it in data-ru, and the switch swaps the two.

   Marking a page up:
     <p data-ru="Привет">Hi</p>              text (may contain HTML)
     <img data-ru-alt="Схема" alt="Diagram"> attributes: -alt, -aria, -title
     <title data-ru="…">…</title>            the tab, too

   The English is captured into data-en the first time an element is
   translated, so switching back needs no second copy in the markup. */
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
    '.site-header__link[href$=".pdf"]':          'Резюме',
    '.site-header__link[href^="mailto:"]':       'Почта'
  };
  /* case scaffolding repeats on every case page and inside every case */
  var LABELS = { 'Problem': 'Проблема', 'Solution': 'Решение', 'Outcome': 'Результат' };

  var CHROME_ARIA = {
    '.site-header__menu':  'Разделы сайта',
    '.site-header__links': 'Резюме и контакты'
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

  function apply(lang) {
    var ru = lang === 'ru';
    if (ru) loadFace();

    /* fold the shared header into the same data-ru mechanism, once */
    Object.keys(CHROME).forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el && el.dataset.ru === undefined) el.dataset.ru = CHROME[sel];
    });
    Object.keys(CHROME_ARIA).forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el && !el.hasAttribute('data-ru-aria')) el.setAttribute('data-ru-aria', CHROME_ARIA[sel]);
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
    box.innerHTML =
      '<button class="lang-switch__btn" type="button" data-lang="en" lang="en">EN</button>' +
      '<span class="lang-switch__rule" aria-hidden="true"></span>' +
      '<button class="lang-switch__btn" type="button" data-lang="ru" lang="ru">RU</button>';
    box.addEventListener('click', function (e) {
      var btn = e.target.closest('.lang-switch__btn');
      if (!btn) return;
      var next = btn.dataset.lang;
      remember(next);
      apply(next);
      /* the deck reports which language its readers actually pick */
      if (typeof window.track === 'function') window.track('lang_switch', { lang: next });
    });
    document.body.appendChild(box);
    apply(lang);
  }

  var lang = stored() === 'ru' ? 'ru' : 'en';   /* English is the default */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { mount(lang); });
  } else {
    mount(lang);
  }
})();
